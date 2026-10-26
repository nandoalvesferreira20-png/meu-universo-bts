import { RotateCcw } from "lucide-react";
import type { Crop } from "./types";
import { defaultCrop } from "./state";
import styles from "./army-pass.module.css";

export function PhotoCropper({
  idPrefix = "pass-photo",
  crop,
  onChange,
}: {
  idPrefix?: string;
  crop: Crop;
  onChange: (crop: Crop) => void;
}) {
  return (
    <fieldset className={styles.cropper}>
      <legend>Ajuste o enquadramento</legend>
      <p className={styles.hint}>
        Acompanhe o recorte na prévia do passaporte. Use os controles ou as
        setas do teclado.
      </p>
      <label htmlFor={`${idPrefix}-zoom`}>
        Zoom <output>{crop.zoom.toFixed(1)}×</output>
        <input
          id={`${idPrefix}-zoom`}
          type="range"
          min="1"
          max="3"
          step="0.05"
          value={crop.zoom}
          onChange={(e) => onChange({ ...crop, zoom: Number(e.target.value) })}
        />
      </label>
      <label htmlFor={`${idPrefix}-x`}>
        Posição horizontal <output>{Math.round(crop.x)}%</output>
        <input
          id={`${idPrefix}-x`}
          type="range"
          min="0"
          max="100"
          value={crop.x}
          onChange={(e) => onChange({ ...crop, x: Number(e.target.value) })}
        />
      </label>
      <label htmlFor={`${idPrefix}-y`}>
        Posição vertical <output>{Math.round(crop.y)}%</output>
        <input
          id={`${idPrefix}-y`}
          type="range"
          min="0"
          max="100"
          value={crop.y}
          onChange={(e) => onChange({ ...crop, y: Number(e.target.value) })}
        />
      </label>
      <button
        className={styles.smallButton}
        type="button"
        onClick={() => onChange(defaultCrop)}
      >
        <RotateCcw size={15} /> Centralizar e redefinir zoom
      </button>
    </fieldset>
  );
}
