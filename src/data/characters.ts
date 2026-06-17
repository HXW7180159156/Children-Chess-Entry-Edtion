export interface Character {
  id: string;
  name: string;
  avatar: string;
  emoji: string;
  greeting: string;
}

export const CHARACTERS: Character[] = [
  { id: 'cat', name: '小猫咪', avatar: '🐱', emoji: '🐱', greeting: '喵~ 一起学棋吧！' },
  { id: 'dog', name: '小狗狗', avatar: '🐶', emoji: '🐶', greeting: '汪！我会认真学的！' },
  { id: 'bunny', name: '小兔子', avatar: '🐰', emoji: '🐰', greeting: '跳跳跳~ 走棋啦！' },
  { id: 'owl', name: '猫头鹰', avatar: '🦉', emoji: '🦉', greeting: '聪明的棋手来啦！' },
  { id: 'fox', name: '小狐狸', avatar: '🦊', emoji: '🦊', greeting: '狡猾的走法，我喜欢！' },
  { id: 'penguin', name: '小企鹅', avatar: '🐧', emoji: '🐧', greeting: '晃晃晃~ 来下棋！' },
];
