import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useRole } from "../App";
import Sidebar from "../components/Sidebar";
import { 
  Search, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Target,
  Download,
  Filter
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const KPIs = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [kpis, setKpis] = useState([]);
  const [filteredKpis, setFilteredKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pillarFilter, setPillarFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!role) {
      navigate("/");
      return;
    }
    fetchKPIs();
  }, [role, navigate]);

  useEffect(() => {
    filterKPIs();
  }, [kpis, searchTerm, pillarFilter, statusFilter]);

  const fetchKPIs = async () => {
    try {
      const response = await axios.get(`${API}/kpis`);
      setKpis(response.data);
    } catch (error) {
      console.error("Error fetching KPIs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterKPIs = () => {
    let filtered = [...kpis];

    if (searchTerm) {
      filtered = filtered.filter(k => 
        k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (pillarFilter !== "all") {
      filtered = filtered.filter(k => k.pillar === pillarFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(k => k.status === statusFilter);
    }

    setFilteredKpis(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "On-track": return "status-on-track";
      case "At-risk": return "status-at-risk";
      default: return "status-planned";
    }
  };

  const getTrendIcon = (trend) => {
    if (!trend) return <Minus className="w-4 h-4 text-slate-400" />;
    if (trend.includes('↑') || trend.includes('+')) return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    if (trend.includes('↓') || trend.includes('-')) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const pillars = [...new Set(kpis.map(k => k.pillar))];

  const stats = {
    total: kpis.length,
    onTrack: kpis.filter(k => k.status === "On-track").length,
    atRisk: kpis.filter(k => k.status === "At-risk").length
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
      <main className="main-content flex-1" data-testid="kpis-page">
        {/* Header */}
        <header className="header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">KPIs & Outcome Indicators</h1>
              <p className="text-sm text-slate-500">Track progress against Vision 2036 & 2047 targets</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="kpi-card">
              <p className="text-sm text-slate-500">Total KPIs</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="kpi-card border-l-4 border-emerald-500">
              <p className="text-sm text-slate-500">On Track</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.onTrack}</p>
            </div>
            <div className="kpi-card border-l-4 border-amber-500">
              <p className="text-sm text-slate-500">At Risk</p>
              <p className="text-3xl font-bold text-amber-600">{stats.atRisk}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search KPIs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>
            </div>
            <Select value={pillarFilter} onValueChange={setPillarFilter}>
              <SelectTrigger className="w-[180px]" data-testid="pillar-filter">
                <SelectValue placeholder="Pillar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pillars</SelectItem>
                {pillars.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="On-track">On Track</SelectItem>
                <SelectItem value="At-risk">At Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="kpis-grid">
            {filteredKpis.map((kpi) => (
              <div key={kpi.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Badge variant="outline" className="text-xs mb-2">{kpi.pillar}</Badge>
                    <h3 className="font-semibold text-slate-900">{kpi.name}</h3>
                    <p className="text-xs text-slate-500">{kpi.category}</p>
                  </div>
                  <Badge className={getStatusColor(kpi.status)}>
                    {kpi.status}
                  </Badge>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Current</span>
                    <span className="font-bold text-slate-900">{kpi.current_value}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">2036 Target</span>
                    <span className="font-medium text-[#F26522]">{kpi.target_2036}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">2047 Target</span>
                    <span className="font-medium text-[#1E3A8A]">{kpi.target_2047}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(kpi.trend)}
                    <span className="text-sm text-slate-600">{kpi.trend || 'No data'}</span>
                  </div>
                  <span className="text-xs text-slate-400">{kpi.data_source}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm text-slate-500">
            Showing {filteredKpis.length} of {kpis.length} KPIs
          </div>
        </div>
      </main>
    </div>
  );
};

export default KPIs;
