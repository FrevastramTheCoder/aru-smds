// src/pages/DataView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import * as turf from "@turf/turf";
import Papa from "papaparse";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function DataView() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    axios
      .get(
        "https://smds.onrender.com/api/v1/auth/geojson/security?simplify=0.0005"
      )
      .then((res) => {
        if (res.data && res.data.features) {
          setData(res.data.features);
        } else {
          setError("No data found");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data");
      });
  }, []);

  const executeQuery = () => {
    setLoading(true);
    const result =
      searchTerm.toLowerCase() === "all data"
        ? data
        : data.filter((f) =>
            Object.values(f.properties).some((val) =>
              val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
          );

    setFilteredData(result);
    setLoading(false);
    toast.success(`Query run successfully. Rows affected: ${result.length}`);
  };

  const exportToGeoJSON = () => {
    const geoJSON = {
      type: "FeatureCollection",
      features: filteredData.length > 0 ? filteredData : data,
    };
    const blob = new Blob([JSON.stringify(geoJSON)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spatial_data.geojson";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const rows = (filteredData.length > 0 ? filteredData : data).map(
      (f) => f.properties
    );
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
    const rows = (filteredData.length > 0 ? filteredData : data).map(
      (f) => f.properties
    );
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

  return (
    <div className="container mx-auto my-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Spatial Data Table</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Query data here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-1/3 focus:outline-none focus:ring focus:ring-blue-300 text-sm"
        />
        <button
          onClick={executeQuery}
          className="rounded bg-green-600 text-white py-2 px-4 font-semibold hover:bg-green-700 transition text-sm"
        >
          View/Query Data
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
              <button
                onClick={exportToCSV}
                className="text-gray-700 block px-4 py-2 text-sm"
              >
                Export as CSV
              </button>
              <button
                onClick={exportToGeoJSON}
                className="text-gray-700 block px-4 py-2 text-sm"
              >
                Export as GeoJSON
              </button>
              <button
                onClick={exportToXLSX}
                className="text-gray-700 block px-4 py-2 text-sm"
              >
                Export as XLSX
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gray-100">
              {data[0] &&
                Object.keys(data[0].properties).map((key) => (
                  <th
                    key={key}
                    className="text-left font-semibold text-gray-600 uppercase tracking-wider py-3 px-6"
                  >
                    {key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={data[0] ? Object.keys(data[0].properties).length : 1}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  Loading...
                </td>
              </tr>
            ) : (filteredData.length > 0 ? filteredData : data).length > 0 ? (
              (filteredData.length > 0 ? filteredData : data).map((f, i) => (
                <tr
                  key={i}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  {Object.values(f.properties).map((val, j) => (
                    <td key={j} className="px-3 py-2 text-gray-700 text-sm">
                      {val?.toString()}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={data[0] ? Object.keys(data[0].properties).length : 1}
                  className="text-center py-6 text-blue-500 text-sm"
                >
                  No data output. Execute a query to get output.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showMap && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 h-3/4 relative">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-600 rounded-full p-2"
            >
              X
            </button>
            <MapContainer
              center={[0, 0]}
              zoom={5}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {(filteredData.length > 0 ? filteredData : data)
                .filter((f) => f.geometry?.type === "Point")
                .map((f, i) => (
                  <Marker
                    key={i}
                    position={[
                      f.geometry.coordinates[1],
                      f.geometry.coordinates[0],
                    ]}
                  >
                    <Popup>
                      {Object.entries(f.properties).map(([k, v]) => (
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
