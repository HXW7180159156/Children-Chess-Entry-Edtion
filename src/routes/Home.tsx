import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { BookOpen, Swords, Gamepad2, Search } from 'lucide-react'
import { useProgressStore } from '../stores/useProgressStore'
import { getBeltLevel, BELT_NAMES } from '../types/progress'

const BELT_COLORS: Record<string, string> = {
  white: 'from-gray-200 to-gray-100',
  yellow: 'from-yellow-300 to-yellow-200',
  orange: 'from-orange-400 to-orange-300',
  green: 'from-green-400 to-green-300',
  blue: 'from-blue-400 to-blue-300',
  purple: 'from-purple-400 to-purple-300',
  red: 'from-red-400 to-red-300',
  brown: 'from-amber-700 to-amber-600',
  black: 'from-gray-800 to-gray-700',
  rainbow: 'from-pink-500 via-purple-500 to-blue-500',
};

export default function Home() {
  const navigate = useNavigate();

  // Use stable selectors directly on state, not getter methods
  const profiles = useProgressStore((s) => s.profiles);
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const progressMap = useProgressStore((s) => s.progress);
  const ensureProfile = useProgressStore((s) => s.ensureProfile);

  useEffect(() => {
    ensureProfile();
  }, []);

  const profile = profiles.find((p) => p.id === activeProfileId);
  const activeProgress = activeProfileId ? progressMap[activeProfileId] : undefined;
  const stars = activeProgress?.totalStars ?? 0;
  const streak = activeProgress?.streak ?? 0;
  const belt = getBeltLevel(stars);

  return (
    <div className="flex flex-col items-center justify-start pt-6 gap-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="text-6xl mb-2">{profile?.avatar ?? '👶'}</div>
        <h2 className="text-2xl font-bold text-kids-text">
          {profile?.name ?? '小棋手'}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r ${BELT_COLORS[belt] ?? 'from-gray-200'} text-sm font-bold shadow-sm`}>
            🥋 {BELT_NAMES[belt]}
          </div>
        </div>
        {streak >= 2 && (
          <div className="flex items-center justify-center gap-1 mt-1 text-kids-orange">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-semibold">连续 {streak} 天</span>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {[
          { label: '学习', sub: '认识棋子', icon: BookOpen, color: 'bg-kids-teal', path: '/learn' },
          { label: '对弈', sub: '来下一盘', icon: Swords, color: 'bg-kids-coral', path: '/play' },
          { label: '游戏', sub: '趣味玩法', icon: Gamepad2, color: 'bg-kids-purple', path: '/games' },
          { label: '提示', sub: '怎么办？', icon: Search, color: 'bg-kids-yellow', path: '/learn' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(item.path)}
              className={`${item.color} rounded-3xl p-6 flex flex-col items-center gap-3 shadow-lg active:scale-95 transition-transform touch-target`}
            >
              <Icon size={44} className="text-white" strokeWidth={2.5} />
              <div className="text-center">
                <div className="text-white font-bold text-lg leading-tight">{item.label}</div>
                <div className="text-white/80 text-sm">{item.sub}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-3 bg-white/70 rounded-2xl px-5 py-3 shadow-sm"
      >
        <span className="text-2xl">⭐</span>
        <span className="text-lg font-bold text-kids-text">{stars} 颗星</span>
      </motion.div>

      <p className="text-kids-text-light text-xs mt-auto pb-2">
        点击上方图标开始 👆
      </p>
    </div>
  )
}
