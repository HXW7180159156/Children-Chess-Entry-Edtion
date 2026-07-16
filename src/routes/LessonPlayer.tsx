import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useLessonStore } from '../stores/useLessonStore'
import { useProgressStore } from '../stores/useProgressStore'
import { loadChapter } from '../data/lessons/loadChapter'
import { soundManager } from '../audio/soundManager'
import { useBoardSize } from '../utils/useBoardSize'

export default function LessonPlayer() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const [complete, setCompleteState] = useState(false);
  const chapter = useMemo(() => (chapterId ? loadChapter(chapterId) : null), [chapterId]);

  const {
    currentChapter, currentStepIndex,
    startChapter, nextStep, prevStep,
    recordHint, complete: finishLesson, getCurrentStep, getProgress,
  } = useLessonStore();

  const completeLesson = useProgressStore((s) => s.completeLesson);
  const boardSize = useBoardSize();

  useEffect(() => {
    if (chapter) {
      startChapter(chapter);
    }
  }, [chapter, startChapter]);

  const handleComplete = () => {
    const result = finishLesson();
    if (chapterId) {
      completeLesson(chapterId, result.stars, result.mistakes, result.hintsUsed);
    }
    soundManager.play('applause');
    setCompleteState(true);
  };

  if (!currentChapter) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-6xl">😅</div>
        <p className="text-kids-text">找不到这堂课</p>
        <button onClick={() => navigate('/learn')} className="bg-kids-teal text-white px-6 py-3 rounded-2xl font-bold text-lg">
          回到课程
        </button>
      </div>
    );
  }

  if (complete) {
    const result = finishLesson();
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="text-center"
        >
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-kids-text">太棒了！</h2>
          <p className="text-kids-text-light mt-2">你完成了「{currentChapter.title}」</p>
          <div className="flex gap-1 justify-center mt-3">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`text-3xl ${s <= result.stars ? 'animate-bounce' : 'opacity-20'}`}>
                ⭐
              </span>
            ))}
          </div>
        </motion.div>
        <button
          onClick={() => navigate('/learn')}
          className="bg-kids-coral text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform touch-target"
        >
          📚 继续学习
        </button>
      </div>
    );
  }

  const step = getCurrentStep();
  const progress = getProgress();
  const totalSteps = currentChapter.steps.length;

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="flex items-center gap-3 py-3">
        <button onClick={prevStep} disabled={currentStepIndex === 0} className="touch-target w-10 h-10 flex items-center justify-center rounded-full disabled:opacity-30">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 h-3 bg-kids-light/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-kids-teal rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm font-bold text-kids-text-light">{currentStepIndex + 1}/{totalSteps}</span>
      </div>

      {/* Chess board */}
      <div style={{ width: boardSize }} className="mx-auto">
        <Chessboard
          options={{
            position: step?.fen ?? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            boardStyle: { borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
            darkSquareStyle: { backgroundColor: '#B58863' },
            lightSquareStyle: { backgroundColor: '#F0D9B5' },
            allowDragging: false,
            animationDurationInMs: 300,
            arrows: step?.arrows?.map(([from, to]) => ({ startSquare: from, endSquare: to, color: '#FF6B6B' })) ?? [],
            squareStyles: (() => {
              const styles: Record<string, React.CSSProperties> = {};
              step?.highlights?.forEach((sq) => {
                styles[sq] = { backgroundColor: 'rgba(255, 230, 109, 0.6)' };
              });
              return styles;
            })(),
          }}
        />
      </div>

      {/* Narration */}
      <motion.div
        key={step?.id}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-4 bg-white rounded-2xl p-4 shadow-sm"
      >
        <div className="text-lg font-semibold text-kids-text flex items-start gap-2">
          <span className="text-2xl">🗣️</span>
          <span>{step?.narration}</span>
        </div>

        {step?.action && (
          <div className="mt-3 bg-kids-yellow/30 rounded-xl p-3 flex items-center gap-2">
            <span className="text-xl">👆</span>
            <span className="text-sm font-medium text-kids-text">{step.action.instruction}</span>
          </div>
        )}
      </motion.div>

      {/* Navigation / Complete */}
      <div className="mt-auto pt-4 flex justify-between">
        <button
          onClick={() => recordHint()}
          className="px-4 py-3 rounded-2xl bg-kids-yellow/60 text-kids-text font-semibold active:scale-95 transition-transform touch-target"
        >
          💡 提示
        </button>

        {currentStepIndex < totalSteps - 1 ? (
          <button
            onClick={() => {
              soundManager.play('correct');
              nextStep();
            }}
            className="px-6 py-3 rounded-2xl bg-kids-teal text-white font-bold text-lg flex items-center gap-2 active:scale-95 transition-transform touch-target"
          >
            下一步 <ChevronRight size={22} />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="px-6 py-3 rounded-2xl bg-kids-green text-white font-bold text-lg flex items-center gap-2 active:scale-95 transition-transform touch-target"
          >
            完成 <Check size={22} />
          </button>
        )}
      </div>
    </div>
  )
}
