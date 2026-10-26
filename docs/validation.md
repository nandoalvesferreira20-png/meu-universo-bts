# Validação da Fase 1

Verificações executadas em 24/10/2026:

- `npm run lint`: passou, sem avisos.
- `npm run typecheck`: passou, com TypeScript strict habilitado.
- `npm run format:check`: passou.
- `npm run build`: passou, gerando a home, todas as páginas públicas e oito categorias de quiz. A primeira tentativa em sandbox compilou, mas não conseguiu criar o processo do TypeScript (`spawn EPERM`); o build completo passou ao executar com autorização fora dessa restrição.
- Verificação HTTP local do build: 17 páginas previstas responderam 200; rota inexistente respondeu 404; categoria inválida respondeu 404 após cache. Na primeira requisição retornou HTTP 200 por início do streaming; a verificação final confirmou conteúdo de página não encontrada e `noindex` nas duas rotas inválidas.
- Links internos: 304 ocorrências de links foram conferidas no HTML das páginas, todas apontando para rotas previstas.
- Estrutura HTML: idioma `pt-BR`, região principal e link de pular para o conteúdo em todas as páginas verificadas. Menu usa botão com nome acessível, `aria-expanded`, Escape e retorno de foco. Estados de carregamento usam `role=status`; falhas usam `role=alert`. Estilos incluem foco visível e preferência de movimento reduzido.
- Responsividade implementada com grades adaptativas e breakpoints em 1100, 760 e 380 px. Imagens externas e downloads de fontes não são necessários.

## Limites

O ambiente não disponibilizou navegador conectado (inventário vazio). Não foram executados testes visuais, interação do menu, leitor de tela, axe/Lighthouse ou medição de overflow em viewports reais. Esses pontos devem ser conferidos antes da publicação, incluindo desktop e larguras de 320, 375, 768 e 1440 px.

Contraste calculado pela fórmula WCAG: texto profundo sobre off-white 14,60:1; texto secundário sobre off-white 5,51:1, branco 5,80:1 e lavanda 4,72:1; branco sobre roxo 7,11:1; roxo sobre lavanda 5,78:1. Isso não substitui a auditoria visual de todos os estados. Nenhum teste é declarado aprovado sem execução.
