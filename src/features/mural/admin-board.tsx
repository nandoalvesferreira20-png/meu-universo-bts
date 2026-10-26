"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Check,
  LoaderCircle,
  LogOut,
  Shield,
  Trash2,
  Undo2,
} from "lucide-react";
import type { AdminMessage } from "./contracts";
import styles from "./mural.module.css";
import adminStyles from "./admin-mural.module.css";

type AdminUser = { id: string; email: string };
type AdminReport = {
  id: string;
  message_id: string;
  reason: string;
  details: string | null;
  status: "pending" | "reviewed" | "dismissed";
  created_at: string;
  message: { nickname: string; message: string; status: string } | null;
};
type StatusFilter = "all" | "published" | "hidden" | "removed";
const reasonLabels: Record<string, string> = {
  spam: "Spam ou propaganda",
  harassment: "Ofensa ou assédio",
  inappropriate: "Conteúdo impróprio",
  personal_information: "Informações pessoais",
  other: "Outro motivo",
};

async function bodyOf(response: Response) {
  return (await response.json().catch(() => ({}))) as Record<string, unknown>;
}

export function AdminMuralBoard() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async (status: StatusFilter) => {
    const query = status === "all" ? "" : `?status=${status}`;
    const [messagesResponse, reportsResponse] = await Promise.all([
      fetch(`/api/mural/admin/messages${query}`, { cache: "no-store" }),
      fetch("/api/mural/admin/reports", { cache: "no-store" }),
    ]);
    const [messageBody, reportBody] = await Promise.all([
      bodyOf(messagesResponse),
      bodyOf(reportsResponse),
    ]);
    if (!messagesResponse.ok || !reportsResponse.ok)
      throw new Error(
        typeof messageBody.error === "string"
          ? messageBody.error
          : typeof reportBody.error === "string"
            ? reportBody.error
            : "Não foi possível carregar os dados de moderação.",
      );
    setMessages(messageBody.messages as AdminMessage[]);
    setReports(reportBody.reports as AdminReport[]);
  }, []);

  const checkSession = useCallback(async () => {
    setChecking(true);
    setError("");
    try {
      const response = await fetch("/api/mural/admin/session", {
        cache: "no-store",
      });
      const result = await bodyOf(response);
      if (response.ok && result.admin) {
        setAdmin(result.admin as AdminUser);
        await loadData("all");
      } else if (response.status !== 401) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Não foi possível verificar o acesso.",
        );
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível verificar o acesso.",
      );
    } finally {
      setChecking(false);
    }
  }, [loadData]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void checkSession(), 0);
    return () => window.clearTimeout(timeout);
  }, [checkSession]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/mural/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await bodyOf(response);
      if (!response.ok)
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Não foi possível autenticar.",
        );
      setAdmin(result.admin as AdminUser);
      setPassword("");
      await loadData(filter);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível autenticar.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function updateMessage(id: string, status: AdminMessage["status"]) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(
        `/api/mural/admin/messages/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      const result = await bodyOf(response);
      if (!response.ok)
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Não foi possível atualizar a publicação.",
        );
      await loadData(filter);
      setNotice("Status da publicação atualizado.");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível atualizar a publicação.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function updateReport(
    reportId: string,
    status: "reviewed" | "dismissed",
  ) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/mural/admin/reports", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reportId, status }),
      });
      const result = await bodyOf(response);
      if (!response.ok)
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Não foi possível atualizar a denúncia.",
        );
      await loadData(filter);
      setNotice("Denúncia atualizada.");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível atualizar a denúncia.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/mural/admin/session", {
        method: "DELETE",
      });
      const result = await bodyOf(response);
      if (!response.ok)
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Não foi possível encerrar a sessão.",
        );
      setAdmin(null);
      setMessages([]);
      setReports([]);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível encerrar a sessão.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function changeFilter(value: StatusFilter) {
    setFilter(value);
    setBusy(true);
    setError("");
    try {
      await loadData(value);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível filtrar as publicações.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (checking)
    return (
      <p className={adminStyles.loading} role="status">
        <LoaderCircle size={18} className={styles.spin} /> Verificando acesso…
      </p>
    );

  if (!admin)
    return (
      <section
        className={adminStyles.loginCard}
        aria-labelledby="admin-login-title"
      >
        <span className={adminStyles.loginIcon}>
          <Shield size={21} />
        </span>
        <h2 id="admin-login-title">Acesso da equipe</h2>
        <p>Entre com uma conta Supabase Auth autorizada para moderação.</p>
        <form className={adminStyles.loginForm} onSubmit={login}>
          <label className={styles.field}>
            <span>E-mail da equipe</span>
            <input
              type="email"
              autoComplete="username"
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className={styles.field}>
            <span>Senha</span>
            <input
              type="password"
              autoComplete="current-password"
              maxLength={1024}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && (
            <p className={styles.notice + " " + styles.error} role="alert">
              {error}
            </p>
          )}
          <button
            className={styles.publishButton}
            disabled={busy}
            type="submit"
          >
            {busy && <LoaderCircle size={17} className={styles.spin} />}
            Entrar na moderação
          </button>
        </form>
      </section>
    );

  return (
    <section className={adminStyles.dashboard} aria-labelledby="admin-title">
      <header className={adminStyles.header}>
        <div>
          <span className={adminStyles.badge}>
            <Shield size={14} /> ÁREA RESTRITA
          </span>
          <h2 id="admin-title">Moderação do mural</h2>
          <p>{admin.email}</p>
        </div>
        <button
          className={adminStyles.logout}
          type="button"
          onClick={() => void logout()}
          disabled={busy}
        >
          <LogOut size={16} /> Sair
        </button>
      </header>
      {error && (
        <p className={styles.notice + " " + styles.error} role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className={styles.notice + " " + styles.success} role="status">
          {notice}
        </p>
      )}
      <section
        className={adminStyles.section}
        aria-labelledby="admin-reports-title"
      >
        <div className={adminStyles.sectionHeading}>
          <h3 id="admin-reports-title">Denúncias</h3>
          <span>
            {reports.filter((report) => report.status === "pending").length}{" "}
            pendentes
          </span>
        </div>
        {reports.length === 0 ? (
          <p className={adminStyles.empty}>Nenhuma denúncia registrada.</p>
        ) : (
          <div className={adminStyles.items}>
            {reports.map((report) => (
              <article className={adminStyles.item} key={report.id}>
                <div className={adminStyles.itemTop}>
                  <strong>
                    {reasonLabels[report.reason] ?? report.reason}
                  </strong>
                  <span className={adminStyles.status}>{report.status}</span>
                </div>
                <p className={adminStyles.reportMessage}>
                  {report.message?.message ?? "Publicação indisponível"}
                </p>
                {report.details && (
                  <p className={adminStyles.details}>
                    Detalhes: {report.details}
                  </p>
                )}
                <p className={adminStyles.meta}>
                  {report.message?.nickname ?? "ARMY"} ·{" "}
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "medium",
                  }).format(new Date(report.created_at))}
                </p>
                {report.status === "pending" && (
                  <div className={adminStyles.actions}>
                    <button
                      type="button"
                      onClick={() => void updateReport(report.id, "reviewed")}
                      disabled={busy}
                    >
                      <Check size={15} /> Revisada
                    </button>
                    <button
                      type="button"
                      onClick={() => void updateReport(report.id, "dismissed")}
                      disabled={busy}
                    >
                      Dispensar
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section
        className={adminStyles.section}
        aria-labelledby="admin-messages-title"
      >
        <div className={adminStyles.sectionHeading}>
          <h3 id="admin-messages-title">Publicações</h3>
          <label className={adminStyles.filter}>
            <span>Filtrar</span>
            <select
              value={filter}
              onChange={(event) =>
                void changeFilter(event.target.value as StatusFilter)
              }
            >
              <option value="all">Todas</option>
              <option value="published">Publicadas</option>
              <option value="hidden">Ocultas</option>
              <option value="removed">Removidas</option>
            </select>
          </label>
        </div>
        {messages.length === 0 ? (
          <p className={adminStyles.empty}>Nenhuma publicação neste filtro.</p>
        ) : (
          <div className={adminStyles.items}>
            {messages.map((item) => (
              <article className={adminStyles.item} key={item.id}>
                <div className={adminStyles.itemTop}>
                  <strong>{item.nickname}</strong>
                  <span className={adminStyles.status}>
                    {item.status} · {item.reports_count} denúncias
                  </span>
                </div>
                <p className={adminStyles.reportMessage}>{item.message}</p>
                <p className={adminStyles.meta}>
                  {[item.city, item.state].filter(Boolean).join(" · ") ||
                    "Sem localização"}{" "}
                  ·{" "}
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "medium",
                  }).format(new Date(item.created_at))}
                </p>
                <div className={adminStyles.actions}>
                  {item.status !== "published" && (
                    <button
                      type="button"
                      onClick={() => void updateMessage(item.id, "published")}
                      disabled={busy}
                    >
                      <Undo2 size={15} /> Restaurar
                    </button>
                  )}
                  {item.status !== "hidden" && item.status !== "removed" && (
                    <button
                      type="button"
                      onClick={() => void updateMessage(item.id, "hidden")}
                      disabled={busy}
                    >
                      Ocultar
                    </button>
                  )}
                  {item.status !== "removed" && (
                    <button
                      type="button"
                      onClick={() => void updateMessage(item.id, "removed")}
                      disabled={busy}
                    >
                      <Trash2 size={15} /> Remover
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
