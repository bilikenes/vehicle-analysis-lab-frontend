import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getAnalysisFixture } from "@/features/analysis/analysis-fixture";

import { AnalysisUtilityBar } from "./analysis-utility-bar";
import { EXTRACTION_FRAME_CLIP_PATH } from "./extraction-frame-variants";
import { NewAnalysisUploadState } from "./new-analysis-upload-state";
import { ExtractionSequence } from "./extraction-sequence";

afterEach(cleanup);

describe("AnalysisUtilityBar", () => {
  it("exposes completed-result actions and the server-replaceable fixture quota", () => {
    const onNewAnalysis = vi.fn();
    render(
      <AnalysisUtilityBar
        analysis={getAnalysisFixture("demo")}
        onNewAnalysis={onNewAnalysis}
        phase="complete"
      />,
    );

    expect(screen.getByText("Analysis complete")).toBeInTheDocument();
    expect(screen.getByText("3 of 5 analyses remaining")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /new analysis/i }));
    expect(onNewAnalysis).toHaveBeenCalledOnce();
  });

  it("keeps the result usable while disabling new analysis at zero quota", () => {
    render(
      <AnalysisUtilityBar
        analysis={getAnalysisFixture("demo-quota-exhausted")}
        onNewAnalysis={() => undefined}
        phase="complete"
      />,
    );

    expect(screen.getByRole("button", { name: /new analysis/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /download/i })).toBeEnabled();
  });
});

describe("ExtractionSequence", () => {
  it("provides keyboard trace-back equivalents for all four modules", () => {
    const onFocusChange = vi.fn();
    render(
      <ExtractionSequence
        analysis={getAnalysisFixture("demo")}
        anchorRefs={{
          bodyType: { current: null },
          ocrResult: { current: null },
          plateCrop: { current: null },
          vehicleCrop: { current: null },
        }}
        focus={null}
        onFocusChange={onFocusChange}
        phase="complete"
        plateCropRef={{ current: null }}
        vehicleCropRef={{ current: null }}
      />,
    );

    fireEvent.focus(screen.getByRole("region", { name: /vehicle crop; trace/i }));
    fireEvent.focus(screen.getByRole("region", { name: /plate crop; trace/i }));
    fireEvent.focus(screen.getByRole("region", { name: /body type: sedan/i }));
    fireEvent.focus(screen.getByRole("region", { name: /ocr result: 34 abc 128/i }));

    expect(onFocusChange).toHaveBeenCalledWith("vehicle-crop");
    expect(onFocusChange).toHaveBeenCalledWith("plate-crop");
    expect(onFocusChange).toHaveBeenCalledWith("body-type");
    expect(onFocusChange).toHaveBeenCalledWith("ocr-result");
    expect(screen.getByText("34 ABC 128")).toBeInTheDocument();
    expect(screen.getByText("Sedan")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Extracted vehicle crop" })).toHaveStyle({
      clipPath: EXTRACTION_FRAME_CLIP_PATH.vehicle,
    });
    expect(screen.getByRole("img", { name: "Extracted plate crop" })).toHaveStyle({
      clipPath: EXTRACTION_FRAME_CLIP_PATH.plate,
    });
  });
});

describe("NewAnalysisUploadState", () => {
  it("rejects unsupported files without replacing the current result", () => {
    const onAccept = vi.fn();
    render(
      <NewAnalysisUploadState
        onAccept={onAccept}
        onCancel={() => undefined}
      />,
    );

    const input = screen.getByLabelText("Choose another vehicle image");
    fireEvent.change(input, {
      target: { files: [new File(["not-an-image"], "vehicle.pdf", { type: "application/pdf" })] },
    });

    expect(screen.getByText("Choose a JPG, PNG, or WEBP image.")).toBeInTheDocument();
    expect(onAccept).not.toHaveBeenCalled();
  });
});
