// App settings types
export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  activeProfileId: string | null;
  language: 'zh' | 'en';
  fontSize: 'normal' | 'large';
}

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  musicEnabled: true,
  highContrast: false,
  reduceMotion: false,
  activeProfileId: null,
  language: 'zh',
  fontSize: 'normal',
};
