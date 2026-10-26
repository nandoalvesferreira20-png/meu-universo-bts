import type { Crop, PersonalPhoto } from "./types";

export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
export const MAX_PHOTO_PIXELS = 40_000_000;
export function detectPhotoType(
  bytes: Uint8Array,
): "image/jpeg" | "image/png" | "image/webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return "image/jpeg";
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((value, i) => bytes[i] === value))
    return "image/png";
  if (
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  )
    return "image/webp";
  return null;
}

export function validatePhotoHeader(size: number, bytes: Uint8Array) {
  if (!size) throw new Error("Este arquivo está vazio. Escolha outra foto.");
  if (size > MAX_PHOTO_BYTES)
    throw new Error("Sua foto deve ter no máximo 10 MB.");
  const type = detectPhotoType(bytes);
  if (!type)
    throw new Error("Formato inválido. Escolha uma foto JPEG, PNG ou WebP.");
  return type;
}

export function cropRectangle(
  width: number,
  height: number,
  targetWidth: number,
  targetHeight: number,
  crop: Crop,
) {
  if (
    ![width, height, targetWidth, targetHeight].every(
      (value) => Number.isFinite(value) && value > 0,
    )
  )
    throw new Error("Dimensões de imagem inválidas.");
  const zoom = Math.min(
    3,
    Math.max(1, Number.isFinite(crop.zoom) ? crop.zoom : 1),
  );
  const cover = Math.max(targetWidth / width, targetHeight / height) * zoom;
  const sw = targetWidth / cover;
  const sh = targetHeight / cover;
  const clamp = (value: number) =>
    Math.min(100, Math.max(0, Number.isFinite(value) ? value : 50));
  return {
    sx: ((width - sw) * clamp(crop.x)) / 100,
    sy: ((height - sh) * clamp(crop.y)) / 100,
    sw,
    sh,
  };
}

export function containRectangle(
  width: number,
  height: number,
  targetWidth: number,
  targetHeight: number,
  crop: Crop,
) {
  if (
    ![width, height, targetWidth, targetHeight].every(
      (value) => Number.isFinite(value) && value > 0,
    )
  )
    throw new Error("Dimensões de imagem inválidas.");
  const zoom = Math.min(
    3,
    Math.max(1, Number.isFinite(crop.zoom) ? crop.zoom : 1),
  );
  const scale = Math.min(targetWidth / width, targetHeight / height) * zoom;
  const imageWidth = width * scale;
  const imageHeight = height * scale;
  const clamp = (value: number) =>
    Math.min(100, Math.max(0, Number.isFinite(value) ? value : 50));
  return {
    x: ((targetWidth - imageWidth) * clamp(crop.x)) / 100,
    y: ((targetHeight - imageHeight) * clamp(crop.y)) / 100,
    width: imageWidth,
    height: imageHeight,
  };
}

export function drawContainedPhoto(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  width: number,
  height: number,
  frame: { x: number; y: number; width: number; height: number },
  crop: Crop,
) {
  const bleed = 24;
  const backdrop = cropRectangle(
    width,
    height,
    frame.width + bleed * 2,
    frame.height + bleed * 2,
    { ...crop, zoom: 1 },
  );
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.save();
  ctx.filter = "blur(16px)";
  ctx.globalAlpha = 0.58;
  ctx.drawImage(
    image,
    backdrop.sx,
    backdrop.sy,
    backdrop.sw,
    backdrop.sh,
    frame.x - bleed,
    frame.y - bleed,
    frame.width + bleed * 2,
    frame.height + bleed * 2,
  );
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#171719";
  ctx.globalAlpha = 0.3;
  ctx.fillRect(frame.x, frame.y, frame.width, frame.height);
  ctx.restore();

  const contained = containRectangle(
    width,
    height,
    frame.width,
    frame.height,
    crop,
  );
  ctx.drawImage(
    image,
    frame.x + contained.x,
    frame.y + contained.y,
    contained.width,
    contained.height,
  );
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(
        new Error(
          "Não foi possível abrir a imagem. Remova ou substitua a foto.",
        ),
      );
    image.src = url;
  });
}

export function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(
              new Error("Não foi possível gerar a imagem. Tente novamente."),
            ),
      "image/png",
    ),
  );
}

// Decodifica a imagem de verdade e redesenha seus pixels: o arquivo original e
// seus metadados nunca são enviados, persistidos ou usados no PNG final.
export async function processPersonalPhoto(file: File): Promise<PersonalPhoto> {
  validatePhotoHeader(
    file.size,
    new Uint8Array(await file.slice(0, 16).arrayBuffer()),
  );
  let bitmap: ImageBitmap | null = null;
  let inputUrl: string | null = null;
  try {
    // from-image aplica EXIF; navegadores modernos também o aplicam no fallback img.
    let image: CanvasImageSource;
    let width: number;
    let height: number;
    if (typeof createImageBitmap === "function") {
      bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });
      image = bitmap;
      width = bitmap.width;
      height = bitmap.height;
    } else {
      inputUrl = URL.createObjectURL(file);
      const decoded = await loadImage(inputUrl);
      image = decoded;
      width = decoded.naturalWidth;
      height = decoded.naturalHeight;
    }
    if (!width || !height || width * height > MAX_PHOTO_PIXELS)
      throw new Error(
        "A foto é grande demais para processar com segurança. Escolha uma versão de até 40 megapixels.",
      );
    const scale = Math.min(1, 2400 / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error("Seu navegador não disponibilizou o editor de imagens.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await canvasBlob(canvas);
    return {
      url: URL.createObjectURL(blob),
      width: canvas.width,
      height: canvas.height,
    };
  } catch (error) {
    if (error instanceof Error && /megapixels|navegador/.test(error.message))
      throw error;
    throw new Error(
      "Não foi possível ler esta foto. O arquivo pode estar danificado; tente outro JPEG, PNG ou WebP.",
    );
  } finally {
    bitmap?.close();
    if (inputUrl) URL.revokeObjectURL(inputUrl);
  }
}
