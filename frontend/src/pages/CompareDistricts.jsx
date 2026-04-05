import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useRole } from "../App";
import Sidebar from "../components/Sidebar";
import { useLang } from "../contexts/LangContext";
import { GitCompareArrows, Plus, X, ArrowRight } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from "recharts";

const COLORS = ["#1E3A8A", "#F26522", "#10B981", "#8B5CF6"];

const getScoreColor = (s) => (s >= 70 ? "#10B981" : s >= 50 ? "#F59E0B" : "#EF4444");

const CompareDistricts = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const { t } = useLang();
  const [allDistricts, setAllDistricts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [pendingAdd, setPendingAdd] = useState("");

  useEffect(() => {
    if (!role) { navigate("/"); return; }
    axios.get(`${API}/districts`).then((r) => {
      setAllDistricts(r.data);
      if (r.data.length >= 2) setSelected([r.data[0], r.data[1]]);
    });
  }, [role, navigate]);

  const addDistrict = () => {
    if (!pendingAdd || selected.length >= 4) return;
    const d = allDistricts.find((x) => x.id === pendingAdd);
    if (d && !selected.find((s) => s.id === d.id)) {
      setSelected([...selected, d]);
    }
    setPendingAdd("");
  };

  const removeDistrict = (id) => setSelected(selected.filter((d) => d.id !== id));

  const pillars = ["people_first_score", "rural_power_score", "prosperity_score", "tech_lead_score", "governance_score"];
  const pillarLabels = { people_first_score: "People First", rural_power_score: "Rural Power", prosperity_score: "Prosperity", tech_lead_score: "Tech Lead", governance_score: "Governance" };

  const radarData = pillars.map((p) => {
    const entry = { pillar: pillarLabels[p] };
    selected.forEach((d) => { entry[d.name] = d[p]; });
    return entry;
  });

  const barData = selected.map((d, i) => ({ name: d.name, score: d.vision_score, color: COLORS[i] }));

  const available = allDistricts.filter((d) => !selected.find((s) => s.id === d.id));

  return (
    <div className="flex">
      <Sidebar />
      <main className="main-content flex-1" data-testid="compare-page">
        <header className="header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1E3A8A] dark:bg-[#F26522] rounded-xl flex items-center justify-center">
                <GitCompareArrows className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Outfit']">{t("comparison_view")}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t("select_districts")}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* District selector row */}
          <div className="flex flex-wrap items-center gap-3">
            {selected.map((d, i) => (
              <div key={d.id} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl" data-testid={`compare-chip-${d.id}`}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-sm font-medium text-slate-900 dark:text-white">{d.name}</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: getScoreColor(d.vision_score) }}>{d.vision_score}</span>
                {selected.length > 2 && (
                  <button onClick={() => removeDistrict(d.id)} className="p-0.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                    <X className="w-3 h-3 text-red-500" />
                  </button>
                )}
              </div>
            ))}
            {selected.length < 4 && available.length > 0 && (
              <div className="flex items-center gap-2">
                <Select value={pendingAdd} onValueChange={setPendingAdd}>
                  <SelectTrigger className="w-48 h-9 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" data-testid="compare-add-select">
                    <SelectValue placeholder={t("add_district")} />
                  </SelectTrigger>
                  <SelectContent>
                    {available.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name} ({d.vision_score})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button onClick={addDistrict} className="p-2 bg-[#F26522] text-white rounded-lg hover:bg-[#F26522]/90" data-testid="compare-add-btn">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {selected.length >= 2 && (
            <>
              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar overlay */}
                <div className="chart-container dark:bg-slate-800 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-['Outfit'] mb-4">Pillar-wise Comparison</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#CBD5E1" />
                      <PolarAngleAxis dataKey="pillar" tick={{ fill: "#64748B", fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 10 }} />
                      {selected.map((d, i) => (
                        <Radar key={d.id} name={d.name} dataKey={d.name} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} strokeWidth={2} />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar chart */}
                <div className="chart-container dark:bg-slate-800 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-['Outfit'] mb-4">Vision Score</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
                      <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                        {barData.map((e, i) => (<Cell key={i} fill={e.color} />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pillar breakdown table */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-['Outfit']">Detailed Comparison</h3>
                </div>
                <div className="table-responsive">
                  <table className="data-table" data-testid="compare-table">
                    <thead>
                      <tr>
                        <th className="dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">Metric</th>
                        {selected.map((d, i) => (
                          <th key={d.id} className="dark:bg-slate-800 dark:border-slate-700">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                              <span className="dark:text-slate-300">{d.name}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-medium text-slate-900 dark:text-white">{t("vision_score")}</td>
                        {selected.map((d) => (
                          <td key={d.id}>
                            <span className="text-lg font-bold" style={{ color: getScoreColor(d.vision_score) }}>{d.vision_score}</span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="font-medium text-slate-900 dark:text-white">{t("status")}</td>
                        {selected.map((d) => (
                          <td key={d.id}>
                            <Badge className={d.status === "On-track" ? "status-on-track" : d.status === "At-risk" ? "status-at-risk" : "status-delayed"}>
                              {d.status}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      {pillars.map((p) => (
                        <tr key={p}>
                          <td className="font-medium text-slate-900 dark:text-white">{pillarLabels[p]}</td>
                          {selected.map((d) => {
                            const val = d[p];
                            const best = Math.max(...selected.map((s) => s[p]));
                            return (
                              <td key={d.id}>
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-bold ${val === best ? "text-emerald-600" : "text-slate-600 dark:text-slate-400"}`}>{val}</span>
                                  {val === best && selected.length > 1 && <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">Best</span>}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      <tr>
                        <td className="font-medium text-slate-900 dark:text-white">Characteristics</td>
                        {selected.map((d) => (
                          <td key={d.id} className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">{d.characteristics}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompareDistricts;
