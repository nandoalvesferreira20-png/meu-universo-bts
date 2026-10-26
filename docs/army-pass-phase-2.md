# Army Pass — Fase 2

> Atualização: a [Fase 2.2](army-pass-phase-2.2.md) substitui a seleção das 12 artes por um template por era, WINGS aprovado e duas fotografias independentes. As descrições anteriores abaixo registram a evolução do projeto e são superadas por esse guia no gerador atual.

## Funcionamento

`/army-pass` contém quatro etapas: era, personalização, revisão e exportação. O reducer mantém os dados, a foto pessoal e seu recorte ao voltar ou trocar de era. A foto só é descartada quando substituída, removida ou ao sair da página. Recarregar a página reinicia a sessão; não há armazenamento persistente.

Todos os controles ficam fora do desenho exportado. A prévia usa um Canvas com resolução interna de 1080 × 1920; a exportação desenha um Canvas novo usando a mesma função `drawArmyPass`, a mesma imagem decodificada, os mesmos parâmetros e as fontes locais disponíveis no dispositivo. Não há captura de tela de HTML, chamadas a APIs ou bibliotecas de exportação que dependam de CSS externo.

## Quatro composições

| Era             | Composição                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------ |
| WINGS           | Papel escuro, borda dupla dourada, título serifado e moldura em arco                             |
| MAP OF THE SOUL | Fundo azul/lilás, título em duas linhas, curvas e janela arredondada horizontal                  |
| BE              | Papel creme, tipografia serifada ampla, separadores delicados e imagem com margem de impressão   |
| ARIRANG         | Fundo vinho, faixa lateral com título rotacionado, janela assimétrica e nome em tipografia forte |

Cada era oferece três artes SVG originais em `artwork.ts`. Elas não reproduzem capas, marcas ou retratos oficiais. As cores e nomes ficam centralizados em `themes.ts`. Os temas preservam a identidade do portal ao redor do editor.

## Três origens de imagem

- **Arte da Era:** funciona desde a primeira visita, sem foto ou cadastro. As três opções atualizam a prévia imediatamente.
- **Minha Foto:** seleção local de JPEG, PNG ou WebP, com validação de assinatura binária, decodificação real e limite de 10 MB. Um limite adicional de 40 megapixels reduz pressão de memória. A imagem é redimensionada para no máximo 2400 px no maior lado, redesenhada em Canvas e guardada apenas em uma object URL temporária. Não se conserva o arquivo original nem seus metadados no PNG. `createImageBitmap` usa orientação EXIF `from-image`; navegadores atuais com fallback `Image` aplicam a orientação na decodificação. Zoom de 1 a 3 e posições de 0 a 100% definem um recorte proporcional à moldura, sem esticar a imagem.
- **Galeria da Era:** manifesto inicialmente vazio, sem imagens fictícias ou baixadas da internet. Ao receber fotos autorizadas, oferece miniaturas, seleção e ampliação em diálogo. A era atual já funciona como filtro. Imagens indisponíveis têm estado de erro; exportar uma imagem que falhou produz mensagem recuperável. Ao trocar de era enquanto usa a galeria, a fonte volta para Arte da Era. A foto pessoal permanece em memória.

Alternar entre as três fontes não apaga os campos nem remove a foto pessoal. Caso a fonte selecionada não tenha imagem, a prévia mostra uma arte provisória com aviso; é necessário escolher uma fonte válida antes de avançar. Não existe exportação silenciosa de uma imagem diferente da escolhida.

## Inserir fotografias autorizadas

1. Obter e documentar autorização, créditos e descrição. Não colocar contratos ou dados privados na pasta pública ou no manifesto enviado ao navegador; usar apenas uma referência interna sem dados sensíveis.
2. Adicionar arquivos JPEG, PNG ou WebP, com nomes simples sem espaços, nas pastas existentes:
   - `public/images/army-pass/wings/`
   - `public/images/army-pass/map-of-the-soul/`
   - `public/images/army-pass/be/`
   - `public/images/army-pass/arirang/`
3. Adicionar uma entrada em `eraPhotoManifest`, em `src/features/army-pass/themes.ts`. Exemplo de estrutura, sem arquivo incluído nesta entrega:

```ts
{
  id: "wings-foto-01",
  era: "wings",
  path: "/images/army-pass/wings/foto-01.jpg",
  description: "Descrição acessível da fotografia autorizada",
  credit: "Crédito aprovado pela autoria",
  authorization: { approved: true, reference: "autorizacao-interna-01" },
}
```

4. Conferir o arquivo e as permissões, executar os testes, testar seleção/ampliação e inspecionar o PNG com o crédito. `photosForEra` rejeita caminhos externos, referências a outras eras, SVGs e entradas sem crédito/autorização. O crédito é incluído no PNG.

## Validação e composição

Zod valida nome/apelido obrigatório de até 30 caracteres; cidade até 60; UF brasileira; bias; música até 80; ano entre 2013 e o ano atual (ou vazio); experiência; mensagem até 140. Os campos opcionais vazios não geram rótulos no PNG. “Prefiro não informar” também não aparece. O layout reorganiza os detalhes conforme os campos preenchidos. Textos são medidos, quebrados por grafema e ajustados para caber, sem HTML e sem reticências. Muitas quebras manuais são redistribuídas quando necessário.

O uso de Canvas preserva diferenças entre as quatro molduras e evita CORS de imagens externas. A tipografia depende das fontes do sistema, incluindo suporte local a emojis e caracteres coreanos; pode variar entre sistemas, mas a prévia e o PNG no mesmo aparelho usam o mesmo desenho.

## Download, compartilhamento e privacidade

Ao entrar na etapa final, o PNG é preparado após `document.fonts.ready` e o carregamento da imagem. O arquivo se chama `army-pass-[era].png`. Só é oferecido download depois de a geração terminar; falhas têm opção de repetir ou editar.

A Web Share API só aparece quando `navigator.canShare({ files })` confirma suporte ao arquivo. O arquivo já está pronto antes do clique para preservar a ativação exigida por navegadores móveis. Cancelar não apaga o passaporte. Sem suporte ou em caso de falha, o download permite compartilhamento manual. A API pode exigir contexto seguro (HTTPS ou localhost), e não há publicação direta em Stories.

Dados e fotos não entram em URLs, analytics, storage, formulários de rede ou servidores. O compartilhamento só entrega o arquivo às opções do aparelho após um clique explícito. O nome digitado não compõe o nome do arquivo. `PhotoSession` revoga a URL anterior e invalida leituras atrasadas ao substituir/remover/sair. Bitmaps são fechados, URLs de entrada são revogadas no fallback e URLs de download são liberadas após dez segundos.

## Arquivos desta fase

- `src/app/army-pass/page.tsx`: conecta a experiência real ao layout existente.
- `src/features/army-pass/army-pass-builder.tsx`: fluxo e sessão local.
- `src/features/army-pass/state.ts`, `types.ts`, `themes.ts`: estado, contratos, paletas e manifesto.
- `src/features/army-pass/era-selector.tsx`: EraSelector e EraThemeCard.
- `src/features/army-pass/army-pass-form.tsx`: formulário e mensagens de validação.
- `src/features/army-pass/photo-source-selector.tsx`: PhotoSourceSelector, EraPhotoGallery, PersonalPhotoUploader e EraArtworkGallery.
- `src/features/army-pass/photo-cropper.tsx`: recorte e ajustes por teclado.
- `src/features/army-pass/photo-session.ts`, `image-processing.ts`: recursos temporários, validação e processamento.
- `src/features/army-pass/artwork.ts`: 12 artes SVG.
- `src/features/army-pass/renderer.ts`: desenho das quatro composições.
- `src/features/army-pass/army-pass-preview.tsx`: ArmyPassPreview e ArmyPassTemplate.
- `src/features/army-pass/export.ts`: geração PNG, download e detecção de compartilhamento.
- `src/features/army-pass/army-pass-exporter.tsx`: ArmyPassExporter e ArmyPassShareActions.
- `src/features/army-pass/army-pass.module.css`: estilos isolados do editor.
- `src/lib/validation.ts`: contrato Zod atualizado.
- `tests/army-pass.test.ts`: testes de lógica, rasterização e APIs adaptadas.
- `public/images/army-pass/*/.gitkeep`: diretórios preparados, sem fotos.
- `src/app/page.tsx` e `src/components/experience.tsx`: apenas avisos da home atualizados para a disponibilidade do Army Pass.
- `package.json`, `package-lock.json`, `.gitignore`, README e documentação: comandos de teste, dependências de teste e instruções.

## Executar

```sh
npm install
npm run dev
# http://localhost:3000/army-pass

npm test
npm run lint
npm run typecheck
npm run format:check
npm run build
npm run start
```

No PowerShell com restrição de scripts, usar `npm.cmd`. `tsx` e `@napi-rs/canvas` são dependências de desenvolvimento para testes; o gerador no navegador não depende delas.

## Testes e limites

Resultados e checklist de verificação manual em `docs/validation-phase-2.md`. Sem Supabase, deploy, novas branches ou implementação das demais experiências.
