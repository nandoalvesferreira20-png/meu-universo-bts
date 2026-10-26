# Emoji Challenge — fase 5.1

Implementado em `/jogos/emojis`, com acesso já existente na Central de Jogos. Interface local em React, CSS Module com as variáveis visuais do portal, ícones Lucide e fontes existentes. Nenhuma dependência adicionada. Sem backend, persistência, login, cronômetro ou analytics.

## Arquivos e componentes

- `src/app/jogos/emojis/page.tsx`: metadados e configuração opcional da URL pública.
- `src/app/jogos/emojis/loading.tsx`: estado de carregamento da rota.
- `src/app/jogos/page.tsx`: apresentação do jogo disponível.
- `src/features/emoji-challenge/types.ts`: tipos de perguntas, opções, dificuldade e partida.
- `src/features/emoji-challenge/questions.ts`: 30 perguntas, catálogo com IDs estáveis, descrições acessíveis, explicações, pistas opcionais e fontes.
- `src/features/emoji-challenge/game.ts`: validação, Fisher–Yates, seleção, resposta única, progressão, pontuação, classificação e compartilhamento.
- `src/features/emoji-challenge/emoji-challenge.tsx`: `DifficultySelection`, `QuestionScreen`, `ResultScreen` e controlador `EmojiChallenge`.
- `src/features/emoji-challenge/emoji-challenge.module.css`: estilos isolados e responsivos.
- `tests/emoji-challenge.test.ts` e `tests/browser/emoji-challenge.spec.ts`: regras e fluxos de navegador.

## Regras

Fácil, Médio e Difícil possuem dez músicas cada. Uma partida embaralha perguntas e alternativas e seleciona dez itens; o banco pode crescer sem alterar a progressão. A resposta correta é um ID de música, independente de posição. Uma resposta válida é registrada uma única vez para o ID da pergunta atual. Uma questão respondida libera avanço; a décima leva ao resultado. A pontuação deriva das respostas: dez pontos por acerto, de zero a cem. Reiniciar mantém o nível e limpa respostas; trocar nível volta à seleção. Não se promete conteúdo inédito ao reiniciar.

O banco é validado antes de começar. IDs e alternativas duplicados, resposta ausente, conteúdo incompleto, dificuldade inválida, fonte inválida ou menos de dez perguntas em algum nível impedem iniciar. A interface apresenta mensagem de indisponibilidade.

Compartilhamento usa Web Share API; indisponibilidade ou falha oferece clipboard, e falha também no clipboard oferece texto selecionável. Cancelar o compartilhamento preserva a tela e a pontuação. O texto não inclui respostas. `NEXT_PUBLIC_SITE_URL` é opcional: somente uma URL HTTPS válida e não local adiciona o caminho `/jogos/emojis`. Nenhum endpoint do projeto recebe o resultado. O sistema nativo de compartilhamento é acionado somente pelo botão.

## Curadoria e fontes

Consulta editorial em 26/10/2026 às páginas oficiais da BIGHIT MUSIC. Títulos, participação no catálogo do BTS e edições foram conferidos nas listas de faixas e apresentações oficiais; os emojis são associações editoriais, sem alegação de significado oficial e sem reprodução de letras.

| Fonte oficial                                                                                                    | Respostas conferidas                                                        |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Butter — CD single](https://bts.ibighit.com/eng/discography/detail/butter-2.html)                               | Butter; Permission to Dance                                                 |
| [BE](https://bts.ibighit.com/eng/discography/detail/be.html)                                                     | Dynamite; Life Goes On                                                      |
| [Young Forever](https://bts.ibighit.com/eng/discography/detail/hwayangyeonhwa-young_forever.html)                | Burning Up (FIRE); Save ME; House OF Cards (full length edition)            |
| [Her](https://bts.ibighit.com/eng/discography/detail/love_yourself-her.html)                                     | DNA; MIC Drop; Pied Piper; Dimple                                           |
| [Tear](https://bts.ibighit.com/eng/discography/detail/love_yourself-tear.html)                                   | Airplane pt.2; Magic Shop; FAKE LOVE; 134340; Anpanman; Love Maze; Paradise |
| [Answer](https://bts.ibighit.com/eng/discography/detail/love_yourself-answer.html)                               | IDOL; verificação cruzada das faixas de Her e Tear                          |
| [MAP OF THE SOUL : 7](https://bts.ibighit.com/eng/discography/detail/map_of_the_soul-7.html)                     | Black Swan; Boy With Luv (Feat. Halsey); ON; 00:00 (Zero O’Clock)           |
| [You Never Walk Alone](https://bts.ibighit.com/eng/discography/detail/you_never_walk_alone.html)                 | Spring Day; Blood Sweat & Tears                                             |
| [Proof](https://bts.ibighit.com/eng/discography/detail/proof/index.html)                                         | Run BTS; Yet To Come (The Most Beautiful Moment)                            |
| [The most beautiful moment in life pt.2](https://bts.ibighit.com/eng/discography/detail/hwayangyeonhwa-pt2.html) | Butterfly; Whalien 52                                                       |
| [Skool Luv Affair](https://bts.ibighit.com/eng/discography/detail/skool_luv_affair.html)                         | Spine Breaker                                                               |

Todas as alternativas usam exclusivamente esses mesmos títulos verificados, sem duplicação dentro de uma questão.

## Revisão de ambiguidade

- Boy With Luv: nome completo com participação; Boy In Luv não é alternativa.
- Run BTS: coração substituído por sete; RUN não é alternativa; dica opcional aponta o segundo CD de Proof.
- IDOL: adicionado troféu e dica da palavra inglesa para ídolo; alternativas sem outra associação direta com estrela de palco.
- Life Goes On: amanhecer reforça continuidade; alternativas sem títulos de passagem de tempo; dica opcional.
- Yet To Come: título completo e dica de algo ainda por vir; Spring Day e Tomorrow não competem nesta pergunta.
- Dimple: brilho genérico substituído por atenção à bochecha e dica descritiva.
- Spine Breaker e Love Maze: dicas opcionais em português ajudam a associação sem penalidade.
- House OF Cards: edição completa identificada explicitamente na resposta e na explicação.
- Paradise e Spring Day: pistas de lugar e estação com distratores que não concorrem com essas leituras.

As demais pistas são literais ou compostas pelos elementos do nome. A dificuldade reflete familiaridade com as faixas. Associações editoriais podem receber novas revisões a partir de testes com fãs.

## Acessibilidade e limites

Botões nativos, foco visível, foco gerenciado ao mudar pergunta ou tela, feedback com região de status, alternativas com estado selecionado e bloqueado, indicação de acerto/erro por texto e ícone além da cor, descrições dos emojis e progresso com nome acessível. Movimento reduzido desativa transições locais. Sem restrição de tempo.

Ao sair ou atualizar, a partida é descartada; não há ranking ou armazenamento de pessoas. O compartilhamento real pelo seletor do sistema depende do navegador/dispositivo. Não há pendência funcional conhecida; a URL pública deve ser configurada quando existir para que o link acompanhe o texto compartilhado.

## Validação executada

- `npm.cmd test`: 60 testes passaram, incluindo jogo, Army Pass, galerias, História e Mural.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run lint`: passou.
- Build de produção executado pelo `webServer` do Playwright (`npm run build` seguido de `npm run start`): passou.
- Playwright de Emoji Challenge, História e Mural: 27 testes passaram em desktop (1440px), tablet (768px) e mobile (390px), incluindo partida em 320px.
- Após aumentar os emojis no mobile e ajustar a legenda do resultado, o build e seis testes de partida completa/tela de 320px passaram novamente nas três configurações; capturas finais conferidas.
- Formatação dos arquivos desta entrega: passou.
- Capturas de seleção, pergunta e resultado em `test-artifacts/emoji-{selection,question,result}-{desktop,tablet,mobile}.png`, inspecionadas visualmente.

O ambiente restringe criação de subprocessos: build, runner de testes e navegador precisaram da execução autorizada fora dessa restrição. Não houve instalação de dependências, criação de branch ou deploy. As alterações pré-existentes no repositório foram preservadas.
