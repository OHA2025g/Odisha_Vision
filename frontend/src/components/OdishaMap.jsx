import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MapContainer, GeoJSON, useMap, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Name mapping: GeoJSON district_name -> DB district name
const GEOJSON_TO_DB_NAME = {
  "Anugul": "Angul",
  "Balangir": "Bolangir",
  "Baleshwar": "Balasore",
  "Jagatsinghapur": "Jagatsinghpur",
  "Jajapur": "Jajpur",
  "Kendujhar": "Keonjhar",
  "Khordha": "Khurda",
  "Sonepur": "Subarnapur",
};

const getDbName = (geojsonName) => GEOJSON_TO_DB_NAME[geojsonName] || geojsonName;

const getScoreColor = (score) => {
  if (score >= 70) return "#059669";
  if (score >= 50) return "#D97706";
  if (score >= 30) return "#EA580C";
  return "#DC2626";
};

// Calculate centroid of a GeoJSON feature
function getCentroid(feature) {
  const coords = [];
  const extractCoords = (geometry) => {
    if (geometry.type === "Polygon") {
      geometry.coordinates[0].forEach((c) => coords.push(c));
    } else if (geometry.type === "MultiPolygon") {
      geometry.coordinates.forEach((poly) =>
        poly[0].forEach((c) => coords.push(c))
      );
    }
  };
  extractCoords(feature.geometry);
  if (coords.length === 0) return [20.5, 84.4];
  const sumLat = coords.reduce((s, c) => s + c[1], 0);
  const sumLng = coords.reduce((s, c) => s + c[0], 0);
  return [sumLat / coords.length, sumLng / coords.length];
}

// Create star marker icon
function createStarIcon() {
  return L.divIcon({
    html: `<svg width="16" height="16" viewBox="0 0 24 24" fill="#2E7D32" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>`,
    className: "star-marker",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

// Create label icon for district name
function createLabelIcon(name, isCapital) {
  const fontSize = isCapital ? "12px" : "10px";
  const fontWeight = isCapital ? "bold" : "600";
  const bgColor = isCapital ? "#E3F2FD" : "#E8F5E9";
  const borderColor = isCapital ? "#1565C0" : "#66BB6A";
  const textColor = isCapital ? "#0D47A1" : "#1B5E20";
  const padding = isCapital ? "3px 8px" : "2px 6px";

  return L.divIcon({
    html: `<div style="
      background:${bgColor};
      border:1px solid ${borderColor};
      border-radius:4px;
      padding:${padding};
      font-size:${fontSize};
      font-weight:${fontWeight};
      color:${textColor};
      white-space:nowrap;
      font-family:'Outfit',sans-serif;
      box-shadow:0 1px 3px rgba(0,0,0,0.12);
      line-height:1.2;
    ">${name}${isCapital ? '<br/><span style="font-size:9px;color:#1565C0;font-weight:400">Capital</span>' : ''}</div>`,
    className: "district-label-icon",
    iconSize: null,
    iconAnchor: isCapital ? [40, -8] : [30, -6],
  });
}

function FitBounds({ geoData }) {
  const map = useMap();
  useEffect(() => {
    if (geoData) {
      // Tight bounds around Odisha
      map.fitBounds(
        [
          [17.78, 81.28],
          [22.57, 87.53],
        ],
        { padding: [10, 10], animate: false }
      );
    }
  }, [geoData, map]);
  return null;
}

const OdishaMap = ({ districts, onDistrictSelect, selectedDistrict }) => {
  const [geoData, setGeoData] = useState(null);
  const [stateOutline, setStateOutline] = useState(null);
  const geoJsonRef = useRef(null);
  const districtMap = useRef({});

  useEffect(() => {
    const lookup = {};
    districts.forEach((d) => {
      lookup[d.name.toLowerCase()] = d;
    });
    districtMap.current = lookup;
  }, [districts]);

  useEffect(() => {
    Promise.all([
      fetch("/data/odisha-districts.geojson").then((r) => r.json()),
      fetch("/data/odisha-state-outline.geojson").then((r) => r.json()),
    ])
      .then(([districts, outline]) => {
        setGeoData(districts);
        setStateOutline(outline);
      })
      .catch(console.error);
  }, []);

  const getDistrictData = useCallback((geojsonName) => {
    const dbName = getDbName(geojsonName);
    return districtMap.current[dbName.toLowerCase()];
  }, []);

  // District fill style: white/light fill, gray borders
  const districtStyle = useCallback(
    (feature) => {
      const name = feature.properties.district_name;
      const data = getDistrictData(name);
      const isSelected =
        selectedDistrict &&
        getDbName(name).toLowerCase() === selectedDistrict.name.toLowerCase();

      return {
        fillColor: isSelected ? "#FFF3E0" : "#FFFFFF",
        weight: isSelected ? 2.5 : 1,
        color: isSelected ? "#F26522" : "#9E9E9E",
        fillOpacity: isSelected ? 0.8 : 0.5,
        opacity: 1,
      };
    },
    [selectedDistrict, getDistrictData]
  );

  // Bold red state outline style
  const outlineStyle = useCallback(() => ({
    fillColor: "transparent",
    fillOpacity: 0,
    weight: 3,
    color: "#D32F2F",
    opacity: 1,
  }), []);

  const onEachFeature = useCallback(
    (feature, layer) => {
      const geojsonName = feature.properties.district_name;
      const data = getDistrictData(geojsonName);
      const displayName = getDbName(geojsonName);
      const score = data?.vision_score ?? "N/A";
      const status = data?.status ?? "N/A";

      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({
            weight: 2.5,
            color: "#F26522",
            fillColor: "#FFF8E1",
            fillOpacity: 0.7,
          });
          l.bringToFront();
        },
        mouseout: (e) => {
          if (geoJsonRef.current) geoJsonRef.current.resetStyle(e.target);
        },
        click: () => {
          if (data && onDistrictSelect) onDistrictSelect(data);
        },
      });

      // Bind hover tooltip with data
      layer.bindTooltip(
        `<div style="font-family:Outfit,sans-serif;padding:2px 0">
          <strong style="font-size:13px;color:#1E3A8A">${displayName}</strong><br/>
          <span style="font-size:12px">Vision Score: <strong style="color:${
            typeof score === "number" ? getScoreColor(score) : "#64748B"
          }">${score}</strong></span><br/>
          <span style="font-size:11px;color:#64748B">Status: ${status}</span>
        </div>`,
        { sticky: true, className: "district-tooltip" }
      );
    },
    [getDistrictData, onDistrictSelect]
  );

  // Pre-compute centroids and labels
  const labelData = useMemo(() => {
    if (!geoData) return [];
    return geoData.features.map((feature) => {
      const name = feature.properties.district_name;
      const dbName = getDbName(name);
      const centroid = getCentroid(feature);
      const isCapital = name === "Khordha";
      return { name: dbName, geojsonName: name, centroid, isCapital };
    });
  }, [geoData]);

  const starIcon = useMemo(() => createStarIcon(), []);

  const geoJsonKey = `${selectedDistrict?.name || "none"}`;

  if (!geoData) {
    return (
      <div className="flex items-center justify-center h-full min-h-[480px] bg-white rounded-xl border border-slate-200">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500">Loading Odisha Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" data-testid="odisha-map">
      <MapContainer
        center={[20.5, 84.4]}
        zoom={7}
        scrollWheelZoom={true}
        className="rounded-xl"
        style={{ height: "520px", width: "100%", background: "#FFFFFF" }}
        zoomControl={true}
        attributionControl={false}
      >
        {/* District polygons - white fill, gray borders */}
        <GeoJSON
          key={`districts-${geoJsonKey}`}
          ref={geoJsonRef}
          data={geoData}
          style={districtStyle}
          onEachFeature={onEachFeature}
        />

        {/* Bold red state outline on top */}
        {stateOutline && (
          <GeoJSON
            key="state-outline"
            data={stateOutline}
            style={outlineStyle}
            interactive={false}
          />
        )}

        {/* Star markers at centroids */}
        {labelData.map((d) => (
          <Marker
            key={`star-${d.geojsonName}`}
            position={d.centroid}
            icon={starIcon}
            interactive={false}
          />
        ))}

        {/* District name labels */}
        {labelData.map((d) => (
          <Marker
            key={`label-${d.geojsonName}`}
            position={d.centroid}
            icon={createLabelIcon(d.name, d.isCapital)}
            interactive={false}
          />
        ))}

        <FitBounds geoData={geoData} />
      </MapContainer>

      {/* Score Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg border border-slate-200 p-3 shadow-sm">
        <p className="text-xs font-semibold text-slate-700 mb-2">Vision Score</p>
        <div className="space-y-1">
          {[
            { color: "#059669", label: "70+ (On Track)" },
            { color: "#D97706", label: "50-69 (Moderate)" },
            { color: "#EA580C", label: "30-49 (At Risk)" },
            { color: "#DC2626", label: "<30 (Critical)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Odisha Map badge */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-[#1E3A8A] text-white text-xs font-bold px-3 py-1.5 rounded-md shadow">
        ODISHA Map
      </div>
    </div>
  );
};

export default OdishaMap;
