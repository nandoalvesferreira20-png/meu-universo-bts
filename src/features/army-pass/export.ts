import { artworkDataUrl } from "./artwork";
import { canvasBlob, loadImage } from "./image-processing";
import { drawArmyPass, PASS_HEIGHT, PASS_WIDTH } from "./renderer";
import type { PassModel } from "./types";
import {
  eraThemes,
  btsLogo,
  arirangBtsLogo,
  isLocalEraPhoto,
  photosForEra,
} from "./themes";
import { prepareEraLogo } from "./era-logos";

export async function preparePassImage(model: PassModel) {
  // Keep the former personal source compatible for internal callers only.
  const portrait =
    model.personalPhoto ??
    (model.source === "personal" && model.imageUrl
      ? { url: model.imageUrl, crop: model.crop }
      : undefined);
  if (portrait && !portrait.url.startsWith("blob:"))
    throw new Error("Foto pessoal inválida. Escolha a imagem novamente.");
  if (
    model.source === "gallery" &&
    !photosForEra(model.era).some((photo) => photo.path === model.imageUrl)
  )
    throw new Error("Esta foto não pertence à galeria autorizada da era.");
  const url =
    model.source === "artwork"
      ? model.era === "wings" ||
        model.era === "map-of-the-soul" ||
        model.era === "persona" ||
        model.era === "arirang"
        ? "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E"
        : artworkDataUrl(model.era, 0)
      : model.imageUrl;
  if (!url)
    throw new Error(
      "Selecione uma foto ou use uma arte da era para continuar.",
    );
  // Apenas URLs locais, object URLs processadas e SVGs autorais. Sem CORS externo.
  if (model.source === "personal" && !url.startsWith("blob:"))
    throw new Error("Foto pessoal inválida. Escolha a imagem novamente.");
  if (model.source === "gallery" && !isLocalEraPhoto(url, model.era))
    throw new Error("Esta foto não pertence à galeria da era.");
  await document.fonts.ready;
  const [image, logo, personal, btsMark, texture] = await Promise.all([
    loadImage(url),
    prepareEraLogo(eraThemes[model.era].logo),
    portrait
      ? loadImage(portrait.url).then((image) => ({
          image,
          width: image.naturalWidth,
          height: image.naturalHeight,
        }))
      : undefined,
    model.era === "wings" ||
    model.era === "map-of-the-soul" ||
    model.era === "persona" ||
    model.era === "arirang"
      ? prepareEraLogo(model.era === "arirang" ? arirangBtsLogo : btsLogo)
      : undefined,
    model.era === "wings" ||
    model.era === "map-of-the-soul" ||
    model.era === "persona" ||
    model.era === "arirang"
      ? loadImage(
          model.era === "wings"
            ? "/images/army-pass/textures/wings-smoke.png"
            : model.era === "persona"
              ? "/images/army-pass/textures/persona-atmosphere.png"
              : model.era === "arirang"
                ? "/images/army-pass/textures/arirang-light-paper.png"
                : "/images/army-pass/textures/map-atmosphere.png",
        ).then((image) => ({
          image,
          width: image.naturalWidth,
          height: image.naturalHeight,
        }))
      : undefined,
  ]);
  return {
    image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    logo,
    personal,
    btsLogo: btsMark,
    texture,
  };
}

export async function exportArmyPass(model: PassModel): Promise<File> {
  const asset = await preparePassImage(model);
  const canvas = document.createElement("canvas");
  canvas.width = PASS_WIDTH;
  canvas.height = PASS_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context)
    throw new Error(
      "Seu navegador não disponibilizou a exportação. Tente em um navegador atualizado.",
    );
  drawArmyPass(context, model, asset);
  const blob = await canvasBlob(canvas);
  return new File([blob], `army-pass-${model.era}.png`, { type: "image/png" });
}

export function downloadPass(file: File) {
  const url = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = file.name;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  // Dar tempo ao navegador para iniciar a transferência antes da revogação.
  return window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function canSharePass(file: File) {
  try {
    return (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] })
    );
  } catch {
    return false;
  }
}
