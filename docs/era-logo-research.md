# Pesquisa de identidades das eras

Consulta realizada em 24/10/2026. Fontes primárias do domínio oficial `bts.ibighit.com`, acessíveis durante a pesquisa. Os endereços antigos em `ibighit.com/bts/...` retornaram erro de acesso; foram usados os endereços atuais abaixo.

## Origem e autorização

| Era             | Referência autêntica localizada                                                                                                                                                                                                                                                                                                                                                           | Situação do arquivo e licença                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WINGS           | [Página oficial](https://bts.ibighit.com/eng/discography/detail/wings.html) e [capa na infraestrutura oficial](https://bts.ibighit.com/images/bts/discography/wings/album-cover.jpg)                                                                                                                                                                                                      | Identidade presente no material oficial. Não foi localizado pacote de logo com autorização de reutilização para o portal/PNG. **Pendente**.                   |
| MAP OF THE SOUL | [MAP OF THE SOUL : 7](https://bts.ibighit.com/eng/discography/detail/map_of_the_soul-7.html), [capa de 7](https://bts.ibighit.com/images/bts/discography/map_of_the_soul-7/img01.jpg), [PERSONA](https://bts.ibighit.com/eng/discography/detail/map_of_the_soul-persona.html) e [capa de PERSONA](https://bts.ibighit.com/images/bts/discography/map_of_the_soul-persona/album-cover.jpg) | A série possui edições distintas; o símbolo de 7 não foi tratado como logo universal da série. Falta definir o asset exato e obter autorização. **Pendente**. |
| BE              | [Página oficial](https://bts.ibighit.com/eng/discography/detail/be.html) e [capa na infraestrutura oficial](https://bts.ibighit.com/images/bts/discography/be/rwXJxHlQ87gEiJJynB1pmScl.jpg)                                                                                                                                                                                               | Identidade documentada no material oficial; não foi localizada licença de reutilização aplicável ao gerador. **Pendente**.                                    |
| ARIRANG         | [Página oficial](https://bts.ibighit.com/eng/discography/detail/arirang/index.html), que referencia diretamente [logo.png](https://bts.ibighit.com/images/bts/discography/bts/arirang/ui/logo.png)                                                                                                                                                                                        | Arquivo identificado pela própria página como logo. Sua disponibilidade pública não trouxe autorização verificável para reutilização. **Pendente**.           |

Responsável indicado pelas fontes: BIGHIT MUSIC; páginas históricas usam a identificação Big Hit Entertainment. A titularidade específica de cada desenho, os créditos finais e as condições de uso precisam ser confirmados na autorização. Não se atribuiu uma licença aberta, nem titularidade exclusiva sem documentação.

Nas páginas consultadas não foi encontrada autorização expressa que cobrisse este portal independente, distribuição dos arquivos ou incorporação nos PNGs de fãs. Isso registra o resultado da pesquisa, não uma conclusão sobre a existência de autorizações em outros canais.

**Nenhum arquivo oficial foi copiado para `public`, redesenhado, vetorizado, recortado de capas ou apresentado como arte autoral.** As URLs acima documentam a origem; não são usadas para carregar imagens no produto.

## Configuração e fallback

Cada entrada de `eraThemes` em `src/features/army-pass/themes.ts` centraliza ID, nome, paleta e o objeto `logo`: caminho, crédito, fonte, responsável, referência de autorização, condições e posição/dimensão recomendadas no Canvas 1080 × 1920.

No estado entregue, todas têm `status: "pending-authorization"` e `path: null`. O placeholder é a assinatura tipográfica da era no template, feita com fontes comuns do sistema, sem simular um wordmark oficial. Não existe selo de “oficial” ou “licenciado”.

`authorizedLogoPath` só habilita arquivos locais PNG/SVG na pasta de logos quando há status autorizado, referência de autorização, origem HTTPS, crédito e condições preenchidos. `prepareEraLogo` não requisita arquivos pendentes e usa fallback quando um autorizado está ausente ou não pode ser decodificado. O renderizador preserva proporção e cores originais do asset, usando encaixe `contain`, sem efeitos ou distorção. O crédito aparece discretamente no PNG quando um logo é desenhado.

## Adicionar um asset após autorização

1. Confirmar o desenho/edição exatos, titularidade, crédito e condições que cubram tanto a prévia quanto o PNG para download/compartilhamento.
2. Guardar a comprovação em local privado da equipe. O código público recebe apenas uma referência interna sem dados pessoais ou contratos.
3. Adicionar o arquivo original autorizado em `public/images/army-pass/logos/`. Nomes previstos: `wings.svg`, `map-of-the-soul.svg`, `be.svg`, `arirang.svg`. Se o original for PNG, usar `.png`; não trocar a extensão ou converter automaticamente. Validar SVGs para remover scripts e referências externas antes de publicá-los.
4. Preencher a configuração da era. Exemplo de estrutura, que não corresponde a um arquivo autorizado incluído nesta entrega:

```ts
logo: {
  status: "authorized",
  path: "/images/army-pass/logos/wings.png",
  credit: "Crédito final aprovado",
  source: "https://fonte-oficial-do-asset.example/",
  rightsHolder: "Titular confirmado na autorização",
  authorizationReference: "referencia-interna-sem-dados-privados",
  usageConditions: "Condições aprovadas para prévia e PNG compartilhável",
  placement: { x: 830, y: 168, width: 160, height: 100 },
}
```

5. Conferir visualmente o contraste e a área reservada sem recolorir o logo. Executar testes e comparar prévia/PNG. A área recomendada é um limite de encaixe, não uma instrução para esticar a imagem.

O teste positivo utiliza exclusivamente um retângulo sintético criado durante o teste, injetado pelo loader. Não há arquivos oficiais de exemplo nem autorização fictícia no manifesto de produção.
