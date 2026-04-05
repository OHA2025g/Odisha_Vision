import React, { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import { RoleContext } from "./contexts/RoleContext";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Programs from "./pages/Programs";
import Districts from "./pages/Districts";
import DistrictDetail from "./pages/DistrictDetail";
import KPIs from "./pages/KPIs";
import Budget from "./pages/Budget";
import Alerts from "./pages/Alerts";
import GSDP from "./pages/GSDP";
import Schemes from "./pages/Schemes";
import Sectors from "./pages/Sectors";
import Admin from "./pages/Admin";
import CompareDistricts from "./pages/CompareDistricts";
import Notifications from "./pages/Notifications";
import VisionMetrics from "./pages/VisionMetrics";
import PillarsIndex from "./pages/PillarsIndex";
import PillarPage from "./pages/PillarPage";
import AppLayout from "./components/AppLayout";

export { useRole, RoleContext } from "./contexts/RoleContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8001";
export const API = `${BACKEND_URL.replace(/\/$/, "")}/api`;

function App() {
  const [role, setRole] = useState(localStorage.getItem('userRole') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const seedDatabase = async () => {
      try {
        await axios.post(`${API}/init`, {}, { timeout: 12000 });
      } catch (error) {
        if (!cancelled) {
          console.log("Database already seeded or error:", error.message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    seedDatabase();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem('userRole', selectedRole);
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('userRole');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F26522] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading Odisha Vision 2047...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LangProvider>
        <RoleContext.Provider value={{ role, selectRole, logout }}>
          <div className="App">
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  {/* "/" is always the public marketing home; dashboard lives at /dashboard */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/districts" element={<Districts />} />
                  <Route path="/districts/:name" element={<DistrictDetail />} />
                  <Route path="/kpis" element={<KPIs />} />
                  <Route path="/budget" element={<Budget />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/gsdp" element={<GSDP />} />
                  <Route path="/schemes" element={<Schemes />} />
                  <Route path="/sectors" element={<Sectors />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/compare" element={<CompareDistricts />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/vision-metrics" element={<VisionMetrics />} />
                  <Route path="/pillars" element={<PillarsIndex />} />
                  <Route path="/pillars/:slug" element={<PillarPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </div>
        </RoleContext.Provider>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;
