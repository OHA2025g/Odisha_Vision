import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useRole } from "../App";
import Sidebar from "../components/Sidebar";
import { 
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Download
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const COLORS = ['#F26522', '#1E3A8A', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

const Budget = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [budget, setBudget] = useState([]);
  const [pillars, setPillars] = useState([]);
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
      const [budgetRes, pillarsRes] = await Promise.all([
        axios.get(`${API}/budget`),
        axios.get(`${API}/pillars`)
      ]);
      setBudget(budgetRes.data);
      setPillars(pillarsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "On-track": return "status-on-track";
      case "At-risk": return "status-at-risk";
      default: return "status-planned";
    }
  };

  const totalAllocation = budget.reduce((sum, b) => sum + b.allocation, 0);
  const totalUtilised = budget.reduce((sum, b) => sum + b.utilised, 0);
  const totalCommitted = budget.reduce((sum, b) => sum + b.committed, 0);
  const avgUtilisation = budget.length > 0 ? Math.round(totalUtilised / totalAllocation * 100) : 0;

  const pillarBudgetData = pillars.map((p, index) => ({
    name: p.name,
    value: p.budget_allocation,
    color: COLORS[index % COLORS.length]
  }));

  const departmentChartData = budget.slice(0, 10).map(b => ({
    name: b.department.length > 15 ? b.department.substring(0, 15) + '...' : b.department,
    allocation: b.allocation,
    utilised: b.utilised,
    fullName: b.department
  }));

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
      <main className="main-content flex-1" data-testid="budget-page">
        {/* Header */}
        <header className="header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">Budget Utilization</h1>
              <p className="text-sm text-slate-500">Department-wise budget allocation and spending FY 2025-26</p>
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
                <Wallet className="w-5 h-5 text-[#1E3A8A]" />
                <span className="text-sm text-slate-500">Total Allocation</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">₹{(totalAllocation / 1000).toFixed(1)}K Cr</p>
            </div>
            <div className="kpi-card">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-500">Total Utilised</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">₹{(totalUtilised / 1000).toFixed(1)}K Cr</p>
            </div>
            <div className="kpi-card">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-slate-500">Committed</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">₹{(totalCommitted / 1000).toFixed(1)}K Cr</p>
            </div>
            <div className="kpi-card">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#F26522]" />
                <span className="text-sm text-slate-500">Avg. Utilisation</span>
              </div>
              <p className="text-2xl font-bold text-[#F26522]">{avgUtilisation}%</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pillar Budget Pie Chart */}
            <div className="chart-container">
              <h3 className="text-lg font-semibold text-slate-900 font-['Outfit'] mb-4">Budget by Pillar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pillarBudgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {pillarBudgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`₹${(value / 1000).toFixed(1)}K Cr`, 'Budget']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Department Budget Bar Chart */}
            <div className="chart-container">
              <h3 className="text-lg font-semibold text-slate-900 font-['Outfit'] mb-4">Department-wise Utilization</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentChartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#64748B', fontSize: 10 }} width={100} />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString()} Cr`]}
                    labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  />
                  <Legend />
                  <Bar dataKey="allocation" name="Allocated" fill="#1E3A8A" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="utilised" name="Utilised" fill="#F26522" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Budget Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="table-responsive">
              <table className="data-table" data-testid="budget-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Pillar</th>
                    <th>Allocation (₹ Cr)</th>
                    <th>Utilised (₹ Cr)</th>
                    <th>Committed (₹ Cr)</th>
                    <th>Utilisation %</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.map((dept) => (
                    <tr key={dept.id} className="hover:bg-slate-50">
                      <td className="font-medium text-slate-900">{dept.department}</td>
                      <td>
                        <Badge variant="outline" className="text-xs">{dept.pillar}</Badge>
                      </td>
                      <td className="font-medium">₹{dept.allocation.toLocaleString()}</td>
                      <td className="text-emerald-600 font-medium">₹{dept.utilised.toLocaleString()}</td>
                      <td className="text-amber-600">₹{dept.committed.toLocaleString()}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Progress value={dept.utilisation_percent} className="w-16 h-2" />
                          <span className="text-sm font-medium">{dept.utilisation_percent}%</span>
                        </div>
                      </td>
                      <td>
                        <Badge className={getStatusColor(dept.status)}>
                          {dept.status}
                        </Badge>
                      </td>
                      <td className="text-xs text-slate-500 max-w-[200px] truncate">{dept.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Budget;
