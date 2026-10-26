import fs from "node:fs/promises";
const photos = JSON.parse(
  await fs.readFile("test-artifacts/history-curation/authorized.json", "utf8"),
);
const types = `// Curadoria verificada em 26/10/2026. Evidências: docs/history-photo-license-evidence.json.
export interface AuthorizedHistoryPhoto {
  status: "authorized"; year: number; filename: string; src: \`/images/historia/\${string}.webp\`;
  description: string; alt: string; credit: string; eventDate: string;
  originalSource: string; sourceUrl: string; authorizationEvidence: string;
  license: { name: string; url: string }; originalDimensions: { width: number; height: number };
  acquiredDimensions: { width: number; height: number }; width: number; height: number;
  bytes: number; sha256: string; objectPosition: string; changes: string; notes: string; verifiedOn: string;
}
export interface PendingHistoryPhoto {
  status: "candidate"; year: number; filename: null; description: string;
  originalSource: string | null; sourceUrl: string; credit: string | null;
  eventDate: string | null; dimensions: { width: number; height: number } | null;
  license: null; reason: string;
}
`;
const pending = [
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
    dimensions: { width: 531, height: 720 },
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
];
await fs.writeFile(
  "src/data/history-photos.ts",
  types +
    "\nexport const authorizedHistoryPhotos = " +
    JSON.stringify(photos, null, 2) +
    " satisfies readonly AuthorizedHistoryPhoto[];\n\nexport const pendingHistoryPhotos = " +
    JSON.stringify(pending, null, 2) +
    " satisfies readonly PendingHistoryPhoto[];\n\nexport function getHistoryPhoto(year: number): AuthorizedHistoryPhoto | undefined {\n return authorizedHistoryPhotos.find(photo => photo.year === year);\n}\n",
);
