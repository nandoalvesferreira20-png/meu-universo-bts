import { z } from "zod";
import { muralAdminToken, requireMuralAdmin } from "@/lib/mural-admin";
import { callSupabase, muralJsonError } from "@/lib/mural-server";

const statuses = ["published", "hidden", "removed"] as const;

export async function GET(request: Request) {
  const token = muralAdminToken(request);
  try {
    await requireMuralAdmin(token);
    const requested = new URL(request.url).searchParams.get("status");
    const parsedStatus = requested
      ? z.enum(statuses).safeParse(requested)
      : null;
    if (parsedStatus && !parsedStatus.success)
      return Response.json(
        { error: "Filtro de status inválido." },
        { status: 400, headers: { "cache-control": "no-store" } },
      );
    const query = new URLSearchParams({
      select:
        "id,nickname,city,state,message,status,reports_count,created_at,updated_at",
      order: "created_at.desc,id.desc",
      limit: "100",
    });
    if (parsedStatus?.success) query.set("status", `eq.${parsedStatus.data}`);
    const response = await callSupabase(`/rest/v1/mural_messages?${query}`);
    return Response.json(
      { messages: await response.json() },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return muralJsonError(error);
  }
}
