import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useRole } from "../App";
import Sidebar from "../components/Sidebar";
import { exportToExcel } from "../utils/exportUtils";
import {
  Settings, Save, X, FileSpreadsheet, RefreshCw,
  FolderKanban, MapPin, Target, Bell, Check, ChevronDown
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";

const tabs = [
  { key: "programs", label: "Programs", icon: FolderKanban },
  { key: "districts", label: "Districts", icon: MapPin },
  { key: "kpis", label: "KPIs", icon: Target },
  { key: "alerts", label: "Alerts", icon: Bell },
];

const Admin = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState("programs");
  const [programs, setPrograms] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [editing, setEditing] = useState(null); // {type, id, field, value}
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchAll = useCallback(() => {
    Promise.all([
      axios.get(`${API}/programs`),
      axios.get(`${API}/districts`),
      axios.get(`${API}/kpis`),
      axios.get(`${API}/alerts`),
    ]).then(([p, d, k, a]) => {
      setPrograms(p.data);
      setDistricts(d.data);
      setKpis(k.data);
      setAlerts(a.data);
    });
  }, []);

  useEffect(() => {
    if (!role) { navigate("/"); return; }
    fetchAll();
  }, [role, navigate, fetchAll]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const startEdit = (type, id, field, currentValue) => {
    setEditing({ type, id, field, value: currentValue });
  };

  const cancelEdit = () => setEditing(null);

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const { type, id, field, value } = editing;
      const numericFields = ["progress", "amount_spent", "vision_score", "people_first_score", "rural_power_score", "prosperity_score", "tech_lead_score", "governance_score"];
      const payload = { [field]: numericFields.includes(field) ? parseFloat(value) : value };
      await axios.put(`${API}/admin/${type}/${id}`, payload);
      fetchAll();
      showToast(`Updated ${field} successfully`);
    } catch (err) {
      showToast("Failed to update", "error");
    }
    setSaving(false);
    setEditing(null);
  };

  const handleExport = () => {
    const dataMap = { programs, districts, kpis, alerts };
    const raw = dataMap[activeTab] || [];
    exportToExcel(raw.map(({ ...r }) => r), `odisha_${activeTab}`, activeTab);
  };

  const handleReseed = async () => {
    if (!window.confirm("This will reset ALL data to defaults. Are you sure?")) return;
    setSaving(true);
    try {
      await axios.post(`${API}/seed`);
      fetchAll();
      showToast("Database re-seeded successfully");
    } catch {
      showToast("Re-seed failed", "error");
    }
    setSaving(false);
  };

  const isEditing = (type, id, field) =>
    editing?.type === type && editing?.id === id && editing?.field === field;

  const EditCell = ({ type, id, field, value, options }) => {
    if (isEditing(type, id, field)) {
      return (
        <div className="flex items-center gap-1">
          {options ? (
            <select
              className="border border-[#1E3A8A] rounded px-2 py-1 text-sm bg-white focus:outline-none"
              value={editing.value}
              onChange={(e) => setEditing({ ...editing, value: e.target.value })}
              autoFocus
            >
              {options.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          ) : (
            <Input
              value={editing.value}
              onChange={(e) => setEditing({ ...editing, value: e.target.value })}
              className="h-7 w-24 text-sm border-[#1E3A8A]"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
            />
          )}
          <button onClick={saveEdit} disabled={saving} className="p-1 hover:bg-emerald-50 rounded text-emerald-600"><Check className="w-3.5 h-3.5" /></button>
          <button onClick={cancelEdit} className="p-1 hover:bg-red-50 rounded text-red-500"><X className="w-3.5 h-3.5" /></button>
        </div>
      );
    }
    return (
      <span
        className="cursor-pointer hover:bg-blue-50 px-1.5 py-0.5 rounded transition-colors text-sm"
        onClick={() => startEdit(type, id, field, value)}
        title="Click to edit"
        data-testid={`edit-${type}-${id}-${field}`}
      >
        {value}
      </span>
    );
  };

  const statusOpts = ["On-track", "At-risk", "Delayed", "Planned"];
  const alertStatusOpts = ["Open", "Acknowledged", "Resolved"];
  const severityOpts = ["Critical", "High", "Medium", "Low"];

  return (
    <div className="flex">
      <Sidebar />
      <main className="main-content flex-1" data-testid="admin-page">
        <header className="header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1E3A8A] rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">Admin Panel</h1>
                <p className="text-sm text-slate-500">Manage and update portal data</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm" data-testid="admin-export-btn">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export {activeTab}
              </button>
              <button onClick={handleReseed} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 text-sm" data-testid="admin-reseed-btn">
                <RefreshCw className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} /> Re-seed DB
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === t.key ? "bg-white text-[#1E3A8A] shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                  data-testid={`admin-tab-${t.key}`}
                >
                  <Icon className="w-4 h-4" /> {t.label}
                </button>
              );
            })}
          </div>

          {/* Programs Tab */}
          {activeTab === "programs" && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="table-responsive">
                <table className="data-table" data-testid="admin-programs-table">
                  <thead>
                    <tr><th>Program</th><th>Pillar</th><th>Status</th><th>Progress</th><th>Budget (Cr)</th><th>Spent (Cr)</th></tr>
                  </thead>
                  <tbody>
                    {programs.map((p) => (
                      <tr key={p.id}>
                        <td className="font-medium text-slate-900 max-w-[280px]">{p.name}</td>
                        <td className="text-sm text-slate-600">{p.pillar}</td>
                        <td><EditCell type="programs" id={p.id} field="status" value={p.status} options={statusOpts} /></td>
                        <td><EditCell type="programs" id={p.id} field="progress" value={p.progress} /></td>
                        <td className="text-sm">{p.total_budget?.toLocaleString()}</td>
                        <td><EditCell type="programs" id={p.id} field="amount_spent" value={p.amount_spent} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Districts Tab */}
          {activeTab === "districts" && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="table-responsive">
                <table className="data-table" data-testid="admin-districts-table">
                  <thead>
                    <tr><th>District</th><th>Vision Score</th><th>Status</th><th>People First</th><th>Rural Power</th><th>Prosperity</th><th>Tech Lead</th><th>Governance</th></tr>
                  </thead>
                  <tbody>
                    {districts.map((d) => (
                      <tr key={d.id}>
                        <td className="font-medium text-slate-900">{d.name}</td>
                        <td><EditCell type="districts" id={d.id} field="vision_score" value={d.vision_score} /></td>
                        <td><EditCell type="districts" id={d.id} field="status" value={d.status} options={statusOpts} /></td>
                        <td><EditCell type="districts" id={d.id} field="people_first_score" value={d.people_first_score} /></td>
                        <td><EditCell type="districts" id={d.id} field="rural_power_score" value={d.rural_power_score} /></td>
                        <td><EditCell type="districts" id={d.id} field="prosperity_score" value={d.prosperity_score} /></td>
                        <td><EditCell type="districts" id={d.id} field="tech_lead_score" value={d.tech_lead_score} /></td>
                        <td><EditCell type="districts" id={d.id} field="governance_score" value={d.governance_score} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* KPIs Tab */}
          {activeTab === "kpis" && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="table-responsive">
                <table className="data-table" data-testid="admin-kpis-table">
                  <thead>
                    <tr><th>KPI</th><th>Pillar</th><th>Current</th><th>Target 2036</th><th>Trend</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {kpis.map((k) => (
                      <tr key={k.id}>
                        <td className="font-medium text-slate-900 max-w-[280px]">{k.name}</td>
                        <td className="text-sm text-slate-600">{k.pillar}</td>
                        <td><EditCell type="kpis" id={k.id} field="current_value" value={k.current_value} /></td>
                        <td className="text-sm">{k.target_2036}</td>
                        <td><EditCell type="kpis" id={k.id} field="trend" value={k.trend} /></td>
                        <td><EditCell type="kpis" id={k.id} field="status" value={k.status} options={statusOpts} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === "alerts" && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="table-responsive">
                <table className="data-table" data-testid="admin-alerts-table">
                  <thead>
                    <tr><th>Alert Title</th><th>Severity</th><th>Status</th><th>Situation</th><th>Remedies</th></tr>
                  </thead>
                  <tbody>
                    {alerts.map((a) => (
                      <tr key={a.id}>
                        <td className="font-medium text-slate-900 max-w-[200px]">{a.title}</td>
                        <td><EditCell type="alerts" id={a.id} field="severity" value={a.severity} options={severityOpts} /></td>
                        <td><EditCell type="alerts" id={a.id} field="status" value={a.status} options={alertStatusOpts} /></td>
                        <td className="text-sm text-slate-600 max-w-[300px]">{a.situation}</td>
                        <td className="text-sm text-slate-600 max-w-[300px]">{Array.isArray(a.remedies) ? a.remedies[0] : a.remedies}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Toast notification */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
          }`} data-testid="admin-toast">
            {toast.msg}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
