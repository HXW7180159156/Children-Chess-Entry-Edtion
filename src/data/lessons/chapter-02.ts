import type { LessonChapter } from '../../types/lessons';

// Chapter 2: Meet the Board
export const chapter02: LessonChapter = {
  id: 'chapter-02',
  title: '认识棋盘',
  icon: '🏁',
  description: '8×8的格子，黑与白的王国',
  difficulty: 1,
  steps: [
    {
      id: 'c2s1',
      fen: '8/8/8/8/8/8/8/8 w - - 0 1',
      narration: '这是一个空的棋盘。数一数，横着有几个格子？竖着呢？',
      highlights: [],
    },
    {
      id: 'c2s2',
      fen: '8/8/8/8/8/8/8/8 w - - 0 1',
      narration: '棋盘是8×8的，一共64个格子。深浅交替的颜色，像不像巧克力饼干？🍪',
      highlights: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
                     'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
    },
    {
      id: 'c2s3',
      fen: '8/8/8/8/8/8/8/8 w - - 0 1',
      narration: '这是深色格子，这是浅色格子。它们交替排列。深色的叫"黑格"（虽然其实是棕色的），浅色的叫"白格"。',
      highlights: ['a1', 'c1', 'e1', 'g1', 'b2', 'd2', 'f2', 'h2'],
      action: { type: 'tap_square', instruction: '点击任意一个深色格子！' },
    },
    {
      id: 'c2s4',
      fen: '8/8/8/8/8/8/8/8 w - - 0 1',
      narration: '棋盘竖着的一列叫"线"，横着的一排叫"行"。每条线都有名字，从左到右是 a、b、c、d、e、f、g、h。',
      arrows: [['a1', 'a8'], ['h1', 'h8']],
      highlights: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8'],
    },
    {
      id: 'c2s5',
      fen: '8/8/8/8/8/8/8/8 w - - 0 1',
      narration: '每一行从下到上编号 1 到 8。每个格子的名字就是"字母+数字"，比如最左下角是 a1。试试点击它！',
      highlights: ['a1'],
      action: { type: 'tap_square', targetSquare: 'a1', instruction: '点击 a1 格子！' },
    },
    {
      id: 'c2s6',
      fen: '8/8/8/8/8/8/8/8 w - - 0 1',
      narration: '最右上角是 h8。右下角是 h1，左上角是 a8。你记住了吗？试试点击 h8！',
      highlights: ['h8'],
      action: { type: 'tap_square', targetSquare: 'h8', instruction: '点击 h8 格子！' },
    },
    {
      id: 'c2s7',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      narration: '现在棋子又回来啦！白棋在下方（第1和第2行），黑棋在上方（第7和第8行）。对局开始前，棋盘永远是右边下角是浅色格子的方向哦！',
      highlights: ['h1', 'a8'],
    },
  ],
};
