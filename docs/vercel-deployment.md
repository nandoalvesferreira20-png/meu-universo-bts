# Primeiro deploy de testes na Vercel

## Diagnóstico

O projeto usa Next.js 16.4.3, React/React DOM 19.3.0, App Router, TypeScript strict,
Tailwind CSS 4 e npm com `package-lock.json` v3. Os scripts `dev`, `build` e
`start` são os padrões do Next.js. A versão principal do Node foi definida como
`24.x` em `package.json` e no metadado raiz do lockfile, alinhada ao ambiente
validado e às versões suportadas pela Vercel. Nenhuma dependência foi atualizada.

O deploy deve usar o preset **Next.js**, com páginas estáticas, renderização
parcial/dinâmica e Route Handlers nativos. O `next.config.ts` mantém Cache
Components, Partial Prefetching e as regras locais de imagens aprovadas.

Não foi criado `vercel.json`: o preset nativo identifica o projeto e não existe
necessidade de rotas, comandos ou saída personalizados. Não usar exportação
estática, fallback de SPA, `outputDirectory` manual ou rewrites genéricos.

## Configuração no painel

Importe manualmente `nandoalvesferreira20-png/meu-universo-bts` e selecione:

| Campo            | Configuração                                                                |
| ---------------- | --------------------------------------------------------------------------- |
| Framework Preset | Next.js                                                                     |
| Root Directory   | Raiz do repositório (`.`)                                                   |
| Node.js Version  | 24.x, também definido em `engines.node`                                     |
| Build Command    | Padrão do preset: `npm run build`                                           |
| Output Directory | Padrão automático do Next.js; não preencher `out`, `dist` ou `public`       |
| Install Command  | `npm ci`, usando o lockfile versionado e incluindo devDependencies de build |

Não definir `NODE_ENV=development` nem usar instalação com `--omit=dev`: TypeScript,
Tailwind/PostCSS e outras ferramentas de build estão nas devDependencies.
`npm start` é usado no teste local; a Vercel administra a execução em produção.

## Primeiro deploy: portal com Mural indisponível

**Nenhuma variável de ambiente é obrigatória para o build ou para navegar pelo
portal com o Mural ainda em desenvolvimento.** Army Pass, PNG, jogos, História
e ARIRANG TOUR não dependem de credenciais do Supabase ou Turnstile.

Para esse primeiro teste, mantenha as variáveis do Mural ausentes, especialmente
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, e não cadastre credenciais parcialmente.
A página mantém a apresentação atual; o botão de publicação fica desabilitado.
A API de leitura sem configuração retorna indisponibilidade com mensagem
genérica, sem stack trace ou detalhes internos. As mutações permanecem protegidas.

`NEXT_PUBLIC_SITE_URL` é opcional. Configure a origem HTTPS pública se quiser
incluir o endereço do portal no compartilhamento dos jogos. Na ausência dela,
o resultado continua funcionando, sem acrescentar uma URL configurada.

## Variáveis em Project Settings → Environment Variables

O arquivo [`.env.example`](../.env.example) contém somente campos vazios,
comentários e padrões públicos. Não contém credenciais reais. Nenhum `.env.local`
foi criado, modificado ou excluído.

| Variável                           | Exposição                | Obrigatória para build? | Quando é necessária                                                                       |
| ---------------------------------- | ------------------------ | ----------------------- | ----------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`             | Pública                  | Não                     | Opcional: URL nos resultados compartilhados; alternativa de origem para mutações do Mural |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`   | Pública                  | Não                     | Widget do Mural; definir antes do build somente quando a ativação estiver pronta          |
| `SUPABASE_URL`                     | Servidor                 | Não                     | Leitura, gravação e autenticação do Mural                                                 |
| `SUPABASE_SERVICE_ROLE_KEY`        | Segredo de servidor      | Não                     | PostgREST/RPC do Mural; nunca usar prefixo `NEXT_PUBLIC_`                                 |
| `SUPABASE_ANON_KEY`                | Servidor nesta aplicação | Não                     | Login administrativo via Supabase Auth; o código atual a lê apenas no servidor            |
| `TURNSTILE_SECRET_KEY`             | Segredo de servidor      | Não                     | Validação de publicação e denúncia                                                        |
| `MURAL_RATE_LIMIT_SECRET`          | Segredo de servidor      | Não                     | HMAC de origem/conteúdo e rate limit, inclusive login administrativo                      |
| `MURAL_PUBLIC_ORIGIN`              | Servidor                 | Não                     | Origem HTTPS exata autorizada para mutações; pode usar o fallback `NEXT_PUBLIC_SITE_URL`  |
| `MURAL_CLIENT_IP_HEADER`           | Servidor                 | Não                     | Escolher o cabeçalho do proxy confiável antes de ativar o Mural                           |
| `MURAL_PUBLISH_LIMIT`              | Servidor                 | Não                     | Opcional; padrão 3 publicações                                                            |
| `MURAL_PUBLISH_WINDOW_SECONDS`     | Servidor                 | Não                     | Opcional; padrão 600 segundos                                                             |
| `MURAL_REPORT_LIMIT`               | Servidor                 | Não                     | Opcional; padrão 5 denúncias                                                              |
| `MURAL_REPORT_WINDOW_SECONDS`      | Servidor                 | Não                     | Opcional; padrão 86400 segundos                                                           |
| `MURAL_AUTO_HIDE_THRESHOLD`        | Servidor                 | Não                     | Opcional; padrão 8 origens distintas                                                      |
| `MURAL_ADMIN_LOGIN_LIMIT`          | Servidor                 | Não                     | Opcional; padrão 5 tentativas                                                             |
| `MURAL_ADMIN_LOGIN_WINDOW_SECONDS` | Servidor                 | Não                     | Opcional; padrão 900 segundos                                                             |

`NODE_ENV` também é consultada pelo código, mas é gerenciada pelo ambiente:
não cadastrar manualmente para substituir o modo de produção.

As duas variáveis `NEXT_PUBLIC_*` são utilizadas em páginas que participam do
build. Mudanças precisam de novo deployment para atualizar a interface e os
valores publicados. Nunca colocar chaves de serviço ou segredos em variáveis
públicas, arquivos em `public/`, URLs, screenshots ou logs.

Cadastre valores separadamente nos ambientes Production e Preview. A origem
usada pelo Mural deve corresponder ao hostname efetivamente acessado, incluindo
o protocolo. O código atual **não** deriva a origem de `VERCEL_URL` e não aceita
automaticamente todos os endereços temporários de Preview.

Se usar `MURAL_PUBLIC_ORIGIN`, preencha uma origem válida, sem caminho ou wildcard.
Se preferir o fallback para `NEXT_PUBLIC_SITE_URL`, não defina a variável privada:
uma string vazia não aciona o operador `??` empregado pelo backend atual.

## Ativação posterior do Mural

O Mural não é requisito para publicar as outras experiências. Para habilitá-lo,
seguir [configuração, segurança e limites](army-mural.md), incluindo migration,
Turnstile nos hostnames corretos, contas administrativas e procedimentos de
moderação e retenção. Nenhuma migration ou configuração remota foi executada.

Para **acesso direto pela Vercel**, definir
`MURAL_CLIENT_IP_HEADER=x-forwarded-for`. A documentação da plataforma informa
que esse cabeçalho é fornecido/sobrescrito pela Vercel para evitar spoofing.
O padrão atual do backend, `cf-connecting-ip`, não é uma configuração automática
adequada para esse cenário. O backend não foi alterado.

Caso exista Cloudflare ou outro proxy à frente da Vercel, revalidar a cadeia de
confiança antes de abrir publicações. Não confiar em um cabeçalho de IP arbitrário
enviado pelo visitante nem desativar a verificação de origem ou Turnstile.

## Compatibilidade e segurança examinadas

- Handlers usam `Request`/`Response`, `fetch`, cookies e `node:crypto`, compatíveis
  com o runtime Node.js padrão. Não existe middleware/proxy customizado impondo
  Edge Runtime.
- `@napi-rs/canvas` pertence às ferramentas de teste; não é importado pelos
  handlers ou componentes da aplicação. A exportação de PNG usa canvas no navegador.
- Não foi encontrado caminho absoluto Windows ou URL localhost fixa para
  funcionamento em produção em `src/`. As ocorrências de localhost nos jogos
  validam/rejeitam URLs locais de compartilhamento.
- Chamadas do navegador às APIs usam caminhos relativos. Credenciais do Mural
  são lidas somente em módulos alcançados pelos handlers de servidor.
- Fotografias e logos usam arquivos locais em `public/`; não dependem de uma
  pasta pessoal do computador. O JPEG sem extensão `tour-12-los` deve permanecer
  com seu nome real, já aceito pelo otimizador de imagens nos testes locais.
- `.env.local` está ignorado; `.env.example` é explicitamente permitido. Nenhum
  segredo deve ser colocado em `vercel.json`, que não foi necessário criar.

## Validação e limites

Executar no checkout:

```sh
npm run lint
npm run typecheck
npm run build
npm test
```

No PowerShell com bloqueio de scripts, usar `npm.cmd`. Em checkout novo,
`npm run build` regenera `next-env.d.ts` e os tipos de rotas; alternativamente,
`npm exec next typegen` antes de executar TypeScript isoladamente.

O build local não substitui um build Linux na infraestrutura Vercel. Também não
valida credenciais reais, SQL aplicado, hostnames Turnstile ou permissões da conta
remota. Esses pontos devem ser conferidos no primeiro deployment manual.

### Resultado da preparação local

Validação em 26/10/2026, Windows, Node.js 24.21.0 e npm 11.19.0, sem variáveis
do projeto definidas no ambiente e sem `.env.local`:

| Verificação executada                 | Resultado                                                                                                                        |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`                       | Aprovado; páginas e Route Handlers compilados                                                                                    |
| `npm run typecheck`                   | Aprovado                                                                                                                         |
| `npm run lint`                        | Aprovado                                                                                                                         |
| `npm test`                            | 74 testes aprovados, zero falhas                                                                                                 |
| `npm ls --depth=0`                    | Dependências instaladas coerentes, sem erro                                                                                      |
| Caminhos literais de imagens          | 52 caminhos exatos existentes, incluindo verificação de maiúsculas/minúsculas                                                    |
| Páginas no servidor de produção local | 18 respostas HTTP 200, incluindo os oito quizzes                                                                                 |
| Arquivos públicos não ocultos         | 70 respostas HTTP 200                                                                                                            |
| Otimizador Next Image                 | 24 imagens aprovadas, incluindo os sete retratos versionados, as galerias e o JPEG sem extensão                                  |
| Mural sem configuração                | Leitura 503; sessão administrativa sem login 401; mutações testadas sem origem configurada 403; mensagens genéricas e `no-store` |
| Categoria desconhecida                | Interface de não encontrado e `noindex`; 404 no teste final                                                                      |
| Bundles JavaScript públicos           | Nomes das três variáveis privadas de segredo não encontrados nos chunks do cliente                                               |
| Preservação                           | Páginas, backend, estilos, dados e mídias mantiveram seus hashes                                                                 |

O lockfile mantém os mesmos pacotes, versões e integridades; a única mudança é
o metadado `engines.node` do pacote raiz. As dependências opcionais Linux de SWC,
Sharp, Tailwind Oxide e canvas já constavam no lockfile. Isso não equivale a ter
executado um build Linux ou `npm ci` remoto.

## Checklist do responsável

1. Revisar as alterações locais e enviar manualmente o commit desejado ao GitHub.
   A Vercel importa o conteúdo remoto; arquivos somente locais não entram no deploy.
2. Importar o repositório com a raiz correta e as configurações da tabela.
3. Para o primeiro teste, deixar o Mural sem credenciais. Definir a URL pública
   opcional apenas quando souber a origem que será utilizada.
4. Executar o deploy manualmente e conferir o log de instalação/build.
5. Abrir Home, Army Pass, Jogos, oito quizzes, História, ARIRANG TOUR, Mural e Sobre.
6. Gerar/baixar um PNG e verificar fotos, fontes locais, galerias e rotas dinâmicas.
7. Confirmar que o Mural indisponível não publica e não expõe detalhes internos.
8. Testar no celular real; configurar serviços do Mural somente em etapa própria.

Nenhum deploy, commit, push, branch, domínio ou configuração remota foi alterado.

## Referências oficiais consultadas

- [Next.js na Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Versões Node.js e engines](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Cabeçalhos de requisição na Vercel](https://vercel.com/docs/headers/request-headers)
- Guias locais do Next.js em `node_modules/next/dist/docs/01-app/01-getting-started/17-deploying.md`
  e `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`.
