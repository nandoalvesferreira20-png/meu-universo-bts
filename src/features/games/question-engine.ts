// Shared by Emoji Challenge and the BTS/member quizzes.
export type QuestionOption = Readonly<{ id: string; title: string }>;
export type BaseQuestion = Readonly<{
  id: string;
  question: string;
  options: readonly QuestionOption[];
  correctAnswerId: string;
  explanation: string;
  sourceUrl: string;
}>;
export type QuestionSession<Q extends BaseQuestion = BaseQuestion> = Readonly<{
  questions: readonly Q[];
  current: number;
  answers: Readonly<Record<string, string>>;
  status: "playing" | "finished";
}>;

export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function answerQuestion<S extends QuestionSession>(
  state: S,
  questionId: string,
  answerId: string,
): S {
  const q = state.questions[state.current];
  if (
    state.status !== "playing" ||
    !q ||
    q.id !== questionId ||
    state.answers[q.id] ||
    !q.options.some((o) => o.id === answerId)
  )
    return state;
  return { ...state, answers: { ...state.answers, [q.id]: answerId } };
}
export function nextQuestion<S extends QuestionSession>(state: S): S {
  if (
    state.status !== "playing" ||
    !state.answers[state.questions[state.current]?.id]
  )
    return state;
  return state.current === state.questions.length - 1
    ? { ...state, status: "finished" }
    : { ...state, current: state.current + 1 };
}
export function correctCount(state: QuestionSession): number {
  return state.questions.filter(
    (q) => state.answers[q.id] === q.correctAnswerId,
  ).length;
}
export function scoreGame(state: QuestionSession): number {
  return Math.min(100, correctCount(state) * 10);
}

type ShareBrowser = {
  share?: (data: { text: string }) => Promise<void>;
  clipboard?: { writeText: (text: string) => Promise<void> };
};
export async function shareResult(
  text: string,
  browser: ShareBrowser,
): Promise<"shared" | "copied" | "cancelled" | "manual"> {
  if (browser.share) {
    try {
      await browser.share({ text });
      return "shared";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError")
        return "cancelled";
    }
  }
  if (browser.clipboard) {
    try {
      await browser.clipboard.writeText(text);
      return "copied";
    } catch {
      /* Offer selectable text. */
    }
  }
  return "manual";
}
