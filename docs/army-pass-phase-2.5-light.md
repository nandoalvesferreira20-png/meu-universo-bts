# ARIRANG — revisão da Fase 2.5: referência clara

A imagem clara de 900 × 1600 enviada por último substitui a referência escura, conforme confirmação do usuário. Esta revisão prevalece sobre as posições e a paleta escura descritas no [relatório anterior](army-pass-phase-2.5.md). A coleção continua com um único template ARIRANG.

## Resultado

O passaporte usa papel marfim com grão, vermelho `#ED1235`, moldura externa chanfrada, janela horizontal com filetes sobrepostos, retrato circular à esquerda e sete cartões de dados com ícones à direita. A paisagem inferior é uma ilustração autoral de montanhas em lavagens, sol e névoa, gerada localmente. A imagem completa de referência não foi usada como fundo.

`arirang-renderer.ts` desenha as camadas na grade 900 × 1600 e escala para **1080 × 1920**. `arirangLayout` centraliza cartões e slots medidos. Opcionais vazios desaparecem, compactando a coluna; fotos e frase ficam fixas. Textos máximos quebram por grafema e reduzem a fonte sem reticências nem corte. Os rótulos foram traduzidos para português. A frase inglesa decorativa da referência foi substituída pela frase autoral expressamente pedida: **“Sete caminhos. Uma história que continua.”**

A galeria autorizada existente alimenta a janela `{x:47,y:423,width:809,height:380}`. O retrato local tem centro `(235,1007)`, raio 155 e recorte independente. Sem imagens, entram preenchimentos abstratos, sem câmera, watermark, exemplos ou textos de placeholder. Upload JPEG/PNG/WebP, validação binária, zoom, posição, substituição, remoção e descarte de URLs continuam no fluxo anterior, inteiramente no navegador.

Prévia, ampliação e PNG continuam usando o mesmo renderizador e preparação de imagens. Download e compartilhamento usam o arquivo pronto; não há novo formulário, persistência ou envio de fotos. Nenhuma outra página foi alterada nesta revisão. Não houve branch nova ou deploy.

## Logotipos e diferenças da referência

**A reprodução visual completa ainda depende dos originais autorizados ARIRANG e BTS.** O anexo contém o passaporte composto, não um asset separado com autorização documentada. As marcas não foram redesenhadas, recortadas da imagem, imitadas com fontes ou geradas por IA.

A identidade ARIRANG tem área reservada em pixels finais `{x:221,y:73,width:629,height:331}`. Quando o cadastro existente receber SVG/PNG autorizado, crédito, origem, referência de autorização e condições, `prepareEraLogo` e `containLogo` carregam o original e preservam sua proporção. O símbolo BTS tem posições próprias para cabeçalho e rodapé. As duas marcas circulares decorativas próximas do retrato também foram omitidas, pois pertencem à identidade ausente. O teste positivo usa somente um retângulo sintético, nunca publicado como marca.

A grande área vazia no topo é consequência dessa pendência, conforme o fallback permitido no pedido. A paisagem/papel são autorais e não reproduzem a textura de tinta exata do anexo. As fontes dos dados são locais, com variação possível entre sistemas; a tipografia do álbum não recebeu substituto. Mantiveram-se os créditos @MEUUNIVERSOBTS e a declaração de independência no portal.

O fundo escuro anterior e seu script foram preservados no repositório, sem continuar expostos como variante. A cópia anterior do renderizador está no artefato local ignorado `test-artifacts/phase-2.5-light/previous-dark-renderer.ts.txt`.

## Arquivos desta revisão

- `src/features/army-pass/arirang-renderer.ts`: nova composição clara, molduras, ícones, fotos, dados e marcas autorizadas.
- `src/features/army-pass/themes.ts`: descrição, vermelho e posição do asset ARIRANG.
- `src/features/army-pass/renderer.ts`: registro da janela da foto.
- `src/features/army-pass/export.ts`: carregamento da nova textura.
- `src/features/army-pass/army-pass.module.css`: miniatura clara exclusiva de ARIRANG.
- `public/images/army-pass/textures/arirang-light-paper.png`: papel e paisagem locais.
- `scripts/render-arirang-light-background.mjs`: geração determinística desse asset, sem entrada de imagem externa.
- `tests/arirang-pass.test.ts`: geometria, duas fotos, máximos, opcionais, cartões e autorização.
- `tests/army-pass.test.ts`: geometria, textura e integração de exportação atualizadas somente para ARIRANG.
- `tests/browser/army-pass.spec.ts`: amostra do novo retrato e pasta de capturas desta revisão.
- `README.md`, `public/images/README.md` e este relatório.

## Validação

Baseline anterior: 33 testes passaram antes de editar. Os PNGs nativos de WINGS, MAP OF THE SOUL: 7 e PERSONA foram copiados para `test-artifacts/phase-2.5-light/baseline-*.png` e comparados com os resultados posteriores: **bytes idênticos nos três**. Seus renderizadores não foram alterados.

Resultados finais: **34 testes de lógica/renderização e os 39 testes de navegador passaram**. Após o último ajuste tipográfico, os **9 testes específicos de ARIRANG** foram executados novamente e passaram em desktop, tablet e mobile. TypeScript strict, ESLint, formatação e build de produção também passaram. O navegador comparou cada download byte a byte com a prévia e validou upload, recorte, zoom, troca/remoção, preservação dos dados e compartilhamento simulado.

Foram abertos e inspecionados o PNG nativo, os downloads reais com/sem retrato sintético e a captura da página mobile. A revisão corrigiu a extensão da paisagem para mantê-la acima do rodapé e retirou um glifo decorativo sem suporte consistente. Fotografias e cartões permanecem dentro das molduras; a principal diferença visual continua sendo a ausência das marcas originais no cabeçalho, rodapé e laterais do retrato. A paisagem é uma aproximação ilustrada, documentada acima.

Artefatos desta revisão em `test-artifacts/phase-2.5-light/`: downloads reais `desktop-arirang.png`, `desktop-arirang-portrait.png`, equivalentes tablet/mobile, e capturas da página `studio-arirang-desktop.png` / `studio-arirang-mobile.png`. Os retratos coloridos são fixtures sintéticas de teste, não fotos de pessoas nem fotografias autorizadas do BTS. O PNG nativo de verificação é `test-artifacts/army-pass-arirang.png`.

## Executar

```sh
npm.cmd run dev
# http://localhost:3000/army-pass
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run format:check
npm.cmd run build
npm.cmd run test:browser
node scripts/render-arirang-light-background.mjs
```

Playwright constrói a produção e a serve na porta 3100, sem deploy. Tablet e celular são emulados no Edge; não houve teste em aparelhos físicos ou Safari/iOS.
