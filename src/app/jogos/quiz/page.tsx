import type { Metadata } from "next";
import { CategorySelection } from "@/features/bts-quiz/category-selection";
export const metadata: Metadata = {
  title: { absolute: "Quiz BTS e Integrantes | Army Pass Brasil" },
  description:
    "Quanto você conhece o BTS? Escolha OT7 ou um dos sete integrantes, responda dez perguntas e compartilhe sua pontuação.",
};
export default function Page() {
  return <CategorySelection />;
}
