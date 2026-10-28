# Publicação manual na Vercel

Use o preset Next.js, a raiz do repositório, Node.js 24.x, `npm ci` e `npm run build`. Deixe o diretório de saída no padrão automático. Não é necessário `vercel.json`.

Nenhuma variável de ambiente é obrigatória. `NEXT_PUBLIC_SITE_URL` é opcional e inclui a URL HTTPS pública nos resultados compartilhados dos jogos. Seu valor é incorporado no build; alterações exigem novo deployment. Consulte `.env.example`. Não cadastre `NODE_ENV` manualmente.

Army Pass, exportação PNG, jogos, História e ARIRANG TOUR usam dados e arquivos locais. As fotos pessoais são processadas no navegador. Não há integração com banco de dados ou serviço de publicação de mensagens.

Antes da publicação manual, execute `npm run typecheck`, `npm run lint`, `npm test` e `npm run test:browser` (inclui build de produção). Confira fotos, logos, galerias, carrosséis, oito quizzes e download PNG em um celular real. Um build local Windows não substitui a validação do build Linux na Vercel.

O responsável fará o versionamento e o deploy manualmente. Nenhum serviço remoto é alterado por esta preparação.
