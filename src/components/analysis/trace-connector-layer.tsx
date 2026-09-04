"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useState, type RefObject } from "react";

import type { RevealPhase } from "@/features/analysis/reveal-state";

import type { ExtractionAnchorRefs } from "./extraction-sequence";
import {
  analysisFocusFamily,
  type AnalysisFamily,
  type AnalysisFocus,
} from "./original-image-stage";

type TraceConnectorLayerProps = {
  anchorRefs: ExtractionAnchorRefs;
  compositionRef: RefObject<HTMLDivElement | null>;
  focus: AnalysisFocus;
  phase: RevealPhase;
  plateBoxRef: RefObject<HTMLDivElement | null>;
  vehicleBoxRef: RefObject<HTMLDivElement | null>;
};

type Connector = {
  d: string;
  family: Exclude<AnalysisFamily, null>;
  key: Exclude<AnalysisFocus, "edit-preview" | null>;
  primary: boolean;
};

function connectorPath(
  source: DOMRect,
  target: DOMRect,
  container: DOMRect,
  compact: boolean,
  bendRatio = 0.58,
) {
  const sourceX = (compact ? source.left + source.width * 0.5 : source.right) - container.left;
  const sourceY = (compact ? source.bottom : source.top + source.height * 0.5) - container.top;
  const targetX = (compact ? target.left + target.width * 0.5 : target.left) - container.left;
  const targetY = (compact ? target.top : target.top + target.height * 0.5) - container.top;

  if (compact) {
    const bendY = sourceY + Math.max(18, (targetY - sourceY) * 0.48);
    return `M ${sourceX} ${sourceY} V ${bendY} L ${targetX} ${targetY}`;
  }

  const gap = targetX - sourceX;
  const bendX = sourceX + Math.max(28, Math.min(gap * bendRatio, 132));
  return `M ${sourceX} ${sourceY} H ${bendX} L ${targetX} ${targetY}`;
}

export function TraceConnectorLayer({
  anchorRefs,
  compositionRef,
  focus,
  phase,
  plateBoxRef,
  vehicleBoxRef,
}: TraceConnectorLayerProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [size, setSize] = useState({ height: 0, width: 0 });

  useLayoutEffect(() => {
    const composition = compositionRef.current;
    const vehicleBox = vehicleBoxRef.current;
    const plateBox = plateBoxRef.current;
    const vehicleCrop = anchorRefs.vehicleCrop.current;
    const plateCrop = anchorRefs.plateCrop.current;
    const bodyType = anchorRefs.bodyType.current;
    const ocrResult = anchorRefs.ocrResult.current;

    if (!composition || !vehicleBox || !plateBox || !vehicleCrop || !plateCrop || !bodyType || !ocrResult) {
      return;
    }

    const update = () => {
      const container = composition.getBoundingClientRect();
      const compact = container.width < 1200;
      setSize({ height: container.height, width: container.width });
      const nextConnectors: Connector[] = [
        { d: connectorPath(vehicleBox.getBoundingClientRect(), vehicleCrop.getBoundingClientRect(), container, compact, 0.46), family: "vehicle", key: "vehicle-crop", primary: true },
        { d: connectorPath(plateBox.getBoundingClientRect(), plateCrop.getBoundingClientRect(), container, compact, 0.7), family: "plate", key: "plate-crop", primary: true },
        { d: connectorPath(vehicleBox.getBoundingClientRect(), bodyType.getBoundingClientRect(), container, compact, 0.32), family: "vehicle", key: "body-type", primary: false },
        { d: connectorPath(plateBox.getBoundingClientRect(), ocrResult.getBoundingClientRect(), container, compact, 0.78), family: "plate", key: "ocr-result", primary: false },
      ];
      setConnectors(
        container.width < 768
          ? nextConnectors.filter((connector) => connector.primary)
          : nextConnectors,
      );
    };

    update();
    const observer = new ResizeObserver(update);
    [composition, vehicleBox, plateBox, vehicleCrop, plateCrop, bodyType, ocrResult].forEach((element) => observer.observe(element));
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [anchorRefs, compositionRef, phase, plateBoxRef, vehicleBoxRef]);

  const activeFamily = analysisFocusFamily(focus);

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-visible"
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      width={size.width}
    >
      {connectors.map((connector) => {
        const exact = focus === connector.key;
        const related = activeFamily === connector.family;
        const opacity = exact ? 0.9 : related ? (connector.primary ? 0.55 : 0.36) : connector.primary ? 0.2 : 0.06;
        const plate = connector.family === "plate";
        return (
          <g key={connector.key}>
            <motion.path
              animate={{ opacity }}
              d={connector.d}
              fill="none"
              stroke={plate ? "#FFB547" : "#F3F4F1"}
              strokeDasharray={connector.primary ? "2 3" : "1 5"}
              strokeWidth={exact ? 1.2 : 0.8}
              transition={{ duration: reduceMotion ? 0.01 : 0.18 }}
              vectorEffect="non-scaling-stroke"
            />
            {exact ? (
              <circle fill={plate ? "#FFB547" : "#F3F4F1"} opacity="0.9" r="2" cx={Number(connector.d.match(/M ([\d.]+)/)?.[1] ?? 0)} cy={Number(connector.d.match(/M [\d.]+ ([\d.]+)/)?.[1] ?? 0)} />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
