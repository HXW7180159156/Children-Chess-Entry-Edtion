import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, ChildProgress } from '../types/progress';
import { getBeltLevel } from '../types/progress';

interface ProgressState {
  profiles: Profile[];
  activeProfileId: string | null;
  progress: Record<string, ChildProgress>;

  createProfile: (name: string, avatar: string) => string;
  deleteProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;
  ensureProfile: () => void;
  completeLesson: (chapterId: string, stars: number, mistakes: number, hintsUsed: number) => void;
  recordGameResult: (won: boolean) => void;
  recordMiniGameScore: (gameId: string, score: number) => void;
  checkStreak: () => void;
}

function createDefaultProgress(profileId: string): ChildProgress {
  return {
    profileId,
    completedLessons: [],
    lessonStars: {},
    gameHighScores: {},
    badges: [],
    totalStars: 0,
    streak: 0,
    lastPlayedDate: '',
    gamesPlayed: 0,
    gamesWon: 0,
  };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,
      progress: {},

      ensureProfile: () => {
        const state = get();
        if (state.profiles.length === 0) {
          // Auto-create a default guest profile
          const id = crypto.randomUUID();
          set({
            profiles: [{ id, name: '小棋手', avatar: '👶', createdAt: new Date().toISOString() }],
            progress: { [id]: createDefaultProgress(id) },
            activeProfileId: id,
          });
        } else if (!state.activeProfileId || !state.profiles.find(p => p.id === state.activeProfileId)) {
          set({ activeProfileId: state.profiles[0].id });
        }
      },

      createProfile: (name, avatar) => {
        const id = crypto.randomUUID();
        set((state) => ({
          profiles: [...state.profiles, { id, name, avatar, createdAt: new Date().toISOString() }],
          progress: { ...state.progress, [id]: createDefaultProgress(id) },
          activeProfileId: state.activeProfileId ?? id,
        }));
        return id;
      },

      deleteProfile: (id) => {
        set((state) => {
          const newProfiles = state.profiles.filter((p) => p.id !== id);
          const newProgress = { ...state.progress };
          delete newProgress[id];
          return {
            profiles: newProfiles,
            progress: newProgress,
            activeProfileId: state.activeProfileId === id
              ? (newProfiles[0]?.id ?? null)
              : state.activeProfileId,
          };
        });
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),

      completeLesson: (chapterId, stars, _mistakes, _hintsUsed) => {
        set((state) => {
          if (!state.activeProfileId) return state;
          const prog = { ...state.progress[state.activeProfileId] };
          if (!prog) return state;

          const wasCompleted = prog.completedLessons.includes(chapterId);
          const oldStars = prog.lessonStars[chapterId] ?? 0;
          const newStars = wasCompleted ? Math.max(oldStars, stars) : stars;

          if (!wasCompleted) {
            prog.completedLessons = [...prog.completedLessons, chapterId];
          }
          prog.lessonStars = { ...prog.lessonStars, [chapterId]: newStars };
          prog.totalStars += wasCompleted ? Math.max(0, newStars - oldStars) : newStars;

          if (prog.completedLessons.length === 1 && !prog.badges.includes('first_lesson')) {
            prog.badges = [...prog.badges, 'first_lesson'];
          }
          if (prog.completedLessons.length === 12 && !prog.badges.includes('all_lessons')) {
            prog.badges = [...prog.badges, 'all_lessons'];
          }

          return { progress: { ...state.progress, [state.activeProfileId]: prog } };
        });
      },

      recordGameResult: (won) => {
        set((state) => {
          if (!state.activeProfileId) return state;
          const prog = { ...state.progress[state.activeProfileId] };
          if (!prog) return state;
          prog.gamesPlayed += 1;
          if (won) prog.gamesWon += 1;
          if (prog.gamesPlayed === 1 && !prog.badges.includes('first_game')) {
            prog.badges = [...prog.badges, 'first_game'];
          }
          if (prog.gamesWon === 1 && !prog.badges.includes('first_win')) {
            prog.badges = [...prog.badges, 'first_win'];
          }
          if (prog.gamesWon >= 10 && !prog.badges.includes('10_wins')) {
            prog.badges = [...prog.badges, '10_wins'];
          }
          return { progress: { ...state.progress, [state.activeProfileId]: prog } };
        });
      },

      recordMiniGameScore: (gameId, score) => {
        set((state) => {
          if (!state.activeProfileId) return state;
          const prog = { ...state.progress[state.activeProfileId] };
          if (!prog) return state;
          const oldHigh = prog.gameHighScores[gameId] ?? 0;
          if (score > oldHigh) {
            prog.gameHighScores = { ...prog.gameHighScores, [gameId]: score };
          }
          return { progress: { ...state.progress, [state.activeProfileId]: prog } };
        });
      },

      checkStreak: () => {
        set((state) => {
          if (!state.activeProfileId) return state;
          const prog = { ...state.progress[state.activeProfileId] };
          if (!prog) return state;

          const today = new Date().toISOString().split('T')[0];
          if (prog.lastPlayedDate === today) return state;

          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          if (prog.lastPlayedDate === yesterday) {
            prog.streak += 1;
          } else if (prog.lastPlayedDate !== today) {
            prog.streak = 1;
          }
          prog.lastPlayedDate = today;

          if (prog.streak >= 3 && !prog.badges.includes('streak_3')) {
            prog.badges = [...prog.badges, 'streak_3'];
          }
          if (prog.streak >= 7 && !prog.badges.includes('streak_7')) {
            prog.badges = [...prog.badges, 'streak_7'];
          }

          return { progress: { ...state.progress, [state.activeProfileId]: prog } };
        });
      },
    }),
    {
      name: 'chess-kids-progress',
    },
  ),
);

// === SELECTOR HELPERS ===
// Use these outside of components to avoid getter methods that break Zustand's caching.
// In components, use: useProgressStore((s) => s.xxx) directly on stored state fields.

export function getActiveProfile(state: ProgressState): Profile | undefined {
  if (!state.activeProfileId) return undefined;
  return state.profiles.find((p) => p.id === state.activeProfileId);
}

export function getActiveProgress(state: ProgressState): ChildProgress | undefined {
  if (!state.activeProfileId) return undefined;
  return state.progress[state.activeProfileId];
}

export function getActiveStars(state: ProgressState): number {
  return getActiveProgress(state)?.totalStars ?? 0;
}

export function getActiveBelt(state: ProgressState): string {
  return getBeltLevel(getActiveStars(state));
}
