// Progress & profile types
export interface Profile {
  id: string;
  name: string;
  avatar: string;       // emoji
  createdAt: string;    // ISO date
}

export type BadgeCategory = 'learning' | 'playing' | 'games' | 'streak';

export interface Badge {
  id: string;
  name: string;
  icon: string;         // emoji
  description: string;
  category: BadgeCategory;
}

export interface ChildProgress {
  profileId: string;
  completedLessons: string[];                // chapter IDs
  lessonStars: Record<string, number>;       // chapterId -> 1-3 stars
  gameHighScores: Record<string, number>;    // gameId -> best score
  badges: string[];                          // badge IDs earned
  totalStars: number;
  streak: number;                            // consecutive days played
  lastPlayedDate: string;                    // ISO date (for streak calc)
  gamesPlayed: number;
  gamesWon: number;
}

export type BeltLevel = 'white' | 'yellow' | 'orange' | 'green' | 'blue' | 'purple' | 'red' | 'brown' | 'black' | 'rainbow';

export const BELT_THRESHOLDS: Record<BeltLevel, number> = {
  white: 0,
  yellow: 5,
  orange: 15,
  green: 30,
  blue: 50,
  purple: 75,
  red: 100,
  brown: 140,
  black: 200,
  rainbow: 300,
};

export const BELT_NAMES: Record<BeltLevel, string> = {
  white: '白带',
  yellow: '黄带',
  orange: '橙带',
  green: '绿带',
  blue: '蓝带',
  purple: '紫带',
  red: '红带',
  brown: '棕带',
  black: '黑带',
  rainbow: '彩虹带',
};

export function getBeltLevel(totalStars: number): BeltLevel {
  const levels: BeltLevel[] = ['white', 'yellow', 'orange', 'green', 'blue', 'purple', 'red', 'brown', 'black', 'rainbow'];
  let current: BeltLevel = 'white';
  for (const level of levels) {
    if (totalStars >= BELT_THRESHOLDS[level]) {
      current = level;
    }
  }
  return current;
}

export function starsToNextBelt(totalStars: number): number {
  const currentBelt = getBeltLevel(totalStars);
  const levels: BeltLevel[] = ['white', 'yellow', 'orange', 'green', 'blue', 'purple', 'red', 'brown', 'black', 'rainbow'];
  const idx = levels.indexOf(currentBelt);
  if (idx >= levels.length - 1) return 0; // max level
  const nextLevel = levels[idx + 1];
  return BELT_THRESHOLDS[nextLevel] - totalStars;
}
