import { shuffle } from "../games/question-engine";
import { getQuizCategory, quizCategories } from "./categories";
import { quizSources } from "./sources";
import type { QuizQuestion, QuizSession } from "./types";

export {
  answerQuestion,
  nextQuestion,
  correctCount,
  scoreGame,
  shareResult,
} from "../games/question-engine";
const normalize = (text: string) =>
  text.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
export function validateQuizBank(bank: readonly QuizQuestion[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>(),
    prompts = new Set<string>();
  const registeredSources = new Set<string>(Object.values(quizSources));
  for (const q of bank) {
    if (!q.id?.trim() || ids.has(q.id))
      errors.push("ID de pergunta inválido ou repetido.");
    ids.add(q.id);
    if (!getQuizCategory(q.categoryId)) errors.push("Categoria inexistente.");
    if (
      ![q.question, q.explanation].every(
        (text) => typeof text === "string" && text.trim(),
      )
    )
      errors.push("Pergunta incompleta.");
    const prompt = normalize(q.question ?? "");
    if (prompts.has(prompt)) errors.push("Pergunta duplicada.");
    prompts.add(prompt);
    if (
      !registeredSources.has(q.sourceUrl) ||
      !q.sourceUrl.startsWith("https://")
    )
      errors.push("Fonte não registrada.");
    if (
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      q.options.some((o) => !o?.id?.trim() || !o?.title?.trim())
    ) {
      errors.push("Alternativas incompletas.");
      continue;
    }
    if (
      new Set(q.options.map((o) => o.id)).size !== 4 ||
      new Set(q.options.map((o) => normalize(o.title))).size !== 4
    )
      errors.push("Alternativas repetidas.");
    if (q.options.filter((o) => o.id === q.correctAnswerId).length !== 1)
      errors.push("Resposta correta inválida.");
  }
  for (const category of quizCategories)
    if (bank.filter((q) => q.categoryId === category.id).length < 10)
      errors.push(`Banco insuficiente: ${category.title}.`);
  return errors;
}
export function startQuiz(
  bank: readonly QuizQuestion[],
  slug: string,
  random = Math.random,
): QuizSession {
  const category = getQuizCategory(slug);
  if (!category || validateQuizBank(bank).length)
    throw new Error(
      "Não foi possível preparar dez perguntas válidas. Tente novamente mais tarde.",
    );
  return {
    categoryId: category.id,
    status: "playing",
    current: 0,
    answers: {},
    questions: shuffle(
      bank.filter((q) => q.categoryId === category.id),
      random,
    )
      .slice(0, 10)
      .map((q) => ({ ...q, options: shuffle(q.options, random) })),
  };
}
export function quizPerformance(score: number) {
  if (score === 100)
    return {
      title: "Uma memória de milhões",
      message:
        "Dez respostas, dez conexões com essa trajetória. Que rodada bonita!",
    };
  if (score >= 70)
    return {
      title: "Conexão em sintonia",
      message:
        "Você guardou muitos capítulos dessa história. Que tal seguir explorando?",
    };
  if (score >= 40)
    return {
      title: "Novas conexões",
      message:
        "Entre lembranças e descobertas, sua jornada continua crescendo.",
    };
  return {
    title: "Um novo capítulo",
    message:
      "Toda conexão começa com uma descoberta. Agora você tem mais histórias para conhecer.",
  };
}
export function quizShareText(
  score: number,
  categoryId: string,
  configuredUrl?: string,
) {
  const category = getQuizCategory(categoryId);
  if (!category) throw new Error("Categoria inexistente.");
  const text = `Consegui ${score}/100 no Quiz de ${category.title} do Army Pass Brasil! 💜 Você consegue superar?`;
  if (!configuredUrl) return text;
  try {
    const url = new URL(configuredUrl);
    if (
      url.protocol !== "https:" ||
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    )
      return text;
    return `${text}\n${new URL(`/jogos/quiz/${category.slug}`, url.origin).href}`;
  } catch {
    return text;
  }
}
