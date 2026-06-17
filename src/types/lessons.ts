// Lesson system types
export type LessonActionType = 'move_piece' | 'tap_square' | 'tap_piece' | 'drag_piece' | 'choose_answer';

export interface LessonAction {
  type: LessonActionType;
  targetSquare?: string;       // e.g. 'e4' — the square to tap or move to
  targetPiece?: string;        // e.g. 'K' — piece type to identify
  fromSquare?: string;         // for drag/move actions
  options?: string[];          // for choose_answer
  correctOption?: string;
  instruction: string;         // child-friendly instruction, e.g. "点击皇后！"
}

export interface LessonAnimation {
  type: 'arrow' | 'highlight' | 'piece_glow' | 'move_demo' | 'capture_demo';
  squares?: string[];
  from?: string;
  to?: string;
  duration?: number;
}

export interface LessonStep {
  id: string;
  fen: string;
  narration: string;           // voice-over text
  highlights?: string[];       // squares to highlight
  arrows?: [string, string][]; // arrows to draw on board
  action?: LessonAction;       // what the child needs to do
  animation?: LessonAnimation;
  correctFeedback?: string;    // shown when child does the right thing
}

export interface LessonChapter {
  id: string;
  title: string;
  icon: string;                // emoji
  description: string;
  difficulty: 1 | 2 | 3;       // 1=easy 2=medium 3=hard
  requiredChapter?: string;    // prerequisite chapter id
  steps: LessonStep[];
}

export interface LessonCompletion {
  chapterId: string;
  stars: number;               // 1-3
  completedAt: string;         // ISO date
  mistakes: number;
  hintsUsed: number;
}
