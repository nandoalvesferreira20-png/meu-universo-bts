import photos from "../../public/images/arirang-tour/seoul-netflix/sources.json";
export type EventPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  source: string;
  credit: string;
};
type ComebackEvent = {
  id: string;
  title: string;
  date: string;
  city: string;
  country: string;
  venue: string;
  subtitle: string;
  description: string;
  sourceUrls: string[];
  images: EventPhoto[];
};
const captions = [
  [
    "Os sete integrantes do BTS diante do portão de Gwanghwamun à noite.",
    "Sete vozes. Um reencontro em Gwanghwamun.",
  ],
  [
    "BTS no palco cercado por estruturas iluminadas durante o comeback em Seul.",
    "O palco do comeback, no coração de Seul.",
  ],
  [
    "Plateia com light sticks diante do BTS e do palco iluminado em azul.",
    "Entre o palco e a plateia, a mesma emoção.",
  ],
  [
    "Integrantes do BTS em coreografia sob luz azul no especial ARIRANG.",
    "ARIRANG ganha movimento.",
  ],
];
export const seoulComeback: ComebackEvent = {
  id: "seoul-netflix-2026",
  title: "BTS THE COMEBACK LIVE | ARIRANG",
  date: "2026-03-21",
  city: "Seul",
  country: "Coreia do Sul",
  venue: "Praça Gwanghwamun",
  subtitle:
    "Em 21 de março de 2026, Seul foi o palco do retorno do BTS em um evento histórico transmitido para o mundo em parceria com a Netflix.",
  description:
    "Na Praça Gwanghwamun, os sete voltaram a dividir o palco. O especial de comeback da era ARIRANG transformou esse reencontro com o público em uma memória compartilhada: vivida em Seul e acompanhada ao redor do mundo pela Netflix. Um novo capítulo, com a força de estar juntos outra vez.",
  sourceUrls: [
    "https://www.netflix.com/tudum/bts-the-comeback-live-arirang",
    photos[0].source,
  ],
  images: photos.map((photo, index) => ({
    ...photo,
    alt: captions[index][0],
    caption: captions[index][1],
  })),
};
