# Army Pass — Fase 2.5: ARIRANG

## Resultado e pendência principal

O ARIRANG foi integrado como a quarta composição exclusiva da coleção, reconstruída a partir de `Passe ARMY Brasil ARIRANG em Estilo Editorial.png`. A imagem completa não foi usada como fundo nem recortada para obter fotografias, símbolos ou informações editáveis.

**A identidade original do álbum continua pendente.** O pedido menciona um segundo arquivo, com os três símbolos circulares e a escrita ARIRANG, mas somente o passaporte completo estava anexado/localizável. Não há SVG/PNG separado autorizado no projeto. Foi solicitado o caminho local e a autorização do original. A área foi preparada e permanece sem substituto: não foram desenhados os três símbolos, aplicada uma fonte aproximada ao wordmark ou extraído um logo da referência. Essa pendência impede afirmar que a reprodução visual está completa.

O símbolo BTS também continua aguardando arquivo autêntico autorizado. A implementação funciona e exporta sem essas imagens, conforme o fallback permitido no pedido. A ausência é informada no editor e na documentação, não por um texto de placeholder dentro do PNG.

## Preservação do sistema

Antes das alterações foram lidos README, documentação da fase anterior, guia local do Next.js e módulos de estado, personalização, fotos, prévia, autorização e exportação. A baseline passou em **28 testes**.

O gerador não foi recriado. Foram preservados formulário/Zod, reducer, `PhotoSession`, processamento local, recortes, zoom, etapas, ampliação, download e compartilhamento. `drawArmyPass` encaminha ARIRANG ao novo `drawArirangPass`; a resolução continua **1080 × 1920**.

WINGS, MAP OF THE SOUL: 7 e PERSONA não tiveram seus renderizadores alterados. A coleção pública continua exatamente WINGS, MAP OF THE SOUL: 7, MAP OF THE SOUL: PERSONA e ARIRANG. BE permanece oculto, preservado internamente; os arquivos legados não foram apagados. Não houve nova branch, deploy, alteração de outras páginas ou início de outra fase.

## Composição em camadas

O desenho usa a grade da referência, **941 × 1672**, escalada no Canvas final:

1. Papel escuro, carvão e marfim, com grão local e pinceladas vermelhas.
2. Paisagem estilizada em planos, sol vermelho, arquitetura autoral de beirais/colunas, vegetação e ramos florais.
3. Cabeçalho ARMY PASS BRASIL, área reservada do logo, coluna BR / 04 e detalhes editoriais da referência.
4. Moldura horizontal fina para o grupo.
5. Retrato circular com anéis vermelho/preto/marfim e medalhão claro.
6. Dados reais na coluna direita, mensagem própria e frase autoral preservada.
7. Painéis inferiores, linhas finas, detalhes de nuvens de contorno e assinatura @MEUUNIVERSOBTS.

`arirang-paper.svg` é uma atmosfera autoral separada: papel, paisagem e pinceladas, sem texto, retratos ou logotipos. O script `node scripts/render-arirang-background.mjs` rasteriza esse SVG e acrescenta marcas determinísticas de pincel seco ao PNG local. Não lê a referência. A arquitetura, vegetação, flores, molduras, textos e fotografias são camadas independentes do renderizador.

O vermelho decorativo foi ajustado visualmente para `#DE202A`, próximo da referência, enquanto o original autorizado não está disponível. Um futuro logo será exibido com suas próprias cores, sem recoloração ou efeitos. A ilustração contém **um sol paisagístico** atrás do telhado; ele não representa os três símbolos da identidade do álbum.

Os primeiros PNGs foram abertos e revisados. A revisão reduziu uma textura repetitiva, refinou as montanhas e vegetação, escureceu a arquitetura e tornou opaco o preenchimento abstrato da janela principal, impedindo que a arquitetura de fundo invadisse o espaço da foto.

## Identidade original e integração preparada

`eraThemes.arirang.logo` reserva a área `{x:237, y:133, width:310, height:180}` em pixels finais, equivalente ao cabeçalho da referência. `prepareEraLogo` carrega somente um arquivo autorizado; `containLogo` preserva a proporção. Falha/ausência não interrompe o PNG, mas mantém essa área sem wordmark substituto.

Para integrar o original:

1. Receber SVG ou PNG autêntico, com autorização, crédito, fonte e condições de uso.
2. Adicionar o arquivo em `public/images/army-pass/logos/`.
3. Preencher `path`, `status: "authorized"`, `credit`, `source`, `authorizationReference` e `usageConditions` em `eraThemes.arirang.logo`.
4. Conferir o PNG e a prévia com a imagem real. Não aplicar estiramento, recriação tipográfica, redesenho dos círculos ou recoloração.

BTS usa o cadastro existente `btsLogo`, com posições específicas `arirangBtsPlacement` e `arirangBadgePlacement`; o posicionamento dos templates aprovados permanece intacto. No medalhão pendente aparece apenas BR, como identificação do projeto, sem imitação do símbolo BTS. O aviso de projeto independente permanece no site.

O teste positivo usa um retângulo sintético exclusivo do ambiente de teste, não uma identidade oficial fictícia publicada.

## Fotografias independentes

- **Grupo:** janela `{x:94, y:481, width:746, height:422}` na grade da referência, com cover proporcional, clip retangular e molduras sobrepostas. Galeria, autorização e `galleryCrop` são reutilizados. Sem foto aprovada, a janela usa preenchimento abstrato escuro, sem exemplos ou placeholders.
- **ARMY:** cover quadrado de 344 × 344, centro `(288,1072)` e clip circular de raio 172. O retrato usa `photo`/`personalCrop`, separado da galeria. Anéis e medalhão são desenhados depois da fotografia.

JPEG/PNG/WebP, assinatura binária, 10 MB/40 MP, orientação EXIF, normalização, substituição, remoção e descarte de URLs continuam no código existente. Não há envio a servidor, persistência ou conta. Trocar etapas/era conserva dados e retrato. Não houve scraping nem download de fotografias do BTS; a galeria real continua vazia até receber arquivos autorizados.

## Dados dinâmicos e frase

`arirangLayout` centraliza os slots. Nome inicia em `(507,947)` e cidade/UF em `(533,1005)`. Com todos os dados preenchidos, bias/ano começam na linha 1083, música na 1179 e experiência na 1268. Cidade, ano, música, experiência e mensagem vazios não imprimem exemplos.

As linhas opcionais ausentes deixam de reservar espaço e a coluna se compacta, mantendo as fotografias fixas. Textos usam `drawFittedText`: medição com a fonte disponível, quebra por grafema e redução controlada, sem truncamento. Quebras manuais excessivas são normalizadas. Valores extremos podem exigir fonte menor.

A mensagem pessoal ocupa um slot próprio, com seu rótulo. **“Sete caminhos. Uma história que continua.”** permanece como frase editorial em todos os estados, mesmo quando há mensagem. Com mensagem, a frase fica abaixo dela em tamanho controlado; sem mensagem, ganha área e corpo maiores. Os testes verificam que os dois slots não se sobrepõem e terminam antes do rodapé.

Não foram inseridos automaticamente FERNANDO, SWIM, um encontro futuro ou país nos dados. O texto editorial de álbum/ano segue o conteúdo da referência fornecida, sem pesquisa ou acréscimo de afirmações externas.

## Prévia, PNG e compartilhamento

Prévia, ampliação e exportação usam `preparePassImage` e `drawArmyPass`. Fontes, textura, fotografias e marcas autorizadas são aguardadas antes do desenho. O arquivo é **`army-pass-arirang.png`, 1080 × 1920**, sem controles de edição.

Download e Web Share API permanecem os existentes. O compartilhamento recebe o arquivo pronto após clique e detecção de suporte; cancelamento conserva o PNG. Não há publicação automática em aplicativos externos.

## Arquivos desta fase

- `src/features/army-pass/arirang-renderer.ts`: composição, ilustrações, fotos, marca autorizada, slots e frase.
- `public/images/army-pass/textures/arirang-paper.svg`, `arirang-paper.png`: textura e paisagem separadas.
- `scripts/render-arirang-background.mjs`: rasterização e pincel seco determinístico.
- `renderer.ts`, `export.ts`: encaminhamento, moldura registrada, textura e marca BTS para ARIRANG.
- `themes.ts`: paleta, descrição e área do logotipo ARIRANG.
- `era-selector.tsx`, `army-pass.module.css`: card editorial e estado honesto de logo pendente.
- `photo-source-selector.tsx`: descrição das duas fotos e pendência explícita dos símbolos.
- `tests/arirang-pass.test.ts`: fotografias, limites, opcionais, frase e uso exclusivo de logo autorizado.
- `tests/army-pass.test.ts`, `tests/browser/army-pass.spec.ts`: integração/exportação com duas imagens, upload e compartilhamento ARIRANG, regressões e capturas.
- README, guia de imagens e esta documentação.

## Diferenças e limitações

- **Logo ARIRANG:** bloqueado pela ausência do segundo arquivo autêntico e autorização. Área reservada sem substituto; não se afirma reprodução completa da identidade.
- **BTS e fotos:** aguardam originais autorizados. As fotos de exemplo do anexo não foram incorporadas.
- **Arquitetura, paisagem, flores e papel:** reconstruções gráficas autorais, com aparência ilustrada, não as fotografias/texturas exatas da referência. Para aproximar o acabamento fotográfico, são necessários os respectivos assets separados com direitos de uso.
- **Selo da referência:** não foi inventado um selo ou glifo cultural; foram usados somente detalhes lineares vermelhos naquela área.
- **Fontes:** Segoe UI/Segoe Script e fallbacks locais para dados/frase. A fonte do álbum não é substituída. Fontes/glifos podem variar entre sistemas, mantendo prévia/PNG iguais no mesmo ambiente.
- **Mensagem:** recebe espaço próprio e reduz a área da frase quando preenchida; isso adapta a composição ao campo obrigatório no sistema, ausente como bloco separado no exemplo.
- **Validação:** mobile/tablet emulados no Edge. Safari/iOS, dispositivos físicos, leitores de tela e compartilhamento em aplicativos do sistema não foram auditados.

## Comandos e validação

Resultado final: **33 testes de lógica/renderização e 39 testes Playwright passaram**, além de TypeScript strict, ESLint, formatação e build de produção. Foram abertos e inspecionados o PNG real com retrato sintético e as capturas desktop/mobile após a revisão visual.

```sh
npm install
npm run dev
# http://localhost:3000/army-pass
npm test
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run test:browser
```

No PowerShell com restrição de scripts, usar `npm.cmd`. O Playwright constrói e serve a produção na porta 3100; não faz deploy. A textura pode ser regenerada com `node scripts/render-arirang-background.mjs`.

A baseline dos três templates aprovados foi guardada em `test-artifacts/phase-2.5/baseline-*.png`. A comparação nativa após a integração encontrou os mesmos bytes em WINGS, MAP OF THE SOUL: 7 e PERSONA. Seus três módulos também mantiveram os mesmos hashes.

Entre os downloads desktop de execuções diferentes, WINGS e PERSONA ficaram exatos; MAP OF THE SOUL: 7 variou em 8 pixels, no máximo 1/255 em um canal, consistente com arredondamento Chromium. Dentro da execução, todos os arquivos baixados permaneceram byte a byte iguais às respectivas prévias.

Os testes cobrem quatro eras públicas sem BE/variantes, duas fotos, cover, círculo, texto máximo/vazio, frase e mensagem separadas, marcas bloqueadas sem autorização e integração positiva sintética, upload/zoom/posição/troca/remoção, dados preservados, privacidade, download e compartilhamento simulado. O download é comparado **byte a byte** ao Canvas da prévia. O teste de amostra entre redesenhos usa uma cópia PNG e admite até 1/255 por canal nos gradientes Chromium, sem relaxar a comparação do arquivo baixado.

Artefatos locais em `test-artifacts/phase-2.5/` (ignorados pelo Git):

- `desktop-arirang.png`: download real com dados preenchidos e sem fotos não autorizadas.
- `desktop-arirang-portrait.png`: download com retrato sintético de teste.
- `mobile-arirang.png`, `mobile-arirang-portrait.png`: arquivos da viewport mobile.
- `studio-arirang-desktop.png`, `studio-arirang-mobile.png`, versão tablet: página real preenchida.
- PNGs de WINGS, MAP OF THE SOUL: 7 e PERSONA para regressão.
- Relatório em `test-artifacts/playwright-report/index.html`.
