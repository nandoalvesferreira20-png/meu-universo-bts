import { heroContent } from "@/data/portal";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PurplePassCard } from "./experience";
export function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="hero-tag">
            <Sparkles size={14} /> {heroContent.tag}
          </span>
          <h1>
            {heroContent.title[0]}
            <br />
            {heroContent.title[1]}
            <br />
            <em>{heroContent.title[2]}</em>
          </h1>
          <p>{heroContent.description}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/army-pass">
              Criar meu Army Pass <ArrowRight size={18} />
            </Link>
            <a className="button button-outline" href="#experiencias">
              Explorar o portal ↘
            </a>
          </div>
          <div className="hero-note">♡ &nbsp; {heroContent.note}</div>
        </div>
        <PurplePassCard />
      </div>
      <div className="hero-bottom container">
        <span>DO BRASIL, COM AMOR. PARA SEMPRE, ARMY.</span>
        <span>EST. 2026 ✦</span>
      </div>
    </section>
  );
}
