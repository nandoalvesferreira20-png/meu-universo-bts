"use client";
import Image from "next/image";
import { useState } from "react";
import {
  getHistoryPhoto,
  type AuthorizedHistoryPhoto,
} from "@/data/history-photos";
import styles from "./history.module.css";

function ChapterArtwork({
  year,
  era,
  index,
}: {
  year: number;
  era: string;
  index: number;
}) {
  return (
    <div className={styles.chapterArt} aria-hidden="true">
      <span>CAPÍTULO {String(index + 1).padStart(2, "0")}</span>
      <strong>{year}</strong>
      <span>{era}</span>
      <div className={styles.sevenLines}>
        {Array.from({ length: 7 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
    </div>
  );
}
function HistoricalPhotograph({
  photo,
  fallback,
}: {
  photo: AuthorizedHistoryPhoto;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return fallback;
  return (
    <figure className={styles.historyPhoto} data-photo-year={photo.year}>
      <div className={styles.photoFrame}>
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(max-width: 600px) 240px, 280px"
          loading="lazy"
          style={{ objectPosition: photo.objectPosition }}
          onError={() => setFailed(true)}
        />
      </div>
      <figcaption className={styles.photoCaption}>
        <p>
          <span className={styles.photoYear}>{photo.year}</span>
          {photo.description}
        </p>
        <p className={styles.photoAttribution}>
          ©{" "}
          <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">
            {photo.credit}
            <span className="sr-only"> · fonte (abre em nova aba)</span>
          </a>{" "}
          ·{" "}
          <a href={photo.license.url} target="_blank" rel="noopener noreferrer">
            {photo.license.name}
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </p>
        <details>
          <summary>Sobre esta imagem</summary>
          <p>{photo.changes}</p>
          <p>{photo.notes}</p>
          <a
            href={photo.authorizationEvidence}
            target="_blank"
            rel="noopener noreferrer"
          >
            Registro da licença ↗
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </details>
      </figcaption>
    </figure>
  );
}
export function HistoryChapterVisual({
  year,
  era,
  index,
  active,
}: {
  year: number;
  era: string;
  index: number;
  active: boolean;
}) {
  const photo = active ? getHistoryPhoto(year) : undefined;
  const artwork = <ChapterArtwork year={year} era={era} index={index} />;
  return photo ? (
    <HistoricalPhotograph key={year} photo={photo} fallback={artwork} />
  ) : (
    artwork
  );
}
