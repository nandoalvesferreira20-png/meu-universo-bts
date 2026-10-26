import type { QuizCategory } from "./types";
export const quizCategories: readonly QuizCategory[] = [
  {
    id: "bts",
    slug: "bts",
    title: "BTS — OT7",
    subtitle: "Sete artistas. Uma história.",
    memberName: "BTS",
    description:
      "Treze anos de história, músicas, conquistas e momentos inesquecíveis. Você conhece essa trajetória?",
    imagePath: "/images/army-pass/gallery/arirang/arirang-01.jpg",
  },
  {
    id: "rm",
    slug: "rm",
    title: "RM",
    memberName: "Kim Namjoon",
    subtitle: "Palavras que encontram o mundo.",
    description: "O líder e sua trajetória artística.",
  },
  {
    id: "jin",
    slug: "jin",
    title: "Jin",
    memberName: "Kim Seokjin",
    subtitle: "Uma voz, tantas descobertas.",
    description: "Música, carreira e momentos marcantes.",
  },
  {
    id: "suga",
    slug: "suga",
    title: "SUGA",
    memberName: "Min Yoongi",
    subtitle: "Histórias em cada batida.",
    description: "Produção, composição e Agust D.",
  },
  {
    id: "j-hope",
    slug: "j-hope",
    title: "j-hope",
    memberName: "Jung Hoseok",
    subtitle: "O movimento vira música.",
    description: "Dança, hip-hop e carreira solo.",
  },
  {
    id: "jimin",
    slug: "jimin",
    title: "Jimin",
    memberName: "Park Jimin",
    subtitle: "Expressão em cada detalhe.",
    description: "Performance, dança e identidade musical.",
  },
  {
    id: "v",
    slug: "v",
    title: "V",
    memberName: "Kim Taehyung",
    subtitle: "Um olhar, uma assinatura.",
    description: "Vocais, expressão artística e projetos solo.",
  },
  {
    id: "jung-kook",
    slug: "jung-kook",
    title: "Jung Kook",
    memberName: "Jeon Jungkook",
    subtitle: "Uma jornada em novas direções.",
    description: "Vocais, discografia e carreira artística.",
  },
];
export function getQuizCategory(slug: string) {
  return quizCategories.find((c) => c.slug === slug);
}
