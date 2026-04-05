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
  ChevronDown,
  ChevronRight,
  Target,
  TrendingUp
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

const pillarIcons = {
  "People First": Users,
  "Rural Power": Wheat,
  "Prosperity": Building2,
  "Tech Lead": Cpu,
  "Legacy": Landmark,
  "Governance": Shield
};

const Sectors = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPillar, setExpandedPillar] = useState(null);

  useEffect(() => {
    if (!role) {
      navigate("/");
      return;
    }
    fetchPillars();
  }, [role, navigate]);

  const fetchPillars = async () => {
    try {
      const response = await axios.get(`${API}/pillars`);
      setPillars(response.data);
    } catch (error) {
      console.error("Error fetching pillars:", error);
    } finally {
      setLoading(false);
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
      <main className="main-content flex-1" data-testid="sectors-page">
        {/* Header */}
        <header className="header">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">Sectors & Strategic Goals</h1>
            <p className="text-sm text-slate-500">Six Strategic Pillars with KPIs, Schemes, and Targets</p>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Pillars Cards */}
          <div className="space-y-4" data-testid="pillars-list">
            {pillars.map((pillar) => {
              const Icon = pillarIcons[pillar.name] || Target;
              const isExpanded = expandedPillar === pillar.id;

              return (
                <div 
                  key={pillar.id}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden"
                >
                  {/* Pillar Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setExpandedPillar(isExpanded ? null : pillar.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${pillar.color}15` }}
                      >
                        <Icon className="w-7 h-7" style={{ color: pillar.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-xl font-semibold text-slate-900 font-['Outfit']">{pillar.name}</h2>
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: pillar.color }}
                          >
                            {pillar.health_score}
                          </div>
                        </div>
                        <p className="text-slate-500">{pillar.description}</p>
                        <div className="flex items-center gap-6 mt-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Budget:</span>
                            <span className="font-semibold text-slate-900">₹{(pillar.budget_allocation / 1000).toFixed(1)}K Cr</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Schemes:</span>
                            <span className="font-semibold text-slate-900">{pillar.scheme_count}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Target 2036:</span>
                            <span className="font-medium text-[#F26522]">{pillar.target_2036}</span>
                          </div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-6 h-6 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-500">Health Score</span>
                        <span className="font-medium" style={{ color: pillar.color }}>{pillar.health_score}%</span>
                      </div>
                      <Progress value={pillar.health_score} className="h-2" />
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-slate-100">
                      {/* KPIs */}
                      <div className="p-6 bg-slate-50">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-[#F26522]" />
                          Key Performance Indicators
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {pillar.kpis.map((kpi, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                              <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span className="text-sm text-slate-700">{kpi}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Schemes */}
                      <div className="p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Key Schemes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {pillar.key_schemes.map((scheme, index) => (
                            <div 
                              key={index} 
                              className="p-4 border border-slate-200 rounded-lg hover:border-[#F26522]/50 transition-colors"
                            >
                              <p className="font-medium text-slate-900">{scheme.name}</p>
                              <p className="text-sm text-[#F26522] mt-1">₹{scheme.budget.toLocaleString()} Cr</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sectors;
