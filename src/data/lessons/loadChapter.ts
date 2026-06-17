import type { LessonChapter } from '../../types/lessons';
import { chapter01 } from './chapter-01';
import { chapter02 } from './chapter-02';

// Quick chapter stubs for chapters 3-12 (filled with minimal content for now)
const chapterStubs: Record<string, LessonChapter> = {
  'chapter-03': {
    id: 'chapter-03', title: '小兵向前走', icon: '🚶', description: '小兵怎么走？只能向前！', difficulty: 1,
    steps: [{ id: 'c3s1', fen: '8/8/8/8/8/8/4P3/8 w - - 0 1', narration: '小兵只能向前走，每次走一格。但第一步可以走两格哦！看，e2的小兵可以走到e3或e4。', highlights: ['e2', 'e3', 'e4'] },
            { id: 'c3s2', fen: '8/8/8/8/8/8/PPP5/8 w - - 0 1', narration: '兵有很多！它们排成一行，一起向前推进。但请记住——兵不能后退！', highlights: ['a2', 'b2', 'c2'] }],
  },
  'chapter-04': {
    id: 'chapter-04', title: '跳跃的小马', icon: '🐴', description: 'L形跳跃，好特别！', difficulty: 1,
    steps: [{ id: 'c4s1', fen: '8/8/8/8/8/8/8/4N3 w - - 0 1', narration: '小马走"L"形——横两格竖一格，或者横一格竖两格。看，e1的马可以跳到这些位置！', highlights: ['c2', 'd3', 'f3', 'g2'] }],
  },
  'chapter-05': {
    id: 'chapter-05', title: '斜线主教', icon: '⛪', description: '在斜线上跑来跑去', difficulty: 1,
    steps: [{ id: 'c5s1', fen: '8/8/8/8/8/8/8/4B3 w - - 0 1', narration: '主教只能斜着走。想走多远都可以，但不能跳过棋子！', highlights: ['e1'], arrows: [['e1', 'h4'], ['e1', 'a5'], ['e1', 'b4'], ['e1', 'h1']] }],
  },
  'chapter-06': {
    id: 'chapter-06', title: '直线城堡', icon: '🏰', description: '横着走，竖着走', difficulty: 1,
    steps: [{ id: 'c6s1', fen: '8/8/8/8/8/8/8/4R3 w - - 0 1', narration: '城堡可以横着走或竖着走，想走多远都可以！但不能斜走也不能跳过棋子。', highlights: ['e1'], arrows: [['e1', 'e8'], ['e1', 'h1'], ['e1', 'a1']] }],
  },
  'chapter-07': {
    id: 'chapter-07', title: '强大的皇后', icon: '👑', description: '皇后最厉害！', difficulty: 2,
    steps: [{ id: 'c7s1', fen: '8/8/8/8/8/8/8/4Q3 w - - 0 1', narration: '皇后是棋盘上最强大的棋子！她可以横着走、竖着走、斜着走，想走多远都可以！', highlights: ['e1'], arrows: [['e1', 'e8'], ['e1', 'h1'], ['e1', 'a5'], ['e1', 'h4']] }],
  },
  'chapter-08': {
    id: 'chapter-08', title: '保护国王', icon: '🛡️', description: '国王最重要', difficulty: 2,
    steps: [{ id: 'c8s1', fen: '8/8/8/8/8/8/8/4K3 w - - 0 1', narration: '国王每次只能走一格，但可以向任何方向走。国王是整个游戏最重要的棋子——保护好国王！', highlights: ['e1', 'd1', 'd2', 'e2', 'f2', 'f1'] }],
  },
  'chapter-09': {
    id: 'chapter-09', title: '小心—将军！', icon: '⚔️', description: '什么是将军？', difficulty: 2,
    steps: [{ id: 'c9s1', fen: '6k1/8/6K1/8/8/8/8/6R1 w - - 0 1', narration: '当你的棋子能吃掉对方的国王时，你就"将军"了！对方必须把国王移走、挡住、或吃掉攻击的棋子。', highlights: ['g1', 'g8'], arrows: [['g1', 'g8']] }],
  },
  'chapter-10': {
    id: 'chapter-10', title: '你赢了—将杀！', icon: '🎯', description: '把国王困住！', difficulty: 2,
    steps: [{ id: 'c10s1', fen: '6rk/8/6RK/8/8/8/8/8 w - - 0 1', narration: '当国王被将军而且无处可逃时，就叫"将杀"。游戏结束，将军的一方赢了！', highlights: ['h6', 'h8'] }],
  },
  'chapter-11': {
    id: 'chapter-11', title: '吃掉棋子', icon: '🍽️', description: '攻击和保护棋子', difficulty: 2,
    steps: [{ id: 'c11s1', fen: '8/8/8/8/8/3p4/4P3/8 w - - 0 1', narration: '如果你的棋子能走到敌人棋子的位置，就可以把它"吃掉"！被吃的棋子离开棋盘。看，这个白兵可以吃掉黑兵。', highlights: ['e2', 'd3'], arrows: [['e2', 'd3']] }],
  },
  'chapter-12': {
    id: 'chapter-12', title: '特殊技巧', icon: '✨', description: '王车易位、吃过路兵', difficulty: 3,
    steps: [{ id: 'c12s1', fen: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1', narration: '王车易位是国王和车一起移动的特殊走法。每局只能做一次！国王移两格到车的方向，车跳到国王的另一侧。', highlights: ['e1', 'a1', 'h1'] }],
  },
};

const allChapters: LessonChapter[] = [chapter01, chapter02, ...Object.values(chapterStubs)];

// Set requiredChapter dependencies
chapterStubs['chapter-03'].requiredChapter = 'chapter-02';
chapterStubs['chapter-04'].requiredChapter = 'chapter-03';
chapterStubs['chapter-05'].requiredChapter = 'chapter-04';
chapterStubs['chapter-06'].requiredChapter = 'chapter-05';
chapterStubs['chapter-07'].requiredChapter = 'chapter-06';
chapterStubs['chapter-08'].requiredChapter = 'chapter-07';
chapterStubs['chapter-09'].requiredChapter = 'chapter-08';
chapterStubs['chapter-10'].requiredChapter = 'chapter-09';
chapterStubs['chapter-11'].requiredChapter = 'chapter-10';
chapterStubs['chapter-12'].requiredChapter = 'chapter-11';

export function loadChapter(id: string): LessonChapter | undefined {
  return allChapters.find((c) => c.id === id);
}

export function getAllChapters(): LessonChapter[] {
  return allChapters;
}
