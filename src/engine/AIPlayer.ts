import { Chess, type Move } from 'chess.js';
import { evaluate } from './Evaluator';
import type { Difficulty } from '../types/chess';

interface DifficultyConfig {
  depth: number;
  noise: number; // centipawns of random noise added to evaluation
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  beginner: { depth: 1, noise: 400 },
  easy:     { depth: 1, noise: 150 },
  medium:   { depth: 2, noise: 50 },
  hard:     { depth: 3, noise: 10 },
};

function addNoise(score: number, noise: number): number {
  return score + (Math.random() - 0.5) * 2 * noise;
}

/**
 * Minimax with alpha-beta pruning.
 * Returns the best move and its evaluated score.
 */
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  noise: number,
): number {
  if (depth === 0 || chess.isGameOver()) {
    const rawScore = evaluate(chess);
    return addNoise(rawScore, noise);
  }

  const moves = chess.moves({ verbose: true });

  // Sort moves for better alpha-beta pruning: captures first
  moves.sort((a, b) => {
    if (a.captured && !b.captured) return -1;
    if (!a.captured && b.captured) return 1;
    return 0;
  });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move.san);
      const evalScore = minimax(chess, depth - 1, alpha, beta, false, noise);
      chess.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move.san);
      const evalScore = minimax(chess, depth - 1, alpha, beta, true, noise);
      chess.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Find the best move for the current position at the given difficulty.
 * Returns the move object and an optional child-friendly explanation.
 */
export function findBestMove(chess: Chess, difficulty: Difficulty): Move {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const isWhite = chess.turn() === 'w';
  const moves = chess.moves({ verbose: true });

  if (moves.length === 0) {
    throw new Error('No legal moves available');
  }

  if (moves.length === 1) {
    return moves[0];
  }

  let bestMove = moves[0];
  let bestScore = isWhite ? -Infinity : Infinity;

  // For beginner mode, add a small chance of truly random moves
  if (difficulty === 'beginner' && Math.random() < 0.15) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  for (const move of moves) {
    chess.move(move.san);
    const score = minimax(chess, config.depth - 1, -Infinity, Infinity, !isWhite, config.noise);
    chess.undo();

    if (isWhite) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

/**
 * Get a child-friendly hint for the current position.
 * Runs a shallow search, then classifies the best move.
 */
export function getHint(chess: Chess): string {
  const move = findBestMove(chess, 'easy');

  if (move.san.includes('#')) return '走这一步可以赢！将死对手！ 🎉';
  if (move.san.includes('+')) return '走这一步可以将军！ 👑';
  if (move.captured) {
    const pieceNames: Record<string, string> = { p: '兵', n: '马', b: '象', r: '车', q: '后', k: '王' };
    const captured = pieceNames[move.captured] || '棋子';
    return `试试吃掉那个${captured}！ ✨`;
  }
  if (move.san === 'O-O' || move.san === 'O-O-O') return '王车易位可以保护国王！ 🏰';
  if (move.promotion) return '小兵快跑到终点了！可以升变！ 🌟';

  return '想想下一步怎么走呢？ 🤔';
}

/**
 * Simulate a delay to feel more like a "thinking" opponent.
 */
export function getThinkTime(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'beginner': return 300 + Math.random() * 400;
    case 'easy':     return 400 + Math.random() * 500;
    case 'medium':   return 500 + Math.random() * 600;
    case 'hard':     return 600 + Math.random() * 800;
  }
}
