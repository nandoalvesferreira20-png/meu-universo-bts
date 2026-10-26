import { worldTourPhotos } from "@/data/arirang-world-gallery";
import { EventCarousel } from "./event-carousel";
import styles from "./world-tour-gallery.module.css";

export function WorldTourGallery() {
  return (
    <div className={styles.section}>
      <EventCarousel
        images={worldTourPhotos}
        label="Fotografias da ARIRANG WORLD TOUR"
        eyebrow="MEMÓRIA VISUAL / ARIRANG WORLD TOUR"
        title="Momentos que ficaram para a história."
        subtitle="De palco em palco, a ARIRANG WORLD TOUR reuniu performances, emoções e encontros inesquecíveis. Uma seleção de registros que contam um pouco dessa jornada pelo mundo."
        edition="PELO MUNDO / 2026"
        initialLoading="lazy"
      />
    </div>
  );
}
