import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type AppSettings, DEFAULT_SETTINGS } from '../types/settings';

interface SettingsStore extends AppSettings {
  update: (partial: Partial<AppSettings>) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      update: (partial) => set(partial),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'chess-kids-settings',
    },
  ),
);
