import { ModelPrediction } from "@/lib/prediction";
import RiskGauge from "./RiskGauge";
import { Badge } from "@/components/ui/badge";

const riskBarGradients = {
  low: "var(--gradient-risk-low)",
  moderate: "var(--gradient-risk-moderate)",
  high: "var(--gradient-risk-high)",
  critical: "var(--gradient-risk-critical)",
};

const riskBadgeClass = {
  low: "bg-risk-low/15 text-risk-low border-risk-low/30",
  moderate: "bg-risk-moderate/15 text-risk-moderate border-risk-moderate/30",
  high: "bg-risk-high/15 text-risk-high border-risk-high/30",
  critical: "bg-risk-critical/15 text-risk-critical border-risk-critical/30",
};

export default function ModelResultCard({ prediction }: { prediction: ModelPrediction }) {
  return (
    <div className="card-elevated p-5 flex items-center gap-5 transition-shadow duration-300">
      <RiskGauge score={prediction.riskScore} riskLevel={prediction.riskLevel} size="sm" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-sm text-foreground">{prediction.modelName}</h3>
          <Badge variant="outline" className={`text-xs ${riskBadgeClass[prediction.riskLevel]}`}>
            {prediction.riskLevel}
          </Badge>
        </div>
        <div className="w-full bg-secondary rounded-full h-1.5">
          <div
            className="risk-bar h-1.5"
            style={{
              width: `${prediction.riskScore}%`,
              background: riskBarGradients[prediction.riskLevel],
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{prediction.modelType}</span>
          <span>Confidence: {prediction.confidence}%</span>
        </div>
      </div>
    </div>
  );
}
