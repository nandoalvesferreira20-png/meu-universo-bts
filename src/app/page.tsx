import Link from "next/link";
import { ArrowRight, Heart, Ticket } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { ExperienceCard, SectionHeader } from "@/components/experience";
import { experiences, partnerUrl } from "@/data/portal";
export default function Home() {
  return (
    <>
      <HeroSection />
      <section id="experiencias" className="container section">
        <div className="section-title-row">
          <SectionHeader
            eyebrow="SEU PRÓXIMO DESTINO"
            title="Qual memória vamos criar hoje?"
            description="Um só lugar. Muitas formas de viver essa conexão."
          />
          <span className="section-side">EXPLORE O NOSSO UNIVERSO ↙</span>
        </div>
        <div className="experience-grid home-experiences">
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={experience.href}
              experience={experience}
              index={index}
            />
          ))}
        </div>
        <p className="development-note">
          ● Army Pass, jogos, História do BTS e ARIRANG TOUR: explore cada
          experiência.
        </p>
      </section>
      <section className="container tour-section">
        <div className="tour-art" aria-hidden="true">
          <div className="ticket">
            <Ticket size={34} strokeWidth={1} />
            <span>
              THE MOMENT
              <br />
              BECOMES A<br />
              <em>MEMORY.</em>
            </span>
            <div className="ticket-rule" />
            <small>ARIRANG TOUR — BRASIL</small>
          </div>
          <span className="art-star">✦</span>
          <span className="tour-art-note">EU ESTIVE AQUI. EU SENTI TUDO.</span>
        </div>
        <div className="tour-copy">
          <span className="eyebrow">ARIRANG TOUR</span>
          <h2>
            Alguns momentos
            <br />
            merecem ficar
            <br />
            <em>para sempre.</em>
          </h2>
          <p>
            A emoção do primeiro acorde. O brilho dos lightsticks. A voz que se
            encontra com tantas outras.
          </p>
          <p>
            Um espaço para guardar suas experiências nos shows e cinemas — e
            reviver tudo em comunidade.
          </p>
          <Link className="button button-primary" href="/arirang-tour">
            Conhecer a galeria <ArrowRight size={17} />
          </Link>
          <span className="small-note">
            Compartilhamento de fotos disponível em uma próxima fase.
          </span>
        </div>
      </section>
      <section className="community-section">
        <div className="container community-inner">
          <Heart size={38} strokeWidth={1} />
          <span className="eyebrow">FEITO EM COMUNIDADE</span>
          <h2>
            Quando a gente se encontra,
            <br />
            <em>o universo fica maior.</em>
          </h2>
          <p>
            O Army Pass Brasil nasce da vontade de transformar carinho em
            conexão. Um projeto independente feito por fãs, em colaboração com{" "}
            <a href={partnerUrl} target="_blank" rel="noreferrer">
              @meuuniversobts ↗
            </a>
            .
          </p>
          <Link className="text-link" href="/sobre">
            Conheça a nossa história <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
