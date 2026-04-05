import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useRole } from "../App";
import Sidebar from "../components/Sidebar";
import { exportToExcel, exportToPDF } from "../utils/exportUtils";
import {
  Target, ChevronRight, ChevronDown, ArrowLeft, Search,
  FileSpreadsheet, FileText, Layers, TrendingUp, BarChart3, ArrowRight
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts";

const PILLAR_COLORS = {
  "People First": "#3B82F6",
  "Rural Empowerment": "#10B981",
  "Prosperity for All": "#F59E0B",
  "Our Legacy - Our Pride": "#8B5CF6",
  "Technology Leading the Way": "#06B6D4",
  "People-Centric Governance": "#EF4444",
};

const parseNumeric = (val) => {
  if (!val || val === "-" || val === "NA") return null;
  const cleaned = val.replace(/[<>,%₹ ]/g, "").replace(/[^\d.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

const calcProgress = (current, target2047) => {
  const c = parseNumeric(current);
  const t = parseNumeric(target2047);
  if (c === null || t === null || t === 0) return null;
  if (t > c) return Math.min(100, Math.round((c / t) * 100));
  if (t < c) return Math.min(100, Math.round(((c - t) / c) * 100));
  return 100;
};

const VisionMetrics = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [summary, setSummary] = useState([]);
  const [allKpis, setAllKpis] = useState([]);
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [sectorDetail, setSectorDetail] = useState(null);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!role) { navigate("/"); return; }
    Promise.all([
      axios.get(`${API}/vision-kpis/summary`),
      axios.get(`${API}/vision-kpis`),
    ]).then(([s, k]) => {
      setSummary(s.data);
      setAllKpis(k.data);
      setLoading(false);
    });
  }, [role, navigate]);

  useEffect(() => {
    if (selectedSector) {
      axios.get(`${API}/vision-kpis/sector/${encodeURIComponent(selectedSector)}`).then((r) => setSectorDetail(r.data));
    } else {
      setSectorDetail(null);
    }
  }, [selectedSector]);

  const filteredKpis = useMemo(() => {
    if (!search) return [];
    const s = search.toLowerCase();
    return allKpis.filter(
      (k) => k.key_outcome.toLowerCase().includes(s) || k.sector.toLowerCase().includes(s) || k.goal.toLowerCase().includes(s)
    ).slice(0, 30);
  }, [search, allKpis]);

  // Data for the overview bar chart (KPIs per pillar)
  const pillarBarData = summary.map((p) => ({
    name: p.pillar.length > 20 ? p.pillar.substring(0, 18) + "…" : p.pillar,
    fullName: p.pillar,
    kpis: p.total_kpis,
    sectors: p.sector_count,
    color: PILLAR_COLORS[p.pillar] || "#64748B",
  }));

  // Sector-level KPI distribution pie chart for selected pillar
  const sectorPieData = selectedPillar
    ? summary.find((p) => p.pillar === selectedPillar)?.sectors.map((s) => ({
        name: s.name.length > 25 ? s.name.substring(0, 23) + "…" : s.name,
        fullName: s.name,
        value: s.kpis,
      })) || []
    : [];
  const PIE_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4", "#EC4899", "#84CC16"];

  const handleExport = () => {
    const data = (selectedSector ? allKpis.filter((k) => k.sector.toLowerCase() === selectedSector.toLowerCase()) : allKpis)
      .map((k) => ({
        Pillar: k.pillar, Sector: k.sector, Goal: k.goal, Theme: k.theme,
        "Strategic Initiative": k.strategic_initiative, "Key Outcome": k.key_outcome,
        Unit: k.unit, Current: k.current, "2026": k.target_2026, "2029": k.target_2029, "2036": k.target_2036, "2047": k.target_2047,
      }));
    exportToExcel(data, selectedSector ? `odisha_${selectedSector}_kpis` : "odisha_vision_kpis", "Vision KPIs");
  };

  if (loading) {
    return (
      <div className="flex"><Sidebar />
        <main className="main-content flex-1 p-6"><div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-[#F26522] border-t-transparent rounded-full animate-spin" /></div></main>
      </div>
    );
  }

  // SECTOR DETAIL VIEW
  if (sectorDetail) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="main-content flex-1" data-testid="vision-sector-detail">
          <header className="header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => { setSelectedSector(null); setSectorDetail(null); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg" data-testid="sector-back-btn">
                  <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{sectorDetail.pillar}</p>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">{sectorDetail.sector}</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{sectorDetail.total_kpis} KPIs across {sectorDetail.goals.length} goals</p>
                </div>
              </div>
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-sm" data-testid="sector-export-btn">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export
              </button>
            </div>
          </header>

          <div className="p-6 space-y-4">
            {sectorDetail.goals.map((goal, gi) => (
              <div key={gi} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedGoal(expandedGoal === gi ? null : gi)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                  data-testid={`goal-toggle-${gi}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${PILLAR_COLORS[sectorDetail.pillar] || "#64748B"}20` }}>
                      <Target className="w-4 h-4" style={{ color: PILLAR_COLORS[sectorDetail.pillar] || "#64748B" }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{goal.goal}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{goal.kpi_count} outcome indicators</p>
                    </div>
                  </div>
                  {expandedGoal === gi ? <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>

                {expandedGoal === gi && (
                  <div className="border-t border-slate-200 dark:border-slate-700">
                    {Object.entries(goal.themes).map(([theme, kpis], ti) => (
                      <div key={ti} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-900/50">
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{theme}</p>
                        </div>
                        <div className="table-responsive">
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th className="w-1/3">Key Outcome</th>
                                <th>Unit</th>
                                <th>Current</th>
                                <th>2026</th>
                                <th>2029</th>
                                <th>2036</th>
                                <th>2047</th>
                                <th>Progress</th>
                              </tr>
                            </thead>
                            <tbody>
                              {kpis.map((k) => {
                                const prog = calcProgress(k.current, k.target_2047);
                                return (
                                  <tr key={k.id}>
                                    <td className="font-medium text-slate-900 dark:text-white text-sm">{k.key_outcome}</td>
                                    <td className="text-xs text-slate-500">{k.unit}</td>
                                    <td className="text-sm font-semibold text-[#1E3A8A] dark:text-blue-400">{k.current || "-"}</td>
                                    <td className="text-sm">{k.target_2026 || "-"}</td>
                                    <td className="text-sm">{k.target_2029 || "-"}</td>
                                    <td className="text-sm">{k.target_2036 || "-"}</td>
                                    <td className="text-sm font-semibold text-[#F26522]">{k.target_2047 || "-"}</td>
                                    <td>
                                      {prog !== null ? (
                                        <div className="flex items-center gap-2">
                                          <Progress value={prog} className="w-16 h-2" />
                                          <span className="text-xs font-medium">{prog}%</span>
                                        </div>
                                      ) : (
                                        <span className="text-xs text-slate-400">-</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // MAIN OVERVIEW VIEW
  return (
    <div className="flex">
      <Sidebar />
      <main className="main-content flex-1" data-testid="vision-metrics-page">
        <header className="header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A8A] to-[#F26522] rounded-xl flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Outfit']">Vision 2047 Metrics</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">236 KPIs across 6 Pillars, 26 Sectors, 96 Goals</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search KPIs..."
                  className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  data-testid="vision-search"
                />
              </div>
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-sm" data-testid="vision-export-btn">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export All
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Search results */}
          {search && filteredKpis.length > 0 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Search Results ({filteredKpis.length})</h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[300px] overflow-y-auto">
                {filteredKpis.map((k) => (
                  <div key={k.id} className="px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer" onClick={() => { setSearch(""); setSelectedPillar(k.pillar); setSelectedSector(k.sector); }}>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{k.key_outcome}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">{k.pillar}</span>
                      <span className="text-xs text-slate-400">→</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{k.sector}</span>
                      <span className="text-xs text-slate-400 ml-auto">Current: {k.current} → 2047: {k.target_2047}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total KPIs", value: "236", icon: Target, color: "#1E3A8A" },
              { label: "Pillars", value: "6", icon: Layers, color: "#F26522" },
              { label: "Sectors", value: "26", icon: BarChart3, color: "#10B981" },
              { label: "Goals", value: "96", icon: TrendingUp, color: "#8B5CF6" },
            ].map((s) => (
              <div key={s.label} className="kpi-card">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{s.label}</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Chart: KPIs per pillar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="chart-container">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-['Outfit'] mb-4">KPIs per Pillar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pillarBarData} onClick={(e) => e?.activePayload && setSelectedPillar(e.activePayload[0].payload.fullName)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} />
                  <Tooltip formatter={(v) => [v, "KPIs"]} labelFormatter={(_, p) => p[0]?.payload.fullName || ""} contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
                  <Bar dataKey="kpis" radius={[6, 6, 0, 0]} cursor="pointer">
                    {pillarBarData.map((e, i) => (<Cell key={i} fill={e.color} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Sector pie for selected pillar */}
            <div className="chart-container">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-['Outfit'] mb-1">
                {selectedPillar || "Select a Pillar"} 
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Sector-wise KPI distribution</p>
              {sectorPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={sectorPieData}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={100}
                      dataKey="value" nameKey="name" paddingAngle={2}
                      onClick={(_, i) => setSelectedSector(sectorPieData[i].fullName)}
                      cursor="pointer"
                    >
                      {sectorPieData.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
                    </Pie>
                    <Tooltip formatter={(v) => [v, "KPIs"]} contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
                    <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-slate-400 dark:text-slate-500">
                  <p className="text-sm">Click a pillar bar to see sector breakdown</p>
                </div>
              )}
            </div>
          </div>

          {/* Pillar cards grid */}
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-['Outfit']">Explore by Pillar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.map((p) => {
              const color = PILLAR_COLORS[p.pillar] || "#64748B";
              const isSelected = selectedPillar === p.pillar;
              return (
                <div
                  key={p.pillar}
                  onClick={() => setSelectedPillar(isSelected ? null : p.pillar)}
                  className={`bg-white dark:bg-slate-800 border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "border-2 shadow-md" : "border-slate-200 dark:border-slate-700"
                  }`}
                  style={isSelected ? { borderColor: color } : {}}
                  data-testid={`pillar-card-${p.pillar.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                      <Layers className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{p.pillar}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{p.total_kpis} KPIs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span>{p.sector_count} Sectors</span>
                    <span>{p.sectors.reduce((s, x) => s + x.goals, 0)} Goals</span>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
                      {p.sectors.map((s) => (
                        <button
                          key={s.name}
                          onClick={(e) => { e.stopPropagation(); setSelectedSector(s.name); }}
                          className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                          data-testid={`sector-btn-${s.name.replace(/\s+/g, "-").toLowerCase()}`}
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{s.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{s.kpis} KPIs, {s.goals} Goals</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VisionMetrics;
