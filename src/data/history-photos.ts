// Curadoria verificada em 26/10/2026. Evidências: docs/history-photo-license-evidence.json.
export interface AuthorizedHistoryPhoto {
  status: "authorized";
  year: number;
  filename: string;
  src: `/images/historia/${string}.webp`;
  description: string;
  alt: string;
  credit: string;
  eventDate: string;
  originalSource: string;
  sourceUrl: string;
  authorizationEvidence: string;
  license: { name: string; url: string };
  originalDimensions: { width: number; height: number };
  acquiredDimensions: { width: number; height: number };
  width: number;
  height: number;
  bytes: number;
  sha256: string;
  objectPosition: string;
  changes: string;
  notes: string;
  verifiedOn: string;
}
export interface PendingHistoryPhoto {
  status: "candidate";
  year: number;
  filename: null;
  description: string;
  originalSource: string | null;
  sourceUrl: string;
  credit: string | null;
  eventDate: string | null;
  dimensions: { width: number; height: number } | null;
  license: null;
  reason: string;
}

export const authorizedHistoryPhotos = [
  {
    status: "authorized",
    year: 2013,
    filename: "bts-2013.webp",
    src: "/images/historia/bts-2013.webp",
    description: "BTS em um fanmeeting do Music Bank, em 26 de julho de 2013.",
    alt: "Os sete integrantes do BTS lado a lado, com uniformes pretos, no fanmeeting do Music Bank em 2013.",
    credit: "BulletProof7BTS",
    eventDate: "2013-07-26",
    originalSource: "http://bulletproof7bts.tistory.com/44",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bangtan_Boys_at_a_fanmeeting_on_Music_Bank_in_July_2013_01.jpg",
    license: {
      name: "CC BY 4.0",
      url: "https://creativecommons.org/licenses/by/4.0",
    },
    authorizationEvidence:
      "https://commons.wikimedia.org/w/index.php?oldid=874393699",
    originalDimensions: {
      width: 1500,
      height: 889,
    },
    acquiredDimensions: {
      width: 1500,
      height: 889,
    },
    width: 1500,
    height: 889,
    bytes: 159488,
    sha256: "137d5b86cb00f9093986dd5abbf0c75efc2b8faadb6722b8d3bb968eccc5e8aa",
    objectPosition: "50% 50%",
    changes:
      "Redimensionamento proporcional e conversão para WebP. Sem recorte, retoque, remoção de marcas ou aumento de resolução.",
    notes: "Fanmeeting do Music Bank · período de estreia / No More Dream.",
    verifiedOn: "2026-10-26",
  },
  {
    status: "authorized",
    year: 2014,
    filename: "bts-2014.webp",
    src: "/images/historia/bts-2014.webp",
    description: "BTS em um encontro de autógrafos, em 12 de setembro de 2014.",
    alt: "Os sete integrantes do BTS reunidos em um encontro de autógrafos de 2014, com roupas verdes e microfones.",
    credit: "JinTime",
    eventDate: "2014-09-12",
    originalSource:
      "https://jintime.tistory.com/entry/160613-%EB%B0%A9%ED%83%84%EC%86%8C%EB%85%84%EB%8B%A83%EC%A3%BC%EB%85%84%EC%B6%95%ED%95%98%ED%95%B4",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BTS_at_a_fansigning_event,_12_September_2014.jpg",
    license: {
      name: "CC BY 4.0",
      url: "https://creativecommons.org/licenses/by/4.0",
    },
    authorizationEvidence:
      "https://commons.wikimedia.org/w/index.php?oldid=874393930",
    originalDimensions: {
      width: 5472,
      height: 3648,
    },
    acquiredDimensions: {
      width: 5472,
      height: 3648,
    },
    width: 1800,
    height: 1200,
    bytes: 274332,
    sha256: "e2f467b2c738c815fa66222d3b5b9541ba13f2335270b91a5d76e2358af6af3b",
    objectPosition: "50% 50%",
    changes:
      "Redimensionamento proporcional e conversão para WebP. Sem recorte, retoque, remoção de marcas ou aumento de resolução.",
    notes:
      "Encontro de autógrafos durante a era DARK & WILD; não é fotografia conceitual do álbum.",
    verifiedOn: "2026-10-26",
  },
  {
    status: "authorized",
    year: 2015,
    filename: "bts-2015.webp",
    src: "/images/historia/bts-2015.webp",
    description: "BTS em um encontro de autógrafos, em 16 de maio de 2015.",
    alt: "BTS posa com os braços abertos em um encontro com fãs durante o período de I NEED U, em 2015.",
    credit: "JinTime",
    eventDate: "2015-05-16",
    originalSource:
      "https://jintime.tistory.com/entry/160613-%EB%B0%A9%ED%83%84%EC%86%8C%EB%85%84%EB%8B%A83%EC%A3%BC%EB%85%84%EC%B6%95%ED%95%98%ED%95%B4",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BTS_at_a_fansigning_event,_16_May_2015.jpg",
    license: {
      name: "CC BY 4.0",
      url: "https://creativecommons.org/licenses/by/4.0",
    },
    authorizationEvidence:
      "https://commons.wikimedia.org/w/index.php?oldid=874394178",
    originalDimensions: {
      width: 5760,
      height: 3840,
    },
    acquiredDimensions: {
      width: 5760,
      height: 3840,
    },
    width: 1800,
    height: 1200,
    bytes: 242924,
    sha256: "f62abb10e3436789372aa0c3331dcb177aa2c6fe718a1868d3b058b6ef2865ec",
    objectPosition: "50% 50%",
    changes:
      "Redimensionamento proporcional e conversão para WebP. Sem recorte, retoque, remoção de marcas ou aumento de resolução.",
    notes: "Registro de maio de 2015, no período de HYYH Pt. 1 / I NEED U.",
    verifiedOn: "2026-10-26",
  },
  {
    status: "authorized",
    year: 2016,
    filename: "bts-2016.webp",
    src: "/images/historia/bts-2016.webp",
    description: "BTS no Asia Artist Awards, em 16 de novembro de 2016.",
    alt: "Os sete integrantes do BTS posam no tapete vermelho do Asia Artist Awards de 2016, com roupas escuras.",
    credit: "TenAsia / K-POPIT 케이팝잇 TV10",
    eventDate: "2016-11-16",
    originalSource: "https://www.youtube.com/watch?v=mU0FKO65xKg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:161116_BTS_at_the_Asia_Artist_Awards.png",
    license: {
      name: "CC BY 3.0",
      url: "https://creativecommons.org/licenses/by/3.0",
    },
    authorizationEvidence:
      "https://commons.wikimedia.org/w/index.php?oldid=1248181322",
    originalDimensions: {
      width: 1812,
      height: 958,
    },
    acquiredDimensions: {
      width: 1812,
      height: 958,
    },
    width: 1800,
    height: 952,
    bytes: 177206,
    sha256: "2bc0916dd0421affeeaea2f8b7d080224f56ea5f55c0239088383d376524b098",
    objectPosition: "50% 50%",
    changes:
      "Redimensionamento proporcional e conversão para WebP. Sem recorte, retoque, remoção de marcas ou aumento de resolução.",
    notes:
      "Registro de imprensa durante a era WINGS; quadro de vídeo licenciado, não foto conceitual do álbum.",
    verifiedOn: "2026-10-26",
  },
  {
    status: "authorized",
    year: 2017,
    filename: "bts-2017.webp",
    src: "/images/historia/bts-2017.webp",
    description:
      "BTS em um ensaio para a Dispatch, em Los Angeles, em novembro de 2017.",
    alt: "BTS em um terraço de Los Angeles ao pôr do sol, com a cidade ao fundo, em ensaio de 2017.",
    credit: "KOREA Dispatch",
    eventDate: "2017-11",
    originalSource: "https://www.youtube.com/watch?v=JlsD_y7Omc0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:1117_BTS_Dispatch_Photo_Shoot_LA.png",
    license: {
      name: "CC BY 3.0",
      url: "https://creativecommons.org/licenses/by/3.0",
    },
    authorizationEvidence:
      "https://commons.wikimedia.org/w/index.php?oldid=1001745578",
    originalDimensions: {
      width: 1584,
      height: 891,
    },
    acquiredDimensions: {
      width: 1584,
      height: 891,
    },
    width: 1584,
    height: 891,
    bytes: 103228,
    sha256: "e7d54fda9122a654a38364e87d43bd80b3e77e67fc742c5d208178244a4add24",
    objectPosition: "50% 50%",
    changes:
      "Redimensionamento proporcional e conversão para WebP. Sem recorte, retoque, remoção de marcas ou aumento de resolução.",
    notes:
      "Ensaio no período de LOVE YOURSELF: HER; o dia exato não está documentado na fonte. Quadro de vídeo licenciado.",
    verifiedOn: "2026-10-26",
  },
  {
    status: "authorized",
    year: 2018,
    filename: "bts-2018.webp",
    src: "/images/historia/bts-2018.webp",
    description: "BTS na chegada ao Music Bank, em 31 de agosto de 2018.",
    alt: "Os sete integrantes do BTS posam juntos na chegada a uma gravação do Music Bank, em agosto de 2018.",
    credit: "뉴스인스타 (News in Star)",
    eventDate: "2018-08-31",
    originalSource: "https://www.youtube.com/watch?v=XZOizznysxg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:180831_BTS_at_KBS_Music_Bank_recording.png",
    license: {
      name: "CC BY 3.0",
      url: "https://creativecommons.org/licenses/by/3.0",
    },
    authorizationEvidence:
      "https://commons.wikimedia.org/w/index.php?oldid=1001731779",
    originalDimensions: {
      width: 1537,
      height: 912,
    },
    acquiredDimensions: {
      width: 1537,
      height: 912,
    },
    width: 1537,
    height: 912,
    bytes: 110004,
    sha256: "aa6e3fce63f9180344859bb862b35c582ba19c948ff0dd4168aea85c9617c205",
    objectPosition: "50% 50%",
    changes:
      "Redimensionamento proporcional e conversão para WebP. Sem recorte, retoque, remoção de marcas ou aumento de resolução.",
    notes:
      "Registro de imprensa no período de LOVE YOURSELF: ANSWER / IDOL; quadro de vídeo licenciado.",
    verifiedOn: "2026-10-26",
  },
  {
    status: "authorized",
    year: 2019,
    filename: "bts-2019.webp",
    src: "/images/historia/bts-2019.webp",
    description:
      "BTS na coletiva de MAP OF THE SOUL: PERSONA, em 17 de abril de 2019.",
    alt: "BTS posa em frente a um painel rosa na coletiva de MAP OF THE SOUL: PERSONA, em 2019.",
    credit: "Dispatch",
    eventDate: "2019-04-17",
    originalSource: "https://www.youtube.com/watch?v=oAtHQGYzm70",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BTS_at_%22Map_of_the_Soul_-_Persona%22_global_press_conference,_17_April_2019_03.jpg",
    license: {
      name: "CC BY 3.0",
      url: "https://creativecommons.org/licenses/by/3.0",
    },
    authorizationEvidence:
      "https://commons.wikimedia.org/w/index.php?oldid=874395788",
    originalDimensions: {
      width: 1920,
      height: 987,
    },
    acquiredDimensions: {
      width: 1920,
      height: 987,
    },
    width: 1800,
    height: 925,
    bytes: 93112,
    sha256: "d852e7c26de402a7bae5df458978c94b8155fa33d42b78f337e1385e31df99e6",
    objectPosition: "50% 50%",
    changes:
      "Redimensionamento proporcional e conversão para WebP. Sem recorte, retoque, remoção de marcas ou aumento de resolução.",
    notes: "Coletiva de lançamento de PERSONA; quadro de vídeo licenciado.",
    verifiedOn: "2026-10-26",
  },
  {
    status: "authorized",
    year: 2021,
    filename: "bts-2021.webp",
    src: "/images/historia/bts-2021.webp",
    description:
      "Permission to Dance On Stage, no SoFi Stadium, em 1º de dezembro de 2021.",
    alt: "Os sete integrantes do BTS se apresentam com roupas claras no palco de Permission to Dance On Stage, em Los Angeles.",
    credit: "Monbmon",
    eventDate: "2021-12-01",
    originalSource:
      "https://commons.wikimedia.org/wiki/File:BTS_Permission_to_Dance_On_Stage_Dec_1,_2021.jpg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BTS_Permission_to_Dance_On_Stage_Dec_1,_2021.jpg",
    license: {
      name: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0",
    },
    authorizationEvidence:
      "https://commons.wikimedia.org/w/index.php?oldid=1191178251",
    originalDimensions: {
      width: 3520,
      height: 1980,
    },
    acquiredDimensions: {
      width: 3520,
      height: 1980,
    },
    width: 1800,
    height: 1013,
    bytes: 88178,
    sha256: "30d1d74f5190ce0372337c1ba57919e1f30f445a01c0c8a340e76ebd4491c7b1",
    objectPosition: "50% 50%",
    changes:
      "Redimensionamento proporcional e conversão para WebP. Sem recorte, retoque, remoção de marcas ou aumento de resolução.",
    notes:
      "Fotografia de público, com perspectiva do estádio e nitidez compatível com essa distância. WebP distribuído sob CC BY-SA 4.0.",
    verifiedOn: "2026-10-26",
  },
  {
    status: "authorized",
    year: 2024,
    filename: "bts-2024.webp",
    src: "/images/historia/bts-2024.webp",
    description:
      "Jin acompanha o retorno de j-hope do serviço militar, em 17 de outubro de 2024.",
    alt: "j-hope, de uniforme, presta continência; Jin, de roupa vermelha, segura os microfones ao seu lado.",
    credit: "TV10 / K-POPIT 케이팝잇",
    eventDate: "2024-10-17",
    originalSource: "https://www.youtube.com/watch?v=GhCLiRbZudA",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BTS_J-Hope_military_discharge,_17_October_2024_02.png",
    license: {
      name: "CC BY 3.0",
      url: "https://creativecommons.org/licenses/by/3.0",
    },
    authorizationEvidence:
      "https://commons.wikimedia.org/w/index.php?oldid=1248183296",
    originalDimensions: {
      width: 746,
      height: 968,
    },
    acquiredDimensions: {
      width: 500,
      height: 649,
    },
    width: 500,
    height: 649,
    bytes: 53642,
    sha256: "b9083cb53fc6bf420fb684155eda9cd697ceb4b1b2e8424c0790ecd57f82b12e",
    objectPosition: "50% 50%",
    changes:
      "Redimensionamento proporcional e conversão para WebP. Sem recorte, retoque, remoção de marcas ou aumento de resolução.",
    notes:
      "Quadro de vídeo do retorno de j-hope, com Jin. Original de 746 × 968; versão obtida de 500 × 649 por limitação de acesso ao original. Exibição contida, sem ampliar o arquivo nem cortar a composição.",
    verifiedOn: "2026-10-26",
  },
  {
    status: "authorized",
    year: 2026,
    filename: "bts-2026.webp",
    src: "/images/historia/bts-2026.webp",
    description:
      "BTS durante SWIM na turnê ARIRANG, em Paris, em 17 de julho de 2026.",
    alt: "Vista do BTS no palco central e do público no Stade de France durante a turnê ARIRANG, em 2026.",
    credit: "Chiyako92",
    eventDate: "2026-07-17",
    originalSource:
      "https://commons.wikimedia.org/wiki/File:BTS_Arirang_World_Tour_in_Paris_(17_July_2026)_-_Swim.jpg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BTS_Arirang_World_Tour_in_Paris_(17_July_2026)_-_Swim.jpg",
    license: {
      name: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0",
    },
    authorizationEvidence:
      "https://commons.wikimedia.org/w/index.php?oldid=1270699775",
    originalDimensions: {
      width: 3000,
      height: 1689,
    },
    acquiredDimensions: {
      width: 1920,
      height: 1081,
    },
    width: 1800,
    height: 1013,
    bytes: 691926,
    sha256: "02a80ffb1627d2ddf4473d27277bf812a408ab70953ecf46878d40283b5392e8",
    objectPosition: "50% 50%",
    changes:
      "Redimensionamento proporcional e conversão para WebP. Sem recorte, retoque, remoção de marcas ou aumento de resolução.",
    notes:
      "Fotografia de público, com o grupo à distância. Manter composição integral: a fonte sinaliza elementos de tela de minimis; não recortar para destacar as telas. WebP sob CC BY-SA 4.0.",
    verifiedOn: "2026-10-26",
  },
] satisfies readonly AuthorizedHistoryPhoto[];

export const pendingHistoryPhotos = [
  {
    status: "candidate",
    year: 2020,
    filename: null,
    description: "Fotografia conceitual do grupo para MAP OF THE SOUL: 7.",
    originalSource:
      "https://bts.ibighit.com/eng/discography/detail/map_of_the_soul-7.html",
    sourceUrl:
      "https://bts.ibighit.com/eng/discography/detail/map_of_the_soul-7.html",
    credit: null,
    eventDate: null,
    dimensions: null,
    license: null,
    reason:
      "Contexto de 2020 confirmado na página oficial. Data da sessão, fotógrafo, resolução do arquivo e autorização de republicação não verificados. As autorizações das galerias do Army Pass não foram estendidas à História.",
  },
  {
    status: "candidate",
    year: 2022,
    filename: null,
    description:
      "Fotografia conceitual Proof (Proof ver.), publicada no Weverse oficial.",
    originalSource: "https://weverse.io/bts/media/0-1881",
    sourceUrl: "https://weverse.io/bts/media/0-1881",
    credit: null,
    eventDate: null,
    dimensions: null,
    license: null,
    reason:
      "Candidata oficial da era correta; fotógrafo, data da sessão, resolução real e autorização de republicação ainda não confirmados. Não baixada.",
  },
  {
    status: "candidate",
    year: 2023,
    filename: null,
    description: "Jimin a caminho da SBS Radio, em 31 de março de 2023.",
    originalSource: null,
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Jimin_on_the_way_to_SBS_Radio,_31_March_2023_(1).jpg",
    credit: null,
    eventDate: "2023-03-31",
    dimensions: {
      width: 531,
      height: 720,
    },
    license: null,
    reason:
      "Candidata do período de atividades individuais. Resolução disponível abaixo da preferência editorial; licença e origem primária não auditadas para publicação. Aguardar arquivo de melhor qualidade e licença compatível. Não baixada.",
  },
  {
    status: "candidate",
    year: 2025,
    filename: null,
    description:
      "Registro da transmissão conjunta dos sete integrantes em julho de 2025, a localizar na fonte original.",
    originalSource: null,
    sourceUrl: "https://apnews.com/article/18fb477594e545307808165bcf7d1d6d",
    credit: null,
    eventDate: "2025-07-01",
    dimensions: null,
    license: null,
    reason:
      "A reportagem documenta o contexto, mas não autoriza fotografias. Arquivo original do reencontro OT7, fotógrafo e licença pendentes; não usar fotos dos retornos de 2024 para este ano. Nenhum arquivo baixado.",
  },
] satisfies readonly PendingHistoryPhoto[];

export function getHistoryPhoto(
  year: number,
): AuthorizedHistoryPhoto | undefined {
  return authorizedHistoryPhotos.find((photo) => photo.year === year);
}
