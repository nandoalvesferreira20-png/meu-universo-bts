import fs from "node:fs/promises";
import crypto from "node:crypto";
import sharp from "sharp";
const captions = {
  2013: [
    "BTS em um fanmeeting do Music Bank, em 26 de julho de 2013.",
    "Os sete integrantes do BTS lado a lado, com uniformes pretos, no fanmeeting do Music Bank em 2013.",
    "BulletProof7BTS",
    "Fanmeeting do Music Bank · período de estreia / No More Dream.",
  ],
  2014: [
    "BTS em um encontro de autógrafos, em 12 de setembro de 2014.",
    "Os sete integrantes do BTS reunidos em um encontro de autógrafos de 2014, com roupas verdes e microfones.",
    "JinTime",
    "Encontro de autógrafos durante a era DARK & WILD; não é fotografia conceitual do álbum.",
  ],
  2015: [
    "BTS em um encontro de autógrafos, em 16 de maio de 2015.",
    "BTS posa com os braços abertos em um encontro com fãs durante o período de I NEED U, em 2015.",
    "JinTime",
    "Registro de maio de 2015, no período de HYYH Pt. 1 / I NEED U.",
  ],
  2016: [
    "BTS no Asia Artist Awards, em 16 de novembro de 2016.",
    "Os sete integrantes do BTS posam no tapete vermelho do Asia Artist Awards de 2016, com roupas escuras.",
    "TenAsia / K-POPIT 케이팝잇 TV10",
    "Registro de imprensa durante a era WINGS; quadro de vídeo licenciado, não foto conceitual do álbum.",
  ],
  2017: [
    "BTS em um ensaio para a Dispatch, em Los Angeles, em novembro de 2017.",
    "BTS em um terraço de Los Angeles ao pôr do sol, com a cidade ao fundo, em ensaio de 2017.",
    "KOREA Dispatch",
    "Ensaio no período de LOVE YOURSELF: HER; o dia exato não está documentado na fonte. Quadro de vídeo licenciado.",
  ],
  2018: [
    "BTS na chegada ao Music Bank, em 31 de agosto de 2018.",
    "Os sete integrantes do BTS posam juntos na chegada a uma gravação do Music Bank, em agosto de 2018.",
    "뉴스인스타 (News in Star)",
    "Registro de imprensa no período de LOVE YOURSELF: ANSWER / IDOL; quadro de vídeo licenciado.",
  ],
  2019: [
    "BTS na coletiva de MAP OF THE SOUL: PERSONA, em 17 de abril de 2019.",
    "BTS posa em frente a um painel rosa na coletiva de MAP OF THE SOUL: PERSONA, em 2019.",
    "Dispatch",
    "Coletiva de lançamento de PERSONA; quadro de vídeo licenciado.",
  ],
  2021: [
    "Permission to Dance On Stage, no SoFi Stadium, em 1º de dezembro de 2021.",
    "Os sete integrantes do BTS se apresentam com roupas claras no palco de Permission to Dance On Stage, em Los Angeles.",
    "Monbmon",
    "Fotografia de público, com perspectiva do estádio e nitidez compatível com essa distância. WebP distribuído sob CC BY-SA 4.0.",
  ],
  2024: [
    "Jin acompanha o retorno de j-hope do serviço militar, em 17 de outubro de 2024.",
    "j-hope, de uniforme, presta continência; Jin, de roupa vermelha, segura os microfones ao seu lado.",
    "TV10 / K-POPIT 케이팝잇",
    "Quadro de vídeo do retorno de j-hope, com Jin. Original de 746 × 968; versão obtida de 500 × 649 por limitação de acesso ao original. Exibição contida, sem ampliar o arquivo nem cortar a composição.",
  ],
  2026: [
    "BTS durante SWIM na turnê ARIRANG, em Paris, em 17 de julho de 2026.",
    "Vista do BTS no palco central e do público no Stade de France durante a turnê ARIRANG, em 2026.",
    "Chiyako92",
    "Fotografia de público, com o grupo à distância. Manter composição integral: a fonte sinaliza elementos de tela de minimis; não recortar para destacar as telas. WebP sob CC BY-SA 4.0.",
  ],
};
const photos = [];
const evidence = [];
await fs.mkdir("public/images/historia", { recursive: true });
for (const [yearText, [description, alt, credit, notes]] of Object.entries(
  captions,
)) {
  const year = Number(yearText);
  const snapshot = JSON.parse(
    await fs.readFile(
      `test-artifacts/history-curation/${year}-metadata.json`,
      "utf8",
    ),
  );
  const info = snapshot.imageinfo[0];
  const input = await fs.readFile(
    `test-artifacts/history-curation/${year}-original`,
  );
  const acquired = await sharp(input).metadata();
  const filename = `bts-${year}.webp`;
  const output = await sharp(input)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 86, effort: 6 })
    .toBuffer({ resolveWithObject: true });
  await fs.writeFile(`public/images/historia/${filename}`, output.data);
  const originalSource =
    [...info.extmetadata.Credit.value.matchAll(/href="([^"]+)"/g)]
      .map((match) => match[1])
      .find(
        (url) => url.startsWith("http") && !url.includes("web.archive.org"),
      ) || info.descriptionurl;
  const date = info.extmetadata.DateTimeOriginal.value.slice(0, 10);
  photos.push({
    status: "authorized",
    year,
    filename,
    src: `/images/historia/${filename}`,
    description,
    alt,
    credit,
    eventDate: date,
    originalSource,
    sourceUrl: info.descriptionurl,
    license: {
      name: info.extmetadata.LicenseShortName.value,
      url: info.extmetadata.LicenseUrl.value,
    },
    authorizationEvidence: `https://commons.wikimedia.org/w/index.php?oldid=${snapshot.revisions[0].revid}`,
    originalDimensions: { width: info.width, height: info.height },
    acquiredDimensions: { width: acquired.width, height: acquired.height },
    width: output.info.width,
    height: output.info.height,
    bytes: output.info.size,
    sha256: crypto.createHash("sha256").update(output.data).digest("hex"),
    objectPosition: "50% 50%",
    changes:
      "Redimensionamento proporcional e conversão para WebP. Sem recorte, retoque, remoção de marcas ou aumento de resolução.",
    notes,
    verifiedOn: "2026-10-26",
  });
  evidence.push({ year, ...snapshot });
  console.log(
    `${filename}: ${output.info.width}x${output.info.height}, ${Math.round(output.info.size / 1024)} KB`,
  );
}
await fs.writeFile(
  "test-artifacts/history-curation/authorized.json",
  JSON.stringify(photos, null, 2),
);
await fs.writeFile(
  "docs/history-photo-license-evidence.json",
  JSON.stringify(evidence, null, 2),
);
