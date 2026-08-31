"use client";

import { ContactShadows, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Component, type ReactNode, useRef } from "react";
import { MathUtils, type Group } from "three";

import { SceneFallback } from "@/components/home/scene-fallback";

type VehicleSceneProps = {
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

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.43, 0.43, 0.28, 32]} />
        <meshStandardMaterial color="#050607" metalness={0.1} roughness={0.78} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.015, 20]} />
        <meshStandardMaterial color="#5d6267" metalness={0.9} roughness={0.24} />
      </mesh>
    </group>
  );
}

function InterimVehicle({ reduceMotion }: VehicleSceneProps) {
  const vehicle = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!vehicle.current) {
      return;
    }

    const targetYaw = reduceMotion ? -0.34 : -0.34 + state.pointer.x * 0.085;
    const targetPitch = reduceMotion ? -0.035 : -0.035 - state.pointer.y * 0.025;

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
  });

  return (
    <group ref={vehicle} position={[0, -0.18, 0]} rotation={[-0.035, -0.34, 0]}>
      <RoundedBox args={[4.65, 0.72, 1.88]} castShadow position={[0, 0, 0]} radius={0.24} smoothness={5}>
        <meshPhysicalMaterial
          clearcoat={0.26}
          clearcoatRoughness={0.68}
          color="#282d31"
          metalness={0.72}
          roughness={0.4}
        />
      </RoundedBox>

      <RoundedBox args={[2.48, 0.79, 1.62]} castShadow position={[-0.18, 0.63, 0]} radius={0.22} smoothness={5}>
        <meshPhysicalMaterial color="#171b1e" metalness={0.66} roughness={0.34} />
      </RoundedBox>

      <RoundedBox args={[1.62, 0.53, 1.48]} position={[-0.16, 0.72, 0]} radius={0.16} smoothness={4}>
        <meshPhysicalMaterial
          color="#07090a"
          metalness={0.28}
          opacity={0.92}
          roughness={0.18}
          transparent
        />
      </RoundedBox>

      <mesh castShadow position={[1.88, 0.13, 0]} rotation={[0, 0, -0.06]}>
        <boxGeometry args={[0.84, 0.42, 1.76]} />
        <meshPhysicalMaterial color="#24292d" metalness={0.72} roughness={0.38} />
      </mesh>

      <mesh position={[2.315, 0.12, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.02, 0.2]} />
        <meshStandardMaterial color="#111518" metalness={0.72} roughness={0.28} />
      </mesh>

      <mesh position={[2.325, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.37, 0.095]} />
        <meshStandardMaterial color="#ffb547" emissive="#ffb547" emissiveIntensity={0.75} />
      </mesh>

      {([-0.66, 0.66] as const).map((z) => (
        <mesh key={z} position={[2.34, 0.27, z]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.38, 0.105]} />
          <meshStandardMaterial color="#e9ece8" emissive="#e9ece8" emissiveIntensity={1.1} />
        </mesh>
      ))}

      <Wheel position={[-1.62, -0.37, 0.91]} />
      <Wheel position={[-1.62, -0.37, -0.91]} />
      <Wheel position={[1.56, -0.37, 0.91]} />
      <Wheel position={[1.56, -0.37, -0.91]} />
    </group>
  );
}

export default function ThreeDVehicleScene({ reduceMotion }: VehicleSceneProps) {
  return (
    <SceneErrorBoundary>
      <Canvas
        camera={{ fov: 34, position: [5.6, 2.65, 7.4] }}
        dpr={[1, 1.5]}
        frameloop={reduceMotion ? "demand" : "always"}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        shadows
      >
        <ambientLight intensity={0.42} />
        <spotLight
          angle={0.42}
          castShadow
          intensity={22}
          penumbra={0.86}
          position={[2.4, 6.4, 5.2]}
        />
        <directionalLight color="#ffcf8a" intensity={1.1} position={[-4, 2, -3]} />
        <InterimVehicle reduceMotion={reduceMotion} />
        <ContactShadows
          blur={2.8}
          far={4.2}
          opacity={0.72}
          position={[0, -0.8, 0]}
          resolution={512}
          scale={9}
        />
      </Canvas>
    </SceneErrorBoundary>
  );
}
