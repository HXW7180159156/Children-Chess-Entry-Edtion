import { create } from 'zustand';
import type { LessonChapter, LessonStep } from '../types/lessons';

interface LessonState {
  currentChapter: LessonChapter | null;
  currentStepIndex: number;
  isPlaying: boolean;
  mistakes: number;
  hintsUsed: number;

  // Actions
  startChapter: (chapter: LessonChapter) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  recordMistake: () => void;
  recordHint: () => void;
  complete: () => { stars: number; mistakes: number; hintsUsed: number };
  reset: () => void;
  getCurrentStep: () => LessonStep | null;
  getProgress: () => number; // 0-1
}

export const useLessonStore = create<LessonState>()((set, get) => ({
  currentChapter: null,
  currentStepIndex: 0,
  isPlaying: false,
  mistakes: 0,
  hintsUsed: 0,

  startChapter: (chapter) => set({
    currentChapter: chapter,
    currentStepIndex: 0,
    isPlaying: true,
    mistakes: 0,
    hintsUsed: 0,
  }),

  nextStep: () => {
    const state = get();
    if (!state.currentChapter) return;
    const maxIdx = state.currentChapter.steps.length - 1;
    if (state.currentStepIndex < maxIdx) {
      set({ currentStepIndex: state.currentStepIndex + 1 });
    }
  },

  prevStep: () => {
    const state = get();
    if (state.currentStepIndex > 0) {
      set({ currentStepIndex: state.currentStepIndex - 1 });
    }
  },

  goToStep: (index) => set({ currentStepIndex: index }),

  recordMistake: () => set((s) => ({ mistakes: s.mistakes + 1 })),

  recordHint: () => set((s) => ({ hintsUsed: s.hintsUsed + 1 })),

  complete: () => {
    const state = get();
    const totalSteps = state.currentChapter?.steps.length ?? 1;
    const accuracy = 1 - state.mistakes / Math.max(totalSteps, 1);

    let stars: number;
    if (accuracy >= 0.95 && state.hintsUsed === 0) stars = 3;
    else if (accuracy >= 0.75) stars = 2;
    else stars = 1;

    return { stars, mistakes: state.mistakes, hintsUsed: state.hintsUsed };
  },

  reset: () => set({
    currentChapter: null,
    currentStepIndex: 0,
    isPlaying: false,
    mistakes: 0,
    hintsUsed: 0,
  }),

  getCurrentStep: () => {
    const state = get();
    if (!state.currentChapter) return null;
    return state.currentChapter.steps[state.currentStepIndex] ?? null;
  },

  getProgress: () => {
    const state = get();
    if (!state.currentChapter) return 0;
    return (state.currentStepIndex + 1) / state.currentChapter.steps.length;
  },
}));
