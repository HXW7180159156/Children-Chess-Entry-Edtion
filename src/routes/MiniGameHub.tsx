import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useProgressStore } from '../stores/useProgressStore'
import type { MiniGameConfig } from '../types/games'

const MINI_GAMES: MiniGameConfig[] = [
  { id: 'piece-catcher', title: '棋子接接乐', icon: '🎣', description: '棋子掉下来了！快点击正确的棋子', instructions: '只点提示的那种棋子！', timeLimit: 60, maxScore: 100, minStars: [20, 40, 60] },
  { id: 'square-smasher', title: '格子拍一拍', icon: '🔨', description: '打地鼠！拍打棋子出现的格子', instructions: '快速点击高亮的格子！', timeLimit: 45, maxScore: 100, minStars: [15, 30, 50] },
  { id: 'maze-runner', title: '迷宫骑士', icon: '🐴', description: '小马走L形，穿过棋盘', instructions: '用L形跳跃引导骑士到终点！', maxScore: 100, minStars: [30, 60, 80] },
  { id: 'pattern-matcher', title: '图案复刻', icon: '🎨', description: '照着样子摆棋子', instructions: '拖动棋子到正确的位置！', maxScore: 100, minStars: [25, 50, 75] },
  { id: 'capture-quest', title: '吃子任务', icon: '⚔️', description: '找到能吃的最值钱的棋子', instructions: '找到并吃掉最有价值的棋子！', timeLimit: 30, maxScore: 100, minStars: [20, 45, 70] },
];

export default function MiniGameHub() {
  const navigate = useNavigate();

  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const progressMap = useProgressStore((s) => s.progress);
  const activeProgress = activeProfileId ? progressMap[activeProfileId] : undefined;
  const highScores = activeProgress?.gameHighScores ?? {};

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-kids-text mb-4">🎮 趣味小游戏</h2>

      <div className="flex flex-col gap-4">
        {MINI_GAMES.map((game, i) => {
          const bestScore = highScores[game.id] ?? 0;
          return (
            <motion.button
              key={game.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => navigate(`/games/${game.id}`)}
              className="bg-white rounded-2xl p-5 shadow-md text-left flex items-center gap-4 active:scale-[0.98] transition-transform touch-target"
            >
              <div className="text-5xl shrink-0">{game.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-kids-text">{game.title}</h3>
                <p className="text-sm text-kids-text-light mt-0.5">{game.description}</p>
                {bestScore > 0 && (
                  <div className="flex items-center gap-1 mt-1.5 text-xs font-semibold text-kids-orange">
                    🏆 最高分: {bestScore}
                  </div>
                )}
              </div>
              <div className="text-2xl">▶️</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  )
}
