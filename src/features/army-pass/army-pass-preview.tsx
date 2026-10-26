"use client";
import { useEffect, useRef, useState } from "react";
import { preparePassImage } from "./export";
import { drawArmyPass, PASS_HEIGHT, PASS_WIDTH } from "./renderer";
import { eraThemes } from "./themes";
import { eraIds } from "./types";
import { useId, type CSSProperties } from "react";
import { Expand, X } from "lucide-react";
import type { PassModel } from "./types";
import styles from "./army-pass.module.css";

export function ArmyPassTemplate({ model }: { model: PassModel }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState({ loading: true, error: "" });
  useEffect(() => {
    let active = true;
    async function draw() {
      await Promise.resolve();
      if (!active) return;
      setStatus({ loading: true, error: "" });
      try {
        const image = await preparePassImage(model);
        if (!active) return;
        const context = canvas.current?.getContext("2d");
        if (!context)
          throw new Error("Não foi possível abrir a prévia neste navegador.");
        drawArmyPass(context, model, image);
        setStatus({ loading: false, error: "" });
      } catch (error) {
        if (active)
          setStatus({
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Não foi possível atualizar a prévia.",
          });
      }
    }
    void draw();
    return () => {
      active = false;
    };
  }, [model]);
  return (
    <div className={styles.canvasWrapper} aria-busy={status.loading}>
      <canvas
        ref={canvas}
        width={PASS_WIDTH}
        height={PASS_HEIGHT}
        className={styles.passCanvas}
        role="img"
        aria-label={`Army Pass de ${model.fields.displayName || "sua personalização"}, era ${eraThemes[model.era].name}. ${[model.fields.city, model.fields.state, model.fields.bias, model.fields.favoriteSong, model.fields.armySince, model.fields.experience === "Prefiro não informar" ? "" : model.fields.experience, model.fields.message].filter(Boolean).join(". ")}`}
      />
      {status.loading && (
        <span className={styles.previewStatus} role="status">
          Atualizando prévia…
        </span>
      )}
      {status.error && (
        <div className={styles.previewError} role="alert">
          {status.error}
          <p>Remova ou substitua a imagem para tentar novamente.</p>
        </div>
      )}
    </div>
  );
}

export function ArmyPassPreview({
  model,
  provisional,
}: {
  model: PassModel;
  provisional: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const theme = eraThemes[model.era];
  return (
    <aside
      id="army-pass-preview"
      tabIndex={-1}
      className={styles.preview}
      aria-label="Prévia do seu Army Pass"
      style={
        {
          "--preview-paper": theme.colors.light,
          "--preview-ink": theme.colors.dark,
          "--preview-accent": theme.colors.accent,
        } as CSSProperties
      }
    >
      <div className={styles.previewHeading}>
        <span>SEU PRÓXIMO COLECIONÁVEL</span>
        <span>VOL. 0{eraIds.findIndex((id) => id === model.era) + 1 || 3}</span>
      </div>
      <div className={styles.previewStage}>
        <ArmyPassTemplate model={model} />
      </div>
      <div className={styles.previewMeta}>
        <div>
          <span>EDIÇÃO {theme.name}</span>
          <p>Um pedacinho do seu universo.</p>
        </div>
        <button
          type="button"
          className={styles.previewZoom}
          aria-haspopup="dialog"
          aria-controls={id}
          aria-label="Ampliar passaporte"
          onClick={() => {
            setExpanded(true);
            dialog.current?.showModal();
          }}
        >
          <Expand size={17} />
        </button>
      </div>
      <p className={styles.previewCaption}>
        {provisional
          ? "Prévia com arte provisória. Selecione uma imagem para continuar."
          : "Prévia em tempo real · PNG em 1080 × 1920"}
      </p>
      <p className={styles.previewDisclaimer}>
        Criação independente de fãs. Sem vínculo oficial com BTS.
      </p>
      <a href="#army-pass-editor" className={styles.backToEditor}>
        Voltar à personalização ↑
      </a>
      <dialog
        id={id}
        ref={dialog}
        className={styles.passDialog}
        aria-label="Passaporte ampliado"
        onClose={() => setExpanded(false)}
      >
        <button
          type="button"
          className={styles.dialogClose}
          onClick={() => dialog.current?.close()}
          aria-label="Fechar passaporte ampliado"
        >
          <X size={20} />
        </button>
        {expanded && <ArmyPassTemplate model={model} />}
      </dialog>
    </aside>
  );
}
