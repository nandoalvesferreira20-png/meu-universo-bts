import { eraThemes } from "./themes";
import type { ArtworkVariant, EraId } from "./types";

// Geometrias autorais, sem imagens externas, fontes embutidas ou material oficial.
export function artworkSvg(era: EraId, variant: ArtworkVariant): string {
  if (era === "persona")
    throw new Error(
      "PERSONA possui um único template e não utiliza artes legadas.",
    );
  const { dark, mid, accent, light } = eraThemes[era].colors;
  let shapes = "";
  if (era === "wings") {
    shapes =
      variant === 0
        ? `<ellipse cx="360" cy="370" rx="220" ry="295" fill="none" stroke="${accent}" stroke-width="2" transform="rotate(24 360 370)"/><ellipse cx="360" cy="370" rx="150" ry="250" fill="none" stroke="${accent}"/><circle cx="475" cy="160" r="30" fill="${accent}"/>`
        : variant === 1
          ? Array.from(
              { length: 12 },
              (_, i) =>
                `<path d="M${90 + i * 32} 660 Q${600 - i * 20} 390 ${125 + i * 25} 80" fill="none" stroke="${accent}" opacity="${0.3 + i / 20}"/>`,
            ).join("")
          : `<rect x="120" y="130" width="480" height="480" fill="${mid}"/><path d="M240 230 L480 470 M480 230 L240 470" stroke="${accent}"/><circle cx="360" cy="350" r="130" fill="none" stroke="${accent}"/>`;
  } else if (era === "map-of-the-soul") {
    shapes =
      variant === 0
        ? `<path d="M-60 530 Q260 30 560 340 T900 180 V820 H-60Z" fill="${mid}"/><path d="M-50 670 Q330 220 790 490 V820 H-50Z" fill="${accent}"/><circle cx="240" cy="230" r="90" fill="${light}"/>`
        : variant === 1
          ? [0, 1, 2, 3, 4]
              .map(
                (i) =>
                  `<ellipse cx="${180 + i * 85}" cy="${270 + i * 50}" rx="210" ry="295" transform="rotate(-35 360 400)" fill="${i % 2 ? mid : accent}" opacity=".6"/>`,
              )
              .join("")
          : `<rect x="150" y="160" width="420" height="420" rx="125" transform="rotate(25 360 370)" fill="${accent}"/><circle cx="310" cy="320" r="155" fill="${mid}"/><circle cx="440" cy="480" r="95" fill="${light}"/>`;
  } else if (era === "be") {
    shapes =
      variant === 0
        ? `<path d="M190 560 V280 A170 170 0 0 1 530 280 V560Z" fill="${accent}"/><text x="360" y="390" text-anchor="middle" fill="${dark}" font-family="Georgia,serif" font-size="92" font-style="italic">be here.</text><path d="M240 455 H480" stroke="${mid}"/>`
        : variant === 1
          ? `<circle cx="220" cy="300" r="170" fill="${accent}"/><path d="M340 130 H580 V570 H340Z" fill="${mid}"/>` +
            Array.from(
              { length: 45 },
              (_, i) =>
                `<path d="M100 ${120 + i * 12} H620" stroke="${dark}" opacity=".08"/>`,
            ).join("")
          : `<rect x="150" y="160" width="420" height="420" fill="${accent}"/><circle cx="360" cy="370" r="140" fill="${dark}"/><circle cx="360" cy="370" r="105" fill="none" stroke="${light}"/><path d="M360 200 V540" stroke="${light}"/>`;
  } else {
    shapes =
      variant === 0
        ? `<path d="M90 660 V260 A270 270 0 0 1 630 260 V660Z" fill="${mid}"/><path d="M230 660 V330 A130 130 0 0 1 490 330 V660Z" fill="${accent}"/><path d="M360 190 V650" stroke="${light}" stroke-width="2"/>`
        : variant === 1
          ? `<rect x="80" y="100" width="560" height="550" rx="280" fill="${accent}"/><circle cx="360" cy="360" r="180" fill="none" stroke="${dark}" stroke-width="2"/><path d="M80 360 H640 M360 100 V650" stroke="${light}"/>`
          : `<path d="M0 0 H360 V740 H0Z" fill="${light}"/><circle cx="360" cy="360" r="240" fill="${mid}"/><path d="M160 560 L560 160" stroke="${accent}" stroke-width="35"/><path d="M160 160 L560 560" stroke="${light}" stroke-width="2"/>`;
  }
  const fineLines = Array.from(
    { length: 16 },
    (_, i) =>
      `<path d="M${45 + i * 42} 685 v12" stroke="${accent}" stroke-width="1" opacity=".5"/>`,
  ).join("");
  const paper = `<rect x="28" y="28" width="664" height="684" rx="2" fill="none" stroke="${era === "be" ? mid : accent}" stroke-width="1" opacity=".45"/><path d="M48 55 h90 M582 685 h90" stroke="${era === "be" ? dark : light}" opacity=".6"/><text x="52" y="682" fill="${era === "be" ? dark : light}" font-family="Arial,sans-serif" font-size="10" letter-spacing="3" opacity=".8">ESTUDO ${String(variant + 1).padStart(2, "0")} / ARMY BR</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="740" viewBox="0 0 720 740"><rect width="720" height="740" fill="${era === "be" ? light : dark}"/>${shapes}${fineLines}${paper}</svg>`;
}

export function artworkDataUrl(era: EraId, variant: ArtworkVariant) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(artworkSvg(era, variant))}`;
}
