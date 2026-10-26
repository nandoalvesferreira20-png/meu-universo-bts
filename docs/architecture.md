# Arquitetura e integração futura

> Atualização: a [Fase 2.2](army-pass-phase-2.2.md) substitui a seleção das 12 artes por um template por era, WINGS aprovado e duas fotografias independentes. As descrições anteriores abaixo registram a evolução do projeto e são superadas por esse guia no gerador atual.

## Base da Fase 1 e evolução na Fase 2

As páginas são predominantemente Server Components estáticos. O menu mobile e o gerador de Army Pass usam estado no cliente; os dados e imagens do passaporte permanecem locais. O Mural tem endpoints server-side que enviam apelido, mensagem e localização opcional ao Supabase somente quando a integração estiver configurada. As categorias de quiz usam parâmetros assíncronos do App Router e geração estática; categorias desconhecidas usam `notFound()`.

Tokens de identidade ficam em `src/app/globals.css`, expostos também pelo tema Tailwind. Fotografias autorizadas poderão ser adicionadas a `public/images`; não há upload de fotos no Mural. A integração Supabase do Mural é real e falha de forma segura sem credenciais; detalhes e pré-requisitos estão em `docs/army-mural.md`.

## Army Pass: implementado na Fase 2

`src/features/army-pass` contém um editor no cliente, reducer para quatro etapas, contrato Zod atualizado e renderizador Canvas único para prévia e PNG. Quatro layouts distintos compartilham primitivas de texto e recorte; 12 artes SVG autorais estão disponíveis sem depender de fotos. O manifesto de fotografias autorizadas está vazio.

Na Fase 2.1, os layouts e a interface foram redesenhados sem trocar essa arquitetura. `era-logos.ts` habilita somente assets locais autorizados configurados em `eraThemes`; sua imagem é preparada tanto para a prévia quanto para a exportação. Logos oficiais estão pendentes, com fallback tipográfico. A ampliação da prévia usa diálogo nativo e o mesmo renderizador. Detalhes em `docs/army-pass-phase-2.1.md`.

Fotos pessoais são validadas, decodificadas, orientadas e redesenhadas localmente. `PhotoSession` mantém somente a foto processada durante a sessão, descarta URLs e invalida processamento atrasado. Não há Supabase, requisições de envio, analytics ou armazenamento permanente. O compartilhamento usa arquivo já gerado e depende de suporte da Web Share API, com download disponível. Guia completo em `docs/army-pass-phase-2.md` e limites dos testes em `docs/validation-phase-2.md`.

## Mural ARMY

`src/features/mural` implementa o formulário e mural público, denúncias, verificação Turnstile e a interface de moderação em `/admin/mural`. A leitura pública consulta apenas mensagens `published`; a publicação passa por validação Zod, rejeição de HTML/links e filtros básicos, publicando automaticamente conteúdo não sinalizado e mantendo conteúdo suspeito oculto para revisão. A moderação confere o papel em `app_metadata` em cada chamada; `user_metadata` não autoriza acesso.

`supabase/migrations/202610260001_mural.sql` cria mensagens, denúncias e rate limits, ativa RLS sem políticas públicas e limita as operações às APIs server-side com a chave `service_role`. Denúncias são públicas sem expor o denunciante, deduplicadas por origem e podem ocultar uma mensagem após o limite configurado. Fingerprints HMAC não são endereços IP em texto puro e são limpos após 30 dias; denúncias são retidas por até 180 dias. A limpeza precisa ser agendada operacionalmente.

As operações de escrita exigem validação de origem, Turnstile e um cabeçalho de endereço IP confiável definido pelo proxy. A publicação, denúncias e login administrativo usam rate limits no banco. A configuração necessária, setup da migration e limitações dos filtros estão em `docs/army-mural.md`. Nenhuma credencial é fornecida no repositório e a migration não foi aplicada neste ambiente; não habilitar para produção até configurar e validar todos esses pré-requisitos.

Não há upload de fotos no Mural. O conteúdo é texto simples; não se promete que filtros automáticos detectem todo abuso. Antes da abertura pública, publicar política de privacidade, canal de remoção e condições de uso. A equipe deve avaliar os casos sinalizados e denúncias.

## Conteúdo estático

Manter perguntas, respostas e eventos históricos em arquivos tipados em `src/data`, com identificadores estáveis e fontes revisadas. A estrutura da história nesta entrega não afirma marcos da era ARIRANG; o conteúdo será publicado após curadoria.
