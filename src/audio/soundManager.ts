import { Howl, Howler } from 'howler';

// Sound effect types
export type SoundEffect =
  | 'click'
  | 'move'
  | 'capture'
  | 'check'
  | 'checkmate'
  | 'wrong'
  | 'correct'
  | 'applause'
  | 'victory'
  | 'countdown'
  | 'pop'
  | 'swoosh';

const BASE_SOUND_PATH = `${import.meta.env.BASE_URL}sounds/`;

const SOUND_FILES: Record<SoundEffect, string> = {
  click: `${BASE_SOUND_PATH}click.mp3`,
  move: `${BASE_SOUND_PATH}move.mp3`,
  capture: `${BASE_SOUND_PATH}capture.mp3`,
  check: `${BASE_SOUND_PATH}check.mp3`,
  checkmate: `${BASE_SOUND_PATH}checkmate.mp3`,
  wrong: `${BASE_SOUND_PATH}wrong.mp3`,
  correct: `${BASE_SOUND_PATH}correct.mp3`,
  applause: `${BASE_SOUND_PATH}applause.mp3`,
  victory: `${BASE_SOUND_PATH}victory.mp3`,
  countdown: `${BASE_SOUND_PATH}countdown.mp3`,
  pop: `${BASE_SOUND_PATH}pop.mp3`,
  swoosh: `${BASE_SOUND_PATH}swoosh.mp3`,
};

class SoundManager {
  private sounds: Map<SoundEffect, Howl> = new Map();
  private enabled = true;
  private initialized = false;

  init() {
    if (this.initialized) return;

    for (const [key, path] of Object.entries(SOUND_FILES)) {
      const howl = new Howl({
        src: [path],
        volume: 0.5,
        preload: true,
        onloaderror: () => {
          console.warn(`Failed to load sound: ${key}`);
        },
      });
      this.sounds.set(key as SoundEffect, howl);
    }

    this.initialized = true;
  }

  /**
   * Unlock audio on mobile — must be called from a user gesture.
   */
  unlock() {
    Howler.ctx?.resume();
    // Play a silent sound to unlock audio context
    const silent = new Howl({ src: [SOUND_FILES.click], volume: 0 });
    silent.play();
    silent.once('end', () => silent.unload());
  }

  play(effect: SoundEffect) {
    if (!this.enabled) return;
    const sound = this.sounds.get(effect);
    if (sound) {
      sound.play();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    Howler.mute(!enabled);
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  destroy() {
    this.sounds.forEach((sound) => sound.unload());
    this.sounds.clear();
    this.initialized = false;
  }
}

// Singleton
export const soundManager = new SoundManager();
