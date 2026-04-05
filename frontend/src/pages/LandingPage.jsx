import React from "react";
import { Link } from "react-router-dom";
import LandingMapSection from "../components/LandingMapSection";
import { useRoleModal } from "../contexts/RoleModalContext";
import {
  ArrowRight,
  Target,
  TrendingUp,
  Users,
  Building2,
  Play,
  MapPin,
  FileText,
  Landmark,
  Cpu,
  Shield,
  Wheat,
  MousePointer,
  ExternalLink,
} from "lucide-react";
import { Button } from "../components/ui/button";

const stats = [
  { label: "Flagship Programs", value: "36", icon: Target },
  { label: "Districts Covered", value: "30", icon: MapPin },
  { label: "Budget Allocation", value: "₹2.16L Cr", icon: Building2 },
  { label: "Beneficiaries", value: "4.2Cr", icon: Users }
];

const pillars = [
  { name: "People First", slug: "people-first", icon: Users, color: "#F26522" },
  { name: "Rural Power", slug: "rural-power", icon: Wheat, color: "#10B981" },
  { name: "Prosperity", slug: "prosperity", icon: Building2, color: "#3B82F6" },
  { name: "Tech Lead", slug: "tech-lead", icon: Cpu, color: "#8B5CF6" },
  { name: "Legacy", slug: "legacy", icon: Landmark, color: "#F59E0B" },
  { name: "Governance", slug: "governance", icon: Shield, color: "#1E3A8A" },
];

const newsArticles = [
  {
    tag: "Flagship Program",
    date: "January 2026",
    title: "Subhadra Yojana Reaches 1.04 Crore Women",
    description: "Women empowerment scheme provides ₹10,000 direct benefit transfer to eligible women across Odisha.",
    link: "https://subhadra.odisha.gov.in/",
  },
  {
    tag: "Economic Growth",
    date: "January 2026",
    title: "GSDP Crosses ₹10.63 Lakh Crore Mark",
    description: "Odisha's economy shows strong growth trajectory, on track for $500B target by 2036.",
    link: "https://planning.odisha.gov.in/",
  },
  {
    tag: "Infrastructure",
    date: "January 2026",
    title: "BCPPER Metro Region Development Initiated",
    description: "Bhubaneswar-Cuttack metro region transformation project begins with 7000 sq km development plan.",
    link: "https://hudodisha.gov.in/",
  },
];

const LandingPage = () => {
  const { openRoleModal } = useRoleModal();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 px-6 pb-20 pt-12 sm:pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#F26522]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#1E3A8A]/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-slate-900">Odisha </span>
            <span className="text-[#F26522]">Vision 2036</span>
            <br />
            <span className="text-slate-900">& </span>
            <span className="text-[#1E3A8A]">2047</span>
            <span className="text-slate-900"> Portal</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 mb-4 font-medium">
            Viksit Odisha Through Data-Driven Governance
          </p>

          {/* Description */}
          <p className="text-base text-slate-500 mb-10 max-w-3xl mx-auto leading-relaxed">
            Comprehensive monitoring of 36 flagship programmes across six strategic pillars, 
            tracking progress towards a $500B economy by 2036 and $1.5T by 2047.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              onClick={openRoleModal}
              size="lg"
              className="bg-[#F26522] hover:bg-[#F26522]/90 text-white px-8 py-6 text-lg rounded-xl group shadow-lg shadow-[#F26522]/20"
              data-testid="explore-dashboard-btn"
            >
              Explore PMIS Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white px-8 py-6 text-lg rounded-xl"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="stats-cards">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#F26522]/30 transition-all"
              >
                <stat.icon className="w-8 h-8 text-[#1E3A8A] mx-auto mb-3" />
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <MousePointer className="w-6 h-6 text-slate-400" />
        </div>
      </section>

      {/* Six Pillars Section */}
      <section className="py-20 px-6 bg-[#1E3A8A]" id="objectives">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Six Strategic Pillars</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Comprehensive framework driving Odisha's transformation through focused development areas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {pillars.map((pillar, index) => (
              <Link
                key={index}
                to={`/pillars/${pillar.slug}`}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5 text-center hover:bg-white/20 hover:border-[#F26522]/50 transition-all cursor-pointer group block"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110 bg-white/20">
                  <pillar.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white">{pillar.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Odisha Performance Map Section */}
      <LandingMapSection onExploreDashboard={openRoleModal} />

      {/* Schemes & Updates Section */}
      <section className="py-20 px-6 bg-slate-50" id="schemes">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Vision Schemes & Updates</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Stay informed about Odisha's flagship programmes, scheme updates, and development milestones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsArticles.map((news, index) => (
              <div 
                key={index}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#F26522]/30 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#F26522]/10 text-[#F26522] text-xs font-medium rounded-full">
                    {news.tag}
                  </span>
                  <span className="text-xs text-slate-400">{news.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-[#F26522] transition-colors">
                  {news.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4">{news.description}</p>
                <a
                  href={news.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1E3A8A] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  data-testid={`news-link-${index}`}
                >
                  Read Full Story <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 px-6 bg-white" id="partners">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Strategic Partnerships</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Collaborating with organizations dedicated to Odisha's development and growth
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { value: "6", label: "Strategic Pillars" },
              { value: "₹2.16L Cr", label: "Total Budget" },
              { value: "36", label: "Flagship Programs" },
              { value: "30", label: "Districts" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-[#1E3A8A] rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-[#F26522] mb-1">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={openRoleModal}
              size="lg"
              className="bg-[#F26522] hover:bg-[#F26522]/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-[#F26522]/20"
            >
              Access Vision Portal
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#1E3A8A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F26522] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ओ</span>
            </div>
            <span className="text-white/80 text-sm">Government of Odisha - PMIS v2.1</span>
          </div>
          <span className="text-white/60 text-sm">© 2026 Planning & Convergence Department</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
