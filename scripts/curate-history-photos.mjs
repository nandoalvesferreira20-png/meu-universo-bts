import fs from "node:fs/promises";
import sharp from "sharp";
const selections = [
  [2013, "Bangtan Boys at a fanmeeting on Music Bank in July 2013 01.jpg"],
  [2014, "BTS at a fansigning event, 12 September 2014.jpg"],
  [2015, "BTS at a fansigning event, 16 May 2015.jpg"],
  [2016, "161116 BTS at the Asia Artist Awards.png"],
  [2017, "1117 BTS Dispatch Photo Shoot LA.png"],
  [2018, "180831 BTS at KBS Music Bank recording.png"],
  [
    2019,
    'BTS at "Map of the Soul - Persona" global press conference, 17 April 2019 03.jpg',
  ],
  [2021, "BTS Permission to Dance On Stage Dec 1, 2021.jpg"],
  [2024, "BTS J-Hope military discharge, 17 October 2024 02.png"],
  [2026, "BTS Arirang World Tour in Paris (17 July 2026) - Swim.jpg"],
];
const headers = {
  "User-Agent": "ArmyPassBrasilPhotoCuration/1.0 (editorial local research)",
};
await fs.mkdir("test-artifacts/history-curation", { recursive: true });
for (const [year, title] of selections) {
  try {
    if (
      await fs
        .stat(`test-artifacts/history-curation/${year}-review.jpg`)
        .catch(() => null)
    ) {
      const cached = JSON.parse(
        await fs.readFile(
          `test-artifacts/history-curation/${year}-metadata.json`,
          "utf8",
        ),
      );
      if (cached.title === `File:${title}`) {
        console.log(`${year}: cached`);
        continue;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const query = new URLSearchParams({
      action: "query",
      format: "json",
      prop: "imageinfo|revisions",
      iiprop: "url|size|extmetadata|sha1",
      rvprop: "ids|timestamp",
      titles: `File:${title}`,
    });
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?${query}`,
      { headers },
    );
    if (!response.ok) throw new Error(`Metadata ${year}: ${response.status}`);
    const result = await response.json();
    const page = Object.values(result.query.pages)[0];
    const info = page.imageinfo?.[0];
    if (
      !info ||
      !["CC BY 3.0", "CC BY 4.0", "CC BY-SA 4.0"].includes(
        info.extmetadata.LicenseShortName?.value,
      )
    )
      throw new Error(`License not verified: ${year}`);
    await fs.writeFile(
      `test-artifacts/history-curation/${year}-metadata.json`,
      JSON.stringify(
        { retrievedAt: new Date().toISOString(), ...page },
        null,
        2,
      ),
    );
    const downloadUrl = new URL(info.url);
    downloadUrl.search = "";
    let asset = await fetch(downloadUrl, { headers });
    for (let retry = 0; asset.status === 429 && retry < 2; retry++) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      asset = await fetch(downloadUrl, { headers });
    }
    if (!asset.ok) {
      const renditionQuery = new URLSearchParams({
        action: "query",
        format: "json",
        prop: "imageinfo",
        iiprop: "url",
        iiurlwidth: String(Math.min(info.width, year === 2024 ? 500 : 1600)),
        titles: `File:${title}`,
      });
      const renditionResult = await fetch(
        `https://commons.wikimedia.org/w/api.php?${renditionQuery}`,
        { headers },
      ).then((r) => r.json());
      const rendition = Object.values(renditionResult.query.pages)[0]
        .imageinfo[0];
      const renditionUrl = new URL(rendition.thumburl);
      renditionUrl.search = "";
      if (renditionUrl.hostname !== "thumb.wikimedia.org")
        throw new Error(`No smaller rendition for ${year}`);
      asset = await fetch(renditionUrl, { headers });
      page.downloadedRendition = renditionUrl.href;
    }
    if (!asset.ok) throw new Error(`Image ${year}: ${asset.status}`);
    const bytes = Buffer.from(await asset.arrayBuffer());
    const original = `test-artifacts/history-curation/${year}-original`;
    await fs.writeFile(original, bytes);
    const meta = await sharp(bytes).metadata();
    if (meta.width > info.width || meta.height > info.height)
      throw new Error(`Upscaled rendition ${year}`);
    page.downloadedDimensions = { width: meta.width, height: meta.height };
    await fs.writeFile(
      `test-artifacts/history-curation/${year}-metadata.json`,
      JSON.stringify(
        { retrievedAt: new Date().toISOString(), ...page },
        null,
        2,
      ),
    );
    await sharp(bytes)
      .resize({
        width: 600,
        height: 360,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 90 })
      .toFile(`test-artifacts/history-curation/${year}-review.jpg`);
    console.log(
      JSON.stringify({
        year,
        width: meta.width,
        height: meta.height,
        license: info.extmetadata.LicenseShortName.value,
        credit: info.extmetadata.Artist?.value,
        date: info.extmetadata.DateTimeOriginal?.value,
        url: info.descriptionurl,
      }),
    );
  } catch (error) {
    console.error(`${year}: ${error.message}`);
    process.exitCode = 1;
  }
}
