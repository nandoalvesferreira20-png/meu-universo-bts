# Army Pass Studio — Fase 2.1

## Diagnóstico e direção

A correção anterior já havia restabelecido CSS Modules, fluxo e exportação. A revisão visual encontrou uma experiência ainda dominada pelo formulário, cards de era com a mesma apresentação escura, pouca hierarquia entre identidade e dados e áreas inferiores muito semelhantes nos passaportes. A prévia não tinha uma opção de leitura ampliada.

O redesign mantém o estado em reducer, o formulário Zod, `PhotoSession`, validação e processamento de fotos, três fontes de imagem, quatro etapas e o renderizador Canvas compartilhado. O trabalho ficou restrito ao Army Pass; não houve nova branch, deploy ou desenvolvimento de outras experiências.

## Composições

| Era             | Resultado visual                                                                                                                                          |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WINGS           | Campo escuro, moldura fina, assinatura serifada, recorte superior em arco e linhas douradas. Fotografia/arte ocupa quase toda a largura.                  |
| MAP OF THE SOUL | Título expressivo em duas linhas, janela com cantos assimétricos, curvas suaves e plano lilás para a área pessoal.                                        |
| BE              | Papel creme, serifas delicadas, imagem com margem de impressão, inclinação leve e sombra de papel. O recorte é calculado antes da rotação, sem distorção. |
| ARIRANG         | Cabeçalho claro, título editorial em vinho, janela ampla e composição de contraste com painel claro para os dados.                                        |

As 12 artes permanecem disponíveis, com refinamentos de margem, linhas de impressão e identificação de estudo autoral. Não foram substituídas por imagens externas ou por imitações de material oficial.

O nome tem prioridade após a imagem; a localização e os dados opcionais seguem uma hierarquia editorial. A imagem cresce quando cidade/estado, música, experiência ou mensagem estão ausentes, aproveitando o espaço disponível sem criar rótulos vazios. Ano compartilha a linha com bias quando informado. Textos longos continuam medidos por grafema e ajustados para caber.

## Interface

- Introdução própria “Army Pass Studio”, com tipografia editorial e texto curto.
- Editor em superfície clara e prévia em uma base na cor da era. Desktop com duas colunas; tablet/mobile com uma coluna e prévia primeiro na etapa “Visualize”.
- Cards de era com estudo visual em miniatura, nome, descrição, amostras da paleta e seleção acessível por radio/teclado. A troca preserva os dados e a foto pessoal.
- Formulário com labels acima dos campos, espaçamento consistente, foco e erro visíveis; controles de pelo menos 49 px, com tipografia de 16 px no celular.
- Três origens com cards refinados; miniaturas alinhadas, editor de enquadramento e upload em composição mais clara.
- Ampliação da prévia em diálogo nativo, Escape e retorno de foco. A ampliação não muda o PNG nem mantém um segundo Canvas ativo quando fechada.
- Interações discretas de seleção/hover e entrada, respeitando movimento reduzido. Feedbacks reais de processamento, falha, download e compartilhamento preservados.

## Prévia, exportação e logos

`drawArmyPass` segue como único desenho da prévia e do arquivo 1080 × 1920. Fotos, recorte, geometria adaptativa, tipografia e decoração usam o mesmo caminho de renderização. Fontes e imagens são aguardadas. Controles da interface ficam fora do PNG.

A pesquisa das identidades foi feita nas páginas oficiais. Nenhuma autorização de reutilização foi confirmada; todos os logos oficiais permanecem pendentes e nenhum foi incorporado. As referências de WINGS, PERSONA/7, BE e ARIRANG, os créditos a confirmar e as instruções para futuros arquivos autorizados estão em [era-logo-research.md](era-logo-research.md).

O objeto `logo` em cada tema centraliza caminho, crédito, fonte, status e área recomendada. Arquivos autorizados podem usar PNG ou SVG local com proporção preservada; falta ou erro usa a assinatura tipográfica. O teste de integração positivo usa arte sintética de teste, sem materiais oficiais. O aviso de projeto independente permanece no produto.

## Arquivos desta fase

- `src/app/army-pass/page.tsx`: introdução do Studio.
- `src/features/army-pass/army-pass.module.css`: design responsivo isolado, estados e microinterações.
- `src/features/army-pass/era-selector.tsx`: cards de coleção e paletas.
- `src/features/army-pass/army-pass-builder.tsx`: apresentação e breakpoint da prévia; lógica do fluxo preservada.
- `src/features/army-pass/army-pass-preview.tsx`: base temática, metadados e ampliação acessível.
- `src/features/army-pass/renderer.ts`: quatro composições, enquadramento adaptativo e desenho opcional de logo autorizado.
- `src/features/army-pass/artwork.ts`: refinamento das 12 artes autorais.
- `src/features/army-pass/types.ts`, `themes.ts`, `era-logos.ts`: configuração e controle de autorização de assets.
- `src/features/army-pass/export.ts`: prepara também o logo autorizado, quando existir, para o renderizador compartilhado.
- `tests/era-logos.test.ts`: origem/autorização, proporção, erro/ausência e integração com desenho.
- `tests/browser/army-pass.spec.ts`, `playwright.config.ts`: tablet, prévia ampliada, foco, movimento reduzido e compartilhamento simulado, além da regressão existente.
- `public/images/army-pass/logos/.gitkeep`, `README.md`: diretório preparado sem logos fictícios.
- README e documentação da fase/pesquisa.

## Verificações executadas

- **16 testes de lógica/renderização passaram**, incluindo os 13 anteriores e três novos de logos.
- **24 testes Playwright passaram**, oito por viewport: desktop 1440 × 900, tablet 768 × 1024 e mobile 390 × 844.
- **TypeScript strict, ESLint e build de produção passaram.** O Playwright construiu e serviu o build antes dos testes.
- Todos os quatro templates e as 12 opções de arte foram exercitados. Downloads reais de todas as eras e de foto pessoal tiveram PNG 1080 × 1920 e os mesmos bytes do Canvas de prévia no navegador.
- Upload, assinatura de arquivo, recorte, zoom por teclado, posição, troca, remoção, preservação entre etapas/eras e ausência de envio/persistência da foto foram verificados.
- Prévia ampliada, Escape, retorno de foco, movimento reduzido, validação, galeria vazia, arquivo inválido e ausência de overflow/sobreposição entre os campos passaram.
- As bordas dos campos são verificadas no navegador com contraste mínimo de 3:1; o par normal tem 3,14:1. Os pares principais de texto das paletas foram calculados: WINGS 13,92:1, MAP OF THE SOUL 11,56:1, BE 11,82:1 e ARIRANG 14,50:1. Texto secundário da interface sobre a base do Studio: 5,16:1. Esses cálculos não substituem auditoria completa de acessibilidade.
- Não foram encontrados erros de console, JavaScript ou hidratação nos cenários testados.
- O teste de compartilhamento usa uma implementação simulada da Web Share API, confirma que recebe o PNG pronto e trata cancelamento. Não publica em aplicativos externos.

A revisão visual incluiu os quatro PNGs, a prancha comparativa, os seletores de eras e o formulário em desktop/tablet/mobile. As capturas de produção aguardam o término da renderização; não são apenas testes de HTTP ou de componentes isolados.

## Artefatos locais

Em `test-artifacts/phase-2.1/` (ignorado pelo Git):

- `collection.png`: prancha comparativa dos quatro PNGs reais baixados pelo navegador, reduzidos apenas para comparação.
- `pass-wings.png`, `pass-map-of-the-soul.png`, `pass-be.png`, `pass-arirang.png`: arquivos completos 1080 × 1920.
- `before-*.png`: baseline anterior preservado.
- `eras-desktop.png`, `eras-tablet.png`, `eras-mobile.png`: seleção das eras no build de produção.
- `studio-desktop.png`, `studio-tablet.png`, `studio-mobile.png`: formulário preenchido nos três tamanhos.

Os dados são fictícios de teste. Nenhuma foto de pessoa real foi baixada ou incluída para montar a apresentação. Relatório Playwright: `test-artifacts/playwright-report/index.html`.

## Limites

Logos oficiais e fotografias da galeria dependem de arquivos e permissões reais. O compartilhamento nativo do sistema/aplicativos, Safari/iOS, dispositivos físicos e uma auditoria com leitores de tela seguem pendentes. Tablet/mobile foram emulados no Edge, não em dispositivos físicos. A tipografia e o suporte a caracteres dependem das fontes do sistema, mantendo igualdade entre prévia e PNG no mesmo dispositivo.

## Executar

```sh
npm install
npm run dev
# http://localhost:3000/army-pass

npm test
npm run lint
npm run typecheck
npm run format:check
npm run build
npm run test:browser
```

No PowerShell com restrição de scripts, usar `npm.cmd`. O teste de navegador usa a porta 3100 livre e Edge instalado no Windows; em outros ambientes, instalar Chromium do Playwright quando necessário. Não faz deploy.
