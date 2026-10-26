import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { TourTimeline } from "@/features/arirang-tour/tour-timeline";
import { seoulComeback as event } from "@/data/arirang-seoul";
import { EventCarousel } from "@/features/arirang-tour/event-carousel";
import styles from "@/features/arirang-tour/seoul-event.module.css";
export const metadata: Metadata = {
  title: "ARIRANG TOUR · O reencontro em Seul",
  description:
    "BTS THE COMEBACK LIVE | ARIRANG. Um memorial visual do especial de 21 de março de 2026, na Praça Gwanghwamun, transmitido mundialmente pela Netflix.",
};
export default function Page() {
  return (
    <article className={styles.chapter}>
      <div className={styles.inner}>
        <div className={styles.kicker}>
          <span>ARIRANG TOUR</span>
          <span>CAPÍTULO ESPECIAL · 01</span>
        </div>
        <header className={styles.hero}>
          <Image
            className={styles.logo}
            src="/images/army-pass/logos/arirang-logo-novo.jpeg"
            alt="ARIRANG"
            width={739}
            height={415}
            sizes="(max-width:760px) 280px, 420px"
          />
          <div>
            <p className={styles.eyebrow}>O REENCONTRO / 서울</p>
            <h1>{event.title}</h1>
            <p className={styles.subtitle}>{event.subtitle}</p>
            <p className={styles.location}>
              <strong>
                {event.venue} · {event.city}, {event.country}
              </strong>
              <time dateTime={event.date}>21 de março de 2026</time>
            </p>
            <p className={styles.broadcast}>
              Transmissão mundial em parceria com a <span>Netflix</span>
            </p>
          </div>
        </header>
        <section className={styles.intro} aria-labelledby="reencontro-title">
          <h2 id="reencontro-title">O mundo voltou a ouvir os sete, juntos.</h2>
          <p>{event.description}</p>
        </section>
        <EventCarousel images={event.images} />
        <p className={styles.sources}>
          Registro editorial independente. Fotografias: BIGHIT MUSIC / Netflix ©
          2026, direitos reservados. Imagens redimensionadas e convertidas para
          WebP, sem recorte.{" "}
          <a href={event.sourceUrls[0]} target="_blank" rel="noreferrer">
            Sobre o especial na Netflix ↗
          </a>
        </p>
        <Suspense
          fallback={<p>Carregando o percurso da ARIRANG WORLD TOUR…</p>}
        >
          <TourTimeline />
        </Suspense>
      </div>
    </article>
  );
}
