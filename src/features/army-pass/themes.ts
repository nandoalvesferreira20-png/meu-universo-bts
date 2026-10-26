import type { AuthorizedEraPhoto, EraId, EraTheme, EraLogo } from "./types";

export const eraThemes: Record<EraId, EraTheme> = {
  wings: {
    id: "wings",
    name: "WINGS",
    caption: "Entre o mistério e a liberdade.",
    mood: "Preto · prata · editorial",
    colors: {
      dark: "#101010",
      mid: "#393939",
      accent: "#BEBEBA",
      light: "#F0F0EA",
    },
    logo: {
      status: "pending-authorization",
      path: null,
      credit: "BIGHIT MUSIC / identidade WINGS — crédito final a confirmar",
      source: "https://bts.ibighit.com/eng/discography/detail/wings.html",
      rightsHolder:
        "BIGHIT MUSIC é responsável pela fonte; titularidade específica a confirmar",
      authorizationReference: null,
      usageConditions: null,
      placement: { x: 690, y: 184, width: 270, height: 276 },
    },
  },
  "map-of-the-soul": {
    id: "map-of-the-soul",
    name: "MAP OF THE SOUL: 7",
    caption: "Um encontro com o seu universo interior.",
    mood: "Azul · fluido · sonhador",
    colors: {
      dark: "#172D57",
      mid: "#2F65A2",
      accent: "#D7B5D9",
      light: "#F0C9E7",
    },
    logo: {
      status: "pending-authorization",
      path: null,
      credit:
        "BIGHIT MUSIC / número 7 de MAP OF THE SOUL: 7 — crédito final a confirmar",
      source:
        "https://bts.ibighit.com/eng/discography/detail/map_of_the_soul-7.html",
      rightsHolder:
        "BIGHIT MUSIC é responsável pela fonte; titularidade específica a confirmar",
      authorizationReference: null,
      usageConditions: null,
      placement: { x: 725, y: 285, width: 310, height: 420 },
    },
  },
  persona: {
    id: "persona",
    name: "MAP OF THE SOUL: PERSONA",
    caption: "O amor também faz parte de nós.",
    mood: "Rosa · delicado · editorial",
    colors: {
      dark: "#A53D64",
      mid: "#E46B90",
      accent: "#F7B7C7",
      light: "#FFF0E7",
    },
    logo: {
      status: "pending-authorization",
      path: null,
      credit: "BIGHIT MUSIC / identidade PERSONA — crédito final a confirmar",
      source:
        "https://bts.ibighit.com/eng/discography/detail/map_of_the_soul-persona.html",
      rightsHolder: "Titularidade específica a confirmar",
      authorizationReference: null,
      usageConditions: null,
      placement: { x: 482, y: 276, width: 330, height: 304 },
    },
  },
  be: {
    id: "be",
    name: "BE",
    caption: "A beleza de ser, do seu jeito.",
    mood: "Creme · acolhedor · essencial",
    colors: {
      dark: "#36312E",
      mid: "#9A8979",
      accent: "#E1D5C5",
      light: "#FAF5EB",
    },
    logo: {
      status: "pending-authorization",
      path: null,
      credit: "BIGHIT MUSIC / identidade BE — crédito final a confirmar",
      source: "https://bts.ibighit.com/eng/discography/detail/be.html",
      rightsHolder:
        "BIGHIT MUSIC é responsável pela fonte; titularidade específica a confirmar",
      authorizationReference: null,
      usageConditions: null,
      placement: { x: 824, y: 150, width: 160, height: 110 },
    },
  },
  arirang: {
    id: "arirang",
    name: "ARIRANG",
    caption: "Nossas raízes também nos levam mais longe.",
    mood: "Papel · vermelho · editorial",
    colors: {
      dark: "#171719",
      mid: "#333333",
      accent: "#ED1235",
      light: "#F2EFEA",
    },
    logo: {
      status: "authorized",
      path: "/images/army-pass/logos/arirang-logo-novo.jpeg",
      credit: "Identidade ARIRANG / arquivo fornecido pelo usuário",
      source:
        "https://bts.ibighit.com/eng/discography/detail/arirang/index.html",
      rightsHolder:
        "BIGHIT MUSIC é responsável pela fonte; titularidade específica a confirmar",
      authorizationReference:
        "User supplied asset; requested use in ARIRANG on 2026-10-25",
      usageConditions:
        "Display the supplied original in ARIRANG only, preserving shapes and colors",
      placement: { x: 221, y: 24, width: 629, height: 330 },
    },
  },
};

export const MAX_GALLERY_PHOTOS_PER_ERA = 3;

export function initialCropForPhoto(photo: AuthorizedEraPhoto) {
  return {
    zoom: photo.initialScale,
    x: photo.objectPositionX,
    y: photo.objectPositionY,
  };
}

const projectSuppliedPhotoSource =
  "Arquivo local fornecido pelo responsável do projeto";
const projectConfirmedAuthorization = {
  status: "authorized",
  reference:
    "Autorização de uso no Army Pass confirmada pelo responsável do projeto em 2026-10-25",
} as const;

export const eraPhotoManifest: readonly AuthorizedEraPhoto[] = [
  {
    id: "wings-01",
    era: "wings",
    path: "/images/army-pass/gallery/wings/wings-01.jpg",
    description:
      "BTS reunido em uma composição de estúdio em tons de azul, fotografia WINGS.",
    credit: "BTS · WINGS — arquivo fornecido pelo responsável do projeto",
    source: projectSuppliedPhotoSource,
    authorization: projectConfirmedAuthorization,
    fitMode: "contain",
    objectPositionX: 50,
    objectPositionY: 50,
    initialScale: 1,
  },
  {
    id: "wings-02",
    era: "wings",
    path: "/images/army-pass/gallery/wings/wings-02.jpg",
    description:
      "BTS em uma sala decorada, fotografia WINGS com a marca do álbum.",
    credit: "BTS · WINGS — arquivo fornecido pelo responsável do projeto",
    source: projectSuppliedPhotoSource,
    authorization: projectConfirmedAuthorization,
    fitMode: "contain",
    objectPositionX: 50,
    objectPositionY: 50,
    initialScale: 1,
  },
  {
    id: "wings-03",
    era: "wings",
    path: "/images/army-pass/gallery/wings/wings-03.jpg",
    description: "BTS em uma sala clássica com lustres, fotografia WINGS.",
    credit: "BTS · WINGS — arquivo fornecido pelo responsável do projeto",
    source: projectSuppliedPhotoSource,
    authorization: projectConfirmedAuthorization,
    fitMode: "cover",
    objectPositionX: 50,
    objectPositionY: 78,
    initialScale: 1,
  },
  {
    id: "mots7-white-swan",
    era: "map-of-the-soul",
    path: "/images/army-pass/gallery/map-of-the-soul-7/mots7-01.jpg",
    description:
      "BTS em figurinos brancos para o conceito White Swan de MAP OF THE SOUL: 7.",
    credit:
      "BTS · MAP OF THE SOUL: 7 — arquivo fornecido pelo responsável do projeto",
    source: projectSuppliedPhotoSource,
    authorization: projectConfirmedAuthorization,
    fitMode: "contain",
    objectPositionX: 50,
    objectPositionY: 50,
    initialScale: 1,
  },
  {
    id: "mots7-black-swan",
    era: "map-of-the-soul",
    path: "/images/army-pass/gallery/map-of-the-soul-7/mots7-02.jpg",
    description:
      "BTS em composição escura com asas para o conceito Black Swan de MAP OF THE SOUL: 7.",
    credit:
      "BTS · MAP OF THE SOUL: 7 — arquivo fornecido pelo responsável do projeto",
    source: projectSuppliedPhotoSource,
    authorization: projectConfirmedAuthorization,
    fitMode: "contain",
    objectPositionX: 50,
    objectPositionY: 50,
    initialScale: 1,
  },
  {
    id: "mots7-banquet",
    era: "map-of-the-soul",
    path: "/images/army-pass/gallery/map-of-the-soul-7/mots7-03.jpg",
    description:
      "BTS reunido à mesa em composição de banquete para MAP OF THE SOUL: 7.",
    credit:
      "BTS · MAP OF THE SOUL: 7 — arquivo fornecido pelo responsável do projeto",
    source: projectSuppliedPhotoSource,
    authorization: projectConfirmedAuthorization,
    fitMode: "contain",
    objectPositionX: 50,
    objectPositionY: 50,
    initialScale: 1,
  },
  {
    id: "persona-pink-room",
    era: "persona",
    path: "/images/army-pass/gallery/persona/persona-01.jpg",
    description:
      "BTS reunido em um ambiente rosa e coral para o conceito Pink Room de MAP OF THE SOUL: PERSONA.",
    credit:
      "BTS · MAP OF THE SOUL: PERSONA — arquivo fornecido pelo responsável do projeto",
    source: projectSuppliedPhotoSource,
    authorization: projectConfirmedAuthorization,
    fitMode: "contain",
    objectPositionX: 50,
    objectPositionY: 50,
    initialScale: 1,
  },
  {
    id: "persona-pastel-hearts",
    era: "persona",
    path: "/images/army-pass/gallery/persona/persona-02.jpg",
    description:
      "BTS em figurinos claros formando corações no conceito Pastel Hearts de MAP OF THE SOUL: PERSONA.",
    credit:
      "BTS · MAP OF THE SOUL: PERSONA — arquivo fornecido pelo responsável do projeto",
    source: projectSuppliedPhotoSource,
    authorization: projectConfirmedAuthorization,
    fitMode: "contain",
    objectPositionX: 50,
    objectPositionY: 50,
    initialScale: 1,
  },
  {
    id: "persona-colorful-concept",
    era: "persona",
    path: "/images/army-pass/gallery/persona/persona-03.jpg",
    description:
      "BTS em figurinos coloridos para o conceito Colorful Concept de MAP OF THE SOUL: PERSONA.",
    credit:
      "BTS · MAP OF THE SOUL: PERSONA — arquivo fornecido pelo responsável do projeto",
    source: projectSuppliedPhotoSource,
    authorization: projectConfirmedAuthorization,
    fitMode: "contain",
    objectPositionX: 50,
    objectPositionY: 50,
    initialScale: 1,
  },
  {
    id: "arirang-dark-group",
    era: "arirang",
    path: "/images/army-pass/gallery/arirang/arirang-01.jpg",
    description:
      "BTS reunido em figurinos escuros em uma composição de estúdio da era ARIRANG.",
    credit: "BTS · ARIRANG — arquivo fornecido pelo responsável do projeto",
    source: projectSuppliedPhotoSource,
    authorization: projectConfirmedAuthorization,
    fitMode: "contain",
    objectPositionX: 50,
    objectPositionY: 50,
    initialScale: 1,
  },
  {
    id: "arirang-red-group",
    era: "arirang",
    path: "/images/army-pass/gallery/arirang/arirang-02.jpg",
    description:
      "BTS em composição quadrada diante de fundo vermelho para a era ARIRANG.",
    credit: "BTS · ARIRANG — arquivo fornecido pelo responsável do projeto",
    source: projectSuppliedPhotoSource,
    authorization: projectConfirmedAuthorization,
    fitMode: "contain",
    objectPositionX: 50,
    objectPositionY: 50,
    initialScale: 1,
  },
  {
    id: "arirang-boat",
    era: "arirang",
    path: "/images/army-pass/gallery/arirang/arirang-03.jpg",
    description: "BTS reunido no convés de um barco para a era ARIRANG.",
    credit: "BTS · ARIRANG — arquivo fornecido pelo responsável do projeto",
    source: projectSuppliedPhotoSource,
    authorization: projectConfirmedAuthorization,
    fitMode: "contain",
    objectPositionX: 50,
    objectPositionY: 50,
    initialScale: 1,
  },
];

export function photosForEra(era: EraId, manifest = eraPhotoManifest) {
  return manifest
    .filter(
      (photo) =>
        photo.era === era &&
        photo.authorization.status === "authorized" &&
        photo.authorization.reference.trim() &&
        photo.credit.trim() &&
        photo.source.trim() &&
        photo.description.trim() &&
        isLocalEraPhoto(photo.path, era),
    )
    .slice(0, MAX_GALLERY_PHOTOS_PER_ERA);
}

export function isLocalEraPhoto(path: string, era: EraId) {
  const directories: Record<EraId, string | null> = {
    wings: "wings",
    "map-of-the-soul": "map-of-the-soul-7",
    persona: "persona",
    arirang: "arirang",
    be: null,
  };
  const directory = directories[era];
  return (
    directory !== null &&
    path.startsWith(`/images/army-pass/gallery/${directory}/`) &&
    !path.includes("..") &&
    !/[?#%\\]/.test(path) &&
    /\.(jpe?g|png|webp)$/i.test(path)
  );
}

export const brazilianStates = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;
export const biases = [
  "RM",
  "Jin",
  "SUGA",
  "j-hope",
  "Jimin",
  "V",
  "Jung Kook",
  "OT7",
] as const;
export const experienceOptions = [
  "Show",
  "Cinema",
  "Acompanhando de casa",
  "Prefiro não informar",
] as const;

// Separate authentic BTS mark. Empty until the approved original is supplied.
export const btsLogo: EraLogo = {
  ...eraThemes.wings.logo,
  credit: "BIGHIT MUSIC / BTS — crédito final a confirmar",
  source: "https://ibighit.com/bts/eng/",
  placement: { x: 967, y: 68, width: 43, height: 79 },
};

// The supplied black variant is exclusive to the light ARIRANG template.
export const arirangBtsLogo: EraLogo = {
  ...btsLogo,
  status: "authorized",
  path: "/images/army-pass/logos/bts-logo.png",
  credit: "BTS / user supplied original",
  authorizationReference:
    "User supplied asset; requested use in ARIRANG on 2026-10-25",
  usageConditions:
    "Display the supplied black original in ARIRANG only, without recoloring",
  placement: { x: 956, y: 74, width: 48, height: 100 },
};
