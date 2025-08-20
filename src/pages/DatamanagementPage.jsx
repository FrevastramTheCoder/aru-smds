// src/pages/DatamanagementPage..jsx
import React, { useEffect, useState, useRef, Suspense } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  FeatureGroup,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "../App.css";

// Fix default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Dynamically import EditControl
const EditControl = React.lazy(() =>
  import("react-leaflet-draw").then((mod) => ({ default: mod.EditControl }))
);

// Layer options
const layersList = [
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
];

function DataView() {
  const [dataMap, setDataMap] = useState({}); // { layerKey: data[] }
  const [filteredMap, setFilteredMap] = useState({}); // filtered per layer
  const [layerVisibility, setLayerVisibility] = useState({}); // { layerKey: boolean }
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const token = localStorage.getItem("token");

  // Initialize layer visibility
  useEffect(() => {
    const vis = {};
    layersList.forEach((l) => (vis[l.key] = true));
    setLayerVisibility(vis);
  }, []);

  // Fetch data for one layer
  const fetchLayerData = async (layer) => {
    setLoading(true);
    try {
      let res;
      try {
        res = await axios.get(
          `https://smds.onrender.com/api/v1/auth/data/${layer}?page=1&limit=1000`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        if (err.response?.status === 404) {
          res = await axios.get(
            `https://smds.onrender.com/api/v1/auth/geojson/${layer}?simplify=0.0005`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const geoRows = res.data.features.map((f, i) => ({
            id: i + 1,
            attributes: f.properties || {},
            geometry: f.geometry || {},
          }));
          setDataMap((prev) => ({ ...prev, [layer]: geoRows }));
          setFilteredMap((prev) => ({ ...prev, [layer]: geoRows }));
          setLoading(false);
          return;
        } else {
          throw err;
        }
      }
      if (res.data) {
        const rows = res.data.data.map((r) => ({
          id: r.id,
          attributes: r.attributes,
          geometry: r.geometry,
        }));
        setDataMap((prev) => ({ ...prev, [layer]: rows }));
        setFilteredMap((prev) => ({ ...prev, [layer]: rows }));
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to fetch layer ${layer}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all layers on mount
  useEffect(() => {
    layersList.forEach((l) => fetchLayerData(l.key));
  }, []);

  // Toggle layer visibility
  const toggleLayer = (key) => {
    setLayerVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Search/filter function
  const executeSearch = () => {
    const newFiltered = {};
    layersList.forEach((l) => {
      const rows = dataMap[l.key] || [];
      newFiltered[l.key] =
        searchTerm.toLowerCase() === "all data"
          ? rows
          : rows.filter((f) =>
              Object.values(f.attributes).some((val) =>
                val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
              )
            );
    });
    setFilteredMap(newFiltered);
    toast.success("Search completed.");
  };

  // Export functions per layer
  const exportLayerToGeoJSON = (layer) => {
    const layerData = filteredMap[layer] || [];
    const geoJSON = {
      type: "FeatureCollection",
      features: layerData.map((f) => ({
        type: "Feature",
        geometry: f.geometry,
        properties: f.attributes,
      })),
    };
    const blob = new Blob([JSON.stringify(geoJSON)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layer}.geojson`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportLayerToCSV = (layer) => {
    const rows = filteredMap[layer] || [];
    const csv = Papa.unparse(rows.map((f) => f.attributes));
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layer}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportLayerToXLSX = (layer) => {
    const rows = filteredMap[layer] || [];
    const worksheet = XLSX.utils.json_to_sheet(rows.map((f) => f.attributes));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, layer);
    const blob = XLSX.write(workbook, { bookType: "xlsx", type: "blob" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layer}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Polygon drawing filter
  const onCreated = (e) => {
    const layer = e.layer;
    const newFiltered = { ...filteredMap };
    layersList.forEach((l) => {
      const rows = dataMap[l.key] || [];
      if (layer instanceof L.Polygon) {
        newFiltered[l.key] = rows.filter(
          (f) =>
            f.geometry?.type === "Point" &&
            layer.getBounds().contains([f.geometry.coordinates[1], f.geometry.coordinates[0]])
        );
      }
    });
    setFilteredMap(newFiltered);
    toast.info("Filtered features inside drawn polygon.");
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Data & Multi-Layer Map</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/3"
        />
        <button
          onClick={executeSearch}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Search
        </button>
      </div>

      {/* Layer toggle & export */}
      <div className="flex flex-wrap gap-2 mb-6">
        {layersList.map((l) => (
          <div key={l.key} className="flex gap-1">
            <button
              onClick={() => toggleLayer(l.key)}
              className={`px-3 py-1 rounded font-semibold ${
                layerVisibility[l.key] ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700"
              }`}
            >
              {l.label}
            </button>
            <button
              onClick={() => exportLayerToGeoJSON(l.key)}
              className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              GeoJSON
            </button>
            <button
              onClick={() => exportLayerToCSV(l.key)}
              className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              CSV
            </button>
            <button
              onClick={() => exportLayerToXLSX(l.key)}
              className="px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              XLSX
            </button>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="w-full h-[600px] relative">
        <MapContainer
          ref={mapRef}
          center={[0, 0]}
          zoom={5}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FeatureGroup>
            <Suspense fallback={null}>
              <EditControl
                position="topright"
                onCreated={onCreated}
                draw={{ rectangle: true, circle: false, polygon: true, polyline: true, marker: false }}
              />
            </Suspense>
          </FeatureGroup>
          <LayersControl position="topright">
            {layersList.map(
              (l) =>
                layerVisibility[l.key] && (
                  <LayersControl.Overlay key={l.key} name={l.label} checked>
                    <LayerGroup>
                      {(filteredMap[l.key] || [])
                        .filter((f) => f.geometry?.type === "Point")
                        .map((f, i) => (
                          <Marker
                            key={i}
                            position={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}
                          >
                            <Popup>
                              {Object.entries(f.attributes).map(([k, v]) => (
                                <div key={k}>
                                  <strong>{k}:</strong> {v?.toString()}
                                </div>
                              ))}
                            </Popup>
                          </Marker>
                        ))}
                    </LayerGroup>
                  </LayersControl.Overlay>
                )
            )}
          </LayersControl>
        </MapContainer>
      </div>
    </div>
  );
}

export default DatamanagementPage;
