import type { EraLogo } from "./types";
import { loadImage } from "./image-processing";

export function authorizedLogoPath(logo: EraLogo): string | null {
  if (
    logo.status !== "authorized" ||
    !logo.authorizationReference?.trim() ||
    !logo.usageConditions?.trim() ||
    !logo.credit.trim() ||
    !/^https:\/\//.test(logo.source)
  )
    return null;
  const path = logo.path;
  return path &&
    /^\/images\/army-pass\/logos\/[a-z0-9-]+\.(svg|png|jpe?g)$/i.test(path)
    ? path
    : null;
}

// Falha ou ausência não bloqueiam a criação: permanece a assinatura tipográfica.
// Uma fonte oficial é documentação de origem, não autorização automática.
export async function prepareEraLogo(logo: EraLogo, loader = loadImage) {
  const path = authorizedLogoPath(logo);
  if (!path) return undefined;
  try {
    const image = await loader(path);
    return image.naturalWidth && image.naturalHeight
      ? { image, width: image.naturalWidth, height: image.naturalHeight }
      : undefined;
  } catch {
    return undefined;
  }
}

export function containLogo(
  width: number,
  height: number,
  box: EraLogo["placement"],
) {
  const scale = Math.min(box.width / width, box.height / height);
  return {
    x: box.x + (box.width - width * scale) / 2,
    y: box.y + (box.height - height * scale) / 2,
    width: width * scale,
    height: height * scale,
  };
}
