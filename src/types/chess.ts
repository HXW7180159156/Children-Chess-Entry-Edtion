// Chess game types
export type Player = 'white' | 'black';
export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard';
export type GameStatus = 'playing' | 'checkmate' | 'stalemate' | 'draw' | 'resigned';

export interface GameConfig {
  difficulty: Difficulty;
  playerColor: Player;
}

export interface GameResult {
  outcome: GameStatus;
  winner?: Player;
}

export interface AIMoveResult {
  from: string;
  to: string;
  promotion?: string;
  explanation?: string;
}
