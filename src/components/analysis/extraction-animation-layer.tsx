"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

import type { NormalizedBoundingBox } from "@/features/analysis/analysis-view-model";
import { cropBackgroundStyle } from "@/features/analysis/project-bounding-box";

import {
  EXTRACTION_FRAME_CLIP_PATH,
  type ExtractionFrameVariant,
} from "./extraction-frame-variants";

type ElementRectangle = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type ExtractionAnimationLayerProps = {
  active: boolean;
  box: NormalizedBoundingBox;
  destinationRef: RefObject<HTMLDivElement | null>;
  frameVariant: ExtractionFrameVariant;
  imageSrc: string;
  sourceRef: RefObject<HTMLDivElement | null>;
};

function readRectangle(element: HTMLElement): ElementRectangle {
  const rectangle = element.getBoundingClientRect();
  return {
    height: rectangle.height,
    left: rectangle.left,
    top: rectangle.top,
    width: rectangle.width,
  };
}

export function ExtractionAnimationLayer({
  active,
  box,
  destinationRef,
  frameVariant,
  imageSrc,
  sourceRef,
}: ExtractionAnimationLayerProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [geometry, setGeometry] = useState<{
    destination: ElementRectangle;
    source: ElementRectangle;
  } | null>(null);

  useLayoutEffect(() => {
    if (!active || reduceMotion || !sourceRef.current || !destinationRef.current) {
      return;
    }

    const updateGeometry = () => {
      if (!sourceRef.current || !destinationRef.current) {
        return;
      }

      setGeometry({
        destination: readRectangle(destinationRef.current),
        source: readRectangle(sourceRef.current),
      });
    };

    updateGeometry();
    window.addEventListener("resize", updateGeometry);
    return () => window.removeEventListener("resize", updateGeometry);
  }, [active, destinationRef, reduceMotion, sourceRef]);

  if (!active || reduceMotion || !geometry) {
    return null;
  }

  return createPortal(
    <motion.div
      animate={geometry.destination}
      aria-hidden="true"
      className="pointer-events-none fixed z-50 overflow-hidden bg-cover shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
      initial={geometry.source}
      style={{
        ...cropBackgroundStyle(imageSrc, box),
        clipPath: EXTRACTION_FRAME_CLIP_PATH[frameVariant],
      }}
      transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
    />,
    document.body,
  );
}
