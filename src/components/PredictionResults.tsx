import { PredictionResult } from "@/lib/prediction";
import RiskGauge from "./RiskGauge";
import ModelResultCard from "./ModelResultCard";
import ECGAnalysisCard from "./ECGAnalysisCard";
import { AlertTriangle, BarChart3, Shield } from "lucide-react";

export default function PredictionResults({ result }: { result: PredictionResult }) {
  return (
    <div className="space-y-6">
      {/* Ensemble Score */}
      <div className="card-elevated p-6 animate-fade-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground">Ensemble Prediction</h2>
            <p className="text-sm text-muted-foreground">Weighted average of all models</p>
          </div>
        </div>
        <div className="flex justify-center">
          <RiskGauge score={result.ensembleScore} riskLevel={result.ensembleRiskLevel} />
        </div>
      </div>

      {/* Risk Factors */}
      {result.topRiskFactors.length > 0 && (
        <div className="card-elevated p-5 animate-fade-up stagger-1">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-risk-high" />
            <h3 className="font-display font-semibold text-sm text-foreground">Top Risk Factors</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.topRiskFactors.map(factor => (
              <span
                key={factor}
                className="text-xs px-3 py-1.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 font-medium"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ECG Analysis */}
      {result.ecgAnalysis && (
        <ECGAnalysisCard analysis={result.ecgAnalysis} />
      )}
      {/* Individual Models */}
      <div className="animate-fade-up stagger-2">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-sm text-foreground">Model Breakdown</h3>
        </div>
        <div className="space-y-3">
          {result.predictions.map((p, i) => (
            <div key={p.modelName} className={`animate-fade-up stagger-${i + 1}`}>
              <ModelResultCard prediction={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
