"use client";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronDown } from "lucide-react";
import { history, type HistoryEntry } from "@/data/bts-history";
import styles from "./history.module.css";
import { ReunionChapter } from "./reunion-chapter";
import { HistoryChapterVisual } from "./history-photograph";

export function HistoricalContent({ entry }: { entry: HistoryEntry }) {
  return (
    <div className={styles.content}>
      <p>{entry.story}</p>
      {entry.year >= 2022 && entry.year <= 2025 && (
        <a
          className={styles.specialLink}
          href="#capitulo-especial"
          onClick={() => {
            const details = document.getElementById("special-details");
            if (details instanceof HTMLDetailsElement) details.open = true;
          }}
        >
          Aprofunde este período: a pausa, o serviço e o reencontro ↓
        </a>
      )}
      <h4>Acontecimentos</h4>
      <ul>
        {entry.events.map((event) => (
          <li key={event}>{event}</li>
        ))}
      </ul>
      <dl className={styles.record}>
        <div>
          <dt>Para conhecer a fase</dt>
          <dd>{entry.album}</dd>
        </div>
        <div>
          <dt>Uma trilha para lembrar</dt>
          <dd>{entry.song}</dd>
        </div>
      </dl>
      <div className={styles.references}>
        <span>Explore nas fontes</span>
        {entry.sources.map((source) => (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {source.label}
            <ArrowUpRight size={14} aria-hidden="true" />
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        ))}
      </div>
    </div>
  );
}
export function HistoryTimeline() {
  const [active, setActive] = useState(2013);
  const [expanded, setExpanded] = useState(false);
  return (
    <section
      id="linha-do-tempo"
      className={styles.timeline}
      aria-labelledby="timeline-title"
    >
      <div className={styles.sectionHeading}>
        <div>
          <span className="eyebrow">14 capítulos · uma conexão</span>
          <h2 id="timeline-title">
            Cada ano, um novo <em>sentido.</em>
          </h2>
        </div>
        <p>
          Escolha um ano.
          <br />
          Encontre uma memória ou descubra um começo.
        </p>
      </div>
      <div className={styles.journey}>
        <nav className={styles.years} aria-label="Anos da história do BTS">
          {history.map((entry) => (
            <a
              key={entry.year}
              href={`#ano-${entry.year}`}
              aria-current={active === entry.year ? "step" : undefined}
              onClick={() => {
                setActive(entry.year);
                setExpanded(false);
              }}
            >
              <span>{entry.year}</span>
              <small>{entry.era}</small>
            </a>
          ))}
        </nav>
        <div className={styles.cards}>
          {history.map((entry, index) => (
            <article
              id={`ano-${entry.year}`}
              key={entry.year}
              className={`${styles.card} ${active === entry.year ? styles.active : ""}`}
            >
              <h3 className={styles.mobileTitle}>
                <button
                  aria-expanded={active === entry.year}
                  aria-controls={`mobile-content-${entry.year}`}
                  onClick={() => {
                    setActive(active === entry.year ? 0 : entry.year);
                    setExpanded(false);
                  }}
                >
                  <span>{entry.year}</span>
                  {entry.title}
                  <ChevronDown size={18} aria-hidden="true" />
                </button>
              </h3>
              <div
                id={`mobile-content-${entry.year}`}
                className={styles.cardBody}
              >
                <div className={styles.chapterLead}>
                  <div className={styles.chapterIntroduction}>
                    <div className={styles.chapterMarker}>
                      <span className={styles.chapterYear}>{entry.year}</span>
                      <span className={styles.chapterCounter}>
                        CAPÍTULO {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className={styles.articleHeading}>
                      <span className={styles.eraName}>{entry.era}</span>
                      <h3>{entry.title}</h3>
                      <p>{entry.summary}</p>
                    </div>
                    <button
                      className={styles.expand}
                      aria-expanded={expanded}
                      aria-controls={`story-${entry.year}`}
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? "Recolher capítulo" : "Ler este capítulo"}
                      <ArrowDown size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <HistoryChapterVisual
                    year={entry.year}
                    era={entry.era}
                    index={index}
                    active={active === entry.year}
                  />
                </div>
                <div id={`story-${entry.year}`} hidden={!expanded}>
                  {expanded && active === entry.year && (
                    <HistoricalContent entry={entry} />
                  )}
                </div>
                <div className={styles.chapterNavigation}>
                  <button
                    disabled={index === 0}
                    onClick={() => {
                      setActive(history[index - 1].year);
                      setExpanded(false);
                    }}
                  >
                    ← Anterior
                  </button>
                  <span aria-live="polite">{index + 1} / 14</span>
                  <button
                    disabled={index === history.length - 1}
                    onClick={() => {
                      setActive(history[index + 1].year);
                      setExpanded(false);
                    }}
                  >
                    Próximo →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <ReunionChapter />
    </section>
  );
}
