"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Heart,
  Music2,
  RotateCcw,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { emojiQuestions } from "./questions";
import {
  answerQuestion,
  correctCount,
  levels,
  nextQuestion,
  performance,
  scoreGame,
  shareResult,
  shareText,
  startGame,
} from "./game";
import { difficulties, type Difficulty, type GameState } from "./types";
import styles from "./emoji-challenge.module.css";

function DifficultySelection({
  onStart,
}: {
  onStart: (difficulty: Difficulty) => void;
}) {
  return (
    <>
      <div className={styles.intro}>
        <span className={styles.musicMark} aria-hidden="true">
          <Music2 size={32} strokeWidth={1.3} />
          <span>✦</span>
        </span>
        <span className="eyebrow">DE PLAYLIST EM PLAYLIST</span>
        <h1>
          Emoji Challenge <span aria-hidden="true">🎵</span>
        </h1>
        <p>Você consegue descobrir as músicas do BTS usando apenas emojis?</p>
        <div className={styles.rules}>
          <span>10 músicas</span>
          <span>Sem cronômetro</span>
          <span>Só você e sua memória</span>
        </div>
      </div>
      <section aria-labelledby="choose-level" className={styles.selection}>
        <h2 id="choose-level">Qual é o seu mood de hoje?</h2>
        <div className={styles.levels}>
          {difficulties.map((level, i) => (
            <article className={styles.level} key={level}>
              <div className={styles.levelTop}>
                <span aria-hidden="true">{"✦".repeat(i + 1)}</span>
                <span>0{i + 1}</span>
              </div>
              <span className={styles.levelName}>{levels[level].name}</span>
              <h3>{levels[level].title}</h3>
              <p>{levels[level].description}</p>
              <button
                className={styles.primary}
                onClick={() => onStart(level)}
                aria-label={`Jogar ${levels[level].name}`}
              >
                Vamos jogar <ArrowRight size={17} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </section>
      <p className={styles.note}>
        Sem cadastro. Sem pressa. Um desafio feito de música e conexão.
      </p>
    </>
  );
}

function QuestionScreen({
  game,
  onAnswer,
  onNext,
  onChange,
}: {
  game: GameState;
  onAnswer: (questionId: string, answerId: string) => void;
  onNext: () => void;
  onChange: () => void;
}) {
  const q = game.questions[game.current];
  const answer = game.answers[q.id];
  const correctTitle = q.options.find((o) => o.id === q.correctAnswerId)!.title;
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [q.id]);
  return (
    <section className={styles.game} aria-label="Partida do Emoji Challenge">
      <div className={styles.gameTop}>
        <button className={styles.textButton} onClick={onChange}>
          <ChevronLeft size={15} aria-hidden="true" /> Trocar nível
        </button>
        <span>
          {levels[game.difficulty].name} · {scoreGame(game)} pts
        </span>
      </div>
      <div className={styles.round}>
        <span>MÚSICA {String(game.current + 1).padStart(2, "0")}</span>
        <span>{game.current + 1} de 10</span>
      </div>
      <progress
        className={styles.progress}
        value={Object.keys(game.answers).length}
        max={10}
        aria-label="Músicas respondidas"
      />
      <div className={styles.puzzle}>
        <div
          className={styles.emojis}
          data-compact={q.emojis.length > 20}
          role="img"
          aria-label={q.emojiDescription}
        >
          {q.emojis}
        </div>
        <h1 ref={heading} tabIndex={-1}>
          {q.question}
        </h1>
        <p>Uma pista, quatro possibilidades. Confie na sua memória.</p>
      </div>
      <div className={styles.options} role="group" aria-label="Alternativas">
        {q.options.map((option, index) => {
          const right = Boolean(answer) && option.id === q.correctAnswerId;
          const wrong = Boolean(answer) && answer === option.id && !right;
          return (
            <button
              key={option.id}
              className={`${styles.option} ${right ? styles.correct : ""} ${wrong ? styles.wrong : ""}`}
              aria-pressed={answer === option.id}
              aria-disabled={Boolean(answer)}
              onClick={() => onAnswer(q.id, option.id)}
            >
              <span className={styles.letter} aria-hidden="true">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option.title}</span>
              {right && (
                <>
                  <Check size={19} aria-hidden="true" />
                  <span className="sr-only">Resposta correta</span>
                </>
              )}
              {wrong && (
                <>
                  <X size={19} aria-hidden="true" />
                  <span className="sr-only">Sua resposta, incorreta</span>
                </>
              )}
            </button>
          );
        })}
      </div>
      <div
        className={styles.feedback}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {answer && (
          <>
            <strong>
              {answer === q.correctAnswerId
                ? "Acertou! Você conhece os meninos! 💜"
                : `Quase! A resposta era ${correctTitle}.`}
            </strong>
            <p>{q.explanation}</p>
            <a href={q.sourceUrl} target="_blank" rel="noopener noreferrer">
              Na discografia oficial{" "}
              <span className="sr-only">(abre em nova aba)</span>↗
            </a>
          </>
        )}
      </div>
      <div className={styles.nextRow}>
        {!answer && q.optionalHint ? (
          <details key={q.id} className={styles.hint}>
            <summary>Uma ajudinha?</summary>
            <p>{q.optionalHint}</p>
          </details>
        ) : (
          <span className={styles.smallNote}>No seu tempo. Sempre.</span>
        )}
        <button className={styles.primary} disabled={!answer} onClick={onNext}>
          {game.current === 9 ? "Ver resultado" : "Próxima pergunta"}
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function ResultScreen({
  game,
  onReplay,
  onChange,
  publicUrl,
}: {
  game: GameState;
  onReplay: () => void;
  onChange: () => void;
  publicUrl?: string;
}) {
  const score = scoreGame(game),
    result = performance(score),
    text = shareText(score, publicUrl);
  const [shareStatus, setShareStatus] = useState("");
  const [manual, setManual] = useState(false);
  const [sharing, setSharing] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  async function share() {
    if (sharing) return;
    setSharing(true);
    try {
      const outcome = await shareResult(text, {
        share: navigator.share?.bind(navigator),
        clipboard: navigator.clipboard,
      });
      setManual(outcome === "manual");
      setShareStatus(
        outcome === "shared"
          ? "Resultado compartilhado!"
          : outcome === "copied"
            ? "Texto copiado! Agora é só enviar para suas amigas."
            : outcome === "manual"
              ? "Selecione e copie seu resultado abaixo."
              : "Compartilhamento cancelado. Seu resultado continua aqui.",
      );
    } finally {
      setSharing(false);
    }
  }
  return (
    <section
      className={`${styles.game} ${styles.result}`}
      aria-label="Resultado do desafio"
    >
      <span className={styles.resultIcon} aria-hidden="true">
        <Sparkles size={30} strokeWidth={1.3} />
      </span>
      <span className="eyebrow">
        SUA PLAYLIST DE ACERTOS · {levels[game.difficulty].name}
      </span>
      <div className={styles.score}>
        {score}
        <span>/100</span>
      </div>
      <p>
        Você acertou <strong>{correctCount(game)} de 10 músicas.</strong>
      </p>
      <h1 ref={heading} tabIndex={-1}>
        {result.title}
      </h1>
      <p>{result.message}</p>
      <span className={styles.resultNote}>
        Um título divertido desta rodada. Ser ARMY vai muito além de uma
        pontuação. <Heart size={13} aria-hidden="true" />
      </span>
      <div className={styles.resultActions}>
        <button className={styles.primary} onClick={onReplay}>
          <RotateCcw size={17} aria-hidden="true" />
          Jogar novamente
        </button>
        <button className={styles.secondary} onClick={share} disabled={sharing}>
          <Share2 size={17} aria-hidden="true" />
          {sharing ? "Compartilhando…" : "Compartilhar resultado"}
        </button>
      </div>
      <button className={styles.textButton} onClick={onChange}>
        Escolher outro nível <ArrowRight size={16} aria-hidden="true" />
      </button>
      <p role="status" className={styles.shareStatus}>
        {shareStatus}
      </p>
      {manual && (
        <textarea
          className={styles.shareCopy}
          aria-label="Texto do resultado para copiar"
          readOnly
          value={text}
          onFocus={(e) => e.currentTarget.select()}
        />
      )}
      <p className={styles.replayNote}>
        Cada nível tem 10 músicas. Ao jogar novamente, as músicas são as mesmas;
        a ordem das perguntas e alternativas pode mudar.
      </p>
    </section>
  );
}

export function EmojiChallenge({ publicUrl }: { publicUrl?: string }) {
  const [game, setGame] = useState<GameState | null>(null);
  const [error, setError] = useState("");
  const selection = useRef<HTMLDivElement>(null);
  function start(difficulty: Difficulty) {
    try {
      const next = startGame(emojiQuestions, difficulty);
      setError("");
      setGame(next);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "O desafio está indisponível. Tente novamente mais tarde.",
      );
    }
  }
  function changeLevel() {
    setGame(null);
    requestAnimationFrame(() => selection.current?.focus());
  }
  return (
    <div className={`container ${styles.page}`}>
      <Link href="/jogos" className={`breadcrumb ${styles.back}`}>
        <ChevronLeft size={14} aria-hidden="true" /> Central de jogos
      </Link>
      <div ref={selection} tabIndex={-1}>
        {!game ? (
          <DifficultySelection onStart={start} />
        ) : game.status === "finished" ? (
          <ResultScreen
            game={game}
            onReplay={() => start(game.difficulty)}
            onChange={changeLevel}
            publicUrl={publicUrl}
          />
        ) : (
          <QuestionScreen
            game={game}
            onChange={changeLevel}
            onAnswer={(questionId, answerId) =>
              setGame(
                (previous) =>
                  previous && answerQuestion(previous, questionId, answerId),
              )
            }
            onNext={() =>
              setGame((previous) => previous && nextQuestion(previous))
            }
          />
        )}
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <p className={styles.fanNote}>
        Feito por fãs, para fãs. Este é um jogo independente, sem vínculo
        oficial com BTS ou BIGHIT MUSIC.
      </p>
    </div>
  );
}
