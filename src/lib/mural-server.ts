import { createHmac } from "node:crypto";

export class MuralServiceError extends Error {
  constructor(
    message: string,
    readonly status = 503,
  ) {
    super(message);
    this.name = "MuralServiceError";
  }
}

const MAX_BODY_BYTES = 8192;

export function muralConfiguration() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/u, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey)
    throw new MuralServiceError(
      "O mural ainda está sendo configurado. Tente novamente mais tarde.",
    );
  return { url, serviceKey };
}

function authenticationConfiguration() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/u, "");
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey)
    throw new MuralServiceError(
      "O acesso administrativo ainda não está configurado.",
    );
  return { url, anonKey };
}

function requiredSecret(name: string) {
  const secret = process.env[name];
  if (!secret)
    throw new MuralServiceError(
      "O mural ainda está sendo configurado. Tente novamente mais tarde.",
    );
  return secret;
}

export async function readJsonLimited(request: Request): Promise<unknown> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES)
    throw new MuralServiceError(
      "A requisição excede o tamanho permitido.",
      413,
    );
  if (!request.body)
    throw new MuralServiceError("Não foi possível ler os dados enviados.", 400);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new MuralServiceError(
          "A requisição excede o tamanho permitido.",
          413,
        );
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  let decoded: string;
  try {
    decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new MuralServiceError("Os dados enviados não são válidos.", 400);
  }
  try {
    return JSON.parse(decoded) as unknown;
  } catch {
    throw new MuralServiceError("Envie os dados em formato JSON válido.", 400);
  }
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const configuredOrigin =
    process.env.MURAL_PUBLIC_ORIGIN ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NODE_ENV === "production" && !configuredOrigin) return false;
  const expected = configuredOrigin ?? new URL(request.url).origin;
  try {
    return new URL(origin).origin === new URL(expected).origin;
  } catch {
    return false;
  }
}

export function requireSameOrigin(request: Request) {
  if (!sameOrigin(request))
    throw new MuralServiceError(
      "Não foi possível validar a origem da solicitação.",
      403,
    );
}

function keyedHash(secret: string, purpose: string, value: string) {
  return createHmac("sha256", secret)
    .update(purpose)
    .update("\0")
    .update(value)
    .digest("hex");
}

export function sourceFingerprint(request: Request) {
  const secret = requiredSecret("MURAL_RATE_LIMIT_SECRET");
  const header = process.env.MURAL_CLIENT_IP_HEADER ?? "cf-connecting-ip";
  if (!/^[a-z0-9-]{1,64}$/iu.test(header))
    throw new MuralServiceError("A configuração do mural é inválida.");
  const address = request.headers.get(header);
  if (!address || address.length > 128)
    throw new MuralServiceError(
      "Não foi possível validar esta solicitação. Tente novamente.",
      503,
    );
  return keyedHash(secret, "mural-source-v1", address.trim());
}

export function contentFingerprint(content: string) {
  const secret = requiredSecret("MURAL_RATE_LIMIT_SECRET");
  return keyedHash(secret, "mural-content-v1", content);
}

export async function callSupabase(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const { url, serviceKey } = muralConfiguration();
  let response: Response;
  try {
    response = await fetch(`${url}${path}`, {
      ...init,
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        "content-type": "application/json",
        ...init.headers,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    console.error("Mural database request failed", error);
    throw new MuralServiceError(
      "O mural está temporariamente indisponível. Tente novamente.",
    );
  }
  if (!response.ok) {
    const details = await response.text().catch(() => "");
    console.error("Mural database returned an error", {
      status: response.status,
      details: details.slice(0, 500),
    });
    throw new MuralServiceError(
      "O mural está temporariamente indisponível. Tente novamente.",
    );
  }
  return response;
}

export async function callSupabaseAuth(
  path: string,
  init: RequestInit = {},
  accessToken?: string,
): Promise<Response> {
  const { url, anonKey } = authenticationConfiguration();
  let response: Response;
  try {
    response = await fetch(`${url}/auth/v1/${path}`, {
      ...init,
      headers: {
        apikey: anonKey,
        "content-type": "application/json",
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
        ...init.headers,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    console.error("Mural authentication request failed", error);
    throw new MuralServiceError(
      "A autenticação está temporariamente indisponível.",
    );
  }
  return response;
}

export async function verifyTurnstile(
  token: string,
  action: "mural_publish" | "mural_report",
  request: Request,
) {
  const turnstileSecret = requiredSecret("TURNSTILE_SECRET_KEY");
  const form = new URLSearchParams({
    secret: turnstileSecret,
    response: token,
  });
  let response: Response;
  try {
    response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: form,
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      },
    );
  } catch (error) {
    console.error("Turnstile verification request failed", error);
    throw new MuralServiceError(
      "A verificação de segurança está indisponível. Tente novamente.",
    );
  }
  if (!response.ok)
    throw new MuralServiceError(
      "A verificação de segurança está indisponível. Tente novamente.",
    );
  const result: unknown = await response.json().catch(() => null);
  if (!result || typeof result !== "object")
    throw new MuralServiceError(
      "A verificação de segurança está indisponível. Tente novamente.",
    );
  const verification = result as {
    success?: boolean;
    action?: string;
    hostname?: string;
  };
  const expectedHostname = new URL(request.headers.get("origin")!).hostname;
  if (
    verification.success !== true ||
    verification.action !== action ||
    verification.hostname !== expectedHostname
  )
    throw new MuralServiceError(
      "A verificação de segurança expirou ou não foi concluída. Tente novamente.",
      400,
    );
}

export function muralJsonError(error: unknown) {
  if (error instanceof MuralServiceError)
    return Response.json(
      { error: error.message },
      {
        status: error.status,
        headers: { "cache-control": "no-store" },
      },
    );
  console.error("Unexpected mural request error", error);
  return Response.json(
    { error: "O mural está temporariamente indisponível. Tente novamente." },
    { status: 503, headers: { "cache-control": "no-store" } },
  );
}

export function boundedInteger(
  value: string | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : fallback;
}

export function isAdminMetadata(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return false;
  const values = metadata as Record<string, unknown>;
  return values.mural_admin === true || values.role === "mural_admin";
}
