import type { Metadata } from "next";
import { Header, Footer } from "@/components/shell";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "ARMY PASS BRASIL · Nosso universo, nossas memórias",
    template: "%s | ARMY PASS BRASIL",
  },
  description:
    "Um portal independente feito por ARMYs, para ARMYs. Passaporte digital, jogos e memórias da comunidade brasileira.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
