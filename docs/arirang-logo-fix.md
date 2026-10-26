# Correção dos logos ARIRANG e BTS

## Assets e escopo

Foram recebidos em Downloads `arirang-logo.jpg` (554 × 554) e `bts-logo.png` (447 × 447). O usuário confirmou que os três símbolos, sem escrita adicional, compõem o logotipo ARIRANG desejado. Nenhuma escrita foi recriada.

Originais preservados, sem alteração de bytes:

- `public/images/army-pass/logos/arirang-logo-original.jpg`
- `public/images/army-pass/logos/bts-logo-original.png`

Cópias utilizadas pela renderização:

- `public/images/army-pass/logos/arirang-logo.png` — 460 × 158, três símbolos vermelhos.
- `public/images/army-pass/logos/bts-logo.png` — 193 × 425, símbolo preto e letras BTS do próprio arquivo.

`node scripts/prepare-arirang-logos.mjs` gera essas cópias de forma determinística. Somente o fundo quase branco neutro recebe alfa zero (mínimo RGB ≥ 245 e amplitude RGB ≤ 10); margens vazias são removidas, preservando três pixels de respiro. Não há redesenho, IA, troca de fonte, recoloração, efeitos ou redimensionamento na preparação. Os pixels visíveis e a geometria originais são preservados. As bordas existentes na imagem JPEG mantêm a nitidez disponível no arquivo recebido, sem inventar detalhes.

O cadastro registra o pedido do usuário nesta conversa como referência de uso no template ARIRANG. A URL institucional é documentação da identidade, não uma URL usada no carregamento final nem uma alegação de licença geral para outras finalidades.

## Integração e posições

A prévia, a ampliação e a exportação continuam usando `preparePassImage` e `drawArirangPass`. Ambos os assets são locais e aguardados antes do desenho. `containLogo` preserva a proporção sem estiramento.

Posições em pixels finais 1080 × 1920:

- ARIRANG: caixa central superior `{x:221,y:73,width:629,height:217}`; a altura comporta somente os três símbolos fornecidos.
- BTS: caixa superior direita `{x:956,y:74,width:48,height:100}`; o desenho é centralizado proporcionalmente nessa caixa.

`arirangBtsLogo` isola o arquivo preto no ARIRANG. O cadastro BTS compartilhado pelos outros templates não foi ativado nem alterado. O rodapé permanece como estava: o novo asset BTS só é aplicado à posição superior direita solicitada.

Foram retirados os avisos de logo pendente de ARIRANG. Fundo, molduras, paisagem, fotos, cartões, fontes dos dados, formulário, recorte, compartilhamento e exportação foram preservados. Nenhuma outra página foi alterada. Não houve branch nova ou deploy.

## Arquivos de código alterados

- `src/features/army-pass/themes.ts`: cadastro local ARIRANG e variante preta BTS exclusiva dessa era.
- `src/features/army-pass/export.ts`: carregamento da variante BTS correspondente.
- `src/features/army-pass/arirang-renderer.ts`: configuração BTS específica, restrita à posição superior direita.
- `src/features/army-pass/era-selector.tsx` e `photo-source-selector.tsx`: retirada dos avisos vencidos de assets ausentes.
- `scripts/prepare-arirang-logos.mjs`: preparação não destrutiva dos derivados.
- `tests/arirang-pass.test.ts`, `tests/army-pass.test.ts`, `tests/era-logos.test.ts`, `tests/browser/army-pass.spec.ts`: assets reais, comparação de pixels, exportação e carregamento.
- README, guia de assets e este relatório.

## Validação

35 testes de lógica/renderização passaram, além de TypeScript, ESLint e formatação. O teste específico compara o ARIRANG com e sem os arquivos: todos os pixels modificados ficam exclusivamente nas duas caixas dos logos. Também verifica transparência, marcas locais cadastradas, proporção e PNG fiel ao desenho.

A inspeção do download desktop confirmou as duas marcas visíveis, sem retângulos brancos. A comparação com `before.png` encontrou 85.061 pixels modificados, todos nas duas caixas dos logos: **zero pixels alterados no restante do passaporte**. Os PNGs nativos dos outros três templates continuam idênticos à baseline; seus renderizadores mantêm os mesmos hashes. As cópias dos dois originais também têm SHA-256 idêntico aos arquivos de Downloads.

**Os 39 testes de navegador passaram** em desktop, tablet e mobile emulados, com build de produção aprovado. Foram verificados HTTP 200 para ambos os PNGs locais, pixels vermelho/preto nas posições esperadas, ausência de erros de imagem/console, resolução 1080 × 1920 e download byte a byte idêntico à prévia. Upload, recorte e compartilhamento simulado continuaram passando. O PNG exportado e a captura mobile foram abertos e inspecionados. Não há pendência dos dois logos solicitados; as fotografias da galeria continuam dependendo da curadoria anterior, fora desta correção.

Os artefatos ficam em `test-artifacts/arirang-logos/`: `desktop-arirang.png`, `desktop-arirang-portrait.png`, equivalentes tablet/mobile e capturas `studio-arirang-desktop.png` / `studio-arirang-mobile.png`. `before.png` preserva o download anterior para comparação. Retratos coloridos são fixtures sintéticas de teste.

## Executar

```sh
npm.cmd run dev
# http://localhost:3000/army-pass
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run format:check
npm.cmd run test:browser
```

O teste de navegador constrói a produção e serve localmente na porta 3100, sem deploy. Tablet/mobile são emulados no Edge.
