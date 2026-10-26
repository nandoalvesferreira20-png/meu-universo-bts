import { z } from "zod";

export const brazilianStates = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

const text = (maximum: number) =>
  z
    .string()
    .max(maximum)
    .transform((value) => normalizeText(value));

export function normalizeText(value: string) {
  return value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+/gu, " ")
    .replace(/ *\n */gu, "\n")
    .trim();
}

export const publishMessageSchema = z
  .object({
    nickname: text(200).pipe(z.string().min(2).max(40)),
    city: text(320).pipe(z.string().max(80)).nullable().optional(),
    state: z.enum(brazilianStates).nullable().optional(),
    message: text(2000).pipe(z.string().min(10).max(500)),
    turnstileToken: z.string().min(1).max(2048),
  })
  .strict()
  .superRefine((data, context) => {
    if (containsMarkup(data.nickname) || containsMarkup(data.city ?? "")) {
      context.addIssue({
        code: "custom",
        path: ["nickname"],
        message: "Use apenas texto simples nos campos.",
      });
    }
    if (containsMarkup(data.message)) {
      context.addIssue({
        code: "custom",
        path: ["message"],
        message: "A mensagem deve conter apenas texto, sem HTML.",
      });
    }
  });

export const reportReasons = [
  "spam",
  "harassment",
  "inappropriate",
  "personal_information",
  "other",
] as const;

export const createReportSchema = z
  .object({
    messageId: z.string().uuid(),
    reason: z.enum(reportReasons),
    details: text(600).pipe(z.string().max(300)).nullable().optional(),
    turnstileToken: z.string().min(1).max(2048),
  })
  .strict()
  .superRefine((data, context) => {
    if (containsMarkup(data.details ?? "")) {
      context.addIssue({
        code: "custom",
        path: ["details"],
        message: "Use apenas texto simples.",
      });
    }
  });

export const adminLoginSchema = z
  .object({
    email: z.string().trim().email().max(254),
    password: z.string().min(1).max(1024),
  })
  .strict();

export const adminMessageStatusSchema = z
  .object({ status: z.enum(["published", "hidden", "removed"]) })
  .strict();

export const adminReportStatusSchema = z
  .object({ status: z.enum(["reviewed", "dismissed"]) })
  .strict();

export function containsMarkup(value: string) {
  return /<\/?[a-z][^>]*>/iu.test(value);
}

const urlPattern =
  /(?:https?:\/\/|www\.|(?:^|\s)[\w-]+\.(?:com|net|org|io|gg|ru|br|co|me|info|xyz|top)(?:\/|\b))/iu;
const abuseTerms = [
  /\b(?:te\s+odeio|vou\s+te\s+machucar|morte\s+para)\b/iu,
  /\b(?:kill\s+yourself|i\s+will\s+hurt\s+you|go\s+die)\b/iu,
];

export type MessageAssessment =
  | { type: "safe" }
  | { type: "reject"; reason: "links" | "markup" }
  | { type: "review"; reason: "abusive" | "spam" };

export function assessMessage(
  nickname: string,
  message: string,
): MessageAssessment {
  if (containsMarkup(nickname) || containsMarkup(message))
    return { type: "reject", reason: "markup" };
  if (urlPattern.test(message)) return { type: "reject", reason: "links" };
  if (
    abuseTerms.some((pattern) => pattern.test(message)) ||
    abuseTerms.some((pattern) => pattern.test(nickname))
  )
    return { type: "review", reason: "abusive" };
  if (
    /(.)\1{11,}/u.test(message) ||
    /(\b[\p{L}\p{N}]{2,}\b)(?:\s+\1){2,}/iu.test(message)
  )
    return { type: "review", reason: "spam" };
  return { type: "safe" };
}

export type PublicMessage = {
  id: string;
  nickname: string;
  city: string | null;
  state: string | null;
  message: string;
  created_at: string;
};

export type AdminMessage = PublicMessage & {
  status: "published" | "hidden" | "removed";
  reports_count: number;
};
