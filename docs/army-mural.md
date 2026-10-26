# Mural ARMY: configuração e limites

O Mural oferece leitura pública de mensagens publicadas, envio de texto, denúncias e uma área administrativa em `/admin/mural`. Conteúdo aprovado pelas validações básicas é publicado automaticamente; padrões conhecidos de abuso ou spam ficam ocultos para revisão. Links e marcação HTML são rejeitados. Os filtros são heurísticos e não substituem revisão, canal de remoção nem política de privacidade.

## Ativação

Não habilite o mural em produção até completar todos os passos abaixo:

1. Crie um projeto Supabase e aplique `supabase/migrations/202610260001_mural.sql`. Confirme a política RLS e os privilégios com papéis anônimo, autenticado e `service_role`.
2. Configure um site e uma chave secreta do Cloudflare Turnstile. Cadastre todos os hostnames de produção e de teste necessários.
3. Crie as contas da equipe no Supabase Auth. Conceda a permissão somente pelo `app_metadata` (`mural_admin: true` ou `role: "mural_admin"`), usando uma operação administrativa confiável. Nunca conceda pelo `user_metadata` ou por dados enviados pelo navegador.
4. Configure o proxy para sobrescrever o cabeçalho de IP escolhido com o endereço do cliente recebido de uma origem confiável. Não repasse sem validação um cabeçalho controlável pelo visitante.
5. Configure as variáveis abaixo somente no ambiente de execução/build apropriado. Nunca exponha `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY` ou `MURAL_RATE_LIMIT_SECRET` ao cliente ou ao repositório.
6. Agende diariamente a chamada server-side a `cleanup_mural_private_data()` usando credencial privada. Não chame a função nem exponha a chave de serviço no navegador.
7. Publique política de privacidade/uso e um canal operacional para denúncias e pedidos de remoção. Teste mensagens, denúncias, tentativas sem Turnstile, autenticação administrativa e rate limits em ambiente de teste.

## Variáveis

| Variável                                                      | Finalidade                                                                  |
| ------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `SUPABASE_URL`                                                | URL do projeto Supabase, somente no servidor                                |
| `SUPABASE_ANON_KEY`                                           | Login administrativo via Supabase Auth, somente no servidor                 |
| `SUPABASE_SERVICE_ROLE_KEY`                                   | Acesso PostgREST server-side; nunca enviar ao cliente                       |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`                              | Chave pública do widget Turnstile                                           |
| `TURNSTILE_SECRET_KEY`                                        | Validação server-side de desafios                                           |
| `MURAL_RATE_LIMIT_SECRET`                                     | Segredo aleatório forte para HMAC de origem e conteúdo                      |
| `MURAL_PUBLIC_ORIGIN`                                         | Origem pública esperada para mutações, por exemplo `https://exemplo.com`    |
| `NEXT_PUBLIC_SITE_URL`                                        | Alternativa para `MURAL_PUBLIC_ORIGIN`; em produção uma delas é obrigatória |
| `MURAL_CLIENT_IP_HEADER`                                      | Cabeçalho injetado pelo proxy confiável; padrão `cf-connecting-ip`          |
| `MURAL_PUBLISH_LIMIT`, `MURAL_PUBLISH_WINDOW_SECONDS`         | Limite de publicação por origem; padrão 3 em 600 segundos                   |
| `MURAL_REPORT_LIMIT`, `MURAL_REPORT_WINDOW_SECONDS`           | Limite de denúncias por origem; padrão 5 em 86400 segundos                  |
| `MURAL_AUTO_HIDE_THRESHOLD`                                   | Origens distintas que ocultam automaticamente; padrão 8                     |
| `MURAL_ADMIN_LOGIN_LIMIT`, `MURAL_ADMIN_LOGIN_WINDOW_SECONDS` | Limite de login; padrão 5 em 900 segundos                                   |

Os limites são compartilhados no banco e têm intervalos aceitos pelo servidor/migration. Se a configuração essencial estiver ausente, as operações falham fechadas. A página pública pode ser exibida sem chaves, mas não permitirá publicação nem apresentará mensagens inventadas.

## Dados, moderação e retenção

O mural coleta apelido, mensagem e, opcionalmente, cidade/UF. A denúncia armazena motivo e detalhes opcionais; o endereço IP não é salvo em texto puro. Fingerprints HMAC de origem/conteúdo são removidos após 30 dias; denúncias são excluídas após 180 dias; registros de rate limit vencidos são limpos. O agendamento da limpeza é requisito operacional, não é criado pela migration.

Apenas texto simples é renderizado. Mensagens sem sinalização são publicadas após as validações; conteúdo sinalizado fica oculto. A partir do limite de denúncias de origens distintas, a publicação é ocultada para avaliação. Esses mecanismos reduzem abuso, mas não conseguem detectar todos os casos. A equipe continua responsável por revisar denúncias, responder solicitações e aplicar as políticas publicadas.

## Validação local

`npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build` e `npm run test:browser` verificam código e comportamento visível. A migration precisa ser aplicada e exercitada separadamente em uma instância PostgreSQL/Supabase de teste; uma aprovação de build não valida SQL, credenciais, Turnstile real, configuração do proxy nem políticas operacionais.
