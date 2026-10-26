# Validação — Fase 2

Executada em 24/10/2026.

Este é o registro da entrega inicial. A investigação posterior reproduziu uma falha de integração de CSS Modules que esses testes não detectavam. Consulte `docs/army-pass-css-fix.md` para a causa e a validação de navegador adicionada na correção.

## Automação executada

`npm test`: **13 testes passaram**, usando o runner do Node/tsx e Canvas nativo para rasterização. São testes de lógica e exportação, não uma simulação de testes em navegador real.

- Zod: valores válidos, limites máximos, campos opcionais, nome vazio, ano inválido/futuro e opções fora das listas.
- Estado: seleção das quatro eras, ida/volta nas etapas, alternância entre fontes, preservação de dados/foto/recorte e fallback de galeria ao mudar de era.
- Manifesto: vazio real, filtro por era e autorização, caminhos locais e rejeição de caminhos externos/inválidos. O teste usa uma entrada sintética de contrato; nenhuma foto dessa entrada é publicada.
- Arquivos: assinatura JPEG/PNG/WebP, limite de 10 MB, arquivo vazio, formato falso e imagem danificada.
- Recorte: fotos verticais, horizontais e quadradas, todas as molduras, zoom e posições extremas; proporção preservada e recorte dentro dos pixels disponíveis.
- Texto: palavras longas, acentos, emojis, coreano, limites simultâneos e muitas quebras de linha. Nenhum campo é truncado ou ultrapassa o rodapé nos casos testados.
- Artes e templates: 12 SVGs rasterizados, resultados distintos e quatro PNGs de amostra inspecionados visualmente. As amostras usam dados fictícios apenas para teste e ficam em `test-artifacts/`, ignorado pelo Git.
- Exportação: execução da função de produção com adaptador de APIs de navegador e Canvas nativo, leitura do cabeçalho dos arquivos PNG para confirmar **1080 × 1920**, nome/MIME e comparação binária com o desenho usado pela prévia no mesmo ambiente. Alterar recorte muda a saída.
- Privacidade: os recursos requisitados no teste de exportação são apenas SVGs data URL e fotos blob locais; revisão do código não encontrou envio de foto, analytics, storage persistente ou inclusão de dados em URLs.
- Recursos: bitmap fechado, processamento local, sessão revogando fotos antigas/removidas e ignorando leituras atrasadas; revogação da URL de download após início.
- Compartilhamento: detecção de suporte, ausência de suporte e API que lança erro; download com nome correto e liberação da URL. A interface nativa de compartilhamento não foi acionada neste ambiente.

ESLint, TypeScript strict, formatação e build de produção passaram. O build foi servido localmente: as 17 rotas públicas responderam 200, e o HTML do Army Pass apresentou as eras, o Canvas 1080 × 1920 e 11 assets estáticos acessíveis. Isso verifica entrega HTTP, sem comprovar hidratação ou interação em navegador.

A primeira execução do runner em sandbox foi impedida por `spawn EPERM`; a execução autorizada fora dessa restrição passou. Os testes não fazem parte do bundle do gerador; as dependências de Canvas/tsx são usadas apenas no desenvolvimento.

## Verificação em navegador pendente

O inventário de navegadores/apps conectados estava vazio. Portanto não foram executados testes de clique, teclado, leitor de tela, responsividade ou medição de overflow no navegador. Não se declara essa etapa aprovada.

Checklist antes de publicar:

1. Em desktop e larguras de 320, 375, 768 e 1440 px, percorrer as quatro etapas com cada era. Conferir a prévia lateral, o atalho de prévia no celular e ausência de overflow horizontal.
2. Navegar por Tab/setas/Enter: eras, formulário, origens, artes, upload, controles de recorte, botões e retorno de foco ao mudar de etapa. Conferir leitores de tela e foco após erro.
3. Escolher todos os tipos de arte; trocar de era/fonte e voltar sem perder os dados. Testar todos os limites de texto e caracteres disponíveis nas fontes locais.
4. Selecionar JPEG com orientações EXIF diferentes, PNG transparente e WebP no Safari/iOS, Chrome/Android e desktop. Testar troca, remoção, arquivo inválido, arquivo acima de 10 MB, foto acima de 40 MP e duas escolhas rápidas seguidas.
5. Quando fotos autorizadas forem adicionadas, conferir arquivos reais, miniaturas, ampliação, créditos no PNG, erros de arquivo ausente e fallback ao trocar de era. A galeria vazia atual deve continuar clara e navegável.
6. Comparar o PNG salvo com a prévia em cada tema, inclusive foto pessoal, zoom/posição, imagem transparente e texto longo. Conferir 1080 × 1920 no arquivo salvo em dispositivos reais.
7. Em contexto seguro, testar Web Share com arquivos, cancelamento, falha e navegador sem suporte. Confirmar download/salvamento no iOS. Nenhum fluxo deve prometer publicação direta no Instagram.
8. Inspecionar rede e armazenamento do navegador durante o processo: nenhum arquivo pessoal deve sair do dispositivo ou ser persistido. Conferir liberação de recursos ao substituir/remover/sair.

Os testes automatizados verificam matemática de recorte, lógica de recursos e parâmetros EXIF; não substituem decodificação EXIF, permissões de compartilhamento e comportamento de memória em aparelhos reais.
