declare module 'howler' {
  interface HowlOptions {
    src: string[];
    volume?: number;
    preload?: boolean;
    onloaderror?: () => void;
  }

  export class Howl {
    constructor(options: HowlOptions);
    play(): void;
    once(event: string, callback: () => void): void;
    unload(): void;
  }

  export const Howler: {
    ctx?: {
      resume(): Promise<void>;
    };
    mute(muted: boolean): void;
  };
}
