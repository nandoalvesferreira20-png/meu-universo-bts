import { io } from "next/cache";
import { WorldTourGallery } from "./world-tour-gallery";
import {
  datedTourStops,
  groupTourMonths,
  monthLabel,
  tourSource,
  type DatedTourStop,
} from "@/data/arirang-tour";
import styles from "./tour-timeline.module.css";
const labels = {
  past: "Etapa encerrada",
  upcoming: "Na agenda",
  today: "Hoje, no horário local",
  "in-progress": "Em passagem",
};
const monthAbbreviations = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];
function StopDates({ stop }: { stop: DatedTourStop }) {
  return (
    <p className={styles.dates}>
      {stop.dates.map((date, index) => (
        <span key={date}>
          {index > 0 ? " · " : ""}
          <time
            dateTime={date}
            aria-label={`${date.slice(8)} de ${monthLabel(stop.month)} de 2026`}
          >
            {date.slice(8)}
          </time>
        </span>
      ))}{" "}
      <span>{monthAbbreviations[Number(stop.month.slice(5)) - 1]} 2026</span>
    </p>
  );
}
function TourStopItem({
  stop,
  nextId,
}: {
  stop: DatedTourStop;
  nextId?: string;
}) {
  const brazil = stop.id === "sao-paulo";
  return (
    <li
      data-tour-stop={stop.id}
      data-status={stop.status}
      className={`${styles.stop} ${brazil ? styles.brazil : ""}`}
    >
      <span className={styles.number} aria-hidden="true">
        {String(stop.order).padStart(2, "0")}
      </span>
      <div className={styles.place}>
        {brazil && (
          <p className={styles.eyebrow}>
            {nextId === stop.id
              ? stop.status === "upcoming"
                ? "PRÓXIMA PARADA"
                : "O CAPÍTULO BRASILEIRO"
              : "O CAPÍTULO BRASILEIRO"}
          </p>
        )}
        <h4>
          {stop.city}
          <span>
            {brazil ? ", " : ""}
            {stop.country}
          </span>
        </h4>
        <p className={styles.venue}>{stop.venue}</p>
      </div>
      <div className={styles.schedule}>
        <StopDates stop={stop} />
        <p className={styles.status}>{labels[stop.status]}</p>
      </div>
      {brazil && (
        <div className={styles.brazilClosing}>
          <p className={styles.message}>
            {stop.status === "upcoming"
              ? "Em breve, ARMYs 💜"
              : stop.status === "past"
                ? "Um capítulo para guardar, ARMYs 💜"
                : "É tempo de reencontro, ARMYs 💜"}
          </p>
          <p>
            {stop.status === "upcoming"
              ? "Depois de atravessar continentes, a ARIRANG WORLD TOUR chega ao Brasil para três noites que prometem entrar para a história das ARMYs brasileiras."
              : stop.status === "past"
                ? "São Paulo encerra este percurso da linha do tempo com três datas no Estádio do MorumBIS."
                : "São Paulo recebe o capítulo brasileiro da ARIRANG WORLD TOUR, com três datas no Estádio do MorumBIS."}
          </p>
        </div>
      )}
    </li>
  );
}
export function TourTimelineContent({ now }: { now: Date }) {
  const stops = datedTourStops(now);
  const next = stops.find((stop) => stop.status !== "past");
  return (
    <section className={styles.timeline} aria-labelledby="tour-timeline-title">
      <header className={styles.heading}>
        <p className={styles.eyebrow}>ARIRANG WORLD TOUR / 2026</p>
        <h2 id="tour-timeline-title">De Goyang ao mundo.</h2>
        <p className={styles.subtitle}>
          Uma turnê, diferentes cidades e milhões de histórias. Acompanhe o
          caminho do BTS pelos palcos do mundo até sua chegada ao Brasil.
        </p>
        <p className={styles.intro}>
          A turnê de estádios começou em Goyang, em 9 de abril de 2026. A partir
          da Coreia do Sul, o percurso conecta Ásia, América do Norte, Europa e
          América do Sul. Cada parada reúne suas datas em um único capítulo.
        </p>
        <p className={styles.note}>
          O especial da Netflix em Seul, em 21 de março, é um evento separado e
          não integra esta agenda da turnê de estádios.
        </p>
      </header>
      <div className={styles.summary}>
        <span>25 PARADAS</span>
        <span>62 APRESENTAÇÕES</span>
        <span>GOYANG → SÃO PAULO</span>
      </div>
      <div className={styles.months} data-world-timeline>
        {groupTourMonths(stops.filter((stop) => stop.id !== "sao-paulo")).map(
          (group) => (
            <section
              className={styles.month}
              key={group.month}
              aria-labelledby={`month-${group.month}`}
            >
              <h3 id={`month-${group.month}`} className={styles.monthTitle}>
                {monthLabel(group.month)}
                <span>2026</span>
              </h3>
              <ol className={styles.stops} start={group.stops[0].order}>
                {group.stops.map((stop) => (
                  <TourStopItem key={stop.id} stop={stop} nextId={next?.id} />
                ))}
              </ol>
            </section>
          ),
        )}
      </div>
      <p className={styles.source}>
        Datas e locais conferidos em 26 de outubro de 2026 na{" "}
        <a href={tourSource.url} target="_blank" rel="noreferrer">
          agenda oficial da BIGHIT MUSIC ↗
        </a>
        . Status calculado pelo dia local de cada cidade; horários de início e
        término não são presumidos. Recorte da programação até São Paulo.
      </p>
      <div className={styles.month}>
        <div aria-hidden="true" />
        <ol className={styles.stops} start={25}>
          <TourStopItem
            stop={stops.find((stop) => stop.id === "sao-paulo")!}
            nextId={next?.id}
          />
        </ol>
      </div>
      <WorldTourGallery />
    </section>
  );
}
export async function TourTimeline() {
  await io();
  return <TourTimelineContent now={new Date()} />;
}
