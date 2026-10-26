import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container internal-page page-heading">
      <span className="eyebrow">404</span>
      <h1>Esse destino ainda não existe.</h1>
      <p>Volte ao nosso universo e escolha uma experiência.</p>
      <Link className="button button-primary" href="/">
        Voltar ao início
      </Link>
    </div>
  );
}
