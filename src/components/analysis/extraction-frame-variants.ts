export type ExtractionFrameVariant = "plate" | "vehicle";

export const EXTRACTION_FRAME_CLIP_PATH: Record<ExtractionFrameVariant, string> = {
  vehicle: "polygon(9% 0, 100% 0, 94% 100%, 0 100%)",
  plate: "polygon(4% 0, 100% 0, 95% 100%, 0 100%)",
};
