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

const SOUND_FILES: Record<SoundEffect, string> = {
  click: '/sounds/click.mp3',
  move: '/sounds/move.mp3',
  capture: '/sounds/capture.mp3',
  check: '/sounds/check.mp3',
  checkmate: '/sounds/checkmate.mp3',
  wrong: '/sounds/wrong.mp3',
  correct: '/sounds/correct.mp3',
  applause: '/sounds/applause.mp3',
  victory: '/sounds/victory.mp3',
  countdown: '/sounds/countdown.mp3',
  pop: '/sounds/pop.mp3',
  swoosh: '/sounds/swoosh.mp3',
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
    const silent = new Howl({ src: ['/sounds/click.mp3'], volume: 0 });
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
