import type { Metadata } from "next";
import { ExperiencePage } from "@/features/experience-page";
import { partnerUrl } from "@/data/portal";
export const metadata: Metadata = {
  title: "SOBRE O PROJETO",
  description: "Um lugar para celebrar tudo aquilo que nos conecta.",
};
export default function Page() {
  return (
    <ExperiencePage
      eyebrow="SOBRE O PROJETO"
      title="De fã para fã. De coração."
      description="Um lugar para celebrar tudo aquilo que nos conecta."
    >
      <div className="prose-panel">
        <h2>Nosso universo compartilhado</h2>
        <p>
          O ARMY PASS BRASIL é um portal independente de experiências
          permanentes para a comunidade ARMY brasileira, desenvolvido em
          colaboração com o fã-clube{" "}
          <a href={partnerUrl} target="_blank" rel="noreferrer">
            @meuuniversobts ↗
          </a>
          .
        </p>
        <p>
          Passaportes, jogos, histórias e memórias: cada espaço foi pensado para
          celebrar a conexão com o BTS, sem depender de notícias ou atualizações
          diárias.
        </p>
        <h2>Uma comunidade construída com cuidado</h2>
        <p>
          As ferramentas de participação serão disponibilizadas em etapas.
          Mensagens e fotografias terão moderação, canais de denúncia e
          processos de remoção. As políticas de privacidade serão publicadas
          antes da coleta de dados.
        </p>
        <h2>Autoral e independente</h2>
        <p>
          Este projeto não possui vínculo oficial com BTS, HYBE ou BIGHIT MUSIC.
          Nenhuma fotografia dos integrantes é utilizada nesta fase.
        </p>
      </div>
    </ExperiencePage>
  );
}
