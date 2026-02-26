import jsPDF from "jspdf";
import { PredictionResult, PatientData } from "./prediction";

const COLORS = {
  primary: [13, 148, 136] as [number, number, number],      // teal
  dark: [15, 23, 42] as [number, number, number],            // slate-900
  muted: [100, 116, 139] as [number, number, number],        // slate-500
  light: [241, 245, 249] as [number, number, number],        // slate-100
  white: [255, 255, 255] as [number, number, number],
  low: [34, 197, 94] as [number, number, number],
  moderate: [234, 179, 8] as [number, number, number],
  high: [239, 68, 68] as [number, number, number],
  critical: [190, 18, 60] as [number, number, number],
};

const riskColor = (level: string) => {
  if (level === "low") return COLORS.low;
  if (level === "moderate") return COLORS.moderate;
  if (level === "high") return COLORS.high;
  return COLORS.critical;
};

function drawHeader(doc: jsPDF) {
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, 210, 36, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("CardioPredict", 14, 16);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Multi-Model CVD Risk Assessment Report", 14, 24);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
}

function drawSectionTitle(doc: jsPDF, y: number, title: string): number {
  doc.setFillColor(...COLORS.primary);
  doc.rect(14, y, 3, 7, "F");
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, y + 6);
  return y + 14;
}

function drawKeyValue(doc: jsPDF, x: number, y: number, key: string, value: string, w = 44) {
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(x, y, w, 14, 2, 2, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  doc.text(key, x + 4, y + 5);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.dark);
  doc.text(value, x + 4, y + 12);
}

function checkPage(doc: jsPDF, y: number, needed = 30): number {
  if (y + needed > 280) {
    doc.addPage();
    return 20;
  }
  return y;
}

export function generatePDFReport(result: PredictionResult, patientData: PatientData) {
  const doc = new jsPDF();

  // Header
  drawHeader(doc);
  let y = 46;

  // Patient Information
  y = drawSectionTitle(doc, y, "Patient Information");
  const patientFields: [string, string][] = [
    ["Age", `${patientData.age}`],
    ["Gender", patientData.gender === "male" ? "Male" : "Female"],
    ["Systolic BP", `${patientData.systolicBP} mmHg`],
    ["Diastolic BP", `${patientData.diastolicBP} mmHg`],
    ["Total Cholesterol", `${patientData.cholesterol} mg/dL`],
    ["HDL", `${patientData.hdl} mg/dL`],
    ["LDL", `${patientData.ldl} mg/dL`],
    ["Blood Sugar", `${patientData.bloodSugar} mg/dL`],
    ["BMI", `${patientData.bmi}`],
    ["Smoking", patientData.smoking ? "Yes" : "No"],
    ["Family History", patientData.familyHistory ? "Yes" : "No"],
    ["Exercise", patientData.exercise.charAt(0).toUpperCase() + patientData.exercise.slice(1)],
  ];

  const cols = 4;
  const cellW = 44;
  const gap = 2;
  patientFields.forEach((field, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    drawKeyValue(doc, 14 + col * (cellW + gap), y + row * 18, field[0], field[1], cellW);
  });
  y += Math.ceil(patientFields.length / cols) * 18 + 8;

  // Ensemble Score
  y = checkPage(doc, y, 40);
  y = drawSectionTitle(doc, y, "Ensemble Prediction");

  const ensColor = riskColor(result.ensembleRiskLevel);
  doc.setFillColor(...ensColor);
  doc.roundedRect(14, y, 182, 22, 3, 3, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`${result.ensembleScore}`, 24, y + 15);
  doc.setFontSize(10);
  doc.text(`/ 100  —  ${result.ensembleRiskLevel.toUpperCase()} RISK`, 50, y + 15);
  y += 30;

  // Risk Factors
  if (result.topRiskFactors.length > 0) {
    y = checkPage(doc, y, 20);
    y = drawSectionTitle(doc, y, "Top Risk Factors");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.dark);
    result.topRiskFactors.forEach((factor, i) => {
      doc.setFillColor(...COLORS.high);
      doc.circle(18, y + 3, 1.5, "F");
      doc.text(factor, 24, y + 5);
      y += 7;
    });
    y += 4;
  }

  // Model Breakdown
  y = checkPage(doc, y, 60);
  y = drawSectionTitle(doc, y, "Model Breakdown");

  result.predictions.forEach((pred) => {
    y = checkPage(doc, y, 22);
    const pColor = riskColor(pred.riskLevel);

    // Model box
    doc.setFillColor(...COLORS.light);
    doc.roundedRect(14, y, 182, 18, 2, 2, "F");

    // Risk bar background
    doc.setFillColor(220, 220, 220);
    doc.roundedRect(80, y + 10, 80, 4, 2, 2, "F");
    // Risk bar filled
    doc.setFillColor(...pColor);
    doc.roundedRect(80, y + 10, Math.max(2, pred.riskScore * 0.8), 4, 2, 2, "F");

    // Text
    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(pred.modelName, 18, y + 8);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    doc.text(pred.modelType, 18, y + 14);

    // Score
    doc.setTextColor(...pColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${pred.riskScore}`, 168, y + 10);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    doc.text(`${pred.confidence}% conf`, 168, y + 15);

    y += 22;
  });
  y += 4;

  // ECG Analysis
  if (result.ecgAnalysis) {
    y = checkPage(doc, y, 70);
    y = drawSectionTitle(doc, y, "ECG Analysis");
    const ecg = result.ecgAnalysis;

    const ecgFields: [string, string][] = [
      ["Heart Rate", `${ecg.heartRate} bpm`],
      ["Rhythm", ecg.rhythm],
      ["PR Interval", ecg.prInterval === 0 ? "N/A" : `${ecg.prInterval} ms`],
      ["QRS Duration", `${ecg.qrsDuration} ms`],
      ["QT Interval", `${ecg.qtInterval} ms`],
      ["ST Segment", ecg.stSegment],
      ["T-Wave", ecg.tWave],
      ["Risk Impact", `+${ecg.riskContribution} pts`],
    ];

    ecgFields.forEach((field, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      drawKeyValue(doc, 14 + col * (cellW + gap), y + row * 18, field[0], field[1], cellW);
    });
    y += Math.ceil(ecgFields.length / 4) * 18 + 6;

    // Findings
    y = checkPage(doc, y, 20);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.dark);
    doc.text("Findings:", 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    ecg.findings.forEach((finding) => {
      y = checkPage(doc, y, 8);
      const isNormal = finding === "No significant abnormalities";
      doc.setFillColor(...(isNormal ? COLORS.low : COLORS.high));
      doc.circle(18, y + 1, 1.5, "F");
      doc.setTextColor(...COLORS.dark);
      doc.text(finding, 24, y + 3);
      y += 7;
    });
    y += 4;
  }

  // Disclaimer
  y = checkPage(doc, y, 25);
  doc.setFillColor(255, 250, 240);
  doc.roundedRect(14, y, 182, 18, 2, 2, "F");
  doc.setDrawColor(234, 179, 8);
  doc.roundedRect(14, y, 182, 18, 2, 2, "S");
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  doc.text(
    "DISCLAIMER: This report is generated by a prototype prediction system and is for educational/research purposes only.",
    18,
    y + 7
  );
  doc.text(
    "It should not be used for clinical decision-making. Always consult a qualified healthcare professional.",
    18,
    y + 13
  );

  doc.save("CardioPredict_Report.pdf");
}
