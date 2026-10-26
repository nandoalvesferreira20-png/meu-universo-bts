"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container internal-page page-heading" role="alert">
      <span className="eyebrow">ALGO SAIU DO ESPERADO</span>
      <h1>Vamos tentar de novo?</h1>
      <p>Não foi possível carregar esta experiência.</p>
      <button className="button button-primary" onClick={() => reset()}>
        Tentar novamente
      </button>
    </div>
  );
}
