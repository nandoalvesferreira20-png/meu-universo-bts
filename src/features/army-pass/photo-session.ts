import type { PersonalPhoto } from "./types";

// Controla a propriedade das URLs e invalida leituras que terminam após remoção,
// troca de arquivo ou saída da página. Não armazena os dados fora da memória.
export class PhotoSession {
  private generation = 0;
  private currentUrl: string | null = null;
  constructor(
    private readonly revoke = (url: string) => URL.revokeObjectURL(url),
  ) {}
  begin() {
    return ++this.generation;
  }
  isCurrent(generation: number) {
    return this.generation === generation;
  }
  accept(generation: number, photo: PersonalPhoto) {
    if (!this.isCurrent(generation)) {
      this.revoke(photo.url);
      return false;
    }
    if (this.currentUrl) this.revoke(this.currentUrl);
    this.currentUrl = photo.url;
    return true;
  }
  clear() {
    this.generation++;
    if (this.currentUrl) this.revoke(this.currentUrl);
    this.currentUrl = null;
  }
}
