# Auditoria e limpeza do reposit?rio ? 26/10/2026

Manuten??o realizada sem stage, commit, push, branch, deploy, mudan?as de hist?rico,
atualiza??o de depend?ncias ou altera??o de funcionalidades. Gerenciador: npm;
`package-lock.json` preservado. As altera??es anteriores do usu?rio foram mantidas.

## Classifica??o e preserva??o

- **Essenciais:** c?digo em `src/`, 80 arquivos em `public/`, testes, scripts,
  configura??es, documenta??o, migra??o SQL do Mural em `supabase/migrations/`,
  `package.json` e lockfile. As depend?ncias instaladas tamb?m foram preservadas.
- **Gerados descart?veis:** build Next.js, cache npm local, informa??o incremental
  TypeScript e relat?rios de execu??o do Playwright, conforme a tabela abaixo.
- **Incerto ou potencialmente insubstitu?vel:** backups, baselines, imagens e
  metadados de curadoria em `test-artifacts/`; duas c?pias id?nticas do logo;
  SVGs do scaffold sem refer?ncia encontrada. Nenhum desses arquivos foi exclu?do.

Foram registrados e comparados hashes de 245 arquivos essenciais existentes,
sem mudan?as. O ?ndice `.git/index` tamb?m permaneceu byte a byte id?ntico.

## Remo??es verificadas

Antes da exclus?o foram conferidos caminho absoluto dentro do workspace,
aus?ncia de links/reparse points e aus?ncia de arquivos rastreados nos alvos.
N?o foi utilizado nenhum comando de limpeza destrutiva do Git.

| Alvo                               | Arquivos removidos | Tamanho anterior |
| ---------------------------------- | -----------------: | ---------------: |
| `.next`                            |               1523 |       369.83 MiB |
| `.npm-cache`                       |                129 |       100.85 MiB |
| `tsconfig.tsbuildinfo`             |                  1 |         0.14 MiB |
| `test-artifacts/browser`           |                  1 |         0.00 MiB |
| `test-artifacts/playwright-report` |                  1 |         0.51 MiB |

Total de artefatos antigos removidos: **471.33 MiB**.

O build de valida??o recriou `.next/`, e o TypeScript pode recriar
`tsconfig.tsbuildinfo`; isso ? esperado e ambos permanecem ignorados. O objetivo
n?o ? deixar o projeto sem qualquer arquivo gerado ap?s execut?-lo.

## `.gitignore`

O conte?do completo est? em [`.gitignore`](../.gitignore). Regras principais:

- Depend?ncias, caches npm/pnpm/Yarn, `.next/`, `out/`, `build/`, `dist/`,
  `.turbo/`, `.cache/` e `*.tsbuildinfo`.
- Relat?rios de testes, cobertura, `test-artifacts/`, logs e diret?rios locais
  `tmp/` e `temp/`.
- `.env` e `.env.*`, com exce??es expl?citas para `.env.example` e
  `.env.local.example`. Nenhum exemplo com valores reais foi criado.
- Containers de chave privada (`*.pem`, `*.key`, `*.p12`, `*.pfx`), identidades
  SSH usuais e diret?rios locais `.ssh/` e `.aws/`.
- Estado local de Vercel e Supabase CLI; migra??es SQL continuam eleg?veis.
- Lixo de sistema e editor. Arquivos compartilh?veis como
  `.vscode/settings.json` e `.vscode/extensions.json` continuam eleg?veis;
  apenas `*.local.json` nessa pasta s?o ignorados.

`next-env.d.ts` foi preservado no computador e continua ignorado: a documenta??o
**local desta vers?o do Next.js** (`node_modules/next/dist/docs/01-app/03-api-reference/05-config/02-typescript.md`, se??o `next-env.d.ts`) recomenda ignor?-lo e
confirma sua regenera??o por `next dev`, `next build` ou `next typegen`.
Ele continua inclu?do no `tsconfig.json`, que n?o foi alterado.

`git check-ignore -v --no-index` confirmou as regras. A verifica??o autom?tica
confirmou 32 caminhos de prote??o e 249 caminhos eleg?veis, incluindo exemplos
seguros de ambiente, c?digo, fotografias, logos, testes, scripts, lockfile e SQL.
Nenhum arquivo j? rastreado corresponde ?s regras de exclus?o.

## Arquivos maiores preservados

Nenhum arquivo de projeto fora de caches/depend?ncias/artefatos excedia 5 MiB.
Os dez maiores foram mantidos integralmente:

| Caminho                                                          |  Tamanho | Recomenda??o                                     |
| ---------------------------------------------------------------- | -------: | ------------------------------------------------ |
| `public/images/arirang-tour/world-tour/tour-04-london.jpg`       | 2.28 MiB | Preservar o original; n?o remover pela dimens?o. |
| `public/images/army-pass/textures/map-atmosphere.png`            | 2.03 MiB | Preservar o original; n?o remover pela dimens?o. |
| `public/images/army-pass/textures/arirang-paper.png`             | 2.02 MiB | Preservar o original; n?o remover pela dimens?o. |
| `public/images/army-pass/gallery/map-of-the-soul-7/mots7-01.jpg` | 1.92 MiB | Preservar o original; n?o remover pela dimens?o. |
| `public/images/army-pass/textures/persona-atmosphere.png`        | 1.87 MiB | Preservar o original; n?o remover pela dimens?o. |
| `public/images/army-pass/textures/arirang-light-paper.png`       | 1.29 MiB | Preservar o original; n?o remover pela dimens?o. |
| `public/images/arirang-tour/world-tour/goyang-tour01.jpg`        | 1.23 MiB | Preservar o original; n?o remover pela dimens?o. |
| `public/images/army-pass/gallery/wings/wings-03.jpg`             | 0.95 MiB | Preservar o original; n?o remover pela dimens?o. |
| `public/images/jogos/integrantes/jin.webp`                       | 0.88 MiB | Preservar o original; n?o remover pela dimens?o. |
| `public/images/arirang-tour/world-tour/tour-02-tokyo.webp`       | 0.84 MiB | Preservar o original; n?o remover pela dimens?o. |

As maiores ocupa??es eram diret?rios gerados/depend?ncias. `node_modules/`
permaneceu instalado (aproximadamente 529 MiB). `test-artifacts/` tinha cerca de
379 MiB, com materiais de refer?ncia e curadoria que n?o foram tratados como
lixo gen?rico.

## Seguran?a

N?o foram encontrados arquivos `.env` locais, chaves privadas ou candidatos a
tokens reais nos arquivos textuais do projeto examinados. A busca incluiu
padr?es de tokens GitHub/OpenAI/AWS, JWT, segredo Supabase e URLs PostgreSQL com
senha; nomes de vari?veis e refer?ncias `process.env` n?o foram tratados como
credenciais expostas. Nenhum valor secreto foi copiado para o relat?rio.

N?o foi encontrado segredo nos arquivos atualmente rastreados. Nenhum
`git rm --cached` foi executado. Esta checagem est?tica da ?rvore de trabalho n?o
? uma auditoria forense de todo o hist?rico Git.

## Verifica??o

- `npm.cmd run build`: aprovado, incluindo compila??o e TypeScript do Next.js.
- `npm.cmd run typecheck`: aprovado, executado explicitamente ap?s o build para
  validar os tipos regenerados.
- `npm.cmd run lint`: aprovado.
- `npm.cmd test`: **74 testes aprovados**, zero falhas.
- Hashes do c?digo, assets, configura??es e lockfile: preservados.
- ?ndice Git: preservado, sem arquivos adicionados ao stage.

## Estado do Git e decis?es opcionais

O diret?rio j? continha trabalho modificado/n?o rastreado antes da manuten??o.
O Git continua mostrando essas altera??es. A exclus?o de `src/app/favicon.ico`
era preexistente e n?o foi restaurada nem causada pela limpeza. A manuten??o
altera apenas `.gitignore` e acrescenta este relat?rio; n?o adiciona arquivos ao
?ndice nem prepara um commit automaticamente.

Preservados para eventual decis?o do respons?vel:

1. `public/images/army-pass/logos/arirang-logo-novo` ? id?ntico a
   `arirang-logo-novo.jpeg`. As refer?ncias ativas encontradas usam `.jpeg`;
   mesmo assim, o arquivo sem extens?o n?o foi removido sem confirma??o.
2. `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg` e `window.svg` n?o
   tiveram refer?ncias encontradas na aplica??o/documenta??o examinada.
   Permanecem rastreados e preservados.
3. Backups, baselines, scripts auxiliares e evid?ncias de licenciamento em
   `test-artifacts/` permanecem locais e ignorados. A sele??o de evid?ncias a
   versionar ou de backups a descartar exige revis?o; nada foi movido ou apagado.
4. Os `.gitkeep` vazios s?o iguais por natureza e foram mantidos.

Nenhuma decis?o ? necess?ria para executar o portal. Cabe ao respons?vel
revisar e selecionar manualmente os arquivos para seu futuro commit.
