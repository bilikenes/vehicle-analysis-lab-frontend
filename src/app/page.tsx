import { HeroVehicleScanner } from "@/components/home/hero-vehicle-scanner";
import { HumanInLoopDemo } from "@/components/home/human-in-loop-demo";
import { ModelVisionComparison } from "@/components/home/model-vision-comparison";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-primary-text">
      <HeroVehicleScanner />
      <ModelVisionComparison />
      <HumanInLoopDemo />
    </main>
  );
}
