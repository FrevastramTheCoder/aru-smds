import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import Papa from "papaparse";

function DataView() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    attributes: true,
    geometry: true,
  });

  const layerName = "security";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://smds.onrender.com/api/v1/auth/data/${layerName}?page=1&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data) {
        const rows = res.data.data.map((r) => ({
          id: r.id,
          attributes: r.attributes,
          geometry: r.geometry,
        }));
        setData(rows);
        setFilteredData(rows);
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

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  // --- Export Functions ---
  const exportCSV = () => {
    const dataToExport = filteredData.map((row) => {
      const obj = {};
      if (visibleColumns.id) obj.id = row.id;
      if (visibleColumns.attributes) obj.attributes = JSON.stringify(row.attributes);
      if (visibleColumns.geometry) obj.geometry = JSON.stringify(row.geometry);
      return obj;
    });
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data_export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const dataToExport = filteredData.map((row) => {
      const obj = {};
      if (visibleColumns.id) obj.id = row.id;
      if (visibleColumns.attributes) obj.attributes = row.attributes;
      if (visibleColumns.geometry) obj.geometry = row.geometry;
      return obj;
    });
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data_export.json";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportXLSX = () => {
    const dataToExport = filteredData.map((row) => {
      const obj = {};
      if (visibleColumns.id) obj.id = row.id;
      if (visibleColumns.attributes) obj.attributes = JSON.stringify(row.attributes);
      if (visibleColumns.geometry) obj.geometry = JSON.stringify(row.geometry);
      return obj;
    });
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data_export.xlsx");
  };

  // --- Inline CSS ---
  const containerStyle = { maxWidth: 1100, margin: "40px auto", padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };
  const titleStyle = { fontSize: 32, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#1f2937" };
  const controlsStyle = { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginBottom: 20, alignItems: "center" };
  const inputStyle = { padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, flex: "1 1 300px" };
  const buttonStyle = (bgColor) => ({ backgroundColor: bgColor, color: "#fff", padding: "10px 16px", borderRadius: 8, fontWeight: "600", border: "none", cursor: "pointer", transition: "all 0.2s", minWidth: 120, marginTop: 5 });
  const tableContainerStyle = { overflowX: "auto", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb" };
  const tableStyle = { width: "100%", borderCollapse: "collapse" };
  const thStyle = { backgroundColor: "#f3f4f6", color: "#374151", textAlign: "left", fontWeight: "600", padding: "12px 16px", borderBottom: "1px solid #e5e7eb" };
  const tdStyle = { padding: "12px 16px", borderBottom: "1px solid #e5e7eb", color: "#1f2937", fontSize: 14 };
  const expandStyle = { fontSize: 12, color: "#3b82f6", cursor: "pointer", marginLeft: 10 };
  const checkboxContainer = { display: "flex", gap: 15, flexWrap: "wrap", marginBottom: 15 };

  return (
    <div style={containerStyle}>
      <ToastContainer />
      <h1 style={titleStyle}>Data View</h1>

      {/* Controls */}
      <div style={controlsStyle}>
        <input type="text" placeholder="Query data here..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={inputStyle} />
        <button onClick={executeQuery} style={buttonStyle("#22c55e")}>Search</button>
        <button onClick={() => navigate("/map")} style={buttonStyle("#f59e0b")}>View Map</button>
        <button onClick={exportCSV} style={buttonStyle("#2563eb")}>Export CSV</button>
        <button onClick={exportJSON} style={buttonStyle("#8b5cf6")}>Export JSON</button>
        <button onClick={exportXLSX} style={buttonStyle("#ec4899")}>Export XLSX</button>
      </div>

      {/* Column toggle */}
      <div style={checkboxContainer}>
        {Object.keys(visibleColumns).map((col) => (
          <label key={col} style={{ fontSize: 14, color: "#374151" }}>
            <input type="checkbox" checked={visibleColumns[col]} onChange={() => toggleColumn(col)} style={{ marginRight: 6 }} />
            {col.charAt(0).toUpperCase() + col.slice(1)}
          </label>
        ))}
      </div>

      {/* Table */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {visibleColumns.id && <th style={thStyle}>ID</th>}
              {visibleColumns.attributes && <th style={thStyle}>Attributes</th>}
              {visibleColumns.geometry && <th style={thStyle}>Geometry</th>}
              <th style={thStyle}>Expand</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ ...tdStyle, textAlign: "center" }}>Loading...</td></tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <React.Fragment key={item.id}>
                  <tr style={{ backgroundColor: index % 2 === 0 ? "#f9fafb" : "#fff" }}>
                    {visibleColumns.id && <td style={tdStyle}>{item.id}</td>}
                    {visibleColumns.attributes && <td style={tdStyle}>{expandedRows[item.id] ? JSON.stringify(item.attributes, null, 2) : "..."}</td>}
                    {visibleColumns.geometry && <td style={tdStyle}>{expandedRows[item.id] ? JSON.stringify(item.geometry, null, 2) : "..."}</td>}
                    <td style={tdStyle}><span style={expandStyle} onClick={() => toggleRow(item.id)}>{expandedRows[item.id] ? "Collapse" : "Expand"}</span></td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr><td colSpan={4} style={{ ...tdStyle, textAlign: "center" }}>No data found. Execute a query.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataView;
