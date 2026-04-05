import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MapContainer, GeoJSON, CircleMarker, useMap, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, TrendingUp, ArrowRight, Building2, Target, Users } from "lucide-react";

const GEOJSON_TO_DB_NAME = {
  Anugul: "Angul", Balangir: "Bolangir", Baleshwar: "Balasore",
  Jagatsinghapur: "Jagatsinghpur", Jajapur: "Jajpur", Kendujhar: "Keonjhar",
  Khordha: "Khurda", Sonepur: "Subarnapur",
};
const getDbName = (n) => GEOJSON_TO_DB_NAME[n] || n;

function getCentroid(feature) {
  const coords = [];
  const extract = (g) => {
    if (g.type === "Polygon") g.coordinates[0].forEach((c) => coords.push(c));
    else if (g.type === "MultiPolygon") g.coordinates.forEach((p) => p[0].forEach((c) => coords.push(c)));
  };
  extract(feature.geometry);
  if (!coords.length) return [20.5, 84.4];
  return [coords.reduce((s, c) => s + c[1], 0) / coords.length, coords.reduce((s, c) => s + c[0], 0) / coords.length];
}

const getScoreColor = (score) => {
  if (score >= 70) return "#10B981";
  if (score >= 50) return "#3B82F6";
  if (score >= 35) return "#F59E0B";
  return "#EF4444";
};

function FitBounds({ geoData }) {
  const map = useMap();
  useEffect(() => {
    if (geoData) map.fitBounds([[17.78, 81.28], [22.57, 87.53]], { padding: [30, 30], animate: false });
  }, [geoData, map]);
  return null;
}

const LandingMapSection = ({ onExploreDashboard }) => {
  const [geoData, setGeoData] = useState(null);
  const [stateOutline, setStateOutline] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const BACKEND = process.env.REACT_APP_BACKEND_URL;
    Promise.all([
      fetch("/data/odisha-districts.geojson").then((r) => r.json()),
      fetch("/data/odisha-state-outline.geojson").then((r) => r.json()),
      fetch(`${BACKEND}/api/districts`).then((r) => r.json()),
    ]).then(([geo, outline, dist]) => {
      setGeoData(geo);
      setStateOutline(outline);
      setDistricts(dist);
      if (dist.length) setSelected(dist[0]);
    }).catch(console.error);
  }, []);

  const districtLookup = useMemo(() => {
    const m = {};
    districts.forEach((d) => (m[d.name.toLowerCase()] = d));
    return m;
  }, [districts]);

  const markers = useMemo(() => {
    if (!geoData) return [];
    return geoData.features.map((f) => {
      const gName = f.properties.district_name;
      const dbName = getDbName(gName);
      const data = districtLookup[dbName.toLowerCase()];
      return { centroid: getCentroid(f), name: dbName, data };
    });
  }, [geoData, districtLookup]);

  const stats = useMemo(() => ({
    total: districts.length,
    avgScore: districts.length ? Math.round(districts.reduce((s, d) => s + d.vision_score, 0) / districts.length) : 0,
    onTrack: districts.filter((d) => d.status === "On-track").length,
  }), [districts]);

  const outlineStyle = useCallback(() => ({
    fillColor: "transparent", fillOpacity: 0, weight: 2.5, color: "#93C5FD", opacity: 0.6,
  }), []);

  const districtBorderStyle = useCallback(() => ({
    fillColor: "transparent", fillOpacity: 0, weight: 0.8, color: "#BFDBFE", opacity: 0.5,
  }), []);

  if (!geoData) return null;

  return (
    <section className="py-20 px-6 bg-white" id="map">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F26522]/10 rounded-full mb-4">
            <MapPin className="w-4 h-4 text-[#F26522]" />
            <span className="text-sm font-medium text-[#F26522]">Performance Map</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Odisha District Performance</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Vision score tracking across 30 districts - click any district to view insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-testid="landing-map-section">
          {/* Map Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50 border border-blue-100 rounded-2xl p-4 relative overflow-hidden">
            {/* Soft radial glow */}
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-pink-200/20 rounded-full blur-[100px] pointer-events-none" />

            <MapContainer
              center={[20.5, 84.4]}
              zoom={7}
              scrollWheelZoom={false}
              dragging={false}
              zoomControl={false}
              attributionControl={false}
              className="rounded-xl"
              style={{ height: "720px", width: "100%", background: "transparent" }}
            >
              {/* Faint district boundaries */}
              <GeoJSON data={geoData} style={districtBorderStyle} interactive={false} />
              {/* State outline */}
              {stateOutline && <GeoJSON data={stateOutline} style={outlineStyle} interactive={false} />}

              {/* Colored dot markers */}
              {markers.map((m) => {
                const score = m.data?.vision_score ?? 0;
                const isSelected = selected && m.name.toLowerCase() === selected.name.toLowerCase();
                return (
                  <CircleMarker
                    key={m.name}
                    center={m.centroid}
                    radius={isSelected ? 12 : 9}
                    pathOptions={{
                      fillColor: getScoreColor(score),
                      color: isSelected ? "#1E3A8A" : "#FFFFFF",
                      weight: isSelected ? 3 : 2,
                      fillOpacity: 0.9,
                      opacity: 1,
                    }}
                    eventHandlers={{
                      click: () => m.data && setSelected(m.data),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -8]} className="district-tooltip">
                      <strong>{m.name}</strong>: {score}
                    </Tooltip>
                  </CircleMarker>
                );
              })}

              <FitBounds geoData={geoData} />
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-800 mb-2.5">Vision Score</p>
              <div className="space-y-1.5">
                {[
                  { color: "#10B981", label: "70+ Excellent" },
                  { color: "#3B82F6", label: "50-69 Good" },
                  { color: "#F59E0B", label: "35-49 Average" },
                  { color: "#EF4444", label: "<35 Needs Focus" },
                ].map((i) => (
                  <div key={i.label} className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: i.color }} />
                    <span className="text-[11px] text-slate-600">{i.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-5">
            {/* District Insights Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" data-testid="district-insights-card">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-[#F26522]/10 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-[#F26522]" />
                </div>
                <h3 className="text-base font-bold text-slate-900">District Vision Insights</h3>
              </div>

              {selected ? (
                <>
                  <h4 className="text-2xl font-bold text-slate-900 mb-3">{selected.name}</h4>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="px-3 py-1 bg-blue-50 text-[#1E3A8A] text-xs font-medium rounded-full border border-blue-100">
                      {selected.status}
                    </span>
                    <span className="px-3 py-1 bg-[#F26522]/10 text-[#F26522] text-xs font-medium rounded-full border border-[#F26522]/20">
                      Score: {selected.vision_score}
                    </span>
                  </div>

                  <div className="space-y-3.5 mb-6">
                    {[
                      { label: "People First", value: selected.people_first_score },
                      { label: "Rural Power", value: selected.rural_power_score },
                      { label: "Prosperity", value: selected.prosperity_score },
                      { label: "Tech Lead", value: selected.tech_lead_score },
                      { label: "Governance", value: selected.governance_score },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                        <span className="text-sm text-slate-600">{row.label}</span>
                        <span className="text-sm font-bold text-slate-900">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={onExploreDashboard}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #F26522 0%, #1E3A8A 100%)" }}
                    data-testid="view-district-report-btn"
                  >
                    View District Report
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <p className="text-sm text-slate-400 py-8 text-center">Click a district on the map</p>
              )}
            </div>

            {/* State Overview Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" data-testid="state-overview-card">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#1E3A8A]" />
                </div>
                <h3 className="text-base font-bold text-slate-900">State Overview</h3>
              </div>
              <div className="space-y-3.5">
                {[
                  { label: "Total Districts", value: stats.total },
                  { label: "Avg Vision Score", value: `${stats.avgScore}%` },
                  { label: "Districts On Track", value: stats.onTrack },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-600">{row.label}</span>
                    <span className="text-sm font-bold text-slate-900">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingMapSection;
