
// src/pages/DatamanagementPage.jsx
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

function DatamanagementPage() {
  const [dataMap, setDataMap] = useState({});
  const [filteredMap, setFilteredMap] = useState({});
  const [layerVisibility, setLayerVisibility] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    layer: "",
  });
  const mapRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const vis = {};
    layersList.forEach((l) => (vis[l.key] = true));
    setLayerVisibility(vis);
  }, []);

  useEffect(() => {
    layersList.forEach((l) => fetchLayerData(l.key));
  }, []);

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

  const toggleLayer = (key) => {
    setLayerVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  const onCreated = (e) => {
    toast.info("Polygon drawn. Filtering not implemented in design mode.");
  };

  return (
    <div className="flex max-w-7xl mx-auto shadow-2xl h-[700px] mt-4 mb-4 bg-gray-100">
      <ToastContainer />
      {/* Left Form Panel */}
      <div className="w-1/2 px-6 py-6 flex flex-col justify-start items-start bg-white">
        <h1 className="text-2xl font-bold mb-4">Data Management</h1>

        {/* Search & Layer Selection */}
        <div className="w-full space-y-4 mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
          <button
            onClick={executeSearch}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Search
          </button>
        </div>

        {/* Layer Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
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
      </div>

      {/* Right Map Panel */}
      <div className="w-1/2 flex flex-col" style={{ height: "100%" }}>
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
                draw={{
                  rectangle: true,
                  circle: false,
                  polygon: true,
                  polyline: true,
                  marker: false,
                }}
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
