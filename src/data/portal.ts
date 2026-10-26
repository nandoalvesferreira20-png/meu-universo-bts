import type { Experience } from "@/types";
export const partnerUrl = "https://www.instagram.com/meuuniversobts/";
export const experiences: Experience[] = [
  {
    href: "/army-pass",
    title: "Army Pass",
    description: "Sua conexão com o BTS em um passaporte só seu.",
    icon: "pass",
  },
  {
    href: "/mural",
    title: "Mural ARMY",
    description:
      "Palavras que atravessam distâncias. Um espaço para o nosso carinho.",
    icon: "heart",
  },
  {
    href: "/jogos/emojis",
    title: "Emoji Challenge",
    description: "Uma sequência de emojis. Uma música. Você reconhece?",
    icon: "music",
  },
  {
    href: "/jogos/quiz",
    title: "Quizzes BTS",
    description:
      "Sete personalidades, tantas histórias. Explore o que você conhece.",
    icon: "quiz",
  },
  {
    href: "/historia",
    title: "História do BTS",
    description:
      "Dos primeiros passos aos novos capítulos. Uma jornada para revisitar.",
    icon: "history",
  },
  {
    href: "/arirang-tour",
    title: "ARIRANG TOUR",
    description: "No show ou no cinema, cada encontro merece uma memãria.",
    icon: "gallery",
  },
];
export const navigation = [
  { href: "/army-pass", label: "Army Pass" },
  { href: "/mural", label: "Mural" },
  { href: "/jogos", label: "Jogos" },
  { href: "/historia", label: "História" },
  { href: "/arirang-tour", label: "ARIRANG TOUR" },
];
export const quizCategories = [
  { slug: "bts", name: "BTS" },
  ...["RM", "Jin", "SUGA", "j-hope", "Jimin", "V", "Jung Kook"].map((name) => ({
    slug: name.toLowerCase().replaceAll(" ", "-"),
    name,
  })),
];

export const heroContent = {
  tag: "NOSSA CONEXÃO VAI ALÉM DA MÚSICA",
  title: ["Um universo feito", "por ARMYs,", "para ARMYs."],
  description:
    "Crie memórias, teste seus conhecimentos, compartilhe histórias e celebre sua conexão com o BTS.",
  note: "Sete histórias. Infinitas conexões. O seu universo.",
};
export const timelineStructure = [
  {
    year: "2013",
    title: "O ponto de partida",
    description: "Início previsto para a nossa linha do tempo.",
  },
  {
    year: "2026",
    title: "Novos capítulos",
    description:
      "Espaço reservado para a era ARIRANG. Conteúdo em preparação e revisão.",
  },
];
