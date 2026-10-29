"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./seoul-event.module.css";
export type GalleryPhoto = {
  id?: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  credit?: string;
  source?: string;
};
type GalleryOptions = {
  images: GalleryPhoto[];
  title?: string;
  subtitle?: string;
  label?: string;
  eyebrow?: string;
  edition?: string;
  initialLoading?: "eager" | "lazy";
};
export function EventCarousel({
  images,
  title = "Uma noite para guardar.",
  subtitle,
  label = "Fotografias do comeback em Seul",
  eyebrow = "MEMÓRIA VISUAL",
  edition = "SEUL / 2026",
  initialLoading = "eager",
}: GalleryOptions) {
  const [index, setIndex] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [scrollState, setScrollState] = useState({
    overflow: false,
    previous: false,
    next: false,
  });
  const selectedIndex = Math.min(index, Math.max(0, images.length - 1));
  const photo = images[selectedIndex];
  const move = (step: number) =>
    setIndex(
      (current) =>
        (Math.min(current, images.length - 1) + step + images.length) %
        images.length,
    );
  useEffect(() => {
    const element = strip.current;
    if (!element || !navigation.current) return;
    const container = navigation.current;
    const update = () => {
      // Measure the full rail independently of controls that shrink the strip.
      const children = Array.from(element.children) as HTMLElement[];
      const style = getComputedStyle(element);
      const contentWidth =
        children.reduce((width, child) => width + child.offsetWidth, 0) +
        Math.max(0, children.length - 1) * (parseFloat(style.columnGap) || 0) +
        parseFloat(style.paddingLeft) +
        parseFloat(style.paddingRight);
      setScrollState({
        overflow: contentWidth > container.clientWidth + 1,
        previous: element.scrollLeft > 1,
        next:
          element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, [images.length]);
  useEffect(() => {
    const element = strip.current;
    const active = element?.querySelector<HTMLButtonElement>(
      '[aria-current="true"]',
    );
    if (!element || !active) return;
    const left = active.offsetLeft;
    if (left < element.scrollLeft)
      element.scrollTo({ left, behavior: "instant" });
    else if (
      left + active.offsetWidth >
      element.scrollLeft + element.clientWidth
    )
      element.scrollTo({
        left: left + active.offsetWidth - element.clientWidth,
        behavior: "instant",
      });
  }, [selectedIndex, scrollState.overflow]);
  const scrollThumbnails = (direction: number) => {
    const element = strip.current;
    if (element)
      element.scrollBy({
        left: direction * element.clientWidth * 0.8,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  };
  if (!photo) return null;
  return (
    <section
      className={styles.gallery}
      aria-label={label}
      aria-roledescription="carrossel"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          if (images.length > 1) move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className={styles.galleryHeading}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <span className={styles.edition}>{edition}</span>
      </div>
      {subtitle && <p className={styles.gallerySubtitle}>{subtitle}</p>}
      <div
        className={styles.frame}
        tabIndex={0}
        aria-label="Use as setas do teclado para navegar pelas fotografias"
        onTouchStart={(event) => {
          touchStart.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }}
        onTouchCancel={() => {
          touchStart.current = null;
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (start && images.length > 1) {
            const delta = start.x - event.changedTouches[0].clientX;
            const vertical = start.y - event.changedTouches[0].clientY;
            if (Math.abs(delta) > 45 && Math.abs(delta) > Math.abs(vertical))
              move(delta > 0 ? 1 : -1);
          }
        }}
      >
        <div
          className={styles.slide}
          role="group"
          aria-roledescription="slide"
          aria-label={`${selectedIndex + 1} de ${images.length}`}
        >
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width:760px) calc(100vw - 40px), (max-width:996px) calc(100vw - 96px), 900px"
            loading={selectedIndex === 0 ? initialLoading : "lazy"}
          />
        </div>
        {images.length > 1 && (
          <>
            <button
              className={`${styles.imageArrow} ${styles.previousImage}`}
              type="button"
              aria-label="Fotografia anterior"
              onClick={() => move(-1)}
            >
              <ArrowLeft size={19} />
            </button>
            <button
              className={`${styles.imageArrow} ${styles.nextImage}`}
              type="button"
              aria-label="Próxima fotografia"
              onClick={() => move(1)}
            >
              <ArrowRight size={19} />
            </button>
          </>
        )}
      </div>
      <div ref={navigation} className={styles.thumbnailNavigation}>
        {scrollState.overflow && (
          <button
            className={styles.stripArrow}
            type="button"
            aria-label="Deslocar miniaturas para a esquerda"
            disabled={!scrollState.previous}
            onClick={() => scrollThumbnails(-1)}
          >
            <ArrowLeft size={17} />
          </button>
        )}
        <div
          ref={strip}
          className={styles.thumbnails}
          role="group"
          aria-label="Escolher fotografia"
        >
          {images.map((item, i) => (
            <button
              className={styles.thumbnail}
              key={item.src}
              type="button"
              aria-label={`Ver fotografia ${i + 1}`}
              aria-current={i === selectedIndex ? "true" : undefined}
              onClick={() => setIndex(i)}
            >
              <Image
                src={item.src}
                alt=""
                fill
                sizes="(max-width:760px) 64px, 88px"
              />
            </button>
          ))}
        </div>
        {scrollState.overflow && (
          <button
            className={styles.stripArrow}
            type="button"
            aria-label="Deslocar miniaturas para a direita"
            disabled={!scrollState.next}
            onClick={() => scrollThumbnails(1)}
          >
            <ArrowRight size={17} />
          </button>
        )}
      </div>
      <div className={styles.captionRow}>
        <div aria-live="polite" aria-atomic="true">
          {photo.caption && <p className={styles.caption}>{photo.caption}</p>}
          {(photo.credit || photo.source) && (
            <p className={styles.credit}>
              {photo.credit}
              {photo.credit && photo.source ? " · " : ""}
              {photo.source && (
                <a href={photo.source} target="_blank" rel="noreferrer">
                  Fonte da imagem ↗
                </a>
              )}
            </p>
          )}
        </div>
        <span
          className={styles.counter}
          aria-live={photo.caption ? undefined : "polite"}
        >
          {String(selectedIndex + 1).padStart(2, "0")}{" "}
          <span>/ {String(images.length).padStart(2, "0")}</span>
        </span>
      </div>
    </section>
  );
}
