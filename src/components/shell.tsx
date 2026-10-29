import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navigation, partnerUrl } from "@/data/portal";
import { NavigationLink } from "./navigation-link";
import { MobileNavigation } from "./mobile-navigation";
export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true">
        A✦
      </span>
      <span>
        ARMY PASS<small>BRASIL</small>
      </span>
    </span>
  );
}
export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" aria-label="Army Pass Brasil · início">
          <Brand />
        </Link>
        <nav className="desktop-navigation" aria-label="Navegação principal">
          {navigation.map((item) => (
            <NavigationLink key={item.href} href={item.href}>
              {item.label}
            </NavigationLink>
          ))}
        </nav>
        <a
          className="partner-header"
          href={partnerUrl}
          target="_blank"
          rel="noreferrer"
        >
          com @meuuniversobts <ArrowUpRight size={14} />
        </a>
        <MobileNavigation />
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/">
              <Brand />
            </Link>
            <p>
              Um universo de conexões.
              <br />
              Um lugar para chamar de nosso.
            </p>
          </div>
          <nav aria-label="Navegação do rodapé">
            {navigation.map((item) => (
              <NavigationLink key={item.href} href={item.href}>
                {item.label}
              </NavigationLink>
            ))}
            <NavigationLink href="/sobre">Sobre o projeto</NavigationLink>
          </nav>
          <a href={partnerUrl} target="_blank" rel="noreferrer">
            Feito em comunidade
            <br />
            @meuuniversobts ↗
          </a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ARMY PASS BRASIL</span>
          <p>
            Projeto independente de fãs. Sem vínculo oficial com BTS, HYBE ou
            BIGHIT MUSIC.
          </p>
          <span>Feito com carinho, no Brasil ♡</span>
        </div>
      </div>
    </footer>
  );
}
