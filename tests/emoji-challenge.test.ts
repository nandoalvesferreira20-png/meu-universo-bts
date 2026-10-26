import test from "node:test";
import assert from "node:assert/strict";
import {
  emojiQuestions,
  songs,
} from "../src/features/emoji-challenge/questions";
import {
  answerQuestion,
  correctCount,
  nextQuestion,
  performance,
  scoreGame,
  shareResult,
  shareText,
  shuffle,
  startGame,
  validateBank,
} from "../src/features/emoji-challenge/game";
import {
  difficulties,
  type EmojiQuestion,
} from "../src/features/emoji-challenge/types";

test("banco: três níveis, dez perguntas por nível, quatro títulos reais distintos e resposta por ID", () => {
  assert.deepEqual(difficulties, ["easy", "medium", "hard"]);
  assert.deepEqual(validateBank(emojiQuestions), []);
  assert.equal(new Set(emojiQuestions.map((q) => q.id)).size, 30);
  for (const level of difficulties)
    assert.equal(
      emojiQuestions.filter((q) => q.difficulty === level).length,
      10,
    );
  for (const q of emojiQuestions) {
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.title)).size, 4);
    assert.equal(q.options.filter((o) => o.id === q.correctAnswerId).length, 1);
    for (const o of q.options)
      assert.equal(songs[o.id as keyof typeof songs], o.title);
    assert.ok(q.emojiDescription && q.explanation && q.sourceUrl);
  }
});
test("validação rejeita banco vazio, incompleto, IDs repetidos, dificuldade e alternativas inválidas", () => {
  assert.throws(() => startGame([], "easy"));
  const q = emojiQuestions[0];
  const mutations: EmojiQuestion[] = [
    { ...q, question: "" },
    { ...q, emojis: "" },
    { ...q, emojiDescription: "" },
    { ...q, difficulty: "other" as "easy" },
    { ...q, sourceUrl: "https://example.com" },
    { ...q, options: q.options.slice(1) },
    { ...q, correctAnswerId: "missing" },
    { ...q, options: [q.options[0], q.options[0], ...q.options.slice(2)] },
    { ...q, options: q.options.map((o) => ({ ...o, title: "Butter" })) },
    { ...q, options: q.options.map((o) => ({ ...o, id: "" })) },
  ];
  for (const invalid of mutations)
    assert.throws(() =>
      startGame([invalid, ...emojiQuestions.slice(1)], "easy"),
    );
  assert.throws(() => startGame([q, ...emojiQuestions], "easy"));
  assert.throws(() => startGame(emojiQuestions.slice(1), "easy"));
});
test("embaralhamento preserva o banco e mantém vínculos corretos; permite expansão", () => {
  const snapshot = JSON.stringify(emojiQuestions);
  const game = startGame(emojiQuestions, "easy", () => 0);
  assert.equal(game.questions.length, 10);
  assert.equal(game.status, "playing");
  assert.equal(game.current, 0);
  assert.equal(scoreGame(game), 0);
  assert.notDeepEqual(
    game.questions.map((q) => q.id),
    emojiQuestions.slice(0, 10).map((q) => q.id),
  );
  assert.notDeepEqual(
    game.questions[0].options,
    emojiQuestions.find((q) => q.id === game.questions[0].id)!.options,
  );
  assert.equal(JSON.stringify(emojiQuestions), snapshot);
  assert.deepEqual(
    shuffle([1, 2, 3], () => 0),
    [2, 3, 1],
  );
  assert.deepEqual(shuffle([]), []);
  for (const q of game.questions)
    assert.ok(q.options.some((o) => o.id === q.correctAnswerId));
  const extra = { ...emojiQuestions[0], id: "easy-extra" };
  assert.equal(
    startGame([...emojiQuestions, extra], "easy").questions.length,
    10,
  );
});
test("acerto, erro, clique duplicado, ID obsoleto, alternativa inválida e progressão", () => {
  let game = startGame(emojiQuestions, "medium");
  assert.equal(nextQuestion(game), game);
  const q = game.questions[0];
  assert.equal(answerQuestion(game, "obsolete", q.correctAnswerId), game);
  assert.equal(answerQuestion(game, q.id, "invalid"), game);
  game = answerQuestion(game, q.id, q.correctAnswerId);
  assert.equal(scoreGame(game), 10);
  assert.equal(answerQuestion(game, q.id, q.correctAnswerId), game);
  assert.equal(
    answerQuestion(
      game,
      q.id,
      q.options.find((o) => o.id !== q.correctAnswerId)!.id,
    ),
    game,
  );
  game = nextQuestion(game);
  assert.equal(game.current, 1);
  assert.equal(answerQuestion(game, q.id, q.correctAnswerId), game);
  const second = game.questions[1];
  game = answerQuestion(
    game,
    second.id,
    second.options.find((o) => o.id !== second.correctAnswerId)!.id,
  );
  assert.equal(scoreGame(game), 10);
  assert.equal(correctCount(game), 1);
});
test("dez perguntas concluem a partida com máximo 100; reinício e troca de nível zeram estado", () => {
  for (const difficulty of difficulties) {
    let game = startGame(emojiQuestions, difficulty);
    for (let i = 0; i < 10; i++) {
      const q = game.questions[game.current];
      game = nextQuestion(answerQuestion(game, q.id, q.correctAnswerId));
    }
    assert.equal(game.status, "finished");
    assert.equal(game.current, 9);
    assert.equal(scoreGame(game), 100);
    assert.equal(correctCount(game), 10);
    assert.equal(nextQuestion(game), game);
    assert.equal(answerQuestion(game, game.questions[9].id, "butter"), game);
    const replay = startGame(emojiQuestions, game.difficulty);
    assert.equal(replay.difficulty, difficulty);
    assert.deepEqual(replay.answers, {});
    assert.equal(scoreGame(replay), 0);
  }
  for (const [score, title] of [
    [0, "Baby ARMY"],
    [30, "Baby ARMY"],
    [40, "ARMY em evolução"],
    [60, "ARMY em evolução"],
    [70, "ARMY de carteirinha"],
    [90, "ARMY de carteirinha"],
    [100, "ARMY Lendária"],
  ] as const)
    assert.equal(performance(score).title, title);
});
test("compartilhamento: URL apenas se configurada, sem respostas, nativo, cópia, cancelamento e fallback manual", async () => {
  const text = shareText(90);
  assert.ok(text.includes("90/100"));
  assert.ok(!text.includes("http"));
  assert.ok(!text.includes("Butter"));
  assert.ok(
    shareText(90, "https://army.example/base").endsWith(
      "https://army.example/jogos/emojis",
    ),
  );
  for (const url of ["invalid", "http://localhost:3100", "javascript:alert(1)"])
    assert.equal(shareText(90, url), text);
  let received = "";
  assert.equal(
    await shareResult(text, {
      share: async (data) => {
        received = data.text;
      },
    }),
    "shared",
  );
  assert.equal(received, text);
  assert.equal(
    await shareResult(text, {
      clipboard: {
        writeText: async (value) => {
          received = value;
        },
      },
    }),
    "copied",
  );
  assert.equal(received, text);
  assert.equal(
    await shareResult(text, {
      share: async () => {
        throw new DOMException("Cancel", "AbortError");
      },
    }),
    "cancelled",
  );
  assert.equal(
    await shareResult(text, {
      share: async () => {
        throw Error("Unavailable");
      },
      clipboard: { writeText: async () => {} },
    }),
    "copied",
  );
  assert.equal(await shareResult(text, {}), "manual");
  assert.equal(
    await shareResult(text, {
      clipboard: {
        writeText: async () => {
          throw Error("Denied");
        },
      },
    }),
    "manual",
  );
});
