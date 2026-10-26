import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Sparkles } from "lucide-react";
import { quizCategories } from "./categories";
import { getMemberPortrait } from "./member-portraits";
import { MemberPortrait } from "./member-portrait";
import styles from "./quiz.module.css";

export function CategorySelection() {
  return (
    <div className={`container ${styles.page}`}>
      <Link href="/jogos" className={`breadcrumb ${styles.back}`}>
        <ChevronLeft size={14} aria-hidden="true" /> Central de jogos
      </Link>
      <header className={styles.intro}>
        <span className="eyebrow">UM UNIVERSO DE HISTÓRIAS</span>
        <h1>
          Quanto você conhece <em>o BTS?</em> <span aria-hidden="true">💜</span>
        </h1>
        <p>
          Do debut às carreiras solo: escolha seu desafio e descubra o quanto
          você conhece os meninos.
        </p>
        <div className={styles.rules}>
          <span>10 perguntas</span>
          <span>Sem cronômetro</span>
          <span>No seu tempo</span>
        </div>
      </header>
      <section className={styles.categoryGrid} aria-label="Escolha seu quiz">
        {quizCategories.map((category, index) => (
          <Link
            href={`/jogos/quiz/${category.slug}`}
            key={category.id}
            className={`${styles.categoryCard} ${category.id === "bts" ? styles.featured : ""}`}
            aria-label={`Começar quiz ${category.title}`}
          >
            {category.imagePath ? (
              <div className={styles.groupImage}>
                <Image
                  src={category.imagePath}
                  alt="Os sete integrantes do BTS reunidos na era ARIRANG"
                  width={1600}
                  height={1141}
                  sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1200px) 50vw, 550px"
                  preload
                />
              </div>
            ) : (
              <div className={`${styles.monogram} ${styles.memberMonogram}`}>
                <span aria-hidden="true">{category.title}</span>
                {getMemberPortrait(category.id) ? (
                  <MemberPortrait
                    photo={getMemberPortrait(category.id)!}
                    index={index}
                  />
                ) : (
                  <small aria-hidden="true">
                    0{index} <span>✦</span>
                  </small>
                )}
              </div>
            )}
            <div className={styles.categoryBody}>
              <span className={styles.categoryMeta}>
                {category.id === "bts"
                  ? "O GRUPO INTEIRO"
                  : category.memberName}{" "}
                <span>10 perguntas</span>
              </span>
              <h2>{category.title}</h2>
              <p>{category.description}</p>
              <span className={styles.cardAction}>
                Começar quiz <ArrowRight size={17} aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </section>
      <p className={styles.editorialNote}>
        <Sparkles size={15} aria-hidden="true" />
        Cada resposta abre uma nova história. Fontes disponíveis após responder.
      </p>
      <p className={styles.portraitCredits}>
        Fotografias selecionadas e fornecidas pelo responsável do projeto.
      </p>
      <p className={styles.fanNote}>
        Criado por fãs, sem vínculo oficial com BTS ou BIGHIT MUSIC. Informações
        verificadas até 26 de outubro de 2026.
      </p>
    </div>
  );
}
