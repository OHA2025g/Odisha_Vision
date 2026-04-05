import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useRole } from "../App";
import Sidebar from "../components/Sidebar";
import { 
  TrendingUp,
  Target,
  DollarSign,
  Calendar,
  Download
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  ReferenceLine
} from "recharts";

const GSDP = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [gsdpData, setGsdpData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!role) {
      navigate("/");
      return;
    }
    fetchGSDP();
  }, [role, navigate]);

  const fetchGSDP = async () => {
    try {
      const response = await axios.get(`${API}/gsdp`);
      setGsdpData(response.data);
    } catch (error) {
      console.error("Error fetching GSDP data:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = gsdpData.map(d => ({
    year: d.financial_year.replace('20', "'"),
    gsdp_lakh_cr: d.gsdp_lakh_cr,
    gsdp_usd_bn: d.gsdp_usd_bn,
    type: d.data_type,
    fullYear: d.financial_year,
    notes: d.notes
  }));

  const currentGSDP = gsdpData.find(d => d.data_type === "Current");
  const target2036 = gsdpData.find(d => d.financial_year === "2035-36");
  const target2047 = gsdpData.find(d => d.financial_year === "2046-47");

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
      <main className="main-content flex-1" data-testid="gsdp-page">
        {/* Header */}
        <header className="header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">GSDP & Economic Trajectory</h1>
              <p className="text-sm text-slate-500">Odisha's economic growth path towards $500B (2036) and $1.5T (2047)</p>
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
                <DollarSign className="w-5 h-5 text-[#F26522]" />
                <span className="text-sm text-slate-500">Current GSDP</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">₹{currentGSDP?.gsdp_lakh_cr || 10.63}L Cr</p>
              <p className="text-sm text-slate-500">~${currentGSDP?.gsdp_usd_bn || 120}B</p>
            </div>
            <div className="kpi-card border-l-4 border-[#F26522]">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-[#F26522]" />
                <span className="text-sm text-slate-500">Vision 2036</span>
              </div>
              <p className="text-2xl font-bold text-[#F26522]">₹46L Cr</p>
              <p className="text-sm text-slate-500">$500 Billion</p>
            </div>
            <div className="kpi-card border-l-4 border-[#1E3A8A]">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-[#1E3A8A]" />
                <span className="text-sm text-slate-500">Vision 2047</span>
              </div>
              <p className="text-2xl font-bold text-[#1E3A8A]">₹125L Cr</p>
              <p className="text-sm text-slate-500">$1.5 Trillion</p>
            </div>
            <div className="kpi-card border-l-4 border-emerald-500">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-500">Required CAGR</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">~12%</p>
              <p className="text-sm text-slate-500">Nominal growth</p>
            </div>
          </div>

          {/* Main Chart */}
          <div className="chart-container">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 font-['Outfit']">GSDP Growth Trajectory (USD Billion)</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#F26522] rounded-full"></div>
                  <span className="text-slate-600">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#1E3A8A] rounded-full"></div>
                  <span className="text-slate-600">Projected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-600">Target</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorGsdp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F26522" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F26522" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  label={{ value: 'USD Billion', angle: -90, position: 'insideLeft', fill: '#64748B' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  formatter={(value, name) => [`$${value}B`, 'GSDP']}
                  labelFormatter={(label, payload) => {
                    const item = payload[0]?.payload;
                    return `${item?.fullYear} (${item?.type})`;
                  }}
                />
                <ReferenceLine y={500} stroke="#10B981" strokeDasharray="5 5" label={{ value: '2036 Target: $500B', fill: '#10B981', fontSize: 12 }} />
                <ReferenceLine y={1500} stroke="#1E3A8A" strokeDasharray="5 5" label={{ value: '2047 Target: $1.5T', fill: '#1E3A8A', fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="gsdp_usd_bn"
                  stroke="#F26522"
                  strokeWidth={3}
                  fill="url(#colorGsdp)"
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    const color = payload.type === 'Target' ? '#10B981' : 
                                  payload.type === 'Projected' ? '#1E3A8A' : '#F26522';
                    return <circle cx={cx} cy={cy} r={6} fill={color} stroke="#fff" strokeWidth={2} />;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="table-responsive">
              <table className="data-table" data-testid="gsdp-table">
                <thead>
                  <tr>
                    <th>Financial Year</th>
                    <th>Type</th>
                    <th>GSDP (₹ Lakh Cr)</th>
                    <th>GSDP (USD Bn)</th>
                    <th>YoY Change</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {gsdpData.map((data) => (
                    <tr key={data.id} className="hover:bg-slate-50">
                      <td className="font-medium text-slate-900">{data.financial_year}</td>
                      <td>
                        <Badge 
                          variant="outline" 
                          className={
                            data.data_type === 'Actual' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            data.data_type === 'Current' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            data.data_type === 'Target' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-slate-50 text-slate-700 border-slate-200'
                          }
                        >
                          {data.data_type}
                        </Badge>
                      </td>
                      <td className="font-medium">{data.gsdp_lakh_cr ? `₹${data.gsdp_lakh_cr}L Cr` : '-'}</td>
                      <td className="font-medium text-[#1E3A8A]">${data.gsdp_usd_bn}B</td>
                      <td>
                        {data.yoy_change ? (
                          <span className={data.yoy_change.includes('+') || data.yoy_change.includes('↑') ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                            {data.yoy_change}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="text-sm text-slate-500">{data.notes}</td>
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

export default GSDP;
