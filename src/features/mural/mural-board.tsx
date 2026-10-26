"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Heart,
  LoaderCircle,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import {
  brazilianStates,
  reportReasons,
  type PublicMessage,
} from "./contracts";
import { TurnstileWidget } from "./turnstile-widget";
import styles from "./mural.module.css";

type MessagePage = {
  messages: PublicMessage[];
  page: number;
  hasMore: boolean;
  total: number;
};
type Notice = { kind: "success" | "error" | "info"; text: string };
const reportLabels: Record<(typeof reportReasons)[number], string> = {
  spam: "Spam ou propaganda",
  harassment: "Ofensa ou assédio",
  inappropriate: "Conteúdo impróprio",
  personal_information: "Informações pessoais",
  other: "Outro motivo",
};

async function responseBody(response: Response) {
  return (await response.json().catch(() => ({}))) as Record<string, unknown>;
}

export function MuralBoard({ siteKey }: { siteKey: string }) {
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listError, setListError] = useState("");
  const [nickname, setNickname] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [captchaVersion, setCaptchaVersion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [activeReport, setActiveReport] = useState<string | null>(null);

  const loadPage = useCallback(async (targetPage: number, append: boolean) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setListError("");
    try {
      const response = await fetch(`/api/mural/messages?page=${targetPage}`, {
        cache: "no-store",
      });
      const result = await responseBody(response);
      if (!response.ok)
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Não foi possível carregar o mural.",
        );
      const resultPage = result as unknown as MessagePage;
      setMessages((previous) => {
        if (!append) return resultPage.messages;
        const seen = new Set(previous.map((item) => item.id));
        return [
          ...previous,
          ...resultPage.messages.filter((item) => !seen.has(item.id)),
        ];
      });
      setPage(resultPage.page);
      setHasMore(resultPage.hasMore);
      setTotal(resultPage.total);
    } catch (error) {
      setListError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar o mural.",
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadPage(1, false), 0);
    return () => window.clearTimeout(timeout);
  }, [loadPage]);

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    if (!siteKey || !token) {
      setNotice({
        kind: "error",
        text: "Conclua a verificação de segurança antes de publicar.",
      });
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/mural/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nickname,
          city: city || null,
          state: state || null,
          message,
          turnstileToken: token,
        }),
      });
      const result = await responseBody(response);
      if (!response.ok && response.status !== 202)
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Não foi possível publicar. Seus dados continuam no formulário.",
        );
      if (result.status === "published" && result.message) {
        const published = result.message as PublicMessage;
        setMessages((previous) => [
          published,
          ...previous.filter((item) => item.id !== published.id),
        ]);
        setTotal((previous) => (previous === null ? null : previous + 1));
        setNotice({
          kind: "success",
          text: "Sua mensagem já faz parte do nosso universo roxo! 💜",
        });
      } else {
        setNotice({
          kind: "info",
          text:
            typeof result.message === "string"
              ? result.message
              : "Recebemos sua mensagem e ela está oculta para verificação.",
        });
      }
      setMessage("");
      setToken(null);
      setCaptchaVersion((previous) => previous + 1);
    } catch (error) {
      setNotice({
        kind: "error",
        text:
          error instanceof Error
            ? `${error.message} Seus dados continuam no formulário.`
            : "Não foi possível publicar. Seus dados continuam no formulário.",
      });
      setToken(null);
      setCaptchaVersion((previous) => previous + 1);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReport(
    event: FormEvent<HTMLFormElement>,
    messageId: string,
  ) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const reportToken = String(form.get("turnstileToken") ?? "");
    if (!reportToken) return;
    const reason = String(form.get("reason") ?? "");
    const details = String(form.get("details") ?? "").trim();
    const response = await fetch("/api/mural/reports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messageId,
        reason,
        details: details || null,
        turnstileToken: reportToken,
      }),
    });
    const result = await responseBody(response);
    if (!response.ok)
      throw new Error(
        typeof result.error === "string"
          ? result.error
          : "Não foi possível registrar sua denúncia.",
      );
    setActiveReport(null);
    setNotice({
      kind: "success",
      text:
        typeof result.message === "string"
          ? result.message
          : "Obrigada por ajudar a cuidar do mural.",
    });
  }

  return (
    <div className={styles.layout}>
      <section className={styles.intro} aria-labelledby="mural-title">
        <span className={styles.eyebrow}>NOSSO LUGAR DE ENCONTRO</span>
        <h2 id="mural-title">
          De ARMY para BTS <span aria-hidden="true">💜</span>
        </h2>
        <p>
          Milhares de histórias, um só amor. Deixe sua mensagem neste mural
          coletivo.
        </p>
      </section>

      <section className={styles.composer} aria-labelledby="compose-title">
        <div className={styles.sectionTitle}>
          <span className={styles.icon}>
            <Heart size={18} />
          </span>
          <div>
            <h2 id="compose-title">Deixe seu carinho</h2>
            <p>
              Compartilhe só o que você se sentir confortável em tornar público.
            </p>
          </div>
        </div>
        <form className={styles.form} onSubmit={publish}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>
                Seu apelido <b aria-hidden="true">*</b>
              </span>
              <input
                name="nickname"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                minLength={2}
                maxLength={40}
                autoComplete="nickname"
                required
              />
              <small>De 2 a 40 caracteres.</small>
            </label>
            <label className={styles.field}>
              <span>
                Cidade <small>(opcional)</small>
              </span>
              <input
                name="city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                maxLength={80}
                autoComplete="address-level2"
              />
            </label>
            <label className={styles.field}>
              <span>
                UF <small>(opcional)</small>
              </span>
              <select
                name="state"
                value={state}
                onChange={(event) => setState(event.target.value)}
              >
                <option value="">Selecione</option>
                {brazilianStates.map((uf) => (
                  <option key={uf}>{uf}</option>
                ))}
              </select>
            </label>
          </div>
          <label className={styles.field}>
            <span>
              Sua mensagem <b aria-hidden="true">*</b>
            </span>
            <textarea
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              minLength={10}
              maxLength={500}
              rows={5}
              required
              aria-describedby="message-counter message-help"
            />
            <span
              className={styles.counter}
              id="message-counter"
              aria-live="polite"
            >
              {message.length}/500
            </span>
            <small id="message-help">
              De 10 a 500 caracteres. Links não são permitidos.
            </small>
          </label>
          <TurnstileWidget
            key={captchaVersion}
            siteKey={siteKey}
            action="mural_publish"
            onToken={setToken}
          />
          <p className={styles.privacyNote}>
            <ShieldCheck size={16} aria-hidden="true" />
            Não compartilhe informações pessoais. As mensagens aprovadas pelos
            filtros ficam públicas.
          </p>
          {notice && (
            <p
              className={`${styles.notice} ${styles[notice.kind]}`}
              role={notice.kind === "error" ? "alert" : "status"}
            >
              {notice.text}
            </p>
          )}
          <button
            className={styles.publishButton}
            type="submit"
            disabled={submitting || !siteKey || !token}
          >
            {submitting ? (
              <LoaderCircle size={18} className={styles.spin} />
            ) : (
              <Send size={17} />
            )}
            {submitting ? "Enviando…" : "Publicar mensagem 💜"}
          </button>
        </form>
      </section>

      <section className={styles.wall} aria-labelledby="wall-title">
        <div className={styles.wallHeading}>
          <div className={styles.sectionTitle}>
            <span className={styles.icon}>
              <MessageCircle size={18} />
            </span>
            <div>
              <h2 id="wall-title">Mural da comunidade</h2>
              <p>
                {total === null
                  ? "Mensagens da comunidade, da mais recente para a mais antiga."
                  : `${total} ${total === 1 ? "mensagem publicada" : "mensagens publicadas"}`}
              </p>
            </div>
          </div>
          <button
            className={styles.refreshButton}
            type="button"
            onClick={() => void loadPage(1, false)}
            disabled={loading}
          >
            Atualizar
          </button>
        </div>

        {loading && (
          <p className={styles.emptyState} role="status">
            <LoaderCircle size={20} className={styles.spin} /> Carregando
            mensagens…
          </p>
        )}
        {!loading && listError && (
          <div className={styles.emptyState} role="alert">
            <p>{listError}</p>
            <button
              type="button"
              className={styles.textButton}
              onClick={() => void loadPage(1, false)}
            >
              Tentar novamente
            </button>
          </div>
        )}
        {!loading && !listError && messages.length === 0 && (
          <div className={styles.emptyState}>
            <Heart size={22} />
            <h3>Um mural esperando nossas histórias.</h3>
            <p>Quando houver mensagens publicadas, elas aparecerão aqui.</p>
          </div>
        )}
        {!loading && !listError && messages.length > 0 && (
          <>
            <div className={styles.messageList}>
              {messages.map((item) => (
                <article className={styles.messageCard} key={item.id}>
                  <span className={styles.cardHeart} aria-hidden="true">
                    <Heart size={16} />
                  </span>
                  <p className={styles.body}>{item.message}</p>
                  <footer className={styles.cardFooter}>
                    <span>
                      <strong>{item.nickname}</strong>
                      {(item.city || item.state) && (
                        <span className={styles.location}>
                          {[item.city, item.state].filter(Boolean).join(" · ")}
                        </span>
                      )}
                    </span>
                    <time dateTime={item.created_at}>
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "medium",
                      }).format(new Date(item.created_at))}
                    </time>
                  </footer>
                  <details
                    className={styles.report}
                    open={activeReport === item.id}
                    onToggle={(event) =>
                      setActiveReport(
                        (event.currentTarget as HTMLDetailsElement).open
                          ? item.id
                          : null,
                      )
                    }
                  >
                    <summary>Denunciar</summary>
                    {activeReport === item.id && (
                      <ReportForm
                        key={item.id}
                        messageId={item.id}
                        siteKey={siteKey}
                        onSubmit={submitReport}
                        onCancel={() => setActiveReport(null)}
                      />
                    )}
                  </details>
                </article>
              ))}
            </div>
            {hasMore && (
              <button
                type="button"
                className={styles.loadMore}
                disabled={loadingMore}
                onClick={() => void loadPage(page + 1, true)}
              >
                {loadingMore && (
                  <LoaderCircle size={17} className={styles.spin} />
                )}
                {loadingMore ? "Carregando…" : "Carregar mais mensagens"}
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function ReportForm({
  messageId,
  siteKey,
  onSubmit,
  onCancel,
}: {
  messageId: string;
  siteKey: string;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
    messageId: string,
  ) => Promise<void>;
  onCancel: () => void;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onSubmit(event, messageId);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível registrar sua denúncia.",
      );
      setVersion((previous) => previous + 1);
      setToken(null);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className={styles.reportForm} onSubmit={submit}>
      <label className={styles.field}>
        <span>Motivo</span>
        <select name="reason" required defaultValue="">
          <option value="" disabled>
            Selecione um motivo
          </option>
          {reportReasons.map((reason) => (
            <option key={reason} value={reason}>
              {reportLabels[reason]}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        <span>
          Detalhes <small>(opcional, até 300 caracteres)</small>
        </span>
        <textarea name="details" maxLength={300} rows={2} />
      </label>
      <input type="hidden" name="turnstileToken" value={token ?? ""} />
      <TurnstileWidget
        key={version}
        siteKey={siteKey}
        action="mural_report"
        onToken={setToken}
      />
      {error && (
        <p className={styles.notice + " " + styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.reportActions}>
        <button type="button" className={styles.textButton} onClick={onCancel}>
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.reportButton}
          disabled={busy || !token}
        >
          {busy ? "Enviando…" : "Enviar denúncia"}
        </button>
      </div>
    </form>
  );
}
