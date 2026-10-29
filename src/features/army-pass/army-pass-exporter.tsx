"use client";
import {
  Copy,
  Download,
  Share2,
  Pencil,
  Shuffle,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { canSharePass, downloadPass, exportArmyPass } from "./export";
import { armyPassCaption, armyPassShareData } from "./share-caption";
import type { PassModel } from "./types";
import styles from "./army-pass.module.css";

export function ArmyPassShareActions({
  file,
  onEdit,
  onEra,
}: {
  file: File;
  onEdit: () => void;
  onEra: () => void;
}) {
  const [message, setMessage] = useState("");
  const [sharing, setSharing] = useState(false);
  const [copying, setCopying] = useState(false);
  const [manualCopy, setManualCopy] = useState(false);
  const caption = armyPassCaption(process.env.NEXT_PUBLIC_SITE_URL);
  const shareSupported = canSharePass(file);
  async function copyCaption() {
    setCopying(true);
    setMessage("");
    try {
      await navigator.clipboard.writeText(caption);
      setManualCopy(false);
      setMessage(
        "Legenda copiada! Cole na sua publicação para marcar os perfis. 💜",
      );
    } catch {
      setManualCopy(true);
      setMessage(
        "Não foi possível copiar automaticamente. Selecione e copie a legenda abaixo.",
      );
    } finally {
      setCopying(false);
    }
  }
  async function share() {
    setSharing(true);
    setMessage("");
    try {
      // Arquivo já preparado: a chamada preserva a ativação do clique no mobile.
      await navigator.share(
        armyPassShareData(file, caption, (data) => navigator.canShare(data)),
      );
      setMessage("Army Pass entregue ao compartilhamento do seu dispositivo.");
    } catch (error) {
      setMessage(
        error instanceof Error && error.name === "AbortError"
          ? "Compartilhamento cancelado. Seu passaporte continua disponível."
          : "Não foi possível compartilhar por aqui. Baixe o PNG e compartilhe manualmente.",
      );
    } finally {
      setSharing(false);
    }
  }
  return (
    <>
      <div className={styles.exportActions}>
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            downloadPass(file);
            setMessage(
              "Download iniciado. Se o navegador abrir a imagem, use a opção de salvar no dispositivo.",
            );
          }}
        >
          <Download size={18} /> Baixar meu Army Pass
        </button>
        {shareSupported && (
          <button
            type="button"
            className="button button-outline"
            onClick={() => void share()}
            disabled={sharing}
          >
            <Share2 size={18} />
            {sharing ? "Compartilhando…" : "Compartilhar Army Pass"}
          </button>
        )}
      </div>
      <div className={styles.sharePrompt}>
        <p>
          Compartilhou seu Army Pass? Marque{" "}
          <a
            href="https://www.instagram.com/meuuniversobts/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @meuuniversobts
          </a>{" "}
          e{" "}
          <a
            href="https://www.instagram.com/fernandev.tech/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @fernandev.tech
          </a>{" "}
          para a gente ver! 💜
        </p>
        <button
          type="button"
          className={styles.smallButton}
          onClick={() => void copyCaption()}
          disabled={copying}
        >
          <Copy size={15} aria-hidden="true" />
          {copying ? "Copiando…" : "Copiar legenda"}
        </button>
        <p className={styles.captionHint}>
          Alguns apps podem não incluir a legenda. Copie e cole o texto na
          publicação.
        </p>
        {manualCopy && (
          <textarea
            className={styles.captionFallback}
            aria-label="Legenda para copiar manualmente"
            value={caption}
            readOnly
            rows={6}
            onFocus={(event) => event.currentTarget.select()}
          />
        )}
      </div>
      {!shareSupported && (
        <p className={styles.hint}>
          Este navegador não oferece compartilhamento de arquivos. Baixe seu
          Army Pass e compartilhe o PNG manualmente no app que preferir.
        </p>
      )}
      <p role="status" className={styles.actionMessage}>
        {message}
      </p>
      <div className={styles.editActions}>
        <button type="button" className={styles.smallButton} onClick={onEdit}>
          <Pencil size={16} /> Editar passaporte
        </button>
        <button type="button" className={styles.smallButton} onClick={onEra}>
          <Shuffle size={16} /> Experimentar outra era
        </button>
      </div>
    </>
  );
}

export function ArmyPassExporter({
  model,
  onEdit,
  onEra,
}: {
  model: PassModel;
  onEdit: () => void;
  onEra: () => void;
}) {
  const [result, setResult] = useState<{ model: PassModel; file: File } | null>(
    null,
  );
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    exportArmyPass(model)
      .then((file) => {
        if (active) {
          setResult({ model, file });
          setError("");
        }
      })
      .catch((reason) => {
        if (active)
          setError(
            reason instanceof Error
              ? reason.message
              : "Não foi possível gerar o PNG.",
          );
      });
    return () => {
      active = false;
    };
  }, [model, retry]);
  const file = result?.model === model ? result.file : null;
  return (
    <section className={styles.exportPanel}>
      <span className="eyebrow">FEITO PARA GUARDAR</span>
      <h2>
        Uma memória só sua.
        <br />
        <em>Pronta para ir com você.</em>
      </h2>
      <p>
        Seu Army Pass em alta resolução, com a era, os detalhes e o
        enquadramento automático da fotografia selecionada.
      </p>
      {file ? (
        <ArmyPassShareActions file={file} onEdit={onEdit} onEra={onEra} />
      ) : error ? (
        <div role="alert">
          <p>{error}</p>
          <button
            type="button"
            className={styles.smallButton}
            onClick={() => {
              setError("");
              setRetry((previous) => previous + 1);
            }}
          >
            <RotateCcw size={15} /> Tentar gerar novamente
          </button>
          <button type="button" className={styles.smallButton} onClick={onEdit}>
            Voltar à edição
          </button>
        </div>
      ) : (
        <p role="status">Preparando seu PNG em 1080 × 1920…</p>
      )}
      <p className={styles.privacy}>
        O arquivo fica no seu dispositivo. O compartilhamento abre as opções
        disponíveis no seu aparelho; não publica diretamente no Instagram.
      </p>
    </section>
  );
}
