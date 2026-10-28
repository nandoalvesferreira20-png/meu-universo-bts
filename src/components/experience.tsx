import { timelineStructure } from "@/data/portal";
import Link from "next/link";
import {
  ArrowRight,
  IdCard,
  Music2,
  Sparkles,
  History,
  Images,
  Construction,
  Globe2,
} from "lucide-react";
import type { Experience } from "@/types";
const icons = {
  pass: IdCard,
  music: Music2,
  quiz: Sparkles,
  history: History,
  gallery: Images,
};
export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
export function ExperienceCard({
  experience,
  index = 0,
}: {
  experience: Experience;
  index?: number;
}) {
  const Icon = icons[experience.icon];
  return (
    <Link href={experience.href} className="experience-card">
      <div className="card-top">
        <span className="icon-tile">
          <Icon size={24} strokeWidth={1.5} />
        </span>
        <span className="card-number">0{index + 1} /</span>
      </div>
      <h3>{experience.title}</h3>
      <p>{experience.description}</p>
      <span className="card-link">
        Explorar experiência <ArrowRight size={18} />
      </span>
    </Link>
  );
}
export function PurplePassCard() {
  return (
    <div className="pass-scene">
      <div className="orbit" />
      <span className="scene-star" aria-hidden="true">
        ✦
      </span>
      <div className="purple-pass">
        <div className="pass-top">
          <span>
            ARMY PASS
            <br />
            <small>BRASIL</small>
          </span>
          <Globe2 size={28} strokeWidth={1} />
        </div>
        <div className="pass-symbol" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="pass-title">
          Uma conexão.
          <br />
          <i>Infinitas memórias.</i>
        </div>
        <div className="pass-bottom">
          FANMADE · BORAHAE <span>✦</span>
        </div>
      </div>
      <span className="pass-stamp">
        FEITO DE MÚSICA
        <br />♡<br />E PERTENCIMENTO
      </span>
      <p className="pass-caption">Seu passaporte, em quatro eras</p>
    </div>
  );
}
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="icon-tile">
        <Construction size={25} />
      </span>
      <span className="eyebrow">EM DESENVOLVIMENTO</span>
      <h2>{title}</h2>
      <p>{children}</p>
      <Link className="text-link" href="/">
        Explorar o portal <ArrowRight size={17} />
      </Link>
    </div>
  );
}
export function QuizCategoryCard({
  category,
}: {
  category: { slug: string; name: string };
}) {
  return (
    <Link className="quiz-card" href={`/jogos/quiz/${category.slug}`}>
      <span className="quiz-monogram" aria-hidden="true">
        {category.name === "BTS" ? "7" : category.name.slice(0, 1)}
      </span>
      <h2>{category.name}</h2>
      <p>Conheça esta categoria</p>
      <span className="card-link">
        Ver detalhes <ArrowRight size={17} />
      </span>
    </Link>
  );
}
export function TimelineSection() {
  return (
    <section
      className="timeline-preview"
      aria-label="Estrutura da futura linha do tempo"
    >
      {timelineStructure.map((item) => (
        <div key={item.year}>
          <span>{item.year}</span>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </div>
      ))}
    </section>
  );
}
