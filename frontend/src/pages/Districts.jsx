import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useRole } from "../App";
import Sidebar from "../components/Sidebar";
import OdishaMap from "../components/OdishaMap";
import { 
  Search, 
  TrendingUp, 
  TrendingDown,
  Minus,
  MapPin,
  ArrowUpDown,
  Download,
  Map as MapIcon,
  FileSpreadsheet,
  FileText as FilePdf,
  ExternalLink
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";

const Districts = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (!role) {
      navigate("/");
      return;
    }
    fetchDistricts();
  }, [role, navigate]);

  useEffect(() => {
    filterDistricts();
  }, [districts, searchTerm, statusFilter, sortOrder]);

  const fetchDistricts = async () => {
    try {
      const response = await axios.get(`${API}/districts`);
      setDistricts(response.data);
      if (response.data.length > 0) {
        setSelectedDistrict(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDistricts = () => {
    let filtered = [...districts];

    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    filtered.sort((a, b) => {
      if (sortOrder === "desc") {
        return b.vision_score - a.vision_score;
      }
      return a.vision_score - b.vision_score;
    });

    setFilteredDistricts(filtered);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#10B981";
    if (score >= 50) return "#F59E0B";
    if (score >= 30) return "#F26522";
    return "#EF4444";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "On-track": return "status-on-track";
      case "At-risk": return "status-at-risk";
      case "Delayed": return "status-delayed";
      default: return "status-planned";
    }
  };

  const getTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const chartData = filteredDistricts.slice(0, 15).map(d => ({
    name: d.name.length > 10 ? d.name.substring(0, 10) + '...' : d.name,
    score: d.vision_score,
    fullName: d.name
  }));

  const radarData = selectedDistrict ? [
    { pillar: "People First", score: selectedDistrict.people_first_score, fullMark: 100 },
    { pillar: "Rural Power", score: selectedDistrict.rural_power_score, fullMark: 100 },
    { pillar: "Prosperity", score: selectedDistrict.prosperity_score, fullMark: 100 },
    { pillar: "Tech Lead", score: selectedDistrict.tech_lead_score, fullMark: 100 },
    { pillar: "Governance", score: selectedDistrict.governance_score, fullMark: 100 }
  ] : [];

  const stats = {
    total: districts.length,
    onTrack: districts.filter(d => d.status === "On-track").length,
    atRisk: districts.filter(d => d.status === "At-risk").length,
    delayed: districts.filter(d => d.status === "Delayed").length,
    avgScore: districts.length > 0 ? Math.round(districts.reduce((sum, d) => sum + d.vision_score, 0) / districts.length) : 0
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
      <main className="main-content flex-1" data-testid="districts-page">
        {/* Header */}
        <header className="header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">District Performance Index</h1>
              <p className="text-sm text-slate-500">Vision score and pillar-wise performance across 30 districts</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => exportToExcel(filteredDistricts.map(d => ({ Name: d.name, "Vision Score": d.vision_score, Status: d.status, "People First": d.people_first_score, "Rural Power": d.rural_power_score, Prosperity: d.prosperity_score, "Tech Lead": d.tech_lead_score, Governance: d.governance_score })), "odisha_districts", "Districts")}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm"
                data-testid="districts-export-excel"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel
              </button>
              <button 
                onClick={() => exportToPDF("District Performance Index", ["District", "Vision Score", "Status", "People First", "Rural Power", "Prosperity", "Tech Lead", "Governance"], filteredDistricts.map(d => [d.name, d.vision_score, d.status, d.people_first_score, d.rural_power_score, d.prosperity_score, d.tech_lead_score, d.governance_score]))}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90 text-sm"
                data-testid="districts-export-pdf"
              >
                <FilePdf className="w-4 h-4" /> PDF
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-4">
            <div className="kpi-card">
              <p className="text-sm text-slate-500">Total Districts</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="kpi-card">
              <p className="text-sm text-slate-500">Avg. Vision Score</p>
              <p className="text-3xl font-bold text-[#F26522]">{stats.avgScore}</p>
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

          {/* Interactive Map + Radar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 chart-container p-0 overflow-hidden">
              <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-[#1E3A8A]" />
                  <h3 className="text-lg font-semibold text-slate-900 font-['Outfit']">Odisha District Map</h3>
                </div>
                <span className="text-xs text-slate-400">Click district for details</span>
              </div>
              <OdishaMap 
                districts={districts} 
                onDistrictSelect={setSelectedDistrict}
                selectedDistrict={selectedDistrict}
              />
            </div>

            {/* Radar Chart */}
            <div className="chart-container">
              <h3 className="text-lg font-semibold text-slate-900 font-['Outfit'] mb-2">
                {selectedDistrict?.name || 'Select District'}
              </h3>
              <p className="text-sm text-slate-500 mb-1">Pillar-wise breakdown</p>
              {selectedDistrict && (
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="score-circle w-10 h-10 text-xs"
                    style={{ backgroundColor: getScoreColor(selectedDistrict.vision_score) }}
                  >
                    {selectedDistrict.vision_score}
                  </div>
                  <div>
                    <Badge className={getStatusColor(selectedDistrict.status)}>
                      {selectedDistrict.status}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">{selectedDistrict.characteristics}</p>
                  </div>
                </div>
              )}
              {selectedDistrict && (
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="pillar" tick={{ fill: '#64748B', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#F26522"
                      fill="#F26522"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bar Chart */}
            <div className="lg:col-span-3 chart-container">
              <h3 className="text-lg font-semibold text-slate-900 font-['Outfit'] mb-4">District Vision Scores - Top 15</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#64748B', fontSize: 11 }} width={80} />
                  <Tooltip 
                    formatter={(value, name, props) => [value, 'Vision Score']}
                    labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search districts..."
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
                <SelectItem value="On-track">On Track</SelectItem>
                <SelectItem value="At-risk">At Risk</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
            <button 
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <ArrowUpDown className="w-4 h-4" />
              Score {sortOrder === "desc" ? "↓" : "↑"}
            </button>
          </div>

          {/* Districts Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="table-responsive">
              <table className="data-table" data-testid="districts-table">
                <thead>
                  <tr>
                    <th>District</th>
                    <th>Vision Score</th>
                    <th>MoM Change</th>
                    <th>Status</th>
                    <th>People First</th>
                    <th>Rural Power</th>
                    <th>Prosperity</th>
                    <th>Tech Lead</th>
                    <th>Governance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDistricts.map((district) => (
                    <tr 
                      key={district.id} 
                      className={`cursor-pointer ${selectedDistrict?.id === district.id ? 'bg-orange-50' : 'hover:bg-slate-50'}`}
                      onClick={() => setSelectedDistrict(district)}
                    >
                      <td>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate(`/districts/${encodeURIComponent(district.name)}`); }}
                              className="font-medium text-slate-900 hover:text-[#1E3A8A] hover:underline text-left flex items-center gap-1"
                              data-testid={`drill-down-${district.id}`}
                            >
                              {district.name}
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#1E3A8A]" />
                            </button>
                            <p className="text-xs text-slate-500 max-w-[200px] truncate">{district.characteristics}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div 
                            className="score-circle"
                            style={{ backgroundColor: getScoreColor(district.vision_score) }}
                          >
                            {district.vision_score}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(district.mom_change)}
                          <span className={`font-medium ${
                            district.mom_change > 0 ? 'text-emerald-600' : 
                            district.mom_change < 0 ? 'text-red-600' : 'text-slate-500'
                          }`}>
                            {district.mom_change > 0 ? '+' : ''}{district.mom_change}
                          </span>
                        </div>
                      </td>
                      <td>
                        <Badge className={getStatusColor(district.status)}>
                          {district.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Progress value={district.people_first_score} className="w-12 h-2" />
                          <span className="text-sm">{district.people_first_score}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Progress value={district.rural_power_score} className="w-12 h-2" />
                          <span className="text-sm">{district.rural_power_score}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Progress value={district.prosperity_score} className="w-12 h-2" />
                          <span className="text-sm">{district.prosperity_score}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Progress value={district.tech_lead_score} className="w-12 h-2" />
                          <span className="text-sm">{district.tech_lead_score}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Progress value={district.governance_score} className="w-12 h-2" />
                          <span className="text-sm">{district.governance_score}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Showing {filteredDistricts.length} of {districts.length} districts
          </div>
        </div>
      </main>
    </div>
  );
};

export default Districts;
