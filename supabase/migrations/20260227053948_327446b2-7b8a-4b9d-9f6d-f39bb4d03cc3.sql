-- Create predictions table to store patient data and results
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_age INTEGER NOT NULL,
  patient_gender TEXT NOT NULL,
  systolic_bp INTEGER NOT NULL,
  diastolic_bp INTEGER NOT NULL,
  cholesterol INTEGER NOT NULL,
  hdl INTEGER NOT NULL,
  ldl INTEGER NOT NULL,
  blood_sugar INTEGER NOT NULL,
  bmi NUMERIC(5,1) NOT NULL,
  smoking BOOLEAN NOT NULL DEFAULT false,
  family_history BOOLEAN NOT NULL DEFAULT false,
  exercise TEXT NOT NULL DEFAULT 'none',
  has_ecg BOOLEAN NOT NULL DEFAULT false,
  ensemble_score NUMERIC(5,1) NOT NULL,
  ensemble_risk_level TEXT NOT NULL,
  top_risk_factors TEXT[] NOT NULL DEFAULT '{}',
  model_results JSONB NOT NULL DEFAULT '[]',
  ecg_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public access as per user choice)
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read predictions
CREATE POLICY "Anyone can read predictions" ON public.predictions FOR SELECT USING (true);

-- Allow anyone to insert predictions
CREATE POLICY "Anyone can insert predictions" ON public.predictions FOR INSERT WITH CHECK (true);