import Image from "next/image";
import { reunionChapter, serviceRecords } from "@/data/bts-history";
import styles from "./history.module.css";

function ServiceDate({ value }: { value: string }) {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
  return <time dateTime={value}>{formatted}</time>;
}

export function ReunionChapter() {
  return (
    <section
      id="capitulo-especial"
      className={styles.special}
      aria-labelledby="special-title"
    >
      <span className="eyebrow">Capítulo especial · 2022 — 2025</span>
      <h3 id="special-title">{reunionChapter.title}</h3>
      <p className={styles.specialIntro}>{reunionChapter.subtitle}</p>
      <details id="special-details" className={styles.specialDetails}>
        <summary>Explorar a pausa, o serviço e o reencontro</summary>
        <div className={styles.specialBody}>
          <section aria-labelledby="decision-title">
            <span className="eyebrow">01 · 2022</span>
            <h4 id="decision-title">A decisão</h4>
            <p>{reunionChapter.decision}</p>
          </section>
          <section aria-labelledby="departures-title">
            <span className="eyebrow">02 · 2022 a 2023</span>
            <h4 id="departures-title">Até logo, por enquanto</h4>
            <p>{reunionChapter.departures}</p>
            <ol
              className={styles.serviceGrid}
              aria-label="Trajetórias de serviço em ordem de início"
            >
              {serviceRecords.map((record) => (
                <li key={record.name} className={styles.serviceCard}>
                  {record.image && (
                    <Image
                      src={record.image.src}
                      alt={record.image.alt}
                      width={record.image.width}
                      height={record.image.height}
                      className={styles.serviceImage}
                    />
                  )}
                  <h5>{record.name}</h5>
                  <span className={styles.serviceKind}>
                    {record.kind === "alternative"
                      ? "Serviço social alternativo"
                      : "Serviço militar · Exército"}
                  </span>
                  <dl>
                    <div>
                      <dt>Início</dt>
                      <dd>
                        <ServiceDate value={record.start} />
                      </dd>
                    </div>
                    <div>
                      <dt>
                        Conclusão
                        {record.kind === "alternative" ? " oficial" : ""}
                      </dt>
                      <dd>
                        <ServiceDate value={record.end} />
                      </dd>
                    </div>
                  </dl>
                  <details className={styles.serviceSources}>
                    <summary>Fontes · {record.name}</summary>
                    {record.sources.map((source) => (
                      <a
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.label} ↗
                        <span className="sr-only"> (abre em nova aba)</span>
                      </a>
                    ))}
                  </details>
                </li>
              ))}
            </ol>
            <p className={styles.serviceNote}>
              Para SUGA, a data exibida é a conclusão oficial do serviço
              alternativo, em 21 de junho de 2025. O encerramento das atividades
              presenciais, antes dessa data, não altera esse marco.
            </p>
          </section>
          <section aria-labelledby="returns-title">
            <span className="eyebrow">03 · 2024 a 2025</span>
            <h4 id="returns-title">Os reencontros</h4>
            <p>{reunionChapter.returns}</p>
          </section>
          <section aria-labelledby="together-title">
            <span className="eyebrow">04 · 2025 → 2026</span>
            <h4 id="together-title">OT7 novamente</h4>
            <p>{reunionChapter.together}</p>
            <p className={styles.bridge}>
              Sete caminhos voltam a dividir o mesmo horizonte. A próxima página
              é ARIRANG.
            </p>
          </section>
          <div className={styles.references}>
            <span>Referências deste capítulo</span>
            {reunionChapter.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.label} ↗
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            ))}
          </div>
        </div>
      </details>
    </section>
  );
}
