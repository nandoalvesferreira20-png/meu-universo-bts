import type { Metadata } from "next";
import { ExperiencePage } from "@/features/experience-page";
import { ExperienceCard } from "@/components/experience";
import { experiences } from "@/data/portal";
export const metadata: Metadata = {
  title: "CENTRAL DE JOGOS",
  description:
    "Descubra músicas pelos emojis e explore as experiências do Army Pass Brasil.",
};
export default function Page() {
  return (
    <ExperiencePage
      eyebrow="CENTRAL DE JOGOS"
      title="Conhecer, lembrar, se divertir."
      description="De uma música a uma história: escolha o Emoji Challenge ou os quizzes do BTS e dos sete integrantes."
    >
      <div className="experience-grid games-grid">
        {experiences
          .filter((item) => item.href.startsWith("/jogos/"))
          .map((experience, index) => (
            <ExperienceCard
              key={experience.href}
              experience={{
                ...experience,
                title:
                  experience.href === "/jogos/quiz"
                    ? "Quiz BTS e Integrantes"
                    : "Emoji Challenge",
                description:
                  experience.href === "/jogos/quiz"
                    ? "Teste seus conhecimentos sobre os sete."
                    : "Adivinhe a música pelos emojis.",
              }}
              index={index}
            />
          ))}
      </div>
    </ExperiencePage>
  );
}
