import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import { eraThemes } from "./themes";
import { eraIds, type EraId, type EraTheme } from "./types";
import styles from "./army-pass.module.css";

export function EraThemeCard({
  theme,
  selected,
  onSelect,
}: {
  theme: EraTheme;
  selected: boolean;
  onSelect: () => void;
}) {
  const style = {
    "--era-dark": theme.colors.dark,
    "--era-light": theme.colors.light,
    "--era-accent": theme.colors.accent,
    "--era-mid": theme.colors.mid,
  } as CSSProperties;
  return (
    <label
      className={`${styles.eraCard} ${selected ? styles.selected : ""}`}
      style={style}
      data-era={theme.id}
    >
      <input
        type="radio"
        name="era"
        value={theme.id}
        checked={selected}
        onChange={onSelect}
      />
      <span className={styles.eraCardTop}>
        <span>VOL. 0{eraIds.findIndex((id) => id === theme.id) + 1}</span>
        <span className={styles.eraSelection}>
          {selected ? (
            <>
              <Check size={12} aria-hidden="true" /> Sua escolha
            </>
          ) : (
            "Explorar"
          )}
        </span>
      </span>
      <span className={styles.eraCardArt} aria-hidden="true">
        {theme.id === "arirang" ? (
          <span className={styles.arirangPreview}>
            <span className={styles.arirangPreviewHeader}>
              <span>ARMY PASS · BRASIL</span>
              <span>VOL. 04 / 2026</span>
            </span>
            <span className={styles.arirangPreviewRule} />
            <span className={styles.arirangPreviewLogo} />
            <span className={styles.arirangPreviewFooter}>
              <span>RAÍZES · CAMINHOS · MEMÓRIAS</span>
              <span className={styles.arirangPreviewMark} />
            </span>
          </span>
        ) : (
          <span>
            {theme.id === "wings"
              ? "WINGS"
              : theme.id === "map-of-the-soul"
                ? "MAP OF THE SOUL: 7"
                : "MAP OF THE SOUL: PERSONA"}
          </span>
        )}
      </span>
      <span className={styles.eraCardTitle}>{theme.name}</span>
      <span className={styles.eraCardCaption}>{theme.caption}</span>
      <span className={styles.eraSwatches} aria-hidden="true">
        {Object.values(theme.colors).map((color) => (
          <span key={color} style={{ backgroundColor: color }} />
        ))}
      </span>
      <span className={styles.eraMood}>
        {theme.id === "wings"
          ? "Modelo aprovado · monocromático"
          : theme.id === "map-of-the-soul"
            ? "Modelo aprovado · azul e lilás"
            : theme.id === "persona"
              ? "Modelo aprovado · rosa e coral"
              : "Edição especial · editorial"}
      </span>
    </label>
  );
}

export function EraSelector({
  era,
  onChange,
}: {
  era: EraId;
  onChange: (era: EraId) => void;
}) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        Qual era do BTS representa você?
      </legend>
      <p className={styles.hint}>
        Cada era, um jeito de sentir. Escolha a primeira peça da sua coleção.
      </p>
      <div className={styles.eraGrid}>
        {eraIds.map((id) => (
          <EraThemeCard
            key={id}
            theme={eraThemes[id]}
            selected={era === id}
            onSelect={() => onChange(id)}
          />
        ))}
      </div>
    </fieldset>
  );
}
