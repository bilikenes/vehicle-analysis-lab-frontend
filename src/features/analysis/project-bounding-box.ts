import type { NormalizedBoundingBox } from "./analysis-view-model";

export type Rectangle = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type ContainedImageRectInput = {
  containerHeight: number;
  containerWidth: number;
  naturalHeight: number;
  naturalWidth: number;
};

export function containedImageRect({
  containerHeight,
  containerWidth,
  naturalHeight,
  naturalWidth,
}: ContainedImageRectInput): Rectangle {
  if (
    containerHeight <= 0 ||
    containerWidth <= 0 ||
    naturalHeight <= 0 ||
    naturalWidth <= 0
  ) {
    return { height: 0, left: 0, top: 0, width: 0 };
  }

  const scale = Math.min(
    containerWidth / naturalWidth,
    containerHeight / naturalHeight,
  );
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;

  return {
    height,
    left: (containerWidth - width) / 2,
    top: (containerHeight - height) / 2,
    width,
  };
}

export function projectBoundingBox(
  box: NormalizedBoundingBox,
  imageBounds: Rectangle,
): Rectangle {
  return {
    height: imageBounds.height * box.height,
    left: imageBounds.left + imageBounds.width * box.x,
    top: imageBounds.top + imageBounds.height * box.y,
    width: imageBounds.width * box.width,
  };
}

export function boundingBoxPercentStyle(box: NormalizedBoundingBox) {
  return {
    height: `${box.height * 100}%`,
    left: `${box.x * 100}%`,
    top: `${box.y * 100}%`,
    width: `${box.width * 100}%`,
  };
}

export function cropBackgroundStyle(
  imageSrc: string,
  box: NormalizedBoundingBox,
  imageDimensions?: { height: number; width: number },
) {
  const horizontalPosition = (box.x / Math.max(1 - box.width, Number.EPSILON)) * 100;
  const verticalPosition = (box.y / Math.max(1 - box.height, Number.EPSILON)) * 100;

  return {
    aspectRatio: imageDimensions
      ? `${imageDimensions.width * box.width} / ${imageDimensions.height * box.height}`
      : `${box.width} / ${box.height}`,
    backgroundImage: `url('${imageSrc}')`,
    backgroundPosition: `${horizontalPosition}% ${verticalPosition}%`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${100 / box.width}% auto`,
  };
}
