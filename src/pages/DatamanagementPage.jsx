import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as shp from "shpjs"; // library to parse shapefile .zip

function DataManagement() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [dataType, setDataType] = useState("buildings");
  const [file, setFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [progressColor, setProgressColor] = useState("#3b82f6");
  const [previewGeoJSON, setPreviewGeoJSON] = useState(null);

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
  ];

  const API_BASE =
    import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/spatial";

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError("");
    if (selectedFile && selectedFile.name.endsWith(".zip")) {
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const geojson = await shp(arrayBuffer);
        setPreviewGeoJSON(geojson);
      } catch (err) {
        setError("❌ Failed to parse shapefile. Ensure it is valid.");
        console.error(err);
      }
    }
  };

  const handleFileUpload = useCallback(async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setUploadLoading(true);
    setError("");
    setUploadProgress(0);
    setProgressColor("#3b82f6");

    try {
      const formData = new FormData();
      formData.append("shapefile", file);
      formData.append("tableName", dataType);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setProgressColor("#22c55e");
      setFile(null);
      alert("✅ Shapefile uploaded successfully!");
    } catch (err) {
      setProgressColor("#dc2626");
      if (err.response?.status === 404) {
        setError("Upload endpoint not found. Please check server config.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      } else {
        setError(err.response?.data?.error || "Failed to upload shapefile.");
      }
    } finally {
      setUploadLoading(false);
    }
  }, [file, dataType, API_BASE]);

  if (authLoading)
    return (
      <div style={{ padding: 20, fontSize: 16, color: "#555" }}>
        Loading authentication...
      </div>
    );

  if (!isAuthenticated)
    return (
      <div
        style={{
          padding: 20,
          fontSize: 16,
          fontWeight: "bold",
          color: "#dc2626",
        }}
      >
        Please log in to upload shapefiles.
      </div>
    );

  const containerStyle = {
    display: "flex",
    gap: 20,
    maxWidth: "1200px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
  };

  const leftPanelStyle = {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
  };

  const rightPanelStyle = {
    flex: 1,
    height: "600px",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  };

  const labelStyle = {
    display: "block",
    marginBottom: 8,
    fontWeight: "600",
    color: "#374151",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    marginBottom: 20,
    fontSize: 14,
  };

  const buttonStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 8,
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    marginRight: 10,
    minWidth: 120,
  });

  return (
    <div style={containerStyle}>
      {/* Left Upload Form */}
      <div style={leftPanelStyle}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          📂 Upload Shapefile
        </h1>

        {error && (
          <p style={{ color: "#dc2626", marginBottom: 20, fontWeight: "bold" }}>
            {error}
          </p>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle} htmlFor="dataType">
            Select Data Type
          </label>
          <select
            id="dataType"
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            style={inputStyle}
          >
            {dataTypes.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle} htmlFor="fileUpload">
            Select Shapefile (.zip)
          </label>
          <input
            type="file"
            id="fileUpload"
            accept=".zip"
            onChange={handleFileSelect}
            style={inputStyle}
          />
        </div>

        <button
          onClick={handleFileUpload}
          disabled={uploadLoading || !file}
          style={buttonStyle("#3b82f6")}
        >
          {uploadLoading ? `Uploading... ${uploadProgress}%` : "Upload"}
        </button>

        {/* Progress Bar */}
        {(uploadLoading || uploadProgress > 0) && (
          <div
            style={{
              backgroundColor: "#e5e7eb",
              borderRadius: 8,
              height: 16,
              marginTop: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${uploadProgress}%`,
                backgroundColor: progressColor,
                transition: "width 0.3s ease",
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Right Map Preview */}
      <div style={rightPanelStyle}>
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {previewGeoJSON && <GeoJSON data={previewGeoJSON} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default DataManagement;
