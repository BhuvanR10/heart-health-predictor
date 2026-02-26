import { useState, useRef } from "react";
import { PatientData } from "@/lib/prediction";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Heart, Activity, FileUp, X } from "lucide-react";

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading: boolean;
}

const defaultData: PatientData = {
  age: 52,
  gender: "male",
  systolicBP: 138,
  diastolicBP: 88,
  cholesterol: 245,
  hdl: 42,
  ldl: 155,
  bloodSugar: 110,
  bmi: 28.5,
  smoking: false,
  familyHistory: true,
  exercise: "light",
};

export default function PatientForm({ onSubmit, isLoading }: PatientFormProps) {
  const [data, setData] = useState<PatientData>(defaultData);
  const [ecgFile, setEcgFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof PatientData>(key: K, value: PatientData[K]) =>
    setData(prev => ({ ...prev, [key]: value }));

  return (
    <div className="card-elevated p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Heart className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground">Patient Data</h2>
          <p className="text-sm text-muted-foreground">Enter clinical parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Age</Label>
          <Input type="number" value={data.age} onChange={e => update("age", +e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Gender</Label>
          <Select value={data.gender} onValueChange={v => update("gender", v as "male" | "female")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Systolic BP (mmHg)</Label>
          <Input type="number" value={data.systolicBP} onChange={e => update("systolicBP", +e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Diastolic BP (mmHg)</Label>
          <Input type="number" value={data.diastolicBP} onChange={e => update("diastolicBP", +e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Total Cholesterol</Label>
          <Input type="number" value={data.cholesterol} onChange={e => update("cholesterol", +e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">HDL</Label>
          <Input type="number" value={data.hdl} onChange={e => update("hdl", +e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">LDL</Label>
          <Input type="number" value={data.ldl} onChange={e => update("ldl", +e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Blood Sugar (mg/dL)</Label>
          <Input type="number" value={data.bloodSugar} onChange={e => update("bloodSugar", +e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">BMI</Label>
          <Input type="number" step="0.1" value={data.bmi} onChange={e => update("bmi", +e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Exercise Level</Label>
        <Select value={data.exercise} onValueChange={v => update("exercise", v as PatientData["exercise"])}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="heavy">Heavy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-sm text-foreground">Smoking</Label>
        <Switch checked={data.smoking} onCheckedChange={v => update("smoking", v)} />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm text-foreground">Family History of CVD</Label>
        <Switch checked={data.familyHistory} onCheckedChange={v => update("familyHistory", v)} />
      </div>

      {/* ECG Upload */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">ECG File (optional)</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt,.pdf,.edf,.dat,.ecg,.xml,.png,.jpg,.jpeg"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0] ?? null;
            setEcgFile(file);
          }}
        />
        {!ecgFile ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-accent/30 transition-colors cursor-pointer"
          >
            <FileUp className="w-6 h-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Upload ECG file</span>
            <span className="text-xs text-muted-foreground/70">CSV, PDF, EDF, XML, or image</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <FileUp className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{ecgFile.name}</p>
              <p className="text-xs text-muted-foreground">{(ecgFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              type="button"
              onClick={() => { setEcgFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <Button
        className="w-full gap-2 font-display font-semibold"
        size="lg"
        onClick={() => onSubmit({ ...data, ecgFile })}
        disabled={isLoading}
      >
        <Activity className="w-4 h-4" />
        {isLoading ? "Analyzing..." : "Run Prediction Models"}
      </Button>
    </div>
  );
}
