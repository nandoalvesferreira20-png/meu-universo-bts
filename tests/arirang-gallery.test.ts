import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
// CSS Modules are provided by Next in production; this test checks server rendering.
require.extensions[".css"] = (module: NodeJS.Module) => {
  module.exports = {};
};
const { EventCarousel } =
  // Load only after installing the CSS Module stub above.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("../src/features/arirang-tour/event-carousel") as typeof import("../src/features/arirang-tour/event-carousel");
const photo = {
  src: "/images/arirang-tour/seoul-netflix/seoul-netflix-01.webp",
  alt: "Foto do evento",
  width: 1200,
  height: 800,
  caption: "Legenda original",
  source: "https://www.netflix.com/tudum/bts-the-comeback-live-arirang",
  credit: "Netflix",
};
test("galeria: uma única imagem preserva foto, miniatura e legenda sem navegação redundante", () => {
  const html = renderToStaticMarkup(
    createElement(EventCarousel, { images: [photo] }),
  );
  assert.match(html, /Legenda original/);
  assert.match(html, /aria-label="1 de 1"/);
  assert.match(html, /aria-label="Ver fotografia 1" aria-current="true"/);
  assert.doesNotMatch(
    html,
    /aria-label="Próxima fotografia"|aria-label="Fotografia anterior"/,
  );
});
test("galeria: lista vazia não quebra a renderização", () => {
  assert.equal(
    renderToStaticMarkup(createElement(EventCarousel, { images: [] })),
    "",
  );
});
