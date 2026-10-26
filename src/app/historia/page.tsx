import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HistoryTimeline } from "@/features/history/history-timeline";
import { brazilSource, historySources } from "@/data/bts-history";
import styles from "@/features/history/history.module.css";
export const metadata: Metadata = {
  title: { absolute: "História do BTS | De 2013 a ARIRANG — Army Pass Brasil" },
  description:
    "Explore a história do BTS de 2013 a 2026 em 14 capítulos: músicas, encontros, caminhos individuais e o retorno com ARIRANG. Uma jornada independente feita para ARMYs.",
};
function HistoryHero() {
  return (
    <header className={styles.hero}>
      <Link className="breadcrumb" href="/">
        Início / História do BTS
      </Link>
      <div className={styles.heroGrid}>
        <div>
          <span className="eyebrow">Memórias que nos conectam</span>
          <h1>
            BTS: A história de <em>sete sonhos</em>
          </h1>
          <p>
            De sete jovens com um sonho a uma história que conectou milhões de
            corações pelo mundo.
          </p>
          <a className={styles.cta} href="#linha-do-tempo">
            Explore nossa história <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
        <figure className={styles.heroPhoto}>
          <Image
            src="/images/army-pass/gallery/arirang/arirang-01.jpg"
            alt="Os sete integrantes do BTS reunidos em figurinos escuros na era ARIRANG"
            width={1600}
            height={1141}
            sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1200px) 44vw, 500px"
            preload
          />
          <figcaption>
            <span>2013 — 2026</span>
            <p>
              Sete caminhos.
              <br />
              Uma história que também é nossa.
            </p>
          </figcaption>
        </figure>
      </div>
      <div className={styles.heroFoot}>
        <span>Da primeira apresentação a ARIRANG</span>
        <span>Uma jornada em música e memória</span>
      </div>
    </header>
  );
}
function HistorySources() {
  return (
    <section className={styles.sources} aria-labelledby="sources-title">
      <span className="eyebrow">Para ir além</span>
      <h2 id="sources-title">Uma história com referências.</h2>
      <p>
        Recorte histórico até 26 de outubro de 2026. Os acontecimentos se apoiam
        nas fontes abaixo; as conexões emocionais são leituras editoriais deste
        projeto independente de fãs. Cada capítulo também reúne suas
        referências.
      </p>
      <details>
        <summary>Consultar as fontes da jornada</summary>
        <ul>
          {historySources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.label} <ArrowUpRight size={14} aria-hidden="true" />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
export default function Page() {
  return (
    <div className={`container ${styles.page}`}>
      <HistoryHero />
      <HistoryTimeline />
      <section className={styles.brazil} aria-labelledby="brasil-title">
        <div>
          <span className="eyebrow">Um lugar nesta história</span>
          <h2 id="brasil-title">
            Do outro lado do mundo.
            <br />
            <em>Aqui, no Brasil.</em>
          </h2>
        </div>
        <div>
          <span className={styles.date}>25 & 26 MAI · 2019 · SÃO PAULO</span>
          <p>
            A turnê LOVE YOURSELF: SPEAK YOURSELF chegou ao Allianz Parque em
            duas noites de maio de 2019. A passagem por São Paulo faz parte da
            trajetória internacional do BTS e da memória da comunidade
            brasileira.
          </p>
          <p>
            Para quem esteve no estádio ou acompanhou de longe, lembrar esses
            encontros é uma forma de reconhecer o lugar das ARMYs brasileiras
            nesta conexão que atravessa idiomas.
          </p>
          <a href={brazilSource.url} target="_blank" rel="noopener noreferrer">
            Confira as datas · Prefeitura de São Paulo ↗
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
      </section>
      <HistorySources />
      <section className={styles.closing}>
        <span className="eyebrow">Ainda temos muito para viver</span>
        <h2>
          A história continua.
          <br />
          <em>E a ARMY faz parte dela.</em>
        </h2>
        <p>
          Cada pessoa chega em um momento diferente. Uma música abre a porta,
          uma lembrança cria raízes. Onde quer que a sua história tenha
          começado, há espaço para seguir junto.
        </p>
        <Link className={styles.cta} href="/army-pass">
          Crie seu Army Pass <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
