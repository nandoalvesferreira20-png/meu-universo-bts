# Relatório de remoção do Mural ARMY

## Arquivos removidos

- `docs/army-mural.md`
- `src/app/admin/mural/page.tsx`
- `src/app/api/mural/admin/messages/[id]/route.ts`
- `src/app/api/mural/admin/messages/route.ts`
- `src/app/api/mural/admin/reports/route.ts`
- `src/app/api/mural/admin/session/route.ts`
- `src/app/api/mural/messages/route.ts`
- `src/app/api/mural/reports/route.ts`
- `src/app/mural/page.tsx`
- `src/features/mural/admin-board.tsx`
- `src/features/mural/admin-mural.module.css`
- `src/features/mural/contracts.ts`
- `src/features/mural/mural-board.tsx`
- `src/features/mural/mural.module.css`
- `src/features/mural/turnstile-widget.tsx`
- `src/lib/mural-admin.ts`
- `src/lib/mural-server.ts`
- `supabase/migrations/202610260001_mural.sql`
- `tests/browser/mural.spec.ts`
- `tests/mural.test.ts`

## Arquivos modificados

- `.env.example`
- `.gitignore`
- `README.md`
- `docs/architecture.md`
- `docs/vercel-deployment.md`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/components/experience.tsx`
- `src/data/portal.ts`
- `src/types/index.ts`

Novos: `tests/browser/portal.spec.ts` e este relatório.

## Escopo e preservação

Removidas `/mural`, `/admin/mural` e as seis APIs em `/api/mural`: mensagens, denúncias, sessão administrativa, listagem administrativa de mensagens, mensagem por ID e denúncias administrativas. A regressão verifica HTTP 404 para todas elas.

A lista central foi limpa: card da Home, menu desktop, menu mobile e rodapé. A Home mantém cinco cards, centralizando a última linha incompleta com regras limitadas a `.home-experiences`; nenhum estilo das demais experiências foi alterado. O texto de apresentação agora descreve as experiências disponíveis.

`MessageCard`, `GalleryCard` e seus contratos de moderação não tinham consumidores restantes. Os dois foram removidos; `GalleryCard` era apenas um placeholder sem relação com os carrosséis ativos. Não havia CSS global associado a esses cards. Todos os estilos específicos estavam na pasta excluída.

Nenhuma dependência foi removida: Supabase usava `fetch` nativo e Turnstile usava script remoto, sem SDK instalado. Zod continua necessário ao Army Pass; Lucide e os demais pacotes continuam em uso. `package.json` e lockfile permanecem intactos.

As alterações preexistentes em `src/app/sobre/page.tsx` e `src/app/sobre/about.module.css` foram preservadas. Não houve alterações nos arquivos das quatro eras, exportador PNG, jogos, História, ARIRANG TOUR ou mídias.

## Variáveis e recursos externos

Podem ser removidas manualmente da Vercel, caso cadastradas exclusivamente para este portal:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `TURNSTILE_SECRET_KEY`
- `MURAL_RATE_LIMIT_SECRET`, `MURAL_PUBLIC_ORIGIN`, `MURAL_CLIENT_IP_HEADER`
- `MURAL_PUBLISH_LIMIT`, `MURAL_PUBLISH_WINDOW_SECONDS`
- `MURAL_REPORT_LIMIT`, `MURAL_REPORT_WINDOW_SECONDS`
- `MURAL_AUTO_HIDE_THRESHOLD`
- `MURAL_ADMIN_LOGIN_LIMIT`, `MURAL_ADMIN_LOGIN_WINDOW_SECONDS`

`NEXT_PUBLIC_SITE_URL` permanece opcional para compartilhar resultados dos jogos. Nenhum `.env` local foi lido, impresso, modificado ou excluído.

Se a antiga migration tiver sido aplicada remotamente, os recursos exclusivos ficaram sem consumidor neste portal: tabelas `mural_messages`, `mural_reports`, `mural_rate_limits`; funções `set_mural_updated_at`, `consume_mural_rate_limit`, `publish_mural_message`, `submit_mural_report`, `cleanup_mural_private_data`; índices, triggers e permissões associados. Também podem existir agendamentos de limpeza, contas/papéis administrativos no Supabase Auth e widget/chaves Turnstile. Verificar manualmente o compartilhamento com outros sistemas antes de qualquer limpeza. Nenhum serviço remoto foi acessado ou alterado; a existência desses recursos remotos não foi confirmada.

## Referências restantes

A busca incluiu `mural`, `mural-army`, `mural-board`, `turnstile`, `supabase`, `moderation` e `report`. Não há referências de execução ao Mural em `src`, nem links para ele no README ou guias ativos. Restam nomes nos testes de 404 e neste inventário para permitir auditoria. Relatórios históricos das fases anteriores preservam referências ao escopo e contagens de testes daquela época; não são instruções de ativação. `reporter`, `playwright-report`, `preservation-report` e “reportagem” são referências legítimas, sem integração com denúncias.

## Validação

TypeScript e ESLint aprovados após regenerar os tipos de rotas do Next.js. Os tipos antigos em `.next/dev/types` e `.next/types` foram descartados, pois ainda apontavam para arquivos removidos.

65 testes unitários aprovados, incluindo geração PNG real 1080 × 1920, quatro eras, upload/recorte, jogos e dados de História e turnê. Os testes precisaram executar fora do bloqueio de subprocessos do sandbox (`spawn EPERM`).

Build de produção final aprovado, executado pelo `webServer` do Playwright com `npm run build` e `npm run start -- --port 3100`.

Na suíte completa, 111 dos 117 cenários existentes passaram. As seis falhas são duas expectativas antigas da ARIRANG TOUR repetidas nos três projetos: `arirang-tour-timeline.spec.ts:28` espera `upcoming`, mas recebe `today`; `arirang-world-gallery.spec.ts` espera “Em breve, ARMYs”, mas recebe a mensagem de hoje. Em 28/10/2026, São Paulo está na data do evento. Esses arquivos e a lógica da turnê não foram alterados. Os controles do carrossel de Seul passaram nas três resoluções; o teste da galeria mundial executou seus controles antes de falhar na expectativa final de texto.

A primeira execução também carregou uma versão inicial dos 24 cenários novos com seletores de texto cuja acentuação havia sido perdida na escrita via shell. Os seletores foram corrigidos, e a rodada final isolada sobre o build final aprovou **24 de 24 cenários** (`npm run test:browser -- tests/browser/portal.spec.ts`). Não restam falhas nos testes novos.

A regressão final confirma cinco cards, nenhum link para o Mural, ausência de overflow, centralização da última linha, navegação desktop/mobile, Escape com retorno de foco, rodapé, oito rotas HTTP 404 e créditos da página Sobre. Os sete tamanhos 320, 375, 390, 430, 768, 1024 e 1440 px foram testados nos três contextos de navegador. Capturas dos grids foram inspecionadas visualmente em todos os sete tamanhos.

Os fluxos do Army Pass (quatro eras, PNG, fotos, recorte e compartilhamento), oito quizzes, Emoji Challenge, História e retratos passaram em desktop, tablet e mobile. A validação local não equivale a um deployment Linux na Vercel, que permanece manual.

Artefatos locais ignorados pelo Git: `test-artifacts/full-suite-report/index.html` e `test-artifacts/full-suite-results/` guardam a primeira rodada; `test-artifacts/playwright-report/index.html` contém a rodada final aprovada; `test-artifacts/portal-removal/` contém as capturas finais. `git diff --check` e Prettier dos arquivos alterados foram aprovados.

Nenhuma branch, staging, commit, push ou deploy foi realizado.
