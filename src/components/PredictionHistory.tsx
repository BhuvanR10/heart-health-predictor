import { useEffect, useMemo, useState } from "react";
import { fetchPredictions, SavedPrediction } from "@/lib/savePrediction";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, RefreshCw, ChevronDown, ChevronUp, Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";

const riskColors: Record<string, string> = {
  low: "bg-green-500/15 text-green-700 border-green-500/30",
  moderate: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
  high: "bg-orange-500/15 text-orange-700 border-orange-500/30",
  critical: "bg-red-500/15 text-red-700 border-red-500/30",
};

export default function PredictionHistory({ refreshKey }: { refreshKey: number }) {
  const [predictions, setPredictions] = useState<SavedPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter state
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = riskFilter !== "all" || minAge || maxAge || dateFrom || dateTo;

  const clearFilters = () => {
    setRiskFilter("all");
    setMinAge("");
    setMaxAge("");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const filtered = useMemo(() => {
    return predictions.filter((p) => {
      if (riskFilter !== "all" && p.ensemble_risk_level !== riskFilter) return false;
      if (minAge && p.patient_age < Number(minAge)) return false;
      if (maxAge && p.patient_age > Number(maxAge)) return false;
      if (dateFrom && new Date(p.created_at) < startOfDay(dateFrom)) return false;
      if (dateTo && new Date(p.created_at) > endOfDay(dateTo)) return false;
      return true;
    });
  }, [predictions, riskFilter, minAge, maxAge, dateFrom, dateTo]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPredictions();
      setPredictions(data);
    } catch {
      // error logged in fetchPredictions
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  return (
    <div className="card-elevated p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground">Prediction History</h2>
            <p className="text-sm text-muted-foreground">{predictions.length} records saved</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs"
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground">
              <X className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} of {predictions.length} records
          </span>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg bg-accent/30 border border-border">
            {/* Risk Level */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Risk Level</label>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age Range */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Age Range</label>
              <div className="flex gap-1.5">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  className="h-8 text-xs"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Date From */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("h-8 w-full text-xs justify-start font-normal", !dateFrom && "text-muted-foreground")}>
                    {dateFrom ? format(dateFrom, "MMM d, yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("h-8 w-full text-xs justify-start font-normal", !dateTo && "text-muted-foreground")}>
                    {dateTo ? format(dateTo, "MMM d, yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>

      {loading && predictions.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : predictions.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No predictions saved yet. Run a prediction to see results here.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No predictions match your filters.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Age/Gender</TableHead>
                <TableHead className="text-xs">BP</TableHead>
                <TableHead className="text-xs">BMI</TableHead>
                <TableHead className="text-xs">Risk Score</TableHead>
                <TableHead className="text-xs">Level</TableHead>
                <TableHead className="text-xs">ECG</TableHead>
                <TableHead className="text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <>
                  <TableRow key={p.id} className="cursor-pointer" onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                    <TableCell className="text-xs whitespace-nowrap">
                      {format(new Date(p.created_at), "MMM d, HH:mm")}
                    </TableCell>
                    <TableCell className="text-xs">
                      {p.patient_age} / {p.patient_gender === "male" ? "M" : "F"}
                    </TableCell>
                    <TableCell className="text-xs">{p.systolic_bp}/{p.diastolic_bp}</TableCell>
                    <TableCell className="text-xs">{p.bmi}</TableCell>
                    <TableCell className="text-xs font-semibold">{p.ensemble_score}%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs capitalize ${riskColors[p.ensemble_risk_level] ?? ""}`}>
                        {p.ensemble_risk_level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{p.has_ecg ? "✓" : "—"}</TableCell>
                    <TableCell>
                      {expandedId === p.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </TableCell>
                  </TableRow>
                  {expandedId === p.id && (
                    <TableRow key={`${p.id}-detail`}>
                      <TableCell colSpan={8} className="bg-accent/30 p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                          <div><span className="text-muted-foreground">Cholesterol:</span> <strong>{p.cholesterol}</strong></div>
                          <div><span className="text-muted-foreground">HDL:</span> <strong>{p.hdl}</strong></div>
                          <div><span className="text-muted-foreground">LDL:</span> <strong>{p.ldl}</strong></div>
                          <div><span className="text-muted-foreground">Blood Sugar:</span> <strong>{p.blood_sugar}</strong></div>
                          <div><span className="text-muted-foreground">Smoking:</span> <strong>{p.smoking ? "Yes" : "No"}</strong></div>
                          <div><span className="text-muted-foreground">Family Hx:</span> <strong>{p.family_history ? "Yes" : "No"}</strong></div>
                          <div><span className="text-muted-foreground">Exercise:</span> <strong className="capitalize">{p.exercise}</strong></div>
                        </div>
                        {p.top_risk_factors.length > 0 && (
                          <div className="mb-3">
                            <span className="text-xs text-muted-foreground">Risk Factors: </span>
                            {p.top_risk_factors.map((f) => (
                              <Badge key={f} variant="outline" className="text-xs mr-1 bg-destructive/10 text-destructive border-destructive/20">{f}</Badge>
                            ))}
                          </div>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {(p.model_results as any[]).map((m) => (
                            <div key={m.modelName} className="p-2 rounded-lg bg-background border border-border">
                              <p className="text-xs text-muted-foreground">{m.modelName}</p>
                              <p className="text-sm font-semibold">{m.riskScore}%</p>
                              <Badge variant="outline" className={`text-[10px] capitalize ${riskColors[m.riskLevel] ?? ""}`}>{m.riskLevel}</Badge>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
