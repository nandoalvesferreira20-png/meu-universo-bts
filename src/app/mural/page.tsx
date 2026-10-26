import type { Metadata } from "next";
import { ExperiencePage } from "@/features/experience-page";
import { MuralBoard } from "@/features/mural/mural-board";
export const metadata: Metadata = {
  title: "MURAL ARMY",
  description: "Um espaço para compartilhar o carinho que atravessa oceanos.",
};
export default function Page() {
  return (
    <ExperiencePage
      eyebrow="MURAL ARMY"
      title="Palavras que nos aproximam."
      description="Um espaço coletivo para compartilhar carinho com BTS e com a comunidade ARMY."
    >
      <MuralBoard siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""} />
    </ExperiencePage>
  );
}
