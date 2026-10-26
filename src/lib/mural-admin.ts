import {
  isAdminMetadata,
  MuralServiceError,
  callSupabaseAuth,
} from "./mural-server";

export const ADMIN_COOKIE = "mural_admin_access";
const MAX_ADMIN_SESSION_SECONDS = 60 * 60;

export function muralAdminToken(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const cookie = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE}=`));
  const token = cookie?.slice(ADMIN_COOKIE.length + 1);
  return token && /^[A-Za-z0-9._~-]{1,8192}$/u.test(token) ? token : null;
}

export async function currentMuralAdmin(token: string | null) {
  if (!token) return null;
  let response: Response;
  try {
    response = await callSupabaseAuth("user", {}, token);
  } catch (error) {
    if (error instanceof MuralServiceError) return null;
    throw error;
  }
  if (!response.ok) return null;
  const user: unknown = await response.json().catch(() => null);
  if (!user || typeof user !== "object") return null;
  const record = user as {
    id?: unknown;
    email?: unknown;
    app_metadata?: unknown;
  };
  if (typeof record.id !== "string" || !isAdminMetadata(record.app_metadata))
    return null;
  return {
    id: record.id,
    email: typeof record.email === "string" ? record.email : "",
  };
}

export async function requireMuralAdmin(token: string | null) {
  const admin = await currentMuralAdmin(token);
  if (!admin)
    throw new MuralServiceError("Acesso administrativo não autorizado.", 401);
  return admin;
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: MAX_ADMIN_SESSION_SECONDS,
  };
}
