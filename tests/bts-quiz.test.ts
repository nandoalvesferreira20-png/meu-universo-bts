import test from "node:test";
import assert from "node:assert/strict";
import {
  quizCategories,
  getQuizCategory,
} from "../src/features/bts-quiz/categories";
import { quizQuestions } from "../src/features/bts-quiz/questions";
import { quizSources } from "../src/features/bts-quiz/sources";
import { categoryIds, type QuizQuestion } from "../src/features/bts-quiz/types";
import * as quiz from "../src/features/bts-quiz/game";
import * as emoji from "../src/features/emoji-challenge/game";
import { emojiQuestions } from "../src/features/emoji-challenge/questions";
import * as shared from "../src/features/games/question-engine";

test("oito categorias únicas com slugs consistentes e dez perguntas cada", () => {
  assert.equal(quizCategories.length, 8);
  assert.deepEqual(
    quizCategories.map((c) => c.slug),
    categoryIds,
  );
  assert.equal(new Set(quizCategories.map((c) => c.id)).size, 8);
  assert.equal(quizQuestions.length, 80);
  assert.deepEqual(quiz.validateQuizBank(quizQuestions), []);
  for (const c of quizCategories) {
    assert.equal(getQuizCategory(c.slug), c);
    assert.equal(quizQuestions.filter((q) => q.categoryId === c.id).length, 10);
  }
  assert.equal(getQuizCategory("not-a-member"), undefined);
});
test("80 perguntas distintas, fontes registradas, quatro alternativas e resposta única por ID", () => {
  assert.equal(new Set(quizQuestions.map((q) => q.id)).size, 80);
  assert.equal(new Set(quizQuestions.map((q) => q.question)).size, 80);
  for (const q of quizQuestions) {
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.id)).size, 4);
    assert.equal(new Set(q.options.map((o) => o.title)).size, 4);
    assert.equal(q.options.filter((o) => o.id === q.correctAnswerId).length, 1);
    assert.ok(new Set<string>(Object.values(quizSources)).has(q.sourceUrl));
    assert.match(q.sourceUrl, /^https:\/\//);
    assert.ok(q.explanation.trim());
  }
});
test("validação rejeita banco incompleto, categorias inválidas, repetição e opções malformadas", () => {
  assert.throws(() => quiz.startQuiz([], "bts"));
  assert.throws(() => quiz.startQuiz(quizQuestions, "bad-slug"));
  const q = quizQuestions[0];
  const mutations: QuizQuestion[] = [
    { ...q, id: "" },
    { ...q, question: "" },
    { ...q, explanation: "" },
    { ...q, categoryId: "bad" as "bts" },
    { ...q, sourceUrl: "https://example.com" },
    { ...q, options: [] },
    { ...q, correctAnswerId: "missing" },
    { ...q, options: [q.options[0], q.options[0], ...q.options.slice(2)] },
    { ...q, options: q.options.map((o) => ({ ...o, title: "duplicate" })) },
    { ...q, options: q.options.map((o) => ({ ...o, id: "" })) },
  ];
  for (const invalid of mutations)
    assert.throws(() =>
      quiz.startQuiz([invalid, ...quizQuestions.slice(1)], "bts"),
    );
  assert.throws(() => quiz.startQuiz(quizQuestions.slice(1), "bts"));
  assert.throws(() => quiz.startQuiz([q, ...quizQuestions], "bts"));
  assert.throws(() =>
    quiz.startQuiz(
      [
        { ...q, question: quizQuestions[1].question },
        ...quizQuestions.slice(1),
      ],
      "bts",
    ),
  );
});
test("as duas experiências compartilham as mesmas funções fundamentais", () => {
  for (const key of [
    "answerQuestion",
    "nextQuestion",
    "correctCount",
    "scoreGame",
    "shareResult",
  ] as const) {
    assert.equal(quiz[key], shared[key]);
    assert.equal(emoji[key], shared[key]);
  }
  assert.equal(emoji.shuffle, shared.shuffle);
  assert.deepEqual(emoji.validateBank(emojiQuestions), []);
  assert.equal(emojiQuestions.length, 30);
});
test("embaralhamento não muda o banco, preserva IDs e permite expansão", () => {
  const before = JSON.stringify(quizQuestions);
  const game = quiz.startQuiz(quizQuestions, "rm", () => 0);
  assert.equal(game.questions.length, 10);
  assert.equal(game.current, 0);
  assert.deepEqual(game.answers, {});
  assert.notDeepEqual(
    game.questions.map((q) => q.id),
    quizQuestions.filter((q) => q.categoryId === "rm").map((q) => q.id),
  );
  assert.notDeepEqual(
    game.questions[0].options,
    quizQuestions.find((q) => q.id === game.questions[0].id)!.options,
  );
  assert.equal(JSON.stringify(quizQuestions), before);
  const extra = {
    ...quizQuestions[0],
    id: "bts-extra",
    question: "Pergunta adicional para testar a expansão?",
  };
  assert.equal(
    quiz.startQuiz([...quizQuestions, extra], "bts").questions.length,
    10,
  );
});
test("acerto, erro, bloqueio de clique repetido, respostas obsoletas e avanço manual", () => {
  let game = quiz.startQuiz(quizQuestions, "jin");
  assert.equal(quiz.nextQuestion(game), game);
  const first = game.questions[0];
  assert.equal(quiz.answerQuestion(game, "stale", first.correctAnswerId), game);
  assert.equal(quiz.answerQuestion(game, first.id, "missing"), game);
  game = quiz.answerQuestion(game, first.id, first.correctAnswerId);
  assert.equal(quiz.scoreGame(game), 10);
  assert.equal(game.current, 0);
  assert.equal(
    quiz.answerQuestion(game, first.id, first.correctAnswerId),
    game,
  );
  assert.equal(
    quiz.answerQuestion(
      game,
      first.id,
      first.options.find((o) => o.id !== first.correctAnswerId)!.id,
    ),
    game,
  );
  game = quiz.nextQuestion(game);
  assert.equal(game.current, 1);
  assert.equal(
    quiz.answerQuestion(game, first.id, first.correctAnswerId),
    game,
  );
  const second = game.questions[1];
  game = quiz.answerQuestion(
    game,
    second.id,
    second.options.find((o) => o.id !== second.correctAnswerId)!.id,
  );
  assert.equal(quiz.scoreGame(game), 10);
  assert.equal(quiz.correctCount(game), 1);
});
test("todas as categorias encerram em dez perguntas com máximo de 100; reinício zera estado", () => {
  for (const category of categoryIds) {
    let game = quiz.startQuiz(quizQuestions, category);
    for (let i = 0; i < 10; i++) {
      const q = game.questions[game.current];
      game = quiz.nextQuestion(
        quiz.answerQuestion(game, q.id, q.correctAnswerId),
      );
    }
    assert.equal(game.status, "finished");
    assert.equal(game.current, 9);
    assert.equal(quiz.scoreGame(game), 100);
    assert.equal(quiz.correctCount(game), 10);
    assert.equal(quiz.nextQuestion(game), game);
    assert.equal(
      quiz.answerQuestion(
        game,
        game.questions[9].id,
        game.questions[9].correctAnswerId,
      ),
      game,
    );
    const replay = quiz.startQuiz(quizQuestions, category);
    assert.equal(replay.categoryId, category);
    assert.equal(replay.current, 0);
    assert.equal(quiz.scoreGame(replay), 0);
  }
  assert.equal(quiz.startQuiz(quizQuestions, "v").categoryId, "v");
  assert.equal(
    quiz.startQuiz(quizQuestions, "jung-kook").categoryId,
    "jung-kook",
  );
});
test("resultado compartilha categoria, pontuação e URL pública opcional, sem gabarito", async () => {
  const text = quiz.quizShareText(90, "jung-kook");
  assert.match(text, /90\/100.*Jung Kook/);
  assert.ok(!text.includes("https"));
  assert.ok(!text.includes("Seven"));
  assert.ok(
    quiz
      .quizShareText(90, "jung-kook", "https://army.example/")
      .endsWith("https://army.example/jogos/quiz/jung-kook"),
  );
  for (const url of ["invalid", "http://localhost:3100", "https://127.0.0.1"])
    assert.equal(quiz.quizShareText(90, "jung-kook", url), text);
  assert.throws(() => quiz.quizShareText(90, "bad"));
  let output = "";
  assert.equal(
    await quiz.shareResult(text, {
      share: async (data) => {
        output = data.text;
      },
    }),
    "shared",
  );
  assert.equal(output, text);
  assert.equal(
    await quiz.shareResult(text, {
      clipboard: {
        writeText: async (value) => {
          output = value;
        },
      },
    }),
    "copied",
  );
  assert.equal(output, text);
  assert.equal(await quiz.shareResult(text, {}), "manual");
  assert.equal(
    await quiz.shareResult(text, {
      share: async () => {
        throw new DOMException("Cancel", "AbortError");
      },
    }),
    "cancelled",
  );
  for (const score of [0, 30, 40, 60, 70, 90, 100]) {
    assert.ok(quiz.quizPerformance(score).title);
    assert.ok(quiz.quizPerformance(score).message);
  }
});
