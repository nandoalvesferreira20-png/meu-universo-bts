import fs from "node:fs/promises";
import sharp from "sharp";
const source =
  "https://www.netflix.com/tudum/features/bts-comeback-live-arirang-recap-highlights";
const urls = [
  "https://dnm.nflximg.net/api/v6/a01MIaQTUgSJoLaS_OCn68Eg3hU/AAAAQY-pm-msRMtGr2dJYf2R_P99iaxZrNiAIqNw3-TteueDAMp7CiBz-3OHtU42Lk3gNR_TAvpUr2jda5YDjnlOZjsHG1E__JzimrdQMP0F9uYI2-E4m0GC5AGUw5eyIC-SnetI5Hbbh2DFAIM6TFdbxb0M.jpg?r=d49",
  "https://dnm.nflximg.net/api/v6/a01MIaQTUgSJoLaS_OCn68Eg3hU/AAAAQf5szrAO3RNrt9L7KJc8Yuam1nz1Cio0brFKRWAeN24Tz8hvnH0g-Ikql9BthAS8HtkXuizy8m4gBJNJx_g-r10mIJ_pSoLLUnyEei5c-TKU2q_GWynARGSpduUhszC9Xxl_lP0vPWRJXu9757KTppMc.png?r=e32",
  "https://dnm.nflximg.net/api/v6/a01MIaQTUgSJoLaS_OCn68Eg3hU/AAAAQaDXXWoruZZo_LOUYAg7GoE6LnsVq4sfG6Sdx8A7BSBBvjmfxfwrcC9iDNKqldTX8X2d2LqTcPWDtJk2xqEcI_JUS0kwPQyEWMWDQBGZda_AujrvcsMNUNdaOu53Qr20tMVDd9kbDnnolLQMMsyfwZrU.png?r=a76",
  "https://dnm.nflximg.net/api/v6/a01MIaQTUgSJoLaS_OCn68Eg3hU/AAAAQWGVHKWklspZQfczfcnDtzLAttN0--He3L3D-VC74hycAc_lUJLSHJ4aBWa-LDJ_UeFt7yS7xvkf1uQk4j1xQQ0GKRadT_LnU7c4ssKD3GpXLstE7td52y9L0NY26rIJhZ5hsS4enkCzI_I_83ynyMS3.png?r=37b",
];
const dir = "public/images/arirang-tour/seoul-netflix";
await fs.mkdir(dir, { recursive: true });
const records = [];
for (const [i, url] of urls.entries()) {
  const r = await fetch(url);
  if (!r.ok) throw Error(`Image ${i}: ${r.status}`);
  const filename = `seoul-netflix-0${i + 1}.webp`;
  const info = await sharp(Buffer.from(await r.arrayBuffer()))
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(`${dir}/${filename}`);
  records.push({
    src: `/images/arirang-tour/seoul-netflix/${filename}`,
    width: info.width,
    height: info.height,
    bytes: info.size,
    source,
    url,
    credit: "BIGHIT MUSIC / Netflix © 2026",
    rights:
      "Material editorial oficial; direitos reservados. Não é Creative Commons.",
    changes:
      "Redimensionamento proporcional e conversão para WebP; sem recorte.",
  });
  console.log(filename, info.width, info.height, info.size);
}
await fs.writeFile(
  `${dir}/sources.json`,
  JSON.stringify(records, null, 2) + "\n",
);
