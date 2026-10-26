import type { Metadata } from "next";
import { EmojiChallenge } from "@/features/emoji-challenge/emoji-challenge";
export const metadata: Metadata = {
  title: { absolute: "Adivinhe a Música pelos Emojis | Army Pass Brasil" },
  description:
    "Teste seus conhecimentos sobre as músicas do BTS em três níveis de dificuldade. Descubra as canções pelos emojis e compartilhe sua pontuação.",
};
export default function Page() {
  return <EmojiChallenge publicUrl={process.env.NEXT_PUBLIC_SITE_URL} />;
}
