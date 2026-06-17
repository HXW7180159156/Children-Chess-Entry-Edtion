import type { LessonChapter } from '../../types/lessons';

// Chapter 1: Meet the Pieces
export const chapter01: LessonChapter = {
  id: 'chapter-01',
  title: '认识棋子',
  icon: '♟️',
  description: '认识6种棋子，它们长什么样子',
  difficulty: 1,
  steps: [
    {
      id: 'c1s1',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      narration: '欢迎来到国际象棋的世界！这是一个棋盘，上面有很多棋子。你看，两边的棋子像不像两支军队？',
      highlights: ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
    },
    {
      id: 'c1s2',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      narration: '棋盘上有6种不同的棋子。每一种都有独特的走法和本领！',
      highlights: ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'],
    },
    {
      id: 'c1s3',
      fen: '8/8/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1',
      narration: '看最前面一排这些小个子，它们叫"兵"。兵是最多的棋子，每边有8个！',
      highlights: ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
      action: { type: 'tap_piece', targetPiece: 'P', instruction: '点击任意一个小兵！' },
    },
    {
      id: 'c1s4',
      fen: '8/8/8/8/8/8/8/RN2KBNR w - - 0 1',
      narration: '看角落里这两个，像不像小马？它们叫"马"或者"骑士"。',
      highlights: ['b1', 'g1'],
      action: { type: 'tap_piece', targetPiece: 'N', instruction: '点击小马！🐴' },
    },
    {
      id: 'c1s5',
      fen: '8/8/8/8/8/8/8/R1BQKBNR w - - 0 1',
      narration: '小马旁边这两个尖顶帽子，叫"象"。它们只能在斜线上走。',
      highlights: ['c1', 'f1'],
      action: { type: 'tap_piece', targetPiece: 'B', instruction: '点击大象！' },
    },
    {
      id: 'c1s6',
      fen: '8/8/8/8/8/8/8/RNBQK2R w - - 0 1',
      narration: '最边上的两个，像城堡一样的棋子是"车"。它们可以横着走，竖着走，可厉害了！',
      highlights: ['a1', 'h1'],
      action: { type: 'tap_piece', targetPiece: 'R', instruction: '点击城堡！🏰' },
    },
    {
      id: 'c1s7',
      fen: '8/8/8/8/8/8/8/RNB1KBNR w - - 0 1',
      narration: '看中间这个戴着皇冠的，是"皇后"！她是棋盘上最强的棋子。',
      highlights: ['d1'],
      action: { type: 'tap_piece', targetPiece: 'Q', instruction: '点击皇后！👑' },
    },
    {
      id: 'c1s8',
      fen: '8/8/8/8/8/8/8/RNBQKBNR w - - 0 1',
      narration: '皇后旁边，戴着十字架王冠的是"国王"。国王是最重要的棋子！',
      highlights: ['e1'],
      action: { type: 'tap_piece', targetPiece: 'K', instruction: '点击国王！🤴' },
    },
    {
      id: 'c1s9',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      narration: '太棒了！你认识了所有6种棋子：国王🤴、皇后👑、车🏰、象⛪、马🐴、还有小兵🚶。每一边有16个棋子呢！',
      highlights: ['d1', 'e1', 'a1', 'h1', 'c1', 'f1', 'b1', 'g1'],
    },
  ],
};
