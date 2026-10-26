# Retratos dos integrantes nos quizzes — fase 5.3

Alteração limitada à apresentação dos sete integrantes na seleção `/jogos/quiz`. O card BTS — OT7, a imagem original e o funcionamento dos jogos foram preservados.

## Curadoria e licença

Foram selecionados sete retratos individuais do mesmo ensaio da KOREA Dispatch em Los Angeles, novembro de 2017, disponibilizados no Wikimedia Commons sob **CC BY 3.0**. A descrição de cada arquivo identifica o integrante; os arquivos foram inspecionados individualmente antes e depois da conversão. Não há textos ou marcas d’água visíveis nos recortes selecionados. Não foram geradas imagens por IA nem removidas marcas.

As páginas registram revisão da licença original dos vídeos da Dispatch. Algumas também informam posterior mudança da licença na origem e a manutenção da licença Creative Commons já concedida. A evidência de cada arquivo está registrada em `docs/quiz-portrait-license-evidence.json`, com metadados, revisão permanente e URL original. Créditos, fonte, licença, mudanças, dimensões e hash dos arquivos publicados estão em `public/images/jogos/integrantes/credits.json`. A atribuição e os links de cada fonte aparecem na página, fora dos cartões, sem novos botões.

| Integrante | Arquivo local                                    | Fonte                                                                                                            |
| ---------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| RM         | `public/images/jogos/integrantes/rm.webp`        | [Dispatch LA (2)](<https://commons.wikimedia.org/wiki/File:1117_RM_(BTS)_Dispatch_Photo_Shoot_LA_(2).png>)       |
| Jin        | `public/images/jogos/integrantes/jin.webp`       | [Dispatch LA (2)](<https://commons.wikimedia.org/wiki/File:1117_Jin_(BTS)_Dispatch_Photo_Shoot_LA_(2).png>)      |
| SUGA       | `public/images/jogos/integrantes/suga.webp`      | [Dispatch LA (1)](<https://commons.wikimedia.org/wiki/File:1117_Suga_(BTS)_Dispatch_Photo_Shoot_LA_(1).png>)     |
| j-hope     | `public/images/jogos/integrantes/j-hope.webp`    | [Dispatch LA (2)](<https://commons.wikimedia.org/wiki/File:1117_J-Hope_(BTS)_Dispatch_Photo_Shoot_LA_(2).png>)   |
| Jimin      | `public/images/jogos/integrantes/jimin.webp`     | [Dispatch LA (2)](<https://commons.wikimedia.org/wiki/File:1117_Jimin_(BTS)_Dispatch_Photo_Shoot_LA_(2).png>)    |
| V          | `public/images/jogos/integrantes/v.webp`         | [Dispatch LA (2)](<https://commons.wikimedia.org/wiki/File:1117_V_(BTS)_Dispatch_Photo_Shoot_LA_(2).png>)        |
| Jung Kook  | `public/images/jogos/integrantes/jung-kook.webp` | [Dispatch LA (2)](<https://commons.wikimedia.org/wiki/File:1117_Jungkook_(BTS)_Dispatch_Photo_Shoot_LA_(2).png>) |

## Integração

Os arquivos foram recortados em **4:5**, priorizando a parte superior para preservar os rostos, e reduzidos a **320 × 400 pixels**, WebP com qualidade 90. Os sete arquivos somam aproximadamente 132 KiB. A exibição usa `next/image`, carregamento lazy e `sizes` de 80px no desktop/tablet e 64px no mobile.

As fotografias ficam à direita da composição tipográfica já existente. O posicionamento não participa do cálculo da altura: os sete cards mantêm suas dimensões anteriores, sem interferir na linha compartilhada com OT7. Os nomes, descrições, ação de começar e destinos permanecem os mesmos. Se uma fotografia falhar, volta o detalhe tipográfico anterior, com nome e clique preservados.

O ramo de renderização e as regras de estilo do OT7 não foram modificados. O caminho continua sendo `/images/army-pass/gallery/arirang/arirang-01.jpg`.

## Arquivos

Modificados:

- `src/features/bts-quiz/category-selection.tsx`: inclusão dos retratos somente nos cards individuais e atribuição das imagens.
- `src/features/bts-quiz/quiz.module.css`: estilos isolados dos retratos e créditos.
- `tests/browser/bts-quiz.spec.ts`: escopo da busca da imagem OT7, pois agora há oito imagens na seleção.

Criados:

- Os sete arquivos WebP e `credits.json` em `public/images/jogos/integrantes/`.
- `src/features/bts-quiz/member-portraits.ts`: acesso aos metadados por ID.
- `src/features/bts-quiz/member-portrait.tsx`: fotografia com fallback.
- `docs/quiz-portrait-license-evidence.json`: registros das licenças.
- `scripts/prepare-quiz-portraits.mjs`: pesquisa/download com verificação de licença e publicação após inspeção (`node --use-system-ca scripts/prepare-quiz-portraits.mjs --publish`).
- `scripts/verify-quiz-portrait-preservation.mjs`: comparação contra o baseline visual registrado antes da alteração, com servidor local na porta 3100.
- `tests/browser/quiz-portraits.spec.ts`: carregamento, proporções, dimensões, destinos e fallback.
- Este documento.

## Verificação de preservação

O script de comparação confirmou, em **1440, 768, 390 e 320 pixels**, que o OT7 mantém **os mesmos pixels, marcação, posição, largura e altura**. Também confirmou ausência de sobreposição entre retratos e nomes. Relatório local: `test-artifacts/quiz-portraits/preservation-report.json`; imagens `ot7-before-*.png` e `ot7-after-*.png` na mesma pasta.

SHA-256 confirmou que a fotografia OT7, as 80 perguntas, a lógica do quiz, a interface de partida/resultado e o motor compartilhado permanecem iguais. Nenhuma alteração em Emoji Challenge, História, Army Pass, Mural ou demais páginas.

Os sete arquivos finais foram verificados por formato real, dimensões, tamanho, licença registrada e hash. Capturas com os oito cartões: `test-artifacts/quiz-portraits-final-{desktop,tablet,mobile,small}.png`, inspecionadas visualmente.

Não há imagem pendente. Sem criação de branch, deploy ou instalação de dependências.

## Testes executados

- TypeScript (`npm.cmd run typecheck`): passou.
- ESLint (`npm.cmd run lint`): passou.
- Testes existentes (`npm.cmd test`): **68 passaram**.
- Build de produção, executado pelo servidor do Playwright antes dos testes: passou.
- Playwright dos quizzes, Emoji Challenge e retratos: **45 passaram** em desktop, tablet e mobile, incluindo navegação para os sete integrantes, partidas completas e fallback de imagem indisponível.
- Após simplificar o texto visível dos créditos, o build e os **seis testes de retratos** passaram novamente. Capturas finais: `test-artifacts/quiz-portraits-{desktop,tablet,mobile}.png`.
- Formatação dos arquivos da entrega: passou.
- Auditoria adicional: comparação pixel a pixel do OT7 em quatro larguras, hashes de preservação e integridade dos sete WebPs passaram.
