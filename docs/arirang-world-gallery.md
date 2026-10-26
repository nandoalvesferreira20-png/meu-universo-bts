# Galeria mundial ARIRANG — etapa 3

Os 12 arquivos fornecidos foram utilizados sem alterações, conversão ou renomeação. Fontes, créditos, datas e cidades não foram presumidos. Os nomes de arquivo foram mantidos, mas não usados como comprovação de localização.

| Arquivo | Formato real | Dimensões |
| --- | --- | --- |
| goyang-tour01.jpg | JPEG | 1200 × 800 |
| tour-02-tokyo.webp | WEBP | 1170 × 780 |
| tour-03-tokyo-stage.webp | WEBP | 1200 × 800 |
| tour-04-london.jpg | JPEG | 2000 × 1333 |
| tour-05-buenos-aires.jpg | JPEG | 1600 × 1067 |
| tour-06-bogota.webp | WEBP | 1200 × 750 |
| tour-07-madrid.jpg | JPEG | 1920 × 1081 |
| tour-08-paris-swim.jpg | JPEG | 1920 × 1081 |
| tour-09-mexico.jpg | JPEG | 1289 × 860 |
| tour-10-los-angeles.jpg | JPEG | 1200 × 801 |
| tour-11-paris-stadium.jpg | JPEG | 1920 × 1080 |
| tour-12-los | JPEG | 3000 × 2001 |

`tour-12-los` não tem extensão, mas contém JPEG válido. Seu caminho público foi mantido exatamente como fornecido.

Dados: `src/data/arirang-world-gallery.ts`. Apresentação: `WorldTourGallery`, reutilizando `EventCarousel` com opções editoriais. Os valores padrão da galeria Netflix foram preservados. As fotos mundiais não recebem legendas ou créditos sem metadados comprovados; os textos alternativos descrevem apenas o conteúdo visual.

O item São Paulo foi separado da lista mensal somente para inserir a galeria antes dele, reutilizando o mesmo markup de parada e os mesmos estilos. Os 25 registros, 62 datas, status, textos e layout do bloco brasileiro permanecem.

Next Image produz miniaturas e imagens principais responsivas sob demanda. A galeria mundial carrega a foto principal com lazy loading; não monta as 12 versões grandes simultaneamente. Nenhum derivado foi salvo no repositório.

Capturas de validação: `test-artifacts/world-tour/desktop.png`, `tablet.png` e `mobile.png`.
