import React from "react";
import { X, ArrowRight, Crown, Briefcase, FileText, MapPin, ClipboardList } from "lucide-react";

const roles = [
  { id: "cm", title: "Chief Minister", subtitle: "Strategic oversight & flagship monitoring", icon: Crown, color: "#F26522" },
  { id: "ps", title: "Principal Secretary", subtitle: "Departmental coordination & policy", icon: Briefcase, color: "#F26522" },
  { id: "ds", title: "Deputy Secretary", subtitle: "Operational monitoring & KPIs", icon: FileText, color: "#F26522" },
  { id: "dc", title: "District Collector", subtitle: "Field execution & district tracking", icon: MapPin, color: "#F26522" },
  { id: "pm", title: "Programme Manager", subtitle: "Project tracking & milestones", icon: ClipboardList, color: "#F26522" },
];

export default function RoleSelectModal({ open, onClose, onSelect }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Select Your Role</h2>
            <p className="text-sm text-slate-500">Choose your role to access the dashboard</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 transition-colors hover:bg-slate-100" aria-label="Close">
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" data-testid="role-selection-modal">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelect(role.id)}
              className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-5 text-left transition-all hover:border-[#F26522]/50 hover:bg-[#F26522]/5"
              data-testid={`role-card-${role.id}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${role.color}15` }}
                >
                  <role.icon className="h-6 w-6" style={{ color: role.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-[#F26522]">
                    {role.title}
                  </h3>
                  <p className="text-xs text-slate-500">{role.subtitle}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-[#F26522]" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
