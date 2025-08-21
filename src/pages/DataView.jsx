// src/pages/DataView.jsx
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
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Sparklines, SparklinesLine } from "react-sparklines";
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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);

  const mapRef = useRef(null);

  const layerName = "security"; // Change this to any spatial layer you want
  const token = localStorage.getItem("token"); // JWT token stored in localStorage

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://smds.onrender.com/api/v1/auth/data/${layerName}?page=${pageNumber}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data) {
        const rows = res.data.data.map((r) => ({
          id: r.id,
          attributes: r.attributes,
          geometry: r.geometry,
        }));
        setData(rows);
        setFilteredData(rows);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const executeQuery = () => {
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

  const exportToGeoJSON = () => {
    const geoJSON = {
      type: "FeatureCollection",
      features: filteredData.map((f) => ({
        type: "Feature",
        geometry: f.geometry,
        properties: f.attributes,
      })),
    };
    const blob = new Blob([JSON.stringify(geoJSON)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spatial_data.geojson";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const rows = filteredData.map((f) => f.attributes);
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spatial_data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToXLSX = () => {
    const rows = filteredData.map((f) => f.attributes);
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Spatial Data");
    const blob = XLSX.write(workbook, { bookType: "xlsx", type: "blob" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spatial_data.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const onCreated = (e) => {
    const layer = e.layer;
    let result = [];
    if (layer instanceof L.Polygon) {
      result = data.filter(
        (f) =>
          f.geometry?.type === "Point" &&
          layer.getBounds().contains([f.geometry.coordinates[1], f.geometry.coordinates[0]])
      );
    }
    setFilteredData(result);
    toast.info(`Filtered ${result.length} features inside drawn shape`);
  };

  const totalPoints = filteredData.filter((f) => f.geometry?.type === "Point").length;
  const totalPolygons = filteredData.filter((f) => f.geometry?.type === "Polygon").length;
  const totalLines = filteredData.filter((f) => f.geometry?.type === "LineString").length;
  const totalFeatures = filteredData.length;

  return (
    <div className="container mx-auto my-8 px-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Data View</h1>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
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
        >
          Search
        </button>
        <button
          onClick={() => setShowMap(!showMap)}
          className="rounded bg-yellow-600 text-white py-2 px-4 font-semibold hover:bg-yellow-700 transition text-sm"
        >
          View Map
        </button>
        <div className="relative inline-block text-left">
          <button className="rounded bg-purple-600 text-white py-2 px-4 font-semibold hover:bg-purple-700 transition text-sm">
            Export
          </button>
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <button onClick={exportToCSV} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                Export as CSV
              </button>
              <button onClick={exportToGeoJSON} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                Export as GeoJSON
              </button>
              <button onClick={exportToXLSX} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                Export as XLSX
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
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

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => fetchData(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => fetchData(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

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
            <MapContainer ref={mapRef} center={[0, 0]} zoom={5} style={{ width: "100%", height: "100%" }}>
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
              {filteredData
                .filter((f) => f.geometry?.type === "Point")
                .map((f, i) => (
                  <Marker key={i} position={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}>
                    <Popup>
                      {Object.entries(f.attributes).map(([k, v]) => (
                        <div key={k}>
                          <strong>{k}:</strong> {v?.toString()}
                        </div>
                      ))}
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataView;
