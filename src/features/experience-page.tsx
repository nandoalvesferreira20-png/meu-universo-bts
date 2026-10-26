import Link from "next/link";
export function ExperiencePage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container internal-page">
      <Link href="/" className="breadcrumb">
        Início / {eyebrow}
      </Link>
      <header className="page-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </div>
  );
}
