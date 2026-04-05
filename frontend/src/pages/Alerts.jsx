import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useRole } from "../App";
import Sidebar from "../components/Sidebar";
import { 
  AlertTriangle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Filter
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const Alerts = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedAlert, setExpandedAlert] = useState(null);

  useEffect(() => {
    if (!role) {
      navigate("/");
      return;
    }
    fetchAlerts();
  }, [role, navigate]);

  useEffect(() => {
    filterAlerts();
  }, [alerts, severityFilter, categoryFilter]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${API}/alerts`);
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = [...alerts];

    if (severityFilter !== "all") {
      filtered = filtered.filter(a => a.severity === severityFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(a => a.category === categoryFilter);
    }

    setFilteredAlerts(filtered);
  };

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case "CRITICAL": return { bg: "bg-red-500", icon: AlertCircle, color: "text-red-500" };
      case "HIGH": return { bg: "bg-orange-500", icon: AlertTriangle, color: "text-orange-500" };
      case "MEDIUM": return { bg: "bg-amber-500", icon: Clock, color: "text-amber-500" };
      default: return { bg: "bg-blue-500", icon: AlertCircle, color: "text-blue-500" };
    }
  };

  const categories = [...new Set(alerts.map(a => a.category))];
  const severities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === "CRITICAL").length,
    high: alerts.filter(a => a.severity === "HIGH").length,
    medium: alerts.filter(a => a.severity === "MEDIUM").length,
    low: alerts.filter(a => a.severity === "LOW").length
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
      <main className="main-content flex-1" data-testid="alerts-page">
        {/* Header */}
        <header className="header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">AI Alerts & Remedies</h1>
              <p className="text-sm text-slate-500">Proactive risk detection and AI-suggested remediation actions</p>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-4">
            <div className="kpi-card">
              <p className="text-sm text-slate-500">Total Alerts</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="kpi-card border-l-4 border-red-500">
              <p className="text-sm text-slate-500">Critical</p>
              <p className="text-3xl font-bold text-red-500">{stats.critical}</p>
            </div>
            <div className="kpi-card border-l-4 border-orange-500">
              <p className="text-sm text-slate-500">High</p>
              <p className="text-3xl font-bold text-orange-500">{stats.high}</p>
            </div>
            <div className="kpi-card border-l-4 border-amber-500">
              <p className="text-sm text-slate-500">Medium</p>
              <p className="text-3xl font-bold text-amber-500">{stats.medium}</p>
            </div>
            <div className="kpi-card border-l-4 border-blue-500">
              <p className="text-sm text-slate-500">Low</p>
              <p className="text-3xl font-bold text-blue-500">{stats.low}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-200">
            <Filter className="w-5 h-5 text-slate-400" />
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]" data-testid="severity-filter">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                {severities.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]" data-testid="category-filter">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alerts List */}
          <div className="space-y-4" data-testid="alerts-list">
            {filteredAlerts.map((alert) => {
              const config = getSeverityConfig(alert.severity);
              const isExpanded = expandedAlert === alert.id;

              return (
                <div 
                  key={alert.id}
                  className={`bg-white border border-slate-200 rounded-lg overflow-hidden transition-all ${
                    alert.severity === 'CRITICAL' ? 'border-l-4 border-l-red-500' :
                    alert.severity === 'HIGH' ? 'border-l-4 border-l-orange-500' :
                    alert.severity === 'MEDIUM' ? 'border-l-4 border-l-amber-500' :
                    'border-l-4 border-l-blue-500'
                  }`}
                >
                  {/* Alert Header */}
                  <div 
                    className="p-5 cursor-pointer hover:bg-slate-50"
                    onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center`}>
                        <config.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Badge className={`${config.bg} text-white`}>{alert.severity}</Badge>
                          <Badge variant="outline">{alert.category}</Badge>
                          <span className="text-xs text-slate-500">{alert.alert_id}</span>
                        </div>
                        <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{alert.situation}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 mt-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{alert.owner}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {alert.deadline}</span>
                      </div>
                      <Badge variant="outline" className={alert.status === 'Open' ? 'text-amber-600 border-amber-200 bg-amber-50' : 'text-emerald-600 border-emerald-200 bg-emerald-50'}>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Expanded Remedies */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0 border-t border-slate-100">
                      <h4 className="font-medium text-slate-900 mb-3 mt-4">AI-Suggested Remedies</h4>
                      <div className="space-y-2">
                        {alert.remedies.map((remedy, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <span className="w-6 h-6 bg-[#F26522] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                              {index + 1}
                            </span>
                            <p className="text-sm text-slate-700">{remedy}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-sm text-slate-500">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
