"use client";
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from "lucide-react";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { armyPassSchema } from "@/lib/validation";
import { SectionHeader } from "@/components/experience";
import { ArmyPassForm, type FieldErrors } from "./army-pass-form";
import { ArmyPassPreview } from "./army-pass-preview";
import { ArmyPassExporter } from "./army-pass-exporter";
import { EraSelector } from "./era-selector";
import {
  PhotoSourceSelector,
  processPersonalPhoto,
} from "./photo-source-selector";
import {
  builderReducer,
  defaultCrop,
  initialBuilderState,
  type BuilderAction,
  type BuilderState,
} from "./state";
import { initialCropForPhoto, photosForEra } from "./themes";
import { PhotoSession } from "./photo-session";
import type { PassModel } from "./types";
import styles from "./army-pass.module.css";

const steps = ["Escolha sua era", "Personalize", "Visualize", "Compartilhe"];

function reduceBuilderState(
  state: BuilderState,
  action: BuilderAction,
): BuilderState {
  return builderReducer(state, action);
}

export function ArmyPassBuilder() {
  const [state, dispatch] = useReducer(reduceBuilderState, initialBuilderState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [photoSession] = useState(() => new PhotoSession());
  const heading = useRef<HTMLDivElement>(null);
  useEffect(() => () => photoSession.clear(), [photoSession]);

  async function upload(file: File) {
    const generation = photoSession.begin();
    setBusy(true);
    setNotice("");
    try {
      const photo = await processPersonalPhoto(file);
      if (!photoSession.accept(generation, photo)) return;
      dispatch({ type: "photo", photo });
    } catch (error) {
      if (photoSession.isCurrent(generation))
        setNotice(
          error instanceof Error
            ? error.message
            : "Não foi possível processar a foto.",
        );
    } finally {
      if (photoSession.isCurrent(generation)) setBusy(false);
    }
  }
  function removePhoto() {
    photoSession.clear();
    setBusy(false);
    dispatch({ type: "photo", photo: null });
    setNotice("");
  }
  const galleryPhoto = photosForEra(state.era).find(
    (photo) => photo.id === state.galleryId,
  );
  const provisional = false;
  const model: PassModel = useMemo(
    () => ({
      era: state.era,
      fields: state.fields,
      source: galleryPhoto ? "gallery" : "artwork",
      artwork: 0,
      imageUrl: galleryPhoto?.path ?? null,
      crop: galleryPhoto ? initialCropForPhoto(galleryPhoto) : defaultCrop,
      imageFitMode: galleryPhoto?.fitMode ?? "cover",
      imageCredit: galleryPhoto?.credit,
      personalPhoto: state.photo
        ? { url: state.photo.url, crop: defaultCrop }
        : undefined,
    }),
    [state.era, state.fields, state.photo, galleryPhoto],
  );

  function goTo(step: number) {
    dispatch({ type: "step", step });
    setNotice("");
    requestAnimationFrame(() => {
      const target =
        step === 3 && window.matchMedia("(max-width: 980px)").matches
          ? document.getElementById("army-pass-preview")
          : heading.current;
      target?.focus();
      target?.scrollIntoView({ behavior: "instant", block: "start" });
    });
  }
  function next() {
    setNotice("");
    if (state.step >= 2) {
      const result = armyPassSchema.safeParse(state.fields);
      if (!result.success) {
        const nextErrors: FieldErrors = {};
        result.error.issues.forEach((issue) => {
          const key = issue.path[0] as keyof FieldErrors;
          nextErrors[key] ??= issue.message;
        });
        setErrors(nextErrors);
        setNotice("Confira os campos indicados antes de continuar.");
        if (state.step !== 2) dispatch({ type: "step", step: 2 });
        requestAnimationFrame(() =>
          document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
        );
        return;
      }
      setErrors({});
      if (busy) {
        setNotice("Aguarde o processamento da foto.");
        return;
      }
    }
    goTo(state.step + 1);
  }
  return (
    <div className={styles.builder} data-step={state.step}>
      <nav aria-label="Etapas do Army Pass">
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li
              key={step}
              aria-current={state.step === index + 1 ? "step" : undefined}
            >
              <span className={styles.stepNumber}>
                {state.step > index + 1 ? (
                  <Check size={15} aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </nav>
      <a href="#army-pass-preview" className={styles.previewShortcut}>
        Ver meu passaporte ↓
      </a>
      <div className={styles.workspace}>
        {state.step === 3 && (
          <ArmyPassPreview model={model} provisional={provisional} />
        )}
        <div id="army-pass-editor" className={styles.editor}>
          <div ref={heading} tabIndex={-1} className={styles.stepHeading}>
            <span>SEU ATELIÊ DE MEMÓRIAS</span>
            <span>
              0{state.step} <span aria-hidden="true">—</span> 04
            </span>
          </div>
          {state.step === 1 && (
            <>
              <EraSelector
                era={state.era}
                onChange={(era) => dispatch({ type: "era", era })}
              />
              <div className={styles.localNote}>
                <LockKeyhole size={18} />
                <p>
                  Só seu, desde o primeiro detalhe. Sem cadastro e com
                  processamento no seu dispositivo.
                </p>
              </div>
            </>
          )}
          {state.step === 2 && (
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                next();
              }}
            >
              <PhotoSourceSelector
                state={state}
                dispatch={dispatch}
                onUpload={(file) => void upload(file)}
                onRemove={removePhoto}
                busy={busy}
              />
              <ArmyPassForm
                fields={state.fields}
                errors={errors}
                onChange={(fields) => {
                  dispatch({ type: "fields", fields });
                  setErrors({});
                }}
              />
              <button type="submit" className={styles.srOnly} tabIndex={-1}>
                Revisar passaporte
              </button>
            </form>
          )}
          {state.step === 3 && (
            <>
              <SectionHeader
                eyebrow="ESSE PASS TEM A SUA CARA"
                title="Os detalhes fazem a memória."
                description="Confira seu nome e seus detalhes na prévia. Ajuste a imagem por aqui ou volte para editar seus dados."
              />
              <PhotoSourceSelector
                state={state}
                dispatch={dispatch}
                onUpload={(file) => void upload(file)}
                onRemove={removePhoto}
                busy={busy}
              />
              <button
                type="button"
                className={styles.smallButton}
                onClick={() => goTo(2)}
              >
                Editar meus dados
              </button>
            </>
          )}
          {state.step === 4 && (
            <ArmyPassExporter
              model={model}
              onEdit={() => goTo(2)}
              onEra={() => goTo(1)}
            />
          )}
          {notice && (
            <p role="alert" className={styles.errorNotice}>
              {notice}
            </p>
          )}
          {state.step < 4 && (
            <div className={styles.stepActions}>
              {state.step > 1 && (
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => goTo(state.step - 1)}
                >
                  <ArrowLeft size={16} /> Voltar
                </button>
              )}
              <button
                type="button"
                className="button button-primary"
                disabled={busy}
                onClick={next}
              >
                {state.step === 1
                  ? "Personalizar meu pass"
                  : state.step === 2
                    ? "Revisar passaporte"
                    : "Preparar meu PNG"}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
        {state.step !== 3 && (
          <ArmyPassPreview model={model} provisional={provisional} />
        )}
      </div>
    </div>
  );
}
