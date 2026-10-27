# ARMY PASS BRASIL

Portal independente da comunidade ARMY brasileira, em colaboração com [@meuuniversobts](https://www.instagram.com/meuuniversobts/). A Fase 2.5 oferece WINGS, MAP OF THE SOUL: 7, MAP OF THE SOUL: PERSONA e ARIRANG reconstruídos das referências fornecidas, fotografias independentes, recorte, prévia e PNG 1080 × 1920.

**Estado atual:** [ARIRANG claro](docs/army-pass-phase-2.5-light.md), com [logos originais incorporados](docs/arirang-logo-fix.md): três símbolos ARIRANG e marca preta BTS fornecidos pelo usuário. Papel marfim, molduras vermelhas, dados, fotos e frase autoral foram preservados. WINGS, MAP OF THE SOUL: 7 e PERSONA permanecem intactos. A lista pública continua com quatro eras; BE permanece oculto internamente.

A [Fase 2.1 — Army Pass Studio](docs/army-pass-phase-2.1.md) redesenha a interface e os quatro passaportes, preservando o fluxo e a exportação. Inclui 24 testes de navegador em desktop/tablet/mobile e configuração de logos oficiais **pendentes de autorização**. Fontes e instruções em [pesquisa de identidades](docs/era-logo-research.md).

Leia [o guia da Fase 2](docs/army-pass-phase-2.md) para os componentes, inserção de fotografias autorizadas, privacidade e funcionamento da exportação. [Resultados de validação](docs/validation-phase-2.md) incluem os limites dos testes sem navegador conectado.

A [correção de CSS Modules](docs/army-pass-css-fix.md) documenta o defeito visual reproduzido e sua correção, com testes reais no Edge em desktop e mobile emulado. Para executar essa regressão: `npm run test:browser` (constrói e serve o projeto na porta 3100).

## Executar localmente

Requer Node.js compatível com Next.js 16 (20.9 ou superior) e npm.

```sh
npm install
npm run dev
```

Abra http://localhost:3000. No PowerShell com bloqueio de scripts, use `npm.cmd` no lugar de `npm`. Não são necessárias credenciais, serviços externos nem arquivos `.env` nesta fase. As fontes usam a pilha local do sistema, sem download no build.

```sh
npm run lint
npm run typecheck
npm run build
npm run start
npm run format:check
npm test
```

`start` executa o build de produção em http://localhost:3000. Hospedagem planejada: Vercel. Nenhum deploy foi realizado.

## Rotas

| Rota                      | Estado na Fase 1                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| `/`                       | Home com seis experiências, parceria e apresentação da galeria                                        |
| `/army-pass`              | Gerador funcional: quatro eras, arte/foto local, recorte, download PNG e Web Share quando suportado   |
| `/mural`                  | Mural com publicação filtrada, denúncias e proteção Turnstile; requer configuração Supabase/Turnstile |
| `/admin/mural`            | Moderação autenticada por Supabase Auth e papel `app_metadata`; requer configuração                   |
| `/jogos`                  | Central de jogos                                                                                      |
| `/jogos/emojis`           | Apresentação do desafio em desenvolvimento                                                            |
| `/jogos/quiz`             | Oito categorias navegáveis                                                                            |
| `/jogos/quiz/[categoria]` | `bts`, `rm`, `jin`, `suga`, `j-hope`, `jimin`, `v`, `jung-kook`; sem partidas simuladas               |
| `/historia`               | Estrutura da futura linha do tempo; conteúdo histórico em curadoria                                   |
| `/arirang-tour`           | Galeria vazia; sem uploads ou fotos fictícias                                                         |
| `/sobre`                  | Projeto, colaboração e independência                                                                  |

Categorias desconhecidas exibem a página 404. Layout de carregamento compartilhado e página de erro recuperável incluídos.

## Arquitetura e arquivos

- `src/app`: rotas, metadados, layout raiz, carregamento, erros e tokens/estilos globais com Tailwind CSS 4.
- `src/components/shell.tsx`: Header, Footer e marca; `mobile-navigation.tsx`: menu com estado, Escape e retorno de foco.
- `src/components/hero-section.tsx`: HeroSection.
- `src/components/experience.tsx`: ExperienceCard, SectionHeader, EmptyState, PurplePassCard, QuizCategoryCard, MessageCard, GalleryCard e TimelineSection.
- `src/features/experience-page.tsx`: estrutura compartilhada das páginas internas. Futuras funcionalidades podem receber diretórios próprios aqui.
- `src/data/portal.ts`: navegação, experiências e categorias estáticas. Perguntas e linha do tempo deverão receber arquivos estruturados revisados antes de sua publicação.
- `src/features/army-pass`: gerador local, templates, temas, seleção de imagens, recorte e exportação.
- `src/lib/validation.ts`: contrato Zod do formulário do Army Pass, conectado ao editor.
- `src/types/index.ts`: contratos iniciais de conteúdo e moderação. Não substituem autorização no servidor ou RLS.
- `public/images`: reservado para arquivos com autorização documentada; sem fotos nesta fase.
- `docs/architecture.md`: integração futura e condições para publicação de conteúdo.
- `docs/validation.md`: verificações executadas e limites da validação.

Também foram alterados `package.json`, `package-lock.json` e `.gitignore`. TypeScript strict já estava ativo e foi preservado. Lucide React e Zod foram adicionados; Prettier mantém a formatação.

## Próximas fases

1. Revisão do Army Pass em navegadores e aparelhos reais; adicionar fotografias apenas após receber autorização. O gerador com artes e fotos pessoais já funciona.
2. Jogos reais com perguntas e respostas revisadas; linha do tempo completa com fontes verificadas.
3. Aplicar e validar a migration do Mural em Supabase, configurar Turnstile e autenticação administrativa, revisar políticas e retenção antes de abrir a participação pública.
4. Políticas de privacidade/remoção, revisão de acessibilidade e validação visual em dispositivos reais antes de publicar.

O formulário do Army Pass funciona inteiramente no navegador: não envia dados nem fotos. O Mural possui endpoints, filtros, denúncias e interfaces pública/administrativa; sem credenciais, migration aplicada e chaves Turnstile, as operações falham de forma segura e não persistem dados. Consulte [configuração e limites do Mural](docs/army-mural.md) antes de habilitar o serviço.

## Deploy de testes na Vercel

Use o preset nativo **Next.js**, a raiz do repositório e **Node.js 24.x**. O portal
pode ser publicado sem credenciais, mantendo o Mural indisponível de forma segura.
Consulte o [guia de deploy e variáveis de ambiente](docs/vercel-deployment.md) e
[`.env.example`](.env.example) antes de configurar serviços. O primeiro deploy é manual.
