import { ECGAnalysis } from "@/lib/prediction";
import { Activity, Heart, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const rhythmBadge: Record<string, string> = {
  "Normal Sinus": "bg-risk-low/15 text-risk-low border-risk-low/30",
  "Sinus Tachycardia": "bg-risk-moderate/15 text-risk-moderate border-risk-moderate/30",
  "Sinus Bradycardia": "bg-risk-moderate/15 text-risk-moderate border-risk-moderate/30",
  "Atrial Fibrillation": "bg-risk-high/15 text-risk-high border-risk-high/30",
  "Atrial Flutter": "bg-risk-high/15 text-risk-high border-risk-high/30",
};

export default function ECGAnalysisCard({ analysis }: { analysis: ECGAnalysis }) {
  const isNormal = analysis.findings[0] === "No significant abnormalities";

  return (
    <div className="card-elevated p-6 space-y-5 animate-fade-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground">ECG Analysis</h2>
          <p className="text-sm text-muted-foreground">Automated signal interpretation</p>
        </div>
        <Badge variant="outline" className={`ml-auto ${rhythmBadge[analysis.rhythm] ?? ""}`}>
          {analysis.rhythm}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Heart, label: "Heart Rate", value: `${analysis.heartRate} bpm` },
          { icon: Activity, label: "QRS Duration", value: `${analysis.qrsDuration} ms` },
          { icon: Zap, label: "QT Interval", value: `${analysis.qtInterval} ms` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-accent/30 rounded-lg p-3 text-center">
            <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-display font-semibold text-sm text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Intervals */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex justify-between text-sm p-2 rounded-md bg-muted/30">
          <span className="text-muted-foreground">PR Interval</span>
          <span className="font-medium text-foreground">{analysis.prInterval === 0 ? "N/A" : `${analysis.prInterval} ms`}</span>
        </div>
        <div className="flex justify-between text-sm p-2 rounded-md bg-muted/30">
          <span className="text-muted-foreground">ST Segment</span>
          <span className={`font-medium ${analysis.stSegment !== "Normal" ? "text-risk-high" : "text-foreground"}`}>{analysis.stSegment}</span>
        </div>
        <div className="flex justify-between text-sm p-2 rounded-md bg-muted/30">
          <span className="text-muted-foreground">T-Wave</span>
          <span className={`font-medium ${analysis.tWave !== "Normal" ? "text-risk-high" : "text-foreground"}`}>{analysis.tWave}</span>
        </div>
        <div className="flex justify-between text-sm p-2 rounded-md bg-muted/30">
          <span className="text-muted-foreground">Risk Impact</span>
          <span className={`font-medium ${analysis.riskContribution > 10 ? "text-risk-high" : analysis.riskContribution > 0 ? "text-risk-moderate" : "text-risk-low"}`}>
            +{analysis.riskContribution} pts
          </span>
        </div>
      </div>

      {/* Findings */}
      <div>
        <h4 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-2">Findings</h4>
        <div className="space-y-1.5">
          {analysis.findings.map((finding, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              {isNormal ? (
                <CheckCircle2 className="w-4 h-4 text-risk-low shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-risk-high shrink-0 mt-0.5" />
              )}
              <span className="text-foreground">{finding}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
