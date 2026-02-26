import { useState } from "react";
import { PatientData } from "@/lib/prediction";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Heart, Activity } from "lucide-react";

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

      <Button
        className="w-full gap-2 font-display font-semibold"
        size="lg"
        onClick={() => onSubmit(data)}
        disabled={isLoading}
      >
        <Activity className="w-4 h-4" />
        {isLoading ? "Analyzing..." : "Run Prediction Models"}
      </Button>
    </div>
  );
}
