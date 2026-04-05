import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API, useRole } from "../App";
import Sidebar from "../components/Sidebar";
import { exportToExcel, exportToPDF } from "../utils/exportUtils";
import {
  ArrowLeft, Download, MapPin, TrendingUp, TrendingDown, Minus,
  CheckCircle2, AlertTriangle, Clock, FileSpreadsheet, FileText as FilePdf
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from "recharts";

const getScoreColor = (s) => (s >= 70 ? "#10B981" : s >= 50 ? "#F59E0B" : s >= 30 ? "#F26522" : "#EF4444");
const statusClass = (s) => {
  if (s === "On-track") return "status-on-track";
  if (s === "At-risk") return "status-at-risk";
  if (s === "Delayed") return "status-delayed";
  return "status-planned";
};

const DistrictDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { role } = useRole();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!role) { navigate("/"); return; }
    axios.get(`${API}/districts/${encodeURIComponent(name)}`)
      .then((r) => setData(r.data))
      .catch(() => navigate("/districts"))
      .finally(() => setLoading(false));
  }, [name, role, navigate]);

  if (loading || !data) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="main-content flex-1 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#F26522] border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  const { district, pillar_scores, related_programs, related_schemes, related_kpis } = data;
  const radarData = Object.entries(pillar_scores).map(([k, v]) => ({ pillar: k, score: v, fullMark: 100 }));
  const pillarBarData = Object.entries(pillar_scores).map(([k, v]) => ({ name: k, score: v }));

  const handleExcelExport = () => {
    const rows = related_programs.map((p) => ({
      Name: p.name, Pillar: p.pillar, Status: p.status, Progress: `${p.progress}%`,
      Budget: p.total_budget, Spent: p.amount_spent,
    }));
    exportToExcel(rows, `${district.name}_programs`, "Programs");
  };

  const handlePdfExport = () => {
    exportToPDF(
      `${district.name} - District Report`,
      ["Program", "Pillar", "Status", "Progress", "Budget (Cr)", "Spent (Cr)"],
      related_programs.map((p) => [p.name, p.pillar, p.status, `${p.progress}%`, p.total_budget, p.amount_spent])
    );
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="main-content flex-1" data-testid="district-detail-page">
        <header className="header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/districts")} className="p-2 hover:bg-slate-100 rounded-lg" data-testid="back-btn">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">{district.name}</h1>
                  <Badge className={statusClass(district.status)}>{district.status}</Badge>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{district.characteristics}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleExcelExport} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm" data-testid="export-excel-btn">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel
              </button>
              <button onClick={handlePdfExport} className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90 text-sm" data-testid="export-pdf-btn">
                <FilePdf className="w-4 h-4" /> PDF
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Score row */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="kpi-card col-span-1 flex flex-col items-center">
              <p className="text-sm text-slate-500 mb-1">Vision Score</p>
              <div className="score-circle text-lg" style={{ backgroundColor: getScoreColor(district.vision_score) }}>
                {district.vision_score}
              </div>
            </div>
            {Object.entries(pillar_scores).map(([k, v]) => (
              <div key={k} className="kpi-card">
                <p className="text-xs text-slate-500">{k}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={v} className="flex-1 h-2" />
                  <span className="text-sm font-bold text-slate-900">{v}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="chart-container">
              <h3 className="text-lg font-semibold text-slate-900 font-['Outfit'] mb-4">Pillar-wise Radar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="pillar" tick={{ fill: "#64748B", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <Radar name="Score" dataKey="score" stroke="#F26522" fill="#F26522" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-container">
              <h3 className="text-lg font-semibold text-slate-900 font-['Outfit'] mb-4">Pillar Scores</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pillarBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {pillarBarData.map((e, i) => (<Cell key={i} fill={getScoreColor(e.score)} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Related Programs */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 font-['Outfit']">Related Flagship Programs ({related_programs.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="data-table" data-testid="district-programs-table">
                <thead>
                  <tr><th>Program</th><th>Pillar</th><th>Status</th><th>Progress</th><th>Budget (Cr)</th><th>Spent (Cr)</th></tr>
                </thead>
                <tbody>
                  {related_programs.map((p) => (
                    <tr key={p.id}>
                      <td className="font-medium text-slate-900 max-w-[250px]">{p.name}</td>
                      <td><span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">{p.pillar}</span></td>
                      <td><Badge className={statusClass(p.status)}>{p.status}</Badge></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Progress value={p.progress} className="w-16 h-2" />
                          <span className="text-sm">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="text-sm">{p.total_budget?.toLocaleString()}</td>
                      <td className="text-sm">{p.amount_spent?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Related KPIs & Schemes side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* KPIs */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 font-['Outfit']">Related KPIs ({related_kpis.length})</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {related_kpis.map((k) => (
                  <div key={k.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{k.name}</p>
                      <p className="text-xs text-slate-500">{k.current_value} → {k.target_2036}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-600 font-medium">{k.trend}</span>
                      <Badge className={statusClass(k.status)}>{k.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schemes */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 font-['Outfit']">Related Schemes ({related_schemes.length})</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {related_schemes.map((s) => (
                  <div key={s.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.description}</p>
                    </div>
                    <Badge className={statusClass(s.status)}>{s.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DistrictDetail;
