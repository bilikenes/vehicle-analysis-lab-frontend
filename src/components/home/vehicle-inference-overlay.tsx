"use client";

import { useEffect, useRef, useState, useCallback, type CSSProperties } from "react";

export const MODEL_REVEAL_TRIGGER = 0.25;
export const MODEL_REARM_THRESHOLD = 0.08;
export const SCAN_DURATION = 1100;
export const BBOX_DRAW_DURATION = 350;
export const SCAN_START_DELAY = 120;

type ScanState = "idle" | "scanning" | "complete";

interface VehicleInferenceOverlayProps {
  modelVisibility: number;
  reducedMotion: boolean;
  isInView: boolean;
}

interface Vertex {
  x: number;
  y: number;
  visible?: boolean;
  accent?: boolean;
}

const VERTICES: Vertex[] = [
  { x: 412, y: 10, visible: true },
  { x: 553, y: 20 },
  { x: 649, y: 27, visible: true },
  { x: 724, y: 42 },
  { x: 808, y: 98 },
  { x: 855, y: 149 },
  { x: 925, y: 204, visible: true },
  { x: 969, y: 239, visible: true },
  { x: 983, y: 326 },
  { x: 971, y: 383 },
  { x: 947, y: 434, visible: true },
  { x: 891, y: 431 },
  { x: 637, y: 423, visible: true },
  { x: 601, y: 488, visible: true },
  { x: 536, y: 502, visible: true },
  { x: 489, y: 477 },
  { x: 431, y: 443 },
  { x: 353, y: 440, visible: true },
  { x: 288, y: 427, visible: true },
  { x: 239, y: 461 },
  { x: 181, y: 466, visible: true },
  { x: 132, y: 426 },
  { x: 32, y: 402 },
  { x: 16, y: 354 },
  { x: 18, y: 275 },
  { x: 31, y: 222, visible: true },
  { x: 40, y: 159, visible: true },
  { x: 125, y: 129 },
  { x: 215, y: 81, visible: true },
  { x: 291, y: 49 },
  { x: 349, y: 36, visible: true },
  { x: 403, y: 31 },
  { x: 75, y: 261 },
  { x: 83, y: 322, visible: true, accent: true },
  { x: 149, y: 210, visible: true },
  { x: 121, y: 347 },
  { x: 207, y: 194, visible: true },
  { x: 198, y: 259, visible: true },
  { x: 231, y: 341, visible: true },
  { x: 186, y: 403, visible: true },
  { x: 286, y: 121, visible: true, accent: true },
  { x: 270, y: 203 },
  { x: 285, y: 255, visible: true },
  { x: 280, y: 311 },
  { x: 283, y: 392 },
  { x: 338, y: 90, visible: true },
  { x: 335, y: 164 },
  { x: 370, y: 266 },
  { x: 383, y: 328, visible: true },
  { x: 339, y: 405, visible: true },
  { x: 432, y: 122 },
  { x: 455, y: 164, visible: true },
  { x: 427, y: 261, visible: true },
  { x: 433, y: 325, visible: true },
  { x: 453, y: 404, visible: true },
  { x: 535, y: 110, visible: true },
  { x: 518, y: 188, visible: true },
  { x: 524, y: 240, visible: true },
  { x: 496, y: 330, visible: true, accent: true },
  { x: 491, y: 384, visible: true, accent: true },
  { x: 595, y: 36, visible: true },
  { x: 593, y: 120 },
  { x: 596, y: 180, visible: true },
  { x: 572, y: 238 },
  { x: 608, y: 313, visible: true },
  { x: 560, y: 406, visible: true },
  { x: 642, y: 97, visible: true },
  { x: 652, y: 178 },
  { x: 676, y: 246, visible: true },
  { x: 737, y: 86 },
  { x: 727, y: 189, visible: true },
  { x: 739, y: 250, visible: true },
  { x: 712, y: 359, visible: true },
  { x: 714, y: 413 },
  { x: 798, y: 249, visible: true },
  { x: 834, y: 340, visible: true },
  { x: 866, y: 197 },
  { x: 905, y: 245 },
  { x: 899, y: 317 },
  { x: 195, y: 175, visible: true, accent: true },
  { x: 795, y: 375, visible: true, accent: true },
  { x: 420, y: 185, visible: true, accent: true },
  { x: 960, y: 285, visible: true, accent: true },
  { x: 750, y: 165, visible: true, accent: true },
];

const EDGES: [number, number][] = [
  [9, 10], [10, 11], [9, 11], [24, 25], [25, 32], [24, 32], [22, 23], [23, 33], [22, 33],
  [32, 33], [24, 33], [25, 26], [26, 34], [25, 34], [32, 34], [26, 27], [27, 34], [33, 35],
  [22, 35], [32, 35], [34, 37], [32, 37], [35, 37], [34, 36], [36, 37], [37, 38], [35, 38],
  [19, 20], [20, 39], [19, 39], [20, 21], [21, 39], [21, 35], [35, 39], [38, 39], [28, 29],
  [29, 40], [28, 40], [36, 41], [37, 41], [41, 42], [37, 42], [37, 43], [38, 43], [42, 43],
  [39, 44], [19, 44], [38, 44], [43, 44], [29, 30], [30, 45], [29, 45], [40, 45], [30, 31],
  [31, 45], [40, 41], [40, 46], [41, 46], [45, 46], [42, 46], [42, 47], [43, 47], [46, 47],
  [47, 48], [43, 48], [18, 44], [44, 49], [18, 49], [43, 49], [48, 49], [31, 50], [45, 50],
  [46, 50], [47, 52], [48, 52], [52, 53], [48, 53], [16, 49], [49, 54], [16, 54], [48, 54],
  [53, 54], [1, 31], [1, 55], [31, 55], [50, 55], [50, 51], [51, 55], [55, 56], [51, 56],
  [51, 52], [51, 57], [52, 57], [56, 57], [52, 58], [53, 58], [57, 58], [53, 59], [54, 59],
  [58, 59], [1, 2], [2, 60], [1, 60], [55, 60], [60, 61], [55, 61], [55, 62], [56, 62],
  [61, 62], [56, 63], [57, 63], [62, 63], [57, 64], [58, 64], [63, 64], [13, 14], [14, 65],
  [13, 65], [14, 15], [15, 65], [15, 59], [59, 65], [12, 64], [12, 65], [64, 65], [58, 65],
  [2, 3], [3, 66], [2, 66], [60, 66], [61, 66], [61, 67], [62, 67], [66, 67], [62, 68],
  [63, 68], [67, 68], [64, 68], [3, 4], [4, 69], [3, 69], [66, 69], [67, 69], [67, 70],
  [68, 70], [70, 71], [68, 71], [64, 72], [12, 72], [68, 72], [71, 72], [72, 73], [12, 73],
  [70, 74], [71, 74], [6, 7], [7, 77], [6, 77], [6, 76], [76, 77], [74, 76], [74, 77],
  [8, 9], [9, 78], [8, 78], [11, 78], [11, 75], [75, 78], [74, 75], [74, 78], [77, 78],
  [27, 28], [28, 79], [27, 79], [34, 79], [36, 79], [40, 79], [41, 79], [72, 80], [73, 80],
  [71, 80], [74, 80], [75, 80], [50, 81], [46, 81], [51, 81], [47, 81], [52, 81], [7, 8],
  [8, 82], [7, 82], [78, 82], [77, 82], [4, 5], [5, 83], [4, 83], [69, 83], [67, 83],
  [70, 83], [74, 83], [5, 76], [76, 83],
];

const TRIANGLES: [number, number, number][] = [
  [9, 10, 11],
  [22, 33, 35],
  [20, 21, 39],
  [37, 42, 43],
  [41, 40, 46],
  [44, 43, 49],
  [49, 48, 54],
  [51, 56, 57],
  [55, 60, 61],
  [13, 14, 65],
  [60, 2, 66],
  [3, 4, 69],
  [68, 71, 72],
  [9, 11, 78],
  [28, 40, 79],
  [46, 50, 81],
  [77, 7, 82],
  [5, 76, 83],
];

export function VehicleInferenceOverlay({
  modelVisibility,
  reducedMotion,
  isInView,
}: VehicleInferenceOverlayProps) {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const scanProgressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const scanStartTimeRef = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const maskVarRef = useRef<HTMLDivElement>(null);
  const stopEdgeRef = useRef<SVGStopElement>(null);
  const stopFadeRef = useRef<SVGStopElement>(null);

  const runScan = useCallback(() => {
    const now = performance.now();
    const elapsed = now - scanStartTimeRef.current;
    const progress = Math.min(elapsed / SCAN_DURATION, 1);
    scanProgressRef.current = progress;

    const edgePct = `${progress * 100}%`;
    const fadePct = `${Math.min(progress * 100 + 4, 100)}%`;
    stopEdgeRef.current?.setAttribute("offset", edgePct);
    stopFadeRef.current?.setAttribute("offset", fadePct);

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(runScan);
    } else {
      setScanState("complete");
    }
  }, []);

  const startScan = useCallback(() => {
    if (reducedMotion) {
      setScanState("complete");
      return;
    }
    setScanState("scanning");
    scanStartTimeRef.current = performance.now();
    scanProgressRef.current = 0;
    stopEdgeRef.current?.setAttribute("offset", "0%");
    stopFadeRef.current?.setAttribute("offset", "4%");
    rafRef.current = requestAnimationFrame(runScan);
  }, [reducedMotion, runScan]);

  useEffect(() => {
    if (scanState === "idle" && isInView && modelVisibility >= MODEL_REVEAL_TRIGGER) {
      const t = setTimeout(startScan, BBOX_DRAW_DURATION + SCAN_START_DELAY);
      return () => clearTimeout(t);
    }
  }, [scanState, isInView, modelVisibility, startScan]);

  useEffect(() => {
    if (
      scanState === "complete" &&
      modelVisibility < MODEL_REARM_THRESHOLD
    ) {
      cancelAnimationFrame(rafRef.current);
      setScanState("idle");
      stopEdgeRef.current?.setAttribute("offset", "0%");
      stopFadeRef.current?.setAttribute("offset", "4%");
    }
  }, [scanState, modelVisibility]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const showBbox = scanState !== "idle" || reducedMotion;
  const showMesh = scanState === "scanning" || scanState === "complete" || reducedMotion;

  const bboxStyle: CSSProperties = {
    opacity: showBbox ? 1 : 0,
    transition: reducedMotion ? "none" : `opacity ${BBOX_DRAW_DURATION}ms ease-out`,
  };

  return (
    <div
      ref={maskVarRef}
      className="pointer-events-none absolute inset-0"
    >
      <div
        className="absolute left-[13.5%] top-[27%] h-[58%] w-[72%]"
        style={bboxStyle}
      >
        <div className="absolute inset-0 border border-primary-text/75">
          <span className="absolute -left-px -top-px size-3 border-l-2 border-t-2 border-primary-text" />
          <span className="absolute -right-px -top-px size-3 border-r-2 border-t-2 border-primary-text" />
          <span className="absolute -bottom-px -left-px size-3 border-b-2 border-l-2 border-primary-text" />
          <span className="absolute -bottom-px -right-px size-3 border-b-2 border-r-2 border-primary-text" />
          <span className="absolute -top-7 left-0 bg-background/88 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-primary-text backdrop-blur-sm sm:text-[9px]">
            Vehicle / Sedan
          </span>
        </div>

        {showMesh && (
          <svg
            ref={svgRef}
            aria-hidden="true"
            className="inference-mesh absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 1000 525"
          >
            <defs>
              <linearGradient id="scan-reveal-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" />
                <stop
                  ref={stopEdgeRef}
                  offset={reducedMotion || scanState === "complete" ? "100%" : "0%"}
                  stopColor="white"
                />
                <stop
                  ref={stopFadeRef}
                  offset={reducedMotion || scanState === "complete" ? "100%" : "4%"}
                  stopColor="black"
                />
                <stop offset="100%" stopColor="black" />
              </linearGradient>
              <mask id="scan-reveal-mask">
                <rect
                  width="1000"
                  height="525"
                  fill="url(#scan-reveal-grad)"
                />
              </mask>
            </defs>

            <g
              mask={reducedMotion ? undefined : "url(#scan-reveal-mask)"}
              opacity={scanState === "complete" || reducedMotion ? 0.05 : 0.07}
            >
              {TRIANGLES.map(([a, b, c], i) => {
                const polyDuration = `${(1.6 + ((i * 31) % 20) * 0.07).toFixed(2)}s`;
                const polyDelay = `${(((i * 43) % 20) * 0.07).toFixed(2)}s`;

                return (
                  <polygon
                    key={`t${i}`}
                    className={reducedMotion ? undefined : "mesh-poly-animated"}
                    fill="rgba(220, 230, 235, 1)"
                    points={`${VERTICES[a].x},${VERTICES[a].y} ${VERTICES[b].x},${VERTICES[b].y} ${VERTICES[c].x},${VERTICES[c].y}`}
                    style={
                      reducedMotion
                        ? undefined
                        : ({
                            "--poly-duration": polyDuration,
                            "--poly-delay": polyDelay,
                          } as CSSProperties)
                    }
                  />
                );
              })}
            </g>

            <g
              mask={reducedMotion ? undefined : "url(#scan-reveal-mask)"}
              opacity={scanState === "complete" || reducedMotion ? 0.45 : 0.55}
            >
              {EDGES.map(([a, b], i) => {
                const va = VERTICES[a];
                const vb = VERTICES[b];
                const isAccent = va.accent || vb.accent;
                const edgeDuration = `${(1.3 + ((i * 29) % 20) * 0.05).toFixed(2)}s`;
                const edgeDelay = `${(((i * 47) % 25) * 0.05).toFixed(2)}s`;

                return (
                  <line
                    key={`e${i}`}
                    className={reducedMotion ? undefined : "mesh-edge-animated"}
                    stroke={
                      isAccent
                        ? "rgba(255, 181, 71, 0.55)"
                        : "rgba(220, 230, 235, 0.7)"
                    }
                    strokeWidth={isAccent ? 0.8 : 0.6}
                    style={
                      reducedMotion
                        ? undefined
                        : ({
                            "--edge-duration": edgeDuration,
                            "--edge-delay": edgeDelay,
                          } as CSSProperties)
                    }
                    x1={va.x}
                    x2={vb.x}
                    y1={va.y}
                    y2={vb.y}
                  />
                );
              })}
            </g>

            <g
              mask={reducedMotion ? undefined : "url(#scan-reveal-mask)"}
              opacity={scanState === "complete" || reducedMotion ? 0.85 : 0.95}
            >
              {VERTICES.map((v, i) => {
                if (!v.visible) return null;
                const pulseDuration = `${(0.85 + ((i * 37) % 15) * 0.04).toFixed(2)}s`;
                const pulseDelay = `${(((i * 53) % 20) * 0.05).toFixed(2)}s`;

                return (
                  <circle
                    key={`v${i}`}
                    className={
                      reducedMotion
                        ? undefined
                        : v.accent
                          ? "mesh-accent-node"
                          : "mesh-node"
                    }
                    cx={v.x}
                    cy={v.y}
                    fill={
                      v.accent
                        ? "rgba(255, 181, 71, 0.95)"
                        : "rgba(240, 242, 238, 0.85)"
                    }
                    r={v.accent ? 2.5 : 1.8}
                    style={
                      reducedMotion
                        ? undefined
                        : ({
                            "--pulse-duration": pulseDuration,
                            "--pulse-delay": pulseDelay,
                          } as CSSProperties)
                    }
                  />
                );
              })}
            </g>
          </svg>
        )}
      </div>

      <div
        className="absolute left-[20%] top-[50.5%] h-[6%] min-h-4 w-[8%] border-2 border-accent"
        style={bboxStyle}
      >
        <span className="absolute -bottom-7 right-0 whitespace-nowrap bg-background/90 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-accent backdrop-blur-sm sm:text-[9px]">
          Plate / CV 2048
        </span>
      </div>
    </div>
  );
}
