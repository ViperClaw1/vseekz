"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ponytail: баннеры статичные; из API — когда появится рекламный кабинет.
const slides = [
  { src: "/banners/banner-1.png", alt: "Разместите заголовок — рекламный баннер" },
  { src: "/banners/banner-2.png", alt: "Разместите заголовок — рекламный баннер" },
];
const INTERVAL_MS = 5000;

export function BannerCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (i: number) => {
    const track = trackRef.current;
    track?.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => goTo((active + 1) % slides.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [active, paused]);

  return (
    <section
      aria-roledescription="карусель"
      aria-label="Реклама"
      className="flex flex-col gap-2"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ul
        ref={trackRef}
        onScroll={(e) => {
          const t = e.currentTarget;
          setActive(Math.round(t.scrollLeft / t.clientWidth));
        }}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-xl [scrollbar-width:none]"
      >
        {slides.map((s, i) => (
          <li
            key={s.src}
            aria-roledescription="слайд"
            aria-label={`${i + 1} из ${slides.length}`}
            className="relative aspect-[354/135] w-full shrink-0 snap-center"
          >
            <Image src={s.src} alt={s.alt} fill priority={i === 0} sizes="(max-width: 480px) 100vw, 480px" className="object-cover" />
          </li>
        ))}
      </ul>

      <div className="flex justify-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Слайд ${i + 1}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === active ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/50",
            )}
          />
        ))}
      </div>
    </section>
  );
}
