import { type Camera, type Mesh, Vector3 } from "three";

export type ScreenBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const projectedCorner = new Vector3();

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function projectMeshesToScreen(
  meshes: readonly Mesh[],
  camera: Camera,
  padding = 1.5,
): ScreenBounds | null {
  let minimumX = Number.POSITIVE_INFINITY;
  let maximumX = Number.NEGATIVE_INFINITY;
  let minimumY = Number.POSITIVE_INFINITY;
  let maximumY = Number.NEGATIVE_INFINITY;

  for (const mesh of meshes) {
    if (!mesh.geometry.boundingBox) {
      mesh.geometry.computeBoundingBox();
    }

    const box = mesh.geometry.boundingBox;

    if (!box) {
      continue;
    }

    for (const x of [box.min.x, box.max.x]) {
      for (const y of [box.min.y, box.max.y]) {
        for (const z of [box.min.z, box.max.z]) {
          projectedCorner.set(x, y, z).applyMatrix4(mesh.matrixWorld).project(camera);

          if (!Number.isFinite(projectedCorner.x) || !Number.isFinite(projectedCorner.y)) {
            continue;
          }

          minimumX = Math.min(minimumX, projectedCorner.x);
          maximumX = Math.max(maximumX, projectedCorner.x);
          minimumY = Math.min(minimumY, projectedCorner.y);
          maximumY = Math.max(maximumY, projectedCorner.y);
        }
      }
    }
  }

  if (![minimumX, maximumX, minimumY, maximumY].every(Number.isFinite)) {
    return null;
  }

  const left = clamp((minimumX + 1) * 50 - padding, 0, 100);
  const right = clamp((maximumX + 1) * 50 + padding, 0, 100);
  const top = clamp((1 - maximumY) * 50 - padding, 0, 100);
  const bottom = clamp((1 - minimumY) * 50 + padding, 0, 100);

  return {
    left,
    top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}
