import { z } from "zod";
import {
  biases,
  brazilianStates,
  experienceOptions,
} from "../features/army-pass/themes";

// Sem chamadas ao servidor: validação da personalização local.
export const armyPassSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Informe seu nome ou apelido.")
    .max(30, "Use no máximo 30 caracteres."),
  city: z.string().trim().max(60, "A cidade pode ter até 60 caracteres."),
  state: z.union([
    z.literal(""),
    z.enum(brazilianStates, {
      error: "Selecione um estado brasileiro válido.",
    }),
  ]),
  bias: z.enum(biases, { error: "Selecione um bias da lista." }),
  favoriteSong: z
    .string()
    .trim()
    .max(80, "A música pode ter até 80 caracteres."),
  armySince: z
    .string()
    .refine(
      (value) =>
        value === "" ||
        (/^\d{4}$/.test(value) &&
          Number(value) >= 2013 &&
          Number(value) <= new Date().getFullYear()),
      "Informe um ano entre 2013 e o ano atual, ou deixe em branco.",
    ),
  experience: z.enum(experienceOptions, {
    error: "Selecione uma experiência da lista.",
  }),
  message: z
    .string()
    .trim()
    .max(140, "A mensagem pode ter até 140 caracteres."),
});
export type ArmyPassInput = z.infer<typeof armyPassSchema>;
