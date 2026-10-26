import { z } from "zod";
import { adminMessageStatusSchema } from "@/features/mural/contracts";
import { muralAdminToken, requireMuralAdmin } from "@/lib/mural-admin";
import {
  callSupabase,
  muralJsonError,
  MuralServiceError,
  readJsonLimited,
  requireSameOrigin,
} from "@/lib/mural-server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    requireSameOrigin(request);
    await requireMuralAdmin(muralAdminToken(request));
    const { id } = await context.params;
    if (!z.string().uuid().safeParse(id).success)
      return Response.json(
        { error: "Identificador inválido." },
        { status: 400, headers: { "cache-control": "no-store" } },
      );
    const parsed = adminMessageStatusSchema.safeParse(
      await readJsonLimited(request),
    );
    if (!parsed.success)
      return Response.json(
        { error: "Status de moderação inválido." },
        { status: 400, headers: { "cache-control": "no-store" } },
      );
    const query = new URLSearchParams({
      id: `eq.${id}`,
      select:
        "id,nickname,city,state,message,status,reports_count,created_at,updated_at",
    });
    const response = await callSupabase(`/rest/v1/mural_messages?${query}`, {
      method: "PATCH",
      headers: { prefer: "return=representation" },
      body: JSON.stringify({ status: parsed.data.status }),
    });
    const result: unknown = await response.json();
    if (!Array.isArray(result) || !result.length)
      throw new MuralServiceError("A publicação não foi encontrada.", 404);
    return Response.json(
      { message: result[0] },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return muralJsonError(error);
  }
}
