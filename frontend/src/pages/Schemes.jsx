import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useRole } from "../App";
import Sidebar from "../components/Sidebar";
import { 
  Search, 
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock
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

const Schemes = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pillarFilter, setPillarFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (!role) {
      navigate("/");
      return;
    }
    fetchSchemes();
  }, [role, navigate]);

  useEffect(() => {
    filterSchemes();
  }, [schemes, searchTerm, pillarFilter, typeFilter]);

  const fetchSchemes = async () => {
    try {
      const response = await axios.get(`${API}/schemes`);
      setSchemes(response.data);
    } catch (error) {
      console.error("Error fetching schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSchemes = () => {
    let filtered = [...schemes];

    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (pillarFilter !== "all") {
      filtered = filtered.filter(s => s.pillar === pillarFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(s => s.scheme_type === typeFilter);
    }

    setFilteredSchemes(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "On-track": return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "At-risk": return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default: return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "On-track": return "status-on-track";
      case "At-risk": return "status-at-risk";
      default: return "status-planned";
    }
  };

  const pillars = [...new Set(schemes.map(s => s.pillar))];
  const types = [...new Set(schemes.map(s => s.scheme_type))];

  const stats = {
    total: schemes.length,
    state: schemes.filter(s => s.scheme_type === "State").length,
    css: schemes.filter(s => s.scheme_type === "CSS").length,
    totalBudget: schemes.reduce((sum, s) => sum + (s.budget || 0), 0)
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
      <main className="main-content flex-1" data-testid="schemes-page">
        {/* Header */}
        <header className="header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">Schemes Master List</h1>
              <p className="text-sm text-slate-500">All active State and Centrally Sponsored Schemes</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="kpi-card">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-[#1E3A8A]" />
                <span className="text-sm text-slate-500">Total Schemes</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="kpi-card border-l-4 border-[#F26522]">
              <p className="text-sm text-slate-500">State Schemes</p>
              <p className="text-3xl font-bold text-[#F26522]">{stats.state}</p>
            </div>
            <div className="kpi-card border-l-4 border-[#1E3A8A]">
              <p className="text-sm text-slate-500">CSS (Central)</p>
              <p className="text-3xl font-bold text-[#1E3A8A]">{stats.css}</p>
            </div>
            <div className="kpi-card border-l-4 border-emerald-500">
              <p className="text-sm text-slate-500">Total Budget</p>
              <p className="text-3xl font-bold text-emerald-600">₹{(stats.totalBudget / 1000).toFixed(0)}K Cr</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search schemes..."
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]" data-testid="type-filter">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Schemes Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="table-responsive">
              <table className="data-table" data-testid="schemes-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Scheme Name</th>
                    <th>Pillar</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th>Budget (₹ Cr)</th>
                    <th>Coverage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchemes.map((scheme) => (
                    <tr key={scheme.id} className="hover:bg-slate-50">
                      <td className="font-medium text-slate-500">{scheme.scheme_id}</td>
                      <td>
                        <div>
                          <p className="font-medium text-slate-900">{scheme.name}</p>
                          <p className="text-xs text-slate-500">{scheme.description}</p>
                        </div>
                      </td>
                      <td>
                        <Badge variant="outline" className="text-xs">{scheme.pillar}</Badge>
                      </td>
                      <td className="text-slate-600">{scheme.department}</td>
                      <td>
                        <Badge 
                          variant="outline" 
                          className={scheme.scheme_type === 'State' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'}
                        >
                          {scheme.scheme_type}
                        </Badge>
                      </td>
                      <td className="font-medium">
                        {scheme.budget ? `₹${scheme.budget.toLocaleString()}` : '-'}
                      </td>
                      <td className="text-sm text-slate-600">{scheme.beneficiary_coverage}</td>
                      <td>
                        <Badge className={`${getStatusColor(scheme.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(scheme.status)}
                          {scheme.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Showing {filteredSchemes.length} of {schemes.length} schemes
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schemes;
