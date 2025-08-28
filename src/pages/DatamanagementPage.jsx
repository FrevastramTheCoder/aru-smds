
// src/pages/DataManagement.jsx
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as shp from "shpjs";
import * as toGeoJSON from "@mapbox/togeojson";

// Map Legend component
function MapLegend({ layers }) {
  const map = useMap();
  React.useEffect(() => {
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.style.background = "#fff";
      div.style.padding = "8px";
      div.style.borderRadius = "8px";
      div.style.boxShadow = "0 3px 8px rgba(0,0,0,0.2)";
      div.innerHTML = "<b>Legend</b><br/>";
      layers.forEach((l) => {
        const color = l.color || "#000";
        if (l.type === "solid_waste" || l.type === "vimbweta") {
          div.innerHTML += `<i style="background:${color};width:12px;height:12px;border-radius:50%;display:inline-block;margin-right:6px;"></i>${l.name}<br/>`;
        } else {
          div.innerHTML += `<i style="background:${color};width:18px;height:10px;display:inline-block;margin-right:6px;"></i>${l.name}<br/>`;
        }
      });
      return div;
    };
    legend.addTo(map);
    return () => legend.remove();
  }, [map, layers]);
  return null;
}

// Radius for point layers
const getPointRadius = (type) => {
  switch (type) {
    case "solid_waste":
      return 8;
    case "vimbweta":
      return 6;
    default:
      return 5;
  }
};

function DataManagement() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [dataType, setDataType] = useState("buildings");
  const [layers, setLayers] = useState([]);

  const dataTypes = [
    { key: "buildings", label: "Buildings" },
    { key: "roads", label: "Roads" },
    { key: "footpaths", label: "Footpaths" },
    { key: "vegetation", label: "Vegetation" },
    { key: "parking", label: "Parking" },
    { key: "solid_waste", label: "Solid Waste" },
    { key: "electricity", label: "Electricity" },
    { key: "water_supply", label: "Water Supply" },
    { key: "drainage", label: "Drainage System" },
    { key: "vimbweta", label: "Vimbweta" },
    { key: "security", label: "Security Lights" },
    { key: "recreational_areas", label: "Recreational Areas" },
    { key: "aru_boundary", label: "Aru Boundary" },
  ];

  const API_BASE =
    import.meta.env.VITE_API_SPATIAL_URL ||
    "http://localhost:5000/api/spatial";

  const getLayerStyle = (name, type) => {
    const styles = {
      aru_boundary: { color: "red", dashArray: "5,5,1,5", weight: 3, fillOpacity: 0.1 },
      buildings: { color: "yellow", weight: 2, fillOpacity: 0.3 },
      roads: { color: "black", weight: 2, fillOpacity: 0.2 },
      footpaths: { color: "gray", weight: 2, fillOpacity: 0.2 },
      vegetation: { color: "green", weight: 2, fillOpacity: 0.3 },
      parking: { color: "purple", weight: 2, fillOpacity: 0.3 },
      solid_waste: { color: "darkblue", weight: 2, fillOpacity: 0.7 },
      electricity: { color: "khaki", weight: 2, fillOpacity: 0.3 },
      water_supply: { color: "blue", weight: 2, fillOpacity: 0.3 },
      drainage: { color: "gold", weight: 2, fillOpacity: 0.3 },
      vimbweta: { color: "orange", weight: 2, fillOpacity: 0.7 },
      security: { color: "magenta", weight: 2, fillOpacity: 0.3 },
      recreational_areas: { color: "yellowgreen", weight: 2, fillOpacity: 0.3 },
    };
    return styles[type] || { color: "gray", weight: 2, fillOpacity: 0.2 };
  };

  const fitGeoJSONBounds = (geojson) => {
    const map = mapRef.current;
    if (!map || !geojson) return;
    const bounds = L.geoJSON(geojson).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
  };

  const fitAllLayers = () => {
    const map = mapRef.current;
    if (!map || layers.length === 0) return;
    const group = L.featureGroup(layers.map((l) => L.geoJSON(l.data)));
    const bounds = group.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] });
  };

  const saveLayersToStorage = (updatedLayers) => {
    localStorage.setItem("dm_layers", JSON.stringify(updatedLayers));
  };

  const addLayer = (name, geojson) => {
    const type = dataType.toLowerCase();
    const color = getLayerStyle(name, type).color;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newLayer = { id, name, type, data: geojson, color };
    const updatedLayers = [...layers, newLayer];
    setLayers(updatedLayers);
    saveLayersToStorage(updatedLayers);
    setTimeout(() => fitGeoJSONBounds(geojson), 0);
  };

  const handleRemoveLayer = (id) => {
    const updated = layers.filter((l) => l.id !== id);
    setLayers(updated);
    saveLayersToStorage(updated);
    toast.info("Layer removed successfully.");
  };

  const handleClear = () => {
    setLayers([]);
    localStorage.removeItem("dm_layers");
    toast.info("Cleared all layers.");
  };

  const handleUploadClick = () =>
    document.getElementById("fileInputHidden")?.click();

  const handleFilesChosen = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      try {
        let geojson = null;
        if (file.name.endsWith(".zip")) {
          geojson = await shp(file);
        } else if (file.name.endsWith(".kml")) {
          const text = await file.text();
          const parser = new DOMParser();
          const kml = parser.parseFromString(text, "text/xml");
          geojson = toGeoJSON.kml(kml);
        } else {
          toast.error(`Unsupported file type: ${file.name}`);
          continue;
        }

        addLayer(file.name, geojson);
        toast.success(`Loaded ${file.name}`);
      } catch (err) {
        console.error(err);
        toast.error(`Failed to load ${file.name}`);
      }
    }
    e.target.value = "";
  };

  const handleSaveAllLayers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login to save layers.");

    for (const layer of layers) {
      try {
        const formData = new FormData();
        formData.append("tableName", layer.type);
        formData.append(
          "file",
          new Blob([JSON.stringify(layer.data)], { type: "application/json" }),
          `${layer.name}.geojson`
        );

        const res = await axios.post(`${API_BASE}/upload`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });

        if (res.data?.success) {
          toast.success(`✅ Saved layer: ${layer.name}`);
        } else {
          const msg = res.data?.error || res.data?.detail || "Unknown server error";
          toast.error(`❌ Failed to save ${layer.name}: ${msg}`);
        }
      } catch (err) {
        console.error(err);
        const serverMsg = err.response?.data?.detail || err.response?.data?.error || err.message;
        toast.error(`❌ Failed to save ${layer.name}: ${serverMsg}`);
      }
    }
  };

  useEffect(() => {
    const storedLayers = localStorage.getItem("dm_layers");
    if (storedLayers) {
      try {
        const parsed = JSON.parse(storedLayers);
        setLayers(parsed);
        setTimeout(fitAllLayers, 200);
      } catch {
        localStorage.removeItem("dm_layers");
      }
    }
  }, []);

  if (authLoading) return <div style={{ padding: 20 }}>Loading authentication...</div>;
  if (!isAuthenticated)
    return (
      <div style={{ padding: 20, color: "#dc2626" }}>Please log in.</div>
    );

  // Styles
  const containerStyle = { display: "flex", flexWrap: "wrap", gap: 20, maxWidth: 1400, margin: "40px auto" };
  const leftPanelStyle = { flex: "1 1 300px", backgroundColor: "#fff", padding: 30, borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" };
  const rightPanelStyle = { flex: "2 1 600px", height: 650, borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" };

  const buttonBase = { color: "#fff", padding: "12px 18px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", marginBottom: 12, width: "100%" };
  const btnDataview = {
    ...buttonBase,
    backgroundColor: location.pathname === "/data-view" ? "#1e3a8a" : "#2563eb"
  }; // Highlight blue if active
  const btnMapView = {
    ...buttonBase,
    backgroundColor: location.pathname === "/map" ? "#b91c1c" : "#f43f5e"
  }; // Highlight red if active
  const btnYellow = { ...buttonBase, backgroundColor: "#f59e0b" };
  const btnGreen = { ...buttonBase, backgroundColor: "#22c55e" };
  const btnRed = { ...buttonBase, backgroundColor: "#ef4444" };
  const btnGray = { ...buttonBase, backgroundColor: "#6b7280" };
  const selectStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d1d5db", marginBottom: 18, fontSize: 14, outline: "none" };
  const fileBoxStyle = { padding: 16, border: "1px dashed #cbd5e1", borderRadius: 12, marginBottom: 18, background: "#f8fafc" };

  return (
    <div style={containerStyle}>
      <ToastContainer position="top-right" autoClose={2600} />

      <div style={leftPanelStyle}>
        {/* Top navigation buttons */}
        <button style={btnDataview} onClick={() => navigate("/data-view")}>
          Dataview / Query / Update
        </button>
        <button style={btnMapView} onClick={() => navigate("/map")}>
          MapView
        </button>

        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>📂 Upload Shapefile / KML</h1>
        <label>Select Data Type</label>
        <select style={selectStyle} value={dataType} onChange={(e) => setDataType(e.target.value)}>
          {dataTypes.map(({ key, label }) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <div style={fileBoxStyle}>
          <input id="fileInputHidden" type="file" accept=".zip,.kml" multiple onChange={handleFilesChosen} style={{ display: "none" }} />
          <button style={btnYellow} onClick={handleUploadClick}>Upload</button>
          <button style={btnGreen} onClick={handleSaveAllLayers}>Save</button>
          <button style={btnRed} onClick={handleClear}>Clear</button>
          <button style={btnGray} onClick={fitAllLayers}>Fit All</button>

          {layers.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{layers.length} layer(s) loaded:</div>
              <div>
                {layers.map((l) => (
                  <span key={l.id} style={{ display: "inline-flex", alignItems: "center", background: l.color, color: "#fff", padding: "4px 8px", borderRadius: 6, marginRight: 6, marginBottom: 4 }}>
                    {l.name}
                    <button onClick={() => handleRemoveLayer(l.id)} style={{ marginLeft: 6, background: "#ef4444", border: "none", borderRadius: 4, color: "#fff", cursor: "pointer", padding: "0 4px" }}>×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={rightPanelStyle}>
        <MapContainer
          whenCreated={(map) => (mapRef.current = map)}
          center={[-6.766343604847908, 39.21384585200582]}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
          <LayersControl position="topright">
            {layers.map((layer) => (
              <LayersControl.Overlay key={layer.id} name={layer.name} checked>
                <GeoJSON
                  data={layer.data}
                  style={getLayerStyle(layer.name, layer.type)}
                  pointToLayer={(feature, latlng) => {
                    const style = getLayerStyle(layer.name, layer.type);
                    if (feature.geometry?.type === "Point") {
                      return L.circleMarker(latlng, {
                        radius: getPointRadius(layer.type),
                        fillColor: style.color || "blue",
                        color: style.color || "blue",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: style.fillOpacity || 0.7,
                      });
                    }
                    return L.marker(latlng);
                  }}
                />
              </LayersControl.Overlay>
            ))}
          </LayersControl>
          <MapLegend layers={layers} />
        </MapContainer>
      </div>
    </div>
  );
}

export default DataManagement;
