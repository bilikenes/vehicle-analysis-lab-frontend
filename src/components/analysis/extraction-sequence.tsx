"use client";

import { motion } from "motion/react";
import type { FocusEvent, ReactNode, RefObject } from "react";

import type { AnalysisViewModel } from "@/features/analysis/analysis-view-model";
import { cropBackgroundStyle } from "@/features/analysis/project-bounding-box";
import { hasReachedPhase, type RevealPhase } from "@/features/analysis/reveal-state";

import {
  EXTRACTION_FRAME_CLIP_PATH,
  type ExtractionFrameVariant,
} from "./extraction-frame-variants";
import {
  analysisFocusFamily,
  type AnalysisFocus,
} from "./original-image-stage";

export type ExtractionAnchorRefs = {
  bodyType: RefObject<HTMLElement | null>;
  ocrResult: RefObject<HTMLElement | null>;
  plateCrop: RefObject<HTMLElement | null>;
  vehicleCrop: RefObject<HTMLElement | null>;
};

type ExtractionSequenceProps = {
  analysis: AnalysisViewModel;
  anchorRefs: ExtractionAnchorRefs;
  className?: string;
  focus: AnalysisFocus;
  onFocusChange: (focus: AnalysisFocus) => void;
  phase: RevealPhase;
  plateCropRef: RefObject<HTMLDivElement | null>;
  vehicleCropRef: RefObject<HTMLDivElement | null>;
};

type ModuleShellProps = {
  children: ReactNode;
  className?: string;
  focus: AnalysisFocus;
  focusValue: Exclude<AnalysisFocus, "edit-preview" | null>;
  label: string;
  onFocusChange: (focus: AnalysisFocus) => void;
};

type FragmentFrameProps = {
  analysis: AnalysisViewModel;
  cropRef: RefObject<HTMLDivElement | null>;
  label: string;
  variant: ExtractionFrameVariant;
  visible: boolean;
};

function FragmentFrame({
  analysis,
  cropRef,
  label,
  variant,
  visible,
}: FragmentFrameProps) {
  const result = variant === "vehicle" ? analysis.vehicle : analysis.plate;
  const cropStyle = cropBackgroundStyle(
    analysis.originalImage.src,
    result.boundingBox,
    analysis.originalImage,
  );
  const { aspectRatio, ...imageStyle } = cropStyle;
  const clipPath = EXTRACTION_FRAME_CLIP_PATH[variant];
  const plate = variant === "plate";

  return (
    <motion.div
      ref={cropRef}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 4 }}
      aria-label={label}
      className={`relative mt-3 overflow-hidden transition-colors min-[1440px]:mt-0 ${
        plate
          ? "bg-accent/55 group-focus-visible:bg-accent/90 min-[1440px]:-ml-[18px] min-[1440px]:h-[96px] min-[1440px]:w-[357px]"
          : "bg-primary-text/25 group-focus-visible:bg-primary-text/55 min-[1440px]:-ml-[38px] min-[1440px]:h-[190px] min-[1440px]:w-[420px]"
      }`}
      initial={false}
      role="img"
      style={{ aspectRatio, clipPath }}
      transition={{ duration: plate ? 0.2 : 0.22 }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-px bg-elevated-surface bg-cover"
        style={{ ...imageStyle, clipPath }}
      />
      {plate ? (
        <>
          <span aria-hidden="true" className="absolute bottom-0 left-[4%] h-px w-[58%] bg-accent/85" />
          <span aria-hidden="true" className="absolute right-[4%] top-0 h-px w-[24%] bg-accent/60" />
        </>
      ) : (
        <>
          <span aria-hidden="true" className="absolute left-[4%] top-0 h-px w-[58%] bg-primary-text/60" />
          <span aria-hidden="true" className="absolute bottom-0 right-[9%] h-px w-[34%] bg-primary-text/42" />
        </>
      )}
    </motion.div>
  );
}

function ModuleShell({
  children,
  className = "",
  focus,
  focusValue,
  label,
  onFocusChange,
}: ModuleShellProps) {
  const activeFamily = analysisFocusFamily(focus);
  const moduleFamily = analysisFocusFamily(focusValue);
  const subdued = activeFamily !== null && activeFamily !== moduleFamily;

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    onFocusChange(null);
  };

  return (
    <section
      aria-label={label}
      className={`group relative min-w-0 cursor-default outline-none transition-[opacity,transform] duration-200 focus-visible:-translate-y-px ${
        subdued ? "opacity-50" : "opacity-100"
      } ${className}`}
      onBlur={handleBlur}
      onFocus={() => onFocusChange(focusValue)}
      onMouseEnter={() => onFocusChange(focusValue)}
      onMouseLeave={() => onFocusChange(null)}
      onPointerDown={() => onFocusChange(focusValue)}
      tabIndex={0}
    >
      {children}
    </section>
  );
}

function ModuleHeading({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-border/70 pb-2 group-focus-visible:border-primary-text/70 min-[1440px]:pb-1.5">
      <span className="font-mono text-xl leading-none text-primary-text/58 min-[1440px]:text-[22px]">{index}</span>
      <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.17em] text-secondary-text group-focus-visible:text-primary-text">
        {label}
      </h2>
    </div>
  );
}

export function ExtractionSequence({
  analysis,
  anchorRefs,
  className = "",
  focus,
  onFocusChange,
  phase,
  plateCropRef,
  vehicleCropRef,
}: ExtractionSequenceProps) {
  const {
    bodyType: bodyTypeAnchorRef,
    ocrResult: ocrResultAnchorRef,
    plateCrop: plateCropAnchorRef,
    vehicleCrop: vehicleCropAnchorRef,
  } = anchorRefs;
  const vehicleCropVisible = hasReachedPhase(phase, "body-resolved");
  const bodyVisible = hasReachedPhase(phase, "body-resolved");
  const plateCropVisible = hasReachedPhase(phase, "ocr-resolved");
  const ocrVisible = hasReachedPhase(phase, "ocr-resolved");
  const plateActive = analysisFocusFamily(focus) === "plate";

  return (
    <aside
      aria-label="Extracted analysis results"
      className={`relative grid min-w-0 gap-x-8 gap-y-8 sm:grid-cols-2 min-[1200px]:block min-[1200px]:min-h-[clamp(38rem,42vw,43rem)] min-[1440px]:min-h-[605px] ${className}`}
    >
      <ModuleShell
        className="min-[1200px]:absolute min-[1200px]:right-0 min-[1200px]:top-0 min-[1200px]:w-[94%] min-[1200px]:max-w-none min-[1440px]:left-0 min-[1440px]:right-auto min-[1440px]:top-0 min-[1440px]:w-[420px]"
        focus={focus}
        focusValue="vehicle-crop"
        label="Vehicle crop; trace to the original image"
        onFocusChange={onFocusChange}
      >
        <span ref={vehicleCropAnchorRef} aria-hidden="true" className="absolute left-0 top-7 size-1" />
        <ModuleHeading index="01" label="Vehicle crop" />
        <FragmentFrame
          analysis={analysis}
          cropRef={vehicleCropRef}
          label="Extracted vehicle crop"
          variant="vehicle"
          visible={vehicleCropVisible}
        />
      </ModuleShell>

      <ModuleShell
        className="sm:mt-8 min-[1200px]:absolute min-[1200px]:right-[3%] min-[1200px]:top-[clamp(14.5rem,17vw,17rem)] min-[1200px]:mt-0 min-[1200px]:w-[68%] min-[1200px]:max-w-none min-[1440px]:left-[11px] min-[1440px]:right-auto min-[1440px]:top-[247px] min-[1440px]:!mt-0 min-[1440px]:w-[357px]"
        focus={focus}
        focusValue="plate-crop"
        label="Plate crop; trace to the original image"
        onFocusChange={onFocusChange}
      >
        <span ref={plateCropAnchorRef} aria-hidden="true" className="absolute left-0 top-7 size-1" />
        <ModuleHeading index="02" label="Plate crop" />
        <FragmentFrame
          analysis={analysis}
          cropRef={plateCropRef}
          label="Extracted plate crop"
          variant="plate"
          visible={plateCropVisible}
        />
      </ModuleShell>

      <ModuleShell
        className="min-[1200px]:absolute min-[1200px]:left-[1%] min-[1200px]:top-[clamp(23rem,28vw,27rem)] min-[1200px]:w-[48%] min-[1200px]:max-w-none min-[1440px]:left-[-3px] min-[1440px]:top-[415px] min-[1440px]:w-[220px]"
        focus={focus}
        focusValue="body-type"
        label={`Body type: ${analysis.vehicle.bodyType}; trace to the vehicle`}
        onFocusChange={onFocusChange}
      >
        <span ref={bodyTypeAnchorRef} aria-hidden="true" className="absolute left-0 top-7 size-1" />
        <ModuleHeading index="03" label="Body type" />
        <motion.div animate={{ opacity: bodyVisible ? 1 : 0, y: bodyVisible ? 0 : 4 }} className="relative pt-3" initial={false}>
          <span aria-hidden="true" className="pointer-events-none absolute -left-3 -top-5 hidden text-[7rem] font-semibold leading-none text-primary-text/[0.035] min-[1200px]:block min-[1440px]:-left-[78px] min-[1440px]:-top-[50px] min-[1440px]:text-[8rem]">
            {analysis.vehicle.bodyType.charAt(0)}
          </span>
          <p className="relative text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-[-0.035em] text-primary-text">
            {analysis.vehicle.bodyType}
          </p>
        </motion.div>
      </ModuleShell>

      <ModuleShell
        className="sm:mt-8 min-[1200px]:absolute min-[1200px]:left-[-8%] min-[1200px]:top-[clamp(29rem,35vw,34rem)] min-[1200px]:mt-0 min-[1200px]:w-[108%] min-[1200px]:max-w-none min-[1440px]:left-[-76px] min-[1440px]:top-[532px] min-[1440px]:!mt-0 min-[1440px]:w-[360px]"
        focus={focus}
        focusValue="ocr-result"
        label={`OCR result: ${analysis.plate.text}; trace to the plate`}
        onFocusChange={onFocusChange}
      >
        <span ref={ocrResultAnchorRef} aria-hidden="true" className="absolute left-0 top-7 size-1" />
        <ModuleHeading index="04" label="OCR result" />
        <motion.div
          animate={{ opacity: ocrVisible ? 1 : 0, y: ocrVisible ? 0 : 4 }}
          className="relative mt-3 px-5 py-4 min-[1440px]:mt-0 min-[1440px]:px-5 min-[1440px]:py-4"
          initial={false}
        >
          <span aria-hidden="true" className={`absolute left-0 top-0 h-5 w-16 border-l border-t border-accent transition-opacity ${plateActive ? "opacity-100" : "opacity-70"}`} />
          <span aria-hidden="true" className={`absolute right-0 top-0 h-3 w-9 border-r border-t border-accent transition-opacity ${plateActive ? "opacity-100" : "opacity-70"}`} />
          <span aria-hidden="true" className={`absolute bottom-0 left-0 h-3 w-10 border-b border-l border-accent transition-opacity ${plateActive ? "opacity-100" : "opacity-70"}`} />
          <span aria-hidden="true" className={`absolute bottom-0 right-0 h-5 w-24 border-b border-r border-accent transition-opacity ${plateActive ? "opacity-100" : "opacity-70"}`} />
          <p className="whitespace-nowrap font-mono text-[clamp(1.75rem,3.4vw,3.25rem)] font-medium tracking-[0.1em] text-primary-text min-[1440px]:text-[46px]">
            {analysis.plate.text}
          </p>
        </motion.div>
      </ModuleShell>
    </aside>
  );
}
