import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Lock } from 'lucide-react'
import { useProgressStore } from '../stores/useProgressStore'
import type { LessonChapter } from '../types/lessons'

const CHAPTERS: LessonChapter[] = [
  { id: 'chapter-01', title: '认识棋子', icon: '♟️', description: '认识6种棋子，它们长什么样子', difficulty: 1, steps: [] },
  { id: 'chapter-02', title: '认识棋盘', icon: '🏁', description: '8×8的格子，黑与白的王国', difficulty: 1, steps: [], requiredChapter: 'chapter-01' },
  { id: 'chapter-03', title: '小兵向前走', icon: '🚶', description: '小兵怎么走？只能向前！', difficulty: 1, steps: [], requiredChapter: 'chapter-02' },
  { id: 'chapter-04', title: '跳跃的小马', icon: '🐴', description: 'L形跳跃，好特别！', difficulty: 1, steps: [], requiredChapter: 'chapter-03' },
  { id: 'chapter-05', title: '斜线主教', icon: '⛪', description: '在斜线上跑来跑去', difficulty: 1, steps: [], requiredChapter: 'chapter-04' },
  { id: 'chapter-06', title: '直线城堡', icon: '🏰', description: '横着走，竖着走', difficulty: 1, steps: [], requiredChapter: 'chapter-05' },
  { id: 'chapter-07', title: '强大的皇后', icon: '👑', description: '皇后最厉害！', difficulty: 2, steps: [], requiredChapter: 'chapter-06' },
  { id: 'chapter-08', title: '保护国王', icon: '🛡️', description: '国王最重要', difficulty: 2, steps: [], requiredChapter: 'chapter-07' },
  { id: 'chapter-09', title: '小心—将军！', icon: '⚔️', description: '什么是将军？', difficulty: 2, steps: [], requiredChapter: 'chapter-08' },
  { id: 'chapter-10', title: '你赢了—将杀！', icon: '🎯', description: '把国王困住！', difficulty: 2, steps: [], requiredChapter: 'chapter-09' },
  { id: 'chapter-11', title: '吃掉棋子', icon: '🍽️', description: '攻击和保护棋子', difficulty: 2, steps: [], requiredChapter: 'chapter-10' },
  { id: 'chapter-12', title: '特殊技巧', icon: '✨', description: '王车易位、吃过路兵', difficulty: 3, steps: [], requiredChapter: 'chapter-11' },
];

export default function LessonList() {
  const navigate = useNavigate();

  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const progressMap = useProgressStore((s) => s.progress);
  const ensureProfile = useProgressStore((s) => s.ensureProfile);

  useEffect(() => {
    ensureProfile();
  }, []);

  const activeProgress = activeProfileId ? progressMap[activeProfileId] : undefined;
  const completedLessons = activeProgress?.completedLessons ?? [];
  const lessonStars = activeProgress?.lessonStars ?? {};

  const isUnlocked = (chapter: LessonChapter): boolean => {
    if (!chapter.requiredChapter) return true;
    return completedLessons.includes(chapter.requiredChapter);
  };

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-kids-text mb-4">📚 学习课程</h2>

      <div className="flex flex-col gap-3">
        {CHAPTERS.map((chapter, i) => {
          const unlocked = isUnlocked(chapter);
          const completed = completedLessons.includes(chapter.id);
          const stars = lessonStars[chapter.id] ?? 0;

          return (
            <motion.button
              key={chapter.id}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => unlocked && navigate(`/learn/${chapter.id}`)}
              disabled={!unlocked}
              className={`touch-target text-left p-4 rounded-2xl flex items-center gap-4 transition-all ${
                unlocked
                  ? 'bg-white shadow-md active:scale-[0.98]'
                  : 'bg-gray-100 opacity-60'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                completed ? 'bg-kids-green/20' :
                unlocked ? 'bg-kids-teal/20' : 'bg-gray-200'
              }`}>
                {completed ? '✅' : unlocked ? chapter.icon : <Lock size={24} className="text-gray-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-kids-text-light bg-kids-light/50 px-2 py-0.5 rounded-full">
                    第{i + 1}课
                  </span>
                  {chapter.difficulty === 1 && <span className="text-xs text-kids-green">★</span>}
                  {chapter.difficulty === 2 && <span className="text-xs text-kids-orange">★★</span>}
                  {chapter.difficulty === 3 && <span className="text-xs text-kids-coral">★★★</span>}
                </div>
                <h3 className="font-bold text-kids-text mt-1">{chapter.title}</h3>
                <p className="text-xs text-kids-text-light mt-0.5 truncate">{chapter.description}</p>
              </div>

              {completed && stars > 0 && (
                <div className="flex gap-0.5 shrink-0">
                  {[1, 2, 3].map((s) => (
                    <span key={s} className={`text-lg ${s <= stars ? '' : 'opacity-20'}`}>
                      ⭐
                    </span>
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  )
}
