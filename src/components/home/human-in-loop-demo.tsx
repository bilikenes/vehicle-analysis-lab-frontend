"use client";

import { Check, CornerDownRight, Move, RotateCcw } from "lucide-react";
import Image from "next/image";
import {
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useMemo,
  useRef,
  useState,
} from "react";

export type PlateBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BoxTransformMode = "move" | "nw" | "se";

const MODEL_BOX: PlateBox = { x: 18.2, y: 47.4, width: 11.5, height: 9.2 };
const MODEL_OCR = "CV 204B";
const CORRECT_OCR = "CV 2048";
const MIN_BOX_WIDTH = 6;
const MIN_BOX_HEIGHT = 4.5;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundGeometry(value: number) {
  return Math.round(value * 100) / 100;
}

export function transformPlateBox(
  start: PlateBox,
  mode: BoxTransformMode,
  deltaX: number,
  deltaY: number,
): PlateBox {
  if (mode === "move") {
    return {
      ...start,
      x: roundGeometry(clamp(start.x + deltaX, 0, 100 - start.width)),
      y: roundGeometry(clamp(start.y + deltaY, 0, 100 - start.height)),
    };
  }

  if (mode === "nw") {
    const right = start.x + start.width;
    const bottom = start.y + start.height;
    const x = clamp(start.x + deltaX, 0, right - MIN_BOX_WIDTH);
    const y = clamp(start.y + deltaY, 0, bottom - MIN_BOX_HEIGHT);

    return {
      x: roundGeometry(x),
      y: roundGeometry(y),
      width: roundGeometry(right - x),
      height: roundGeometry(bottom - y),
    };
  }

  return {
    ...start,
    width: roundGeometry(clamp(start.width + deltaX, MIN_BOX_WIDTH, 100 - start.x)),
    height: roundGeometry(clamp(start.height + deltaY, MIN_BOX_HEIGHT, 100 - start.y)),
  };
}

type ActiveTransform = {
  mode: BoxTransformMode;
  pointerId: number;
  startBox: PlateBox;
  startX: number;
  startY: number;
};

function boxesMatch(left: PlateBox, right: PlateBox) {
  return (
    left.x === right.x &&
    left.y === right.y &&
    left.width === right.width &&
    left.height === right.height
  );
}

export function HumanInLoopDemo() {
  const stageRef = useRef<HTMLDivElement>(null);
  const activeTransform = useRef<ActiveTransform | null>(null);
  const [box, setBox] = useState<PlateBox>(MODEL_BOX);
  const [ocr, setOcr] = useState(MODEL_OCR);
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const boxEdited = !boxesMatch(box, MODEL_BOX);
  const ocrEdited = ocr !== MODEL_OCR;

  const cropStyle = useMemo(() => {
    const horizontalPosition = (box.x / (100 - box.width)) * 100;
    const verticalPosition = (box.y / (100 - box.height)) * 100;

    return {
      aspectRatio: `${box.width * 1731} / ${box.height * 909}`,
      backgroundImage: "url('/images/model-vision-vehicle.png')",
      backgroundPosition: `${horizontalPosition}% ${verticalPosition}%`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${10000 / box.width}% auto`,
    };
  }, [box]);

  const markChanged = () => {
    setSaved(false);
    setMessage(null);
  };

  const beginTransform = (
    mode: BoxTransformMode,
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    stageRef.current?.setPointerCapture(event.pointerId);
    activeTransform.current = {
      mode,
      pointerId: event.pointerId,
      startBox: box,
      startX: event.clientX,
      startY: event.clientY,
    };
    markChanged();
  };

  const continueTransform = (event: ReactPointerEvent<HTMLDivElement>) => {
    const active = activeTransform.current;
    const stage = stageRef.current;

    if (!active || !stage) {
      return;
    }

    const bounds = stage.getBoundingClientRect();
    const deltaX = ((event.clientX - active.startX) / bounds.width) * 100;
    const deltaY = ((event.clientY - active.startY) / bounds.height) * 100;
    setBox(transformPlateBox(active.startBox, active.mode, deltaX, deltaY));
  };

  const finishTransform = (event: ReactPointerEvent<HTMLDivElement>) => {
    const active = activeTransform.current;
    if (!active) {
      return;
    }

    if (stageRef.current?.hasPointerCapture(active.pointerId)) {
      stageRef.current.releasePointerCapture(active.pointerId);
    }
    activeTransform.current = null;
    event.preventDefault();
  };

  const applyKeyboardTransform = (
    mode: BoxTransformMode,
    event: KeyboardEvent<HTMLElement>,
  ) => {
    const step = event.shiftKey ? 2 : 0.6;
    let deltaX = 0;
    let deltaY = 0;

    if (event.key === "ArrowLeft") {
      deltaX = -step;
    } else if (event.key === "ArrowRight") {
      deltaX = step;
    } else if (event.key === "ArrowUp") {
      deltaY = -step;
    } else if (event.key === "ArrowDown") {
      deltaY = step;
    } else {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    markChanged();
    setBox((current) => transformPlateBox(current, mode, deltaX, deltaY));
  };

  const updateOcr = (event: ChangeEvent<HTMLInputElement>) => {
    markChanged();
    setOcr(event.target.value.toUpperCase());
  };

  const resetDemo = () => {
    setBox(MODEL_BOX);
    setOcr(MODEL_OCR);
    setSaved(false);
    setMessage(null);
  };

  const saveCorrection = () => {
    if (!boxEdited) {
      setSaved(false);
      setMessage("Move or resize the plate box first.");
      return;
    }

    if (ocr.replaceAll(" ", "") !== CORRECT_OCR.replaceAll(" ", "")) {
      setSaved(false);
      setMessage("Check the plate text in the crop preview.");
      return;
    }

    setSaved(true);
    setMessage(null);
  };

  return (
    <section
      aria-labelledby="human-loop-heading"
      className="relative border-t border-border bg-background px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
      id="human-in-the-loop"
    >
      <div className="human-loop-grid pointer-events-none absolute inset-0 opacity-45" />

      <div className="relative mx-auto w-full max-w-[1320px]">
        <div className="mb-10 grid gap-7 sm:mb-14 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              03 / Human in the loop
            </p>
            <h2
              className="max-w-4xl text-balance text-[clamp(2.6rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.06em]"
              id="human-loop-heading"
            >
              AI got it <span className="text-secondary-text">almost right.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-secondary-text sm:text-base sm:leading-7">
            Correct the plate region and OCR result. Your feedback completes the loop.
          </p>
        </div>

        <div className="grid overflow-hidden border border-border bg-surface lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.65fr)]">
          <div className="border-b border-border p-3 sm:p-5 lg:border-b-0 lg:border-r">
            <div
              ref={stageRef}
              className="relative aspect-[1731/909] overflow-hidden bg-background select-none"
              onPointerCancel={finishTransform}
              onPointerMove={continueTransform}
              onPointerUp={finishTransform}
            >
              <Image
                alt="Graphite sedan with an editable license plate region"
                className="pointer-events-none object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 850px"
                src="/images/model-vision-vehicle.png"
              />
              <div className="pointer-events-none absolute inset-0 bg-background/10" />

              <div
                aria-label="Plate bounding box. Drag to move. Use arrow keys to nudge."
                className="absolute touch-none cursor-move border-2 border-accent bg-accent/8 outline-none focus-visible:ring-2 focus-visible:ring-primary-text focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                data-testid="editable-plate-box"
                onKeyDown={(event) => applyKeyboardTransform("move", event)}
                onPointerDown={(event) => beginTransform("move", event)}
                role="group"
                style={{
                  height: `${box.height}%`,
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                }}
                tabIndex={0}
              >
                <span className="pointer-events-none absolute -top-7 left-0 whitespace-nowrap bg-background/90 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-accent sm:text-[9px]">
                  Plate / adjust
                </span>

                <button
                  aria-label="Resize plate box from top left"
                  className="absolute -left-5 -top-5 grid size-11 touch-none cursor-nwse-resize place-items-center outline-none focus-visible:ring-2 focus-visible:ring-primary-text"
                  onKeyDown={(event) => applyKeyboardTransform("nw", event)}
                  onPointerDown={(event) => beginTransform("nw", event)}
                  type="button"
                >
                  <span className="size-2.5 border border-background bg-accent" />
                </button>
                <button
                  aria-label="Resize plate box from bottom right"
                  className="absolute -bottom-5 -right-5 grid size-11 touch-none cursor-nwse-resize place-items-center outline-none focus-visible:ring-2 focus-visible:ring-primary-text"
                  onKeyDown={(event) => applyKeyboardTransform("se", event)}
                  onPointerDown={(event) => beginTransform("se", event)}
                  type="button"
                >
                  <span className="size-2.5 border border-background bg-accent" />
                </button>
              </div>

              <div className="pointer-events-none absolute bottom-3 left-3 hidden items-center gap-2 bg-background/86 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-secondary-text sm:flex">
                <Move aria-hidden="true" size={12} />
                Drag box · Resize corners
              </div>
            </div>
          </div>

          <aside aria-label="Correction controls" className="flex flex-col p-5 sm:p-7 lg:p-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-secondary-text">
                  Selected object
                </p>
                <p className="mt-1 text-sm font-medium">License plate</p>
              </div>
              <span className="border border-accent/50 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-accent">
                Needs review
              </span>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <label className="font-mono text-[9px] uppercase tracking-[0.16em] text-secondary-text">
                  Live plate crop
                </label>
                <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-secondary-text">
                  {boxEdited ? "Edited" : "Model"}
                </span>
              </div>
              <div
                aria-label="Live crop of the selected plate region"
                className="min-h-20 w-full border border-border bg-elevated-surface bg-cover"
                data-testid="plate-crop-preview"
                role="img"
                style={cropStyle}
              />
            </div>

            <div className="mt-6">
              <label
                className="font-mono text-[9px] uppercase tracking-[0.16em] text-secondary-text"
                htmlFor="demo-ocr"
              >
                OCR result
              </label>
              <div className="mt-3 flex items-center border border-border bg-elevated-surface focus-within:border-accent">
                <span className="border-r border-border px-3 font-mono text-[9px] text-secondary-text">
                  OCR
                </span>
                <input
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 font-mono text-base tracking-[0.08em] text-primary-text outline-none"
                  id="demo-ocr"
                  maxLength={10}
                  onChange={updateOcr}
                  spellCheck={false}
                  value={ocr}
                />
              </div>
              <p className="mt-2 text-xs leading-5 text-secondary-text">
                The model confused the final character. Compare it with the crop.
              </p>
            </div>

            <div aria-live="polite" className="mt-5 min-h-6">
              {saved ? (
                <p className="flex items-center gap-2 text-sm text-success">
                  <Check aria-hidden="true" size={15} />
                  Feedback added
                </p>
              ) : null}
              {message ? <p className="text-sm text-accent">{message}</p> : null}
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
              <button
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 bg-accent px-4 text-sm font-semibold text-background outline-none transition-colors hover:bg-primary-text focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!boxEdited && !ocrEdited}
                onClick={saveCorrection}
                type="button"
              >
                Save correction
                <CornerDownRight aria-hidden="true" size={15} />
              </button>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-border px-4 text-sm text-secondary-text outline-none transition-colors hover:border-primary-text hover:text-primary-text focus-visible:ring-2 focus-visible:ring-primary-text"
                onClick={resetDemo}
                type="button"
              >
                <RotateCcw aria-hidden="true" size={14} />
                Reset
              </button>
            </div>

            <p className="mt-5 border-t border-border pt-4 font-mono text-[8px] uppercase leading-5 tracking-[0.13em] text-secondary-text">
              Keyboard: arrows move · Shift + arrows move faster · Focus a corner to resize
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
