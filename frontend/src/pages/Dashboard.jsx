import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useRole } from "../App";
import Sidebar from "../components/Sidebar";
import {
  Users,
  Wheat,
  Building2,
  Cpu,
  Landmark,
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  Bell
} from "lucide-react";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";

const pillarIcons = {
  "People First": Users,
  "Rural Power": Wheat,
  "Prosperity": Building2,
  "Tech Lead": Cpu,
  "Legacy": Landmark,
  "Governance": Shield
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [summary, setSummary] = useState(null);
  const [pillars, setPillars] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!role) {
      navigate("/");
      return;
    }
    fetchData();
  }, [role, navigate]);

  const fetchData = async () => {
    try {
      const [summaryRes, pillarsRes, alertsRes, programsRes] = await Promise.all([
        axios.get(`${API}/dashboard-summary`),
        axios.get(`${API}/pillars`),
        axios.get(`${API}/alerts`),
        axios.get(`${API}/programs`)
      ]);
      setSummary(summaryRes.data);
      setPillars(pillarsRes.data);
      setAlerts(alertsRes.data.slice(0, 4));
      setPrograms(programsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "On-track": return "bg-emerald-100 text-emerald-700";
      case "At-risk": return "bg-amber-100 text-amber-700";
      case "Delayed": return "bg-red-100 text-red-700";
      default: return "bg-blue-100 text-blue-700";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL": return "bg-red-500";
      case "HIGH": return "bg-orange-500";
      case "MEDIUM": return "bg-amber-500";
      default: return "bg-blue-500";
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="main-content flex-1 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#F26522] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="main-content flex-1" data-testid="dashboard-main">
        {/* Header */}
        <header className="header flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">Dashboard Overview</h1>
            <p className="text-sm text-slate-500">Odisha Vision 2036 & 2047 Progress Tracking</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-500">Last Updated</p>
              <p className="text-sm font-medium text-slate-700">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div className="relative">
              <Bell className="w-6 h-6 text-slate-500 cursor-pointer hover:text-[#F26522]" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" data-testid="summary-cards">
            <div className="kpi-card animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">Total Projects</span>
                <Target className="w-5 h-5 text-[#F26522]" />
              </div>
              <div className="kpi-value">{summary?.total_programs || 36}</div>
              <p className="text-xs text-slate-400 mt-1">Flagship Programs</p>
            </div>

            <div className="kpi-card animate-fadeIn stagger-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">Total Budget</span>
                <Building2 className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div className="kpi-value">₹{((summary?.total_budget || 216193) / 1000).toFixed(1)}L Cr</div>
              <p className="text-xs text-slate-400 mt-1">Across all pillars</p>
            </div>

            <div className="kpi-card animate-fadeIn stagger-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">Beneficiaries</span>
                <Users className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="kpi-value">{summary?.beneficiaries || "4.2Cr"}</div>
              <p className="text-xs text-slate-400 mt-1">People Reached</p>
            </div>

            <div className="kpi-card animate-fadeIn stagger-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">Districts</span>
                <Building2 className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div className="kpi-value">{summary?.total_districts || 30}</div>
              <p className="text-xs text-slate-400 mt-1">All Districts Covered</p>
            </div>

            <div className="kpi-card animate-fadeIn stagger-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">Active Alerts</span>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div className="kpi-value">{summary?.active_alerts || 6}</div>
              <p className="text-xs text-slate-400 mt-1">Require Attention</p>
            </div>
          </div>

          {/* Progress Status */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 font-['Outfit']">Overall Progress</h2>
              <span className="text-2xl font-bold text-[#F26522]">54%</span>
            </div>
            <Progress value={54} className="h-3 mb-4" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-semibold">{summary?.programs_on_track || 24}</span>
                </div>
                <p className="text-xs text-slate-500">On Track</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-amber-600 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-semibold">{summary?.programs_at_risk || 8}</span>
                </div>
                <p className="text-xs text-slate-500">At Risk</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-red-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">{summary?.programs_delayed || 4}</span>
                </div>
                <p className="text-xs text-slate-500">Delayed</p>
              </div>
            </div>
          </div>

          {/* Six Pillars Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 font-['Outfit']">Six Strategic Pillars</h2>
              <button 
                onClick={() => navigate("/sectors")}
                className="text-sm text-[#F26522] hover:underline flex items-center gap-1"
              >
                View Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="pillars-grid">
              {pillars.map((pillar, index) => {
                const Icon = pillarIcons[pillar.name] || Target;
                return (
                  <div 
                    key={pillar.id} 
                    className={`pillar-card animate-fadeIn stagger-${index + 1}`}
                    data-testid={`pillar-card-${pillar.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${pillar.color}15` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: pillar.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 font-['Outfit']">{pillar.name}</h3>
                        <p className="text-xs text-slate-500 truncate">{pillar.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-slate-500">Budget: ₹{(pillar.budget_allocation / 1000).toFixed(1)}K Cr</span>
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: pillar.color }}
                        >
                          {pillar.health_score}
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={pillar.health_score} 
                      className="h-1.5 mt-3"
                      style={{ '--progress-color': pillar.color }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Two Column Layout: Programs & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Programs */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 font-['Outfit']">Flagship Programs</h2>
                <button 
                  onClick={() => navigate("/programs")}
                  className="text-sm text-[#F26522] hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {programs.slice(0, 5).map((program) => (
                  <div key={program.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 font-bold text-sm">
                      {program.project_id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{program.name}</p>
                      <p className="text-xs text-slate-500">{program.department}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{program.progress || 0}%</p>
                        <Progress value={program.progress || 0} className="w-16 h-1.5" />
                      </div>
                      <Badge className={getStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Alerts */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 font-['Outfit']">AI Alerts</h2>
                <button 
                  onClick={() => navigate("/alerts")}
                  className="text-sm text-[#F26522] hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`alert-card ${alert.severity.toLowerCase()}`}
                  >
                    <div className="flex items-start gap-3">
                      <Badge className={`${getSeverityColor(alert.severity)} text-white text-xs`}>
                        {alert.severity}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 line-clamp-2">{alert.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{alert.owner}</p>
                      </div>
                    </div>
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

export default Dashboard;
