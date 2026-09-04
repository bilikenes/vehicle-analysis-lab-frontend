import { describe, expect, it } from "vitest";

import {
  nextRevealPhase,
  REVEAL_PHASES,
  type RevealPhase,
} from "./reveal-state";

describe("nextRevealPhase", () => {
  it("advances through the reveal in the locked order", () => {
    const visited: RevealPhase[] = [REVEAL_PHASES[0]];
    let current: RevealPhase = REVEAL_PHASES[0];

    while (current !== "complete") {
      current = nextRevealPhase(current);
      visited.push(current);
    }

    expect(visited).toEqual(REVEAL_PHASES);
    expect(visited.indexOf("body-resolved")).toBeLessThan(
      visited.indexOf("plate-detected"),
    );
  });

  it("keeps the complete phase stable", () => {
    expect(nextRevealPhase("complete")).toBe("complete");
  });
});
