"use client";

import { ArrowLeft, ChevronDown, Download, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  ANALYSIS_FIXTURE_NOTICE,
  buildFixtureDownloadPayload,
} from "@/features/analysis/analysis-fixture";
import type {
  AnalysisViewModel,
  NormalizedBoundingBox,
} from "@/features/analysis/analysis-view-model";
import type { RevealPhase } from "@/features/analysis/reveal-state";
import { revealPhaseLabel } from "@/features/analysis/reveal-state";

type AnalysisUtilityBarProps = {
  analysis: AnalysisViewModel;
  failed?: boolean;
  onNewAnalysis: () => void;
  phase: RevealPhase;
};

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function downloadCrop(
  imageSrc: string,
  box: NormalizedBoundingBox,
  fileName: string,
) {
  const image = document.createElement("img");
  image.src = imageSrc;
  await image.decode();

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * box.width));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * box.height));
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available.");
  }

  context.drawImage(
    image,
    image.naturalWidth * box.x,
    image.naturalHeight * box.y,
    image.naturalWidth * box.width,
    image.naturalHeight * box.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) {
    throw new Error("The crop could not be created.");
  }

  downloadBlob(blob, fileName);
}

export function AnalysisUtilityBar({
  analysis,
  failed = false,
  onNewAnalysis,
  phase,
}: AnalysisUtilityBarProps) {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const complete = phase === "complete";
  const quotaExhausted = analysis.quota.remaining === 0;
  const statusLabel = failed ? "Analysis failed" : revealPhaseLabel(phase);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setDownloadOpen(false);
      }
    };

    window.addEventListener("pointerdown", closeOnOutsideClick);
    return () => window.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  const downloadJson = () => {
    const payload = JSON.stringify(buildFixtureDownloadPayload(analysis), null, 2);
    downloadBlob(new Blob([payload], { type: "application/json" }), `${analysis.id}-fixture-result.json`);
    setDownloadOpen(false);
  };

  return (
    <header className="relative z-[100] min-h-16 border-b border-border/70 bg-background/96 px-5 backdrop-blur-md sm:px-8 lg:px-12 min-[1440px]:grid min-[1440px]:grid-cols-[153px_1fr] min-[1440px]:!px-0">
      <div aria-hidden="true" className="hidden min-h-16 items-center border-r border-border/70 pl-[29px] min-[1440px]:flex">
        <span className="grid size-[19px] place-items-center border border-primary-text/65 font-mono text-[8px] text-primary-text/75">Ø</span>
      </div>
      <div className="mx-auto flex min-h-16 w-full max-w-[1560px] flex-wrap items-center gap-x-4 gap-y-2 min-[1440px]:mx-0 min-[1440px]:max-w-none min-[1440px]:px-[31px]">
        <div className="relative flex w-full max-w-[1320px] flex-wrap items-center gap-x-4 gap-y-2 min-[1440px]:flex-nowrap">
        <Link
          className="inline-flex min-h-10 items-center gap-2 text-xs text-secondary-text outline-none transition-colors hover:text-primary-text focus-visible:ring-2 focus-visible:ring-primary-text sm:text-sm"
          href="/"
        >
          <ArrowLeft aria-hidden="true" size={15} />
          Home
        </Link>

          <span className="hidden h-5 w-px bg-border sm:block min-[1440px]:hidden" />
          <span aria-hidden="true" className="hidden text-xs text-secondary-text/55 min-[1440px]:inline">/</span>
          <span className="hidden text-xs font-semibold text-accent min-[1440px]:inline">Analysis</span>

          <div className="flex items-center gap-2 min-[1440px]:absolute min-[1440px]:left-[490px]" role="status">
          <span className={`size-1.5 rounded-full ${failed ? "bg-accent" : complete ? "bg-success" : "animate-pulse bg-accent"}`} />
          <span className={`font-mono text-[10px] uppercase tracking-[0.16em] ${failed ? "text-accent" : complete ? "text-success" : "text-secondary-text"}`}>
            {statusLabel}
          </span>
        </div>

        <div className="ml-auto flex items-center justify-end gap-2 sm:gap-3">
          <span className="max-w-[5.5rem] text-right font-mono text-[8px] uppercase leading-3 tracking-[0.11em] text-secondary-text sm:max-w-none sm:px-2 sm:text-[9px] sm:tracking-[0.14em]">
            <span className="sm:hidden">{analysis.quota.remaining} remaining</span>
            <span className="hidden sm:inline">{analysis.quota.remaining} of {analysis.quota.total} analyses remaining</span>
          </span>

          <div ref={menuRef} className="relative">
            <button
              aria-expanded={downloadOpen}
              aria-haspopup="menu"
              className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-xs text-primary-text outline-none transition-colors hover:border-primary-text/45 focus-visible:ring-2 focus-visible:ring-primary-text disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!complete || failed}
              onClick={() => setDownloadOpen((open) => !open)}
              type="button"
            >
              <Download aria-hidden="true" size={14} />
              <span className="sr-only min-[520px]:not-sr-only">Download</span>
              <ChevronDown aria-hidden="true" className="hidden min-[520px]:block" size={13} />
            </button>
            {downloadOpen ? (
              <div
                aria-label="Download results"
                className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-56 border border-border bg-elevated-surface p-2 shadow-2xl"
                role="menu"
              >
                <a
                  className="block px-3 py-2 text-sm text-primary-text outline-none hover:bg-surface focus-visible:bg-surface"
                  download
                  href={analysis.originalImage.src}
                  role="menuitem"
                >
                  Original image
                </a>
                <button
                  className="block w-full px-3 py-2 text-left text-sm text-primary-text outline-none hover:bg-surface focus-visible:bg-surface"
                  onClick={() => void downloadCrop(analysis.originalImage.src, analysis.vehicle.boundingBox, `${analysis.id}-vehicle.png`)}
                  role="menuitem"
                  type="button"
                >
                  Vehicle crop
                </button>
                <button
                  className="block w-full px-3 py-2 text-left text-sm text-primary-text outline-none hover:bg-surface focus-visible:bg-surface"
                  onClick={() => void downloadCrop(analysis.originalImage.src, analysis.plate.boundingBox, `${analysis.id}-plate.png`)}
                  role="menuitem"
                  type="button"
                >
                  Plate crop
                </button>
                <button
                  className="block w-full px-3 py-2 text-left text-sm text-primary-text outline-none hover:bg-surface focus-visible:bg-surface"
                  onClick={downloadJson}
                  role="menuitem"
                  type="button"
                >
                  Fixture result JSON
                </button>
                <p className="mt-2 border-t border-border px-3 pt-2 text-[10px] leading-4 text-secondary-text">
                  {ANALYSIS_FIXTURE_NOTICE}
                </p>
              </div>
            ) : null}
          </div>

          <button
            className="inline-flex min-h-10 items-center gap-1.5 bg-accent px-3 text-[11px] font-semibold text-background outline-none transition-colors hover:bg-primary-text focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-border disabled:text-secondary-text sm:gap-2 sm:text-xs"
            disabled={(!complete && !failed) || quotaExhausted}
            onClick={onNewAnalysis}
            type="button"
          >
            <Plus aria-hidden="true" size={14} />
            New Analysis
          </button>
        </div>
        </div>
      </div>
    </header>
  );
}
