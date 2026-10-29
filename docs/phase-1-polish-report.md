# Fase 1 — correções e polimento

Implementação local em 29/10/2026. Sem branch, commit, push ou deploy.

## Alterações

| Arquivo                                                                                                  | Correção                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/features/army-pass/army-pass.module.css`                                                            | Quatro fundos dos cards passam a usar WebP de até 640 px de largura.                                                                                                                                                  |
| `public/images/army-pass/cards/{wings-smoke,map-atmosphere,persona-atmosphere,arirang-light-paper}.webp` | Quatro novos recursos exclusivos dos cards.                                                                                                                                                                           |
| `scripts/optimize-era-cards.mjs`                                                                         | Geração reproduzível usando o Sharp já instalado, sem adicionar dependências.                                                                                                                                         |
| `src/features/arirang-tour/event-carousel.tsx`                                                           | Overflow calculado pela largura total do contêiner e pelas miniaturas, independentemente das setas; observação do contêiner e da faixa com limpeza.                                                                   |
| `src/features/arirang-tour/seoul-event.module.css`                                                       | Créditos de 12 px, entrelinha 1,6, links com espaçamento e contador secundário em `#746963`. Contraste de 4,93:1 sobre `#f8f6f2`.                                                                                     |
| `src/features/history/history.module.css`                                                                | Créditos e detalhes de fontes das fotografias com 12 px e entrelinha 1,7; mais espaço nos links. Referências que já tinham 12–13 px foram preservadas.                                                                |
| `src/components/navigation-link.tsx`                                                                     | Componente cliente compartilhado com `usePathname`, correspondência de subrotas por segmento e `aria-current="page"`.                                                                                                 |
| `src/components/shell.tsx`                                                                               | Link ativo no cabeçalho e rodapé, mantendo o restante como componente servidor.                                                                                                                                       |
| `src/components/mobile-navigation.tsx`                                                                   | Link ativo no menu mobile, preservando fechamento e foco.                                                                                                                                                             |
| `src/app/globals.css`                                                                                    | Cards em coluna flexível, CTA no final e sublinhado discreto da navegação ativa.                                                                                                                                      |
| `src/app/page.tsx`                                                                                       | Emoji Challenge incluído na comunicação; descrição da galeria reflete a experiência atual; retirada a promessa de compartilhamento futuro. O antigo aviso de que apenas o Army Pass estava disponível já não existia. |
| `src/data/portal.ts`                                                                                     | Correção de “memãria” para “memória”.                                                                                                                                                                                 |
| `tests/browser/portal.spec.ts`                                                                           | 1920 px, alinhamento de CTAs e navegação ativa em subrota.                                                                                                                                                            |
| `tests/browser/arirang-world-gallery.spec.ts`                                                            | Redimensionamentos sucessivos 390 → 320 → 390 → 375 → 430 → 320 → 1440 → 390. Expectativa da etapa brasileira acompanha a data.                                                                                       |
| `tests/browser/arirang-tour-timeline.spec.ts`                                                            | Expectativas acompanham a data; antes exigiam que São Paulo continuasse futuro após o início das datas cadastradas. Nenhuma regra do produto foi alterada.                                                            |

`src/components/experience.tsx` já tinha estrutura adequada: bastou corrigir seu CSS. `src/app/sobre/page.tsx` já tinha descrição e créditos corretos e não foi alterado. A navegação já não continha o Mural.

## Imagens: tamanho dos arquivos

| Textura            | Original PNG (bytes) | Card WebP (bytes) |
| ------------------ | -------------------: | ----------------: |
| WINGS              |              780.788 |             9.956 |
| MAP OF THE SOUL: 7 |            2.126.422 |            12.620 |
| PERSONA            |            1.963.904 |             8.276 |
| ARIRANG            |            1.353.733 |            35.920 |
| **Total**          |        **6.224.847** |        **66.772** |

Redução dos recursos destinados aos cards: **98,93%**. Estes valores são tamanhos reais em disco, não pontuação Lighthouse nem medição de velocidade em conexão móvel.

O navegador confirmou o carregamento dos quatro WebP, com os mesmos tamanhos de corpo acima. A textura original WINGS de 780.788 bytes continua necessária para a prévia inicial. Portanto, a redução de 98,93% não representa a redução de todas as imagens transferidas pela página. As quatro texturas mais o recurso original necessário à prévia somam 847.560 bytes após a mudança, comparados aos 6.224.847 bytes das mesmas texturas antes (86,38% de redução neste conjunto, sem contabilizar fotografias ou logos).

Todos os PNG originais, fotografias, logos, renderizadores, enquadramentos e código de exportação foram preservados. A geração pode ser repetida com `node scripts/optimize-era-cards.mjs`.

## Verificações

- TypeScript: passou.
- ESLint: passou.
- Build de produção: passou.
- Testes técnicos existentes: **65 passaram**.
- Verificação adicional no Edge: nove páginas em 320, 375, 390, 430, 768, 1024, 1440 e 1920 px, sem overflow horizontal: `/`, `/army-pass`, `/jogos`, `/jogos/quiz`, `/jogos/quiz/rm`, `/jogos/emojis`, `/historia`, `/arirang-tour`, `/sobre`.
- CTAs alinhados entre cards da mesma linha nas oito larguras.
- Ciclos de redimensionamento Netflix e indicação de Jogos na subrota RM, desktop e mobile: passaram.
- Comparação de canvas antes/depois, 1080 × 1920: WINGS, PERSONA e ARIRANG idênticos; MAP com apenas 12 canais de cor diferentes em um nível de 255, sem diferença visual perceptível.
- Downloads efetivos dos quatro modelos passaram no desktop, com assinatura PNG, dimensões 1080 × 1920 e comparação com o canvas.
- Capturas antes/depois, PNGs e medições locais estão em `test-artifacts/phase1/`; downloads e relatório Playwright estão em `test-artifacts/` (artefatos ignorados pelo Git).

## Preservação e limites

Nenhuma mudança nos templates finais, fotografias, narrativas, serviço militar, jogos, quizzes, APIs, créditos institucionais ou regras de negócio. Sem novas rotas, integrações, dependências ou atalhos da turnê.

A primeira execução Playwright encontrou expectativas antigas de data em dois testes, corrigidas, e um timeout no teste de três exportações MAP. A suíte foi repetida com `npm.cmd run test:browser -- --workers=3 --timeout=120000`: **147 testes passaram, sem falhas**, cobrindo desktop, tablet e mobile. Inclui downloads reais dos quatro modelos, fotografias pessoais, recortes, troca de era, compartilhamento, cancelamento, jogos, quizzes, carrosséis, teclado, navegação, créditos e rotas retiradas.

Não permaneceram falhas técnicas conhecidas nos cenários verificados. O relatório não certifica todos os navegadores, todos os dispositivos ou a disponibilidade de sites externos. A formatação e `git diff --check` também passaram.

Links institucionais foram preservados. A disponibilidade de páginas externas de terceiros não foi certificada; recomenda-se uma revisão humana final das telas e créditos antes da publicação.
