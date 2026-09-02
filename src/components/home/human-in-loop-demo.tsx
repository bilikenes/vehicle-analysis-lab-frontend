"use client";

import { ArrowUpRight, Check, RotateCcw } from "lucide-react";
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

const HUMAN_IN_LOOP_IMAGE = "/images/human-in-loop-vehicle.png";
const MODEL_BOX: PlateBox = { x: 56.1, y: 60.8, width: 14.8, height: 7.4 };
const MODEL_OCR = "34 ABC 12B";
const CORRECT_OCR = "34 ABC 128";
const MIN_BOX_WIDTH = 6;
const MIN_BOX_HEIGHT = 4.5;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundGeometry(value: number) {
  return Math.round(value * 100) / 100;
}

export function normalizeTurkishPlateInput(value: string) {
  const compact = value.toUpperCase().replace(/[^0-9A-Z]/g, "");
  const cityCode = compact.slice(0, 2).replace(/\D/g, "").slice(0, 2);
  const remainder = compact.slice(cityCode.length);
  const letters = remainder.match(/^[A-Z]{0,3}/)?.[0] ?? "";
  const digits = remainder
    .slice(letters.length)
    .replace(/\D/g, "")
    .slice(0, 4);

  return [cityCode, letters, digits].filter(Boolean).join(" ");
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
  const [saved, setSaved] = useState(false);

  const boxEdited = !boxesMatch(box, MODEL_BOX);
  const hasCorrectOcr = ocr === CORRECT_OCR;

  const cropStyle = useMemo(() => {
    const horizontalPosition = (box.x / (100 - box.width)) * 100;
    const verticalPosition = (box.y / (100 - box.height)) * 100;

    return {
      aspectRatio: `${box.width * 1672} / ${box.height * 941}`,
      backgroundImage: `url('${HUMAN_IN_LOOP_IMAGE}')`,
      backgroundPosition: `${horizontalPosition}% ${verticalPosition}%`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${10000 / box.width}% auto`,
    };
  }, [box]);

  const markChanged = () => {
    setSaved(false);
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
    setOcr(normalizeTurkishPlateInput(event.target.value));
  };

  const resetDemo = () => {
    setBox(MODEL_BOX);
    setOcr(MODEL_OCR);
    setSaved(false);
  };

  const saveCorrection = () => {
    if (!boxEdited || !hasCorrectOcr) {
      return;
    }

    setSaved(true);
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
            Fix the result. Improve the model.
          </p>
        </div>

        <div className="grid overflow-hidden border border-border bg-surface lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.65fr)]">
          <div className="border-b border-border p-3 sm:p-5 lg:border-b-0 lg:border-r">
            <div
              ref={stageRef}
              className="relative aspect-[1672/941] overflow-hidden bg-background select-none"
              onPointerCancel={finishTransform}
              onPointerMove={continueTransform}
              onPointerUp={finishTransform}
            >
              <Image
                alt="Black sedan with an editable license plate region"
                className="pointer-events-none object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 850px"
                src={HUMAN_IN_LOOP_IMAGE}
              />
              <div className="pointer-events-none absolute inset-0 bg-background/10" />

              <div
                aria-label="Plate bounding box"
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

            </div>
          </div>

          <aside aria-label="Correction workflow" className="relative flex flex-col p-5 sm:p-7 lg:p-8">
            <div className="border-b border-border pb-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                Review the result
              </p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-secondary-text">
                Adjust the plate region or correct the text.
              </p>
            </div>

            <div className="mt-6">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-secondary-text">
                Plate crop
              </p>
              <div
                aria-label="Live crop of the selected plate region"
                className="relative min-h-24 w-full overflow-hidden border border-accent/35 bg-elevated-surface bg-cover shadow-[0_0_32px_rgba(255,181,71,0.08)] transition-shadow duration-300"
                data-testid="plate-crop-preview"
                role="img"
                style={cropStyle}
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent/70" />
              </div>
            </div>

            <div className="mt-7 border-y border-border py-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-secondary-text">
                Model read
              </p>
              <div className="mt-2 flex items-center gap-2 font-mono text-lg tracking-[0.12em] text-secondary-text">
                <span>{MODEL_OCR.slice(0, -1)}</span>
                <span className="border-b border-accent pb-0.5 text-accent">{MODEL_OCR.at(-1)}</span>
                <span className="ml-auto font-sans text-xs tracking-normal text-secondary-text">Low confidence</span>
              </div>
            </div>

            <div className="mt-6">
              <label className="font-mono text-[9px] uppercase tracking-[0.16em] text-secondary-text" htmlFor="demo-ocr">
                Your correction
              </label>
              <div className="mt-3 border-b border-border bg-elevated-surface/45 px-4 pb-2 pt-3 transition-colors focus-within:border-accent">
                <input
                  aria-describedby="plate-format-hint"
                  className="w-full bg-transparent font-mono text-lg tracking-[0.12em] text-primary-text outline-none placeholder:text-secondary-text/50"
                  id="demo-ocr"
                  inputMode="text"
                  maxLength={10}
                  onChange={updateOcr}
                  placeholder="34 ABC 128"
                  spellCheck={false}
                  value={ocr}
                />
              </div>
              <p className="mt-2 text-xs leading-5 text-secondary-text" id="plate-format-hint">
                Turkish plate format is applied as you type.
              </p>
            </div>

            <div aria-live="polite" className="mt-5 min-h-11">
              {saved ? (
                <div className="border border-success/35 bg-success/8 px-3 py-2.5 text-success">
                  <p className="flex items-center gap-2 text-sm">
                  <Check aria-hidden="true" size={15} />
                    Feedback added <span className="font-mono text-xs">+1</span>
                  </p>
                  <p className="mt-1 pl-6 text-xs text-secondary-text">This helps improve the model.</p>
                </div>
              ) : null}
            </div>

            <div className="mt-auto flex items-center gap-3 pt-5">
              <button
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 border border-accent bg-accent/10 px-4 text-sm font-semibold text-accent outline-none transition-colors hover:bg-accent hover:text-background focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:border-border disabled:bg-transparent disabled:text-secondary-text"
                disabled={!boxEdited || !hasCorrectOcr}
                onClick={saveCorrection}
                type="button"
              >
                Add correction
                <ArrowUpRight aria-hidden="true" size={15} />
              </button>
              <button
                aria-label="Reset correction demo"
                className="grid size-11 place-items-center border border-border text-secondary-text outline-none transition-colors hover:border-primary-text hover:text-primary-text focus-visible:ring-2 focus-visible:ring-primary-text"
                onClick={resetDemo}
                type="button"
              >
                <RotateCcw aria-hidden="true" size={14} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
