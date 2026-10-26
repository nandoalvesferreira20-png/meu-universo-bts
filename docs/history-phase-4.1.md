# Fase 4.1 — História do BTS

Escopo: somente `/historia`, componentes próprios, dados locais e testes de navegador. Cabeçalho e rodapé são herdados do layout existente. Nenhuma alteração no Army Pass, Mural, autenticação, Supabase ou dependências. Nenhuma branch ou publicação criada.

## Estrutura

- `src/app/historia/page.tsx`: metadados, hero tipográfico, Brasil, referências e encerramento.
- `src/data/bts-history.ts`: 14 capítulos tipados (2013–2026), com narrativa, acontecimentos, lançamento, música e URLs de referência.
- `src/features/history/history-timeline.tsx`: seleção anual, conteúdo expandido, referências de cada capítulo e anterior/próximo.
- `src/features/history/history.module.css`: estilos isolados, usando as variáveis do portal; desktop com navegação conectada, mobile com cartões verticais.
- `tests/browser/history.spec.ts`: todos os anos, expansão/recolhimento, teclado, URLs de fontes, CTA interno, movimento reduzido, overflow e erros de execução.

## Curadoria

Recorte até 26/10/2026. Pesquisa na discografia e perfil BIGHIT, BTS Japan Official, cronologia Yonhap, UNICEF, AP, Universal Music Canada, Korea Herald, KCON e Prefeitura de São Paulo. URLs ficam nos dados e na página. Datas de referência: estreia em 13/06/2013; shows em São Paulo em 25–26/05/2019; Jin em 12/06/2024; j-hope em 17/10/2024; RM/V em 10/06/2025; Jimin/Jung Kook em 11/06/2025; conclusão oficial de SUGA em 21/06/2025; ARIRANG lançado em 20/03/2026.

Textos originais em português. Leituras emocionais são identificadas como editoriais. Não se presume que datas de uma turnê anunciada correspondam a shows realizados.

## Imagens

Nenhuma fotografia usada ou baixada. A documentação das galerias registra autorização para Army Pass; não documenta extensão específica para esta página. A composição usa tipografia e sete linhas abstratas em CSS. Os assets existentes permanecem intactos.

## Manutenção

Corrigir capítulos e referências em `src/data/bts-history.ts`. Não há banco, serviço externo em runtime ou CMS. A consulta às fontes acontece apenas por links explícitos.

## Validação executada

- `npm run typecheck` e `npm run lint`: aprovados.
- `npm test`: 49 testes aprovados.
- `npm run test:browser`: build de produção e 63 testes aprovados, nos três tamanhos, incluindo Army Pass e Mural.
- Após o ajuste para montar somente o capítulo ativo, novo build e seis testes de história aprovados (desktop, tablet e mobile).
- Prettier nos arquivos desta fase: aprovado.
- Capturas iniciais revisadas visualmente em `test-artifacts/history-desktop-review.png` e `test-artifacts/history-mobile-review.png`; capturas dos testes em `test-artifacts/history-{desktop,tablet,mobile}.png`.

Links de referências foram consultados na pesquisa e os testes conferem seu formato HTTPS; não há monitoramento automatizado de disponibilidade dos sites externos. Os testes do Mural verificam o estado local sem Turnstile configurado, não uma publicação real em produção. Fotografias permanecem opcionais e dependem de autorização específica para esta página.
