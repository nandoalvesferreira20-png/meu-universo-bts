# História — capítulo especial 2022–2025

Alteração pontual na timeline aprovada, sem novos marcos anuais. O capítulo “A pausa que não foi um adeus” fica dentro da seção da timeline e começa recolhido. Links nos capítulos de 2022–2025 abrem os detalhes e levam à seção. Não há uma segunda navegação.

## Conteúdo e dados

`src/data/bts-history.ts` mantém a narrativa editorial (`reunionChapter`) e as sete trajetórias (`serviceRecords`), cada uma com datas ISO, tipo de serviço e fontes. O componente `reunion-chapter.tsx` apresenta quatro blocos e cartões em ordem de início. As conclusões ficam nos mesmos cartões, evitando cadastrar uma segunda coleção de marcos. Datas são formatadas com fuso UTC explícito, sem deslocamento para o dia anterior no Brasil.

- Junho de 2022: FESTA e prioridade aos projetos individuais, com continuidade do grupo.
- Outubro de 2022: anúncio posterior dos planos de serviço militar.
- Jin: 13/12/2022 → 12/06/2024.
- j-hope: 18/04/2023 → 17/10/2024.
- SUGA: 22/09/2023 → 21/06/2025, serviço social alternativo; data oficial de conclusão.
- RM e V: 11/12/2023 → 10/06/2025.
- Jimin e Jung Kook: 12/12/2023 → 11/06/2025.
- Preparação coletiva anunciada em julho de 2025; transição para ARIRANG em 2026, sem equiparar a dispensa a um show imediato.

## Pesquisa

Foram consultadas as três fontes indicadas no pedido: Yonhap (15/06/2022), Korea JoongAng Daily (15/06/2022) e Korea Herald (cronologia retrospectiva, artigo 10649541). A retrospectiva do Herald agrupa equivocadamente SUGA entre os alistamentos de dezembro de 2023; esse detalhe não foi reproduzido. Para as datas específicas, prevalecem as reportagens contemporâneas da Yonhap e AP. A matéria da AP sobre a conclusão distingue o encerramento das atividades presenciais da conclusão oficial de SUGA em 21/06/2025. As URLs estão nos dados, nas fontes dos cartões e na lista geral da página.

## Interface e fotos

Roxo, lavanda e variáveis existentes; CSS restrito ao módulo da história. Expansão nativa com `details`/`summary`, teclado, fontes por integrante e cartões verticais no celular. Nenhuma fotografia foi baixada ou incluída. `ServiceRecord.image` e a renderização condicional com Next Image estão preparados para futuros arquivos locais, com texto alternativo e dimensões explícitas, sem placeholders.

Army Pass, galerias, Mural, Supabase, jogos, homepage e identidade global não foram alterados. Sem dependências, branch ou deploy.

## Validação

TypeScript e ESLint aprovados; build de produção concluído pelo servidor de testes. A suíte local aprovou 52 testes, incluindo três novos testes das datas, ordem, serviço alternativo e preservação dos 14 anos. Nove cenários Playwright da história passaram em desktop, tablet e celular, incluindo teclado, expansão, sete cartões, datas ISO, ausência de duplicação anual, transição para ARIRANG, erros de execução e overflow horizontal.

Capturas do capítulo expandido: `test-artifacts/reunion-desktop.png`, `test-artifacts/reunion-tablet.png` e `test-artifacts/reunion-mobile.png`. O link global de pular conteúdo é ocultado somente durante a captura recortada para evitar artefatos de elementos fixos fora do recorte; o comportamento da página não é alterado.
