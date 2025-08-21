
// // DataManagement.jsx
// import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import * as shp from "shpjs";
// import * as toGeoJSON from "@mapbox/togeojson";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function DataManagement() {
//   const { isAuthenticated, isLoading: authLoading } = useAuth();
//   const navigate = useNavigate();
//   const mapRef = useRef(null);

//   // form state
//   const [dataType, setDataType] = useState("buildings");

//   // layers: [{ id, name, data (FeatureCollection) }]
//   const [layers, setLayers] = useState([]);

//   const dataTypes = [
//     { key: "buildings", label: "Buildings" },
//     { key: "roads", label: "Roads" },
//     { key: "footpaths", label: "Footpaths" },
//     { key: "vegetation", label: "Vegetation" },
//     { key: "parking", label: "Parking" },
//     { key: "solid_waste", label: "Solid Waste" },
//     { key: "electricity", label: "Electricity" },
//     { key: "water_supply", label: "Water Supply" },
//     { key: "drainage", label: "Drainage System" },
//     { key: "vimbweta", label: "Vimbweta" },
//     { key: "security", label: "Security Lights" },
//     { key: "recreational_areas", label: "Recreational Areas" },
//   ];

//   const API_BASE =
//     import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/spatial";

//   // ---------- helpers ----------
//   const fitGeoJSONBounds = (geojson) => {
//     try {
//       const map = mapRef.current;
//       if (!map || !geojson) return;
//       const bounds = L.geoJSON(geojson).getBounds();
//       if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
//     } catch (e) {
//       // ignore if something odd
//     }
//   };

//   const fitAllLayers = () => {
//     const map = mapRef.current;
//     if (!map || layers.length === 0) return;
//     const group = L.featureGroup(
//       layers.map((l) => L.geoJSON(l.data))
//     );
//     const bounds = group.getBounds();
//     if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] });
//   };

//   const addLayer = (name, geojson) => {
//     const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
//     setLayers((prev) => [...prev, { id, name, data: geojson }]);
//     // auto-zoom to this dataset
//     setTimeout(() => fitGeoJSONBounds(geojson), 0);
//   };

//   // ---------- upload handlers ----------
//   const handleUploadClick = () => {
//     // open hidden input
//     document.getElementById("fileInputHidden")?.click();
//   };

//   const handleFilesChosen = async (e) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;

//     let anySuccess = false;

//     for (const file of files) {
//       try {
//         if (file.name.toLowerCase().endsWith(".zip")) {
//           // Shapefile
//           const buf = await file.arrayBuffer();
//           const result = await shp(buf); // returns FC or {layers}
//           if (Array.isArray(result)) {
//             // rare: shpjs may return array of FCs
//             result.forEach((fc, i) => addLayer(`${file.name} (${i + 1})`, fc));
//           } else if (result && result.type === "FeatureCollection") {
//             addLayer(file.name, result);
//           } else if (result && typeof result === "object") {
//             // multiple named layers inside ZIP
//             Object.entries(result).forEach(([lname, fc]) => {
//               addLayer(`${file.name} - ${lname}`, fc);
//             });
//           }
//           anySuccess = true;
//           toast.success(`Uploaded Shapefile: ${file.name}`);
//         } else if (file.name.toLowerCase().endsWith(".kml")) {
//           // KML
//           const text = await file.text();
//           const xml = new DOMParser().parseFromString(text, "text/xml");
//           const fc = toGeoJSON.kml(xml);
//           addLayer(file.name, fc);
//           anySuccess = true;
//           toast.success(`Uploaded KML: ${file.name}`);
//         } else {
//           toast.error(`Unsupported file: ${file.name}`);
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error(`Failed to process: ${file.name}`);
//       }
//     }

//     // optional: fit all after multi-upload
//     if (anySuccess) setTimeout(fitAllLayers, 50);

//     // reset input so same file can be reselected later
//     e.target.value = "";
//   };

//   // ---------- save / clear ----------
//   const handleSave = async () => {
//     if (layers.length === 0) {
//       toast.error("No layers to save.");
//       return;
//     }
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No authentication token found");

//       // Save each layer independently to your existing /save endpoint
//       await Promise.all(
//         layers.map((layer) =>
//           axios.post(
//             `${API_BASE}/save`,
//             { tableName: dataType, geojson: layer.data, name: layer.name },
//             { headers: { Authorization: `Bearer ${token}` } }
//           )
//         )
//       );

//       toast.success("✅ All layers saved to database!");
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Failed to save one or more layers.");
//     }
//   };

//   const handleClear = () => {
//     setLayers([]);
//     toast.info("Cleared all layers from the map.");
//   };

//   // ---------- auth gates ----------
//   if (authLoading)
//     return (
//       <div style={{ padding: 20, fontSize: 16, color: "#555" }}>
//         Loading authentication...
//       </div>
//     );

//   if (!isAuthenticated)
//     return (
//       <div
//         style={{
//           padding: 20,
//           fontSize: 16,
//           fontWeight: "bold",
//           color: "#dc2626",
//         }}
//       >
//         Please log in to upload files.
//       </div>
//     );

//   // ---------- inline styles ----------
//   const containerStyle = {
//     display: "flex",
//     gap: 20,
//     maxWidth: "1200px",
//     margin: "40px auto",
//     fontFamily: "Inter, system-ui, Arial, sans-serif",
//   };

//   const leftPanelStyle = {
//     flex: 1,
//     backgroundColor: "#ffffff",
//     padding: 30,
//     borderRadius: 12,
//     boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
//     border: "1px solid #e5e7eb",
//   };

//   const rightPanelStyle = {
//     flex: 1,
//     height: "620px",
//     borderRadius: 12,
//     overflow: "hidden",
//     boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
//     border: "1px solid #e5e7eb",
//   };

//   const titleStyle = {
//     fontSize: 22,
//     fontWeight: 800,
//     marginBottom: 16,
//     color: "#111827",
//     letterSpacing: 0.2,
//   };

//   const labelStyle = {
//     display: "block",
//     marginBottom: 8,
//     fontWeight: 600,
//     color: "#374151",
//   };

//   const selectStyle = {
//     width: "100%",
//     padding: "10px 12px",
//     borderRadius: 10,
//     border: "1px solid #d1d5db",
//     marginBottom: 18,
//     fontSize: 14,
//     outline: "none",
//   };

//   const fileBoxStyle = {
//     padding: 16,
//     border: "1px dashed #cbd5e1",
//     borderRadius: 12,
//     marginBottom: 18,
//     background: "#f8fafc",
//   };

//   const buttonBase = {
//     color: "#fff",
//     padding: "10px 16px",
//     borderRadius: 10,
//     fontWeight: 700,
//     border: "none",
//     cursor: "pointer",
//     marginRight: 10,
//     minWidth: 120,
//     boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
//   };

//   const btnYellow = { ...buttonBase, backgroundColor: "#f59e0b" };
//   const btnGreen = { ...buttonBase, backgroundColor: "#22c55e" };
//   const btnRed = { ...buttonBase, backgroundColor: "#ef4444" };
//   const btnGray = { ...buttonBase, backgroundColor: "#6b7280" };

//   const pillStyle = {
//     display: "inline-block",
//     background: "#f1f5f9",
//     color: "#0f172a",
//     fontSize: 12,
//     padding: "6px 10px",
//     borderRadius: 999,
//     marginRight: 8,
//     marginTop: 6,
//   };

//   return (
//     <div style={containerStyle}>
//       <ToastContainer position="top-right" autoClose={2600} />

//       {/* Left panel */}
//       <div style={leftPanelStyle}>
//         <div style={{ display: "flex", justifyContent: "space-between" }}>
//           <h1 style={titleStyle}>📂 Upload Shapefile / KML</h1>
//           <div>
//             <button
//               style={btnGray}
//               onClick={() => navigate("/data-view")}
//               title="Go to Data View"
//             >
//               Data View
//             </button>
//             <button
//               style={btnGray}
//               onClick={() => navigate("/map")}
//               title="Go to Map View"
//             >
//               Map View
//             </button>
//           </div>
//         </div>

//         <label style={labelStyle} htmlFor="dataType">
//           Select Data Type
//         </label>
//         <select
//           id="dataType"
//           value={dataType}
//           onChange={(e) => setDataType(e.target.value)}
//           style={selectStyle}
//         >
//           {dataTypes.map(({ key, label }) => (
//             <option key={key} value={key}>
//               {label}
//             </option>
//           ))}
//         </select>

//         <div style={fileBoxStyle}>
//           <div style={{ marginBottom: 10, fontWeight: 600 }}>
//             Select files (.zip Shapefile, .kml)
//           </div>
//           <input
//             id="fileInputHidden"
//             type="file"
//             accept=".zip,.kml"
//             multiple
//             onChange={handleFilesChosen}
//             style={{ display: "none" }}
//           />
//           <button style={btnYellow} onClick={handleUploadClick}>
//             Upload
//           </button>
//           <button style={btnGreen} onClick={handleSave}>
//             Save
//           </button>
//           <button style={btnRed} onClick={handleClear}>
//             Clear
//           </button>
//           <button style={{ ...btnGray, marginLeft: 10 }} onClick={fitAllLayers}>
//             Fit All
//           </button>

//           {/* Small legend of current layers */}
//           {layers.length > 0 ? (
//             <div style={{ marginTop: 14 }}>
//               <div style={{ fontWeight: 700, marginBottom: 6 }}>
//                 {layers.length} layer(s) loaded:
//               </div>
//               <div>
//                 {layers.map((l) => (
//                   <span key={l.id} style={pillStyle}>
//                     {l.name}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div style={{ marginTop: 12, color: "#64748b", fontSize: 13 }}>
//               No layers yet. Click <b>Upload</b> to add files and preview them
//               on the map.
//             </div>
//           )}
//         </div>

//         <div style={{ fontSize: 12, color: "#64748b" }}>
//           Tip: After uploading, the map automatically zooms to your data. Use
//           <b> Fit All</b> to view everything together.
//         </div>
//       </div>

//       {/* Right panel (Map) */}
//       <div style={rightPanelStyle}>
//         <MapContainer
//           whenCreated={(map) => (mapRef.current = map)}
//           center={[-6.162, 35.7516]}
//           zoom={5}
//           style={{ height: "100%", width: "100%" }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution="© OpenStreetMap contributors"
//           />

//           <LayersControl position="topright">
//             {layers.map((layer) => (
//               <LayersControl.Overlay key={layer.id} name={layer.name} checked>
//                 <GeoJSON
//                   data={layer.data}
//                   style={{
//                     color: "#2563eb",
//                     weight: 2,
//                     fillOpacity: 0.2,
//                   }}
//                 />
//               </LayersControl.Overlay>
//             ))}
//           </LayersControl>
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

// export default DataManagement;
// DataManagement.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as shp from "shpjs";
import * as toGeoJSON from "@mapbox/togeojson";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper for adding legend
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
        div.innerHTML += `<i style="background:${color};width:18px;height:10px;display:inline-block;margin-right:6px;"></i>${l.name}<br/>`;
      });
      return div;
    };
    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map, layers]);
  return null;
}

function DataManagement() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const mapRef = useRef(null);

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
    { key: "Aru_boundary", label: "Aru Boundary" },
  ];

  const API_BASE =
    import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/spatial";

  // ---------- Helpers ----------
  const getLayerStyle = (name, type) => {
    switch (type) {
      case "Aru_boundary":
        return { color: "red", dashArray: "5,5,1,5", weight: 3, fillOpacity: 0.1 };
      case "buildings":
        return { color: "yellow", weight: 2, fillOpacity: 0.3 };
      case "roads":
        return { color: "black", weight: 2, fillOpacity: 0.2 };
      case "vegetation":
        return { color: "green", weight: 2, fillOpacity: 0.3 };
      case "parking":
        return { color: "purple", weight: 2, fillOpacity: 0.3 };
      case "solid_waste":
        return { color: "darkblue", weight: 2, fillOpacity: 0.3 };
      case "electricity":
        return { color: "khaki", weight: 2, fillOpacity: 0.3 };
      case "water_supply":
        return { color: "blue", weight: 2, fillOpacity: 0.3 };
      case "drainage":
        return { color: "gold", weight: 2, fillOpacity: 0.3 };
      case "security":
        return { color: "magenta", weight: 2, fillOpacity: 0.3 };
      case "recreational_areas":
        return { color: "yellowgreen", weight: 2, fillOpacity: 0.3 };
      default:
        return { color: "gray", weight: 2, fillOpacity: 0.2 };
    }
  };

  const fitGeoJSONBounds = (geojson) => {
    try {
      const map = mapRef.current;
      if (!map || !geojson) return;
      const bounds = L.geoJSON(geojson).getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
    } catch (e) {}
  };

  const fitAllLayers = () => {
    const map = mapRef.current;
    if (!map || layers.length === 0) return;
    const group = L.featureGroup(layers.map((l) => L.geoJSON(l.data)));
    const bounds = group.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] });
  };

  const addLayer = (name, geojson) => {
    let type = dataType;
    if (name.toLowerCase().includes("aru_boundary")) type = "Aru_boundary";
    const color = getLayerStyle(name, type).color;

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setLayers((prev) => [...prev, { id, name, type, data: geojson, color }]);
    setTimeout(() => fitGeoJSONBounds(geojson), 0);
  };

  // ---------- File Upload ----------
  const handleUploadClick = () => document.getElementById("fileInputHidden")?.click();

  const handleFilesChosen = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    let anySuccess = false;
    for (const file of files) {
      try {
        if (file.name.toLowerCase().endsWith(".zip")) {
          const buf = await file.arrayBuffer();
          const result = await shp(buf);
          if (Array.isArray(result)) result.forEach((fc, i) => addLayer(`${file.name} (${i + 1})`, fc));
          else if (result.type === "FeatureCollection") addLayer(file.name, result);
          else if (typeof result === "object") Object.entries(result).forEach(([lname, fc]) => addLayer(`${file.name} - ${lname}`, fc));
          toast.success(`Uploaded Shapefile: ${file.name}`);
          anySuccess = true;
        } else if (file.name.toLowerCase().endsWith(".kml")) {
          const text = await file.text();
          const xml = new DOMParser().parseFromString(text, "text/xml");
          const fc = toGeoJSON.kml(xml);
          addLayer(file.name, fc);
          toast.success(`Uploaded KML: ${file.name}`);
          anySuccess = true;
        } else toast.error(`Unsupported file: ${file.name}`);
      } catch (err) {
        console.error(err);
        toast.error(`Failed to process: ${file.name}`);
      }
    }
    if (anySuccess) setTimeout(fitAllLayers, 50);
    e.target.value = "";
  };

  // ---------- Save / Clear ----------
  const handleSave = async () => {
    if (!layers.length) return toast.error("No layers to save.");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await Promise.all(
        layers.map((layer) =>
          axios.post(`${API_BASE}/save`, { tableName: layer.type, geojson: layer.data, name: layer.name }, { headers: { Authorization: `Bearer ${token}` } })
        )
      );
      toast.success("✅ All layers saved to database!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save layers.");
    }
  };

  const handleClear = () => {
    setLayers([]);
    toast.info("Cleared all layers from the map.");
  };

  if (authLoading) return <div style={{ padding: 20 }}>Loading authentication...</div>;
  if (!isAuthenticated) return <div style={{ padding: 20, color: "#dc2626" }}>Please log in.</div>;

  // ---------- Styles ----------
  const containerStyle = { display: "flex", gap: 20, maxWidth: 1200, margin: "40px auto" };
  const leftPanelStyle = { flex: 1, backgroundColor: "#fff", padding: 30, borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" };
  const rightPanelStyle = { flex: 1, height: 620, borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" };
  const buttonBase = { color: "#fff", padding: "10px 16px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", marginRight: 10, minWidth: 120 };
  const btnYellow = { ...buttonBase, backgroundColor: "#f59e0b" };
  const btnGreen = { ...buttonBase, backgroundColor: "#22c55e" };
  const btnRed = { ...buttonBase, backgroundColor: "#ef4444" };
  const btnGray = { ...buttonBase, backgroundColor: "#6b7280" };
  const selectStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d1d5db", marginBottom: 18, fontSize: 14, outline: "none" };
  const fileBoxStyle = { padding: 16, border: "1px dashed #cbd5e1", borderRadius: 12, marginBottom: 18, background: "#f8fafc" };

  return (
    <div style={containerStyle}>
      <ToastContainer position="top-right" autoClose={2600} />

      {/* Left Panel */}
      <div style={leftPanelStyle}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>📂 Upload Shapefile / KML</h1>
        <label>Select Data Type</label>
        <select style={selectStyle} value={dataType} onChange={(e) => setDataType(e.target.value)}>
          {dataTypes.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
        </select>

        <div style={fileBoxStyle}>
          <input id="fileInputHidden" type="file" accept=".zip,.kml" multiple onChange={handleFilesChosen} style={{ display: "none" }} />
          <button style={btnYellow} onClick={handleUploadClick}>Upload</button>
          <button style={btnGreen} onClick={handleSave}>Save</button>
          <button style={btnRed} onClick={handleClear}>Clear</button>
          <button style={{ ...btnGray, marginLeft: 10 }} onClick={fitAllLayers}>Fit All</button>

          {layers.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{layers.length} layer(s) loaded:</div>
              <div>{layers.map((l) => <span key={l.id} style={{ display: "inline-block", background: l.color, color: "#fff", padding: "4px 8px", borderRadius: 6, marginRight: 6 }}>{l.name}</span>)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div style={rightPanelStyle}>
        <MapContainer whenCreated={(map) => (mapRef.current = map)} center={[-6.162, 35.7516]} zoom={5} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
          <LayersControl position="topright">
            {layers.map((layer) => (
              <LayersControl.Overlay key={layer.id} name={layer.name} checked>
                <GeoJSON data={layer.data} style={getLayerStyle(layer.name, layer.type)} />
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
