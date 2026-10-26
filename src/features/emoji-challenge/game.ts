import { shuffle } from "../games/question-engine";
export {
  shuffle,
  answerQuestion,
  nextQuestion,
  correctCount,
  scoreGame,
  shareResult,
} from "../games/question-engine";
import {
  difficulties,
  type Difficulty,
  type EmojiQuestion,
  type GameState,
} from "./types";

export const questionsPerGame = 10;
export const levels: Record<
  Difficulty,
  { name: string; title: string; description: string }
> = {
  easy: {
    name: "Fácil",
    title: "Baby ARMY",
    description: "Comece pelos hits que toda ARMY conhece.",
  },
  medium: {
    name: "Médio",
    title: "ARMY de carteirinha",
    description: "Você conhece muito mais do que os refrões?",
  },
  hard: {
    name: "Difícil",
    title: "ARMY Lendária",
    description: "Só quem conhece cada cantinho da discografia chega até aqui.",
  },
};

export function validateBank(bank: readonly EmojiQuestion[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const q of bank) {
    if (!q.id?.trim() || ids.has(q.id))
      errors.push("ID de pergunta inválido ou duplicado.");
    ids.add(q.id);
    if (!(difficulties as readonly string[]).includes(q.difficulty))
      errors.push("Dificuldade inválida.");
    if (
      ![q.emojis, q.emojiDescription, q.question, q.explanation].every(
        (text) => typeof text === "string" && text.trim(),
      )
    )
      errors.push("Pergunta incompleta.");
    if (!/^https:\/\/bts\.ibighit\.com\/eng\/discography\//.test(q.sourceUrl))
      errors.push("Fonte inválida.");
    if (
      q.options.length !== 4 ||
      q.options.some((o) => !o.id?.trim() || !o.title?.trim()) ||
      new Set(q.options.map((o) => o.id)).size !== 4 ||
      new Set(q.options.map((o) => o.title.trim().toLocaleLowerCase())).size !==
        4
    )
      errors.push("Alternativas inválidas ou repetidas.");
    if (q.options.filter((o) => o.id === q.correctAnswerId).length !== 1)
      errors.push("Resposta correta inválida.");
  }
  for (const level of difficulties) {
    if (bank.filter((q) => q.difficulty === level).length < questionsPerGame)
      errors.push(`Banco insuficiente: ${level}.`);
  }
  return errors;
}

export function startGame(
  bank: readonly EmojiQuestion[],
  difficulty: Difficulty,
  random = Math.random,
): GameState {
  if (!difficulties.includes(difficulty) || validateBank(bank).length)
    throw new Error(
      "Não foi possível preparar uma partida completa. Tente novamente mais tarde.",
    );
  return {
    difficulty,
    current: 0,
    answers: {},
    status: "playing",
    questions: shuffle(
      bank.filter((q) => q.difficulty === difficulty),
      random,
    )
      .slice(0, questionsPerGame)
      .map((q) => ({ ...q, options: shuffle(q.options, random) })),
  };
}
export function performance(score: number) {
  if (score === 100)
    return {
      title: "ARMY Lendária",
      message: "Dez músicas, dez conexões. Você brilhou em cada pista!",
    };
  if (score >= 70)
    return {
      title: "ARMY de carteirinha",
      message:
        "Sua memória musical está cheia de boas histórias. Que tal mais uma rodada?",
    };
  if (score >= 40)
    return {
      title: "ARMY em evolução",
      message:
        "Cada descoberta vira uma nova conexão. Continue explorando essas músicas!",
    };
  return {
    title: "Baby ARMY",
    message:
      "Toda jornada começa com uma música. Há tantas descobertas bonitas pela frente!",
  };
}

export function shareText(score: number, configuredUrl?: string): string {
  const text = `Consegui ${score}/100 no Emoji Challenge do Army Pass Brasil! 🎵💜 Você consegue superar?`;
  if (!configuredUrl) return text;
  try {
    const url = new URL(configuredUrl);
    if (
      url.protocol !== "https:" ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1"
    )
      return text;
    return `${text}\n${new URL("/jogos/emojis", url.origin).href}`;
  } catch {
    return text;
  }
}
