"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  RotateCcw,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { quizQuestions } from "./questions";
import {
  answerQuestion,
  correctCount,
  nextQuestion,
  quizPerformance,
  quizShareText,
  scoreGame,
  shareResult,
  startQuiz,
} from "./game";
import type { QuizCategory, QuizSession } from "./types";
import styles from "./quiz.module.css";

function QuizResult({
  session,
  category,
  publicUrl,
  onReplay,
}: {
  session: QuizSession;
  category: QuizCategory;
  publicUrl?: string;
  onReplay: () => void;
}) {
  const score = scoreGame(session),
    result = quizPerformance(score),
    text = quizShareText(score, category.id, publicUrl);
  const [status, setStatus] = useState("");
  const [manual, setManual] = useState(false);
  const [busy, setBusy] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  async function share() {
    if (busy) return;
    setBusy(true);
    try {
      const outcome = await shareResult(text, {
        share: navigator.share?.bind(navigator),
        clipboard: navigator.clipboard,
      });
      setManual(outcome === "manual");
      setStatus(
        outcome === "copied"
          ? "Resultado copiado! Agora é só compartilhar."
          : outcome === "shared"
            ? "Resultado compartilhado!"
            : outcome === "cancelled"
              ? "Compartilhamento cancelado. Seu resultado continua aqui."
              : "Selecione e copie o texto abaixo para compartilhar.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className={`${styles.gameCard} ${styles.result}`}
      aria-label="Resultado do quiz"
    >
      <span className={styles.resultIcon} aria-hidden="true">
        <Sparkles size={28} strokeWidth={1.4} />
      </span>
      <span className="eyebrow">QUIZ {category.title}</span>
      <div className={styles.score}>
        {score}
        <span>/100</span>
      </div>
      <p>
        Você acertou <strong>{correctCount(session)} de 10 perguntas</strong>{" "}
        sobre {category.title}!
      </p>
      <h1 ref={heading} tabIndex={-1}>
        {result.title}
      </h1>
      <p>{result.message}</p>
      <p className={styles.resultNote}>
        Sua conexão com a música vai além de qualquer pontuação.
      </p>
      <div className={styles.resultActions}>
        <button className={styles.primary} onClick={onReplay}>
          <RotateCcw size={16} aria-hidden="true" />
          Jogar novamente
        </button>
        <button className={styles.secondary} disabled={busy} onClick={share}>
          <Share2 size={16} aria-hidden="true" />
          {busy ? "Compartilhando…" : "Compartilhar"}
        </button>
      </div>
      <Link href="/jogos/quiz" className={styles.textLink}>
        Escolher outro quiz <ArrowRight size={16} aria-hidden="true" />
      </Link>
      <p role="status" className={styles.shareStatus}>
        {status}
      </p>
      {manual && (
        <textarea
          className={styles.copyText}
          aria-label="Resultado para copiar"
          readOnly
          value={text}
          onFocus={(e) => e.currentTarget.select()}
        />
      )}
      <p className={styles.replayNote}>
        São 10 perguntas nesta categoria. Ao reiniciar, o conteúdo é o mesmo; a
        ordem das perguntas e alternativas pode mudar.
      </p>
    </section>
  );
}

function QuizQuestionScreen({
  session,
  category,
  onAnswer,
  onNext,
}: {
  session: QuizSession;
  category: QuizCategory;
  onAnswer: (questionId: string, answerId: string) => void;
  onNext: () => void;
}) {
  const q = session.questions[session.current],
    answer = session.answers[q.id];
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [q.id]);
  const correctTitle = q.options.find((o) => o.id === q.correctAnswerId)!.title;
  return (
    <section
      className={styles.gameCard}
      aria-label={`Partida do quiz ${category.title}`}
    >
      <div className={styles.gameTop}>
        <span>QUIZ {category.title}</span>
        <span>{scoreGame(session)} pts</span>
      </div>
      <div className={styles.round}>
        <span>PERGUNTA {String(session.current + 1).padStart(2, "0")}</span>
        <span>{session.current + 1} de 10</span>
      </div>
      <progress
        className={styles.progress}
        aria-label="Perguntas respondidas"
        value={Object.keys(session.answers).length}
        max={10}
      />
      <div className={styles.questionHeading}>
        <span className={styles.questionMark} aria-hidden="true">
          ✦
        </span>
        <h1 ref={heading} tabIndex={-1}>
          {q.question}
        </h1>
      </div>
      <div role="group" aria-label="Alternativas" className={styles.options}>
        {q.options.map((option, index) => {
          const right = Boolean(answer) && q.correctAnswerId === option.id,
            wrong = answer === option.id && !right;
          return (
            <button
              key={option.id}
              className={`${styles.option} ${right ? styles.correct : ""} ${wrong ? styles.wrong : ""}`}
              aria-pressed={answer === option.id}
              aria-disabled={Boolean(answer)}
              onClick={() => onAnswer(q.id, option.id)}
            >
              <span aria-hidden="true" className={styles.letter}>
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option.title}</span>
              {right && (
                <>
                  <Check size={18} aria-hidden="true" />
                  <span className="sr-only">Resposta correta</span>
                </>
              )}
              {wrong && (
                <>
                  <X size={18} aria-hidden="true" />
                  <span className="sr-only">Sua resposta, incorreta</span>
                </>
              )}
            </button>
          );
        })}
      </div>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.feedback}
      >
        {answer && (
          <>
            <strong>
              {answer === q.correctAnswerId
                ? "Acertou! Mais uma conexão com essa história. 💜"
                : `Quase! A resposta era ${correctTitle}.`}
            </strong>
            <p>{q.explanation}</p>
            <a href={q.sourceUrl} target="_blank" rel="noopener noreferrer">
              Consultar a fonte ↗
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </>
        )}
      </div>
      <div className={styles.nextRow}>
        <span>Sem pressa para descobrir.</span>
        <button className={styles.primary} disabled={!answer} onClick={onNext}>
          {session.current === 9 ? "Ver resultado" : "Próxima pergunta"}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

export function QuizGame({
  category,
  publicUrl,
}: {
  category: QuizCategory;
  publicUrl?: string;
}) {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [error, setError] = useState("");
  // Randomization happens after hydration, never during the server render.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        setSession(startQuiz(quizQuestions, category.id));
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Este quiz está indisponível no momento.",
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [category.id]);
  function replay() {
    try {
      setSession(startQuiz(quizQuestions, category.id));
      setError("");
    } catch {
      setError(
        "Não foi possível reiniciar o quiz. Tente novamente mais tarde.",
      );
    }
  }
  return (
    <div className={`container ${styles.playPage}`}>
      <Link href="/jogos/quiz" className={`breadcrumb ${styles.back}`}>
        <ChevronLeft size={14} aria-hidden="true" />
        Escolher outro quiz
      </Link>
      {error ? (
        <section className={styles.gameCard} role="alert">
          <h1>Vamos tentar em outro momento?</h1>
          <p>{error}</p>
          <Link href="/jogos/quiz" className={styles.textLink}>
            Voltar aos quizzes
          </Link>
        </section>
      ) : !session ? (
        <section className={styles.gameCard} role="status">
          <p>Preparando suas 10 perguntas sobre {category.title}…</p>
        </section>
      ) : session.status === "finished" ? (
        <QuizResult
          session={session}
          category={category}
          publicUrl={publicUrl}
          onReplay={replay}
        />
      ) : (
        <QuizQuestionScreen
          session={session}
          category={category}
          onAnswer={(qid, aid) =>
            setSession((state) => state && answerQuestion(state, qid, aid))
          }
          onNext={() => setSession((state) => state && nextQuestion(state))}
        />
      )}
      <p className={styles.fanNote}>
        Feito por fãs, para fãs. Um quiz independente, sem vínculo oficial com
        BTS ou BIGHIT MUSIC.
      </p>
    </div>
  );
}
