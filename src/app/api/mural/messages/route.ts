import { z } from "zod";
import {
  assessMessage,
  publishMessageSchema,
  normalizeText,
} from "@/features/mural/contracts";
import {
  boundedInteger,
  callSupabase,
  contentFingerprint,
  muralJsonError,
  readJsonLimited,
  requireSameOrigin,
  sourceFingerprint,
  verifyTurnstile,
} from "@/lib/mural-server";

const PAGE_SIZE = 12;
const pageSchema = z.coerce.number().int().min(1).max(500).default(1);

export async function GET(request: Request) {
  try {
    const pageResult = pageSchema.safeParse(
      new URL(request.url).searchParams.get("page") ?? 1,
    );
    if (!pageResult.success)
      return Response.json(
        { error: "Número de página inválido." },
        { status: 400, headers: { "cache-control": "no-store" } },
      );
    const page = pageResult.data;
    const offset = (page - 1) * PAGE_SIZE;
    const query = new URLSearchParams({
      select: "id,nickname,city,state,message,created_at",
      status: "eq.published",
      order: "created_at.desc,id.desc",
      limit: String(PAGE_SIZE),
      offset: String(offset),
    });
    const response = await callSupabase(`/rest/v1/mural_messages?${query}`, {
      headers: { prefer: "count=exact" },
    });
    const messages: unknown = await response.json();
    const total = Number(
      response.headers.get("content-range")?.split("/")[1] ?? 0,
    );
    return Response.json(
      {
        messages,
        page,
        pageSize: PAGE_SIZE,
        total: Number.isFinite(total) ? total : 0,
        hasMore: offset + PAGE_SIZE < total,
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return muralJsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const parsed = publishMessageSchema.safeParse(
      await readJsonLimited(request),
    );
    if (!parsed.success)
      return Response.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Confira os campos e tente novamente.",
        },
        { status: 400, headers: { "cache-control": "no-store" } },
      );

    const input = parsed.data;
    const assessment = assessMessage(input.nickname, input.message);
    if (assessment.type === "reject")
      return Response.json(
        {
          error:
            assessment.reason === "links"
              ? "Links não são permitidos no mural."
              : "Envie apenas texto simples, sem marcação HTML.",
        },
        { status: 422, headers: { "cache-control": "no-store" } },
      );

    await verifyTurnstile(input.turnstileToken, "mural_publish", request);
    const source = sourceFingerprint(request);
    const fingerprint = contentFingerprint(
      input.message.toLocaleLowerCase("pt-BR"),
    );
    const city = input.city ? normalizeText(input.city) : null;
    const response = await callSupabase(`/rest/v1/rpc/publish_mural_message`, {
      method: "POST",
      body: JSON.stringify({
        p_nickname: input.nickname,
        p_city: city,
        p_state: input.state ?? null,
        p_message: input.message,
        p_content_fingerprint: fingerprint,
        p_source_fingerprint: source,
        p_flagged: assessment.type === "review",
        p_rate_limit: boundedInteger(process.env.MURAL_PUBLISH_LIMIT, 3, 1, 20),
        p_rate_window_seconds: boundedInteger(
          process.env.MURAL_PUBLISH_WINDOW_SECONDS,
          600,
          60,
          86400,
        ),
      }),
    });
    const result = (await response.json()) as {
      ok?: boolean;
      code?: string;
      message?: {
        id: string;
        nickname: string;
        city: string | null;
        state: string | null;
        message: string;
        status: "published" | "hidden";
        created_at: string;
      };
    };
    if (result.code === "rate_limited")
      return Response.json(
        { error: "Você enviou mensagens recentemente. Aguarde um pouco." },
        {
          status: 429,
          headers: { "cache-control": "no-store", "retry-after": "600" },
        },
      );
    if (result.code === "duplicate")
      return Response.json(
        { error: "Esta mensagem já foi enviada recentemente." },
        { status: 409, headers: { "cache-control": "no-store" } },
      );
    if (!result.ok || !result.message)
      return Response.json(
        { error: "Não foi possível publicar sua mensagem." },
        { status: 503, headers: { "cache-control": "no-store" } },
      );

    if (result.message.status === "hidden")
      return Response.json(
        {
          status: "under_review",
          message:
            "Recebemos sua mensagem. Ela ficará oculta enquanto nossa equipe verifica o conteúdo.",
        },
        { status: 202, headers: { "cache-control": "no-store" } },
      );
    return Response.json(
      { status: "published", message: result.message },
      { status: 201, headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return muralJsonError(error);
  }
}
