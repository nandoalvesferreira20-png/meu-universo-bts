import { z } from "zod";
import { adminReportStatusSchema } from "@/features/mural/contracts";
import { muralAdminToken, requireMuralAdmin } from "@/lib/mural-admin";
import {
  callSupabase,
  muralJsonError,
  MuralServiceError,
  readJsonLimited,
  requireSameOrigin,
} from "@/lib/mural-server";

export async function GET(request: Request) {
  const token = muralAdminToken(request);
  try {
    await requireMuralAdmin(token);
    const query = new URLSearchParams({
      select:
        "id,message_id,reason,details,status,created_at,message:mural_messages(nickname,message,status)",
      order: "created_at.desc,id.desc",
      limit: "100",
    });
    const response = await callSupabase(`/rest/v1/mural_reports?${query}`);
    return Response.json(
      { reports: await response.json() },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return muralJsonError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    requireSameOrigin(request);
    await requireMuralAdmin(muralAdminToken(request));
    const parsed = z
      .object({
        reportId: z.string().uuid(),
        status: adminReportStatusSchema.shape.status,
      })
      .strict()
      .safeParse(await readJsonLimited(request));
    if (!parsed.success)
      return Response.json(
        { error: "Atualização de denúncia inválida." },
        { status: 400, headers: { "cache-control": "no-store" } },
      );
    const query = new URLSearchParams({
      id: `eq.${parsed.data.reportId}`,
      select: "id,message_id,reason,details,status,created_at",
    });
    const response = await callSupabase(`/rest/v1/mural_reports?${query}`, {
      method: "PATCH",
      headers: { prefer: "return=representation" },
      body: JSON.stringify({ status: parsed.data.status }),
    });
    const result: unknown = await response.json();
    if (!Array.isArray(result) || !result.length)
      throw new MuralServiceError("A denúncia não foi encontrada.", 404);
    return Response.json(
      { report: result[0] },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return muralJsonError(error);
  }
}
