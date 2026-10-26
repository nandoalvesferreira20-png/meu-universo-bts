import { createReportSchema } from "@/features/mural/contracts";
import {
  boundedInteger,
  callSupabase,
  muralJsonError,
  readJsonLimited,
  requireSameOrigin,
  sourceFingerprint,
  verifyTurnstile,
} from "@/lib/mural-server";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const parsed = createReportSchema.safeParse(await readJsonLimited(request));
    if (!parsed.success)
      return Response.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Confira a denúncia e tente novamente.",
        },
        { status: 400, headers: { "cache-control": "no-store" } },
      );

    const input = parsed.data;
    await verifyTurnstile(input.turnstileToken, "mural_report", request);
    const body = {
      p_message_id: input.messageId,
      p_reason: input.reason,
      p_details: input.details || null,
      p_source_fingerprint: sourceFingerprint(request),
      p_auto_hide_threshold: boundedInteger(
        process.env.MURAL_AUTO_HIDE_THRESHOLD,
        8,
        5,
        20,
      ),
      p_rate_limit: boundedInteger(process.env.MURAL_REPORT_LIMIT, 5, 1, 50),
      p_rate_window_seconds: boundedInteger(
        process.env.MURAL_REPORT_WINDOW_SECONDS,
        86400,
        60,
        604800,
      ),
    };
    const response = await callSupabase("/rest/v1/rpc/submit_mural_report", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as {
      ok?: boolean;
      code?: string;
      auto_hidden?: boolean;
    };
    if (result.code === "duplicate")
      return Response.json(
        { error: "Você já denunciou esta mensagem recentemente." },
        { status: 409, headers: { "cache-control": "no-store" } },
      );
    if (result.code === "rate_limited")
      return Response.json(
        { error: "Você enviou denúncias recentemente. Tente mais tarde." },
        {
          status: 429,
          headers: { "cache-control": "no-store", "retry-after": "86400" },
        },
      );
    if (result.code === "not_found")
      return Response.json(
        { error: "Esta mensagem não está mais disponível para denúncia." },
        { status: 404, headers: { "cache-control": "no-store" } },
      );
    if (!result.ok)
      return Response.json(
        { error: "Não foi possível registrar a denúncia." },
        { status: 503, headers: { "cache-control": "no-store" } },
      );
    return Response.json(
      {
        status: "received",
        message: "Obrigada por ajudar a cuidar do mural.",
      },
      { status: 201, headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return muralJsonError(error);
  }
}
