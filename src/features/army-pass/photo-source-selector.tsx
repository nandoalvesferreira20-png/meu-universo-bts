/* Imagens locais/blob precisam manter seus pixels no dispositivo, sem o otimizador de imagens do servidor. */
/* eslint-disable @next/next/no-img-element */
import { Images, Upload, Trash2, Check } from "lucide-react";
import { useRef, useState, type Dispatch } from "react";
import { eraThemes, photosForEra } from "./themes";
import { processPersonalPhoto } from "./image-processing";
import { PhotoCropper } from "./photo-cropper";
import type { BuilderAction, BuilderState } from "./state";
import type { EraId } from "./types";
import styles from "./army-pass.module.css";

export function EraPhotoGallery({
  era,
  selectedId,
  onSelect,
}: {
  era: EraId;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const photos = photosForEra(era);
  const [failed, setFailed] = useState<string[]>([]);
  if (!photos.length)
    return (
      <div className={styles.galleryEmpty}>
        <Images size={30} strokeWidth={1} />
        <h3>Novas imagens, em breve.</h3>
        <p>
          A galeria de {eraThemes[era].name} receberá fotografias com
          autorização de uso. Enquanto isso, o espaço do grupo recebe um
          preenchimento abstrato. Sua foto pessoal é opcional e ocupa outra
          área.
        </p>
      </div>
    );
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.subheading}>
        Fotografias disponíveis de {eraThemes[era].name}
      </legend>
      <div className={styles.artGrid}>
        {photos.map((photo) => (
          <div key={photo.id} className={styles.galleryItem}>
            {failed.includes(photo.id) ? (
              <p role="status">
                Imagem indisponível. Escolha outra fotografia ou uma arte.
              </p>
            ) : (
              <label
                className={`${styles.artOption} ${selectedId === photo.id ? styles.selected : ""}`}
              >
                <input
                  type="radio"
                  name="gallery-photo"
                  aria-label={photo.description}
                  id={`gallery-${photo.id}`}
                  checked={selectedId === photo.id}
                  onChange={() => onSelect(photo.id)}
                />
                <span className={styles.galleryThumbnail}>
                  <img
                    src={photo.path}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() =>
                      setFailed((previous) => [...previous, photo.id])
                    }
                    width="216"
                    height="122"
                    style={{
                      objectFit: photo.fitMode,
                      objectPosition: `${photo.objectPositionX}% ${photo.objectPositionY}%`,
                    }}
                  />
                </span>
                {selectedId === photo.id && (
                  <span
                    className={styles.gallerySelectionMark}
                    aria-hidden="true"
                  >
                    <Check size={14} />
                  </span>
                )}
              </label>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}

// O estado e o ciclo de vida da imagem pertencem ao gerador, para sobreviver às etapas.
export function PersonalPhotoUploader({
  state,
  onUpload,
  onRemove,
  busy,
}: {
  state: BuilderState;
  onUpload: (file: File) => void;
  onRemove: () => void;
  busy: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className={styles.uploadPanel}>
      {state.photo && (
        <img
          className={styles.uploadThumbnail}
          src={state.photo.url}
          alt="Sua foto selecionada, antes do recorte"
          width="120"
          height="120"
        />
      )}
      <div>
        <h3>
          {state.photo
            ? "Sua foto, seu universo."
            : "Escolha uma foto que é a sua cara."}
        </h3>
        <p className={styles.hint}>
          JPEG, PNG ou WebP · até 10 MB · até 40 megapixels
        </p>
        <input
          ref={input}
          id="personal-photo"
          className={styles.fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) onUpload(file);
          }}
        />
        <label
          className={`${styles.smallButton} ${busy ? styles.disabled : ""}`}
          htmlFor="personal-photo"
        >
          <Upload size={16} />
          {busy
            ? "Processando foto…"
            : state.photo
              ? "Trocar foto"
              : "Selecionar foto do dispositivo"}
        </label>
        {state.photo && (
          <button
            type="button"
            className={styles.smallButton}
            onClick={onRemove}
          >
            <Trash2 size={15} /> Remover foto
          </button>
        )}
      </div>
    </div>
  );
}

export { processPersonalPhoto };
export function PhotoSourceSelector({
  state,
  dispatch,
  onUpload,
  onRemove,
  busy,
}: {
  state: BuilderState;
  dispatch: Dispatch<BuilderAction>;
  onUpload: (file: File) => void;
  onRemove: () => void;
  busy: boolean;
}) {
  return (
    <section className={styles.imageSection} aria-labelledby="image-heading">
      <h2 id="image-heading" className={styles.legend}>
        Personalize a imagem do seu Army Pass
      </h2>
      <div className={styles.sourcePanel}>
        <h3>Escolha sua foto do BTS</h3>
        <p className={styles.hint}>
          Selecione uma das fotografias disponíveis da sua era favorita.
        </p>
        <EraPhotoGallery
          key={state.era}
          era={state.era}
          selectedId={state.galleryId}
          onSelect={(id) => dispatch({ type: "gallery", id })}
        />
      </div>
      <div className={styles.sourcePanel}>
        <h3>2. Sua foto · opcional</h3>
        <p className={styles.hint}>
          {state.era === "wings" ||
          state.era === "map-of-the-soul" ||
          state.era === "persona" ||
          state.era === "arirang"
            ? "Sua imagem ocupa o círculo inferior, sem substituir a foto do grupo."
            : "Modelo provisório: sua foto aparece na janela principal quando a galeria não está selecionada."}
        </p>
        <PersonalPhotoUploader
          state={state}
          busy={busy}
          onUpload={onUpload}
          onRemove={onRemove}
        />
        {state.photo && (
          <PhotoCropper
            crop={state.personalCrop}
            onChange={(crop) => dispatch({ type: "personal-crop", crop })}
          />
        )}
      </div>
      {state.era === "wings" && (
        <p className={styles.hint}>
          Os espaços das marcas BTS e WINGS estão reservados. Aguardamos os
          arquivos originais com autorização de uso.
        </p>
      )}
      {state.era === "map-of-the-soul" && (
        <p className={styles.hint}>
          As áreas da marca BTS e do 7 multicolorido estão reservadas. Até
          recebermos os arquivos originais autorizados, usamos identificação
          tipográfica.
        </p>
      )}
      {state.era === "persona" && (
        <p className={styles.hint}>
          As marcas BTS e PERSONA aguardam os arquivos originais autorizados. A
          composição usa identificação tipográfica e corações decorativos
          autorais.
        </p>
      )}
      <p className={styles.privacy}>
        Sua foto é processada apenas no seu dispositivo e não é enviada para
        nossos servidores.
      </p>
    </section>
  );
}
