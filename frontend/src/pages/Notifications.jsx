import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useRole } from "../App";
import Sidebar from "../components/Sidebar";
import { useLang } from "../contexts/LangContext";
import {
  Bell, Mail, CheckCheck, RefreshCw, AlertTriangle, Info,
  AlertCircle, Settings, ToggleLeft, ToggleRight
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

const severityConfig = {
  critical: { color: "bg-red-500", icon: AlertCircle, textColor: "text-red-700", bgColor: "bg-red-50 dark:bg-red-900/20" },
  high: { color: "bg-orange-500", icon: AlertTriangle, textColor: "text-orange-700", bgColor: "bg-orange-50 dark:bg-orange-900/20" },
  warning: { color: "bg-amber-500", icon: AlertTriangle, textColor: "text-amber-700", bgColor: "bg-amber-50 dark:bg-amber-900/20" },
  medium: { color: "bg-amber-500", icon: Info, textColor: "text-amber-700", bgColor: "bg-amber-50 dark:bg-amber-900/20" },
  low: { color: "bg-blue-500", icon: Info, textColor: "text-blue-700", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
  info: { color: "bg-slate-400", icon: Info, textColor: "text-slate-600", bgColor: "bg-slate-50 dark:bg-slate-800" },
};

const Toggle = ({ enabled, onChange, label }) => (
  <button onClick={() => onChange(!enabled)} className="flex items-center gap-3 py-2 group" data-testid={`toggle-${label.replace(/\s+/g, "-").toLowerCase()}`}>
    {enabled ? (
      <ToggleRight className="w-8 h-5 text-[#F26522]" />
    ) : (
      <ToggleLeft className="w-8 h-5 text-slate-400 group-hover:text-slate-500" />
    )}
    <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
  </button>
);

const Notifications = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const { t } = useLang();
  const [notifications, setNotifications] = useState([]);
  const [prefs, setPrefs] = useState({ email: "", alert_critical: true, alert_high: true, alert_medium: false, alert_low: false, daily_digest: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [nRes, pRes] = await Promise.all([
        axios.get(`${API}/notifications`),
        axios.get(`${API}/notification-prefs`),
      ]);
      setNotifications(nRes.data);
      setPrefs(pRes.data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!role) { navigate("/"); return; }
    fetchData();
  }, [role, navigate, fetchData]);

  const generateNotifications = async () => {
    setLoading(true);
    await axios.post(`${API}/notifications/generate`);
    await fetchData();
    showToast("Notifications generated from current alerts");
  };

  const markAllRead = async () => {
    await axios.put(`${API}/notifications/read-all`);
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    showToast("All marked as read");
  };

  const markRead = async (id) => {
    await axios.put(`${API}/notifications/${id}/read`);
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const savePrefs = async () => {
    setSaving(true);
    await axios.put(`${API}/notification-prefs`, prefs);
    setSaving(false);
    showToast("Preferences saved");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex">
      <Sidebar />
      <main className="main-content flex-1" data-testid="notifications-page">
        <header className="header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F26522] rounded-xl flex items-center justify-center relative">
                <Bell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Outfit']">{t("notifications")}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t("email_notifications")} & {t("ai_alerts")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={generateNotifications} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-300" data-testid="generate-notifications-btn">
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Generate
              </button>
              <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90 text-sm" data-testid="mark-all-read-btn">
                <CheckCheck className="w-4 h-4" /> {t("mark_all_read")}
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notification list */}
          <div className="lg:col-span-2 space-y-3">
            {notifications.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center">
                <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">{t("no_notifications")}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Click "Generate" to create notifications from current alerts</p>
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = severityConfig[n.severity] || severityConfig.info;
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.read && markRead(n.id)}
                    className={`flex gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                      n.read
                        ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60"
                        : `${cfg.bgColor} border-slate-200 dark:border-slate-700 shadow-sm`
                    }`}
                    data-testid={`notification-${n.id}`}
                  >
                    <div className={`w-10 h-10 ${cfg.color} rounded-lg flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{n.title}</h4>
                        {!n.read && <span className="w-2 h-2 bg-[#F26522] rounded-full shrink-0" />}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{n.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</span>
                        <Badge className={`text-[10px] px-1.5 py-0 ${cfg.color} text-white`}>{n.severity}</Badge>
                        <Badge className="text-[10px] px-1.5 py-0 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300">{n.type}</Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Preferences panel */}
          <div className="space-y-5">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6" data-testid="notification-prefs">
              <div className="flex items-center gap-2 mb-5">
                <Settings className="w-5 h-5 text-[#1E3A8A]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{t("notification_settings")}</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                    <Mail className="w-4 h-4 inline mr-1" /> Email Address
                  </label>
                  <Input
                    type="email"
                    value={prefs.email}
                    onChange={(e) => setPrefs({ ...prefs, email: e.target.value })}
                    placeholder="your@email.gov.in"
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    data-testid="email-input"
                  />
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t("alert_threshold")}</p>
                  <Toggle enabled={prefs.alert_critical} onChange={(v) => setPrefs({ ...prefs, alert_critical: v })} label="Critical Alerts" />
                  <Toggle enabled={prefs.alert_high} onChange={(v) => setPrefs({ ...prefs, alert_high: v })} label="High Priority Alerts" />
                  <Toggle enabled={prefs.alert_medium} onChange={(v) => setPrefs({ ...prefs, alert_medium: v })} label="Medium Priority Alerts" />
                  <Toggle enabled={prefs.alert_low} onChange={(v) => setPrefs({ ...prefs, alert_low: v })} label="Low Priority Alerts" />
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <Toggle enabled={prefs.daily_digest} onChange={(v) => setPrefs({ ...prefs, daily_digest: v })} label="Daily Email Digest" />
                </div>

                <button
                  onClick={savePrefs}
                  disabled={saving}
                  className="w-full py-2.5 bg-[#F26522] text-white rounded-lg font-medium text-sm hover:bg-[#F26522]/90 transition-colors"
                  data-testid="save-prefs-btn"
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-5">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">About Email Notifications</p>
              <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                When configured, the system sends email alerts to your inbox whenever a program's status changes to "At-risk" or "Delayed", or when AI flags a critical issue. Configure your threshold preferences above.
              </p>
            </div>
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium bg-emerald-600 text-white" data-testid="notification-toast">
            {toast}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
