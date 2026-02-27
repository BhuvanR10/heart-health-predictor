import { supabase } from "@/integrations/supabase/client";
import { PatientData, PredictionResult } from "./prediction";

export async function savePrediction(
  patientData: PatientData,
  result: PredictionResult
) {
  const { error } = await supabase.from("predictions" as any).insert({
    patient_age: patientData.age,
    patient_gender: patientData.gender,
    systolic_bp: patientData.systolicBP,
    diastolic_bp: patientData.diastolicBP,
    cholesterol: patientData.cholesterol,
    hdl: patientData.hdl,
    ldl: patientData.ldl,
    blood_sugar: patientData.bloodSugar,
    bmi: patientData.bmi,
    smoking: patientData.smoking,
    family_history: patientData.familyHistory,
    exercise: patientData.exercise,
    has_ecg: !!patientData.ecgFile,
    ensemble_score: result.ensembleScore,
    ensemble_risk_level: result.ensembleRiskLevel,
    top_risk_factors: result.topRiskFactors,
    model_results: result.predictions.map((p) => ({
      modelName: p.modelName,
      riskScore: p.riskScore,
      confidence: p.confidence,
      riskLevel: p.riskLevel,
    })),
    ecg_analysis: result.ecgAnalysis ?? null,
  } as any);

  if (error) {
    console.error("Failed to save prediction:", error);
    throw error;
  }
}

export interface SavedPrediction {
  id: string;
  patient_age: number;
  patient_gender: string;
  systolic_bp: number;
  diastolic_bp: number;
  cholesterol: number;
  hdl: number;
  ldl: number;
  blood_sugar: number;
  bmi: number;
  smoking: boolean;
  family_history: boolean;
  exercise: string;
  has_ecg: boolean;
  ensemble_score: number;
  ensemble_risk_level: string;
  top_risk_factors: string[];
  model_results: {
    modelName: string;
    riskScore: number;
    confidence: number;
    riskLevel: string;
  }[];
  ecg_analysis: any;
  created_at: string;
}

export async function fetchPredictions(): Promise<SavedPrediction[]> {
  const { data, error } = await supabase
    .from("predictions" as any)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to fetch predictions:", error);
    throw error;
  }

  return (data ?? []) as unknown as SavedPrediction[];
}
