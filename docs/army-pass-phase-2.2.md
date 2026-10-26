# Army Pass — Fase 2.2

## Entrega e referência

O WINGS foi reconstruído a partir de `Pass BTS WINGS Monocromático.png` fornecido pela usuária. A referência não é distribuída nem usada como fundo. O site mantém quatro etapas, agrupando o fluxo solicitado: era → fotografias independentes e dados → revisão → download/compartilhamento. A seleção pública das 12 artes foi retirada. MAP OF THE SOUL, BE e ARIRANG continuam funcionais, identificados como **aguardando design / modelo provisório**; seus novos designs não foram inventados.

## Reconstrução em camadas

`drawArmyPass` encaminha WINGS para `drawWingsPass`; os outros três layouts continuam no renderizador existente. O novo módulo usa uma grade de referência de 941 × 1672, escalada para 1080 × 1920. A composição contém:

1. Textura separada de carvão, grão e fumaça cinza, com filamentos Canvas translúcidos.
2. Borda fina, cabeçalho, título serifado e identificação WINGS.
3. Áreas reservadas para as duas marcas autênticas, sem símbolos aproximados.
4. Fotografia horizontal com recorte cover, clip e moldura dupla por cima.
5. Retrato circular independente, com recorte cover, anéis, órbita e detalhes por cima.
6. Ícones de contorno autorais, divisores e campos reais do formulário.
7. Frase autoral “Sete vozes. Infinitas histórias.” e assinatura @MEUUNIVERSOBTS.

`wings-smoke.png` contém somente textura, sem texto, fotos ou marcas. Foi criada proceduralmente pelo script `scripts/generate-wings-texture.py`, que **não lê a imagem de referência**. O script requer Python, Pillow e numpy apenas para regenerar o asset; o site não depende de Python.

## Duas fotografias

O reducer mantém `galleryId`/`galleryCrop` e `photo`/`personalCrop` separadamente. As ações explícitas de cada recorte impedem que um controle altere a outra foto. Os sliders têm IDs distintos quando os dois editores estão presentes. Alterar etapas preserva os dados e imagens; alterar era limpa apenas a seleção de galeria anterior, conservando o retrato.

O grupo usa fotografias do manifesto `eraPhotoManifest`, filtradas por era, arquivo local, autorização e crédito. O exportador verifica novamente se a imagem pertence ao manifesto aprovado. Sem fotos autorizadas, a janela conserva a textura abstrata; não há texto de placeholder no PNG. A escolha do grupo pode ser removida para voltar ao preenchimento abstrato.

O retrato é opcional. JPEG/PNG/WebP passam pela validação binária, limites de 10 MB e 40 MP, orientação EXIF e normalização já existentes. `PhotoSession` continua descartando URLs substituídas e resultados assíncronos antigos. Não há envio, conta ou persistência. No WINGS o retrato nunca substitui a fotografia do grupo. Nos outros três layouts provisórios, a galeria ocupa a janela antiga; sem galeria, o retrato pode ocupá-la. Essa diferença é explicada no editor e será substituída pelos futuros designs aprovados.

## Campos e exportação

`wingsSlots` centraliza a posição, largura e altura de nome, cidade/UF, bias, ano, música, experiência e mensagem. As posições seguem a referência: nome no topo da coluna direita, cidade/bias e ano/música em pares, experiência e mensagem abaixo. Textos são medidos com a fonte efetiva, quebrados por grafema e reduzidos até caber; quebras manuais excessivas são normalizadas. Campos vazios não recebem textos fictícios e “Prefiro não informar” não é impresso. As molduras e os demais campos não se deslocam.

Nomes e mensagens normais usam tamanhos próximos da referência. Limites extremos, especialmente 80 caracteres largos na coluna de música, exigem corpo menor dentro do espaço aprovado. Os testes verificam conteúdo completo, largura e altura de cada slot.

Prévia, ampliação e PNG usam `preparePassImage` e `drawArmyPass`. Fontes, textura, fotos e marcas autorizadas são aguardadas antes de desenhar. O download continua sendo PNG 1080 × 1920. O compartilhamento entrega o arquivo já pronto à Web Share API após clique; não publica automaticamente.

## Arquivos alterados

- `wings-renderer.ts`: novo template, grade, fotos, campos, ícones e decoração.
- `wings-texture.ts`, `public/images/army-pass/textures/wings-smoke.png`, `scripts/generate-wings-texture.py`: textura autoral independente.
- `renderer.ts`, `export.ts`, `types.ts`: encaminhamento, preparo das duas imagens, textura e marcas; compatibilidade temporária dos outros layouts.
- `state.ts`, `army-pass-builder.tsx`: estado independente e fluxo sem seleção de variantes/fontes exclusivas.
- `photo-source-selector.tsx`, `photo-cropper.tsx`: galeria e upload simultâneos, recortes independentes e IDs acessíveis.
- `themes.ts`, `era-selector.tsx`, `army-pass.module.css`: paleta monocromática, áreas das marcas e cards de um template por era.
- `army-pass-preview.tsx`, `image-processing.ts`: mensagens coerentes com o novo fluxo.
- `tests/army-pass.test.ts`, `tests/browser/army-pass.spec.ts`: regressões e novos cenários.
- README, arquitetura, guia da Fase 2 e esta documentação.

## Recuperação e dependências antigas

Antes de modificar o código foram lidos os módulos, documentação e guia local do Next.js. A baseline passou em **16 testes de lógica e 24 testes de navegador**.

Foi criado o commit de recuperação `a87bb4a5898f07fd07f672a6857dcebf5cae1f2e`, disponível em `refs/recovery/army-pass-before-phase-2.2`. Ele registra o estado anterior, incluindo os arquivos antes não rastreados, usando índice separado. A branch e o índice de trabalho não foram alterados. Para inspecionar um arquivo anterior sem restaurar a árvore inteira:

```sh
git show refs/recovery/army-pass-before-phase-2.2:src/features/army-pass/renderer.ts
```

A auditoria encontrou usos de `artwork.ts` no antigo seletor, exportador e testes. O seletor e seus controles foram removidos. O módulo antigo foi preservado: o exportador ainda utiliza **apenas a variante 0** como preenchimento dos três layouts provisórios. WINGS não utiliza suas artes. As variantes 1/2 não aparecem na experiência pública; sua exclusão definitiva pode ocorrer depois da substituição dos três templates. Os estados e ações obsoletos de seleção de arte/fonte foram retirados do reducer.

## Diferenças e recursos pendentes

- **Marcas BTS/WINGS:** não existem originais autorizados no projeto. As áreas estão reservadas nas posições da referência e o site informa a pendência; não há extração do anexo nem imitação dos símbolos. Para completar essas camadas, fornecer os arquivos originais, crédito, titularidade, fonte, referência de autorização e condições de uso. A marca WINGS usa `eraThemes.wings.logo`; BTS usa `btsLogo`, ambos em `themes.ts`, com o controle de autorização de `era-logos.ts`.
- **Fotos do BTS:** a galeria pública permanece vazia até receber imagens e permissões reais. O teste positivo usa apenas pixels sintéticos e autorização temporária dentro do teste; não adiciona conteúdo fictício à galeria pública.
- **Fumaça, lua e ícones:** reconstruções autorais aproximam a composição, mas não são pixels idênticos aos do anexo. A textura original da referência não foi recebida como asset separado.
- **Tipografia:** usa Georgia/Arial e fallbacks locais; a fonte exata da referência não foi fornecida. Métricas podem variar entre sistemas, mantendo prévia e exportação iguais no mesmo dispositivo.
- **Frase:** substituída pela frase autoral solicitada. “SETES ALMAS” da referência foi corrigido para “SETE ALMAS”. Placeholders foram retirados do PNG.
- **Demais eras:** aguardam suas referências aprovadas. Para substituir cada uma, adicionar um renderizador por era ao encaminhamento de `drawArmyPass`, com campos/fotos independentes e o mesmo preparo de assets. Validar os slots, PNG, privacidade e igualdade com a prévia antes de retirar o layout provisório correspondente.

Não houve deploy, nova branch ou alteração de outras funcionalidades do portal. A independência do projeto continua informada no site.

## Validação final e capturas

Resultado final: **19 testes de lógica/renderização e 24 testes Playwright passaram**, com TypeScript strict, ESLint, formatação e build de produção aprovados. O PNG baixado foi comparado byte a byte ao Canvas nos quatro templates e no upload pessoal, em desktop, tablet e mobile emulado. A integração positiva de galeria autorizada + retrato também exportou e conferiu pixels de ambas as áreas.

Os comandos de validação são `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check` e `npm run test:browser`. O último executa build de produção antes dos cenários de navegador na porta 3100.

As capturas reais e os PNGs baixados são salvos em `test-artifacts/phase-2.2/` (ignorado pelo Git): `studio-desktop.png`, `studio-tablet.png`, `studio-mobile.png`, `desktop-wings.png` e variantes por viewport/era. Arquivos terminados em `-portrait.png` mostram o upload sintético de teste. O relatório fica em `test-artifacts/playwright-report/index.html`.

Os testes de navegador conferem quatro eras, ausência da seleção de artes, formulário, dados preservados, galeria vazia com fallback, arquivo inválido, recorte/zoom, troca/remoção, download real idêntico ao Canvas, ausência de envio/persistência, ampliação/foco e compartilhamento simulado com cancelamento. Tablet e celular são emulados no Edge; dispositivos físicos, Safari/iOS e compartilhamento em aplicativos do sistema continuam sem validação física.
