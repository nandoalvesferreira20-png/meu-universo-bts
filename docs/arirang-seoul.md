# ARIRANG TOUR — capítulo especial de Seul

Escopo: somente BTS THE COMEBACK LIVE | ARIRANG, Praça Gwanghwamun,
Seul, Coreia do Sul, 21 de março de 2026. Sem timeline de turnê ou seção Brasil.

## Fontes e imagens

Contexto confirmado em https://www.netflix.com/tudum/bts-the-comeback-live-arirang
e https://www.netflix.com/tudum/features/bts-comeback-live-arirang-recap-highlights.

As quatro imagens foram baixadas da cobertura oficial Netflix Tudum em
26/10/2026. Os endereços individuais, dimensões, créditos e alterações estão em
`public/images/arirang-tour/seoul-netflix/sources.json`.

1. `seoul-netflix-01.webp`: os sete diante de Gwanghwamun (1200 × 800).
2. `seoul-netflix-02.webp`: palco e estruturas de luz (1200 × 675).
3. `seoul-netflix-03.webp`: palco e plateia (1200 × 675).
4. `seoul-netflix-04.webp`: performance (1200 × 675).

BIGHIT MUSIC / Netflix © 2026. Direitos reservados; imagens editoriais oficiais,
sem licença aberta identificada. A disponibilidade pública não equivale a uma
licença irrestrita. O repositório registra a origem e não concede direitos sobre
essas fotografias. Nenhuma alegação de autorização individual foi adicionada.

A galeria oficial também foi confirmada na fonte fornecida:
https://bleedingcool.com/tv/bts-the-comeback-live-arirang-netflix-drops-official-image-gallery/.
A categoria Commons estava acessível, mas a série examinada mostrava público,
acessos e estrutura durante o dia; a seleção final priorizou os registros do show
na cobertura oficial. Não foi necessário recorrer às demais fontes.

Conversão WebP qualidade 88, sem ampliação, sem recorte e sem montagem. Total
aproximado de 355 KiB. Script reproduzível: `scripts/download-seoul-photos.mjs`.
Logo reutilizado: `/images/army-pass/logos/arirang-logo-novo.jpeg`.

## Implementação

Dados tipados em `src/data/arirang-seoul.ts`; apresentação editorial na rota e
CSS Module exclusivo. `EventCarousel` é o único componente cliente novo.
Controles anterior/próxima, indicadores diretos, teclas esquerda/direita e gesto
horizontal; sem reprodução automática. Contêiner estável 3:2 e `object-fit:
contain` preservam o quadro completo de todas as imagens em qualquer viewport.
Créditos e legendas ficam fora da imagem. Next Image entrega tamanhos responsivos.

Teste de navegador: `tests/browser/arirang-tour.spec.ts`. Capturas em
`test-artifacts/seoul-event/{desktop,tablet,mobile}.png` após a execução.
