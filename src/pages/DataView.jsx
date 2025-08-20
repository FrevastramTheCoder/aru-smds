import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // ✅ use axios directly
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as XLSX from "xlsx";
import * as turf from "@turf/turf";
import Papa from "papaparse";

const API_BASE = "https://smds.onrender.com/api/v1/auth"; // ✅ backend base URL

const DataTable = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/data`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/data/${deleteId}`);
      setData((prevData) => prevData.filter((item) => item.id !== deleteId));
      setFilteredData((prevData) =>
        prevData.filter((item) => item.id !== deleteId)
      );
      toast.success("Data deleted successfully.");
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete data.");
    }
    setShowConfirm(false);
    setDeleteId(null);
  };

  const executeQuery = () => {
    setLoading(true);
    const result =
      searchTerm.toLowerCase() === "all data"
        ? data
        : data.filter((item) => {
            return (
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.id.toString().includes(searchTerm) ||
              item.uses.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.dimensions?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.latitude.toString().includes(searchTerm) ||
              item.longitude.toString().includes(searchTerm) ||
              item.geo.toLowerCase().includes(searchTerm.toLowerCase())
            );
          });

    setFilteredData(result);
    setLoading(false);
    toast.success(`Query run successfully. Rows affected: ${result.length}.`);
  };

  const handleViewMap = () => {
    setShowMap(!showMap);
  };

  // ✅ Export functions stay the same
  const convertToGeoJSON = () => {
    const geoJSON = {
      type: "FeatureCollection",
      features: filteredData.map((item) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [item.longitude, item.latitude],
        },
        properties: {
          id: item.id,
          name: item.name,
          uses: item.uses,
          dimensions: item.dimensions,
          geo: item.geo,
        },
      })),
    };

    return geoJSON;
  };

  const exportToGeoJSON = () => {
    const geoJSON = convertToGeoJSON();
    const blob = new Blob([JSON.stringify(geoJSON)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filteredData.geojson";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filteredData.csv";
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
    a.download = "filteredData.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto my-8">
      <ToastContainer />
      {/* ...rest of your JSX stays the same */}
    </div>
  );
};

export default DataView;
