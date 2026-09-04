export const REVEAL_PHASES = [
  "analyzing",
  "vehicle-detected",
  "vehicle-extracted",
  "body-resolved",
  "plate-detected",
  "plate-extracted",
  "ocr-resolved",
  "complete",
] as const;

export type RevealPhase = (typeof REVEAL_PHASES)[number];

export function revealPhaseIndex(phase: RevealPhase) {
  return REVEAL_PHASES.indexOf(phase);
}

export function hasReachedPhase(current: RevealPhase, target: RevealPhase) {
  return revealPhaseIndex(current) >= revealPhaseIndex(target);
}

export function nextRevealPhase(current: RevealPhase): RevealPhase {
  const index = revealPhaseIndex(current);
  return REVEAL_PHASES[Math.min(index + 1, REVEAL_PHASES.length - 1)];
}

export function revealPhaseLabel(phase: RevealPhase) {
  if (phase === "complete") {
    return "Analysis complete";
  }

  if (phase === "analyzing") {
    return "Analyzing image...";
  }

  return "Extracting results...";
}
