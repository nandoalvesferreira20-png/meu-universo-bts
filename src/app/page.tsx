import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { ExperienceCard, SectionHeader } from "@/components/experience";
import { experiences, partnerUrl } from "@/data/portal";
import styles from "./home-tour.module.css";
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
          ● Army Pass, jogos, Emoji Challenge, História do BTS e ARIRANG TOUR:
          explore cada experiência.
        </p>
      </section>
      <section className="container tour-section">
        <div className={styles.photograph}>
          <Image
            src="/images/army-pass/gallery/arirang/arirang-01.jpg"
            alt="Os sete integrantes do BTS juntos em uma fotografia de estúdio da era ARIRANG."
            width={1600}
            height={1141}
            sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1200px) 50vw, 600px"
          />
        </div>
        <div className="tour-copy">
          <span className="eyebrow">ARIRANG TOUR</span>
          <h2>Conheça a ARIRANG TOUR</h2>
          <p>
            Acompanhe a trajetória do BTS pelos palcos do mundo, explore os
            momentos marcantes da turnê e reviva o retorno histórico do grupo.
          </p>
          <Link className="button button-primary" href="/arirang-tour">
            Explorar a turnê <ArrowRight size={17} />
          </Link>
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
