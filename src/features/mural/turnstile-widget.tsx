"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import styles from "./mural.module.css";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "light";
      language: "pt-br";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileWidget({
  siteKey,
  action,
  onToken,
}: {
  siteKey: string;
  action: "mural_publish" | "mural_report";
  onToken: (token: string | null) => void;
}) {
  const id = useId();
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const tokenHandler = useRef(onToken);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    tokenHandler.current = onToken;
  }, [onToken]);

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !container.current || widgetId.current) return;
    setReady(true);
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      action,
      theme: "light",
      language: "pt-br",
      callback: (token) => tokenHandler.current(token),
      "expired-callback": () => tokenHandler.current(null),
      "error-callback": () => {
        tokenHandler.current(null);
        setFailed(true);
      },
    });
  }, [action, siteKey]);

  useEffect(() => {
    if (window.turnstile) renderWidget();
    return () => {
      if (widgetId.current && window.turnstile)
        window.turnstile.remove(widgetId.current);
      widgetId.current = null;
      tokenHandler.current(null);
    };
  }, [renderWidget]);

  if (!siteKey)
    return (
      <p className={styles.captchaNote} role="status">
        A verificação de segurança ainda não foi configurada.
      </p>
    );

  return (
    <div className={styles.captcha}>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderWidget}
        onError={() => setFailed(true)}
      />
      <div ref={container} id={`turnstile-${id}`} />
      {failed && (
        <p className={styles.captchaNote} role="alert">
          A verificação não carregou. Atualize a página e tente novamente.
        </p>
      )}
      {!ready && !failed && (
        <p className={styles.captchaNote} role="status">
          Carregando verificação de segurança…
        </p>
      )}
    </div>
  );
}
