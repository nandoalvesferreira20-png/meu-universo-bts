import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getQuizCategory,
  quizCategories,
} from "@/features/bts-quiz/categories";
import { QuizGame } from "@/features/bts-quiz/quiz-game";
type Props = { params: Promise<{ categoria: string }> };
export function generateStaticParams() {
  return quizCategories.map((category) => ({ categoria: category.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const category = getQuizCategory(categoria);
  if (!category) return { title: "Quiz não encontrado" };
  return {
    title: { absolute: `Quiz de ${category.title} | Army Pass Brasil` },
    description: `Teste seus conhecimentos sobre ${category.title} em dez perguntas sobre música, carreira e história.`,
  };
}
export default async function Page({ params }: Props) {
  const { categoria } = await params;
  const category = getQuizCategory(categoria);
  if (!category) notFound();
  return (
    <QuizGame
      key={category.id}
      category={category}
      publicUrl={process.env.NEXT_PUBLIC_SITE_URL}
    />
  );
}
