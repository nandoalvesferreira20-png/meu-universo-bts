import type { Metadata } from "next";
import { ExperiencePage } from "@/features/experience-page";
import { AdminMuralBoard } from "@/features/mural/admin-board";

export const metadata: Metadata = {
  title: "Moderação do Mural",
  description: "Área restrita de moderação do Mural ARMY.",
  robots: { index: false, follow: false },
};

export default function AdminMuralPage() {
  return (
    <ExperiencePage
      eyebrow="EQUIPE · MURAL"
      title="Cuidar também é acolher."
      description="Ferramentas restritas para a equipe de moderação."
    >
      <AdminMuralBoard />
    </ExperiencePage>
  );
}
