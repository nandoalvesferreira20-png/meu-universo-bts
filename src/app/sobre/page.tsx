import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Globe, Camera } from "lucide-react";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "SOBRE O PROJETO",
  description:
    "Uma experiência feita para a comunidade ARMY, em colaboração com o Meu Universo BTS e desenvolvida pela Loung Tech.",
};

function ExternalLink({
  href,
  children,
  primary = false,
  site = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  site?: boolean;
}) {
  const Icon = site ? Globe : Camera;
  return (
    <a
      className={`${styles.button} ${primary ? styles.primary : ""}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon size={18} aria-hidden="true" />
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
      <span className={styles.srOnly}> (abre em nova aba)</span>
    </a>
  );
}

export default function Page() {
  return (
    <div className={`container internal-page ${styles.page}`}>
      <Link href="/" className="breadcrumb">
        Início / SOBRE O PROJETO
      </Link>
      <header className={styles.intro}>
        <span className="eyebrow">SOBRE O PROJETO</span>
        <h1>Uma experiência feita para a comunidade ARMY.</h1>
        <div className={styles.copy}>
          <p>
            O ARMY PASS BRASIL nasceu da vontade de transformar o carinho pelo
            BTS em experiências digitais especiais.
          </p>
          <p>
            Aqui, tecnologia, criatividade e música se encontram para celebrar
            diferentes eras do grupo, revisitar momentos importantes de sua
            trajetória e oferecer experiências interativas para a comunidade
            ARMY brasileira.
          </p>
          <p>
            Cada detalhe foi pensado para tornar essa conexão ainda mais
            especial.
          </p>
        </div>
      </header>
      <section className={styles.partner} aria-labelledby="partner-title">
        <div className={styles.sectionHeading}>
          <span className={styles.label}>CONEXÃO & COMUNIDADE</span>
          <h2 id="partner-title">Uma parceria que tornou tudo possível. 💜</h2>
          <span className={styles.signature}>Meu Universo BTS</span>
        </div>
        <div className={styles.copy}>
          <p>
            O ARMY PASS BRASIL ganhou vida com a colaboração do Meu Universo
            BTS, uma comunidade dedicada a compartilhar momentos, novidades e
            histórias do BTS com fãs brasileiras e brasileiros.
          </p>
          <p>
            A participação do Meu Universo BTS foi fundamental para transformar
            essa ideia em uma experiência voltada à comunidade ARMY.
          </p>
          <p>
            Mais do que uma colaboração, este projeto representa o encontro
            entre a paixão pelo BTS e a vontade de criar algo especial para quem
            acompanha essa trajetória.
          </p>
          <ExternalLink
            href="https://www.instagram.com/meuuniversobts/"
            primary
          >
            Conheça o Meu Universo BTS
          </ExternalLink>
        </div>
      </section>
      <section
        className={styles.development}
        aria-labelledby="development-title"
      >
        <div className={styles.sectionHeading}>
          <span className={styles.label}>DESIGN & TECNOLOGIA</span>
          <h2 id="development-title">
            Tecnologia que transforma ideias em experiências.
          </h2>
          <p className={styles.signature}>Desenvolvido pela Loung Tech.</p>
        </div>
        <div className={styles.copy}>
          <p>
            A Loung Tech é uma empresa de tecnologia especializada no
            desenvolvimento de sites, landing pages, sistemas personalizados,
            e-commerces e soluções digitais sob medida.
          </p>
          <p>
            Unimos tecnologia, design e atenção à experiência do usuário para
            transformar ideias em produtos digitais funcionais, modernos e
            intuitivos.
          </p>
          <p>
            No ARMY PASS BRASIL, nosso trabalho foi transformar uma proposta
            criativa em uma plataforma interativa, reunindo personalização,
            jogos, história e experiências digitais em um único espaço.
          </p>
          <div className={styles.actions}>
            <ExternalLink href="https://loung-tech.vercel.app/" site>
              Conheça nosso site
            </ExternalLink>
            <ExternalLink href="https://www.instagram.com/loungtech/">
              Siga a Loung Tech
            </ExternalLink>
          </div>
        </div>
      </section>
      <aside className={styles.notice} aria-labelledby="independence-title">
        <h2 id="independence-title">Autoral e independente</h2>
        <p>
          O ARMY PASS BRASIL é um projeto independente e não possui vínculo
          oficial com BTS, BIGHIT MUSIC, HYBE ou Netflix.
        </p>
      </aside>
    </div>
  );
}
