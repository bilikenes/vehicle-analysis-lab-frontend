"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import type {
  AnalysisViewModel,
  NormalizedBoundingBox,
} from "@/features/analysis/analysis-view-model";
import {
  boundingBoxPercentStyle,
  containedImageRect,
  type Rectangle,
} from "@/features/analysis/project-bounding-box";
import { hasReachedPhase, type RevealPhase } from "@/features/analysis/reveal-state";

export type AnalysisFocus =
  | "body-type"
  | "edit-preview"
  | "ocr-result"
  | "plate-crop"
  | "vehicle-crop"
  | null;

export type AnalysisFamily = "plate" | "vehicle" | null;

export function analysisFocusFamily(focus: AnalysisFocus): AnalysisFamily {
  if (focus === "body-type" || focus === "vehicle-crop") {
    return "vehicle";
  }
  if (focus === "ocr-result" || focus === "plate-crop") {
    return "plate";
  }
  return null;
}

type OriginalImageStageProps = {
  analysis: AnalysisViewModel;
  className?: string;
  focus: AnalysisFocus;
  phase: RevealPhase;
  plateBoxRef: RefObject<HTMLDivElement | null>;
  vehicleBoxRef: RefObject<HTMLDivElement | null>;
};

type BoundingBoxProps = {
  box: NormalizedBoundingBox;
  boxRef: RefObject<HTMLDivElement | null>;
  emphasized: boolean;
  plate?: boolean;
  show: boolean;
  showHandles: boolean;
  testId: string;
};

function BoundingBox({
  box,
  boxRef,
  emphasized,
  plate = false,
  show,
  showHandles,
  testId,
}: BoundingBoxProps) {
  return (
    <motion.div
      ref={boxRef}
      animate={{ opacity: show ? (emphasized ? 1 : plate ? 0.7 : 0.48) : 0 }}
      aria-hidden="true"
      className={`absolute z-20 border ${plate ? "border-accent" : "border-primary-text/75"}`}
      data-testid={testId}
      initial={false}
      style={boundingBoxPercentStyle(box)}
      transition={{ duration: 0.24 }}
    >
      <span className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-current" />
      <span className="absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-current" />
      <span className="absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-current" />
      <span className="absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-current" />
      {showHandles ? (
        <>
          <span className="absolute -left-1.5 -top-1.5 size-3 border border-background bg-primary-text" />
          <span className="absolute -right-1.5 -top-1.5 size-3 border border-background bg-primary-text" />
          <span className="absolute -bottom-1.5 -left-1.5 size-3 border border-background bg-primary-text" />
          <span className="absolute -bottom-1.5 -right-1.5 size-3 border border-background bg-primary-text" />
        </>
      ) : null}
    </motion.div>
  );
}

export function OriginalImageStage({
  analysis,
  className = "",
  focus,
  phase,
  plateBoxRef,
  vehicleBoxRef,
}: OriginalImageStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [imageRect, setImageRect] = useState<Rectangle | null>(null);
  const family = analysisFocusFamily(focus);
  const vehicleVisible = hasReachedPhase(phase, "vehicle-detected");
  const plateVisible = hasReachedPhase(phase, "plate-detected");
  const completedRest = phase === "complete" && focus === null;
  const showVehicleBox = vehicleVisible && (!completedRest && (phase !== "complete" || family === "vehicle" || focus === "edit-preview"));
  const showPlateBox = plateVisible && (!completedRest && (phase !== "complete" || family === "plate" || focus === "edit-preview"));

  const updateImageRect = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    setImageRect(
      containedImageRect({
        containerHeight: stage.clientHeight,
        containerWidth: stage.clientWidth,
        naturalHeight: analysis.originalImage.height,
        naturalWidth: analysis.originalImage.width,
      }),
    );
  }, [analysis.originalImage.height, analysis.originalImage.width]);

  useLayoutEffect(() => {
    updateImageRect();
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(updateImageRect);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [updateImageRect]);

  return (
    <section aria-label="Original image with detected regions" className={`min-w-0 lg:max-w-[54rem] lg:pt-2 min-[1440px]:max-w-none min-[1440px]:!pt-0 ${className}`}>
      <div className="mb-3 flex items-center gap-3 min-[1440px]:hidden">
        <span className="h-px w-7 bg-accent/70" aria-hidden="true" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary-text">Source image</p>
      </div>
      <div className="relative">
        <div aria-hidden="true" className="absolute -bottom-3 left-3 right-[-12px] top-3 hidden border-b border-r border-border/45 bg-surface/25 min-[1200px]:block min-[1440px]:hidden" />
        <div
          ref={stageRef}
          className="relative w-full overflow-hidden bg-black/35 ring-1 ring-inset ring-primary-text/10 min-[1440px]:!aspect-[1.706] min-[1440px]:ring-0 min-[1440px]:[clip-path:polygon(0_9%,100%_0,88%_100%,0_86%)]"
          style={{ aspectRatio: `${analysis.originalImage.width} / ${analysis.originalImage.height}` }}
        >
          <Image
            fill
            priority
            alt={analysis.originalImage.alt}
            className="object-contain"
            onLoad={updateImageRect}
            sizes="(max-width: 899px) 100vw, 64vw"
            src={analysis.originalImage.src}
            unoptimized={analysis.originalImage.src.startsWith("blob:")}
          />
          {imageRect ? (
            <div
              className="pointer-events-none absolute"
              style={{ height: imageRect.height, left: imageRect.left, top: imageRect.top, width: imageRect.width }}
            >
              <motion.div
                animate={{ opacity: family ? 0.16 : 0 }}
                aria-hidden="true"
                className="absolute inset-0 bg-background"
                initial={false}
                transition={{ duration: 0.2 }}
              />
              <BoundingBox
                box={analysis.vehicle.boundingBox}
                boxRef={vehicleBoxRef}
                emphasized={family === "vehicle" || family === null}
                show={showVehicleBox}
                showHandles={focus === "edit-preview"}
                testId="vehicle-bbox"
              />
              <BoundingBox
                box={analysis.plate.boundingBox}
                boxRef={plateBoxRef}
                emphasized={family === "plate" || family === null}
                plate
                show={showPlateBox}
                showHandles={focus === "edit-preview"}
                testId="plate-bbox"
              />
            </div>
          ) : null}
          <span aria-hidden="true" className="absolute left-0 top-0 h-7 w-7 border-l border-t border-primary-text/50 min-[1440px]:hidden" />
          <span aria-hidden="true" className="absolute bottom-0 right-0 h-7 w-7 border-b border-r border-primary-text/35 min-[1440px]:hidden" />
        </div>
      </div>
    </section>
  );
}
