import type { BaseQuestion, QuestionSession } from "../games/question-engine";
export const categoryIds = [
  "bts",
  "rm",
  "jin",
  "suga",
  "j-hope",
  "jimin",
  "v",
  "jung-kook",
] as const;
export type CategoryId = (typeof categoryIds)[number];
export type QuizCategory = Readonly<{
  id: CategoryId;
  slug: CategoryId;
  title: string;
  subtitle: string;
  memberName: string;
  description: string;
  imagePath?: string;
}>;
export type QuizQuestion = BaseQuestion & Readonly<{ categoryId: CategoryId }>;
export type QuizSession = QuestionSession<QuizQuestion> &
  Readonly<{ categoryId: CategoryId }>;
