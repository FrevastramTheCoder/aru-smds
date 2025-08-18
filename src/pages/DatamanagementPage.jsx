import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function DataManagement() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [dataType, setDataType] = useState("buildings");
  const [file, setFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [progressColor, setProgressColor] = useState("#3b82f6"); // default blue

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

  // Handle shapefile upload
  const handleFileUpload = useCallback(async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setUploadLoading(true);
    setError("");
    setUploadProgress(0);
    setProgressColor("#3b82f6"); // reset to blue when starting

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

      setProgressColor("#22c55e"); // green when done
      setFile(null);
      alert("✅ Shapefile uploaded successfully!");
    } catch (err) {
      setProgressColor("#dc2626"); // red on error
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

  if (authLoading) return <div className="p-4">Loading authentication...</div>;
  if (!isAuthenticated)
    return (
      <div className="p-4 text-red-500 font-semibold">
        Please log in to upload shapefiles.
      </div>
    );

  return (
    <div className="page-container">
      {/* Top Navigation Buttons */}
      <div className="nav-buttons">
        <button className="btn btn-green" onClick={() => navigate("/data-view")}>
          Data View
        </button>
        <button className="btn btn-blue" onClick={() => navigate("/map")}>
          Map View
        </button>
        <button className="btn btn-purple" disabled>
          Upload Shapefile
        </button>
      </div>

      {/* Upload Card */}
      <div className="card">
        <h1 className="title">📂 Upload Shapefile</h1>

        {error && <p className="error-text">{error}</p>}

        <div className="form-group">
          <label htmlFor="dataType">Select Data Type</label>
          <select
            id="dataType"
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
          >
            {dataTypes.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fileUpload">Select Shapefile (.zip)</label>
          <input
            type="file"
            id="fileUpload"
            accept=".zip"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button
          onClick={handleFileUpload}
          disabled={uploadLoading || !file}
          className="btn btn-blue full-width"
        >
          {uploadLoading ? `Uploading... ${uploadProgress}%` : "Upload"}
        </button>

        {/* Progress Bar */}
        {uploadLoading || uploadProgress > 0 ? (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${uploadProgress}%`,
                background: progressColor,
              }}
            ></div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DataManagement;
