import type { Metadata } from "next";
import { ArmyPassBuilder } from "@/features/army-pass/army-pass-builder";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "@/features/army-pass/army-pass.module.css";
export const metadata: Metadata = {
  title: "ARMY PASS",
  description:
    "Crie seu Army Pass nas eras WINGS, MAP OF THE SOUL: 7, MAP OF THE SOUL: PERSONA e ARIRANG. Personalize e baixe seu passaporte no seu dispositivo.",
};
export default function Page() {
  return (
    <div className={`container ${styles.studioPage}`}>
      <Link href="/" className={styles.breadcrumb}>
        Portal <span>/</span> Army Pass Studio
      </Link>
      <header className={styles.studioIntro}>
        <div>
          <span className={styles.studioEyebrow}>
            ARMY PASS STUDIO · FEITO DE CONEXÕES
          </span>
          <h1>
            A sua história.
            <br />
            <em>Uma peça da nossa coleção.</em>
          </h1>
          <p>
            Uma era que marcou você. Uma imagem que diz tudo.
            <br className={styles.desktopBreak} /> Crie um Army Pass para
            guardar — e levar por aí.
          </p>
        </div>
        <div className={styles.introNote}>
          <span aria-hidden="true">✧</span>
          <p>
            Quatro universos.
            <br />
            Infinitas formas de pertencer.
          </p>
          <span>
            UMA CRIAÇÃO DE FÃS <ArrowUpRight size={13} />
          </span>
        </div>
      </header>
      <ArmyPassBuilder />
    </div>
  );
}
