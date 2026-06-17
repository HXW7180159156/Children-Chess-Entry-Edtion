import { create } from 'zustand';
import { Chess, type Move, type Square } from 'chess.js';
import type { Difficulty, GameConfig, GameStatus } from '../types/chess';
import { findBestMove, getHint, getThinkTime } from '../engine/AIPlayer';
import { evaluate } from '../engine/Evaluator';

interface GameState {
  // Game configuration
  config: GameConfig | null;
  chess: Chess;
  fen: string;
  history: Move[];
  status: GameStatus;
  isThinking: boolean;

  // UI state
  selectedSquare: Square | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  showPromotion: boolean;
  pendingPromotion: { from: Square; to: Square } | null;

  // Score
  score: number; // centipawns from player's perspective

  // Actions
  newGame: (config: GameConfig) => void;
  makeMove: (from: Square, to: Square, promotion?: string) => boolean;
  selectSquare: (square: Square) => void;
  clearSelection: () => void;
  requestHint: () => string;
  resign: () => void;
  undoLastMove: () => void;
  getGameOverMessage: () => string;
}

export const useGameStore = create<GameState>()((set, get) => ({
  config: null,
  chess: new Chess(),
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  history: [],
  status: 'playing',
  isThinking: false,
  selectedSquare: null,
  legalMoves: [],
  lastMove: null,
  showPromotion: false,
  pendingPromotion: null,
  score: 0,

  newGame: (config) => {
    const chess = new Chess();
    set({
      config,
      chess,
      fen: chess.fen(),
      history: [],
      status: 'playing',
      isThinking: false,
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
      showPromotion: false,
      pendingPromotion: null,
      score: 0,
    });

    // If player is black, AI moves first
    if (config.playerColor === 'black') {
      setTimeout(() => {
        makeAIMove(config.difficulty);
      }, 500);
    }
  },

  makeMove: (from, to, promotion) => {
    const state = get();
    if (state.status !== 'playing' || state.isThinking) return false;

    const playerColor = state.config?.playerColor;
    // Color is 'w'/'b', Player is 'white'/'black'
    if (state.config && (playerColor === 'white') !== (state.chess.turn() === 'w')) {
      // Not player's turn
      return false;
    }

    // Check for promotion
    const piece = state.chess.get(from);
    if (piece && piece.type === 'p') {
      const toRank = parseInt(to[1]);
      if (piece.color === 'w' && toRank === 8) {
        set({ showPromotion: true, pendingPromotion: { from, to } });
        return false;
      }
      if (piece.color === 'b' && toRank === 1) {
        set({ showPromotion: true, pendingPromotion: { from, to } });
        return false;
      }
    }

    try {
      const move = state.chess.move({ from, to, promotion: promotion || 'q' });
      if (!move) return false;

      const newHistory = [...state.history, move];
      set({
        fen: state.chess.fen(),
        history: newHistory,
        lastMove: { from, to },
        selectedSquare: null,
        legalMoves: [],
      });

      // Check game over
      const chess = state.chess;
      const newStatus = getGameStatus(chess);
      if (newStatus !== 'playing') {
        set({ status: newStatus, score: evaluate(chess) });
        return true;
      }

      // AI's turn
      if (state.config) {
        set({ isThinking: true });
        const thinkTime = getThinkTime(state.config.difficulty);
        setTimeout(() => {
          makeAIMove(state.config!.difficulty);
        }, thinkTime);
      }

      set({ score: evaluate(state.chess) });
      return true;
    } catch {
      return false;
    }
  },

  selectSquare: (square) => {
    const state = get();
    if (state.status !== 'playing' || state.isThinking) return;

    if (state.showPromotion) {
      // During promotion, ignore square selection
      return;
    }

    const piece = state.chess.get(square);
    const selected = state.selectedSquare;

    if (selected) {
      // Try to move from selected to this square
      state.makeMove(selected, square);
    } else if (piece && piece.color === state.chess.turn() &&
               (!state.config || piece.color === (state.config.playerColor === 'white' ? 'w' : 'b'))) {
      // Select a player piece
      const moves = state.chess.moves({ square, verbose: true });
      set({
        selectedSquare: square,
        legalMoves: moves.map((m) => m.to),
      });
    }
  },

  clearSelection: () => set({ selectedSquare: null, legalMoves: [] }),

  requestHint: () => {
    const state = get();
    return getHint(state.chess);
  },

  resign: () => {
    set({ status: 'resigned' });
  },

  undoLastMove: () => {
    const state = get();
    if (state.history.length < 2) return; // need both player and AI move to undo

    // Undo AI move and player move
    state.chess.undo(); // undo AI
    state.chess.undo(); // undo player
    const newHistory = state.history.slice(0, -2);
    set({
      fen: state.chess.fen(),
      history: newHistory,
      lastMove: null,
      status: 'playing',
      score: evaluate(state.chess),
    });
  },

  getGameOverMessage: () => {
    const state = get();
    const playerColor = state.config?.playerColor;
    switch (state.status) {
      case 'checkmate': {
        const winner = state.chess.turn() === 'w' ? 'black' : 'white';
        return winner === playerColor ? '🎉 太棒了！你赢了！' : '😊 再试一次吧！';
      }
      case 'stalemate':
        return '🤝 和棋！';
      case 'draw':
        return '🤝 平局！';
      case 'resigned':
        return '👋 游戏结束';
      default:
        return '';
    }
  },
}));

function getGameStatus(chess: Chess): GameStatus {
  if (chess.isCheckmate()) return 'checkmate';
  if (chess.isStalemate()) return 'stalemate';
  if (chess.isDraw()) return 'draw';
  return 'playing';
}

/**
 * Internal function to make an AI move (exposed via store's state update).
 */
function makeAIMove(difficulty: Difficulty) {
  const state = useGameStore.getState();
  if (state.status !== 'playing') {
    setImmediateState({ isThinking: false });
    return;
  }

  try {
    const move = findBestMove(state.chess, difficulty);
    state.chess.move(move.san);

    const newHistory = [...state.history, move];
    setImmediateState({
      fen: state.chess.fen(),
      history: newHistory,
      lastMove: { from: move.from, to: move.to },
      isThinking: false,
    });

    // Check game over after AI move
    const newStatus = getGameStatus(state.chess);
    if (newStatus !== 'playing') {
      setImmediateState({ status: newStatus, score: evaluate(state.chess) });
    } else {
      setImmediateState({ score: evaluate(state.chess) });
    }
  } catch {
    setImmediateState({ isThinking: false });
  }
}

function setImmediateState(partial: Partial<ReturnType<typeof useGameStore.getState>>) {
  useGameStore.setState(partial);
}
