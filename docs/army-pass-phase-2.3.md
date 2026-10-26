# Army Pass — Fase 2.3: MAP OF THE SOUL: 7

## Implementação

O template foi reconstruído em camadas a partir da referência anexada. A imagem fornecida não foi embutida, recortada nem distribuída como fundo. A composição usa a grade de 941 × 1672 da referência, escalada pelo Canvas para **1080 × 1920**.

`drawArmyPass` encaminha a era `map-of-the-soul` para `drawMapPass`. WINGS continua no seu renderizador aprovado, sem alterações em `wings-renderer.ts`, `wings-texture.ts` ou na textura. BE e ARIRANG permanecem provisórios, sem novos desenhos. Não foram criados branch, deploy, seleção de variantes, novas rotas ou funcionalidades externas ao gerador.

O novo desenho inclui:

- Papel azul profundo, luz azul-clara e camadas lilás/rosa.
- Linhas curvas e geométricas finas, pequenos pontos, estrelas e faixas translúcidas.
- Cabeçalho PURPLE PASS / ARMY PASS BRASIL, título MAP OF THE SOUL 7 e coluna lateral BR / 07.
- Janela horizontal do grupo, com dupla moldura delicada.
- Retrato circular com anéis azul/lilás, reflexos e medalhão translúcido sobreposto.
- Dados na coluna direita e mensagem pessoal na área caligráfica inferior.
- Planos abstratos de papel/vidro na parte inferior e crédito @MEUUNIVERSOBTS.

O asset `map-atmosphere.svg` é autoral: contém somente atmosfera, grão e planos abstratos, sem fotos, textos ou símbolos oficiais. Sua versão PNG é gerada pelo script `node scripts/render-map-background.mjs`; o site carrega o PNG para obter uma textura determinística. Os detalhes geométricos, molduras, textos, fotos e marcas autorizadas são camadas Canvas independentes.

## Fotografias e controles preservados

O template reutiliza `photo`, `personalCrop`, `galleryId` e `galleryCrop` do reducer, sem mudar seus contratos. Galeria e retrato coexistem. Os mesmos controles oferecem zoom e posições horizontal/vertical, com ações e IDs separados.

A janela do grupo ocupa `x=98, y=494, largura=752, altura=360` na grade da referência. A foto pessoal usa recorte quadrado de 328 × 328, com centro em `(277, 1033)` e clip circular de raio 164. `cropRectangle` mantém a proporção com cover; nenhuma foto é esticada. As molduras são desenhadas sobre as fotos.

A galeria só aceita arquivos locais aprovados em `eraPhotoManifest`. Ela continua vazia; sem imagem autorizada, a janela recebe um preenchimento abstrato azul/lilás, sem texto de placeholder. Não foi extraída a fotografia do anexo nem baixada uma foto do BTS.

O upload opcional mantém validação de assinatura JPEG/PNG/WebP, 10 MB, 40 MP, orientação EXIF, normalização e `PhotoSession`. O retrato não substitui o grupo. Remover/substituir uma foto não altera a outra. Dados e imagem pessoal não são enviados, persistidos em storage ou colocados em URLs externas.

## Dados e exportação

`mapSlots` define posições e limites de nome, cidade/UF, bias, ano, música, experiência e mensagem. A hierarquia segue a referência: nome e cidade acima de bias/ano, música e experiência abaixo. A mensagem ocupa a área da frase caligráfica. Sem mensagem, aparece a frase editorial autoral “Cada encontro abre um novo universo.”; não há mensagem fictícia atribuída à pessoa.

O formulário, seus oito campos e a validação Zod não mudaram. “Prefiro não informar” não é impresso como experiência. Campos opcionais vazios não exibem exemplos. O texto é medido com a fonte efetiva, quebrado por grafema e reduzido até caber; quebras manuais excessivas são redistribuídas. Os slots são fixos: textos longos não deslocam fotos ou outros campos. Valores extremos podem precisar de fonte menor.

`canvas-layout.ts` reúne a função existente `wrapText`, movida sem alteração e reexportada por `renderer.ts`, e a nova função genérica `drawFittedText`. O WINGS não foi reescrito nem passou a depender da nova função de ajuste.

Prévia, diálogo ampliado e exportação usam `preparePassImage` e o mesmo `drawArmyPass`. Fontes, textura, duas fotos e marcas autorizadas são aguardadas antes de desenhar. O arquivo mantém `army-pass-map-of-the-soul.png`, PNG 1080 × 1920. Download, detecção de suporte ao compartilhamento e tratamento de cancelamento permanecem os existentes.

## Identidades autorizadas e diferenças da referência

Não há arquivos autênticos autorizados do símbolo BTS nem do número 7 multicolorido no projeto. As posições foram preparadas, mas o template usa **BTS em texto e um 7 tipográfico simples**, sem imitar os símbolos. O “7” multicolorido só será integrado quando houver um asset autorizado.

- O número autêntico usa `eraThemes["map-of-the-soul"].logo`, com área em pixels finais `{x:725, y:285, width:310, height:420}`.
- A marca BTS usa o cadastro já existente `btsLogo`, sem alterar sua configuração WINGS. No MAP ela é posicionada em `mapBtsPlacement`; o medalhão usa `mapBadgePlacement`.
- `authorizedLogoPath` exige status autorizado, origem, crédito, referência e condições de uso. `containLogo` preserva proporção. Arquivo ausente ou falha de carregamento mantém a identificação tipográfica.
- Os arquivos devem ser locais em `public/images/army-pass/logos/`, com os metadados aprovados em `themes.ts`. Não basta trocar o status sem fornecer permissão e arquivo reais.

Para completar essas camadas, são necessários os originais BTS e 7 multicolorido, créditos e permissões; fotografias aprovadas também precisam de arquivos e autorização no manifesto.

Outras diferenças documentadas:

- A textura, os planos abstratos e a moldura iridescente são reconstruções autorais, não os mesmos pixels do anexo. As texturas originais separadas não foram fornecidas.
- Fontes locais Segoe UI e Segoe Script aproximam o título moderno e a área manuscrita. A fonte exata do design não foi fornecida; fontes e caracteres podem variar por sistema.
- O retrato/silhueta de exemplo e a foto do BTS não fazem parte do template. Sem fotos, ficam os preenchimentos abstratos coerentes.
- A frase em inglês foi substituída pela frase autoral ou pela mensagem real do formulário. O detalhe vertical usa “NOSSO UNIVERSO”. A experiência mostra a opção real escolhida, sem inventar um encontro futuro.
- O círculo do medalhão fica sem símbolo enquanto não houver marca autorizada. Não foi criado um símbolo substituto.

Essas diferenças impedem afirmar que o resultado é idêntico à referência; composição, proporções e posições foram usadas como guia obrigatório.

## Arquivos desta fase

- `src/features/army-pass/map-renderer.ts`: composição exclusiva, slots, fotografias, marcas e detalhes editoriais.
- `src/features/army-pass/canvas-layout.ts`: medição, quebra e ajuste de texto compartilháveis.
- `src/features/army-pass/renderer.ts`: encaminhamento e moldura registrada da nova era; reexportação de `wrapText`.
- `src/features/army-pass/export.ts`: prepara a textura e a marca BTS também para MAP OF THE SOUL: 7.
- `src/features/army-pass/themes.ts`: nome, paleta e posição do número autorizado do MAP.
- `src/features/army-pass/era-selector.tsx`, `army-pass.module.css`: card do novo modelo aprovado.
- `src/features/army-pass/photo-source-selector.tsx`: descrição correta das duas fotos e pendência dos assets.
- `public/images/army-pass/textures/map-atmosphere.svg`, `map-atmosphere.png`: atmosfera separada.
- `scripts/render-map-background.mjs`: geração reproduzível do PNG a partir do SVG autoral.
- `tests/map-pass.test.ts`: recortes, limites dos campos, dados vazios e integração autorizada do 7.
- `tests/army-pass.test.ts`: textura nova, exportação com grupo/retrato de teste e regressões.
- `tests/browser/army-pass.spec.ts`: upload independente em ambas as eras, capturas e PNGs da Fase 2.3.
- README, guia de imagens e esta documentação.

## Testes e artefatos

Resultado final: **23 testes de lógica/renderização e 27 testes Playwright passaram**. TypeScript strict, ESLint, formatação e build de produção também passaram. A suíte completa foi repetida após ajustar a leitura de pixels do teste de independência; não foi necessário alterar o renderizador para isso.

A baseline anterior passou nos 19 testes existentes. Foram preservados PNGs anteriores de WINGS, BE e ARIRANG em `test-artifacts/phase-2.3/baseline-*.png`; a comparação após integrar MAP confirmou os mesmos bytes nos três templates, no mesmo ambiente nativo.

Os downloads desktop também foram comparados aos PNGs reais da Fase 2.2: WINGS, BE e ARIRANG permaneceram byte a byte iguais com os mesmos dados. Os hashes dos dois módulos e da textura WINGS também foram preservados.

Comandos: `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check` e `npm run test:browser`. O Playwright executa o build de produção e serve localmente na porta 3100; não publica o projeto.

Os testes de lógica cobrem duas fotos independentes, cover, clip circular, limites máximos por slot, campos vazios, grafemas/acentos, símbolos bloqueados sem autorização, proporção do asset autorizado e exportação real com galeria/retrato sintéticos. Nenhuma fixture entra na galeria pública.

Os testes de navegador cobrem as quatro eras, fluxo, prévia, dados preservados, galeria vazia, upload/recorte/troca/remoção, ausência de envio/persistência, download real comparado byte a byte com o Canvas, compartilhamento simulado e ampliação. Desktop 1440 × 900, tablet 768 × 1024 e mobile 390 × 844 são exercitados no Edge.

Na checagem de independência, o teste lê uma cópia PNG para não alterar o backend do Canvas vivo. A amostra do fundo permite diferença de até 1/255 por canal, pois o Chromium pode arredondar gradientes entre backends. A comparação do arquivo baixado com a prévia continua **exata, byte a byte**; os testes nativos das duas fotografias também usam cores exatas.

Capturas e PNGs reais em `test-artifacts/phase-2.3/` (ignorado pelo Git):

- `desktop-map-of-the-soul.png`: PNG final preenchido, sem fotos não autorizadas.
- `desktop-map-of-the-soul-portrait.png`: PNG com retrato sintético do teste de upload.
- `mobile-map-of-the-soul.png` e `mobile-map-of-the-soul-portrait.png`: downloads na viewport mobile.
- `studio-map-of-the-soul-desktop.png`, `studio-map-of-the-soul-mobile.png` e versão tablet: página real preenchida.
- PNGs de WINGS, BE e ARIRANG para comparação de regressão.
- Relatório de execução em `test-artifacts/playwright-report/index.html`.

Dispositivos físicos, Safari/iOS e compartilhamento em aplicativos externos não foram verificados. As capturas mobile/tablet usam emulação; a API de compartilhamento é simulada, sem publicação real.
