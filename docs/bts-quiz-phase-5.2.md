# Quiz BTS e Integrantes — fase 5.2

Recorte editorial: informações confirmadas até **26 de outubro de 2026**. Implementação inteiramente no navegador, sem cronômetro, cadastro, persistência de participantes, backend, Supabase ou ranking.

## Experiência

`/jogos` apresenta Emoji Challenge e Quiz BTS e Integrantes. `/jogos/quiz` oferece oito categorias: BTS — OT7, RM, Jin, SUGA, j-hope, Jimin, V e Jung Kook. Cada categoria tem dez perguntas, quatro alternativas e uma resposta correta, com dez pontos por acerto e máximo de cem.

O cartão OT7 usa o arquivo local existente `/images/army-pass/gallery/arirang/arirang-01.jpg`, na proporção original e sem modificar o arquivo. Não foram encontrados retratos individuais locais apropriados: os sete cartões usam composições tipográficas com os nomes artísticos. Nenhuma fotografia externa foi baixada, nenhum retrato gerado e nenhum asset existente alterado.

A rota de cada categoria valida o slug e usa a página 404 existente para categorias desconhecidas. O carregamento inicial preserva HTML determinístico; no primeiro frame após a hidratação o navegador prepara e embaralha a partida. Há limpeza do frame agendado na desmontagem. O conteúdo não depende de APIs externas durante a partida. Os links de fontes só são apresentados depois de responder.

Perguntas e alternativas são embaralhadas a cada partida; a resposta é sempre vinculada a um ID estável. Selecionar duas vezes ou tentar enviar uma resposta de outra pergunta não altera o resultado. A próxima pergunta só é liberada após a resposta, e o avanço é manual. Ao concluir dez questões, aparecem categoria, acertos, pontuação, mensagem e ações de reinício, escolha de outro quiz e compartilhamento. Reiniciar mantém a categoria e zera a partida. O texto esclarece que as dez perguntas continuam as mesmas, com ordem variável. A seleção permite expansão do banco acima de dez perguntas.

## Reutilização e preservação

`src/features/games/question-engine.ts` contém as funções extraídas do Emoji Challenge: `shuffle`, `answerQuestion`, `nextQuestion`, `correctCount`, `scoreGame` e `shareResult`. O motor preserva os algoritmos originais; as funções de estado passam a aceitar a estrutura comum de sessão. Os dois jogos importam as mesmas funções, verificado por identidade nos testes.

`src/features/emoji-challenge/game.ts` reexporta essas funções e preserva sua API, inicialização específica, validação de dificuldades, classificações e texto de compartilhamento. Seu banco, três dificuldades, pontuação, componentes e estilos não foram alterados. Os arquivos de dados/apresentação foram conferidos por SHA-256 contra um registro anterior à implementação da interface do quiz.

Nenhuma alteração no Army Pass, fotografias, História, capítulo militar, Mural, Supabase, estilos globais ou página inicial. Nenhuma dependência nova, branch ou deploy.

## Banco e curadoria

Existem **80 perguntas**, dez por categoria. Cada pergunta inclui ID, categoria, enunciado, quatro opções com IDs estáveis, ID correto, explicação e URL de fonte. A validação rejeita categoria inexistente, banco insuficiente, enunciado duplicado, IDs de pergunta duplicados, opções incompletas/repetidas, resposta ausente e fonte não registrada. A interface trata falhas impedindo a partida incompleta.

O banco foi escrito em português, sem letras de músicas, rumores, relacionamentos, preferências pessoais ou informações privadas. As alternativas incorretas são distratores editoriais, não afirmações factuais. Em perguntas sobre versões, edições ou papéis, o enunciado delimita a referência para evitar mais de uma resposta defensável.

| Categoria | Quantidade | Assuntos                                                                                                     |
| --------- | ---------: | ------------------------------------------------------------------------------------------------------------ |
| BTS — OT7 |         10 | Estreia, formação, nome, HYYH, WINGS, LOVE YOURSELF, MAP OF THE SOUL, UNICEF, conclusão do serviço e ARIRANG |
| RM        |         10 | Liderança, Indigo, colaboradores, Right Place, Wrong Person e mono.                                          |
| Jin       |         10 | The Astronaut, Coldplay, Argentina, Happy, WENDY, Echo e retorno do serviço                                  |
| SUGA      |         10 | Agust D, trilogia, D-DAY, Haegeum, IU, D-2, RM e SURAN                                                       |
| j-hope    |         10 | Hope World, Jack In The Box, colaborações e dança de rua                                                     |
| Jimin     |         10 | FACE, Like Crazy, pré-lançamento, MUSE, colaboradores e Billboard                                            |
| V         |         10 | Layover, versões, FRI(END)S, Winter Ahead e Snow Flower                                                      |
| Jung Kook |         10 | GOLDEN, Seven, 3D, Usher, Never Let Go, My You e Dreamers                                                    |

### Fontes consultadas

As URLs exatas e o vínculo de cada pergunta estão em `src/features/bts-quiz/sources.ts` e `questions.ts`.

- [Perfil oficial do BTS](https://bts.ibighit.com/eng/profile/).
- Discografia BIGHIT MUSIC: [HYYH pt.1](https://bts.ibighit.com/eng/discography/detail/hwayangyeonhwa-pt1.html), [WINGS](https://bts.ibighit.com/eng/discography/detail/wings.html), [Answer](https://bts.ibighit.com/eng/discography/detail/love_yourself-answer.html), [MAP OF THE SOUL : 7](https://bts.ibighit.com/eng/discography/detail/map_of_the_soul-7.html).
- RM: [anúncio de Indigo](https://weverse.io/bts/notice/9917), [Indigo e vídeos](https://bts.ibighit.com/eng/discography/rm/detail/indigo/), [créditos das faixas na loja oficial](https://shop.weverse.io/en/shop/KRW/artists/2/sales/13266), [Right Place, Wrong Person](https://bts.ibighit.com/eng/discography/rm/detail/rpwp/), [anúncio de lançamento](https://weverse.io/bts/notice/19131), [mono.](https://bts.ibighit.com/eng/discography/rm/detail/mono/).
- Jin: [aviso oficial da apresentação com Coldplay](https://weverse.io/bts/notice/9534), [Happy](https://bts.ibighit.com/eng/discography/jin/detail/happy/), [Echo](https://bts.ibighit.com/eng/discography/jin/detail/echo/), [retorno documentado pelo Korea Herald](https://www.koreaherald.com/article/3411474).
- SUGA: [D-DAY](https://bts.ibighit.com/eng/discography/suga/detail/d-day/), [D-2](https://bts.ibighit.com/eng/discography/suga/detail/d-2/), [Agust D](https://bts.ibighit.com/eng/discography/suga/detail/agust-d/).
- j-hope: [Hope World](https://bts.ibighit.com/eng/discography/j-hope/detail/hope-world/), [Jack In The Box](https://bts.ibighit.com/eng/discography/j-hope/detail/jack-in-the-box/index.html), [data do lançamento](https://weverse.io/bts/notice/89), [HOPE ON THE STREET VOL.1](https://bts.ibighit.com/eng/discography/j-hope/detail/hope-on-the-street/index.html), [on the street](https://bts.ibighit.com/eng/discography/j-hope/detail/on-the-street/index.html), [Chicken Noodle Soup](https://bts.ibighit.com/eng/discography/j-hope/detail/chicken-noodle-soup/), [catálogo oficial](https://bts.ibighit.com/eng/discography/j-hope/).
- Jimin: [FACE](https://bts.ibighit.com/eng/discography/jimin/detail/face/), [MUSE](https://bts.ibighit.com/eng/discography/jimin/detail/muse/), [Billboard sobre o número 1 de Like Crazy](https://ca.billboard.com/music/pop/jimin-closer-than-this-video-1235563916/).
- V: [comunicado de Layover com lista e versões](https://weverse.io/bts/notice/14760), [Winter Ahead](https://bts.ibighit.com/eng/discography/v/detail/winter-ahead/), [FRI(END)S](https://bts.ibighit.com/eng/discography/v/detail/friends/), [Snow Flower](https://bts.ibighit.com/eng/discography/v/detail/snow-flower/), [catálogo oficial](https://bts.ibighit.com/eng/discography/v/).
- Jung Kook: [anúncio de GOLDEN](https://weverse.io/bts/notice/15485), [Standing Next to You](https://weverse.io/bts/notice/16157), [remix com Usher](https://weverse.io/bts/notice/16594), [3D](https://weverse.io/bts/notice/15383), [Never Let Go](https://weverse.io/bts/notice/19878), [catálogo oficial](https://bts.ibighit.com/eng/discography/jung-kook/), [FIFA sobre Dreamers](https://www.fifa.com/en/articles/artists-musicians-singers-perform-ceremonies-photos).
- Marcos do grupo: [UNICEF sobre LOVE MYSELF](https://www.unicef.org/press-releases/unicef-and-bts-celebrate-success-groundbreaking-love-myself-campaign), [Billboard sobre o retorno após o serviço](https://ca.billboard.com/music/pop/bts-confirms-march-2026-return-1236148052/), [Universal Music sobre ARIRANG](https://www.universalmusic.ca/2026/03/23/bts-fifth-studio-album-arirang-out-now/).

Algumas páginas oficiais usam imagens de texto e aplicações dinâmicas. Quando a extração não trouxe os detalhes necessários, foram consultados os comunicados oficiais do Weverse e os créditos da loja oficial. Fanposts encontrados nas buscas não foram usados como evidência.

### Revisões de ambiguidade

- BTS: a questão do nome pede a expressão **coreana**, pois o perfil também aceita Beyond the Scene.
- Serviço: o texto usa **obrigações de serviço**, incluindo o serviço alternativo de SUGA.
- RM: a questão de liderança se ancora no comunicado de Indigo e não apresenta outro papel também exercido por RM como alternativa.
- SUGA: Agust D é ligado explicitamente à trilogia; so far away especifica a versão da mixtape de 2016.
- j-hope: a contagem de faixas delimita a **edição original** de Jack In The Box, e a pergunta das faixas principais aceita o par MORE/Arson.
- V: a questão de versão bônus especifica Slow Dancing **em Layover**.
- Jung Kook: Seven e 3D especificam a **versão original**, enquanto a colaboração com Usher especifica o remix de dezembro de 2023.
- Like Crazy: uma pergunta cobre a faixa principal de FACE e outra o marco distinto na Billboard; as explicações não fazem alegações de ranking em tempo real.

## Compartilhamento e acessibilidade

O compartilhamento reutiliza Web Share API → clipboard → texto selecionável. Cancelamento nativo mantém o resultado. A mensagem contém categoria e pontuação, sem respostas. Somente `NEXT_PUBLIC_SITE_URL` válida, HTTPS e não local acrescenta o caminho público da categoria; sem configuração, compartilha apenas o texto.

Botões e links nativos, foco visível, foco gerenciado na pergunta e no resultado, região de status, progresso rotulado, alternativas com estados selecionado/bloqueado e feedback por texto/ícone além da cor. Transições respeitam movimento reduzido. Não há avanço automático nem penalidade por tempo.

## Arquivos

Criados:

- `src/features/games/question-engine.ts`.
- `src/features/bts-quiz/{types,categories,sources,questions,game}.ts`.
- `src/features/bts-quiz/category-selection.tsx`.
- `src/features/bts-quiz/quiz-game.tsx`.
- `src/features/bts-quiz/quiz.module.css`.
- `src/app/jogos/quiz/[categoria]/loading.tsx`.
- `tests/bts-quiz.test.ts`.
- `tests/browser/bts-quiz.spec.ts`.
- `docs/bts-quiz-phase-5.2.md`.

Modificados:

- `src/app/jogos/page.tsx` — integração das duas experiências.
- `src/app/jogos/quiz/page.tsx` — seleção e metadados.
- `src/app/jogos/quiz/[categoria]/page.tsx` — categoria válida, metadados, geração estática e início do jogo.
- `src/features/emoji-challenge/game.ts` — extração das funções comuns, com API preservada.

## Limites

Recarregar ou sair descarta a partida, sem armazenar dados de pessoas. O seletor nativo real de compartilhamento depende do dispositivo; seus caminhos são cobertos por simulação nos testes. A inclusão de link no texto depende da configuração da URL pública. Não há pendência funcional conhecida.

## Validações executadas

- `npm.cmd test`: **68 testes passaram**, incluindo os oito novos testes de dados/estado do quiz, os testes do Emoji Challenge e as suítes existentes de Army Pass, fotografias, História e Mural.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run lint`: passou, inclusive após a inclusão dos testes de navegador.
- `npx.cmd playwright test tests/browser/bts-quiz.spec.ts tests/browser/emoji-challenge.spec.ts`: **39 testes passaram** em desktop (1440px), tablet (768px) e mobile (390px), incluindo cenários de 320px.
- O Playwright executou o build de produção antes de iniciar o servidor; build e geração das rotas passaram.
- Cada uma das oito categorias completou dez perguntas em cada configuração, com teste de pontuação, resposta única, fontes, foco, cópia do resultado, reinício e retorno à seleção. Os testes de zero acertos, fallback manual, movimento reduzido, integração na Central e categoria inválida também passaram.
- Os nove testes de navegador existentes do Emoji Challenge passaram após a extração do motor.
- Formatação dos arquivos desta entrega passou no Prettier.
- Capturas de seleção, pergunta e resultado nas três larguras foram geradas em `test-artifacts/quiz-{selection,question,result}-{desktop,tablet,mobile}.png` e inspecionadas visualmente.
- SHA-256 confirmou preservação dos dados, tipos, UI, estilos e rota do Emoji Challenge; comparação textual confirmou preservação da inicialização, validação de dificuldades, classificações e texto de compartilhamento específicos do jogo.

Os subprocessos do runner/build e do navegador precisaram de execução autorizada fora da restrição do ambiente. Não houve instalação ou mudança de política do sistema.
