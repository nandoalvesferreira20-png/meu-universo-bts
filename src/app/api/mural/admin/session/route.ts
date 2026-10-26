import { cookies } from "next/headers";
import { adminLoginSchema } from "@/features/mural/contracts";
import {
  ADMIN_COOKIE,
  adminSessionCookieOptions,
  currentMuralAdmin,
  muralAdminToken,
} from "@/lib/mural-admin";
import {
  boundedInteger,
  callSupabase,
  callSupabaseAuth,
  isAdminMetadata,
  muralJsonError,
  MuralServiceError,
  readJsonLimited,
  requireSameOrigin,
  sourceFingerprint,
} from "@/lib/mural-server";

export async function GET(request: Request) {
  const token = muralAdminToken(request);
  try {
    const admin = await currentMuralAdmin(token);
    if (!admin)
      return Response.json(
        { error: "Faça login com uma conta de moderação autorizada." },
        { status: 401, headers: { "cache-control": "no-store" } },
      );
    return Response.json(
      { admin },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return muralJsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const parsed = adminLoginSchema.safeParse(await readJsonLimited(request));
    if (!parsed.success)
      return Response.json(
        { error: "Informe um e-mail e uma senha válidos." },
        { status: 400, headers: { "cache-control": "no-store" } },
      );
    const rateLimit = await callSupabase(
      "/rest/v1/rpc/consume_mural_rate_limit",
      {
        method: "POST",
        body: JSON.stringify({
          p_scope: "admin_login",
          p_source_fingerprint: sourceFingerprint(request),
          p_limit: boundedInteger(
            process.env.MURAL_ADMIN_LOGIN_LIMIT,
            5,
            1,
            20,
          ),
          p_window_seconds: boundedInteger(
            process.env.MURAL_ADMIN_LOGIN_WINDOW_SECONDS,
            900,
            60,
            86400,
          ),
        }),
      },
    );
    if (!((await rateLimit.json()) as boolean))
      return Response.json(
        {
          error:
            "Muitas tentativas de acesso. Aguarde antes de tentar novamente.",
        },
        {
          status: 429,
          headers: { "cache-control": "no-store", "retry-after": "900" },
        },
      );
    const auth = await callSupabaseAuth("token?grant_type=password", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    if (auth.status === 400 || auth.status === 401)
      return Response.json(
        { error: "Não foi possível autenticar esta conta." },
        { status: 401, headers: { "cache-control": "no-store" } },
      );
    if (!auth.ok)
      throw new MuralServiceError("A autenticação está indisponível.");
    const session: unknown = await auth.json().catch(() => null);
    if (!session || typeof session !== "object")
      throw new MuralServiceError("A autenticação está indisponível.");
    const record = session as {
      access_token?: unknown;
      expires_in?: unknown;
      user?: { id?: unknown; email?: unknown; app_metadata?: unknown };
    };
    if (
      typeof record.access_token !== "string" ||
      !record.user ||
      typeof record.user.id !== "string" ||
      !isAdminMetadata(record.user.app_metadata)
    )
      return Response.json(
        { error: "Esta conta não tem permissão para moderar o mural." },
        { status: 403, headers: { "cache-control": "no-store" } },
      );

    const maxAge =
      typeof record.expires_in === "number"
        ? Math.min(3600, Math.max(60, record.expires_in))
        : 3600;
    (await cookies()).set(ADMIN_COOKIE, record.access_token, {
      ...adminSessionCookieOptions(),
      maxAge,
    });
    return Response.json(
      {
        admin: {
          id: record.user.id,
          email: record.user.email ?? "",
        },
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return muralJsonError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    requireSameOrigin(request);
    (await cookies()).set(ADMIN_COOKIE, "", {
      ...adminSessionCookieOptions(),
      maxAge: 0,
    });
    return Response.json(
      { status: "signed_out" },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return muralJsonError(error);
  }
}
