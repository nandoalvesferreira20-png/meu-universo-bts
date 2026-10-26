# Fase 4.3 — Refinamento visual da História do BTS

Alteração incremental de apresentação, sem novos recursos, conteúdo ou fotografias.

## Diagnóstico

A composição anterior colocava a fotografia antes do texto e usava toda a largura do cartão — cerca de 935 px no desktop de 1440 px. A moldura de 16:10 e a exceção vertical de até 420 px produziam cartões altos. Legendas e introdução tinham seus próprios paddings extensos. O capítulo militar usava sete caixas com padding de 22 px e datas empilhadas.

## Refinamentos

- Desktop: introdução à esquerda e fotografia de 280 × 210 px à direita, em moldura 4:3. Em larguras intermediárias, a composição passa a uma coluna.
- Mobile: ano, era e resumo precedem a fotografia, limitada a 240 × 180 px. O enquadramento `contain` mantém a imagem integral, incluindo integrantes e marcas existentes.
- Marcador cronológico em tipografia serifada já existente, era com maior destaque e título narrativo secundário. Resumos com entrelinha confortável; narrativa expandida com largura de leitura limitada.
- Espaçamento de 20–28 px, bordas discretas, superfícies neutras e ausência de sombras novas. Créditos, licenças e detalhes permanecem disponíveis junto da fotografia.
- Navegação anual preservada, com indicadores menores e destaque do ano ativo. A lista fica fixa durante a leitura apenas em viewports que comportam sua altura. O mobile mantém os cartões verticais expansíveis.
- Capítulo militar: duas colunas no desktop e lista vertical no celular, com divisórias discretas em vez de caixas grandes. Datas de início e conclusão ficam lado a lado. Textos, sete integrantes, serviço alternativo, fontes e datas permanecem intactos.
- `sizes` do Next Image corresponde às novas dimensões de exibição; nenhum arquivo de fotografia foi reprocessado.

## Arquivos desta fase

- `src/features/history/history-timeline.tsx`: reorganização da introdução e do apoio visual.
- `src/features/history/history-photograph.tsx`: moldura e indicação de tamanho de exibição.
- `src/features/history/history.module.css`: layout responsivo, tipografia, navegação e compactação do capítulo militar.
- `tests/browser/history.spec.ts`: verificações de tamanho máximo, proporção 4:3, `contain` e altura compacta dos registros militares, além das interações já existentes.
- Este documento.

## Preservação

Os dados históricos, o manifesto das fotografias, o componente do capítulo militar, a página da rota e os dez WebP foram comparados por SHA-256 com o início da tarefa: todos idênticos. Army Pass, galerias, Mural, Supabase, jogos, homepage, navegação e estilos globais não foram alterados. Nenhuma dependência, branch ou publicação adicionada.

As capturas anteriores foram preservadas em `test-artifacts/phase-4.3-before/`. As capturas atuais da timeline e do capítulo militar são geradas pelos testes de navegador em `test-artifacts/`.
