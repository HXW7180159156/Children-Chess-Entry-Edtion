import { motion } from 'motion/react'
import { useProgressStore } from '../stores/useProgressStore'
import { getBeltLevel, BELT_NAMES, starsToNextBelt } from '../types/progress'

export default function Progress() {
  const profiles = useProgressStore((s) => s.profiles);
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const progressMap = useProgressStore((s) => s.progress);
  const setActiveProfile = useProgressStore((s) => s.setActiveProfile);

  const activeProgress = activeProfileId ? progressMap[activeProfileId] : undefined;
  const stars = activeProgress?.totalStars ?? 0;
  const belt = getBeltLevel(stars);
  const starsNeeded = starsToNextBelt(stars);

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-kids-text mb-4">🏆 我的进度</h2>

      {profiles.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProfile(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold shrink-0 ${
                p.id === activeProfileId
                  ? 'bg-kids-teal text-white'
                  : 'bg-white text-kids-text'
              }`}
            >
              {p.avatar} {p.name}
            </button>
          ))}
        </div>
      )}

      {!activeProgress ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-lg text-kids-text">先在学习或对弈里玩一玩吧！</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">🥋</div>
              <div>
                <h3 className="text-lg font-bold text-kids-text">{BELT_NAMES[belt]}</h3>
                <p className="text-sm text-kids-text-light">
                  {starsNeeded > 0
                    ? `还需要 ${starsNeeded} 颗星到下一级`
                    : '已达到最高等级！🎉'}
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 bg-kids-light/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-kids-yellow to-kids-orange rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (stars / (stars + starsNeeded || 1)) * 100)}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 shadow-sm text-center">
              <div className="text-3xl mb-1">⭐</div>
              <div className="text-2xl font-bold text-kids-text">{stars}</div>
              <div className="text-sm text-kids-text-light">总星星</div>
            </motion.div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl p-5 shadow-sm text-center">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-2xl font-bold text-kids-text">{activeProgress.streak}</div>
              <div className="text-sm text-kids-text-light">连续天数</div>
            </motion.div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 shadow-sm text-center">
              <div className="text-3xl mb-1">📚</div>
              <div className="text-2xl font-bold text-kids-text">{activeProgress.completedLessons.length}/12</div>
              <div className="text-sm text-kids-text-light">完成课程</div>
            </motion.div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25 }} className="bg-white rounded-2xl p-5 shadow-sm text-center">
              <div className="text-3xl mb-1">⚔️</div>
              <div className="text-2xl font-bold text-kids-text">{activeProgress.gamesPlayed}</div>
              <div className="text-sm text-kids-text-light">对弈场数</div>
            </motion.div>
          </div>

          <div>
            <h3 className="font-bold text-kids-text mb-3">🏅 徽章</h3>
            <div className="flex flex-wrap gap-3">
              {activeProgress.badges.length === 0 && (
                <p className="text-sm text-kids-text-light">还没有徽章，去学习和对弈吧！</p>
              )}
              {activeProgress.badges.map((badgeId) => (
                <motion.div
                  key={badgeId}
                  initial={{ rotate: -10, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-14 h-14 rounded-2xl bg-kids-yellow/20 flex items-center justify-center text-2xl shadow-sm"
                  title={badgeId}
                >
                  {badgeId === 'first_lesson' && '📖'}
                  {badgeId === 'first_game' && '🎮'}
                  {badgeId === 'first_win' && '🏆'}
                  {badgeId === '10_wins' && '👑'}
                  {badgeId === 'all_lessons' && '🎓'}
                  {badgeId === 'streak_3' && '🔥'}
                  {badgeId === 'streak_7' && '💪'}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
