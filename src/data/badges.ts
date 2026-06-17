import type { Badge } from '../types/progress';

export const BADGES: Badge[] = [
  // Learning badges
  { id: 'first_lesson', name: '第一课', icon: '📖', description: '完成第一堂课', category: 'learning' },
  { id: '5_lessons', name: '小学者', icon: '🎒', description: '完成5堂课', category: 'learning' },
  { id: 'all_lessons', name: '毕业啦', icon: '🎓', description: '完成全部12堂课', category: 'learning' },
  { id: 'perfect_3', name: '完美3课', icon: '✨', description: '3堂课获得3颗星', category: 'learning' },
  { id: 'perfect_6', name: '完美6课', icon: '🌟', description: '6堂课获得3颗星', category: 'learning' },

  // Playing badges
  { id: 'first_game', name: '初次对弈', icon: '🎮', description: '完成第一局对弈', category: 'playing' },
  { id: 'first_win', name: '首胜', icon: '🏆', description: '第一次赢了AI', category: 'playing' },
  { id: '5_wins', name: '五连胜', icon: '🥇', description: '赢了AI 5次', category: 'playing' },
  { id: '10_wins', name: '十胜将军', icon: '👑', description: '赢了AI 10次', category: 'playing' },
  { id: 'beat_hard', name: '挑战者', icon: '⚔️', description: '在困难难度下赢了AI', category: 'playing' },

  // Game badges
  { id: 'game_score_50', name: '游戏高手', icon: '🎯', description: '小游戏得分超过50', category: 'games' },
  { id: 'game_perfect', name: '满分', icon: '💎', description: '小游戏获得满分', category: 'games' },
  { id: 'all_games', name: '全能玩家', icon: '🃏', description: '玩过所有5个小游戏', category: 'games' },

  // Streak badges
  { id: 'streak_3', name: '三天坚持', icon: '🔥', description: '连续玩3天', category: 'streak' },
  { id: 'streak_7', name: '一周冠军', icon: '💪', description: '连续玩7天', category: 'streak' },
  { id: 'streak_30', name: '月度之星', icon: '🌙', description: '连续玩30天', category: 'streak' },
];
