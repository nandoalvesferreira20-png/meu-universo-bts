import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  assessMessage,
  createReportSchema,
  publishMessageSchema,
} from "../src/features/mural/contracts";
import { isAdminMetadata } from "../src/lib/mural-server";
import {
  GET as getMessages,
  POST as publishMessage,
} from "../src/app/api/mural/messages/route";
import { POST as createReport } from "../src/app/api/mural/reports/route";

const validMessage = {
  nickname: "  Purple   Star ",
  city: " São   Paulo ",
  state: "SP",
  message: "  Obrigada por toda a música e carinho!  ",
  turnstileToken: "valid-turnstile-token",
};

function request(
  path: string,
  body: unknown,
  headers: Record<string, string> = {},
) {
  return new Request(`http://localhost:3000${path}`, {
    method: "POST",
    headers: {
      origin: "http://localhost:3000",
      "content-type": "application/json",
      "cf-connecting-ip": "192.0.2.12",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function response(body: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(body), { status, headers });
}

function withMuralEnvironment<T>(run: () => Promise<T>) {
  const names = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "MURAL_RATE_LIMIT_SECRET",
    "TURNSTILE_SECRET_KEY",
    "MURAL_PUBLIC_ORIGIN",
  ] as const;
  const previous = new Map(names.map((name) => [name, process.env[name]]));
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, {
    SUPABASE_URL: "https://database.example.test",
    SUPABASE_SERVICE_ROLE_KEY: "test-service-role",
    MURAL_RATE_LIMIT_SECRET: "test-only-secret-for-mural",
    TURNSTILE_SECRET_KEY: "test-turnstile-secret",
    MURAL_PUBLIC_ORIGIN: "http://localhost:3000",
  });
  return run().finally(() => {
    globalThis.fetch = originalFetch;
    for (const name of names) {
      const value = previous.get(name);
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });
}

function validTurnstile() {
  return response({
    success: true,
    action: "mural_publish",
    hostname: "localhost",
  });
}

test("validação normaliza campos e aplica limites/formato de localização", () => {
  const parsed = publishMessageSchema.safeParse(validMessage);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.nickname, "Purple Star");
    assert.equal(parsed.data.city, "São Paulo");
    assert.equal(
      publishMessageSchema.safeParse({
        ...validMessage,
        message: "Curta",
      }).success,
      false,
    );
    assert.equal(
      publishMessageSchema.safeParse({
        ...validMessage,
        state: "XX",
      }).success,
      false,
    );
  }
});

test("filtro bloqueia HTML/links, encaminha abuso evidente para revisão e não bloqueia texto comum", () => {
  assert.deepEqual(
    assessMessage("ARMY", "Uma mensagem com <script>alert(1)</script>"),
    { type: "reject", reason: "markup" },
  );
  assert.deepEqual(assessMessage("ARMY", "Visite https://spam.example"), {
    type: "reject",
    reason: "links",
  });
  assert.deepEqual(assessMessage("ARMY", "Please kill yourself"), {
    type: "review",
    reason: "abusive",
  });
  assert.deepEqual(
    assessMessage("Luna", "Obrigada por compartilhar tanta alegria!"),
    { type: "safe" },
  );
});

test("POST publica automaticamente somente após validar Turnstile e usa fingerprint, não IP bruto", async () =>
  withMuralEnvironment(async () => {
    const calls: { url: string; body?: unknown }[] = [];
    globalThis.fetch = async (input, init) => {
      const url = String(input);
      if (url.includes("siteverify")) {
        calls.push({ url });
        return validTurnstile();
      }
      calls.push({
        url,
        body: init?.body ? JSON.parse(String(init.body)) : undefined,
      });
      return response({
        ok: true,
        message: {
          id: "c6f05e23-16ec-4f9e-82d4-d88e74142327",
          nickname: "Purple Star",
          city: "São Paulo",
          state: "SP",
          message: "Obrigada por toda a música e carinho!",
          status: "published",
          created_at: "2026-10-26T02:00:00Z",
        },
      });
    };
    const result = await publishMessage(
      request("/api/mural/messages", validMessage),
    );
    assert.equal(result.status, 201);
    const rpc = calls.find((call) =>
      call.url.includes("publish_mural_message"),
    );
    assert.ok(rpc);
    assert.equal(
      (rpc.body as Record<string, unknown>).p_nickname,
      "Purple Star",
    );
    assert.equal((rpc.body as Record<string, unknown>).p_city, "São Paulo");
    assert.equal((rpc.body as Record<string, unknown>).p_state, "SP");
    assert.match(
      String((rpc.body as Record<string, unknown>).p_source_fingerprint),
      /^[a-f0-9]{64}$/u,
    );
    assert.notEqual(
      (rpc.body as Record<string, unknown>).p_source_fingerprint,
      "192.0.2.12",
    );
    assert.equal(
      calls.find((call) => call.url.includes("siteverify"))?.url,
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
  }));

test("POST rejeita dados inválidos e conteúdo com links antes de persistir", async () =>
  withMuralEnvironment(async () => {
    let fetches = 0;
    globalThis.fetch = async () => {
      fetches++;
      return validTurnstile();
    };
    const invalid = await publishMessage(
      request("/api/mural/messages", { ...validMessage, message: "curta" }),
    );
    assert.equal(invalid.status, 400);
    const link = await publishMessage(
      request("/api/mural/messages", {
        ...validMessage,
        message: "Visite https://example.com para saber mais",
      }),
    );
    assert.equal(link.status, 422);
    assert.equal(fetches, 0);
  }));

test("POST falha fechado quando Turnstile falha ou token não foi enviado", async () =>
  withMuralEnvironment(async () => {
    globalThis.fetch = async () =>
      response({ success: false, "error-codes": ["timeout-or-duplicate"] });
    const rejected = await publishMessage(
      request("/api/mural/messages", validMessage),
    );
    assert.equal(rejected.status, 400);
    const missing = await publishMessage(
      request("/api/mural/messages", {
        ...validMessage,
        turnstileToken: "",
      }),
    );
    assert.equal(missing.status, 400);
  }));

test("POST encaminha conteúdo suspeito para revisão e não o publica automaticamente", async () =>
  withMuralEnvironment(async () => {
    let flagged: unknown;
    globalThis.fetch = async (input, init) => {
      if (String(input).includes("siteverify")) return validTurnstile();
      flagged = (JSON.parse(String(init?.body)) as Record<string, unknown>)
        .p_flagged;
      return response({
        ok: true,
        message: {
          id: "c6f05e23-16ec-4f9e-82d4-d88e74142327",
          status: "hidden",
        },
      });
    };
    const result = await publishMessage(
      request("/api/mural/messages", {
        ...validMessage,
        message: "I will hurt you and find you.",
      }),
    );
    assert.equal(result.status, 202);
    assert.equal(flagged, true);
    assert.match(await result.text(), /under_review/u);
  }));

test("GET lista apenas campos publicados e pagina com ordenação estável", async () => {
  const originalFetch = globalThis.fetch;
  process.env.SUPABASE_URL = "https://database.example.test";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role";
  let requested = "";
  globalThis.fetch = async (input) => {
    requested = String(input);
    return response([], 200, { "content-range": "12-23/24" });
  };
  try {
    const result = await getMessages(
      new Request("http://localhost:3000/api/mural/messages?page=2"),
    );
    assert.equal(result.status, 200);
    const url = new URL(requested);
    assert.equal(url.searchParams.get("status"), "eq.published");
    assert.equal(
      url.searchParams.get("select"),
      "id,nickname,city,state,message,created_at",
    );
    assert.equal(url.searchParams.get("order"), "created_at.desc,id.desc");
    assert.equal(url.searchParams.get("limit"), "12");
    assert.equal(url.searchParams.get("offset"), "12");
    assert.equal((await result.json()).hasMore, false);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});

test("denúncia valida enum, UUID e texto, e resposta duplicada é protegida", async () =>
  withMuralEnvironment(async () => {
    assert.equal(
      createReportSchema.safeParse({
        messageId: "c6f05e23-16ec-4f9e-82d4-d88e74142327",
        reason: "spam",
        details: "Isso parece ser propaganda",
        turnstileToken: "valid",
      }).success,
      true,
    );
    assert.equal(
      createReportSchema.safeParse({
        messageId: "not-a-uuid",
        reason: "unknown",
        turnstileToken: "",
      }).success,
      false,
    );
    globalThis.fetch = async (input) =>
      String(input).includes("siteverify")
        ? response({
            success: true,
            action: "mural_report",
            hostname: "localhost",
          })
        : response({ ok: false, code: "duplicate" });
    const result = await createReport(
      request("/api/mural/reports", {
        messageId: "c6f05e23-16ec-4f9e-82d4-d88e74142327",
        reason: "spam",
        turnstileToken: "valid",
      }),
    );
    assert.equal(result.status, 409);
  }));

test("só app_metadata concede papel administrativo e migration protege tabelas privadas", async () => {
  assert.equal(isAdminMetadata({ role: "mural_admin" }), true);
  assert.equal(isAdminMetadata({ mural_admin: true }), true);
  assert.equal(isAdminMetadata(null), false);
  const sql = await readFile(
    "supabase/migrations/202610260001_mural.sql",
    "utf8",
  );
  for (const table of ["mural_messages", "mural_reports", "mural_rate_limits"])
    assert.match(
      sql,
      new RegExp(
        `alter table public\\.${table} enable row level security`,
        "u",
      ),
    );
  assert.match(
    sql,
    /revoke all on public\.mural_reports from public, anon, authenticated/u,
  );
  assert.match(sql, /grant execute on function public\.publish_mural_message/u);
  assert.match(sql, /pg_advisory_xact_lock/u);
  assert.match(sql, /p_window_seconds > 604800/u);
  assert.match(sql, /interval '8 days'/u);
});
