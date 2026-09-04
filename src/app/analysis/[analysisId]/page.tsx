import { AnalysisPageClient } from "@/components/analysis/analysis-page-client";
import { getAnalysisFixture } from "@/features/analysis/analysis-fixture";

type AnalysisPageProps = {
  params: Promise<{ analysisId: string }>;
};

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { analysisId } = await params;

  return (
    <AnalysisPageClient
      initiallyFailed={analysisId === "demo-failure"}
      initialAnalysis={getAnalysisFixture(analysisId)}
    />
  );
}
