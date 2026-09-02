"use client";

import { Center, ContactShadows, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Component, Suspense, type ReactNode, useMemo, useRef } from "react";
import { MathUtils, Mesh, MeshStandardMaterial, type Group } from "three";

import { SceneFallback } from "@/components/home/scene-fallback";
import {
  projectMeshesToScreen,
  type ScreenBounds,
} from "@/lib/geometry/project-mesh-bounds";

type VehicleSceneProps = {
  onBoundsChange?: (bounds: ScreenBounds) => void;
  reduceMotion: boolean;
};

type SceneErrorBoundaryProps = {
  children: ReactNode;
};

type SceneErrorBoundaryState = {
  failed: boolean;
};

class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <SceneFallback message="Static preview active" />;
    }

    return this.props.children;
  }
}

function BmwM5({ onBoundsChange, reduceMotion }: VehicleSceneProps) {
  const vehicle = useRef<Group>(null);
  const previousBounds = useRef<ScreenBounds | null>(null);
  const { scene } = useGLTF("/models/bmw-m5-hero.glb");
  const { meshes, model } = useMemo(() => {
    const instance = scene.clone(true);
    const modelMeshes: Mesh[] = [];

    instance.traverse((child) => {
      if (child instanceof Mesh) {
        modelMeshes.push(child);
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name.includes("Paint_Geo") && !Array.isArray(child.material)) {
          const paint = child.material.clone();

          if (paint instanceof MeshStandardMaterial) {
            paint.map = null;
            paint.color.set("#ffb546");
            paint.metalness = 0.75;
            paint.roughness = 0.28;
            paint.needsUpdate = true;
          }

          child.material = paint;
        }
      }
    });

    return { meshes: modelMeshes, model: instance };
  }, [scene]);

  useFrame((state, delta) => {
    if (!vehicle.current) {
      return;
    }

    const targetYaw = reduceMotion ? 0.67 : 0.67 + state.pointer.x * 1.75;
    const targetPitch = reduceMotion ? -0.035 : -0.0 - state.pointer.y * 0.025;

    vehicle.current.rotation.y = MathUtils.damp(
      vehicle.current.rotation.y,
      targetYaw,
      3.8,
      delta,
    );
    vehicle.current.rotation.x = MathUtils.damp(
      vehicle.current.rotation.x,
      targetPitch,
      3.8,
      delta,
    );

    vehicle.current.updateMatrixWorld(true);
    const bounds = projectMeshesToScreen(meshes, state.camera);

    if (
      bounds &&
      (!previousBounds.current ||
        Math.abs(bounds.left - previousBounds.current.left) > 0.02 ||
        Math.abs(bounds.top - previousBounds.current.top) > 0.02 ||
        Math.abs(bounds.width - previousBounds.current.width) > 0.02 ||
        Math.abs(bounds.height - previousBounds.current.height) > 0.02)
    ) {
      previousBounds.current = bounds;
      onBoundsChange?.(bounds);
    }
  });

  return (
    <group ref={vehicle} rotation={[-0.035, -0.1, 0]}>
      <Center top>
        <primitive object={model} scale={100} />
      </Center>
    </group>
  );
}

export default function ThreeDVehicleScene({ onBoundsChange, reduceMotion }: VehicleSceneProps) {
  return (
    <SceneErrorBoundary>
      <Canvas
        camera={{ fov: 32, position: [5.6, 2.1, 7.4] }}
        dpr={[1, 1.5]}
        frameloop={reduceMotion ? "demand" : "always"}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        shadows
      >
        <ambientLight intensity={2.5} />
        <spotLight
          angle={0.42}
          castShadow
          intensity={16}
          penumbra={0.86}
          position={[2.4, 6.4, 5.2]}
        />
        <directionalLight color="#ffffff" intensity={1.1} position={[-4, 2, -3]} />
        <directionalLight color="#fafafa" intensity={0.7} position={[4, 3, -5]} />
        <directionalLight color="#f5f7ff" intensity={5.5} position={[5.6, 2.2, 7.4]} />
        <Suspense fallback={null}>
          <BmwM5 onBoundsChange={onBoundsChange} reduceMotion={reduceMotion} />
        </Suspense>
        <ContactShadows
          blur={2.8}
          far={4.2}
          opacity={0.72}
          position={[0, -0.02, 0]}
          resolution={512}
          scale={9}
        />
      </Canvas>
    </SceneErrorBoundary>
  );
}
