import React, { createContext, useContext, useState, useCallback } from "react";

const LangContext = createContext();
export const useLang = () => useContext(LangContext);

const translations = {
  en: {
    // Nav & Sidebar
    dashboard: "Dashboard",
    flagship_programs: "36 Flagship Programs",
    district_performance: "District Performance",
    kpis_outcomes: "KPIs & Outcomes",
    budget_utilization: "Budget Utilization",
    ai_alerts: "AI Alerts",
    gsdp_trends: "GSDP Trends",
    schemes_master: "Schemes Master",
    sectors_goals: "Sectors & Goals",
    admin_panel: "Admin Panel",
    compare_districts: "Compare Districts",
    notifications: "Notifications",
    vision_metrics: "Vision 2047 Metrics",
    collapse_menu: "Collapse Menu",
    switch_role: "Switch Role",
    logged_in_as: "Logged in as",
    main_menu: "Main Menu",
    // Roles
    chief_minister: "Chief Minister",
    principal_secretary: "Principal Secretary",
    deputy_secretary: "Deputy Secretary",
    district_collector: "District Collector",
    programme_manager: "Programme Manager",
    // Dashboard
    total_pillars: "Total Pillars",
    total_programs: "Total Programs",
    total_districts: "Total Districts",
    total_schemes: "Total Schemes",
    active_alerts: "Active Alerts",
    programs_on_track: "On Track",
    programs_at_risk: "At Risk",
    programs_delayed: "Delayed",
    beneficiaries: "Beneficiaries",
    six_pillars: "Six Strategic Pillars",
    // Common
    search: "Search",
    export: "Export",
    status: "Status",
    progress: "Progress",
    budget: "Budget",
    score: "Score",
    name: "Name",
    pillar: "Pillar",
    district: "District",
    vision_score: "Vision Score",
    view_details: "View Details",
    back: "Back",
    save: "Save",
    cancel: "Cancel",
    // Compare
    select_districts: "Select Districts to Compare",
    comparison_view: "District Comparison",
    add_district: "Add District",
    // Notifications
    notification_settings: "Notification Settings",
    email_notifications: "Email Notifications",
    alert_threshold: "Alert Threshold",
    no_notifications: "No notifications yet",
    mark_all_read: "Mark All Read",
    // Theme
    dark_mode: "Dark Mode",
    light_mode: "Light Mode",
    // Language
    language: "Language",
  },
  od: {
    // Nav & Sidebar
    dashboard: "ଡ୍ୟାସବୋର୍ଡ",
    flagship_programs: "୩୬ ଫ୍ଲାଗସିପ୍ ପ୍ରୋଗ୍ରାମ",
    district_performance: "ଜିଲ୍ଲା ପ୍ରଦର୍ଶନ",
    kpis_outcomes: "କେପିଆଇ ଏବଂ ଫଳାଫଳ",
    budget_utilization: "ବଜେଟ୍ ବ୍ୟବହାର",
    ai_alerts: "ଏଆଇ ଆଲର୍ଟ",
    gsdp_trends: "ଜିଏସଡିପି ଧାରା",
    schemes_master: "ଯୋଜନା ମାଷ୍ଟର",
    sectors_goals: "ସେକ୍ଟର ଏବଂ ଲକ୍ଷ୍ୟ",
    admin_panel: "ଆଡମିନ ପ୍ୟାନେଲ",
    compare_districts: "ଜିଲ୍ଲା ତୁଳନା",
    notifications: "ସୂଚନା",
    vision_metrics: "ଭିଜନ୍ ୨୦୪୭ ମେଟ୍ରିକ୍ସ",
    collapse_menu: "ମେନୁ ବନ୍ଦ",
    switch_role: "ଭୂମିକା ବଦଳାନ୍ତୁ",
    logged_in_as: "ଲଗ ଇନ୍",
    main_menu: "ମୁଖ୍ୟ ମେନୁ",
    // Roles
    chief_minister: "ମୁଖ୍ୟମନ୍ତ୍ରୀ",
    principal_secretary: "ପ୍ରଧାନ ସଚିବ",
    deputy_secretary: "ଉପ ସଚିବ",
    district_collector: "ଜିଲ୍ଲାପାଳ",
    programme_manager: "କାର୍ଯ୍ୟକ୍ରମ ପରିଚାଳକ",
    // Dashboard
    total_pillars: "ମୋଟ ସ୍ତମ୍ଭ",
    total_programs: "ମୋଟ କାର୍ଯ୍ୟକ୍ରମ",
    total_districts: "ମୋଟ ଜିଲ୍ଲା",
    total_schemes: "ମୋଟ ଯୋଜନା",
    active_alerts: "ସକ୍ରିୟ ଆଲର୍ଟ",
    programs_on_track: "ଟ୍ରାକରେ",
    programs_at_risk: "ବିପଦରେ",
    programs_delayed: "ବିଳମ୍ବ",
    beneficiaries: "ହିତାଧିକାରୀ",
    six_pillars: "ଛଅଟି ରଣନୀତିକ ସ୍ତମ୍ଭ",
    // Common
    search: "ସନ୍ଧାନ",
    export: "ରପ୍ତାନି",
    status: "ସ୍ଥିତି",
    progress: "ଅଗ୍ରଗତି",
    budget: "ବଜେଟ୍",
    score: "ସ୍କୋର",
    name: "ନାମ",
    pillar: "ସ୍ତମ୍ଭ",
    district: "ଜିଲ୍ଲା",
    vision_score: "ଭିଜନ୍ ସ୍କୋର",
    view_details: "ବିବରଣୀ ଦେଖନ୍ତୁ",
    back: "ପଛକୁ",
    save: "ସେଭ୍",
    cancel: "ବାତିଲ",
    // Compare
    select_districts: "ତୁଳନା ପାଇଁ ଜିଲ୍ଲା ବାଛନ୍ତୁ",
    comparison_view: "ଜିଲ୍ଲା ତୁଳନା",
    add_district: "ଜିଲ୍ଲା ଯୋଡନ୍ତୁ",
    // Notifications
    notification_settings: "ସୂଚନା ସେଟିଂ",
    email_notifications: "ଇମେଲ ସୂଚନା",
    alert_threshold: "ଆଲର୍ଟ ସୀମା",
    no_notifications: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସୂଚନା ନାହିଁ",
    mark_all_read: "ସବୁ ପଢ଼ାଯାଇଛି",
    // Theme
    dark_mode: "ଡାର୍କ ମୋଡ",
    light_mode: "ଲାଇଟ ମୋଡ",
    // Language
    language: "ଭାଷା",
  },
};

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "od" : "en";
      localStorage.setItem("lang", next);
      return next;
    });
  }, []);

  const t = useCallback((key) => translations[lang]?.[key] || translations.en[key] || key, [lang]);

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
};
