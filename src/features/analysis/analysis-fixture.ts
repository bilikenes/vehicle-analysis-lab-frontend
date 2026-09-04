import type { AnalysisViewModel } from "./analysis-view-model";

const FIXTURE_IMAGE = {
  alt: "Black sedan photographed in a dark studio",
  height: 941,
  src: "/images/human-in-loop-vehicle.png",
  width: 1672,
} as const;

export const ANALYSIS_FIXTURE_NOTICE =
  "Prototype result — live analysis is not connected yet.";

export function getAnalysisFixture(analysisId: string): AnalysisViewModel {
  return {
    id: analysisId,
    originalImage: FIXTURE_IMAGE,
    plate: {
      boundingBox: { height: 0.074, width: 0.148, x: 0.561, y: 0.608 },
      text: "34 ABC 128",
    },
    quota: {
      remaining: analysisId === "demo-quota-exhausted" ? 0 : 3,
      total: 5,
    },
    vehicle: {
      bodyType: "Sedan",
      boundingBox: { height: 0.63, width: 0.68, x: 0.188, y: 0.168 },
    },
  };
}

export function buildFixtureDownloadPayload(analysis: AnalysisViewModel) {
  return {
    fixture_notice: ANALYSIS_FIXTURE_NOTICE,
    analysis_id: analysis.id,
    image: {
      height: analysis.originalImage.height,
      width: analysis.originalImage.width,
    },
    plate: analysis.plate.text.replaceAll(" ", ""),
    body_type: analysis.vehicle.bodyType.toLowerCase(),
    vehicle_bbox_normalized: analysis.vehicle.boundingBox,
    plate_bbox_normalized: analysis.plate.boundingBox,
    quota: analysis.quota,
  };
}

