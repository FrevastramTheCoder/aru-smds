// ;
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as XLSX from "xlsx";
// import Papa from "papaparse";

// function DataView() {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [expandedRows, setExpandedRows] = useState({});
//   const [visibleColumns, setVisibleColumns] = useState({});
//   const [columnOrder, setColumnOrder] = useState([]);
//   const [layerInfo, setLayerInfo] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [limit, setLimit] = useState(50);

//   const { layerName } = useParams();
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   const fetchData = async (page = 1) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `https://smds.onrender.com/api/v1/auth/data/${layerName}?page=${page}&limit=${limit}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       if (res.data) {
//         const rows = res.data.data.map((r) => ({
//           id: r.id,
//           attributes: r.attributes,
//           geometry: r.geometry,
//         }));
        
//         setData(rows);
//         setFilteredData(rows);
        
//         // Set pagination info
//         if (res.data.pagination) {
//           setTotalPages(res.data.pagination.totalPages);
//           setCurrentPage(res.data.pagination.currentPage);
//         }
        
//         // Initialize visible columns based on first item's structure
//         if (rows.length > 0) {
//           const initialColumns = {
//             id: true,
//             // Add all attribute fields
//             ...Object.keys(rows[0].attributes || {}).reduce((acc, key) => {
//               acc[`attributes.${key}`] = true;
//               return acc;
//             }, {}),
//             geometry: true,
//           };
//           setVisibleColumns(initialColumns);
          
//           // Set column order
//           setColumnOrder([
//             'id',
//             ...Object.keys(rows[0].attributes || {}).map(key => `attributes.${key}`),
//             'geometry'
//           ]);
//         }
        
//         // Set layer info if available
//         if (res.data.layerInfo) {
//           setLayerInfo(res.data.layerInfo);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (layerName) {
//       fetchData();
//     }
//   }, [layerName, limit]);

//   const executeQuery = () => {
//     setLoading(true);
//     const result =
//       searchTerm.toLowerCase() === "all data"
//         ? data
//         : data.filter((f) =>
//             Object.values(f.attributes).some((val) =>
//               val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
//             ) || 
//             f.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
//             JSON.stringify(f.geometry).toLowerCase().includes(searchTerm.toLowerCase())
//           );
//     setFilteredData(result);
//     setLoading(false);
//     toast.success(`Query run successfully. Rows found: ${result.length}`);
//   };

//   const toggleRow = (id) => {
//     setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const toggleColumn = (column) => {
//     setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
//   };

//   // Function to render value based on its type
//   const renderValue = (value, isGeometry = false) => {
//     if (value === null || value === undefined) return "N/A";
    
//     if (typeof value === "object") {
//       if (isGeometry) {
//         // Special handling for geometry - show type and simplified info
//         const geomType = value.type || "Unknown";
//         const coordCount = value.coordinates 
//           ? JSON.stringify(value.coordinates).length 
//           : 0;
//         return (
//           <div>
//             <div><strong>Type:</strong> {geomType}</div>
//             <div>
//               <span style={expandStyle} onClick={() => toggleRow(value)}>
//                 {expandedRows[value] ? "Hide Coordinates" : "Show Coordinates"}
//               </span>
//             </div>
//             {expandedRows[value] && (
//               <pre style={{ fontSize: '10px', marginTop: '5px', maxHeight: '200px', overflow: 'auto' }}>
//                 {JSON.stringify(value, null, 2)}
//               </pre>
//             )}
//           </div>
//         );
//       }
      
//       return expandedRows[value] ? (
//         <pre style={{ maxHeight: '200px', overflow: 'auto' }}>{JSON.stringify(value, null, 2)}</pre>
//       ) : (
//         <span style={expandStyle} onClick={() => toggleRow(value)}>
//           {Array.isArray(value) ? `[Array: ${value.length} items]` : `{Object: ${Object.keys(value).length} keys}`}
//         </span>
//       );
//     }
    
//     // For very long strings, truncate and show expand option
//     if (typeof value === "string" && value.length > 100) {
//       return expandedRows[value] ? (
//         <div>
//           <div>{value}</div>
//           <span style={expandStyle} onClick={() => toggleRow(value)}>Show Less</span>
//         </div>
//       ) : (
//         <div>
//           <div>{value.substring(0, 100)}...</div>
//           <span style={expandStyle} onClick={() => toggleRow(value)}>Show More</span>
//         </div>
//       );
//     }
    
//     return value.toString();
//   };

//   // --- Export Functions ---
//   const exportCSV = () => {
//     const dataToExport = filteredData.map((row) => {
//       const obj = { id: row.id };
      
//       // Add all attributes as separate columns
//       Object.entries(row.attributes || {}).forEach(([key, value]) => {
//         obj[key] = typeof value === 'object' ? JSON.stringify(value) : value;
//       });
      
//       // Add geometry
//       obj.geometry = JSON.stringify(row.geometry);
      
//       return obj;
//     });
//     const csv = Papa.unparse(dataToExport);
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${layerName}_export.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const exportJSON = () => {
//     const dataToExport = filteredData.map((row) => {
//       const obj = { id: row.id, attributes: row.attributes, geometry: row.geometry };
//       return obj;
//     });
//     const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${layerName}_export.json`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const exportXLSX = () => {
//     const dataToExport = filteredData.map((row) => {
//       const obj = { id: row.id };
      
//       // Add all attributes as separate columns
//       Object.entries(row.attributes || {}).forEach(([key, value]) => {
//         obj[key] = typeof value === 'object' ? JSON.stringify(value) : value;
//       });
      
//       // Add geometry
//       obj.geometry = JSON.stringify(row.geometry);
      
//       return obj;
//     });
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, layerName);
//     XLSX.writeFile(workbook, `${layerName}_export.xlsx`);
//   };

//   // --- Inline CSS ---
//   const containerStyle = { maxWidth: "95%", margin: "40px auto", padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };
//   const titleStyle = { fontSize: 32, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#1f2937" };
//   const controlsStyle = { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginBottom: 20, alignItems: "center" };
//   const inputStyle = { padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, flex: "1 1 300px" };
//   const buttonStyle = (bgColor) => ({ backgroundColor: bgColor, color: "#fff", padding: "10px 16px", borderRadius: 8, fontWeight: "600", border: "none", cursor: "pointer", transition: "all 0.2s", minWidth: 120, marginTop: 5 });
//   const tableContainerStyle = { overflowX: "auto", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb" };
//   const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: "max-content" };
//   const thStyle = { backgroundColor: "#f3f4f6", color: "#374151", textAlign: "left", fontWeight: "600", padding: "12px 16px", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0 };
//   const tdStyle = { padding: "12px 16px", borderBottom: "1px solid #e5e7eb", color: "#1f2937", fontSize: 14, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" };
//   const expandStyle = { fontSize: 12, color: "#3b82f6", cursor: "pointer", marginLeft: 10 };
//   const checkboxContainer = { display: "flex", gap: 15, flexWrap: "wrap", marginBottom: 15, padding: 10, backgroundColor: "#f9fafb", borderRadius: 8 };
//   const paginationStyle = { display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 20 };
//   const pageButtonStyle = { padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", backgroundColor: "#fff", cursor: "pointer" };
//   const activePageButtonStyle = { ...pageButtonStyle, backgroundColor: "#3b82f6", color: "#fff" };

//   return (
//     <div style={containerStyle}>
//       <ToastContainer />
//       <h1 style={titleStyle}>Data View - {layerName}</h1>

//       {/* Layer Info */}
//       {Object.keys(layerInfo).length > 0 && (
//         <div style={{ marginBottom: 20, padding: 15, backgroundColor: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd" }}>
//           <h3 style={{ margin: "0 0 10px 0", color: "#0369a1" }}>Layer Information</h3>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
//             {Object.entries(layerInfo).map(([key, value]) => (
//               <div key={key}>
//                 <strong>{key}:</strong> {value?.toString()}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Controls */}
//       <div style={controlsStyle}>
//         <input 
//           type="text" 
//           placeholder="Search across all fields..." 
//           value={searchTerm} 
//           onChange={(e) => setSearchTerm(e.target.value)} 
//           style={inputStyle} 
//           onKeyPress={(e) => e.key === 'Enter' && executeQuery()}
//         />
//         <button onClick={executeQuery} style={buttonStyle("#22c55e")}>Search</button>
//         <button onClick={() => navigate("/map")} style={buttonStyle("#f59e0b")}>View Map</button>
//         <button onClick={exportCSV} style={buttonStyle("#2563eb")}>Export CSV</button>
//         <button onClick={exportJSON} style={buttonStyle("#8b5cf6")}>Export JSON</button>
//         <button onClick={exportXLSX} style={buttonStyle("#ec4899")}>Export XLSX</button>
        
//         {/* Page size selector */}
//         <select 
//           value={limit} 
//           onChange={(e) => setLimit(parseInt(e.target.value))}
//           style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db" }}
//         >
//           <option value={10}>10 rows</option>
//           <option value={25}>25 rows</option>
//           <option value={50}>50 rows</option>
//           <option value={100}>100 rows</option>
//         </select>
//       </div>

//       {/* Column toggle */}
//       {columnOrder.length > 0 && (
//         <div style={checkboxContainer}>
//           <span style={{ fontWeight: "bold", marginRight: 10 }}>Show Columns:</span>
//           {columnOrder.map((col) => (
//             <label key={col} style={{ fontSize: 14, color: "#374151", display: "flex", alignItems: "center" }}>
//               <input 
//                 type="checkbox" 
//                 checked={visibleColumns[col] || false} 
//                 onChange={() => toggleColumn(col)} 
//                 style={{ marginRight: 6 }} 
//               />
//               {col.startsWith("attributes.") ? col.replace("attributes.", "") : col}
//             </label>
//           ))}
//         </div>
//       )}

//       {/* Table */}
//       <div style={tableContainerStyle}>
//         <table style={tableStyle}>
//           <thead>
//             <tr>
//               {columnOrder.map(col => 
//                 visibleColumns[col] && (
//                   <th key={col} style={thStyle}>
//                     {col.startsWith("attributes.") ? col.replace("attributes.", "") : col}
//                   </th>
//                 )
//               )}
//               <th style={thStyle}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={columnOrder.filter(col => visibleColumns[col]).length + 1} style={{ ...tdStyle, textAlign: "center" }}>
//                   Loading...
//                 </td>
//               </tr>
//             ) : filteredData.length > 0 ? (
//               filteredData.map((item, index) => (
//                 <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? "#f9fafb" : "#fff" }}>
//                   {columnOrder.map(col => 
//                     visibleColumns[col] && (
//                       <td key={col} style={tdStyle} title={typeof item[col] === 'object' ? JSON.stringify(item[col]) : item[col]}>
//                         {col === 'id' ? item.id : 
//                          col === 'geometry' ? renderValue(item.geometry, true) : 
//                          col.startsWith('attributes.') ? renderValue(item.attributes[col.replace('attributes.', '')]) : 
//                          renderValue(item[col])}
//                       </td>
//                     )
//                   )}
//                   <td style={tdStyle}>
//                     <span style={expandStyle} onClick={() => toggleRow(item.id)}>
//                       {expandedRows[item.id] ? "Collapse All" : "Expand All"}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={columnOrder.filter(col => visibleColumns[col]).length + 1} style={{ ...tdStyle, textAlign: "center" }}>
//                   No data found. Try a different search term.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div style={paginationStyle}>
//           <button 
//             onClick={() => fetchData(currentPage - 1)} 
//             disabled={currentPage === 1}
//             style={pageButtonStyle}
//           >
//             Previous
//           </button>
          
//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             let pageNum;
//             if (currentPage <= 3) {
//               pageNum = i + 1;
//             } else if (currentPage >= totalPages - 2) {
//               pageNum = totalPages - 4 + i;
//             } else {
//               pageNum = currentPage - 2 + i;
//             }
            
//             if (pageNum < 1 || pageNum > totalPages) return null;
            
//             return (
//               <button
//                 key={pageNum}
//                 onClick={() => fetchData(pageNum)}
//                 style={pageNum === currentPage ? activePageButtonStyle : pageButtonStyle}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}
          
//           <button 
//             onClick={() => fetchData(currentPage + 1)} 
//             disabled={currentPage === totalPages}
//             style={pageButtonStyle}
//           >
//             Next
//           </button>
          
//           <span style={{ marginLeft: 10 }}>
//             Page {currentPage} of {totalPages}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

// // export default DataView;

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as XLSX from "xlsx";
// import Papa from "papaparse";

// function DataView() {
//   const [data, setData] = useState([]);
//   const [groupedData, setGroupedData] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [expandedRows, setExpandedRows] = useState({});
//   const [visibleColumns, setVisibleColumns] = useState({});
//   const [columnOrder, setColumnOrder] = useState([]);
//   const [layerInfo, setLayerInfo] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [limit, setLimit] = useState(50);
//   const [activeTab, setActiveTab] = useState("all");
//   const [selectedElement, setSelectedElement] = useState("all"); // New state for dropdown selection

//   const { layerName } = useParams();
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   const fetchData = async (page = 1) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `https://smds.onrender.com/api/v1/auth/data/${layerName}?page=${page}&limit=${limit}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       if (res.data) {
//         const rows = res.data.data.map((r) => ({
//           id: r.id,
//           attributes: r.attributes,
//           geometry: r.geometry,
//           // Extract element type from attributes for grouping
//           elementType: r.attributes?.type || r.attributes?.feature_type || "unknown",
//         }));
        
//         setData(rows);
        
//         // Group data by element type
//         const grouped = {};
//         rows.forEach(row => {
//           const type = row.elementType;
//           if (!grouped[type]) {
//             grouped[type] = [];
//           }
//           grouped[type].push(row);
//         });
//         setGroupedData(grouped);
        
//         // Set pagination info
//         if (res.data.pagination) {
//           setTotalPages(res.data.pagination.totalPages);
//           setCurrentPage(res.data.pagination.currentPage);
//         }
        
//         // Initialize visible columns based on first item's structure
//         if (rows.length > 0) {
//           const initialColumns = {
//             id: true,
//             // Add all attribute fields
//             ...Object.keys(rows[0].attributes || {}).reduce((acc, key) => {
//               acc[`attributes.${key}`] = true;
//               return acc;
//             }, {}),
//             geometry: true,
//           };
//           setVisibleColumns(initialColumns);
          
//           // Set column order
//           setColumnOrder([
//             'id',
//             ...Object.keys(rows[0].attributes || {}).map(key => `attributes.${key}`),
//             'geometry'
//           ]);
//         }
        
//         // Set layer info if available
//         if (res.data.layerInfo) {
//           setLayerInfo(res.data.layerInfo);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (layerName) {
//       fetchData();
//     }
//   }, [layerName, limit]);

//   const executeQuery = () => {
//     setLoading(true);
//     const result =
//       searchTerm.toLowerCase() === "all data"
//         ? data
//         : data.filter((f) =>
//             Object.values(f.attributes).some((val) =>
//               val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
//             ) || 
//             f.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
//             JSON.stringify(f.geometry).toLowerCase().includes(searchTerm.toLowerCase())
//           );
    
//     // Regroup the filtered data
//     const grouped = {};
//     result.forEach(row => {
//       const type = row.elementType;
//       if (!grouped[type]) {
//         grouped[type] = [];
//       }
//       grouped[type].push(row);
//     });
//     setGroupedData(grouped);
    
//     setLoading(false);
//     toast.success(`Query run successfully. Rows found: ${result.length}`);
//   };

//   const toggleRow = (id) => {
//     setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const toggleColumn = (column) => {
//     setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
//   };

//   // Function to render value based on its type
//   const renderValue = (value, isGeometry = false) => {
//     if (value === null || value === undefined) return "N/A";
    
//     if (typeof value === "object") {
//       if (isGeometry) {
//         // Special handling for geometry - show type and simplified info
//         const geomType = value.type || "Unknown";
//         const coordCount = value.coordinates 
//           ? JSON.stringify(value.coordinates).length 
//           : 0;
//         return (
//           <div>
//             <div><strong>Type:</strong> {geomType}</div>
//             <div>
//               <span style={expandStyle} onClick={() => toggleRow(value)}>
//                 {expandedRows[value] ? "Hide Coordinates" : "Show Coordinates"}
//               </span>
//             </div>
//             {expandedRows[value] && (
//               <pre style={{ fontSize: '10px', marginTop: '5px', maxHeight: '200px', overflow: 'auto' }}>
//                 {JSON.stringify(value, null, 2)}
//               </pre>
//             )}
//           </div>
//         );
//       }
      
//       return expandedRows[value] ? (
//         <pre style={{ maxHeight: '200px', overflow: 'auto' }}>{JSON.stringify(value, null, 2)}</pre>
//       ) : (
//         <span style={expandStyle} onClick={() => toggleRow(value)}>
//           {Array.isArray(value) ? `[Array: ${value.length} items]` : `{Object: ${Object.keys(value).length} keys}`}
//         </span>
//       );
//     }
    
//     // For very long strings, truncate and show expand option
//     if (typeof value === "string" && value.length > 100) {
//       return expandedRows[value] ? (
//         <div>
//           <div>{value}</div>
//           <span style={expandStyle} onClick={() => toggleRow(value)}>Show Less</span>
//         </div>
//       ) : (
//         <div>
//           <div>{value.substring(0, 100)}...</div>
//           <span style={expandStyle} onClick={() => toggleRow(value)}>Show More</span>
//         </div>
//       );
//     }
    
//     return value.toString();
//   };

//   // --- Export Functions ---
//   const exportCSV = () => {
//     // Use selected element data if a specific element is selected, otherwise use all data
//     const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => {
//       const obj = { id: row.id };
      
//       // Add all attributes as separate columns
//       Object.entries(row.attributes || {}).forEach(([key, value]) => {
//         obj[key] = typeof value === 'object' ? JSON.stringify(value) : value;
//       });
      
//       // Add geometry
//       obj.geometry = JSON.stringify(row.geometry);
      
//       return obj;
//     });
//     const csv = Papa.unparse(dataToExport);
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${layerName}_${selectedElement !== "all" ? selectedElement + "_" : ""}export.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const exportJSON = () => {
//     // Use selected element data if a specific element is selected, otherwise use all data
//     const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => {
//       const obj = { id: row.id, attributes: row.attributes, geometry: row.geometry };
//       return obj;
//     });
//     const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${layerName}_${selectedElement !== "all" ? selectedElement + "_" : ""}export.json`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const exportXLSX = () => {
//     // Use selected element data if a specific element is selected, otherwise use all data
//     const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => {
//       const obj = { id: row.id };
      
//       // Add all attributes as separate columns
//       Object.entries(row.attributes || {}).forEach(([key, value]) => {
//         obj[key] = typeof value === 'object' ? JSON.stringify(value) : value;
//       });
      
//       // Add geometry
//       obj.geometry = JSON.stringify(row.geometry);
      
//       return obj;
//     });
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, layerName);
//     XLSX.writeFile(workbook, `${layerName}_${selectedElement !== "all" ? selectedElement + "_" : ""}export.xlsx`);
//   };

//   // --- Inline CSS ---
//   const containerStyle = { maxWidth: "95%", margin: "40px auto", padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };
//   const titleStyle = { fontSize: 32, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#1f2937" };
//   const controlsStyle = { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginBottom: 20, alignItems: "center" };
//   const inputStyle = { padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, flex: "1 1 300px" };
//   const buttonStyle = (bgColor) => ({ backgroundColor: bgColor, color: "#fff", padding: "10px 16px", borderRadius: 8, fontWeight: "600", border: "none", cursor: "pointer", transition: "all 0.2s", minWidth: 120, marginTop: 5 });
//   const tableContainerStyle = { overflowX: "auto", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", marginBottom: 20 };
//   const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: "max-content" };
//   const thStyle = { backgroundColor: "#f3f4f6", color: "#374151", textAlign: "left", fontWeight: "600", padding: "12px 16px", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0 };
//   const tdStyle = { padding: "12px 16px", borderBottom: "1px solid #e5e7eb", color: "#1f2937", fontSize: 14, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" };
//   const expandStyle = { fontSize: 12, color: "#3b82f6", cursor: "pointer", marginLeft: 10 };
//   const checkboxContainer = { display: "flex", gap: 15, flexWrap: "wrap", marginBottom: 15, padding: 10, backgroundColor: "#f9fafb", borderRadius: 8 };
//   const paginationStyle = { display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 20 };
//   const pageButtonStyle = { padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", backgroundColor: "#fff", cursor: "pointer" };
//   const activePageButtonStyle = { ...pageButtonStyle, backgroundColor: "#3b82f6", color: "#fff" };
//   const tabContainerStyle = { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" };
//   const tabStyle = { padding: "10px 20px", borderRadius: 8, border: "1px solid #d1d5db", backgroundColor: "#f9fafb", cursor: "pointer" };
//   const activeTabStyle = { ...tabStyle, backgroundColor: "#3b82f6", color: "#fff", borderColor: "#3b82f6" };
//   const selectStyle = { padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, marginBottom: 15 };

//   // Function to render a table for a specific element type
//   const renderElementTable = (elementType, elementData) => {
//     return (
//       <div key={elementType} style={tableContainerStyle}>
//         <h3 style={{ margin: "0 0 15px 0", padding: "10px 15px", backgroundColor: "#e0f2fe", borderRadius: "8px 8px 0 0" }}>
//           {elementType.toUpperCase()} ({elementData.length} items)
//         </h3>
//         <table style={tableStyle}>
//           <thead>
//             <tr>
//               {columnOrder.map(col => 
//                 visibleColumns[col] && (
//                   <th key={col} style={thStyle}>
//                     {col.startsWith("attributes.") ? col.replace("attributes.", "") : col}
//                   </th>
//                 )
//               )}
//               <th style={thStyle}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {elementData.map((item, index) => (
//               <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? "#f9fafb" : "#fff" }}>
//                 {columnOrder.map(col => 
//                   visibleColumns[col] && (
//                     <td key={col} style={tdStyle} title={typeof item[col] === 'object' ? JSON.stringify(item[col]) : item[col]}>
//                       {col === 'id' ? item.id : 
//                        col === 'geometry' ? renderValue(item.geometry, true) : 
//                        col.startsWith('attributes.') ? renderValue(item.attributes[col.replace('attributes.', '')]) : 
//                        renderValue(item[col])}
//                     </td>
//                   )
//                 )}
//                 <td style={tdStyle}>
//                   <span style={expandStyle} onClick={() => toggleRow(item.id)}>
//                     {expandedRows[item.id] ? "Collapse All" : "Expand All"}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   // Get the data to display based on selection
//   const getDataToDisplay = () => {
//     if (selectedElement === "all") {
//       return groupedData;
//     } else {
//       return { [selectedElement]: groupedData[selectedElement] || [] };
//     }
//   };

//   return (
//     <div style={containerStyle}>
//       <ToastContainer />
//       <h1 style={titleStyle}>Data View - {layerName}</h1>

//       {/* Layer Info */}
//       {Object.keys(layerInfo).length > 0 && (
//         <div style={{ marginBottom: 20, padding: 15, backgroundColor: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd" }}>
//           <h3 style={{ margin: "0 0 10px 0", color: "#0369a1" }}>Layer Information</h3>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
//             {Object.entries(layerInfo).map(([key, value]) => (
//               <div key={key}>
//                 <strong>{key}:</strong> {value?.toString()}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Controls */}
//       <div style={controlsStyle}>
//         <input 
//           type="text" 
//           placeholder="Search across all fields..." 
//           value={searchTerm} 
//           onChange={(e) => setSearchTerm(e.target.value)} 
//           style={inputStyle} 
//           onKeyPress={(e) => e.key === 'Enter' && executeQuery()}
//         />
//         <button onClick={executeQuery} style={buttonStyle("#22c55e")}>Search</button>
//         <button onClick={() => navigate("/map")} style={buttonStyle("#f59e0b")}>View Map</button>
//         <button onClick={exportCSV} style={buttonStyle("#2563eb")}>Export CSV</button>
//         <button onClick={exportJSON} style={buttonStyle("#8b5cf6")}>Export JSON</button>
//         <button onClick={exportXLSX} style={buttonStyle("#ec4899")}>Export XLSX</button>
        
//         {/* Page size selector */}
//         <select 
//           value={limit} 
//           onChange={(e) => setLimit(parseInt(e.target.value))}
//           style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db" }}
//         >
//           <option value={10}>10 rows</option>
//           <option value={25}>25 rows</option>
//           <option value={50}>50 rows</option>
//           <option value={100}>100 rows</option>
//         </select>
//       </div>

//       {/* Element type selector */}
//       <div style={{ marginBottom: 20 }}>
//         <label htmlFor="elementSelector" style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
//           Select Element Type:
//         </label>
//         <select
//           id="elementSelector"
//           value={selectedElement}
//           onChange={(e) => {
//             setSelectedElement(e.target.value);
//             setActiveTab(e.target.value);
//           }}
//           style={selectStyle}
//         >
//           <option value="all">All Elements</option>
//           {Object.keys(groupedData).map(type => (
//             <option key={type} value={type}>
//               {type} ({groupedData[type].length})
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Column toggle */}
//       {columnOrder.length > 0 && (
//         <div style={checkboxContainer}>
//           <span style={{ fontWeight: "bold", marginRight: 10 }}>Show Columns:</span>
//           {columnOrder.map((col) => (
//             <label key={col} style={{ fontSize: 14, color: "#374151", display: "flex", alignItems: "center" }}>
//               <input 
//                 type="checkbox" 
//                 checked={visibleColumns[col] || false} 
//                 onChange={() => toggleColumn(col)} 
//                 style={{ marginRight: 6 }} 
//               />
//               {col.startsWith("attributes.") ? col.replace("attributes.", "") : col}
//             </label>
//           ))}
//         </div>
//       )}

//       {/* Tabs for different element types */}
//       <div style={tabContainerStyle}>
//         <div 
//           style={activeTab === "all" ? activeTabStyle : tabStyle}
//           onClick={() => {
//             setActiveTab("all");
//             setSelectedElement("all");
//           }}
//         >
//           All Elements
//         </div>
//         {Object.keys(groupedData).map(type => (
//           <div 
//             key={type}
//             style={activeTab === type ? activeTabStyle : tabStyle}
//             onClick={() => {
//               setActiveTab(type);
//               setSelectedElement(type);
//             }}
//           >
//             {type} ({groupedData[type].length})
//           </div>
//         ))}
//       </div>

//       {/* Tables */}
//       {loading ? (
//         <div style={{ textAlign: "center", padding: 40 }}>
//           Loading...
//         </div>
//       ) : Object.keys(getDataToDisplay()).length > 0 ? (
//         Object.entries(getDataToDisplay()).map(([elementType, elementData]) => 
//           renderElementTable(elementType, elementData)
//         )
//       ) : (
//         <div style={{ textAlign: "center", padding: 40 }}>
//           No data found for this element type.
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div style={paginationStyle}>
//           <button 
//             onClick={() => fetchData(currentPage - 1)} 
//             disabled={currentPage === 1}
//             style={pageButtonStyle}
//           >
//             Previous
//           </button>
          
//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             let pageNum;
//             if (currentPage <= 3) {
//               pageNum = i + 1;
//             } else if (currentPage >= totalPages - 2) {
//               pageNum = totalPages - 4 + i;
//             } else {
//               pageNum = currentPage - 2 + i;
//             }
            
//             if (pageNum < 1 || pageNum > totalPages) return null;
            
//             return (
//               <button
//                 key={pageNum}
//                 onClick={() => fetchData(pageNum)}
//                 style={pageNum === currentPage ? activePageButtonStyle : pageButtonStyle}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}
          
//           <button 
//             onClick={() => fetchData(currentPage + 1)} 
//             disabled={currentPage === totalPages}
//             style={pageButtonStyle}
//           >
//             Next
//           </button>
          
//           <span style={{ marginLeft: 10 }}>
//             Page {currentPage} of {totalPages}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

//al

// export default DataView;
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as XLSX from "xlsx";
// import Papa from "papaparse";

// // Predefined data types
// const dataTypes = [
//   { key: "buildings", label: "Buildings" },
//   { key: "roads", label: "Roads" },
//   { key: "footpaths", label: "Footpaths" },
//   { key: "vegetation", label: "Vegetation" },
//   { key: "parking", label: "Parking" },
//   { key: "solid_waste", label: "Solid Waste" },
//   { key: "electricity", label: "Electricity" },
//   { key: "water_supply", label: "Water Supply" },
//   { key: "drainage", label: "Drainage System" },
//   { key: "vimbweta", label: "Vimbweta" },
//   { key: "security", label: "Security Lights" },
//   { key: "recreational_areas", label: "Recreational Areas" },
//   { key: "aru_boundary", label: "Aru Boundary" },
// ];

// // Layer styles from DataManagement
// const getLayerStyle = (name, type) => {
//   const styles = {
//     aru_boundary: { color: "red", dashArray: "5,5,1,5", weight: 3, fillOpacity: 0.1 },
//     buildings: { color: "yellow", weight: 2, fillOpacity: 0.3 },
//     roads: { color: "black", weight: 2, fillOpacity: 0.2 },
//     footpaths: { color: "gray", weight: 2, fillOpacity: 0.2 },
//     vegetation: { color: "green", weight: 2, fillOpacity: 0.3 },
//     parking: { color: "purple", weight: 2, fillOpacity: 0.3 },
//     solid_waste: { color: "darkblue", weight: 2, fillOpacity: 0.7 },
//     electricity: { color: "khaki", weight: 2, fillOpacity: 0.3 },
//     water_supply: { color: "blue", weight: 2, fillOpacity: 0.3 },
//     drainage: { color: "gold", weight: 2, fillOpacity: 0.3 },
//     vimbweta: { color: "orange", weight: 2, fillOpacity: 0.7 },
//     security: { color: "magenta", weight: 2, fillOpacity: 0.3 },
//     recreational_areas: { color: "yellowgreen", weight: 2, fillOpacity: 0.3 },
//   };
//   return styles[type] || { color: "gray", weight: 2, fillOpacity: 0.2 };
// };

// function DataView() {
//   const [data, setData] = useState([]);
//   const [groupedData, setGroupedData] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [expandedRows, setExpandedRows] = useState({});
//   const [visibleColumns, setVisibleColumns] = useState({});
//   const [columnOrder, setColumnOrder] = useState([]);
//   const [layerInfo, setLayerInfo] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [limit, setLimit] = useState(50);
//   const [activeTab, setActiveTab] = useState("all");
//   const [selectedElement, setSelectedElement] = useState("all");

//   const { layerName } = useParams();
//   const token = localStorage.getItem("token");

//   const API_BASE = import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/spatial";

//   const fetchData = async (page = 1, elementType = "all") => {
//     setLoading(true);
//     try {
//       // Build the API URL with optional element type filter
//       let url = `${API_BASE}/data/${layerName}?page=${page}&limit=${limit}`;
      
//       // Add element type filter if a specific element is selected
//       if (elementType !== "all") {
//         url += `&elementType=${elementType}`;
//       }

//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (res.data) {
//         const rows = res.data.data.map((r) => {
//           const attributes = r.properties || r.attributes || {};
//           const geometry = r.geometry || {};
//           const elementType = attributes.type || attributes.feature_type || layerName || "unknown";
//           return {
//             id: r.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
//             attributes,
//             geometry,
//             elementType,
//             color: getLayerStyle(r.name || layerName, elementType).color,
//           };
//         });

//         setData(rows);

//         // Group data by element type
//         const grouped = {};
//         rows.forEach((row) => {
//           const type = row.elementType;
//           if (!grouped[type]) {
//             grouped[type] = [];
//           }
//           grouped[type].push(row);
//         });
//         setGroupedData(grouped);

//         // Set pagination info
//         if (res.data.pagination) {
//           setTotalPages(res.data.pagination.totalPages);
//           setCurrentPage(res.data.pagination.currentPage);
//         }

//         // Initialize visible columns based on first item's structure
//         if (rows.length > 0) {
//           const initialColumns = {
//             id: true,
//             ...Object.keys(rows[0].attributes || {}).reduce((acc, key) => {
//               acc[`attributes.${key}`] = true;
//               return acc;
//             }, {}),
//             geometry: true,
//             color: true,
//           };
//           setVisibleColumns(initialColumns);

//           // Set column order
//           setColumnOrder([
//             "id",
//             ...Object.keys(rows[0].attributes || {}).map((key) => `attributes.${key}`),
//             "geometry",
//             "color",
//           ]);
//         }

//         // Set layer info if available
//         if (res.data.layerInfo) {
//           setLayerInfo(res.data.layerInfo);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (layerName && token) {
//       fetchData(1, selectedElement);
//     }
//   }, [layerName, limit, token, selectedElement]);

//   const handleElementChange = (elementType) => {
//     setSelectedElement(elementType);
//     setActiveTab(elementType);
//     // Reset to first page when changing element type
//     fetchData(1, elementType);
//   };

//   const executeQuery = () => {
//     setLoading(true);
//     const result =
//       searchTerm.toLowerCase() === "all data"
//         ? data
//         : data.filter(
//             (f) =>
//               Object.values(f.attributes).some((val) =>
//                 val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
//               ) ||
//               f.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
//               JSON.stringify(f.geometry).toLowerCase().includes(searchTerm.toLowerCase()) ||
//               f.color?.toLowerCase().includes(searchTerm.toLowerCase())
//           );

//     // Regroup the filtered data
//     const grouped = {};
//     result.forEach((row) => {
//       const type = row.elementType;
//       if (!grouped[type]) {
//         grouped[type] = [];
//       }
//       grouped[type].push(row);
//     });
//     setGroupedData(grouped);

//     setLoading(false);
//     toast.success(`Query run successfully. Rows found: ${result.length}`);
//   };

//   const toggleRow = (id) => {
//     setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const toggleColumn = (column) => {
//     setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
//   };

//   // Function to render value based on its type
//   const renderValue = (value, isGeometry = false) => {
//     if (value === null || value === undefined) return "N/A";

//     if (typeof value === "object") {
//       if (isGeometry) {
//         const geomType = value.type || "Unknown";
//         const coordCount = value.coordinates ? JSON.stringify(value.coordinates).length : 0;
//         return (
//           <div>
//             <div>
//               <strong>Type:</strong> {geomType}
//             </div>
//             <div>
//               <span style={expandStyle} onClick={() => toggleRow(value)}>
//                 {expandedRows[value] ? "Hide Coordinates" : "Show Coordinates"}
//               </span>
//             </div>
//             {expandedRows[value] && (
//               <pre style={{ fontSize: "10px", marginTop: "5px", maxHeight: "200px", overflow: "auto" }}>
//                 {JSON.stringify(value, null, 2)}
//               </pre>
//             )}
//           </div>
//         );
//       }

//       return expandedRows[value] ? (
//         <pre style={{ maxHeight: "200px", overflow: "auto" }}>
//           {JSON.stringify(value, null, 2)}
//         </pre>
//       ) : (
//         <span style={expandStyle} onClick={() => toggleRow(value)}>
//           {Array.isArray(value)
//             ? `[Array: ${value.length} items]`
//             : `{Object: ${Object.keys(value).length} keys}`}
//         </span>
//       );
//     }

//     // For very long strings, truncate and show expand option
//     if (typeof value === "string" && value.length > 100) {
//       return expandedRows[value] ? (
//         <div>
//           <div>{value}</div>
//           <span style={expandStyle} onClick={() => toggleRow(value)}>Show Less</span>
//         </div>
//       ) : (
//         <div>
//           <div>{value.substring(0, 100)}...</div>
//           <span style={expandStyle} onClick={() => toggleRow(value)}>Show More</span>
//         </div>
//       );
//     }

//     return value.toString();
//   };

//   // --- Export Functions ---
//   const exportCSV = () => {
//     const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => {
//       const obj = { id: row.id };
//       Object.entries(row.attributes || {}).forEach(([key, value]) => {
//         obj[key] = typeof value === "object" ? JSON.stringify(value) : value;
//       });
//       obj.geometry = JSON.stringify(row.geometry);
//       obj.color = row.color;
//       return obj;
//     });
//     const csv = Papa.unparse(dataToExport);
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${layerName}_${selectedElement !== "all" ? selectedElement + "_" : ""}export.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const exportJSON = () => {
//     const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => {
//       return { id: row.id, attributes: row.attributes, geometry: row.geometry, color: row.color };
//     });
//     const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${layerName}_${selectedElement !== "all" ? selectedElement + "_" : ""}export.json`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const exportXLSX = () => {
//     const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => {
//       const obj = { id: row.id };
//       Object.entries(row.attributes || {}).forEach(([key, value]) => {
//         obj[key] = typeof value === "object" ? JSON.stringify(value) : value;
//       });
//       obj.geometry = JSON.stringify(row.geometry);
//       obj.color = row.color;
//       return obj;
//     });
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, layerName);
//     XLSX.writeFile(workbook, `${layerName}_${selectedElement !== "all" ? selectedElement + "_" : ""}export.xlsx`);
//   };

//   // --- Inline CSS ---
//   const containerStyle = { maxWidth: "95%", margin: "40px auto", padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };
//   const titleStyle = { fontSize: 32, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#1f2937" };
//   const controlsStyle = { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginBottom: 20, alignItems: "center" };
//   const inputStyle = { padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, flex: "1 1 300px" };
//   const buttonStyle = (bgColor) => ({
//     backgroundColor: bgColor,
//     color: "#fff",
//     padding: "10px 16px",
//     borderRadius: 8,
//     fontWeight: "600",
//     border: "none",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     minWidth: 120,
//     marginTop: 5,
//   });
//   const tableContainerStyle = { overflowX: "auto", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", marginBottom: 20 };
//   const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: "max-content" };
//   const thStyle = { backgroundColor: "#f3f4f6", color: "#374151", textAlign: "left", fontWeight: "600", padding: "12px 16px", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0 };
//   const tdStyle = { padding: "12px 16px", borderBottom: "1px solid #e5e7eb", color: "#1f2937", fontSize: 14, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" };
//   const expandStyle = { fontSize: 12, color: "#3b82f6", cursor: "pointer", marginLeft: 10 };
//   const checkboxContainer = { display: "flex", gap: 15, flexWrap: "wrap", marginBottom: 15, padding: 10, backgroundColor: "#f9fafb", borderRadius: 8 };
//   const paginationStyle = { display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 20 };
//   const pageButtonStyle = { padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", backgroundColor: "#fff", cursor: "pointer" };
//   const activePageButtonStyle = { ...pageButtonStyle, backgroundColor: "#3b82f6", color: "#fff" };
//   const tabContainerStyle = { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" };
//   const tabStyle = { padding: "10px 20px", borderRadius: 8, border: "1px solid #d1d5db", backgroundColor: "#f9fafb", cursor: "pointer" };
//   const activeTabStyle = { ...tabStyle, backgroundColor: "#3b82f6", color: "#fff", borderColor: "#3b82f6" };
//   const selectStyle = { padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, marginBottom: 15 };

//   // Function to render a table for a specific element type
//   const renderElementTable = (elementType, elementData) => {
//     return (
//       <div key={elementType} style={tableContainerStyle}>
//         <h3 style={{ margin: "0 0 15px 0", padding: "10px 15px", backgroundColor: "#e0f2fe", borderRadius: "8px 8px 0 0" }}>
//           {dataTypes.find((dt) => dt.key === elementType)?.label || elementType.toUpperCase()} ({elementData.length} items)
//         </h3>
//         <table style={tableStyle}>
//           <thead>
//             <tr>
//               {columnOrder.map(
//                 (col) =>
//                   visibleColumns[col] && (
//                     <th key={col} style={thStyle}>
//                       {col.startsWith("attributes.") ? col.replace("attributes.", "") : col}
//                     </th>
//                   )
//               )}
//               <th style={thStyle}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {elementData.map((item, index) => (
//               <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? "#f9fafb" : "#fff" }}>
//                 {columnOrder.map(
//                   (col) =>
//                     visibleColumns[col] && (
//                       <td key={col} style={tdStyle} title={typeof item[col] === "object" ? JSON.stringify(item[col]) : item[col]}>
//                         {col === "id" ? item.id : col === "geometry" ? renderValue(item.geometry, true) : col === "color" ? (
//                           <div style={{ display: "flex", alignItems: "center" }}>
//                             <span style={{ backgroundColor: item.color, width: 18, height: 10, display: "inline-block", marginRight: 6 }}></span>
//                             {item.color}
//                           </div>
//                         ) : col.startsWith("attributes.") ? renderValue(item.attributes[col.replace("attributes.", "")]) : renderValue(item[col])}
//                       </td>
//                     )
//                 )}
//                 <td style={tdStyle}>
//                   <span style={expandStyle} onClick={() => toggleRow(item.id)}>
//                     {expandedRows[item.id] ? "Collapse All" : "Expand All"}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   // Get the data to display based on selection
//   const getDataToDisplay = () => {
//     if (selectedElement === "all") {
//       return groupedData;
//     } else {
//       return { [selectedElement]: groupedData[selectedElement] || [] };
//     }
//   };

//   // Get available element types from both the predefined list and the actual data
//   const getAvailableElementTypes = () => {
//     const availableTypes = new Set(Object.keys(groupedData));
//     return dataTypes.filter((dt) => availableTypes.has(dt.key));
//   };

//   return (
//     <div style={containerStyle}>
//       <ToastContainer />
//       <h1 style={titleStyle}>Data View - {layerName}</h1>

//       {/* Layer Info */}
//       {Object.keys(layerInfo).length > 0 && (
//         <div style={{ marginBottom: 20, padding: 15, backgroundColor: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd" }}>
//           <h3 style={{ margin: "0 0 10px 0", color: "#0369a1" }}>Layer Information</h3>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
//             {Object.entries(layerInfo).map(([key, value]) => (
//               <div key={key}>
//                 <strong>{key}:</strong> {value?.toString()}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Controls */}
//       <div style={controlsStyle}>
//         <input
//           type="text"
//           placeholder="Search across all fields..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={inputStyle}
//           onKeyPress={(e) => e.key === "Enter" && executeQuery()}
//         />
//         <button onClick={executeQuery} style={buttonStyle("#22c55e")}>
//           Search
//         </button>
//         <button onClick={exportCSV} style={buttonStyle("#2563eb")}>
//           Export CSV
//         </button>
//         <button onClick={exportJSON} style={buttonStyle("#8b5cf6")}>
//           Export JSON
//         </button>
//         <button onClick={exportXLSX} style={buttonStyle("#ec4899")}>
//           Export XLSX
//         </button>

//         {/* Page size selector */}
//         <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db" }}>
//           <option value={10}>10 rows</option>
//           <option value={25}>25 rows</option>
//           <option value={50}>50 rows</option>
//           <option value={100}>100 rows</option>
//         </select>
//       </div>

//       {/* Element type selector */}
//       <div style={{ marginBottom: 20 }}>
//         <label htmlFor="elementSelector" style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
//           Select Element Type:
//         </label>
//         <select
//           id="elementSelector"
//           value={selectedElement}
//           onChange={(e) => handleElementChange(e.target.value)}
//           style={selectStyle}
//         >
//           <option value="all">All Elements</option>
//           {dataTypes.map((type) => (
//             <option key={type.key} value={type.key}>
//               {type.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Column toggle */}
//       {columnOrder.length > 0 && (
//         <div style={checkboxContainer}>
//           <span style={{ fontWeight: "bold", marginRight: 10 }}>Show Columns:</span>
//           {columnOrder.map((col) => (
//             <label key={col} style={{ fontSize: 14, color: "#374151", display: "flex", alignItems: "center" }}>
//               <input type="checkbox" checked={visibleColumns[col] || false} onChange={() => toggleColumn(col)} style={{ marginRight: 6 }} />
//               {col.startsWith("attributes.") ? col.replace("attributes.", "") : col}
//             </label>
//           ))}
//         </div>
//       )}

//       {/* Tabs for different element types */}
//       <div style={tabContainerStyle}>
//         <div
//           style={activeTab === "all" ? activeTabStyle : tabStyle}
//           onClick={() => handleElementChange("all")}
//         >
//           All Elements
//         </div>
//         {dataTypes.map((type) => (
//           <div
//             key={type.key}
//             style={activeTab === type.key ? activeTabStyle : tabStyle}
//             onClick={() => handleElementChange(type.key)}
//           >
//             {type.label}
//           </div>
//         ))}
//       </div>

//       {/* Tables */}
//       {loading ? (
//         <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
//       ) : Object.keys(getDataToDisplay()).length > 0 ? (
//         Object.entries(getDataToDisplay()).map(([elementType, elementData]) => renderElementTable(elementType, elementData))
//       ) : (
//         <div style={{ textAlign: "center", padding: 40 }}>No data found for this element type.</div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div style={paginationStyle}>
//           <button onClick={() => fetchData(currentPage - 1, selectedElement)} disabled={currentPage === 1} style={pageButtonStyle}>
//             Previous
//           </button>

//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             let pageNum;
//             if (currentPage <= 3) {
//               pageNum = i + 1;
//             } else if (currentPage >= totalPages - 2) {
//               pageNum = totalPages - 4 + i;
//             } else {
//               pageNum = currentPage - 2 + i;
//             }

//             if (pageNum < 1 || pageNum > totalPages) return null;

//             return (
//               <button
//                 key={pageNum}
//                 onClick={() => fetchData(pageNum, selectedElement)}
//                 style={pageNum === currentPage ? activePageButtonStyle : pageButtonStyle}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}

//           <button onClick={() => fetchData(currentPage + 1, selectedElement)} disabled={currentPage === totalPages} style={pageButtonStyle}>
//             Next
//           </button>

//           <span style={{ marginLeft: 10 }}>
//             Page {currentPage} of {totalPages}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DataView;
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // Added useLocation
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import Papa from "papaparse";

// Predefined data types (aligned with DataManagement)
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

// Layer styles (aligned with DataManagement)
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

// Point radius for specific layers (aligned with DataManagement)
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

  const { layerName } = useParams();
  const location = useLocation(); // Added useLocation to get the current location
  const token = localStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/spatial";

  // Added useEffect for logging route params and location
  useEffect(() => {
    console.log("[DataView] Current route params:", { layerName });
    console.log("[DataView] Current location:", location);
  }, [layerName, location]);

  const fetchData = async (page = 1, elementType = "all") => {
    setLoading(true);
    try {
      let url = `${API_BASE}/data/${layerName}?page=${page}&limit=${limit}`;
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
          const elementType = r.elementType || layerName || "unknown";
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

        const grouped = {};
        rows.forEach((row) => {
          const type = row.elementType;
          if (!grouped[type]) {
            grouped[type] = [];
          }
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

        if (res.data.layerInfo) {
          setLayerInfo(res.data.layerInfo);
        }
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

  useEffect(() => {
    if (layerName && token) {
      fetchData(1, selectedElement);
    } else if (!token) {
      toast.error("Please log in to view data");
    }
  }, [layerName, limit, token, selectedElement]);

  const handleElementChange = (elementType) => {
    setSelectedElement(elementType);
    setActiveTab(elementType);
    fetchData(1, elementType);
  };

  const executeQuery = () => {
    setLoading(true);
    const result = searchTerm.toLowerCase() === "all data"
      ? data
      : data.filter(
          (f) =>
            Object.values(f.attributes).some((val) =>
              val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            f.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.elementType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            JSON.stringify(f.geometry).toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.color?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const grouped = {};
    result.forEach((row) => {
      const type = row.elementType;
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(row);
    });
    setGroupedData(grouped);

    setLoading(false);
    toast.success(`Query run successfully. Rows found: ${result.length}`);
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const renderValue = (value, isGeometry = false, elementType) => {
    if (value === null || value === undefined) return "N/A";

    if (typeof value === "object") {
      if (isGeometry) {
        const geomType = value.type || "Unknown";
        const isPoint = geomType === "Point";
        const coordCount = value.coordinates ? JSON.stringify(value.coordinates).length : 0;
        return (
          <div>
            <div>
              <strong>Type:</strong> {geomType}
              {isPoint && (
                <span style={{ marginLeft: 10 }}>
                  (Radius: {getPointRadius(elementType)}px)
                </span>
              )}
            </div>
            <div>
              <span style={expandStyle} onClick={() => toggleRow(JSON.stringify(value))}>
                {expandedRows[JSON.stringify(value)] ? "Hide Coordinates" : "Show Coordinates"}
              </span>
            </div>
            {expandedRows[JSON.stringify(value)] && (
              <pre style={{ fontSize: "10px", marginTop: "5px", maxHeight: "200px", overflow: "auto" }}>
                {JSON.stringify(value, null, 2)}
              </pre>
            )}
          </div>
        );
      }

      return expandedRows[JSON.stringify(value)] ? (
        <pre style={{ maxHeight: "200px", overflow: "auto" }}>
          {JSON.stringify(value, null, 2)}
        </pre>
      ) : (
        <span style={expandStyle} onClick={() => toggleRow(JSON.stringify(value))}>
          {Array.isArray(value)
            ? `[Array: ${value.length} items]`
            : `{Object: ${Object.keys(value).length} keys}`}
        </span>
      );
    }

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

  const exportCSV = () => {
    const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => {
      const obj = { id: row.id, elementType: row.elementType };
      Object.entries(row.attributes || {}).forEach(([key, value]) => {
        obj[key] = typeof value === "object" ? JSON.stringify(value) : value;
      });
      obj.geometry = JSON.stringify(row.geometry);
      obj.color = row.color;
      return obj;
    });
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layerName}_${selectedElement !== "all" ? selectedElement + "_" : ""}export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => {
      return { id: row.id, elementType: row.elementType, attributes: row.attributes, geometry: row.geometry, color: row.color };
    });
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layerName}_${selectedElement !== "all" ? selectedElement + "_" : ""}export.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportXLSX = () => {
    const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => {
      const obj = { id: row.id, elementType: row.elementType };
      Object.entries(row.attributes || {}).forEach(([key, value]) => {
        obj[key] = typeof value === "object" ? JSON.stringify(value) : value;
      });
      obj.geometry = JSON.stringify(row.geometry);
      obj.color = row.color;
      return obj;
    });
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, layerName);
    XLSX.writeFile(workbook, `${layerName}_${selectedElement !== "all" ? selectedElement + "_" : ""}export.xlsx`);
  };

  // Inline CSS
  const containerStyle = { maxWidth: "95%", margin: "40px auto", padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };
  const titleStyle = { fontSize: 32, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#1f2937" };
  const controlsStyle = { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginBottom: 20, alignItems: "center" };
  const inputStyle = { padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, flex: "1 1 300px" };
  const buttonStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 8,
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    minWidth: 120,
    marginTop: 5,
  });
  const tableContainerStyle = { overflowX: "auto", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", marginBottom: 20 };
  const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: "max-content" };
  const thStyle = { backgroundColor: "#f3f4f6", color: "#374151", textAlign: "left", fontWeight: "600", padding: "12px 16px", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0 };
  const tdStyle = { padding: "12px 16px", borderBottom: "1px solid #e5e7eb", color: "#1f2937", fontSize: 14, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" };
  const expandStyle = { fontSize: 12, color: "#3b82f6", cursor: "pointer", marginLeft: 10 };
  const checkboxContainer = { display: "flex", gap: 15, flexWrap: "wrap", marginBottom: 15, padding: 10, backgroundColor: "#f9fafb", borderRadius: 8 };
  const paginationStyle = { display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 20 };
  const pageButtonStyle = { padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", backgroundColor: "#fff", cursor: "pointer" };
  const activePageButtonStyle = { ...pageButtonStyle, backgroundColor: "#3b82f6", color: "#fff" };
  const tabContainerStyle = { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" };
  const tabStyle = { padding: "10px 20px", borderRadius: 8, border: "1px solid #d1d5db", backgroundColor: "#f9fafb", cursor: "pointer" };
  const activeTabStyle = { ...tabStyle, backgroundColor: "#3b82f6", color: "#fff", borderColor: "#3b82f6" };
  const selectStyle = { padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, marginBottom: 15 };
  const legendStyle = { background: "#fff", padding: "8px", borderRadius: "8px", boxShadow: "0 3px 8px rgba(0,0,0,0.2)", marginBottom: 20 };

  const renderElementTable = (elementType, elementData) => {
    return (
      <div key={elementType} style={tableContainerStyle}>
        <h3 style={{ margin: "0 0 15px 0", padding: "10px 15px", backgroundColor: "#e0f2fe", borderRadius: "8px 8px 0 0" }}>
          {dataTypes.find((dt) => dt.key === elementType)?.label || elementType.toUpperCase()} ({elementData.length} items)
        </h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              {columnOrder.map(
                (col) =>
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
            {elementData.map((item, index) => (
              <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? "#f9fafb" : "#fff" }}>
                {columnOrder.map(
                  (col) =>
                    visibleColumns[col] && (
                      <td key={col} style={tdStyle} title={typeof item[col] === "object" ? JSON.stringify(item[col]) : item[col]}>
                        {col === "id" ? item.id : col === "elementType" ? item.elementType : col === "geometry" ? renderValue(item.geometry, true, item.elementType) : col === "color" ? (
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span
                              style={{
                                backgroundColor: item.color,
                                width: item.pointRadius ? item.pointRadius * 2 : 18,
                                height: item.pointRadius ? item.pointRadius * 2 : 10,
                                display: "inline-block",
                                marginRight: 6,
                                borderRadius: item.pointRadius ? "50%" : "0",
                              }}
                            ></span>
                            {item.color}
                          </div>
                        ) : col.startsWith("attributes.") ? renderValue(item.attributes[col.replace("attributes.", "")]) : renderValue(item[col])}
                      </td>
                    )
                )}
                <td style={tdStyle}>
                  <span style={expandStyle} onClick={() => toggleRow(item.id)}>
                    {expandedRows[item.id] ? "Collapse All" : "Expand All"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getDataToDisplay = () => {
    if (selectedElement === "all") {
      return groupedData;
    } else {
      return { [selectedElement]: groupedData[selectedElement] || [] };
    }
  };

  return (
    <div style={containerStyle}>
      <ToastContainer />
      <h1 style={titleStyle}>Data View - {dataTypes.find((dt) => dt.key === layerName)?.label || layerName}</h1>

      {/* Legend */}
      {Object.keys(groupedData).length > 0 && (
        <div style={legendStyle}>
          <h3 style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>Legend</h3>
          {Object.keys(groupedData).map((type) => (
            <div key={type} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
              <span
                style={{
                  backgroundColor: getLayerStyle(type).color,
                  width: getPointRadius(type) ? getPointRadius(type) * 2 : 18,
                  height: getPointRadius(type) ? getPointRadius(type) * 2 : 10,
                  display: "inline-block",
                  marginRight: 6,
                  borderRadius: getPointRadius(type) ? "50%" : "0",
                }}
              ></span>
              {dataTypes.find((dt) => dt.key === type)?.label || type}
            </div>
          ))}
        </div>
      )}

      {/* Layer Info */}
      {Object.keys(layerInfo).length > 0 && (
        <div style={{ marginBottom: 20, padding: 15, backgroundColor: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#0369a1" }}>Layer Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {Object.entries(layerInfo).map(([key, value]) => (
              <div key={key}>
                <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                {Array.isArray(value) ? `${value.length} columns` : value?.toString()}
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
          onKeyPress={(e) => e.key === "Enter" && executeQuery()}
        />
        <button onClick={executeQuery} style={buttonStyle("#22c55e")}>
          Search
        </button>
        <button onClick={exportCSV} style={buttonStyle("#2563eb")}>
          Export CSV
        </button>
        <button onClick={exportJSON} style={buttonStyle("#8b5cf6")}>
          Export JSON
        </button>
        <button onClick={exportXLSX} style={buttonStyle("#ec4899")}>
          Export XLSX
        </button>
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

      {/* Element type selector */}
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="elementSelector" style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
          Select Element Type:
        </label>
        <select
          id="elementSelector"
          value={selectedElement}
          onChange={(e) => handleElementChange(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Elements</option>
          {dataTypes.map((type) => (
            <option key={type.key} value={type.key}>
              {type.label}
            </option>
          ))}
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
              {col.startsWith("attributes.") ? col.replace("attributes.", "") : col.replace(/_/g, " ")}
            </label>
          ))}
        </div>
      )}

      {/* Tabs for different element types */}
      <div style={tabContainerStyle}>
        <div
          style={activeTab === "all" ? activeTabStyle : tabStyle}
          onClick={() => handleElementChange("all")}
        >
          All Elements
        </div>
        {dataTypes
          .filter((dt) => Object.keys(groupedData).includes(dt.key))
          .map((type) => (
            <div
              key={type.key}
              style={activeTab === type.key ? activeTabStyle : tabStyle}
              onClick={() => handleElementChange(type.key)}
            >
              {type.label}
            </div>
          ))}
      </div>

      {/* Tables */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
      ) : Object.keys(getDataToDisplay()).length > 0 ? (
        Object.entries(getDataToDisplay()).map(([elementType, elementData]) =>
          elementData.length > 0 ? renderElementTable(elementType, elementData) : null
        )
      ) : (
        <div style={{ textAlign: "center", padding: 40 }}>No data found for this element type.</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={paginationStyle}>
          <button
            onClick={() => fetchData(currentPage - 1, selectedElement)}
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
                onClick={() => fetchData(pageNum, selectedElement)}
                style={pageNum === currentPage ? activePageButtonStyle : pageButtonStyle}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => fetchData(currentPage + 1, selectedElement)}
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

