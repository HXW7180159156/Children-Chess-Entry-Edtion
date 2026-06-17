import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback, useMemo, Component } from 'react'
import { motion } from 'motion/react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Chessboard } from 'react-chessboard'
import { useProgressStore } from '../stores/useProgressStore'
import { soundManager } from '../audio/soundManager'
import { formatTime } from '../utils/misc'
import type { GameMode } from '../types/games'

interface GameConfig {
  id: string;
  title: string;
  icon: string;
  instructions: string;
  timeLimit?: number;
  maxScore: number;
  minStars: number[];
}

const GAME_CONFIGS: Record<string, GameConfig> = {
  'piece-catcher':  { id: 'piece-catcher',  title: '棋子接接乐', icon: '🎣', instructions: '只点提示的那种棋子！点击正确的棋子得分！', timeLimit: 60, maxScore: 100, minStars: [20, 40, 60] },
  'square-smasher': { id: 'square-smasher', title: '格子拍一拍', icon: '🔨', instructions: '快速点击高亮的格子！越快越好！',              timeLimit: 45, maxScore: 100, minStars: [15, 30, 50] },
  'maze-runner':    { id: 'maze-runner',    title: '迷宫骑士', icon: '🐴', instructions: '点击棋盘上的任意格子来得分！',                              maxScore: 100, minStars: [30, 60, 80] },
  'pattern-matcher':{ id: 'pattern-matcher',title: '图案复刻', icon: '🎨', instructions: '点击格子匹配目标图案！',                                      maxScore: 100, minStars: [25, 50, 75] },
  'capture-quest':  { id: 'capture-quest',  title: '吃子任务', icon: '⚔️', instructions: '找到并点击最有价值的棋子！',                timeLimit: 30, maxScore: 100, minStars: [20, 45, 70] },
};

const EMPTY_BOARD_STYLE = { borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' };
const DARK_SQUARE = { backgroundColor: '#B58863' };
const LIGHT_SQUARE = { backgroundColor: '#F0D9B5' };

function safePlay(effect: Parameters<typeof soundManager.play>[0]) {
  try { soundManager.play(effect); } catch { /* ignore audio errors */ }
}

// Error boundary to catch and log React errors
class ErrorBoundary extends Component<{ children: React.ReactNode; onError?: (e: Error) => void }, { hasError: boolean; error: string }> {
  constructor(props: { children: React.ReactNode; onError?: (e: Error) => void }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('MiniGamePlayer Error:', error.message, info.componentStack?.substring(0, 200));
    this.props.onError?.(error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
          <div className="text-6xl">😅</div>
          <p className="text-kids-text font-medium text-center">出了点问题</p>
          <p className="text-xs text-kids-text-light text-center">{this.state.error}</p>
          <button onClick={() => this.setState({ hasError: false, error: '' })} className="bg-kids-coral text-white px-6 py-3 rounded-2xl font-bold text-lg">
            再试一次
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function MiniGamePlayer() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const config = gameId ? GAME_CONFIGS[gameId] : null;

  const recordMiniGameScore = useProgressStore((s) => s.recordMiniGameScore);

  const [mode, setMode] = useState<GameMode>('ready');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [combo, setCombo] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const scoreRef = useRef(score);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const startGame = useCallback(() => {
    if (!config) return;
    setScore(0);
    setCombo(0);
    setTimeLeft(config.timeLimit ?? 0);
    setMode('playing');
  }, [config]);

  const endGame = useCallback(() => {
    setMode('complete');
    safePlay('applause');
    if (config) {
      recordMiniGameScore(config.id, scoreRef.current);
    }
  }, [config, recordMiniGameScore]);

  // Timer
  useEffect(() => {
    if (mode !== 'playing' || !config?.timeLimit) return;
    setTimeLeft(config.timeLimit);
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(id);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [mode, config?.timeLimit]);

  // End game when timer reaches 0
  useEffect(() => {
    if (mode === 'playing' && config?.timeLimit && timeLeft <= 0) {
      endGame();
    }
  }, [timeLeft, mode, config?.timeLimit, endGame]);

  const handleCorrect = useCallback(() => {
    setCombo((c) => {
      const newC = c + 1;
      const bonus = Math.min(newC, 5) * 2;
      setScore((s) => Math.min(s + 10 + bonus, config?.maxScore ?? 100));
      return newC;
    });
    safePlay('correct');
  }, [config?.maxScore]);

  const handleError = useCallback((e: Error) => {
    setErrorMsg(e.message);
    setMode('ready');
  }, []);

  const boardOptions = useMemo(() => ({
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' as const,
    boardStyle: EMPTY_BOARD_STYLE,
    darkSquareStyle: DARK_SQUARE,
    lightSquareStyle: LIGHT_SQUARE,
    allowDragging: false,
    onSquareClick: handleCorrect,
  }), [handleCorrect]);

  // Not found
  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-6xl">🤷</div>
        <p className="text-kids-text">找不到这个游戏</p>
        <button onClick={() => navigate('/games')} className="bg-kids-teal text-white px-6 py-3 rounded-2xl font-bold text-lg">
          回到游戏
        </button>
      </div>
    );
  }

  const stars = config.minStars.filter((t) => score >= t).length;

  // Complete screen
  if (mode === 'complete') {
    return (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className="flex flex-col items-center justify-center h-full gap-6">
        <div className="text-7xl">🎉</div>
        <h2 className="text-2xl font-bold text-kids-text">游戏结束！</h2>
        <div className="text-3xl font-bold text-kids-text">⭐ {score} 分</div>
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <span key={s} className={`text-3xl ${s <= stars ? 'animate-bounce' : 'opacity-20'}`}>⭐</span>
          ))}
        </div>
        <div className="flex gap-4">
          <button onClick={startGame} className="bg-kids-teal text-white px-8 py-4 rounded-2xl font-bold text-lg active:scale-95 transition-transform flex items-center gap-2 touch-target">
            <RotateCcw size={20} /> 再玩一次
          </button>
          <button onClick={() => navigate('/games')} className="bg-white text-kids-text px-8 py-4 rounded-2xl font-bold text-lg active:scale-95 transition-transform touch-target shadow-sm">
            更多游戏
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <ErrorBoundary onError={handleError}>
      {/* Paused screen */}
      {mode === 'paused' && (
        <div className="h-full flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-kids-text">⏸️ 暂停</h2>
            <div className="text-lg text-kids-text">当前分数：⭐ {score}</div>
            <button onClick={() => setMode('playing')} className="bg-kids-teal text-white px-8 py-4 rounded-2xl font-bold text-lg active:scale-95 transition-transform flex items-center gap-2 touch-target">
              <Play size={24} fill="currentColor" /> 继续游戏
            </button>
            <button onClick={() => navigate('/games')} className="text-kids-text-light text-sm">退出游戏</button>
          </div>
        </div>
      )}

      {/* Playing screen */}
      {mode === 'playing' && (
        <div className="flex flex-col items-center gap-4 py-4 h-full">
          <div className="flex items-center gap-4 w-full max-w-sm">
            <button onClick={() => setMode('paused')} className="text-kids-text-light">← 返回</button>
            <h2 className="text-xl font-bold text-kids-text flex-1">{config.icon} {config.title}</h2>
            {config.timeLimit && (
              <div className={`text-lg font-bold ${timeLeft <= 10 ? 'text-kids-coral animate-pulse' : 'text-kids-text'}`}>
                {formatTime(timeLeft)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl px-4 py-2 shadow-sm font-bold text-kids-text">⭐ {score}</div>
            {combo > 1 && <div className="bg-kids-orange/20 rounded-xl px-4 py-2 text-kids-orange font-bold text-sm">🔥 x{combo}</div>}
          </div>

          <p className="text-sm text-kids-text-light text-center max-w-xs bg-kids-yellow/20 rounded-xl px-4 py-2">💡 {config.instructions}</p>

          <div className="flex justify-center">
            <Chessboard key="minigame-board" options={boardOptions} />
          </div>

          <button onClick={() => setMode('paused')} className="touch-target w-14 h-14 rounded-full bg-white/70 shadow-md flex items-center justify-center active:scale-90 transition-transform">
            <Pause size={24} className="text-kids-text" />
          </button>
        </div>
      )}

      {/* Ready screen */}
      {mode === 'ready' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 pt-8">
          <div className="text-7xl">{config.icon}</div>
          <h2 className="text-2xl font-bold text-kids-text">{config.title}</h2>
          <p className="text-kids-text-light text-center max-w-xs">{config.instructions}</p>
          {config.timeLimit && <p className="text-sm text-kids-text-light">⏱️ 时间限制: {config.timeLimit}秒</p>}
          {errorMsg && <p className="text-xs text-kids-coral bg-kids-coral/10 rounded-xl px-4 py-2">{errorMsg}</p>}
          <button onClick={startGame} className="bg-kids-coral text-white px-10 py-5 rounded-3xl font-bold text-xl shadow-xl active:scale-95 transition-transform flex items-center gap-3 touch-target">
            <Play size={28} fill="currentColor" /> 开始！
          </button>
        </motion.div>
      )}
    </ErrorBoundary>
  );
}
