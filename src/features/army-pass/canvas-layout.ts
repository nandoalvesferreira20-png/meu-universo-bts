// Quebra palavras longas por grafema, preservando acentos e sequências de emoji.
export function wrapText(
  context: Pick<CanvasRenderingContext2D, "measureText">,
  text: string,
  maxWidth: number,
) {
  const lines: string[] = [];
  const segmenter = new Intl.Segmenter("pt-BR", { granularity: "grapheme" });
  for (const paragraph of text.replace(/\r/g, "").split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (context.measureText(candidate).width <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) {
        lines.push(line);
        line = "";
      }
      for (const { segment } of segmenter.segment(word)) {
        if (line && context.measureText(line + segment).width > maxWidth) {
          lines.push(line);
          line = "";
        }
        line += segment;
      }
    }
    lines.push(line);
  }
  return lines;
}

export type TextSlot = { x: number; y: number; width: number; height: number };
export function drawFittedText(
  ctx: CanvasRenderingContext2D,
  value: string,
  slot: TextSlot,
  options: {
    size: number;
    minSize?: number;
    family: string;
    weight?: string;
    color?: string;
    leading?: number;
  },
) {
  if (!value.trim()) return;
  const leading = options.leading ?? 1.22;
  let size = options.size;
  let lines: string[] = [];
  for (; size >= (options.minSize ?? 9); size--) {
    ctx.font = `${options.weight ?? "400"} ${size}px ${options.family}`;
    lines = wrapText(ctx, value.replace(/\s+/gu, " ").trim(), slot.width);
    if (lines.length * size * leading <= slot.height) break;
  }
  if (size < (options.minSize ?? 9))
    throw new Error("O texto não cabe no template. Revise o campo.");
  ctx.fillStyle = options.color ?? "#ffffff";
  ctx.textBaseline = "top";
  lines.forEach((line, index) =>
    ctx.fillText(line, slot.x, slot.y + index * size * leading),
  );
}
