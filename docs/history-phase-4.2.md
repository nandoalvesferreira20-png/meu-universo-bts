# Fase 4.2 — Curadoria e integração de fotografias

## Resultado

Dez imagens locais reais integradas à timeline aprovada, para 2013–2019, 2021, 2024 e 2026. Todas foram verificadas quanto a data/contexto, resolução real, crédito, licença e composição. Os quatro anos restantes mantêm o bloco tipográfico existente. Nenhum texto histórico foi reescrito; o capítulo militar foi preservado integralmente.

## Pesquisa e licença

As páginas oficiais foram priorizadas para identificar as eras. Fotografias de MAP OF THE SOUL: 7 e Proof foram localizadas na discografia BIGHIT e no Weverse, mas não publicadas porque a disponibilidade pública não demonstra permissão de republicação.

A coleção efetiva usa arquivos do Wikimedia Commons com CC BY 3.0, CC BY 4.0 ou CC BY-SA 4.0. Para as imagens de fontes externas de 2013–2019, as páginas registram revisão da licença. Para 2021 e 2026, os próprios fotógrafos declararam a licença no Commons. A fonte de 2024 declara CC BY 3.0 para o quadro de vídeo. O manifesto preserva a revisão permanente de cada página, a origem primária, o autor e a licença. Os metadados originais da consulta foram guardados em `docs/history-photo-license-evidence.json`; não são renderizados como HTML.

As legendas distinguem encontros com fãs, imprensa, quadros reais de vídeo e fotografias de público. Elas não apresentam registros de imprensa como fotografias conceituais dos álbuns. O ensaio de 2017 tem apenas mês confirmado; não foi inventado um dia.

## Qualidade e preparação

- Arquivos em `public/images/historia/bts-ANO.webp`, com no máximo 1800 pixels de largura, sem aumento de resolução.
- As fotografias mantêm a proporção integral, rostos e marcas já presentes no arquivo recebido.
- 2024: original de 746 × 968; o download do original foi limitado pelo servidor. A versão oficial reduzida de 500 × 649 foi verificada visualmente e usada como retrato contido. É a exceção à preferência de 1400 pixels.
- 2026: original declarado de 3000 × 1689; versão obtida de 1920 × 1081; arquivo final de 1800 × 1013. Fotografia durante SWIM na turnê ARIRANG em Paris, com o grupo visto do público. A fonte sinaliza telas de fundo de minimis; mantivemos a composição integral.
- Uma candidata adicional de 2026 foi baixada para avaliação e descartada: `BTS COMEBACK LIVE ARIRANG (55160717867).jpg`, de Lee Jeong Woo / Ministry of Culture, Sports and Tourism. A foto mostra o local antes do show, sem o grupo. Ela permanece apenas nos artefatos privados de curadoria, sem arquivo público ou integração. Fonte: https://commons.wikimedia.org/wiki/File:BTS_COMEBACK_LIVE_ARIRANG_(55160717867).jpg

Os originais/renditions obtidos e as prévias de curadoria ficam em `test-artifacts/history-curation/`, ignorado pelo Git. Os dez WebP e as evidências de licença necessárias à entrega estão no projeto.

## Pendências objetivas

| Ano  | Candidata / necessidade                                               | O que falta                                                                                                                                                     |
| ---- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2020 | Foto conceitual oficial de MAP OF THE SOUL: 7                         | Permissão para a História, crédito fotográfico, arquivo e resolução verificados. A autorização específica dos Army Passes não foi ampliada.                     |
| 2022 | Proof — Concept Photo (Proof ver.), Weverse                           | Permissão de republicação, crédito e arquivo de qualidade. Não baixada.                                                                                         |
| 2023 | Jimin na SBS Radio, 31/03/2023; alternativa editorial de projeto solo | A candidata disponível tem 531 × 720 e não foi adotada. Aguardar arquivo de melhor qualidade, origem e licença auditadas. Não baixada.                          |
| 2025 | Reencontro OT7 / transmissão conjunta de julho                        | Arquivo da fonte original, crédito, resolução e autorização. A reportagem da AP comprova o contexto, mas não licencia suas fotografias. Nenhum arquivo baixado. |

URLs de cada candidata estão em `pendingHistoryPhotos`, separadas de `authorizedHistoryPhotos`. Campos desconhecidos permanecem `null`, inclusive datas de sessões não documentadas. Nenhuma candidata possui caminho de arquivo público.

## Integração e performance

`history-photograph.tsx` consulta o manifesto e usa Next Image com dimensões, `sizes`, carregamento lazy e texto alternativo. A moldura possui proporção reservada; `object-fit: contain` evita cortes do grupo e das marcas. Somente a imagem do ano ativo é montada. O restante da timeline permanece compacto e expansível. Créditos e licença ficam visíveis na legenda; detalhes de processamento e origem são expansíveis. Se a imagem falhar, o bloco tipográfico aprovado é restaurado.

Não há carregamento de imagens externas em runtime. Não foram adicionadas dependências. Sharp, já instalado pelo Next, foi usado exclusivamente na preparação local. Scripts de curadoria, preparação e escrita do manifesto estão em `scripts/curate-history-photos.mjs`, `scripts/prepare-history-photos.mjs` e `scripts/write-history-photo-manifest.mjs`. Não são executados no build nem fazem downloads automáticos na aplicação.

Army Pass, suas galerias, Mural, Supabase, jogos, homepage, navegação e estilos globais não foram modificados. Sem branch ou deploy.

## Validação executada

- TypeScript e ESLint aprovados; build de produção concluído pelo servidor Playwright.
- `npm test`: 54 testes aprovados, incluindo existência dos arquivos, WebP real, dimensões, proporção, tamanho, hash, licença por arquivo e exclusão de candidatas da publicação. Inclui as regressões locais de Army Pass e Mural.
- Playwright da História: 12 cenários aprovados em desktop, tablet e celular. A navegação percorre todos os anos e verifica as dez imagens carregadas, textos alternativos, créditos, links de licença e montagem de uma única fotografia por vez. Também cobre a narrativa militar, teclado, movimento reduzido, ausência de overflow, erros de execução e fallback quando o otimizador de imagem falha.
- Dados históricos e componente militar comparados por SHA-256 com o início desta fase: idênticos.
- Capturas da página: `test-artifacts/history-{desktop,tablet,mobile}.png`. Detalhes de enquadramento: `test-artifacts/history-photo-{2013,2024}-{desktop,tablet,mobile}.png`.

Não foi executado Lighthouse nem medição de Core Web Vitals em produção. As verificações de performance desta etapa cobrem dimensões reservadas, tamanho dos arquivos, carregamento lazy, montagem apenas do ano ativo e otimização via Next Image. A suíte completa de navegador dos outros módulos não foi repetida nesta fase; os arquivos desses módulos não foram alterados e seus testes locais passaram.
