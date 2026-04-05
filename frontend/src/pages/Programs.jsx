import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useRole } from "../App";
import Sidebar from "../components/Sidebar";
import { 
  Search, 
  Filter, 
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ArrowUpDown,
  FileSpreadsheet,
  FileText as FilePdf
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
import { exportToExcel, exportToPDF } from "../utils/exportUtils";

const Programs = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pillarFilter, setPillarFilter] = useState("all");
  const [sortField, setSortField] = useState("project_id");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (!role) {
      navigate("/");
      return;
    }
    fetchPrograms();
  }, [role, navigate]);

  useEffect(() => {
    filterAndSortPrograms();
  }, [programs, searchTerm, statusFilter, pillarFilter, sortField, sortOrder]);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API}/programs`);
      setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPrograms = () => {
    let filtered = [...programs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Pillar filter
    if (pillarFilter !== "all") {
      filtered = filtered.filter(p => p.pillar === pillarFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    setFilteredPrograms(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "On-track": return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "At-risk": return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "Delayed": return <Clock className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "On-track": return "status-on-track";
      case "At-risk": return "status-at-risk";
      case "Delayed": return "status-delayed";
      default: return "status-planned";
    }
  };

  const pillars = [...new Set(programs.map(p => p.pillar))];
  const statuses = ["On-track", "At-risk", "Delayed", "Planned"];

  const stats = {
    total: programs.length,
    onTrack: programs.filter(p => p.status === "On-track").length,
    atRisk: programs.filter(p => p.status === "At-risk").length,
    delayed: programs.filter(p => p.status === "Delayed").length
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
      <main className="main-content flex-1" data-testid="programs-page">
        {/* Header */}
        <header className="header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">36 Flagship Programs</h1>
              <p className="text-sm text-slate-500">Track progress of all flagship programmes under Odisha Vision 2036 & 2047</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => exportToExcel(filteredPrograms.map(p => ({ Name: p.name, Pillar: p.pillar, Status: p.status, Progress: `${p.progress}%`, Budget: p.total_budget, Spent: p.amount_spent, Department: p.department })), "odisha_programs", "Programs")}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm"
                data-testid="programs-export-excel"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel
              </button>
              <button 
                onClick={() => exportToPDF("36 Flagship Programs", ["Program", "Pillar", "Status", "Progress", "Budget", "Spent"], filteredPrograms.map(p => [p.name, p.pillar, p.status, `${p.progress}%`, p.total_budget, p.amount_spent]))}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90 text-sm"
                data-testid="programs-export-pdf"
              >
                <FilePdf className="w-4 h-4" /> PDF
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="kpi-card">
              <p className="text-sm text-slate-500">Total Programs</p>
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
            <div className="kpi-card border-l-4 border-red-500">
              <p className="text-sm text-slate-500">Delayed</p>
              <p className="text-3xl font-bold text-red-600">{stats.delayed}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          </div>

          {/* Programs Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="table-responsive">
              <table className="data-table" data-testid="programs-table">
                <thead>
                  <tr>
                    <th className="w-16">#</th>
                    <th>Program Name</th>
                    <th>Pillar</th>
                    <th>Department</th>
                    <th>Budget (₹ Cr)</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>AI Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrograms.map((program) => (
                    <tr key={program.id} className="hover:bg-slate-50">
                      <td className="font-medium text-slate-900">{program.project_id}</td>
                      <td>
                        <div>
                          <p className="font-medium text-slate-900">{program.name}</p>
                          <p className="text-xs text-slate-500">{program.target_2036}</p>
                        </div>
                      </td>
                      <td>
                        <Badge variant="outline" className="text-xs">
                          {program.pillar}
                        </Badge>
                      </td>
                      <td className="text-slate-600">{program.department}</td>
                      <td className="font-medium">
                        {program.total_budget ? `₹${program.total_budget.toLocaleString()}` : '-'}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Progress value={program.progress || 0} className="w-20 h-2" />
                          <span className="text-sm font-medium">{program.progress || 0}%</span>
                        </div>
                      </td>
                      <td>
                        <Badge className={`${getStatusColor(program.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(program.status)}
                          {program.status}
                        </Badge>
                      </td>
                      <td>
                        {program.ai_flag ? (
                          <div className="group relative">
                            <AlertTriangle className="w-5 h-5 text-amber-500 cursor-help" />
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white text-xs rounded-lg z-10">
                              <p className="font-medium mb-1">{program.ai_flag}</p>
                              <p className="text-slate-300">{program.ai_remedy}</p>
                            </div>
                          </div>
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Showing count */}
          <div className="text-sm text-slate-500">
            Showing {filteredPrograms.length} of {programs.length} programs
          </div>
        </div>
      </main>
    </div>
  );
};

export default Programs;
