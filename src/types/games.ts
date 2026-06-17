// Mini-game types
export type GameMode = 'ready' | 'playing' | 'paused' | 'complete';

export interface MiniGameConfig {
  id: string;
  title: string;
  icon: string;          // emoji
  description: string;
  instructions: string;
  timeLimit?: number;    // seconds, undefined = no timer
  maxScore: number;
  minStars: number[];    // [1-star threshold, 2-star threshold, 3-star threshold]
}

export interface MiniGameResult {
  gameId: string;
  score: number;
  stars: number;
  date: string;
  playTime: number;     // seconds
}

export interface MiniGameState {
  mode: GameMode;
  score: number;
  timeLeft: number;
  combo: number;
  maxCombo: number;
  mistakes: number;
}
