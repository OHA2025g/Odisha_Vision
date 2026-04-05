import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useRole } from "../contexts/RoleContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLang } from "../contexts/LangContext";
import {
  LayoutDashboard, FolderKanban, MapPin, Target, Wallet, Bell,
  TrendingUp, FileText, Layers, LogOut, ChevronRight, Crown,
  Briefcase, FileText as FileIcon, ClipboardList, Menu, X,
  Settings, GitCompareArrows, Sun, Moon, Languages
} from "lucide-react";

const roleConfig = {
  cm: { titleKey: "chief_minister", icon: Crown, color: "#F26522" },
  ps: { titleKey: "principal_secretary", icon: Briefcase, color: "#F26522" },
  ds: { titleKey: "deputy_secretary", icon: FileIcon, color: "#F26522" },
  dc: { titleKey: "district_collector", icon: MapPin, color: "#F26522" },
  pm: { titleKey: "programme_manager", icon: ClipboardList, color: "#F26522" }
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { role, logout } = useRole();
  const { dark, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const currentRole = roleConfig[role] || roleConfig.cm;
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { path: "/programs", labelKey: "flagship_programs", icon: FolderKanban },
    { path: "/districts", labelKey: "district_performance", icon: MapPin },
    { path: "/compare", labelKey: "compare_districts", icon: GitCompareArrows },
    { path: "/kpis", labelKey: "kpis_outcomes", icon: Target },
    { path: "/budget", labelKey: "budget_utilization", icon: Wallet },
    { path: "/alerts", labelKey: "ai_alerts", icon: Bell },
    { path: "/notifications", labelKey: "notifications", icon: Bell },
    { path: "/gsdp", labelKey: "gsdp_trends", icon: TrendingUp },
    { path: "/schemes", labelKey: "schemes_master", icon: FileText },
    { path: "/sectors", labelKey: "sectors_goals", icon: Layers },
    { path: "/admin", labelKey: "admin_panel", icon: Settings },
  ];

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <aside
      className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] flex-col bg-[#1E3A8A] text-white transition-all duration-300 dark:bg-slate-950 ${
        collapsed ? "w-20" : "w-64"
      }`}
      data-testid="sidebar"
    >
      {/* Logo — links to public homepage */}
      <div className="border-b border-white/10 p-4">
        <Link
          to="/"
          className={`flex items-center gap-3 rounded-lg outline-none ring-offset-2 ring-offset-[#1E3A8A] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/40 ${
            collapsed ? "justify-center" : ""
          }`}
          title="Odisha Vision home"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F26522]">
            <span className="text-lg font-bold text-white">ओ</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <h1 className="whitespace-nowrap text-sm font-bold text-white">Odisha Vision</h1>
              <p className="whitespace-nowrap text-xs text-white/60">PMIS Dashboard</p>
            </div>
          )}
        </Link>
      </div>

      {/* Role Badge */}
      <div className={`p-4 border-b border-white/10 ${collapsed ? "px-2" : ""}`}>
        <div className={`flex items-center gap-3 p-3 bg-white/10 rounded-xl ${collapsed ? "justify-center" : ""}`}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${currentRole.color}30` }}>
            <currentRole.icon className="w-5 h-5" style={{ color: currentRole.color }} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs text-white/60">{t("logged_in_as")}</p>
              <p className="text-sm font-medium text-white truncate">{t(currentRole.titleKey)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className={`px-3 mb-2 ${collapsed ? "text-center" : ""}`}>
          <span className="text-xs text-white/40 uppercase tracking-wider">
            {collapsed ? "•••" : t("main_menu")}
          </span>
        </div>
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#F26522] text-white shadow-lg shadow-[#F26522]/30"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  } ${collapsed ? "justify-center" : ""}`
                }
                data-testid={`nav-${item.path.slice(1)}`}
                title={collapsed ? t(item.labelKey) : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-sm truncate">{t(item.labelKey)}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/10 space-y-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-2 text-white/60 hover:bg-white/10 hover:text-white rounded-xl transition-all ${collapsed ? "justify-center" : ""}`}
          data-testid="theme-toggle"
          title={dark ? t("light_mode") : t("dark_mode")}
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!collapsed && <span className="text-sm">{dark ? t("light_mode") : t("dark_mode")}</span>}
        </button>

        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className={`w-full flex items-center gap-3 px-3 py-2 text-white/60 hover:bg-white/10 hover:text-white rounded-xl transition-all ${collapsed ? "justify-center" : ""}`}
          data-testid="lang-toggle"
          title={lang === "en" ? "ଓଡ଼ିଆ" : "English"}
        >
          <Languages className="w-5 h-5" />
          {!collapsed && <span className="text-sm">{lang === "en" ? "ଓଡ଼ିଆ" : "English"}</span>}
        </button>

        {/* Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-3 px-3 py-2 text-white/60 hover:bg-white/10 hover:text-white rounded-xl transition-all ${collapsed ? "justify-center" : ""}`}
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {!collapsed && <span className="text-sm">{t("collapse_menu")}</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 text-white/60 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all ${collapsed ? "justify-center" : ""}`}
          data-testid="logout-btn"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm">{t("switch_role")}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
