"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { RefObject } from "react";

import type { AnalysisViewModel } from "@/features/analysis/analysis-view-model";
import type { RevealPhase } from "@/features/analysis/reveal-state";

import { ExtractionSequence, type ExtractionAnchorRefs } from "./extraction-sequence";
import { OriginalImageStage, type AnalysisFocus } from "./original-image-stage";
import { TraceConnectorLayer } from "./trace-connector-layer";

type EditorialAnalysisWorkspaceProps = {
  analysis: AnalysisViewModel;
  anchorRefs: ExtractionAnchorRefs;
  compositionRef: RefObject<HTMLDivElement | null>;
  focus: AnalysisFocus;
  onFocusChange: (focus: AnalysisFocus) => void;
  phase: RevealPhase;
  plateBoxRef: RefObject<HTMLDivElement | null>;
  plateCropRef: RefObject<HTMLDivElement | null>;
  vehicleBoxRef: RefObject<HTMLDivElement | null>;
  vehicleCropRef: RefObject<HTMLDivElement | null>;
};

export function EditorialAnalysisWorkspace({
  analysis,
  anchorRefs,
  compositionRef,
  focus,
  onFocusChange,
  phase,
  plateBoxRef,
  plateCropRef,
  vehicleBoxRef,
  vehicleCropRef,
}: EditorialAnalysisWorkspaceProps) {
  const complete = phase === "complete";

  return (
    <div className="relative mx-auto w-full max-w-[1560px] min-[1440px]:mx-0 min-[1440px]:h-[877px] min-[1440px]:max-w-[1320px]">
      <header className="relative mb-6 grid gap-4 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(17rem,0.46fr)] min-[900px]:items-end lg:mb-7 min-[1440px]:absolute min-[1440px]:left-0 min-[1440px]:top-[49px] min-[1440px]:z-20 min-[1440px]:mb-0 min-[1440px]:block min-[1440px]:w-full">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-3 -top-8 hidden select-none text-[clamp(6rem,11vw,11rem)] font-semibold leading-none tracking-[-0.08em] text-primary-text/[0.025] min-[1200px]:block min-[1440px]:hidden"
        >
          EXTRACTED
        </span>
        <div className="relative">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            Vision to data
          </p>
          <h1 className="mt-2 max-w-[42rem] text-[clamp(2.65rem,5vw,4.75rem)] font-medium leading-[0.96] tracking-[-0.055em] text-primary-text min-[1440px]:mt-3 min-[1440px]:text-[66px] min-[1440px]:leading-[0.94]">
            {complete ? (
              <>
                <span className="block">Editorial</span>
                <span className="block text-secondary-text/55">Exploded View</span>
              </>
            ) : (
              <>Resolving <span className="text-secondary-text">image.</span></>
            )}
          </h1>
        </div>
        <div className="relative flex flex-col gap-3 min-[900px]:pb-1 min-[1440px]:absolute min-[1440px]:left-[559px] min-[1440px]:top-[30px] min-[1440px]:w-[245px]">
          <p className="max-w-sm text-xs leading-5 text-secondary-text sm:text-sm sm:leading-6">
            We don&apos;t just detect.<br />We deconstruct for clarity.
          </p>
        </div>
      </header>

      <div
        ref={compositionRef}
        className="relative grid min-w-0 gap-10 min-[1200px]:grid-cols-[minmax(0,1.62fr)_minmax(22rem,0.86fr)] min-[1200px]:gap-[clamp(3rem,5vw,6rem)] min-[1200px]:items-start min-[1440px]:absolute min-[1440px]:left-0 min-[1440px]:top-[190px] min-[1440px]:block min-[1440px]:h-[605px] min-[1440px]:w-full"
      >
        <OriginalImageStage
          analysis={analysis}
          className="min-[1440px]:absolute min-[1440px]:left-0 min-[1440px]:top-0 min-[1440px]:w-[853px]"
          focus={focus}
          phase={phase}
          plateBoxRef={plateBoxRef}
          vehicleBoxRef={vehicleBoxRef}
        />
        <ExtractionSequence
          analysis={analysis}
          anchorRefs={anchorRefs}
          className="min-[1440px]:absolute min-[1440px]:left-[928px] min-[1440px]:top-[-131px] min-[1440px]:w-[392px]"
          focus={focus}
          onFocusChange={onFocusChange}
          phase={phase}
          plateCropRef={plateCropRef}
          vehicleCropRef={vehicleCropRef}
        />
        <TraceConnectorLayer
          anchorRefs={anchorRefs}
          compositionRef={compositionRef}
          focus={focus}
          phase={phase}
          plateBoxRef={plateBoxRef}
          vehicleBoxRef={vehicleBoxRef}
        />
      </div>

      <div className="mt-8 max-w-[19rem] min-[1440px]:absolute min-[1440px]:left-0 min-[1440px]:top-[660px] min-[1440px]:z-20 min-[1440px]:mt-0 min-[1440px]:w-[265px]">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.17em] text-accent">Extraction overview</p>
        <p className="mt-3 text-xs leading-5 text-secondary-text">
          Each element is isolated and verified for accuracy. Cross-referenced with contextual data for reliable results.
        </p>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute right-[-142px] top-[213px] hidden grid-cols-4 gap-[14px] opacity-55 min-[1440px]:grid">
        {Array.from({ length: 32 }, (_, index) => <span className="size-px bg-secondary-text" key={index} />)}
      </div>

      <footer className="mt-9 flex flex-col gap-5 border-t border-border/65 pt-5 sm:flex-row sm:items-center sm:justify-between min-[1440px]:absolute min-[1440px]:inset-x-0 min-[1440px]:top-[807px] min-[1440px]:mt-0 min-[1440px]:border-0 min-[1440px]:p-0">
        <div aria-live="polite">
          {analysis.quota.remaining === 0 ? (
            <>
              <p className="text-sm font-medium text-primary-text">You’ve used all 5 analyses available for this session.</p>
              <p className="mt-1 text-xs text-secondary-text">This result remains available to inspect and download.</p>
            </>
          ) : (
            <p className="flex items-center gap-3 text-xs text-secondary-text min-[1440px]:ml-[323px]">
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.2} />
              Focus a result to trace it back to the original image.
            </p>
          )}
        </div>
        <Link
          className={`inline-flex min-h-10 items-center justify-center gap-3 border px-4 text-xs font-semibold outline-none transition-colors ${
            complete
              ? "border-primary-text/55 text-primary-text hover:border-primary-text hover:bg-primary-text hover:text-background focus-visible:ring-2 focus-visible:ring-primary-text"
              : "pointer-events-none border-border text-secondary-text opacity-45"
          }`}
          href={`/edit/${analysis.id}`}
          onBlur={() => onFocusChange(null)}
          onFocus={() => onFocusChange("edit-preview")}
          onMouseEnter={() => onFocusChange("edit-preview")}
          onMouseLeave={() => onFocusChange(null)}
        >
          Edit Results
          <ArrowUpRight aria-hidden="true" size={15} />
        </Link>
      </footer>
    </div>
  );
}
