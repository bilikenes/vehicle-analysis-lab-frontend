import { BoxGeometry, Mesh, OrthographicCamera } from "three";
import { describe, expect, it } from "vitest";

import { projectMeshesToScreen } from "./project-mesh-bounds";

function createCamera() {
  const camera = new OrthographicCamera(-2, 2, 2, -2, 0.1, 10);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();
  return camera;
}

describe("projectMeshesToScreen", () => {
  it("projects a mesh bounding box into percentage coordinates", () => {
    const mesh = new Mesh(new BoxGeometry(2, 2, 2));
    mesh.updateMatrixWorld(true);

    expect(projectMeshesToScreen([mesh], createCamera(), 0)).toEqual({
      left: 25,
      top: 25,
      width: 50,
      height: 50,
    });
  });

  it("tracks transforms and applies percentage padding", () => {
    const mesh = new Mesh(new BoxGeometry(2, 2, 2));
    mesh.position.x = 1;
    mesh.updateMatrixWorld(true);

    expect(projectMeshesToScreen([mesh], createCamera(), 2)).toEqual({
      left: 48,
      top: 23,
      width: 52,
      height: 54,
    });
  });

  it("returns null when there are no measurable meshes", () => {
    expect(projectMeshesToScreen([], createCamera())).toBeNull();
  });
});
