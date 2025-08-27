;
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [visibleColumns, setVisibleColumns] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [layerInfo, setLayerInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(50);

  const { layerName } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://smds.onrender.com/api/v1/auth/data/${layerName}?page=${page}&limit=${limit}`,
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
        
        // Set pagination info
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages);
          setCurrentPage(res.data.pagination.currentPage);
        }
        
        // Initialize visible columns based on first item's structure
        if (rows.length > 0) {
          const initialColumns = {
            id: true,
            // Add all attribute fields
            ...Object.keys(rows[0].attributes || {}).reduce((acc, key) => {
              acc[`attributes.${key}`] = true;
              return acc;
            }, {}),
            geometry: true,
          };
          setVisibleColumns(initialColumns);
          
          // Set column order
          setColumnOrder([
            'id',
            ...Object.keys(rows[0].attributes || {}).map(key => `attributes.${key}`),
            'geometry'
          ]);
        }
        
        // Set layer info if available
        if (res.data.layerInfo) {
          setLayerInfo(res.data.layerInfo);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (layerName) {
      fetchData();
    }
  }, [layerName, limit]);

  const executeQuery = () => {
    setLoading(true);
    const result =
      searchTerm.toLowerCase() === "all data"
        ? data
        : data.filter((f) =>
            Object.values(f.attributes).some((val) =>
              val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            ) || 
            f.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            JSON.stringify(f.geometry).toLowerCase().includes(searchTerm.toLowerCase())
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

  // Function to render value based on its type
  const renderValue = (value, isGeometry = false) => {
    if (value === null || value === undefined) return "N/A";
    
    if (typeof value === "object") {
      if (isGeometry) {
        // Special handling for geometry - show type and simplified info
        const geomType = value.type || "Unknown";
        const coordCount = value.coordinates 
          ? JSON.stringify(value.coordinates).length 
          : 0;
        return (
          <div>
            <div><strong>Type:</strong> {geomType}</div>
            <div>
              <span style={expandStyle} onClick={() => toggleRow(value)}>
                {expandedRows[value] ? "Hide Coordinates" : "Show Coordinates"}
              </span>
            </div>
            {expandedRows[value] && (
              <pre style={{ fontSize: '10px', marginTop: '5px', maxHeight: '200px', overflow: 'auto' }}>
                {JSON.stringify(value, null, 2)}
              </pre>
            )}
          </div>
        );
      }
      
      return expandedRows[value] ? (
        <pre style={{ maxHeight: '200px', overflow: 'auto' }}>{JSON.stringify(value, null, 2)}</pre>
      ) : (
        <span style={expandStyle} onClick={() => toggleRow(value)}>
          {Array.isArray(value) ? `[Array: ${value.length} items]` : `{Object: ${Object.keys(value).length} keys}`}
        </span>
      );
    }
    
    // For very long strings, truncate and show expand option
    if (typeof value === "string" && value.length > 100) {
      return expandedRows[value] ? (
        <div>
          <div>{value}</div>
          <span style={expandStyle} onClick={() => toggleRow(value)}>Show Less</span>
        </div>
      ) : (
        <div>
          <div>{value.substring(0, 100)}...</div>
          <span style={expandStyle} onClick={() => toggleRow(value)}>Show More</span>
        </div>
      );
    }
    
    return value.toString();
  };

  // --- Export Functions ---
  const exportCSV = () => {
    const dataToExport = filteredData.map((row) => {
      const obj = { id: row.id };
      
      // Add all attributes as separate columns
      Object.entries(row.attributes || {}).forEach(([key, value]) => {
        obj[key] = typeof value === 'object' ? JSON.stringify(value) : value;
      });
      
      // Add geometry
      obj.geometry = JSON.stringify(row.geometry);
      
      return obj;
    });
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layerName}_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const dataToExport = filteredData.map((row) => {
      const obj = { id: row.id, attributes: row.attributes, geometry: row.geometry };
      return obj;
    });
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layerName}_export.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportXLSX = () => {
    const dataToExport = filteredData.map((row) => {
      const obj = { id: row.id };
      
      // Add all attributes as separate columns
      Object.entries(row.attributes || {}).forEach(([key, value]) => {
        obj[key] = typeof value === 'object' ? JSON.stringify(value) : value;
      });
      
      // Add geometry
      obj.geometry = JSON.stringify(row.geometry);
      
      return obj;
    });
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, layerName);
    XLSX.writeFile(workbook, `${layerName}_export.xlsx`);
  };

  // --- Inline CSS ---
  const containerStyle = { maxWidth: "95%", margin: "40px auto", padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };
  const titleStyle = { fontSize: 32, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#1f2937" };
  const controlsStyle = { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginBottom: 20, alignItems: "center" };
  const inputStyle = { padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, flex: "1 1 300px" };
  const buttonStyle = (bgColor) => ({ backgroundColor: bgColor, color: "#fff", padding: "10px 16px", borderRadius: 8, fontWeight: "600", border: "none", cursor: "pointer", transition: "all 0.2s", minWidth: 120, marginTop: 5 });
  const tableContainerStyle = { overflowX: "auto", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb" };
  const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: "max-content" };
  const thStyle = { backgroundColor: "#f3f4f6", color: "#374151", textAlign: "left", fontWeight: "600", padding: "12px 16px", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0 };
  const tdStyle = { padding: "12px 16px", borderBottom: "1px solid #e5e7eb", color: "#1f2937", fontSize: 14, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" };
  const expandStyle = { fontSize: 12, color: "#3b82f6", cursor: "pointer", marginLeft: 10 };
  const checkboxContainer = { display: "flex", gap: 15, flexWrap: "wrap", marginBottom: 15, padding: 10, backgroundColor: "#f9fafb", borderRadius: 8 };
  const paginationStyle = { display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 20 };
  const pageButtonStyle = { padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", backgroundColor: "#fff", cursor: "pointer" };
  const activePageButtonStyle = { ...pageButtonStyle, backgroundColor: "#3b82f6", color: "#fff" };

  return (
    <div style={containerStyle}>
      <ToastContainer />
      <h1 style={titleStyle}>Data View - {layerName}</h1>

      {/* Layer Info */}
      {Object.keys(layerInfo).length > 0 && (
        <div style={{ marginBottom: 20, padding: 15, backgroundColor: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#0369a1" }}>Layer Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {Object.entries(layerInfo).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value?.toString()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={controlsStyle}>
        <input 
          type="text" 
          placeholder="Search across all fields..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={inputStyle} 
          onKeyPress={(e) => e.key === 'Enter' && executeQuery()}
        />
        <button onClick={executeQuery} style={buttonStyle("#22c55e")}>Search</button>
        <button onClick={() => navigate("/map")} style={buttonStyle("#f59e0b")}>View Map</button>
        <button onClick={exportCSV} style={buttonStyle("#2563eb")}>Export CSV</button>
        <button onClick={exportJSON} style={buttonStyle("#8b5cf6")}>Export JSON</button>
        <button onClick={exportXLSX} style={buttonStyle("#ec4899")}>Export XLSX</button>
        
        {/* Page size selector */}
        <select 
          value={limit} 
          onChange={(e) => setLimit(parseInt(e.target.value))}
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db" }}
        >
          <option value={10}>10 rows</option>
          <option value={25}>25 rows</option>
          <option value={50}>50 rows</option>
          <option value={100}>100 rows</option>
        </select>
      </div>

      {/* Column toggle */}
      {columnOrder.length > 0 && (
        <div style={checkboxContainer}>
          <span style={{ fontWeight: "bold", marginRight: 10 }}>Show Columns:</span>
          {columnOrder.map((col) => (
            <label key={col} style={{ fontSize: 14, color: "#374151", display: "flex", alignItems: "center" }}>
              <input 
                type="checkbox" 
                checked={visibleColumns[col] || false} 
                onChange={() => toggleColumn(col)} 
                style={{ marginRight: 6 }} 
              />
              {col.startsWith("attributes.") ? col.replace("attributes.", "") : col}
            </label>
          ))}
        </div>
      )}

      {/* Table */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {columnOrder.map(col => 
                visibleColumns[col] && (
                  <th key={col} style={thStyle}>
                    {col.startsWith("attributes.") ? col.replace("attributes.", "") : col}
                  </th>
                )
              )}
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columnOrder.filter(col => visibleColumns[col]).length + 1} style={{ ...tdStyle, textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? "#f9fafb" : "#fff" }}>
                  {columnOrder.map(col => 
                    visibleColumns[col] && (
                      <td key={col} style={tdStyle} title={typeof item[col] === 'object' ? JSON.stringify(item[col]) : item[col]}>
                        {col === 'id' ? item.id : 
                         col === 'geometry' ? renderValue(item.geometry, true) : 
                         col.startsWith('attributes.') ? renderValue(item.attributes[col.replace('attributes.', '')]) : 
                         renderValue(item[col])}
                      </td>
                    )
                  )}
                  <td style={tdStyle}>
                    <span style={expandStyle} onClick={() => toggleRow(item.id)}>
                      {expandedRows[item.id] ? "Collapse All" : "Expand All"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnOrder.filter(col => visibleColumns[col]).length + 1} style={{ ...tdStyle, textAlign: "center" }}>
                  No data found. Try a different search term.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={paginationStyle}>
          <button 
            onClick={() => fetchData(currentPage - 1)} 
            disabled={currentPage === 1}
            style={pageButtonStyle}
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            if (pageNum < 1 || pageNum > totalPages) return null;
            
            return (
              <button
                key={pageNum}
                onClick={() => fetchData(pageNum)}
                style={pageNum === currentPage ? activePageButtonStyle : pageButtonStyle}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            onClick={() => fetchData(currentPage + 1)} 
            disabled={currentPage === totalPages}
            style={pageButtonStyle}
          >
            Next
          </button>
          
          <span style={{ marginLeft: 10 }}>
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

export default DataView;