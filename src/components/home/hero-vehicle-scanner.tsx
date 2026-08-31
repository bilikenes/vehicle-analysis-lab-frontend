"use client";

import dynamic from "next/dynamic";
import {
  ArrowUpRight,
  Check,
  FileImage,
  ScanLine,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type DragEvent,
  type ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { SceneFallback } from "@/components/home/scene-fallback";
import { isSupportedVehicleImage } from "@/features/upload/vehicle-image";

const ThreeDVehicleScene = dynamic(
  () => import("@/components/home/three-d-vehicle-scene"),
  {
    loading: () => <SceneFallback />,
    ssr: false,
  },
);

type UploadState =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "ready"; fileName: string };

function DetectionTag({
  active,
  children,
  className,
}: {
  active: boolean;
  children: React.ReactNode;
  className: string;
}) {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 5 }}
      className={`absolute z-20 border border-border bg-background/90 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary-text backdrop-blur-sm ${className}`}
      initial={false}
      transition={{ duration: 0.28 }}
    >
      {children}
    </motion.div>
  );
}

export function HeroVehicleScanner() {
  const reduceMotion = useReducedMotion() ?? false;
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [scanStep, setScanStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({ kind: "idle" });

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const timers = [
      window.setTimeout(() => setScanStep(1), 1200),
      window.setTimeout(() => setScanStep(2), 2050),
      window.setTimeout(() => setScanStep(3), 2820),
      window.setTimeout(() => setScanStep(4), 3520),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [reduceMotion]);

  const acceptFile = (file?: File) => {
    if (!file) {
      return;
    }

    if (!isSupportedVehicleImage(file)) {
      setUploadState({
        kind: "error",
        message: "Choose a JPG, PNG, or WEBP image.",
      });
      return;
    }

    setUploadState({ kind: "ready", fileName: file.name });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    acceptFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    if (event.dataTransfer.types.includes("Files")) {
      dragDepth.current += 1;
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  };

  const effectiveScanStep = reduceMotion ? 4 : scanStep;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate min-h-[100svh] px-5 pb-8 pt-5 sm:px-8 sm:pt-7 lg:px-12"
      id="hero"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
        <div className="hero-atmosphere absolute inset-0 -z-20" />
        <div className="hero-grid absolute inset-0 -z-10 opacity-60" />

        <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between">
          <a
            className="inline-flex items-center gap-3 text-sm font-medium tracking-[-0.02em] outline-none focus-visible:ring-2 focus-visible:ring-accent"
            href="#hero"
          >
            <span className="grid size-8 place-items-center border border-border bg-surface/80 font-mono text-[10px] text-accent">
              VA
            </span>
            Vehicle Analysis Lab
          </a>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-secondary-text sm:block">
            Visual intelligence / 01
          </p>
        </header>

        <div className="mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-[1440px] items-center gap-8 py-10 lg:grid-cols-[minmax(19rem,0.72fr)_minmax(32rem,1.28fr)] lg:py-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-xl lg:pb-8"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-secondary-text">
              <span className="h-px w-9 bg-accent" />
              Image to structured data
            </p>
            <h1
              className="text-balance text-[clamp(3.4rem,8vw,7.5rem)] font-medium leading-[0.84] tracking-[-0.072em]"
              id="hero-heading"
            >
              See what the <span className="text-secondary-text">model</span> sees.
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-secondary-text sm:text-lg">
              Upload a vehicle image and turn it into structured data.
            </p>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button
                className="group inline-flex min-h-12 items-center gap-5 bg-accent px-5 text-sm font-semibold text-background outline-none transition-[background-color,transform] hover:bg-primary-text focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background active:translate-y-px"
                onClick={() => inputRef.current?.click()}
                type="button"
              >
                <Upload aria-hidden="true" size={16} strokeWidth={1.8} />
                Analyze a vehicle
                <ArrowUpRight
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  size={15}
                />
              </button>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-secondary-text">
                JPG · PNG · WEBP
              </span>
              <input
                ref={inputRef}
                accept="image/jpeg,image/png,image/webp"
                aria-label="Choose a vehicle image"
                className="sr-only"
                onChange={handleInputChange}
                type="file"
              />
            </div>

            <div aria-live="polite" className="mt-5 min-h-6">
              {uploadState.kind === "ready" ? (
                <p className="flex max-w-md items-center gap-2 text-sm text-success">
                  <Check aria-hidden="true" size={15} />
                  <span className="truncate">{uploadState.fileName}</span>
                  <span className="text-secondary-text">is ready.</span>
                </p>
              ) : null}
              {uploadState.kind === "error" ? (
                <p className="text-sm text-accent">{uploadState.message}</p>
              ) : null}
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className={`vehicle-stage relative min-h-[25rem] overflow-hidden border bg-surface/20 transition-colors sm:min-h-[31rem] lg:min-h-[43rem] ${
              isDragging ? "border-accent" : "border-border/70"
            }`}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.8 }}
          >
            <div className="pointer-events-none absolute inset-3 z-20 border border-border/40" />
            <div className="pointer-events-none absolute left-5 top-5 z-30 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-secondary-text">
              <ScanLine aria-hidden="true" className="text-accent" size={13} />
              {effectiveScanStep < 4 ? "Vehicle scan / active" : "Vehicle scan / complete"}
            </div>
            <div className="pointer-events-none absolute right-5 top-5 z-30 font-mono text-[9px] uppercase tracking-[0.18em] text-secondary-text">
              {String(Math.min(effectiveScanStep * 25, 100)).padStart(3, "0")} / 100
            </div>

            <div aria-hidden="true" className="absolute inset-0">
              <ThreeDVehicleScene reduceMotion={reduceMotion} />
            </div>
            <p className="sr-only">
              A brand-neutral graphite vehicle is scanned for its vehicle region, license plate,
              OCR text, and body type.
            </p>

            {!reduceMotion && effectiveScanStep < 4 ? (
              <motion.div
                animate={{ left: "112%" }}
                className="scanner-plane pointer-events-none absolute bottom-[13%] top-[13%] z-10 w-24 -translate-x-1/2"
                initial={{ left: "-12%" }}
                transition={{ duration: 3.45, ease: [0.55, 0.05, 0.25, 1] }}
              >
                <span className="absolute left-1/2 top-0 h-full w-px bg-accent shadow-[0_0_18px_var(--accent)]" />
              </motion.div>
            ) : null}

            <motion.div
              animate={{ opacity: effectiveScanStep >= 1 ? 1 : 0 }}
              className="pointer-events-none absolute left-[14%] top-[31%] z-10 h-[38%] w-[72%] border border-primary-text/45"
              initial={false}
            >
              <span className="absolute -left-px -top-px size-2 border-l-2 border-t-2 border-primary-text" />
              <span className="absolute -right-px -top-px size-2 border-r-2 border-t-2 border-primary-text" />
              <span className="absolute -bottom-px -left-px size-2 border-b-2 border-l-2 border-primary-text" />
              <span className="absolute -bottom-px -right-px size-2 border-b-2 border-r-2 border-primary-text" />
            </motion.div>

            <motion.div
              animate={{ opacity: effectiveScanStep >= 2 ? 1 : 0 }}
              className="pointer-events-none absolute left-[66%] top-[57%] z-10 h-[5%] min-h-4 w-[12%] border border-accent"
              initial={false}
            />

            <DetectionTag active={effectiveScanStep >= 1} className="left-[14%] top-[25%]">
              01 / Vehicle detected
            </DetectionTag>
            <DetectionTag active={effectiveScanStep >= 2} className="left-[66%] top-[63.5%] text-accent">
              02 / Plate
            </DetectionTag>
            <DetectionTag active={effectiveScanStep >= 3} className="right-[8%] top-[42%]">
              OCR / 34 VAL 026
            </DetectionTag>
            <DetectionTag active={effectiveScanStep >= 4} className="bottom-[14%] left-[15%]">
              Body / Sedan
            </DetectionTag>

            <div className="pointer-events-none absolute bottom-5 right-5 z-30 font-mono text-[9px] uppercase tracking-[0.18em] text-secondary-text">
              Studio / Graphite
            </div>

            <AnimatePresence>
              {isDragging ? (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-40 grid place-items-center bg-background/86 backdrop-blur-[2px]"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                >
                  <div className="border border-accent bg-surface px-8 py-7 text-center shadow-[0_0_40px_var(--accent-soft)]">
                    <FileImage aria-hidden="true" className="mx-auto mb-4 text-accent" size={26} />
                    <p className="font-mono text-xs uppercase tracking-[0.24em]">Drop to analyze</p>
                    <p className="mt-2 text-xs text-secondary-text">JPG, PNG, or WEBP</p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>

        <p className="pointer-events-none absolute bottom-6 left-8 hidden font-mono text-[9px] uppercase tracking-[0.18em] text-secondary-text lg:block">
          Scroll / Discover the pipeline
        </p>
    </section>
  );
}
