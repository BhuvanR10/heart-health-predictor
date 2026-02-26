export interface PatientData {
  age: number;
  gender: "male" | "female";
  systolicBP: number;
  diastolicBP: number;
  cholesterol: number;
  hdl: number;
  ldl: number;
  bloodSugar: number;
  bmi: number;
  smoking: boolean;
  familyHistory: boolean;
  exercise: "none" | "light" | "moderate" | "heavy";
  ecgFile?: File | null;
}

export interface ECGAnalysis {
  heartRate: number;
  rhythm: "Normal Sinus" | "Sinus Tachycardia" | "Sinus Bradycardia" | "Atrial Fibrillation" | "Atrial Flutter";
  prInterval: number; // ms
  qrsDuration: number; // ms
  qtInterval: number; // ms
  stSegment: "Normal" | "Elevated" | "Depressed";
  tWave: "Normal" | "Inverted" | "Peaked";
  findings: string[];
  riskContribution: number; // 0-30 additional risk points
}

export interface ModelPrediction {
  modelName: string;
  modelType: string;
  riskScore: number; // 0-100
  confidence: number; // 0-100
  riskLevel: "low" | "moderate" | "high" | "critical";
}

export interface PredictionResult {
  predictions: ModelPrediction[];
  ensembleScore: number;
  ensembleRiskLevel: "low" | "moderate" | "high" | "critical";
  topRiskFactors: string[];
  ecgAnalysis?: ECGAnalysis;
}

function getRiskLevel(score: number): "low" | "moderate" | "high" | "critical" {
  if (score < 25) return "low";
  if (score < 50) return "moderate";
  if (score < 75) return "high";
  return "critical";
}

// Simulated prediction models
function simulateLogisticRegression(data: PatientData): ModelPrediction {
  let score = 0;
  score += Math.max(0, (data.age - 30) * 0.8);
  score += data.gender === "male" ? 5 : 0;
  score += Math.max(0, (data.systolicBP - 120) * 0.3);
  score += Math.max(0, (data.cholesterol - 200) * 0.08);
  score += Math.max(0, (data.bmi - 25) * 1.5);
  score += data.smoking ? 12 : 0;
  score += data.familyHistory ? 8 : 0;
  score += data.exercise === "none" ? 6 : data.exercise === "light" ? 3 : 0;
  score += Math.max(0, (data.bloodSugar - 100) * 0.15);
  score = Math.min(100, Math.max(0, score + (Math.random() * 6 - 3)));
  return { modelName: "Logistic Regression", modelType: "Linear", riskScore: Math.round(score), confidence: 78 + Math.round(Math.random() * 10), riskLevel: getRiskLevel(score) };
}

function simulateRandomForest(data: PatientData): ModelPrediction {
  let score = 0;
  score += Math.max(0, (data.age - 35) * 0.7);
  score += data.gender === "male" ? 4 : 0;
  score += Math.max(0, (data.systolicBP - 120) * 0.35);
  score += Math.max(0, (data.cholesterol - 190) * 0.09);
  score += Math.max(0, (data.ldl - 100) * 0.12);
  score += Math.max(0, (data.bmi - 24) * 1.8);
  score += data.smoking ? 15 : 0;
  score += data.familyHistory ? 10 : 0;
  score += data.exercise === "none" ? 7 : data.exercise === "light" ? 2 : -3;
  score = Math.min(100, Math.max(0, score + (Math.random() * 8 - 4)));
  return { modelName: "Random Forest", modelType: "Ensemble", riskScore: Math.round(score), confidence: 82 + Math.round(Math.random() * 8), riskLevel: getRiskLevel(score) };
}

function simulateNeuralNetwork(data: PatientData): ModelPrediction {
  let score = 0;
  score += Math.max(0, (data.age - 28) * 0.9);
  score += data.gender === "male" ? 6 : 0;
  score += Math.max(0, (data.systolicBP - 115) * 0.28);
  score += Math.max(0, (data.diastolicBP - 75) * 0.25);
  score += Math.max(0, (data.cholesterol - 180) * 0.07);
  score += Math.max(0, 50 - data.hdl) * 0.2;
  score += Math.max(0, (data.bmi - 23) * 1.4);
  score += data.smoking ? 14 : 0;
  score += data.familyHistory ? 9 : 0;
  score += data.bloodSugar > 126 ? 8 : data.bloodSugar > 100 ? 4 : 0;
  score = Math.min(100, Math.max(0, score + (Math.random() * 5 - 2.5)));
  return { modelName: "Neural Network", modelType: "Deep Learning", riskScore: Math.round(score), confidence: 85 + Math.round(Math.random() * 7), riskLevel: getRiskLevel(score) };
}

function simulateSVM(data: PatientData): ModelPrediction {
  let score = 0;
  score += Math.max(0, (data.age - 32) * 0.75);
  score += data.gender === "male" ? 5 : 0;
  score += Math.max(0, (data.systolicBP - 118) * 0.32);
  score += Math.max(0, (data.cholesterol - 195) * 0.085);
  score += Math.max(0, (data.bmi - 25) * 1.6);
  score += data.smoking ? 13 : 0;
  score += data.familyHistory ? 9 : 0;
  score += data.exercise === "none" ? 5 : data.exercise === "heavy" ? -2 : 0;
  score = Math.min(100, Math.max(0, score + (Math.random() * 7 - 3.5)));
  return { modelName: "SVM", modelType: "Kernel", riskScore: Math.round(score), confidence: 76 + Math.round(Math.random() * 12), riskLevel: getRiskLevel(score) };
}

function getTopRiskFactors(data: PatientData): string[] {
  const factors: { name: string; weight: number }[] = [];
  if (data.age > 45) factors.push({ name: "Age > 45", weight: data.age - 45 });
  if (data.systolicBP > 130) factors.push({ name: "High Blood Pressure", weight: (data.systolicBP - 130) * 0.5 });
  if (data.cholesterol > 240) factors.push({ name: "High Cholesterol", weight: (data.cholesterol - 240) * 0.3 });
  if (data.ldl > 130) factors.push({ name: "High LDL", weight: (data.ldl - 130) * 0.3 });
  if (data.hdl < 40) factors.push({ name: "Low HDL", weight: (40 - data.hdl) * 0.4 });
  if (data.bmi > 30) factors.push({ name: "Obesity (BMI > 30)", weight: (data.bmi - 30) * 1.2 });
  else if (data.bmi > 25) factors.push({ name: "Overweight", weight: (data.bmi - 25) * 0.8 });
  if (data.smoking) factors.push({ name: "Smoking", weight: 15 });
  if (data.familyHistory) factors.push({ name: "Family History", weight: 10 });
  if (data.bloodSugar > 126) factors.push({ name: "High Blood Sugar", weight: 12 });
  if (data.exercise === "none") factors.push({ name: "Sedentary Lifestyle", weight: 7 });
  factors.sort((a, b) => b.weight - a.weight);
  return factors.slice(0, 4).map(f => f.name);
}

function simulateECGAnalysis(): ECGAnalysis {
  const rhythms: ECGAnalysis["rhythm"][] = ["Normal Sinus", "Sinus Tachycardia", "Sinus Bradycardia", "Atrial Fibrillation", "Atrial Flutter"];
  const rhythmWeights = [0.45, 0.2, 0.1, 0.15, 0.1];
  let rand = Math.random();
  let rhythmIdx = 0;
  for (let i = 0; i < rhythmWeights.length; i++) {
    rand -= rhythmWeights[i];
    if (rand <= 0) { rhythmIdx = i; break; }
  }
  const rhythm = rhythms[rhythmIdx];

  const heartRate = rhythm === "Sinus Tachycardia" ? 100 + Math.round(Math.random() * 30)
    : rhythm === "Sinus Bradycardia" ? 45 + Math.round(Math.random() * 15)
    : rhythm === "Atrial Fibrillation" ? 80 + Math.round(Math.random() * 70)
    : 60 + Math.round(Math.random() * 30);

  const prInterval = rhythm === "Atrial Fibrillation" ? 0 : 120 + Math.round(Math.random() * 80);
  const qrsDuration = 80 + Math.round(Math.random() * 50);
  const qtInterval = 350 + Math.round(Math.random() * 100);

  const stOptions: ECGAnalysis["stSegment"][] = ["Normal", "Elevated", "Depressed"];
  const stSegment = stOptions[Math.floor(Math.random() * (rhythm === "Normal Sinus" ? 1.5 : 3))];
  const tOptions: ECGAnalysis["tWave"][] = ["Normal", "Inverted", "Peaked"];
  const tWave = tOptions[Math.floor(Math.random() * (rhythm === "Normal Sinus" ? 1.5 : 3))];

  const findings: string[] = [];
  let riskContribution = 0;

  if (rhythm !== "Normal Sinus") {
    findings.push(`${rhythm} detected`);
    riskContribution += rhythm === "Atrial Fibrillation" ? 15 : rhythm === "Atrial Flutter" ? 12 : 5;
  }
  if (heartRate > 100) { findings.push("Tachycardia"); riskContribution += 4; }
  if (heartRate < 50) { findings.push("Bradycardia"); riskContribution += 3; }
  if (prInterval > 200) { findings.push("Prolonged PR interval (possible 1st degree AV block)"); riskContribution += 5; }
  if (qrsDuration > 120) { findings.push("Wide QRS complex"); riskContribution += 6; }
  if (qtInterval > 440) { findings.push("Prolonged QT interval"); riskContribution += 5; }
  if (stSegment === "Elevated") { findings.push("ST elevation (possible ischemia)"); riskContribution += 10; }
  if (stSegment === "Depressed") { findings.push("ST depression"); riskContribution += 7; }
  if (tWave === "Inverted") { findings.push("T-wave inversion"); riskContribution += 5; }
  if (tWave === "Peaked") { findings.push("Peaked T-waves"); riskContribution += 4; }
  if (findings.length === 0) findings.push("No significant abnormalities");

  return { heartRate, rhythm, prInterval, qrsDuration, qtInterval, stSegment, tWave, findings, riskContribution: Math.min(30, riskContribution) };
}

export function predictRisk(data: PatientData): PredictionResult {
  const ecgAnalysis = data.ecgFile ? simulateECGAnalysis() : undefined;
  const ecgBoost = ecgAnalysis?.riskContribution ?? 0;

  const predictions = [
    simulateLogisticRegression(data),
    simulateRandomForest(data),
    simulateNeuralNetwork(data),
    simulateSVM(data),
  ];

  // Add ECG contribution to each model
  if (ecgBoost > 0) {
    predictions.forEach(p => {
      p.riskScore = Math.min(100, p.riskScore + Math.round(ecgBoost * (0.7 + Math.random() * 0.6)));
      p.riskLevel = getRiskLevel(p.riskScore);
    });
  }

  const ensembleScore = Math.round(
    predictions.reduce((sum, p) => sum + p.riskScore * p.confidence, 0) /
    predictions.reduce((sum, p) => sum + p.confidence, 0)
  );

  const topRiskFactors = getTopRiskFactors(data);
  if (ecgAnalysis && ecgAnalysis.findings[0] !== "No significant abnormalities") {
    topRiskFactors.unshift("ECG Abnormality");
  }

  return {
    predictions,
    ensembleScore,
    ensembleRiskLevel: getRiskLevel(ensembleScore),
    topRiskFactors: topRiskFactors.slice(0, 5),
    ecgAnalysis,
  };
}
