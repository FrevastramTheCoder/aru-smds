
// // DataManagement.jsx
// import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import {
//   MapContainer,
//   TileLayer,
//   GeoJSON,
//   LayersControl,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import * as shp from "shpjs";
// import * as toGeoJSON from "@mapbox/togeojson";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Helper for adding legend
// function MapLegend({ layers }) {
//   const map = useMap();
//   React.useEffect(() => {
//     const legend = L.control({ position: "bottomright" });
//     legend.onAdd = function () {
//       const div = L.DomUtil.create("div", "info legend");
//       div.style.background = "#fff";
//       div.style.padding = "8px";
//       div.style.borderRadius = "8px";
//       div.style.boxShadow = "0 3px 8px rgba(0,0,0,0.2)";
//       div.innerHTML = "<b>Legend</b><br/>";
//       layers.forEach((l) => {
//         const color = l.color || "#000";
//         div.innerHTML += `<i style="background:${color};width:18px;height:10px;display:inline-block;margin-right:6px;"></i>${l.name}<br/>`;
//       });
//       return div;
//     };
//     legend.addTo(map);
//     return () => {
//       legend.remove();
//     };
//   }, [map, layers]);
//   return null;
// }

// function DataManagement() {
//   const { isAuthenticated, isLoading: authLoading } = useAuth();
//   const navigate = useNavigate();
//   const mapRef = useRef(null);

//   const [dataType, setDataType] = useState("buildings");
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
//     { key: "Aru_boundary", label: "Aru Boundary" },
//   ];

//   const API_BASE =
//     import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/spatial";

//   // ---------- Helpers ----------
//   const getLayerStyle = (name, type) => {
//     switch (type) {
//       case "Aru_boundary":
//         return { color: "red", dashArray: "5,5,1,5", weight: 3, fillOpacity: 0.1 };
//       case "buildings":
//         return { color: "yellow", weight: 2, fillOpacity: 0.3 };
//       case "roads":
//         return { color: "black", weight: 2, fillOpacity: 0.2 };
//       case "vegetation":
//         return { color: "green", weight: 2, fillOpacity: 0.3 };
//       case "parking":
//         return { color: "purple", weight: 2, fillOpacity: 0.3 };
//       case "solid_waste":
//         return { color: "darkblue", weight: 2, fillOpacity: 0.3 };
//       case "electricity":
//         return { color: "khaki", weight: 2, fillOpacity: 0.3 };
//       case "water_supply":
//         return { color: "blue", weight: 2, fillOpacity: 0.3 };
//       case "drainage":
//         return { color: "gold", weight: 2, fillOpacity: 0.3 };
//       case "security":
//         return { color: "magenta", weight: 2, fillOpacity: 0.3 };
//       case "recreational_areas":
//         return { color: "yellowgreen", weight: 2, fillOpacity: 0.3 };
//       default:
//         return { color: "gray", weight: 2, fillOpacity: 0.2 };
//     }
//   };

//   const fitGeoJSONBounds = (geojson) => {
//     try {
//       const map = mapRef.current;
//       if (!map || !geojson) return;
//       const bounds = L.geoJSON(geojson).getBounds();
//       if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
//     } catch (e) {}
//   };

//   const fitAllLayers = () => {
//     const map = mapRef.current;
//     if (!map || layers.length === 0) return;
//     const group = L.featureGroup(layers.map((l) => L.geoJSON(l.data)));
//     const bounds = group.getBounds();
//     if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] });
//   };

//   const addLayer = (name, geojson) => {
//     let type = dataType;
//     if (name.toLowerCase().includes("aru_boundary")) type = "Aru_boundary";
//     const color = getLayerStyle(name, type).color;

//     const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
//     setLayers((prev) => [...prev, { id, name, type, data: geojson, color }]);
//     setTimeout(() => fitGeoJSONBounds(geojson), 0);
//   };

//   // ---------- File Upload ----------
//   const handleUploadClick = () => document.getElementById("fileInputHidden")?.click();

//   const handleFilesChosen = async (e) => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;

//     let anySuccess = false;
//     for (const file of files) {
//       try {
//         if (file.name.toLowerCase().endsWith(".zip")) {
//           const buf = await file.arrayBuffer();
//           const result = await shp(buf);
//           if (Array.isArray(result)) result.forEach((fc, i) => addLayer(`${file.name} (${i + 1})`, fc));
//           else if (result.type === "FeatureCollection") addLayer(file.name, result);
//           else if (typeof result === "object") Object.entries(result).forEach(([lname, fc]) => addLayer(`${file.name} - ${lname}`, fc));
//           toast.success(`Uploaded Shapefile: ${file.name}`);
//           anySuccess = true;
//         } else if (file.name.toLowerCase().endsWith(".kml")) {
//           const text = await file.text();
//           const xml = new DOMParser().parseFromString(text, "text/xml");
//           const fc = toGeoJSON.kml(xml);
//           addLayer(file.name, fc);
//           toast.success(`Uploaded KML: ${file.name}`);
//           anySuccess = true;
//         } else toast.error(`Unsupported file: ${file.name}`);
//       } catch (err) {
//         console.error(err);
//         toast.error(`Failed to process: ${file.name}`);
//       }
//     }
//     if (anySuccess) setTimeout(fitAllLayers, 50);
//     e.target.value = "";
//   };

//   // ---------- Save / Clear ----------
//   const handleSave = async () => {
//     if (!layers.length) return toast.error("No layers to save.");
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No token found");

//       await Promise.all(
//         layers.map((layer) =>
//           axios.post(`${API_BASE}/save`, { tableName: layer.type, geojson: layer.data, name: layer.name }, { headers: { Authorization: `Bearer ${token}` } })
//         )
//       );
//       toast.success("✅ All layers saved to database!");
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Failed to save layers.");
//     }
//   };

//   const handleClear = () => {
//     setLayers([]);
//     toast.info("Cleared all layers from the map.");
//   };

//   if (authLoading) return <div style={{ padding: 20 }}>Loading authentication...</div>;
//   if (!isAuthenticated) return <div style={{ padding: 20, color: "#dc2626" }}>Please log in.</div>;

//   // ---------- Styles ----------
//   const containerStyle = { display: "flex", gap: 20, maxWidth: 1200, margin: "40px auto" };
//   const leftPanelStyle = { flex: 1, backgroundColor: "#fff", padding: 30, borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" };
//   const rightPanelStyle = { flex: 1, height: 620, borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" };
//   const buttonBase = { color: "#fff", padding: "10px 16px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", marginRight: 10, minWidth: 120 };
//   const btnYellow = { ...buttonBase, backgroundColor: "#f59e0b" };
//   const btnGreen = { ...buttonBase, backgroundColor: "#22c55e" };
//   const btnRed = { ...buttonBase, backgroundColor: "#ef4444" };
//   const btnGray = { ...buttonBase, backgroundColor: "#6b7280" };
//   const selectStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d1d5db", marginBottom: 18, fontSize: 14, outline: "none" };
//   const fileBoxStyle = { padding: 16, border: "1px dashed #cbd5e1", borderRadius: 12, marginBottom: 18, background: "#f8fafc" };

//   return (
//     <div style={containerStyle}>
//       <ToastContainer position="top-right" autoClose={2600} />

//       {/* Left Panel */}
//       <div style={leftPanelStyle}>
//         <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>📂 Upload Shapefile / KML</h1>
//         <label>Select Data Type</label>
//         <select style={selectStyle} value={dataType} onChange={(e) => setDataType(e.target.value)}>
//           {dataTypes.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
//         </select>

//         <div style={fileBoxStyle}>
//           <input id="fileInputHidden" type="file" accept=".zip,.kml" multiple onChange={handleFilesChosen} style={{ display: "none" }} />
//           <button style={btnYellow} onClick={handleUploadClick}>Upload</button>
//           <button style={btnGreen} onClick={handleSave}>Save</button>
//           <button style={btnRed} onClick={handleClear}>Clear</button>
//           <button style={{ ...btnGray, marginLeft: 10 }} onClick={fitAllLayers}>Fit All</button>

//           {layers.length > 0 && (
//             <div style={{ marginTop: 14 }}>
//               <div style={{ fontWeight: 700, marginBottom: 6 }}>{layers.length} layer(s) loaded:</div>
//               <div>{layers.map((l) => <span key={l.id} style={{ display: "inline-block", background: l.color, color: "#fff", padding: "4px 8px", borderRadius: 6, marginRight: 6 }}>{l.name}</span>)}</div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right Panel */}
//       <div style={rightPanelStyle}>
//         <MapContainer whenCreated={(map) => (mapRef.current = map)} center={[-6.162, 35.7516]} zoom={5} style={{ height: "100%", width: "100%" }}>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
//           <LayersControl position="topright">
//             {layers.map((layer) => (
//               <LayersControl.Overlay key={layer.id} name={layer.name} checked>
//                 <GeoJSON data={layer.data} style={getLayerStyle(layer.name, layer.type)} />
//               </LayersControl.Overlay>
//             ))}
//           </LayersControl>
//           <MapLegend layers={layers} />
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

// // export default DataManagement;
// // DataManagement.jsx
// import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import {
//   MapContainer,
//   TileLayer,
//   GeoJSON,
//   LayersControl,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import * as shp from "shpjs";
// import * as toGeoJSON from "@mapbox/togeojson";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Map Legend
// function MapLegend({ layers }) {
//   const map = useMap();
//   React.useEffect(() => {
//     const legend = L.control({ position: "bottomright" });
//     legend.onAdd = function () {
//       const div = L.DomUtil.create("div", "info legend");
//       div.style.background = "#fff";
//       div.style.padding = "8px";
//       div.style.borderRadius = "8px";
//       div.style.boxShadow = "0 3px 8px rgba(0,0,0,0.2)";
//       div.innerHTML = "<b>Legend</b><br/>";
//       layers.forEach((l) => {
//         const color = l.color || "#000";
//         div.innerHTML += `<i style="background:${color};width:18px;height:10px;display:inline-block;margin-right:6px;"></i>${l.name}<br/>`;
//       });
//       return div;
//     };
//     legend.addTo(map);
//     return () => legend.remove();
//   }, [map, layers]);
//   return null;
// }

// function DataManagement() {
//   const { isAuthenticated, isLoading: authLoading } = useAuth();
//   const navigate = useNavigate();
//   const mapRef = useRef(null);

//   const [dataType, setDataType] = useState("buildings");
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
//     { key: "Aru_boundary", label: "Aru Boundary" },
//   ];

//   const API_BASE =
//     import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/spatial";

//   // ---------- Styles ----------
//   const getLayerStyle = (name, type) => {
//     switch (type) {
//       case "Aru_boundary": return { color: "red", dashArray: "5,5,1,5", weight: 3, fillOpacity: 0.1 };
//       case "buildings": return { color: "yellow", weight: 2, fillOpacity: 0.3 };
//       case "roads": return { color: "black", weight: 2, fillOpacity: 0.2 };
//       case "vegetation": return { color: "green", weight: 2, fillOpacity: 0.3 };
//       case "parking": return { color: "purple", weight: 2, fillOpacity: 0.3 };
//       case "solid_waste": return { color: "darkblue", weight: 2, fillOpacity: 0.3 };
//       case "electricity": return { color: "khaki", weight: 2, fillOpacity: 0.3 };
//       case "water_supply": return { color: "blue", weight: 2, fillOpacity: 0.3 };
//       case "drainage": return { color: "gold", weight: 2, fillOpacity: 0.3 };
//       case "security": return { color: "magenta", weight: 2, fillOpacity: 0.3 };
//       case "recreational_areas": return { color: "yellowgreen", weight: 2, fillOpacity: 0.3 };
//       default: return { color: "gray", weight: 2, fillOpacity: 0.2 };
//     }
//   };

//   const fitGeoJSONBounds = (geojson) => {
//     const map = mapRef.current;
//     if (!map || !geojson) return;
//     const bounds = L.geoJSON(geojson).getBounds();
//     if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
//   };

//   const fitAllLayers = () => {
//     const map = mapRef.current;
//     if (!map || layers.length === 0) return;
//     const group = L.featureGroup(layers.map((l) => L.geoJSON(l.data)));
//     const bounds = group.getBounds();
//     if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] });
//   };

//   const addLayer = (name, geojson) => {
//     let type = dataType;
//     if (name.toLowerCase().includes("aru_boundary")) type = "Aru_boundary";
//     const color = getLayerStyle(name, type).color;

//     const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
//     setLayers((prev) => [...prev, { id, name, type, data: geojson, color }]);
//     setTimeout(() => fitGeoJSONBounds(geojson), 0);
//   };

//   // ---------- File Upload ----------
//   const handleUploadClick = () => document.getElementById("fileInputHidden")?.click();

//   const handleFilesChosen = async (e) => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;

//     for (const file of files) {
//       try {
//         if (file.name.toLowerCase().endsWith(".zip")) {
//           const buf = await file.arrayBuffer();
//           const result = await shp(buf);
//           if (Array.isArray(result)) result.forEach((fc, i) => addLayer(`${file.name} (${i + 1})`, fc));
//           else addLayer(file.name, result);
//           toast.success(`Uploaded Shapefile: ${file.name}`);
//         } else if (file.name.toLowerCase().endsWith(".kml")) {
//           const text = await file.text();
//           const xml = new DOMParser().parseFromString(text, "text/xml");
//           const fc = toGeoJSON.kml(xml);
//           addLayer(file.name, fc);
//           toast.success(`Uploaded KML: ${file.name}`);
//         } else toast.error(`Unsupported file: ${file.name}`);
//       } catch (err) {
//         console.error(err);
//         toast.error(`Failed to process: ${file.name}`);
//       }
//     }
//     setTimeout(fitAllLayers, 50);
//     e.target.value = "";
//   };

//   // ---------- Save to DB ----------
//   const handleSave = async () => {
//     if (!layers.length) return toast.error("No layers to save.");
//     const token = localStorage.getItem("token");
//     if (!token) return toast.error("Please login to save layers.");

//     try {
//       for (const layer of layers) {
//         await axios.post(
//           `${API_BASE}/save`,
//           { tableName: layer.type, name: layer.name, geojson: layer.data },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success(`Saved layer: ${layer.name}`);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to save layers to DB.");
//     }
//   };

//   const handleClear = () => {
//     setLayers([]);
//     toast.info("Cleared all layers.");
//   };

//   if (authLoading) return <div style={{ padding: 20 }}>Loading authentication...</div>;
//   if (!isAuthenticated) return <div style={{ padding: 20, color: "#dc2626" }}>Please log in.</div>;

//   // ---------- UI Styles ----------
//   const containerStyle = { display: "flex", gap: 20, maxWidth: 1200, margin: "40px auto" };
//   const leftPanelStyle = { flex: 1, backgroundColor: "#fff", padding: 30, borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" };
//   const rightPanelStyle = { flex: 1, height: 620, borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" };
//   const buttonBase = { color: "#fff", padding: "10px 16px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", marginRight: 10, minWidth: 120 };
//   const btnYellow = { ...buttonBase, backgroundColor: "#f59e0b" };
//   const btnGreen = { ...buttonBase, backgroundColor: "#22c55e" };
//   const btnRed = { ...buttonBase, backgroundColor: "#ef4444" };
//   const btnGray = { ...buttonBase, backgroundColor: "#6b7280" };
//   const selectStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d1d5db", marginBottom: 18, fontSize: 14, outline: "none" };
//   const fileBoxStyle = { padding: 16, border: "1px dashed #cbd5e1", borderRadius: 12, marginBottom: 18, background: "#f8fafc" };

//   return (
//     <div style={containerStyle}>
//       <ToastContainer position="top-right" autoClose={2600} />

//       {/* Left Panel */}
//       <div style={leftPanelStyle}>
//         <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>📂 Upload Shapefile / KML</h1>
//         <label>Select Data Type</label>
//         <select style={selectStyle} value={dataType} onChange={(e) => setDataType(e.target.value)}>
//           {dataTypes.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
//         </select>

//         <div style={fileBoxStyle}>
//           <input id="fileInputHidden" type="file" accept=".zip,.kml" multiple onChange={handleFilesChosen} style={{ display: "none" }} />
//           <button style={btnYellow} onClick={handleUploadClick}>Upload</button>
//           <button style={btnGreen} onClick={handleSave}>Save</button>
//           <button style={btnRed} onClick={handleClear}>Clear</button>
//           <button style={{ ...btnGray, marginLeft: 10 }} onClick={fitAllLayers}>Fit All</button>

//           {layers.length > 0 && (
//             <div style={{ marginTop: 14 }}>
//               <div style={{ fontWeight: 700, marginBottom: 6 }}>{layers.length} layer(s) loaded:</div>
//               <div>{layers.map((l) => <span key={l.id} style={{ display: "inline-block", background: l.color, color: "#fff", padding: "4px 8px", borderRadius: 6, marginRight: 6 }}>{l.name}</span>)}</div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right Panel */}
//       <div style={rightPanelStyle}>
//         <MapContainer whenCreated={(map) => (mapRef.current = map)} center={[-6.162, 35.7516]} zoom={5} style={{ height: "100%", width: "100%" }}>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
//           <LayersControl position="topright">
//             {layers.map((layer) => (
//               <LayersControl.Overlay key={layer.id} name={layer.name} checked>
//                 <GeoJSON data={layer.data} style={getLayerStyle(layer.name, layer.type)} />
//               </LayersControl.Overlay>
//             ))}
//           </LayersControl>
//           <MapLegend layers={layers} />
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

// export default DataManagement;

// // src/pages/DataManagement.jsx
// import React, { useRef, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import {
//   MapContainer,
//   TileLayer,
//   GeoJSON,
//   LayersControl,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import * as shp from "shpjs";
// import * as toGeoJSON from "@mapbox/togeojson";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Map Legend Component
// function MapLegend({ layers }) {
//   const map = useMap();
//   React.useEffect(() => {
//     const legend = L.control({ position: "bottomright" });
//     legend.onAdd = function () {
//       const div = L.DomUtil.create("div", "info legend");
//       div.style.background = "#fff";
//       div.style.padding = "8px";
//       div.style.borderRadius = "8px";
//       div.style.boxShadow = "0 3px 8px rgba(0,0,0,0.2)";
//       div.innerHTML = "<b>Legend</b><br/>";
//       layers.forEach((l) => {
//         const color = l.color || "#000";
//         div.innerHTML += `<i style="background:${color};width:18px;height:10px;display:inline-block;margin-right:6px;"></i>${l.name}<br/>`;
//       });
//       return div;
//     };
//     legend.addTo(map);
//     return () => legend.remove();
//   }, [map, layers]);
//   return null;
// }

// function DataManagement() {
//   const { isAuthenticated, isLoading: authLoading } = useAuth();
//   const navigate = useNavigate();
//   const mapRef = useRef(null);

//   const [dataType, setDataType] = useState("buildings");
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
//     { key: "Aru_boundary", label: "Aru Boundary" },
//   ];

//   const API_BASE =
//     import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/spatial";

//   // ---------- Styles ----------
//   const getLayerStyle = (name, type) => {
//     switch (type) {
//       case "Aru_boundary":
//         return { color: "red", dashArray: "5,5,1,5", weight: 3, fillOpacity: 0.1 };
//       case "buildings":
//         return { color: "yellow", weight: 2, fillOpacity: 0.3 };
//       case "roads":
//         return { color: "black", weight: 2, fillOpacity: 0.2 };
//       case "footpaths":
//         return { color: "gray", weight: 2, fillOpacity: 0.2 };
//       case "vegetation":
//         return { color: "green", weight: 2, fillOpacity: 0.3 };
//       case "parking":
//         return { color: "purple", weight: 2, fillOpacity: 0.3 };
//       case "solid_waste":
//         return { color: "darkblue", weight: 2, fillOpacity: 0.3 };
//       case "electricity":
//         return { color: "khaki", weight: 2, fillOpacity: 0.3 };
//       case "water_supply":
//         return { color: "blue", weight: 2, fillOpacity: 0.3 };
//       case "drainage":
//         return { color: "gold", weight: 2, fillOpacity: 0.3 };
//       case "vimbweta":
//         return { color: "orange", weight: 2, fillOpacity: 0.3 };
//       case "security":
//         return { color: "magenta", weight: 2, fillOpacity: 0.3 };
//       case "recreational_areas":
//         return { color: "yellowgreen", weight: 2, fillOpacity: 0.3 };
//       default:
//         return { color: "gray", weight: 2, fillOpacity: 0.2 };
//     }
//   };

//   const fitGeoJSONBounds = (geojson) => {
//     const map = mapRef.current;
//     if (!map || !geojson) return;
//     const bounds = L.geoJSON(geojson).getBounds();
//     if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
//   };

//   const fitAllLayers = () => {
//     const map = mapRef.current;
//     if (!map || layers.length === 0) return;
//     const group = L.featureGroup(layers.map((l) => L.geoJSON(l.data)));
//     const bounds = group.getBounds();
//     if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] });
//   };

//   // ---------- Layer Handling ----------
//   const saveLayersToStorage = (updatedLayers) => {
//     localStorage.setItem("dm_layers", JSON.stringify(updatedLayers));
//   };

//   const addLayer = (name, geojson) => {
//     let type = dataType;
//     if (name.toLowerCase().includes("aru_boundary")) type = "Aru_boundary";
//     const color = getLayerStyle(name, type).color;
//     const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
//     const newLayer = { id, name, type, data: geojson, color };
//     const updatedLayers = [...layers, newLayer];
//     setLayers(updatedLayers);
//     saveLayersToStorage(updatedLayers);
//     setTimeout(() => fitGeoJSONBounds(geojson), 0);
//   };

//   const handleClear = () => {
//     setLayers([]);
//     localStorage.removeItem("dm_layers");
//     toast.info("Cleared all layers.");
//   };

//   // ---------- File Upload ----------
//   const handleUploadClick = () =>
//     document.getElementById("fileInputHidden")?.click();

//   const handleFilesChosen = async (e) => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;

//     for (const file of files) {
//       try {
//         if (file.name.toLowerCase().endsWith(".zip")) {
//           const buf = await file.arrayBuffer();
//           const result = await shp(buf);
//           if (Array.isArray(result)) result.forEach((fc, i) => addLayer(`${file.name} (${i + 1})`, fc));
//           else addLayer(file.name, result);
//           toast.success(`Uploaded Shapefile: ${file.name}`);
//         } else if (file.name.toLowerCase().endsWith(".kml")) {
//           const text = await file.text();
//           const xml = new DOMParser().parseFromString(text, "text/xml");
//           const fc = toGeoJSON.kml(xml);
//           addLayer(file.name, fc);
//           toast.success(`Uploaded KML: ${file.name}`);
//         } else toast.error(`Unsupported file: ${file.name}`);
//       } catch (err) {
//         console.error(err);
//         toast.error(`Failed to process: ${file.name}`);
//       }
//     }
//     setTimeout(fitAllLayers, 50);
//     e.target.value = "";
//   };

//   // ---------- Save to DB ----------
//   const handleSave = async () => {
//     if (!layers.length) return toast.error("No layers to save.");
//     const token = localStorage.getItem("token");
//     if (!token) return toast.error("Please login to save layers.");

//     try {
//       for (const layer of layers) {
//         await axios.post(
//           `${API_BASE}/save`,
//           { tableName: layer.type, name: layer.name, geojson: layer.data },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success(`Saved layer: ${layer.name}`);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to save layers to DB.");
//     }
//   };

//   // ---------- Restore from Local Storage ----------
//   useEffect(() => {
//     const storedLayers = localStorage.getItem("dm_layers");
//     if (storedLayers) {
//       try {
//         const parsed = JSON.parse(storedLayers);
//         setLayers(parsed);
//         setTimeout(fitAllLayers, 200);
//       } catch (err) {
//         console.error("Failed to parse stored layers:", err);
//         localStorage.removeItem("dm_layers");
//       }
//     }
//   }, []);

//   if (authLoading) return <div style={{ padding: 20 }}>Loading authentication...</div>;
//   if (!isAuthenticated)
//     return <div style={{ padding: 20, color: "#dc2626" }}>Please log in.</div>;

//   // ---------- UI Styles ----------
//   const containerStyle = { display: "flex", gap: 20, maxWidth: 1200, margin: "40px auto" };
//   const leftPanelStyle = { flex: 1, backgroundColor: "#fff", padding: 30, borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" };
//   const rightPanelStyle = { flex: 1, height: 620, borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" };
//   const buttonBase = { color: "#fff", padding: "10px 16px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", marginRight: 10, minWidth: 120 };
//   const btnYellow = { ...buttonBase, backgroundColor: "#f59e0b" };
//   const btnGreen = { ...buttonBase, backgroundColor: "#22c55e" };
//   const btnRed = { ...buttonBase, backgroundColor: "#ef4444" };
//   const btnGray = { ...buttonBase, backgroundColor: "#6b7280" };
//   const selectStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d1d5db", marginBottom: 18, fontSize: 14, outline: "none" };
//   const fileBoxStyle = { padding: 16, border: "1px dashed #cbd5e1", borderRadius: 12, marginBottom: 18, background: "#f8fafc" };

//   return (
//     <div style={containerStyle}>
//       <ToastContainer position="top-right" autoClose={2600} />

//       {/* Left Panel */}
//       <div style={leftPanelStyle}>
//         <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>📂 Upload Shapefile / KML</h1>
//         <label>Select Data Type</label>
//         <select style={selectStyle} value={dataType} onChange={(e) => setDataType(e.target.value)}>
//           {dataTypes.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
//         </select>

//         <div style={fileBoxStyle}>
//           <input id="fileInputHidden" type="file" accept=".zip,.kml" multiple onChange={handleFilesChosen} style={{ display: "none" }} />
//           <button style={btnYellow} onClick={handleUploadClick}>Upload</button>
//           <button style={btnGreen} onClick={handleSave}>Save</button>
//           <button style={btnRed} onClick={handleClear}>Clear</button>
//           <button style={{ ...btnGray, marginLeft: 10 }} onClick={fitAllLayers}>Fit All</button>

//           {layers.length > 0 && (
//             <div style={{ marginTop: 14 }}>
//               <div style={{ fontWeight: 700, marginBottom: 6 }}>{layers.length} layer(s) loaded:</div>
//               <div>{layers.map((l) => <span key={l.id} style={{ display: "inline-block", background: l.color, color: "#fff", padding: "4px 8px", borderRadius: 6, marginRight: 6 }}>{l.name}</span>)}</div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right Panel */}
//       <div style={rightPanelStyle}>
//         <MapContainer whenCreated={(map) => (mapRef.current = map)} center={[-6.162, 35.7516]} zoom={5} style={{ height: "100%", width: "100%" }}>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
//           <LayersControl position="topright">
//             {layers.map((layer) => (
//               <LayersControl.Overlay key={layer.id} name={layer.name} checked>
//                 <GeoJSON data={layer.data} style={getLayerStyle(layer.name, layer.type)} />
//               </LayersControl.Overlay>
//             ))}
//           </LayersControl>
//           <MapLegend layers={layers} />
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

// export default DataManagement;

// src/pages/DataManagement.jsx
import React, { useRef, useState, useEffect } from "react";
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

// Map Legend Component
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
    return () => legend.remove();
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
    { key: "aru_boundary", label: "Aru Boundary" },
  ];

  const API_BASE =
    import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/v1";

  // ---------- Styles ----------
  const getLayerStyle = (name, type) => {
    switch (type) {
      case "aru_boundary":
        return { color: "red", dashArray: "5,5,1,5", weight: 3, fillOpacity: 0.1 };
      case "buildings":
        return { color: "yellow", weight: 2, fillOpacity: 0.3 };
      case "roads":
        return { color: "black", weight: 2, fillOpacity: 0.2 };
      case "footpaths":
        return { color: "gray", weight: 2, fillOpacity: 0.2 };
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
      case "vimbweta":
        return { color: "orange", weight: 2, fillOpacity: 0.3 };
      case "security":
        return { color: "magenta", weight: 2, fillOpacity: 0.3 };
      case "recreational_areas":
        return { color: "yellowgreen", weight: 2, fillOpacity: 0.3 };
      default:
        return { color: "gray", weight: 2, fillOpacity: 0.2 };
    }
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

  // ---------- Layer Handling ----------
  const saveLayersToStorage = (updatedLayers) => {
    localStorage.setItem("dm_layers", JSON.stringify(updatedLayers));
  };

  const addLayer = (name, geojson) => {
    let type = dataType.toLowerCase();
    if (name.toLowerCase().includes("aru_boundary")) type = "aru_boundary";
    const color = getLayerStyle(name, type).color;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newLayer = { id, name, type, data: geojson, color };
    const updatedLayers = [...layers, newLayer];
    setLayers(updatedLayers);
    saveLayersToStorage(updatedLayers);
    setTimeout(() => fitGeoJSONBounds(geojson), 0);
  };

  const handleClear = () => {
    setLayers([]);
    localStorage.removeItem("dm_layers");
    toast.info("Cleared all layers.");
  };

  // ---------- File Upload ----------
  const handleUploadClick = () =>
    document.getElementById("fileInputHidden")?.click();

  const handleFilesChosen = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      try {
        if (file.name.toLowerCase().endsWith(".zip")) {
          const buf = await file.arrayBuffer();
          const result = await shp(buf);
          if (Array.isArray(result)) result.forEach((fc, i) => addLayer(`${file.name} (${i + 1})`, fc));
          else addLayer(file.name, result);
          toast.success(`Uploaded Shapefile: ${file.name}`);
        } else if (file.name.toLowerCase().endsWith(".kml")) {
          const text = await file.text();
          const xml = new DOMParser().parseFromString(text, "text/xml");
          const fc = toGeoJSON.kml(xml);
          addLayer(file.name, fc);
          toast.success(`Uploaded KML: ${file.name}`);
        } else toast.error(`Unsupported file: ${file.name}`);
      } catch (err) {
        console.error(err);
        toast.error(`Failed to process: ${file.name}`);
      }
    }
    setTimeout(fitAllLayers, 50);
    e.target.value = "";
  };

  // ---------- Save to DB ----------
  const handleSave = async () => {
    if (!layers.length) return toast.error("No layers to save.");
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login to save layers.");

    try {
      for (const layer of layers) {
        await axios.post(
          `${API_BASE}/save-geojson`,
          { tableName: layer.type, geojson: layer.data },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`Saved layer: ${layer.name}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save layers to DB.");
    }
  };

  // ---------- Restore from Local Storage ----------
  useEffect(() => {
    const storedLayers = localStorage.getItem("dm_layers");
    if (storedLayers) {
      try {
        const parsed = JSON.parse(storedLayers);
        setLayers(parsed);
        setTimeout(fitAllLayers, 200);
      } catch (err) {
        console.error("Failed to parse stored layers:", err);
        localStorage.removeItem("dm_layers");
      }
    }
  }, []);

  if (authLoading) return <div style={{ padding: 20 }}>Loading authentication...</div>;
  if (!isAuthenticated)
    return <div style={{ padding: 20, color: "#dc2626" }}>Please log in.</div>;

  // ---------- UI Styles ----------
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
