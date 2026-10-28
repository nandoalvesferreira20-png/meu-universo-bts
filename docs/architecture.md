# Arquitetura e integração futura

> Atualização: a [Fase 2.2](army-pass-phase-2.2.md) substitui a seleção das 12 artes por um template por era, WINGS aprovado e duas fotografias independentes. As descrições anteriores abaixo registram a evolução do projeto e são superadas por esse guia no gerador atual.

## Base da Fase 1 e evolução na Fase 2

As páginas são predominantemente Server Components estáticos. O menu mobile e o gerador de Army Pass usam estado no cliente; os dados e imagens do passaporte permanecem locais. As categorias de quiz usam parâmetros assíncronos do App Router e geração estática; categorias desconhecidas usam `notFound()`.

Tokens de identidade ficam em `src/app/globals.css`, expostos também pelo tema Tailwind. Fotografias autorizadas ficam em `public/images`.

## Army Pass: implementado na Fase 2

`src/features/army-pass` contém um editor no cliente, reducer para quatro etapas, contrato Zod atualizado e renderizador Canvas único para prévia e PNG. Quatro layouts distintos compartilham primitivas de texto e recorte; 12 artes SVG autorais estão disponíveis sem depender de fotos. O manifesto de fotografias autorizadas está vazio.

Na Fase 2.1, os layouts e a interface foram redesenhados sem trocar essa arquitetura. `era-logos.ts` habilita somente assets locais autorizados configurados em `eraThemes`; sua imagem é preparada tanto para a prévia quanto para a exportação. Logos oficiais estão pendentes, com fallback tipográfico. A ampliação da prévia usa diálogo nativo e o mesmo renderizador. Detalhes em `docs/army-pass-phase-2.1.md`.

Fotos pessoais são validadas, decodificadas, orientadas e redesenhadas localmente. `PhotoSession` mantém somente a foto processada durante a sessão, descarta URLs e invalida processamento atrasado. Não há requisições de envio, analytics ou armazenamento permanente. O compartilhamento usa arquivo já gerado e depende de suporte da Web Share API, com download disponível. Guia completo em `docs/army-pass-phase-2.md` e limites dos testes em `docs/validation-phase-2.md`.

## Conteúdo estático

Manter perguntas, respostas e eventos históricos em arquivos tipados em `src/data`, com identificadores estáveis e fontes revisadas. A estrutura da história nesta entrega não afirma marcos da era ARIRANG; o conteúdo será publicado após curadoria.
