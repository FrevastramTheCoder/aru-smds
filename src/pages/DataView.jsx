import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import Papa from "papaparse";

// Predefined data types
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

// Layer styles
const getLayerStyle = (type) => {
  const styles = {
    aru_boundary: { color: "red", dashArray: "5,5,1,5", weight: 3, fillOpacity: 0.1 },
    buildings: { color: "yellow", weight: 2, fillOpacity: 0.3 },
    roads: { color: "black", weight: 2, fillOpacity: 0.2 },
    footpaths: { color: "gray", weight: 2, fillOpacity: 0.2 },
    vegetation: { color: "green", weight: 2, fillOpacity: 0.3 },
    parking: { color: "purple", weight: 2, fillOpacity: 0.3 },
    solid_waste: { color: "darkblue", weight: 2, fillOpacity: 0.7 },
    electricity: { color: "khaki", weight: 2, fillOpacity: 0.3 },
    water_supply: { color: "blue", weight: 2, fillOpacity: 0.3 },
    drainage: { color: "gold", weight: 2, fillOpacity: 0.3 },
    vimbweta: { color: "orange", weight: 2, fillOpacity: 0.7 },
    security: { color: "magenta", weight: 2, fillOpacity: 0.3 },
    recreational_areas: { color: "yellowgreen", weight: 2, fillOpacity: 0.3 },
  };
  return styles[type] || { color: "gray", weight: 2, fillOpacity: 0.2 };
};

// Point radius
const getPointRadius = (type) => {
  switch (type) {
    case "solid_waste":
      return 8;
    case "vimbweta":
      return 6;
    default:
      return 5;
  }
};

function DataView() {
  const { layerName } = useParams();
  const effectiveLayer = layerName || ""; // Default to empty string
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [visibleColumns, setVisibleColumns] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [layerInfo, setLayerInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(50);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedElement, setSelectedElement] = useState("all");

  const API_BASE = import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/spatial";

  // Debug logging
  useEffect(() => {
    console.log("[DataView] Route params:", { layerName });
    console.log("[DataView] Location:", location);
  }, [layerName, location]);

  // Fetch data
  const fetchData = async (page = 1, elementType = "all") => {
    if (!effectiveLayer) {
      toast.error("Layer name is missing in the URL");
      return;
    }

    setLoading(true);
    try {
      let url = `${API_BASE}/data/${effectiveLayer}?page=${page}&limit=${limit}`;
      if (elementType !== "all") {
        url += `&elementType=${elementType}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        const rows = res.data.data.map((r) => {
          const attributes = r.attributes || {};
          const geometry = r.geometry || {};
          const elementType = r.elementType || effectiveLayer || "unknown";
          const style = getLayerStyle(elementType);
          return {
            id: r.id,
            attributes,
            geometry,
            elementType,
            color: style.color,
            pointRadius: geometry.type === "Point" ? getPointRadius(elementType) : null,
          };
        });

        setData(rows);

        // Group by element type
        const grouped = {};
        rows.forEach((row) => {
          const type = row.elementType;
          if (!grouped[type]) grouped[type] = [];
          grouped[type].push(row);
        });
        setGroupedData(grouped);

        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages);
          setCurrentPage(res.data.pagination.currentPage);
        }

        if (rows.length > 0) {
          const initialColumns = {
            id: true,
            elementType: true,
            ...Object.keys(rows[0].attributes).reduce((acc, key) => {
              acc[`attributes.${key}`] = true;
              return acc;
            }, {}),
            geometry: true,
            color: true,
          };
          setVisibleColumns(initialColumns);
          setColumnOrder([
            "id",
            "elementType",
            ...Object.keys(rows[0].attributes).map((key) => `attributes.${key}`),
            "geometry",
            "color",
          ]);
        }

        if (res.data.layerInfo) setLayerInfo(res.data.layerInfo);
      } else {
        toast.error(res.data?.error || "Failed to fetch data");
      }
    } catch (err) {
      console.error("[DataView] Fetch error:", err);
      toast.error(err.response?.data?.error || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!token) {
      toast.error("Please log in to view data");
      return;
    }
    fetchData(1, selectedElement);
  }, [effectiveLayer, limit, token, selectedElement]);

  const handleElementChange = (elementType) => {
    setSelectedElement(elementType);
    setActiveTab(elementType);
    fetchData(1, elementType);
  };

  const toggleRow = (id) => setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleColumn = (col) => setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));

  const renderValue = (value, isGeometry = false, elementType) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") {
      if (isGeometry) {
        const geomType = value.type || "Unknown";
        const isPoint = geomType === "Point";
        return (
          <div>
            <div>
              <strong>Type:</strong> {geomType} {isPoint && `(Radius: ${getPointRadius(elementType)}px)`}
            </div>
            <div>
              <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(JSON.stringify(value))}>
                {expandedRows[JSON.stringify(value)] ? "Hide Coordinates" : "Show Coordinates"}
              </span>
            </div>
            {expandedRows[JSON.stringify(value)] && (
              <pre style={{ fontSize: 10, marginTop: 5, maxHeight: 200, overflow: "auto" }}>
                {JSON.stringify(value, null, 2)}
              </pre>
            )}
          </div>
        );
      }
      return expandedRows[JSON.stringify(value)] ? (
        <pre style={{ maxHeight: 200, overflow: "auto" }}>{JSON.stringify(value, null, 2)}</pre>
      ) : (
        <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(JSON.stringify(value))}>
          {Array.isArray(value) ? `[Array: ${value.length} items]` : `{Object: ${Object.keys(value).length} keys}`}
        </span>
      );
    }

    if (typeof value === "string" && value.length > 100) {
      return expandedRows[value] ? (
        <div>
          <div>{value}</div>
          <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(value)}>Show Less</span>
        </div>
      ) : (
        <div>
          <div>{value.substring(0, 100)}...</div>
          <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(value)}>Show More</span>
        </div>
      );
    }

    return value.toString();
  };

  const getDataToDisplay = () => selectedElement === "all" ? groupedData : { [selectedElement]: groupedData[selectedElement] || [] };

  // Rendering and export functions remain the same as your previous code...
  // For brevity, you can keep exportCSV, exportJSON, exportXLSX, renderElementTable, etc.

  return (
    <div style={{ maxWidth: "95%", margin: "40px auto" }}>
      <ToastContainer />
      {!effectiveLayer ? (
        <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
          Error: Layer name is missing in the URL. Please navigate to a valid layer, e.g., /data-view/buildings
        </div>
      ) : (
        <div>
          {/* Your tabs, table, search, export buttons, etc. */}
        </div>
      )}
    </div>
  );
}

export default DataView;
