import { useState } from "react";
import { PatientData, PredictionResult, predictRisk } from "@/lib/prediction";
import { savePrediction } from "@/lib/savePrediction";
import PatientForm from "@/components/PatientForm";
import PredictionResults from "@/components/PredictionResults";
import PredictionHistory from "@/components/PredictionHistory";
import { Activity, Heart, Cpu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPatientData, setLastPatientData] = useState<PatientData | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const { toast } = useToast();

  const handleSubmit = (data: PatientData) => {
    setLastPatientData(data);
    setIsLoading(true);
    setResult(null);
    // Simulate processing delay
    setTimeout(async () => {
      const prediction = predictRisk(data);
      setResult(prediction);
      setIsLoading(false);
      try {
        await savePrediction(data, prediction);
        setHistoryRefreshKey((k) => k + 1);
        toast({ title: "Prediction saved", description: "Results stored in database." });
      } catch {
        toast({ title: "Save failed", description: "Could not store results.", variant: "destructive" });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground tracking-tight">CardioPredict</h1>
            <p className="text-xs text-muted-foreground">Multi-Model CVD Risk Assessment</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <Cpu className="w-3.5 h-3.5" />
            <span>4 Models Active</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Early Cardiovascular Disease Risk Prediction
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Leveraging ensemble machine learning — Logistic Regression, Random Forest, Neural Network &amp; SVM — to deliver comprehensive cardiac risk assessments.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Activity, label: "Models", value: "4" },
            { icon: Heart, label: "Parameters", value: "12" },
            { icon: Cpu, label: "Method", value: "Ensemble" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card-elevated p-4 flex items-center gap-3">
              <Icon className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-display font-semibold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Two-column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />
          
          <div>
            {isLoading && (
              <div className="card-elevated p-12 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground font-display">Running prediction models...</p>
              </div>
            )}
            {result && !isLoading && lastPatientData && <PredictionResults result={result} patientData={lastPatientData} />}
            {!result && !isLoading && (
              <div className="card-elevated p-12 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
                  <Activity className="w-8 h-8 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">Ready to Analyze</p>
                  <p className="text-sm text-muted-foreground mt-1">Enter patient data and run prediction models to see results</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prediction History */}
        <div className="mt-8">
          <PredictionHistory refreshKey={historyRefreshKey} />
        </div>
      </main>
    </div>
  );
};

export default Index;
