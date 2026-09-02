"use client";

import { GripVertical } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import { VehicleInferenceOverlay } from "./vehicle-inference-overlay";

const MIN_REVEAL = 8;
const MAX_REVEAL = 92;
const KEYBOARD_STEP = 3;
export function clampReveal(value: number) {
  return Math.min(MAX_REVEAL, Math.max(MIN_REVEAL, value));
}

export function ModelVisionComparison() {
  const [reveal, setReveal] = useState(52);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const modelVisibility = reveal / 100;

  const updateReveal = (event: ChangeEvent<HTMLInputElement>) => {
    setReveal(clampReveal(Number(event.target.value)));
  };

  const handleSliderKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    let nextValue: number | undefined;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      nextValue = reveal - KEYBOARD_STEP;
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      nextValue = reveal + KEYBOARD_STEP;
    } else if (event.key === "Home") {
      nextValue = MIN_REVEAL;
    } else if (event.key === "End") {
      nextValue = MAX_REVEAL;
    }

    if (nextValue !== undefined) {
      event.preventDefault();
      setReveal(clampReveal(nextValue));
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="model-vision-heading"
      className="relative border-t border-border bg-surface px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
      id="model-view"
    >
      <div className="model-view-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto w-full max-w-[1320px]">
        <div className="mb-10 grid gap-7 border-l border-accent pl-5 sm:mb-14 sm:pl-7 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              02 / Model vision
            </p>
            <h2
              className="max-w-4xl text-balance text-[clamp(2.6rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.06em]"
              id="model-vision-heading"
            >
              You see a car. <span className="text-secondary-text">The model sees data.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-secondary-text sm:text-base sm:leading-7">
            Drag across the image to reveal the detections behind the photograph.
          </p>
        </div>

        <figure>
          <div className="comparison-frame relative aspect-[1731/909] touch-none overflow-hidden border border-border bg-background">
            <Image
              alt="A graphite sedan photographed on a quiet street at dusk"
              className="select-none object-cover"
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, 1320px"
              src="/images/model-vision-vehicle.png"
            />

            <div
              className="model-view-active absolute inset-0 z-10 overflow-hidden"
              data-testid="model-view-layer"
              style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
            >
              <Image
                alt=""
                aria-hidden="true"
                className="select-none object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 1320px"
                src="/images/model-vision-vehicle.png"
              />
              <div className="absolute inset-0 bg-background/16" />
              <div className="model-scan-grid absolute inset-0 opacity-40" />

              <VehicleInferenceOverlay
                modelVisibility={modelVisibility}
                reducedMotion={reducedMotion}
                isInView={isInView}
              />

            </div>

            <div className="pointer-events-none absolute left-4 top-4 z-20 bg-background/82 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-primary-text backdrop-blur-sm sm:left-5 sm:top-5">
              Model view
            </div>
            <div className="pointer-events-none absolute right-4 top-4 z-20 bg-background/82 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-primary-text backdrop-blur-sm sm:right-5 sm:top-5">
              Reality
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 top-0 z-20 w-px bg-accent shadow-[0_0_16px_rgba(255,181,71,0.65)]"
              style={{ left: `${reveal}%` }}
            >
              <span className="comparison-handle absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center border border-accent bg-background text-accent shadow-[0_0_24px_rgba(11,13,15,0.8)] sm:size-12">
                <GripVertical size={17} strokeWidth={1.5} />
              </span>
            </div>

            <input
              aria-describedby="comparison-help"
              aria-label="Reveal model view"
              aria-valuetext={`${reveal}% model view revealed`}
              className="comparison-range absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0 outline-none"
              max={MAX_REVEAL}
              min={MIN_REVEAL}
              onChange={updateReveal}
              onKeyDown={handleSliderKeyDown}
              step="1"
              type="range"
              value={reveal}
            />
          </div>

          <figcaption className="mt-4 flex flex-col gap-3 font-mono text-[9px] uppercase tracking-[0.15em] text-secondary-text sm:flex-row sm:items-center sm:justify-between">
            <span id="comparison-help">Drag, tap, or use the arrow keys</span>
            <span aria-hidden="true">01 Vehicle · 01 Plate · OCR · Body type</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
