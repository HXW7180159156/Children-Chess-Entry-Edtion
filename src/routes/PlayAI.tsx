import { useState, useEffect } from 'react'
import type { Square } from 'chess.js'
import { Chess } from 'chess.js'
import { motion } from 'motion/react'
import { Chessboard } from 'react-chessboard'
import { Brain, Lightbulb, RotateCcw, Flag } from 'lucide-react'
import { useGameStore } from '../stores/useGameStore'
import { useProgressStore } from '../stores/useProgressStore'
import { soundManager } from '../audio/soundManager'
import type { Difficulty, Player } from '../types/chess'

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; emoji: string }[] = [
  { value: 'beginner', label: '新手', emoji: '🐣' },
  { value: 'easy', label: '简单', emoji: '🐥' },
  { value: 'medium', label: '中等', emoji: '🐤' },
  { value: 'hard', label: '困难', emoji: '🦅' },
];

export default function PlayAI() {
  const {
    config, fen, status, isThinking, history, showPromotion,
    lastMove,
    newGame, makeMove, selectSquare,
    selectedSquare, legalMoves,
    requestHint, resign, undoLastMove, getGameOverMessage,
  } = useGameStore();

  const recordGameResult = useProgressStore((s) => s.recordGameResult);
  const checkStreak = useProgressStore((s) => s.checkStreak);

  const [setup, setSetup] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [playerColor, setPlayerColor] = useState<Player>('white');
  const [hint, setHint] = useState('');
  const [gameOverRecorded, setGameOverRecorded] = useState(false);

  // Record results when game ends
  useEffect(() => {
    if (status !== 'playing' && !gameOverRecorded && config) {
      const playerWon =
        (status === 'checkmate' && config.playerColor === 'white' && fen.split(' ')[1] === 'b') ||
        (status === 'checkmate' && config.playerColor === 'black' && fen.split(' ')[1] === 'w');
      recordGameResult(playerWon);
      checkStreak();
      setGameOverRecorded(true);

      if (playerWon) soundManager.play('victory');
      else soundManager.play('click');
    }
  }, [status, gameOverRecorded]);

  const handleStartGame = () => {
    setSetup(false);
    setGameOverRecorded(false);
    setHint('');
    newGame({ difficulty, playerColor });
    soundManager.play('click');
  };

  const handleSquareClick = ({ square }: { piece: { pieceType: string } | null; square: string }) => {
    if (showPromotion) return;
    selectSquare(square as Square);
    soundManager.play('click');
  };

  const handlePieceDrop = ({ sourceSquare, targetSquare }: { piece: { pieceType: string }; sourceSquare: string; targetSquare: string | null }) => {
    if (!targetSquare) return false;
    const success = makeMove(sourceSquare as Square, targetSquare as Square);
    if (success) {
      const chess = new Chess(fen);
      chess.move({ from: sourceSquare, to: targetSquare });
      if (chess.isCheckmate()) soundManager.play('checkmate');
      else if (chess.isCheck()) soundManager.play('check');
      else soundManager.play('move');
      return true;
    }
    soundManager.play('wrong');
    return false;
  };

  const handleShowHint = () => {
    const hintText = requestHint();
    setHint(hintText);
    setTimeout(() => setHint(''), 4000);
  };

  const handleNewGame = () => setSetup(true);

  // Setup screen
  if (setup) {
    return (
      <div className="flex flex-col items-center gap-6 pt-6">
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-kids-text"
        >
          ⚔️ 人机对弈
        </motion.h2>

        {/* Difficulty picker */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm"
        >
          <h3 className="text-lg font-bold text-kids-text mb-3">选择难度：</h3>
          <div className="grid grid-cols-2 gap-3">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDifficulty(opt.value)}
                className={`p-4 rounded-2xl text-center transition-all active:scale-95 touch-target ${
                  difficulty === opt.value
                    ? 'bg-kids-teal text-white shadow-lg scale-105'
                    : 'bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <div className="text-3xl mb-1">{opt.emoji}</div>
                <div className="font-bold">{opt.label}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Color picker */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm"
        >
          <h3 className="text-lg font-bold text-kids-text mb-3">选择颜色：</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setPlayerColor('white')}
              className={`flex-1 p-4 rounded-2xl text-center touch-target ${
                playerColor === 'white' ? 'bg-white ring-4 ring-kids-teal shadow-lg' : 'bg-gray-100'
              }`}
            >
              <div className="text-3xl mb-1">⬜</div>
              <div className="font-bold">白棋（先走）</div>
            </button>
            <button
              onClick={() => setPlayerColor('black')}
              className={`flex-1 p-4 rounded-2xl text-center touch-target ${
                playerColor === 'black' ? 'bg-gray-800 text-white ring-4 ring-kids-teal shadow-lg' : 'bg-gray-100'
              }`}
            >
              <div className="text-3xl mb-1">⬛</div>
              <div className="font-bold">黑棋</div>
            </button>
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleStartGame}
          className="bg-kids-coral text-white px-10 py-5 rounded-3xl font-bold text-xl shadow-xl active:scale-95 transition-transform touch-target"
        >
          🎮 开始对弈！
        </motion.button>
      </div>
    );
  }

  // Game board
  const playerTurn = config?.playerColor === fen.split(' ')[1];
  const gameOver = status !== 'playing';

  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      {/* Status bar */}
      <div className="flex items-center gap-3 w-full max-w-sm">
        <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${
          isThinking
            ? 'bg-kids-yellow/40 text-kids-text'
            : gameOver
              ? 'bg-kids-coral/20 text-kids-coral'
              : playerTurn
                ? 'bg-kids-green/20 text-kids-green'
                : 'bg-gray-200 text-kids-text-light'
        }`}>
          {isThinking ? '🤔 电脑思考中...' :
           gameOver ? getGameOverMessage() :
           playerTurn ? '轮到你了！' : '电脑走棋中...'}
        </div>
      </div>

      {/* Hint display */}
      {hint && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-kids-yellow/30 px-4 py-2 rounded-xl text-sm font-medium text-kids-text text-center max-w-sm"
        >
          💡 {hint}
        </motion.div>
      )}

      {/* Chess board */}
      <div className="flex justify-center">
        <Chessboard
          options={{
            id: 'play-chessboard',
            position: fen,
            boardOrientation: config?.playerColor ?? 'white',
            onPieceDrop: handlePieceDrop,
            onSquareClick: handleSquareClick,
            boardStyle: { borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
            darkSquareStyle: { backgroundColor: '#B58863' },
            lightSquareStyle: { backgroundColor: '#F0D9B5' },
            squareStyles: (() => {
              const styles: Record<string, React.CSSProperties> = {};
              if (selectedSquare) {
                styles[selectedSquare] = { backgroundColor: 'rgba(78, 205, 196, 0.5)' };
              }
              legalMoves.forEach((sq: string) => {
                styles[sq] = {
                  background: 'radial-gradient(circle, rgba(0,0,0,0.2) 25%, transparent 25%)',
                  borderRadius: '50%',
                } as React.CSSProperties;
              });
              if (lastMove) {
                styles[lastMove.from] = { backgroundColor: 'rgba(255, 230, 109, 0.4)' };
                styles[lastMove.to] = { backgroundColor: 'rgba(255, 230, 109, 0.4)' };
              }
              return styles;
            })(),
            animationDurationInMs: 300,
          }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={handleShowHint}
          disabled={gameOver || isThinking}
          className="touch-target w-14 h-14 rounded-2xl bg-kids-yellow flex items-center justify-center shadow-sm disabled:opacity-40 active:scale-90 transition-transform"
          aria-label="提示"
        >
          <Lightbulb size={28} className="text-kids-text" />
        </button>
        <button
          onClick={undoLastMove}
          disabled={history.length < 2 || gameOver || isThinking}
          className="touch-target w-14 h-14 rounded-2xl bg-kids-purple/20 flex items-center justify-center shadow-sm disabled:opacity-40 active:scale-90 transition-transform"
          aria-label="悔棋"
        >
          <RotateCcw size={28} className="text-kids-purple" />
        </button>
        <button
          onClick={resign}
          disabled={gameOver}
          className="touch-target w-14 h-14 rounded-2xl bg-kids-coral/20 flex items-center justify-center shadow-sm disabled:opacity-40 active:scale-90 transition-transform"
          aria-label="认输"
        >
          <Flag size={28} className="text-kids-coral" />
        </button>
        <button
          onClick={handleNewGame}
          className="touch-target w-14 h-14 rounded-2xl bg-kids-teal text-white flex items-center justify-center shadow-sm active:scale-90 transition-transform font-bold"
          aria-label="新游戏"
        >
          <span className="text-xl">🆕</span>
        </button>
      </div>

      {/* Captured pieces / score */}
      <div className="text-xs text-kids-text-light flex items-center gap-1">
        <Brain size={14} />
        难度：{DIFFICULTY_OPTIONS.find(o => o.value === config?.difficulty)?.label}
      </div>
    </div>
  )
}
