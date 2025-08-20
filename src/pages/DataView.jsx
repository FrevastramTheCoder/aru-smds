import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as XLSX from "xlsx";
import Papa from "papaparse";

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const DataView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [layerName, setLayerName] = useState("buildings");

  // Available datasets/layers
  const availableLayers = ["buildings", "roads", "water_supply", "security"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await DataServers.getData(layerName);
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(`Failed to fetch ${layerName} data`);
      }
      setLoading(false);
    };
    fetchData();
  }, [layerName]);

  const executeQuery = () => {
    setLoading(true);
    const result =
      searchTerm.toLowerCase() === "all data"
        ? data
        : data.filter((item) => {
            return (
              item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.id.toString().includes(searchTerm) ||
              item.uses?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.dimensions?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.latitude?.toString().includes(searchTerm) ||
              item.longitude?.toString().includes(searchTerm) ||
              item.geo?.toLowerCase().includes(searchTerm.toLowerCase())
            );
          });

    setFilteredData(result);
    setLoading(false);
    toast.success(`Query run successfully. Rows affected: ${result.length}.`);
  };

  const convertToGeoJSON = () => ({
    type: "FeatureCollection",
    features: filteredData.map((item) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [item.longitude, item.latitude] },
      properties: {
        id: item.id,
        name: item.name,
        uses: item.uses,
        dimensions: item.dimensions,
        geo: item.geo,
      },
    })),
  });

  const exportToGeoJSON = () => {
    const geoJSON = convertToGeoJSON();
    const blob = new Blob([JSON.stringify(geoJSON)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layerName}_data.geojson`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layerName}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredData");
    const blob = XLSX.write(workbook, { bookType: "xlsx", type: "blob" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layerName}_data.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto my-8">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6 gap-2">
        <select
          value={layerName}
          onChange={(e) => setLayerName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          {availableLayers.map((layer) => (
            <option key={layer} value={layer}>
              {layer}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Query data here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-1/3 text-sm"
        />
        <button onClick={executeQuery} className="rounded bg-green-600 text-white py-2 px-4 hover:bg-green-700 transition text-sm">
          View/Query Data
        </button>
        <button onClick={() => setShowMap(!showMap)} className="rounded bg-yellow-600 text-white py-2 px-4 hover:bg-yellow-700 transition text-sm">
          View Map
        </button>
        <div className="flex gap-2">
          <button onClick={exportToCSV} className="rounded bg-purple-600 text-white py-2 px-4 hover:bg-purple-700 transition text-sm">
            Export CSV
          </button>
          <button onClick={exportToGeoJSON} className="rounded bg-purple-600 text-white py-2 px-4 hover:bg-purple-700 transition text-sm">
            Export GeoJSON
          </button>
          <button onClick={exportToXLSX} className="rounded bg-purple-600 text-white py-2 px-4 hover:bg-purple-700 transition text-sm">
            Export XLSX
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Use</th>
              <th className="px-4 py-2">Dimensions</th>
              <th className="px-4 py-2">Latitude</th>
              <th className="px-4 py-2">Longitude</th>
              <th className="px-4 py-2">GeoType</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-6">Loading...</td></tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <tr key={item.id} className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.uses}</td>
                  <td>{item.dimensions}</td>
                  <td>{item.latitude}</td>
                  <td>{item.longitude}</td>
                  <td>{item.geo}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="text-center py-6 text-blue-500">No data output</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showMap && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 h-3/4">
            <button onClick={() => setShowMap(false)} className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-600 rounded-full p-2">X</button>
            <MapContainer center={[0, 0]} zoom={8} style={{ width: "100%", height: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {filteredData.map((item) => item.latitude && item.longitude && (
                <Marker
                  key={item.id}
                  position={[item.latitude, item.longitude]}
                  icon={new L.Icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png" })}
                >
                  <Popup>
                    <strong>{item.name}</strong><br />
                    {item.dimensions}<br />
                    Latitude: {item.latitude}<br />
                    Longitude: {item.longitude}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataView;
