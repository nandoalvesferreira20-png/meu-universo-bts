# Correção crítica do Army Pass

## Diagnóstico reproduzido

O problema foi reproduzido no Edge headless pelo Playwright, antes de alterar a configuração. A captura enviada não estava presente entre os anexos disponíveis (havia apenas o pedido em texto); foram produzidas capturas próprias do estado anterior.

**Causa raiz:** `next.config.ts` aplicava o loader `@tailwindcss/turbopack` a `*.css` com `as: "*.css"`. Isso incluía `army-pass.module.css` e o reclassificava como CSS global. O arquivo de estilos era entregue com seletores como `.formGrid`, mas o import `styles` não fornecia o mapa de classes dos CSS Modules.

Evidências anteriores à correção:

- HTML de `/army-pass`: `<ol>` das etapas, grade e Canvas sem classes; os cards com interpolação exibiam `class="undefined ..."`.
- CSS compilado do editor: seletores globais `.builder`, `.workspace`, `.formGrid`, sem nomes locais gerados.
- Medição no navegador: a grade do formulário tinha `className: ""` e `getComputedStyle(...).display === "block"`.
- O Tailwind global era carregado, e `globals.css` já estava importado no layout. O problema não era ausência desse import, nem falta de classes construídas dinamicamente pelo Tailwind.
- Não houve erros de JavaScript, console ou hidratação na reprodução anterior. O exportador, acionado pelo teste apesar da interface desorganizada, gerou `army-pass-wings.png` válido de 1080 × 1920. Não foi reproduzida uma falha interna do exportador; a perda de estilos prejudicava o acesso e a compreensão dos controles.

Lint, TypeScript, testes de desenho e HTTP 200 não detectavam essa falha de integração. Por isso foram adicionados testes que exigem classes efetivas e estilos computados no navegador.

## Correção

- Removida a regra genérica de transformação do Turbopack.
- Adicionado `postcss.config.mjs` com `@tailwindcss/postcss`, conforme o guia local da versão instalada do Next para Tailwind v4. CSS Modules voltaram ao processamento nativo do Next.
- Substituída a dependência `@tailwindcss/turbopack` por `@tailwindcss/postcss`.
- Confirmados no CSS compilado os nomes locais (por exemplo, `E5-gXW_formGrid`), tokens processados do Tailwind, utilitário `.grid` e ausência de `@theme` não compilado.
- Formulário: agrupamento explícito do texto dos labels, controles em linhas próprias, altura mínima de 48 px, duas colunas no desktop e largura total no mobile.
- Progresso: “Escolha sua era”, “Personalize”, “Visualize”, “Compartilhe”; apenas o conteúdo da etapa ativa permanece no editor.
- Prévia: coluna direita no desktop; no mobile, fica no início da etapa de visualização e recebe foco nessa transição. O atalho deixou de flutuar sobre os controles.
- Seletor: preservadas as três origens, bordas, seleção, ícones e 12 artes; descrições mais curtas.
- Recorte: `label` associado explicitamente ao `input` por `htmlFor`/`id`. O teste real revelou que o `output` dentro do label recebia sua associação implícita, impedindo identificar o slider por “Zoom”.

Não foram alterados os desenhos dos quatro templates, o contrato Zod, a exportação, a lógica de compartilhamento ou o processamento local das fotos. Não houve deploy ou nova branch.

## Arquivos alterados nesta correção

- `next.config.ts`, `postcss.config.mjs`, `package.json`, `package-lock.json`, `eslint.config.mjs` (exclusão de relatórios e caches gerados).
- `src/features/army-pass/army-pass.module.css`.
- `src/features/army-pass/army-pass-form.tsx`.
- `src/features/army-pass/army-pass-builder.tsx`.
- `src/features/army-pass/army-pass-preview.tsx`.
- `src/features/army-pass/photo-source-selector.tsx`.
- `src/features/army-pass/photo-cropper.tsx`.
- `playwright.config.ts`, `tests/browser/army-pass.spec.ts` e documentação.

## Testes de navegador

Comando: `npm run test:browser`. A configuração constrói e serve o build de produção na porta 3100, com um contexto novo por teste. No Windows usa o Edge instalado; nos demais sistemas usa Chromium do Playwright (instalar com `npx playwright install chromium` se necessário). A porta 3100 precisa estar livre; uma instância antiga não é reutilizada.

Projetos: desktop 1440 × 900 e mobile emulado 390 × 844. O teste mobile usa o motor do Edge, não Safari/iOS.

A suíte verifica:

- CSS Modules aplicado, ausência de classes `undefined`, display da grade e do progresso.
- Posição dos labels acima dos campos, controles de pelo menos 48 px, ausência de interseção entre campos e ausência de overflow horizontal.
- Duas colunas no desktop e prévia 9:16; prévia visível na transição para “Visualize” no mobile.
- Quatro eras, três artes de cada era, preenchimento completo, avanço e retorno preservando os dados.
- Download real de cada era, assinatura PNG, dimensões 1080 × 1920 e igualdade binária com `canvas.toDataURL()` da prévia no mesmo navegador.
- Foto pessoal, zoom e posição pelo teclado, troca, remoção, alternância de fonte e preservação ao trocar de era.
- Nome obrigatório, galeria vazia, formato inválido e foco após erro.
- Nenhum erro de console/JavaScript/hidratação nos cenários exercitados.
- Nenhuma requisição de envio durante o fluxo com foto pessoal; `localStorage` e `sessionStorage` vazios.

## Resultado executado

- **12 testes de navegador passaram**, seis no desktop e seis no mobile emulado, em 2,7 minutos na execução final.
- **13 testes automatizados existentes passaram**, preservando artes, renderização, exportação, validação, matemática de recorte e ciclo de vida dos recursos.
- **ESLint, TypeScript strict e build de produção passaram.** O Playwright construiu e serviu esse build antes de testar a interface.
- **Modo de desenvolvimento verificado no Edge:** foi reutilizado o servidor já aberto em `http://localhost:3000`, sem encerrá-lo. Grade com CSS Module aplicado, navegação das etapas e download PNG 1080 × 1920 passaram, sem erros de console/hidratação durante esse teste.
- **Oito downloads das quatro eras**, mais downloads com foto pessoal, tiveram PNG real 1080 × 1920 e igualdade com os bytes da prévia no navegador.
- Nenhum erro de console/JavaScript/hidratação, overflow horizontal ou interseção entre os campos foi encontrado nos cenários testados.

Os primeiros testes de navegador identificaram a associação incorreta do rótulo do zoom, corrigida antes da execução final. Também foi corrigido um seletor do próprio teste que confundia o alerta do editor com o anunciador de rotas do Next. O ESLint passou após excluir os arquivos gerados do relatório Playwright, sem excluir o código-fonte ou os testes da análise.

## Capturas e relatórios

Gerados localmente em `test-artifacts/` (ignorado pelo Git):

- `before-desktop.png`, `before-mobile.png`: interface quebrada reproduzida antes da correção.
- `after-desktop.png`, `after-mobile.png`: formulário preenchido após a correção.
- `browser/`: PNGs baixados por teste e traces/capturas de falhas, quando houver.
- `playwright-report/index.html`: relatório da execução mais recente.

Os dados das capturas são fictícios de teste. As amostras não são publicadas no portal.

## Limites

O compartilhamento pelo menu nativo do aparelho, Safari/iOS, dispositivos físicos, leitores de tela e fotografias autorizadas reais da galeria ainda exigem verificação específica. A galeria permanece vazia por falta de arquivos autorizados. A emulação mobile e os testes de teclado não equivalem a uma auditoria completa de acessibilidade.
