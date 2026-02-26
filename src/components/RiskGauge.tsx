interface RiskGaugeProps {
  score: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  size?: "sm" | "lg";
}

const riskColors = {
  low: "text-risk-low",
  moderate: "text-risk-moderate",
  high: "text-risk-high",
  critical: "text-risk-critical",
};

const riskLabels = {
  low: "Low Risk",
  moderate: "Moderate Risk",
  high: "High Risk",
  critical: "Critical Risk",
};

export default function RiskGauge({ score, riskLevel, size = "lg" }: RiskGaugeProps) {
  const isLarge = size === "lg";
  const radius = isLarge ? 80 : 36;
  const stroke = isLarge ? 10 : 5;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const filled = (score / 100) * arcLength;
  const svgSize = (radius + stroke) * 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-[135deg]">
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke={`hsl(var(--risk-${riskLevel}))`}
            strokeWidth={stroke}
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display font-bold ${riskColors[riskLevel]} ${isLarge ? "text-4xl" : "text-lg"}`}>
            {score}
          </span>
          {isLarge && <span className="text-xs text-muted-foreground mt-1">/ 100</span>}
        </div>
      </div>
      {isLarge && (
        <span className={`font-display font-semibold text-sm ${riskColors[riskLevel]}`}>
          {riskLabels[riskLevel]}
        </span>
      )}
    </div>
  );
}
