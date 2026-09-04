"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { AnalysisViewModel } from "@/features/analysis/analysis-view-model";
import { nextRevealPhase, type RevealPhase } from "@/features/analysis/reveal-state";

import { AnalysisUtilityBar } from "./analysis-utility-bar";
import { EditorialAnalysisWorkspace } from "./editorial-analysis-workspace";
import { EditorialSideRail } from "./editorial-side-rail";
import { ExtractionAnimationLayer } from "./extraction-animation-layer";
import { NewAnalysisUploadState } from "./new-analysis-upload-state";
import { OriginalImageStage, type AnalysisFocus } from "./original-image-stage";

type AnalysisPageClientProps = {
  initiallyFailed?: boolean;
  initialAnalysis: AnalysisViewModel;
};

const PHASE_DURATION: Partial<Record<RevealPhase, number>> = {
  analyzing: 450,
  "vehicle-detected": 620,
  "vehicle-extracted": 760,
  "body-resolved": 420,
  "plate-detected": 520,
  "plate-extracted": 680,
  "ocr-resolved": 520,
};

async function readImageDimensions(src: string) {
  const image = document.createElement("img");
  image.src = src;
  await image.decode();
  return { height: image.naturalHeight, width: image.naturalWidth };
}

export function AnalysisPageClient({
  initiallyFailed = false,
  initialAnalysis,
}: AnalysisPageClientProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [analysis, setAnalysis] = useState(initialAnalysis);
  const [failed, setFailed] = useState(initiallyFailed);
  const [focus, setFocus] = useState<AnalysisFocus>(null);
  const [newAnalysisOpen, setNewAnalysisOpen] = useState(false);
  const [phase, setPhase] = useState<RevealPhase>("analyzing");
  const uploadedUrlRef = useRef<string | null>(null);
  const compositionRef = useRef<HTMLDivElement>(null);
  const bodyTypeAnchorRef = useRef<HTMLElement>(null);
  const ocrResultAnchorRef = useRef<HTMLElement>(null);
  const plateBoxRef = useRef<HTMLDivElement>(null);
  const plateCropAnchorRef = useRef<HTMLElement>(null);
  const plateCropRef = useRef<HTMLDivElement>(null);
  const vehicleBoxRef = useRef<HTMLDivElement>(null);
  const vehicleCropAnchorRef = useRef<HTMLElement>(null);
  const vehicleCropRef = useRef<HTMLDivElement>(null);

  const anchorRefs = useMemo(
    () => ({
      bodyType: bodyTypeAnchorRef,
      ocrResult: ocrResultAnchorRef,
      plateCrop: plateCropAnchorRef,
      vehicleCrop: vehicleCropAnchorRef,
    }),
    [],
  );

  useEffect(() => {
    if (failed || phase === "complete") {
      return;
    }

    const timer = window.setTimeout(
      () => setPhase(reduceMotion ? "complete" : nextRevealPhase(phase)),
      reduceMotion ? 0 : PHASE_DURATION[phase],
    );

    return () => window.clearTimeout(timer);
  }, [failed, phase, reduceMotion]);

  useEffect(
    () => () => {
      if (uploadedUrlRef.current) {
        URL.revokeObjectURL(uploadedUrlRef.current);
      }
    },
    [],
  );

  const acceptNewAnalysis = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);

    try {
      const dimensions = await readImageDimensions(objectUrl);
      if (uploadedUrlRef.current) {
        URL.revokeObjectURL(uploadedUrlRef.current);
      }
      uploadedUrlRef.current = objectUrl;
      setAnalysis((current) => ({
        ...current,
        id: `fixture-${Date.now()}`,
        originalImage: {
          alt: `Uploaded vehicle image: ${file.name}`,
          ...dimensions,
          src: objectUrl,
        },
        quota: {
          ...current.quota,
          remaining: Math.max(0, current.quota.remaining - 1),
        },
      }));
      setFailed(false);
      setFocus(null);
      setPhase("analyzing");
      setNewAnalysisOpen(false);
    } catch (error) {
      URL.revokeObjectURL(objectUrl);
      throw error;
    }
  };

  const retry = () => {
    setFailed(false);
    setPhase("analyzing");
  };

  return (
    <main className="min-h-screen bg-background text-primary-text">
      <AnalysisUtilityBar
        analysis={analysis}
        failed={failed}
        onNewAnalysis={() => setNewAnalysisOpen(true)}
        phase={phase}
      />

      <div className="relative overflow-hidden px-5 py-7 [background:radial-gradient(circle_at_78%_18%,rgba(255,181,71,0.055),transparent_24rem),radial-gradient(circle_at_18%_68%,rgba(243,244,241,0.02),transparent_28rem),#0B0D0F] sm:px-8 sm:py-9 lg:px-12 lg:py-10 min-[1440px]:min-h-[877px] min-[1440px]:!px-0 min-[1440px]:!py-0">
        {!failed ? <EditorialSideRail /> : null}
        {failed ? (
          <div className="relative mx-auto w-full max-w-[1560px]">
            <header className="mb-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Structured extraction</p>
              <h1 className="mt-2 text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-none tracking-[-0.05em]">Analysis <span className="text-secondary-text">interrupted.</span></h1>
            </header>
            <div className="grid gap-8 min-[900px]:grid-cols-[minmax(0,1.62fr)_minmax(19rem,0.7fr)] min-[900px]:items-start">
              <OriginalImageStage
                analysis={analysis}
                focus={null}
                phase="analyzing"
                plateBoxRef={plateBoxRef}
                vehicleBoxRef={vehicleBoxRef}
              />
              <section className="grid min-h-80 place-items-center border border-border/70 bg-surface/55 p-6 text-center min-[900px]:min-h-full">
                <div className="max-w-sm">
                <AlertTriangle aria-hidden="true" className="mx-auto text-accent" size={30} strokeWidth={1.4} />
                <h2 className="mt-6 text-3xl font-medium tracking-tight">Analysis could not complete.</h2>
                <p className="mt-3 text-sm leading-6 text-secondary-text">
                  The uploaded image is still available. Retry the prototype reveal or start another analysis.
                </p>
                <button
                  className="mt-7 inline-flex min-h-11 items-center gap-2 border border-accent px-4 text-sm font-semibold text-accent outline-none transition-colors hover:bg-accent hover:text-background focus-visible:ring-2 focus-visible:ring-accent"
                  onClick={retry}
                  type="button"
                >
                  <RotateCcw aria-hidden="true" size={15} />
                  Retry analysis
                </button>
                </div>
              </section>
            </div>
            <p className="mt-5 text-xs text-secondary-text">Retry the analysis or choose a new image. No fixture credit was consumed.</p>
          </div>
        ) : (
          <div className="min-[1440px]:ml-[153px] min-[1440px]:px-[31px]">
            <EditorialAnalysisWorkspace
              analysis={analysis}
              anchorRefs={anchorRefs}
              compositionRef={compositionRef}
              focus={focus}
              onFocusChange={setFocus}
              phase={phase}
              plateBoxRef={plateBoxRef}
              plateCropRef={plateCropRef}
              vehicleBoxRef={vehicleBoxRef}
              vehicleCropRef={vehicleCropRef}
            />
          </div>
        )}
      </div>

      <ExtractionAnimationLayer
        active={!failed && phase === "vehicle-extracted"}
        box={analysis.vehicle.boundingBox}
        destinationRef={vehicleCropRef}
        frameVariant="vehicle"
        imageSrc={analysis.originalImage.src}
        sourceRef={vehicleBoxRef}
      />
      <ExtractionAnimationLayer
        active={!failed && phase === "plate-extracted"}
        box={analysis.plate.boundingBox}
        destinationRef={plateCropRef}
        frameVariant="plate"
        imageSrc={analysis.originalImage.src}
        sourceRef={plateBoxRef}
      />

      {newAnalysisOpen ? (
        <NewAnalysisUploadState
          onAccept={acceptNewAnalysis}
          onCancel={() => setNewAnalysisOpen(false)}
        />
      ) : null}
    </main>
  );
}
