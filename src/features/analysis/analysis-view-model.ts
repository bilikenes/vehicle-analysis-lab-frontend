export type NormalizedBoundingBox = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type AnalysisImage = {
  alt: string;
  height: number;
  src: string;
  width: number;
};

export type AnalysisViewModel = {
  id: string;
  originalImage: AnalysisImage;
  plate: {
    boundingBox: NormalizedBoundingBox;
    text: string;
  };
  quota: {
    remaining: number;
    total: number;
  };
  vehicle: {
    bodyType: string;
    boundingBox: NormalizedBoundingBox;
  };
};

