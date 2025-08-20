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
  Polygon,
  Polyline,
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

function DataView() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [layerName, setLayerName] = useState(""); // Initialize as empty to force selection
  const mapRef = useRef(null);

  // Available layers (based on valid endpoints, avoiding 404 errors)
  const availableLayers = [
    { value: "security", label: "Security" },
    { value: "water_supply", label: "Water Supply" },
    { value: "drainage", label: "Drainage" },
    { value: "vimbweta", label: "Vimbweta" }, // Verify if this is correct
    // Add more layers only if confirmed valid via API documentation
  ];

  // Fetch data with rate-limiting and error handling
  const fetchData = async (selectedLayer) => {
    if (!selectedLayer) {
      toast.error("Please select a layer to fetch data.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://smds.onrender.com/api/v1/auth/geojson/${selectedLayer}?simplify=0.0005`,
        {
          headers: {
            // Add Authorization header if required
            // 'Authorization': `Bearer ${yourToken}`,
          },
        }
      );
      if (response.data && response.data.features) {
        const rows = response.data.features.map((f, i) => ({
          id: i + 1,
          attributes: f.properties,
          geometry: f.geometry,
        }));
        setData(rows);
        setFilteredData(rows);
        toast.success(`Successfully fetched ${selectedLayer} data.`);
      } else {
        toast.error(`No features found for ${selectedLayer}.`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status === 404) {
        toast.error(`Layer "${selectedLayer}" not found on the server.`);
      } else if (err.response?.status === 429) {
        toast.error("Rate limit exceeded. Please wait and try again.");
      } else {
        toast.error(`Failed to fetch layer: ${selectedLayer}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when layerName changes
  useEffect(() => {
    if (layerName) {
      fetchData(layerName);
    }
    // eslint-disable-next-line
  }, [layerName]);

  // Search functionality
  const executeQuery = () => {
    if (!layerName) {
      toast.error("Please select a layer before searching.");
      return;
    }
    setLoading(true);
    const result =
      searchTerm.toLowerCase() === "all data"
        ? data
        : data.filter((f) =>
            Object.values(f.attributes).some((val) =>
              val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
    setFilteredData(result);
    setLoading(false);
    toast.success(`Query run successfully. Rows found: ${result.length}`);
  };

  // Export functions
  const exportToGeoJSON = () => {
    if (!filteredData.length) {
      toast.error("No data to export.");
      return;
    }
    const geoJSON = {
      type: "FeatureCollection",
      features: filteredData.map((f) => ({
        type: "Feature",
        geometry: f.geometry,
        properties: f.attributes,
      })),
    };
    const blob = new Blob([JSON.stringify(geoJSON)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layerName}_data.geojson`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (!filteredData.length) {
      toast.error("No data to export.");
      return;
    }
    const rows = filteredData.map((f) => f.attributes);
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layerName}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToXLSX = () => {
    if (!filteredData.length) {
      toast.error("No data to export.");
      return;
    }
    const rows = filteredData.map((f) => f.attributes);
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Spatial Data");
    const blob = XLSX.write(workbook, { bookType: "xlsx", type: "blob" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layerName}_data.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle shape creation for filtering
  const onCreated = (e) => {
    const layer = e.layer;
    let result = [];
    if (layer instanceof L.Polygon) {
      result = data.filter(
        (f) =>
          f.geometry?.type === "Point" &&
          layer
            .getBounds()
            .contains([
              f.geometry.coordinates[1],
              f.geometry.coordinates[0],
            ])
      );
    }
    setFilteredData(result);
    toast.info(`Filtered ${result.length} features inside drawn shape`);
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Data View</h1>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        {/* Layer Selector Dropdown */}
        <select
          value={layerName}
          onChange={(e) => setLayerName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-1/4 focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="" disabled>
            Select a Layer
          </option>
          {availableLayers.map((layer) => (
            <option key={layer.value} value={layer.value}>
              {layer.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Query data here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring focus:ring-blue-300 text-sm"
        />
        <button
          onClick={executeQuery}
          className="rounded bg-green-600 text-white py-2 px-4 font-semibold hover:bg-green-700 transition text-sm"
          disabled={!layerName || loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
        <button
          onClick={() => setShowMap(!showMap)}
          className="rounded bg-yellow-600 text-white py-2 px-4 font-semibold hover:bg-yellow-700 transition text-sm"
          disabled={!layerName}
        >
          View Map
        </button>
        <div className="relative inline-block text-left">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="rounded bg-purple-600 text-white py-2 px-4 font-semibold hover:bg-purple-700 transition text-sm"
            disabled={!filteredData.length}
          >
            Export
          </button>
          {showExportMenu && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <button
                  onClick={exportToCSV}
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                >
                  Export as CSV
                </button>
                <button
                  onClick={exportToGeoJSON}
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                >
                  Export as GeoJSON
                </button>
                <button
                  onClick={exportToXLSX}
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                >
                  Export as XLSX
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      {filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-2 py-1">ID</th>
                {filteredData[0] &&
                  Object.keys(filteredData[0].attributes).map((col) => (
                    <th key={col} className="border border-gray-300 px-2 py-1">
                      {col}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-2 py-1">{row.id}</td>
                  {Object.values(row.attributes).map((val, i) => (
                    <td key={i} className="border border-gray-300 px-2 py-1">
                      {val?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          {layerName ? "No data available for this layer." : "Please select a layer."}
        </p>
      )}

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-4/5 h-4/5 relative">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-600 rounded-full p-2"
            >
              X
            </button>
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
                      circlemarker: false,
                      marker: false,
                      polygon: true,
                      polyline: true,
                    }}
                  />
                </Suspense>
              </FeatureGroup>

              {/* Render features */}
              {filteredData.map((f, i) => {
                if (f.geometry?.type === "Point") {
                  return (
                    <Marker
                      key={i}
                      position={[
                        f.geometry.coordinates[1],
                        f.geometry.coordinates[0],
                      ]}
                    >
                      <Popup>
                        {Object.entries(f.attributes).map(([k, v]) => (
                          <div key={k}>
                            <strong>{k}:</strong> {v?.toString()}
                          </div>
                        ))}
                      </Popup>
                    </Marker>
                  );
                } else if (f.geometry?.type === "Polygon") {
                  return (
                    <Polygon
                      key={i}
                      positions={f.geometry.coordinates[0].map((c) => [
                        c[1],
                        c[0],
                      ])}
                      color="blue"
                    />
                  );
                } else if (f.geometry?.type === "LineString") {
                  return (
                    <Polyline
                      key={i}
                      positions={f.geometry.coordinates.map((c) => [c[1], c[0]])}
                      color="red"
                    />
                  );
                }
                return null;
              })}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataView;