export const difficulties = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof difficulties)[number];
export type AnswerOption = Readonly<{ id: string; title: string }>;
export type EmojiQuestion = Readonly<{
  id: string;
  difficulty: Difficulty;
  emojis: string;
  emojiDescription: string;
  question: string;
  options: readonly AnswerOption[];
  correctAnswerId: string;
  explanation: string;
  optionalHint?: string;
  sourceUrl: string;
}>;
export type GameState = Readonly<{
  difficulty: Difficulty;
  questions: readonly EmojiQuestion[];
  current: number;
  answers: Readonly<Record<string, string>>;
  status: "playing" | "finished";
}>;
