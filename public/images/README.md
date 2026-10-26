Somente adicionar fotografias com autorização de uso documentada. A Fase 1 usa ilustrações em CSS, sem retratos artificiais.

A Fase 2.2 inclui `army-pass/textures/wings-smoke.png`, textura abstrata autoral gerada proceduralmente por `scripts/generate-wings-texture.py`, sem fotos, texto ou marcas. Não é uma reprodução nem recorte do anexo. Logos BTS/WINGS e fotografias do BTS continuam pendentes de arquivos originais autorizados.

A Fase 2.3 adiciona `army-pass/textures/map-atmosphere.svg` e seu PNG, atmosfera azul/lilás autoral sem textos, retratos ou marcas. Regenerar com `node scripts/render-map-background.mjs`. O 7 multicolorido e os símbolos BTS aguardam originais autorizados; o template usa identificação tipográfica. Consulte `docs/army-pass-phase-2.3.md`.

A Fase 2.4 adiciona `army-pass/textures/persona-atmosphere.svg` e o PNG correspondente, com atmosfera rosa, nuvens e geometria arquitetônica autorais, sem fotos ou marcas oficiais. Regenerar com `node scripts/render-persona-background.mjs`. Fotos aprovadas poderão entrar em `army-pass/persona/`; a galeria permanece vazia. Símbolos BTS/PERSONA aguardam arquivos originais autorizados. Consulte `docs/army-pass-phase-2.4.md`.

A Fase 2.5 adiciona `army-pass/textures/arirang-paper.svg` e seu PNG, com papel/paisagem/pinceladas autorais, sem fotos, textos ou logotipos. Regenerar com `node scripts/render-arirang-background.mjs`. O original separado do logotipo ARIRANG não foi recebido; sua área permanece reservada, sem símbolos redesenhados nem fonte substituta. Consulte `docs/army-pass-phase-2.5.md`.

ARIRANG — revisão clara: `army-pass/textures/arirang-light-paper.png` contém papel e paisagem autorais, sem fotos, textos ou logos. Gerado deterministicamente por `node scripts/render-arirang-light-background.mjs`. Substitui o fundo escuro no único template público ARIRANG; arquivos anteriores preservados. Detalhes em `docs/army-pass-phase-2.5-light.md`.

Atualização ARIRANG: os arquivos originais dos três símbolos vermelhos e da marca preta BTS foram recebidos e integrados exclusivamente ao ARIRANG. Os originais e PNGs preparados estão em `army-pass/logos/`. Consulte `docs/arirang-logo-fix.md` para origem, preparação, uso solicitado e testes. Esta atualização substitui a pendência de assets ARIRANG registrada nos parágrafos históricos acima.

A Fase 2.6 publica três fotografias WINGS em `army-pass/gallery/wings/`; o responsável pelo projeto confirmou autorização para uso e distribuição no Army Pass. O manifesto TypeScript limita a galeria a três imagens locais por era. As pastas `map-of-the-soul-7/`, `persona/` e `arirang/` estão preparadas, sem fotografias ainda. Consulte `docs/army-pass-phase-2.6.md`.

Atualização das galerias: MAP OF THE SOUL: 7, PERSONA e ARIRANG também possuem três fotografias locais cada, em `army-pass/gallery/map-of-the-soul-7/`, `army-pass/gallery/persona/` e `army-pass/gallery/arirang/`. Os caminhos, créditos, descrições, autorização confirmada pelo responsável e enquadramentos estão no manifesto `src/features/army-pass/themes.ts`. A área do grupo usa enquadramento sem corte (`contain`) e preenchimento desfocado derivado da própria foto quando necessário.
