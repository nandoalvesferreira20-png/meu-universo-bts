# Army Pass — Fase 2.4: MAP OF THE SOUL: PERSONA

## Entrega e lista pública

PERSONA foi reconstruído a partir de `Army Pass Brasil_ Mapa da Alma.png`, fornecido pela usuária, em camadas independentes. A referência não foi usada como fundo, recortada, redistribuída ou incorporada ao projeto.

A lista pública segue o pedido: **WINGS, MAP OF THE SOUL: 7, MAP OF THE SOUL: PERSONA e ARIRANG**. PERSONA ocupa o terceiro lugar, BR / 03. BE foi retirado do seletor, sem apagar seu tema, artes ou renderização legada; permanece disponível internamente para recuperação. `EraId` mantém esse identificador legado, enquanto `eraIds` define somente as quatro opções públicas. Nenhuma variante ou seleção antiga de artes foi reintroduzida.

Os arquivos dos renderizadores WINGS e MAP OF THE SOUL: 7 não foram alterados. ARIRANG também não recebeu novo desenho. Não houve deploy, branch nova ou implementação de outras funcionalidades do portal.

## Reconstrução visual

`persona-renderer.ts` usa a grade da referência, 941 × 1672, escalada no Canvas para **1080 × 1920**. A composição reúne:

1. Atmosfera rosa/coral, papel com grão, luz suave, nuvens e estudos arquitetônicos autorais.
2. Cabeçalho ARMY PASS BRASIL, BR / 03, título editorial MAP OF THE SOUL / PERSONA e texto lateral.
3. Curvas brancas, corações decorativos genéricos, linhas finas e pontos de luz.
4. Janela horizontal do grupo com clip oblíquo e moldura dupla delicada.
5. Retrato circular com anéis claros, detalhes por cima da foto e medalhão translúcido.
6. Nome, localização e dados na coluna direita; mensagem na área manuscrita inferior.
7. Dois cartões de papel com ilustrações próprias de arquitetura e céu, sem fotos externas.
8. Identificação da era e crédito @MEUUNIVERSOBTS no rodapé.

`persona-atmosphere.svg` contém somente atmosfera, planos e textura, sem texto, fotos ou marcas. `node scripts/render-persona-background.mjs` gera o PNG usado pelo navegador a partir desse SVG autoral. O script não lê a referência. As molduras, curvas, cartões, dados e fotos são camadas Canvas independentes; não há um passaporte inteiro pré-renderizado por baixo dos dados.

## Duas fotografias

O grupo usa `galleryId`/`galleryCrop` e a galeria aprovada existente. Seu retângulo de cover ocupa `{x:96, y:470, width:780, height:404}` na grade da referência, depois limitado pelo quadrilátero `(96,470), (876,534), (876,874), (96,857)`. A imagem permanece proporcional e ereta; o corte e a moldura são oblíquos. Não foi aplicada uma deformação de perspectiva à fotografia.

O retrato usa `photo`/`personalCrop`, com cover quadrado de 354 × 354, centro `(290,1036)` e clip circular de raio 177. Os anéis, coração e medalhão são desenhados depois da imagem, mantendo os detalhes visíveis. Ajustar, trocar ou remover uma foto não altera a outra.

A galeria continua vazia até receber fotografias autorizadas. Sem foto do grupo, a janela mantém a atmosfera rosa com um véu translúcido, sem placeholders. Sem retrato, o círculo mantém preenchimento abstrato. Não foram extraídos retratos/fotos do anexo, feitos scraping ou downloads de fotografias.

Upload JPEG/PNG/WebP, assinatura binária, limites de 10 MB e 40 MP, orientação EXIF, normalização, descarte de URLs e proteção contra processamento atrasado continuam no código existente. A foto pessoal é opcional, processada localmente, sem envio ou persistência. O reducer, os controles e `PhotoSession` não foram recriados.

## Dados e conteúdo opcional

`personaLayout` define os slots dos dados reais. Nome fica em `(505,915)` e cidade/UF em `(530,975)`. Com todos os campos preenchidos, bias/ano começam na linha 1047, música na 1146, experiência na 1238 e mensagem na 1354.

Sem cidade/UF, a linha bias/ano sobe 47 px. Música e experiência ausentes deixam de reservar suas linhas, e a mensagem sobe. A moldura e as duas fotos não mudam de posição. Ano vazio oculta seu rótulo e divisor; “Prefiro não informar” não é impresso. Nenhum exemplo como FERNANDO, Boy With Luv ou encontro futuro é inserido automaticamente.

O texto usa `drawFittedText`, já compartilhável desde a fase anterior: medição com a fonte efetiva, quebra por grafema e redução controlada para caber. Textos longos não alteram as outras áreas nem recebem reticências. Muitas quebras manuais são redistribuídas. Casos extremos podem exigir fonte menor.

A frase em inglês do anexo não foi reproduzida. Sem mensagem pessoal, aparece a frase editorial autoral **“Entre encontros, nossa história floresce.”**; quando existe mensagem, o conteúdo real do formulário ocupa essa área manuscrita.

## Identidades e permissões

Não existem originais autorizados dos símbolos BTS e PERSONA no projeto. A composição usa os títulos tipográficos, BTS em texto e BR no medalhão. Os corações são decoração genérica autoral, sem apresentação como logotipo oficial.

- A identidade de PERSONA pode ser configurada em `eraThemes.persona.logo`.
- BTS usa o cadastro existente `btsLogo`, posicionado nesta composição por `personaBtsPlacement` e `personaBadgePlacement`; o posicionamento WINGS não foi modificado.
- `authorizedLogoPath`, `prepareEraLogo` e `containLogo` continuam exigindo arquivo local, origem, crédito, autorização e condições, preservando proporção. Ausência ou falha mantém o fallback.
- Para completar essas camadas, fornecer os arquivos originais autorizados, créditos e permissões. Fotografias aprovadas entram em `public/images/army-pass/persona/` e `eraPhotoManifest`, com descrição e referência de autorização.

O aviso de projeto independente permanece no site.

## Prévia, exportação e interface

`drawArmyPass` encaminha `persona` para `drawPersonaPass`. `preparePassImage` prepara textura, grupo, retrato e marcas autorizadas; fontes e imagens são aguardadas antes de desenhar. Prévia, ampliação e exportação usam a mesma função. O arquivo é `army-pass-persona.png`, PNG **1080 × 1920**.

O fluxo permanece: era → fotografias opcionais e dados → revisão → download/compartilhamento. Não há login, upload de servidor ou novos seletores de arte. Os campos, validação Zod e controles de recorte foram preservados. O seletor exibe o nome público completo; a numeração da prévia agora usa a lista pública, conservando ARIRANG como volume 04.

O compartilhamento continua entregando um arquivo já preparado à Web Share API, após clique e detecção de suporte. Cancelar mantém o arquivo disponível. O download continua disponível quando o sistema não suporta compartilhar arquivos.

## Arquivos alterados

- `src/features/army-pass/persona-renderer.ts`: composição, molduras, slots, conteúdo opcional, fotos e decoração.
- `public/images/army-pass/textures/persona-atmosphere.svg`, `persona-atmosphere.png`: atmosfera autoral separada.
- `scripts/render-persona-background.mjs`: geração reproduzível da textura.
- `public/images/army-pass/persona/.gitkeep`: diretório preparado para fotos autorizadas.
- `types.ts`, `themes.ts`: lista pública, tema PERSONA e preservação interna de BE.
- `renderer.ts`, `export.ts`: encaminhamento e preparação de assets PERSONA.
- `era-selector.tsx`, `army-pass.module.css`: card rosa e nome completo.
- `army-pass-preview.tsx`, `photo-source-selector.tsx`: numeração pública, descrição das fotos e pendência das marcas.
- `artwork.ts`: proteção para que PERSONA não use variantes legadas.
- `src/app/army-pass/page.tsx`: somente a descrição de metadados foi alinhada à lista pública.
- `tests/persona-pass.test.ts`: seleção pública, fotos, recortes, conteúdo opcional, limites e assets autorizados.
- `tests/army-pass.test.ts`, `tests/browser/army-pass.spec.ts`: exportação com duas imagens, regressões, compartilhamento e capturas.
- README, guia de imagens e esta documentação.

## Diferenças da referência e limitações

- Fotos de exemplo e símbolos oficiais não estão incluídos; dependem de arquivos e permissões reais.
- O coração principal é uma decoração genérica própria; não é uma cópia de identidade oficial. Há integração preparada para um asset autorizado.
- Textura, nuvens, fachadas e cartões inferiores são ilustrações reconstruídas, não as fotografias/texturas exatas do anexo. Não foram extraídas imagens da referência.
- Segoe UI e Segoe Script aproximam as fontes editoriais e manuscritas. A fonte original não foi fornecida; fontes e glifos podem variar entre dispositivos.
- A janela principal reproduz o corte oblíquo, mantendo a foto sem deformação. Não imita uma transformação de perspectiva dos pixels.
- A frase decorativa foi substituída por texto autoral ou pela mensagem real. Localização mostra cidade/UF reais, sem acrescentar um país fictício aos dados.
- Campos opcionais vazios compactam a coluna; esse estado varia intencionalmente em relação ao exemplo totalmente preenchido.

O resultado segue composição e proporções da referência, mas não é idêntico aos seus pixels. Tablet e mobile são emulados; dispositivos físicos, Safari/iOS, leitores de tela e compartilhamento em aplicativos externos não foram auditados nesta entrega.

## Testes e artefatos

Resultado final: **28 testes de lógica/renderização e 33 testes Playwright passaram**, além de TypeScript strict, ESLint, formatação e build de produção. A inspeção visual incluiu o PNG real, retrato sintético e capturas desktop/mobile.

Antes da integração, os **23 testes existentes passaram**. Foram guardados PNGs de WINGS, MAP OF THE SOUL: 7 e ARIRANG em `test-artifacts/phase-2.4/baseline-*.png`, para comparação de regressão. Os módulos aprovados foram preservados.

A comparação nativa encontrou arquivos byte a byte iguais nas três eras preservadas. Entre downloads desktop de execuções distintas, WINGS e ARIRANG também ficaram exatos; MAP OF THE SOUL: 7 variou em **7 pixels, no máximo 1/255 em um canal**, compatível com arredondamento do Canvas Chromium. Seu módulo permaneceu com o mesmo hash. Dentro da execução, todos os downloads continuaram byte a byte iguais à respectiva prévia.

Comandos: `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check` e `npm run test:browser`. O Playwright faz build de produção e serve localmente na porta 3100, sem publicar o projeto.

As verificações incluem quatro eras públicas e ausência de BE/variantes, dados máximos e vazios, galeria autorizada sintética somente dentro do teste, duas fotos independentes, cover, recortes, upload/zoom/troca/remoção, privacidade, prévia, download real, PNG 1080 × 1920 e compartilhamento simulado com cancelamento. O arquivo baixado é comparado **byte a byte** ao Canvas. O teste de independência lê uma cópia PNG; amostras de gradiente admitem até 1/255 por canal entre backends Chromium, sem relaxar a comparação do download.

Arquivos reais de validação em `test-artifacts/phase-2.4/` (ignorados pelo Git):

- `desktop-persona.png`: PNG preenchido sem fotografias não autorizadas.
- `desktop-persona-portrait.png`: PNG com retrato sintético do teste de upload.
- `mobile-persona.png`, `mobile-persona-portrait.png`: arquivos baixados em mobile.
- `studio-persona-desktop.png`, `studio-persona-mobile.png` e versão tablet: capturas da página real preenchida.
- PNGs de WINGS, MAP OF THE SOUL: 7 e ARIRANG para regressão.
- Relatório Playwright em `test-artifacts/playwright-report/index.html`.
