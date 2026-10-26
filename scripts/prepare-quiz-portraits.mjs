import fs from "node:fs/promises";
import sharp from "sharp";
import { createHash } from "node:crypto";

const members = [
  ["rm", "RM", 2],
  ["jin", "Jin", 2],
  ["suga", "Suga", 1],
  ["j-hope", "J-Hope", 2],
  ["jimin", "Jimin", 2],
  ["v", "V", 2],
  ["jung-kook", "Jungkook", 2],
];
const folder = "test-artifacts/quiz-portraits";
const headers = {
  "User-Agent": "ArmyPassBrasilPortraitCuration/1.0 (local editorial research)",
};
await fs.mkdir(folder, { recursive: true });
for (const [id, name, variant] of members) {
  const title = `File:1117 ${name} (BTS) Dispatch Photo Shoot LA (${variant}).png`;
  const cached = await fs
    .readFile(`${folder}/${id}.json`, "utf8")
    .catch(() => null);
  if (
    cached &&
    (await fs.stat(`${folder}/${id}-original.png`).catch(() => null))
  ) {
    console.log(`${id}: cached`);
    continue;
  }
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "imageinfo|revisions",
    iiprop: "url|size|extmetadata|sha1",
    rvprop: "ids|timestamp",
    titles: title,
  });
  const response = await fetch(
    `https://commons.wikimedia.org/w/api.php?${params}`,
    { headers },
  );
  if (!response.ok) throw Error(`${id}: metadata HTTP ${response.status}`);
  const page = Object.values((await response.json()).query.pages)[0];
  const info = page.imageinfo?.[0];
  if (
    page.title !== title ||
    info?.extmetadata.LicenseShortName?.value !== "CC BY 3.0" ||
    !info.extmetadata.LicenseUrl?.value.includes(
      "creativecommons.org/licenses/by/3.0",
    )
  )
    throw Error(`${id}: identity/license not confirmed`);
  let download = await fetch(info.url, { headers });
  for (let retry = 0; download.status === 429 && retry < 2; retry++) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    download = await fetch(info.url, { headers });
  }
  if (!download.ok) {
    const renditionParams = new URLSearchParams({
      action: "query",
      format: "json",
      prop: "imageinfo",
      iiprop: "url",
      iiurlwidth: "400",
      titles: title,
    });
    const result = await fetch(
      `https://commons.wikimedia.org/w/api.php?${renditionParams}`,
      { headers },
    ).then((r) => r.json());
    const rendition = Object.values(result.query.pages)[0].imageinfo[0]
      .thumburl;
    if (new URL(rendition).hostname !== "thumb.wikimedia.org")
      throw Error(`${id}: unexpected rendition host`);
    download = await fetch(rendition, { headers });
    page.downloadedRendition = rendition;
  }
  if (!download.ok) throw Error(`${id}: image HTTP ${download.status}`);
  const bytes = Buffer.from(await download.arrayBuffer());
  await fs.writeFile(`${folder}/${id}-original.png`, bytes);
  await fs.writeFile(
    `${folder}/${id}.json`,
    JSON.stringify({ retrievedAt: new Date().toISOString(), ...page }, null, 2),
  );
  await sharp(bytes)
    .resize({
      width: 400,
      height: 600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png()
    .toFile(`${folder}/${id}-review.png`);
  console.log(
    `${id}: ${info.width}x${info.height}; ${info.extmetadata.LicenseShortName.value}; ${info.descriptionurl}`,
  );
  await new Promise((resolve) => setTimeout(resolve, 2500));
}

// Run with --publish only after visually reviewing the seven staged originals.
if (process.argv.includes("--publish")) {
  const target = "public/images/jogos/integrantes";
  await fs.mkdir(target, { recursive: true });
  const records = [];
  const evidence = [];
  for (const [id, name] of members) {
    const page = JSON.parse(await fs.readFile(`${folder}/${id}.json`, "utf8"));
    const info = page.imageinfo[0],
      ext = info.extmetadata;
    if (ext.LicenseShortName.value !== "CC BY 3.0")
      throw Error(`Unverified license: ${id}`);
    const original = await fs.readFile(`${folder}/${id}-original.png`);
    const dimensions = await sharp(original).metadata();
    const file = `${target}/${id}.webp`;
    await sharp(original)
      .resize(320, 400, {
        fit: "cover",
        position: "north",
        withoutEnlargement: true,
      })
      .webp({ quality: 90, effort: 6 })
      .toFile(file);
    const bytes = await fs.readFile(file);
    const originalSource = ext.Credit.value.match(
      /href="(https:\/\/www\.youtube\.com\/watch\?v=[^"]+)"/,
    )?.[1];
    if (!originalSource) throw Error(`Missing original source: ${id}`);
    records.push({
      id,
      name:
        id === "suga"
          ? "SUGA"
          : id === "j-hope"
            ? "j-hope"
            : id === "jung-kook"
              ? "Jung Kook"
              : name,
      src: `/images/jogos/integrantes/${id}.webp`,
      alt: `${name === "J-Hope" ? "j-hope" : name === "Jungkook" ? "Jung Kook" : name} em ensaio da KOREA Dispatch em Los Angeles, novembro de 2017`,
      title: page.title.replace(/^File:/, ""),
      width: 320,
      height: 400,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      credit: "KOREA Dispatch",
      authorUrl: "https://www.youtube.com/user/dispatchsns",
      sourceUrl: info.descriptionurl,
      originalSource,
      originalDimensions: { width: info.width, height: info.height },
      acquiredDimensions: {
        width: dimensions.width,
        height: dimensions.height,
      },
      license: {
        name: "CC BY 3.0",
        url: "https://creativecommons.org/licenses/by/3.0/",
      },
      authorizationEvidence: `https://commons.wikimedia.org/w/index.php?oldid=${page.revisions[0].revid}`,
      changes:
        "Recorte superior em 4:5, redimensionamento para 320 × 400 e conversão para WebP. Sem retoque ou remoção de marcas.",
      verifiedOn: "2026-10-26",
    });
    evidence.push(page);
    console.log(`${id}.webp: ${bytes.length} bytes`);
  }
  await fs.writeFile(
    `${target}/credits.json`,
    JSON.stringify(records, null, 2) + "\n",
  );
  await fs.writeFile(
    "docs/quiz-portrait-license-evidence.json",
    JSON.stringify(evidence, null, 2) + "\n",
  );
}
