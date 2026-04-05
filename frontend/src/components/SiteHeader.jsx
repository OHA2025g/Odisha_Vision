import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Users,
  Wheat,
  Building2,
  Cpu,
  Landmark,
  Shield,
  FolderKanban,
  MapPin,
  Target,
  Wallet,
  Bell,
  TrendingUp,
  FileText,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRole } from "@/contexts/RoleContext";
import { useRoleModal } from "@/contexts/RoleModalContext";

const navItems = [
  { label: "Home", to: "/" },
  {
    label: "Vision Initiatives",
    hasDropdown: true,
    items: [
      { label: "People First", desc: "Health, education, women welfare", icon: Users, route: "/pillars/people-first" },
      { label: "Rural Power", desc: "Agriculture, irrigation, employment", icon: Wheat, route: "/pillars/rural-power" },
      { label: "Prosperity", desc: "Industry, MSME, infrastructure", icon: Building2, route: "/pillars/prosperity" },
      { label: "Tech Lead", desc: "AI governance, GCC, digital services", icon: Cpu, route: "/pillars/tech-lead" },
      { label: "Legacy", desc: "Culture, tourism, sports, heritage", icon: Landmark, route: "/pillars/legacy" },
      { label: "Governance", desc: "Citizen services, disaster management", icon: Shield, route: "/pillars/governance" },
    ],
  },
  {
    label: "Dashboards",
    hasDropdown: true,
    items: [
      { label: "36 Flagship Programs", desc: "Program tracking & milestones", icon: FolderKanban, route: "/programs" },
      { label: "District Performance", desc: "30 district vision scores", icon: MapPin, route: "/districts" },
      { label: "KPIs & Outcomes", desc: "Key performance indicators", icon: Target, route: "/kpis" },
      { label: "Budget Utilization", desc: "Department-wise budget tracking", icon: Wallet, route: "/budget" },
      { label: "AI Alerts", desc: "Risk alerts & remedies", icon: Bell, route: "/alerts" },
      { label: "GSDP Trends", desc: "Economic growth trajectory", icon: TrendingUp, route: "/gsdp" },
      { label: "Schemes Master", desc: "All government schemes", icon: FileText, route: "/schemes" },
      { label: "Sectors & Goals", desc: "Pillar-wise sectors", icon: Layers, route: "/sectors" },
    ],
  },
  { label: "Objective", route: "/vision-metrics" },
  { label: "Odisha Map", href: "/#map" },
  { label: "Schemes & News", href: "/#schemes" },
  { label: "Partners", href: "/#partners" },
];

function NavDropdown({ item, navigate, openRoleModal }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleItemClick = (sub) => {
    setOpen(false);
    if (!sub.route) return;
    if (sub.route.startsWith("/pillars")) {
      navigate(sub.route);
      return;
    }
    const currentRole = localStorage.getItem("userRole");
    if (!currentRole) openRoleModal();
    else navigate(sub.route);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1E3A8A]"
        data-testid={`nav-dropdown-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {item.label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white py-2 shadow-xl duration-200">
          {item.items.map((sub, i) => {
            const Icon = sub.icon;
            const pillarLink = sub.route?.startsWith("/pillars");
            if (sub.route) {
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleItemClick(sub)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                  data-testid={`dropdown-item-${sub.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      pillarLink ? "bg-[#F26522]/10" : "bg-[#1E3A8A]/10"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${pillarLink ? "text-[#F26522]" : "text-[#1E3A8A]"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{sub.label}</p>
                    <p className="text-xs text-slate-500">{sub.desc}</p>
                  </div>
                </button>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const navigate = useNavigate();
  const { role } = useRole();
  const { openRoleModal } = useRoleModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const goDashboard = () => {
    if (role) navigate("/dashboard");
    else openRoleModal();
  };

  const goProtectedRoute = (path) => {
    const currentRole = localStorage.getItem("userRole");
    if (!currentRole) openRoleModal();
    else navigate(path);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link to="/" className="flex min-w-0 shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F26522]">
              <span className="text-lg font-bold text-white">ओ</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight text-slate-900">Odisha Vision</p>
              <p className="text-xs leading-tight text-slate-500">Planning &amp; Convergence Dept.</p>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-0.5 px-2 lg:flex xl:gap-1">
            {navItems.map((item, index) =>
              item.hasDropdown ? (
                <NavDropdown key={index} item={item} navigate={navigate} openRoleModal={openRoleModal} />
              ) : item.route ? (
                <button
                  key={index}
                  type="button"
                  onClick={() => goProtectedRoute(item.route)}
                  className="whitespace-nowrap rounded-lg px-2 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1E3A8A] xl:px-3"
                >
                  {item.label}
                </button>
              ) : item.to ? (
                <Link
                  key={index}
                  to={item.to}
                  className="whitespace-nowrap rounded-lg px-2 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1E3A8A] xl:px-3"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={index}
                  href={item.href}
                  className="whitespace-nowrap rounded-lg px-2 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1E3A8A] xl:px-3"
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          <div className="hidden shrink-0 items-center gap-2 sm:gap-3 lg:flex">
            <Button type="button" onClick={goDashboard} className="bg-[#F26522] px-4 text-white hover:bg-[#F26522]/90">
              View Dashboard
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
              onClick={openRoleModal}
            >
              Sign In
            </Button>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white py-4 shadow-lg lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4">
            {navItems.map((item, index) =>
              item.hasDropdown ? (
                <div key={index}>
                  <button
                    type="button"
                    onClick={() => setMobileExpanded(mobileExpanded === index ? null : index)}
                    className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1E3A8A]"
                  >
                    {item.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${mobileExpanded === index ? "rotate-180" : ""}`} />
                  </button>
                  {mobileExpanded === index && (
                    <div className="mb-2 space-y-1 pl-4">
                      {item.items.map((sub, si) => {
                        const Icon = sub.icon;
                        if (sub.route) {
                          return (
                            <button
                              key={si}
                              type="button"
                              onClick={() => {
                                if (sub.route.startsWith("/pillars")) {
                                  navigate(sub.route);
                                } else {
                                  const r = localStorage.getItem("userRole");
                                  if (!r) openRoleModal();
                                  else navigate(sub.route);
                                }
                                setMobileMenuOpen(false);
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"
                            >
                              <Icon
                                className={`h-4 w-4 ${sub.route.startsWith("/pillars") ? "text-[#F26522]" : "text-[#1E3A8A]"}`}
                              />
                              {sub.label}
                            </button>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              ) : item.route ? (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    goProtectedRoute(item.route);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full rounded-lg px-4 py-3 text-left text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1E3A8A]"
                >
                  {item.label}
                </button>
              ) : item.to ? (
                <Link
                  key={index}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1E3A8A]"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={index}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1E3A8A]"
                >
                  {item.label}
                </a>
              )
            )}
            <Button
              type="button"
              onClick={() => {
                goDashboard();
                setMobileMenuOpen(false);
              }}
              className="mt-4 w-full bg-[#F26522] text-white hover:bg-[#F26522]/90"
            >
              View Dashboard
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-[#1E3A8A] text-[#1E3A8A]"
              onClick={() => {
                openRoleModal();
                setMobileMenuOpen(false);
              }}
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
