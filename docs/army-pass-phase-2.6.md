# Army Pass — Fase 2.6: galeria por era

## Resultado e estado das fotografias

Cada era pública mantém um único template e recebe uma galeria separada, limitada a três fotografias. A seleção atualiza a prévia usando o renderizador Canvas já existente; zoom e posição da foto do grupo permanecem independentes do retrato pessoal. Trocar de era guarda a seleção e o recorte válidos daquela era, sem alterar o formulário ou a foto pessoal.

O manifesto `eraPhotoManifest` em `src/features/army-pass/themes.ts` publica três fotografias WINGS locais. O responsável pelo projeto confirmou autorização para uso e distribuição no Army Pass em 2026-10-25. Cada entrada tem ID estável, texto alternativo, crédito, origem, status/referência de autorização e crop inicial. `photosForEra` valida o caminho por era e limita o resultado a três. As outras galerias permanecem vazias até haver arquivos correspondentes.

## Fotografias WINGS no repositório

Os arquivos já estavam na pasta pública da galeria e foram registrados sem cópia ou conversão.

| Arquivo        | Formato |     Resolução |       Tamanho |
| -------------- | ------- | ------------: | ------------: |
| `wings-01.jpg` | JPEG    |     900 × 889 | 128.244 bytes |
| `wings-02.jpg` | JPEG    | 1.200 × 1.186 | 540.686 bytes |
| `wings-03.jpg` | JPEG    | 2.568 × 1.806 | 999.562 bytes |

O catálogo identifica a origem como arquivos fornecidos pelo responsável do projeto e exibe “BTS · WINGS — arquivo fornecido pelo responsável do projeto” como crédito. A autorização para este uso foi confirmada pelo responsável do projeto.

## Como incluir fotos autorizadas

1. Adicionar até três fotografias da era em `public/images/army-pass/gallery/<pasta-da-era>/`.
2. Adicionar cada entrada explicitamente a `eraPhotoManifest`, com ID estável, era correta, caminho local, texto alternativo, crédito, fonte, autorização e `initialCrop`. Não construir caminhos dinamicamente nem reutilizar fotos de outra era.
3. Conferir a existência dos arquivos, o enquadramento, a prévia e o PNG 1080 × 1920. Não ampliar artificialmente as imagens.

Diretórios: `public/images/army-pass/gallery/wings/`, `map-of-the-soul-7/`, `persona/` e `arirang/`. A galeria de WINGS e a exportação estão funcionais; as outras três eras continuam funcionando com seu fundo padrão enquanto suas fotografias não forem adicionadas.
