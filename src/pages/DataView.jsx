
// import React, { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as XLSX from "xlsx";
// import Papa from "papaparse";

// // Define data types for elements
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

// // Layer styles
// const getLayerStyle = (type) => {
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

// // Point radius
// const getPointRadius = (type) => {
//   switch (type) {
//     case "solid_waste":
//       return 8;
//     case "vimbweta":
//       return 6;
//     default:
//       return 5;
//   }
// };

// function DataView() {
//   const { layerName } = useParams();
//   const location = useLocation();
//   const token = localStorage.getItem("token");

//   const API_BASE = import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/spatial";

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
//   const [apiError, setApiError] = useState(null);

//   // Fetch data from the backend
//   const fetchData = async (page = 1, elementType = "all") => {
//     // Check if layerName is available
//     if (!layerName) {
//       toast.error("Layer name is not available");
//       return;
//     }
    
//     setLoading(true);
//     setApiError(null);
//     try {
//       // Use the correct API endpoint format based on your backend
//       let url = `${API_BASE}/data/${layerName}?page=${page}&limit=${limit}`;
      
//       // Add elementType filter if specified
//       if (elementType !== "all") {
//         url += `&elementType=${elementType}`;
//       }

//       console.log("Fetching data from:", url);

//       const res = await axios.get(url, { 
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         timeout: 15000
//       });

//       console.log("API Response:", res.data);

//       if (res.data?.success) {
//         // Transform the data to match our frontend structure
//         const rows = res.data.data.map((r) => {
//           const attributes = r.attributes || {};
//           const geometry = r.geometry || {};
          
//           // Extract elementType from attributes or use layerName as fallback
//           const elementType = attributes.type || attributes.feature_type || layerName || "unknown";
          
//           const style = getLayerStyle(elementType);
          
//           return {
//             id: r.id,
//             attributes,
//             geometry,
//             elementType,
//             color: style.color,
//             pointRadius: geometry.type === "Point" ? getPointRadius(elementType) : null,
//           };
//         });

//         setData(rows);

//         // Group by elementType
//         const grouped = {};
//         rows.forEach((row) => {
//           const type = row.elementType;
//           if (!grouped[type]) grouped[type] = [];
//           grouped[type].push(row);
//         });
//         setGroupedData(grouped);

//         if (res.data.pagination) {
//           setTotalPages(res.data.pagination.totalPages);
//           setCurrentPage(res.data.pagination.currentPage);
//         }

//         if (rows.length > 0) {
//           const initialColumns = {
//             id: true,
//             elementType: true,
//             ...Object.keys(rows[0].attributes).reduce((acc, key) => {
//               acc[`attributes.${key}`] = true;
//               return acc;
//             }, {}),
//             geometry: true,
//             color: true,
//           };
//           setVisibleColumns(initialColumns);
//           setColumnOrder([
//             "id",
//             "elementType",
//             ...Object.keys(rows[0].attributes).map((key) => `attributes.${key}`),
//             "geometry",
//             "color",
//           ]);
//         }

//         if (res.data.layerInfo) setLayerInfo(res.data.layerInfo);
//       } else {
//         toast.error(res.data?.error || "Failed to fetch data");
//       }
//     } catch (err) {
//       console.error("[DataView] Fetch error:", err);
//       setApiError(err.message);
      
//       if (err.response?.status === 404) {
//         toast.error(`Data not found for layer: ${layerName}`);
//       } else if (err.response?.status === 400) {
//         toast.error("Invalid request. Please check your parameters.");
//       } else if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
//         toast.error("Network error. Please check your connection and API URL.");
//       } else if (err.code === "ECONNABORTED") {
//         toast.error("Request timeout. The server is taking too long to respond.");
//       } else {
//         toast.error(err.response?.data?.error || err.message || "Failed to fetch data");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (layerName && token) {
//       fetchData(1, selectedElement);
//     } else if (!token) {
//       toast.error("Please log in to view data");
//     }
//   }, [layerName, limit, token, selectedElement]);

//   const handleElementChange = (elementType) => {
//     setSelectedElement(elementType);
//     setActiveTab(elementType);
//     fetchData(1, elementType);
//   };

//   const toggleRow = (id) => setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

//   const toggleColumn = (column) => setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));

//   const renderValue = (value, isGeometry = false, elementType) => {
//     if (value === null || value === undefined) return "N/A";

//     if (typeof value === "object") {
//       if (isGeometry) {
//         const geomType = value.type || "Unknown";
//         const isPoint = geomType === "Point";
//         return (
//           <div>
//             <div>
//               <strong>Type:</strong> {geomType} {isPoint && `(Radius: ${getPointRadius(elementType)}px)`}
//             </div>
//             <div>
//               <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(JSON.stringify(value))}>
//                 {expandedRows[JSON.stringify(value)] ? "Hide Coordinates" : "Show Coordinates"}
//               </span>
//             </div>
//             {expandedRows[JSON.stringify(value)] && (
//               <pre style={{ fontSize: "10px", marginTop: "5px", maxHeight: "200px", overflow: "auto" }}>
//                 {JSON.stringify(value, null, 2)}
//               </pre>
//             )}
//           </div>
//         );
//       }

//       return expandedRows[JSON.stringify(value)] ? (
//         <pre style={{ maxHeight: "200px", overflow: "auto" }}>{JSON.stringify(value, null, 2)}</pre>
//       ) : (
//         <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(JSON.stringify(value))}>
//           {Array.isArray(value) ? `[Array: ${value.length} items]` : `{Object: ${Object.keys(value).length} keys}`}
//         </span>
//       );
//     }

//     if (typeof value === "string" && value.length > 100) {
//       return expandedRows[value] ? (
//         <div>
//           <div>{value}</div>
//           <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(value)}>Show Less</span>
//         </div>
//       ) : (
//         <div>
//           <div>{value.substring(0, 100)}...</div>
//           <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(value)}>Show More</span>
//         </div>
//       );
//     }

//     return value.toString();
//   };

//   // Exports
//   const exportCSV = () => {
//     const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => {
//       const obj = { id: row.id, elementType: row.elementType };
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
//     const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => ({
//       id: row.id,
//       elementType: row.elementType,
//       attributes: row.attributes,
//       geometry: row.geometry,
//       color: row.color,
//     }));
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
//       const obj = { id: row.id, elementType: row.elementType };
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

//   const getDataToDisplay = () => selectedElement === "all" ? groupedData : { [selectedElement]: groupedData[selectedElement] || [] };

//   // Show loading if layerName is not yet available
//   if (!layerName) {
//     return <div style={{ textAlign: "center", padding: 40 }}>Loading layer information...</div>;
//   }

//   return (
//     <div style={{ maxWidth: "95%", margin: "40px auto", padding: 20 }}>
//       <ToastContainer />
//       <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 20 }}>
//         Data View - {dataTypes.find((dt) => dt.key === layerName)?.label || layerName}
//       </h1>

//       {/* Debug info */}
//       {apiError && (
//         <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "8px", marginBottom: "20px" }}>
//           <strong>API Error:</strong> {apiError}
//           <div style={{ marginTop: "10px" }}>
//             <button 
//               onClick={() => fetchData(1, selectedElement)}
//               style={{ backgroundColor: "#ef4444", color: "white", padding: "5px 10px", borderRadius: "4px", border: "none" }}
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Controls, Search, Export */}
//       <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", flex: 1 }}
//           onKeyPress={(e) => e.key === "Enter" && fetchData(1, selectedElement)}
//         />
//         <button onClick={() => fetchData(1, selectedElement)} style={{ backgroundColor: "#22c55e", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>Search</button>
//         <button onClick={exportCSV} style={{ backgroundColor: "#2563eb", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>CSV</button>
//         <button onClick={exportJSON} style={{ backgroundColor: "#8b5cf6", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>JSON</button>
//         <button onClick={exportXLSX} style={{ backgroundColor: "#ec4899", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>XLSX</button>
//         <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} style={{ padding: "10px 12px", borderRadius: 8 }}>
//           <option value={10}>10</option>
//           <option value={25}>25</option>
//           <option value={50}>50</option>
//           <option value={100}>100</option>
//         </select>
//       </div>

//       {/* Tabs */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
//         <div onClick={() => handleElementChange("all")} style={{ padding: "10px 20px", borderRadius: 8, cursor: "pointer", backgroundColor: activeTab === "all" ? "#3b82f6" : "#f9fafb", color: activeTab === "all" ? "#fff" : "#374151" }}>All Elements</div>
//         {dataTypes.filter(dt => Object.keys(groupedData).includes(dt.key)).map(dt => (
//           <div key={dt.key} onClick={() => handleElementChange(dt.key)} style={{ padding: "10px 20px", borderRadius: 8, cursor: "pointer", backgroundColor: activeTab === dt.key ? "#3b82f6" : "#f9fafb", color: activeTab === dt.key ? "#fff" : "#374151" }}>{dt.label}</div>
//         ))}
//       </div>

//       {/* Tables */}
//       {loading ? <div style={{ textAlign: "center", padding: 40 }}>Loading...</div> :
//         Object.entries(getDataToDisplay()).map(([elementType, elementData]) =>
//           elementData.length > 0 && (
//             <div key={elementType} style={{ overflowX: "auto", marginBottom: 20 }}>
//               <h3>{dataTypes.find(dt => dt.key === elementType)?.label || elementType} ({elementData.length})</h3>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr>
//                     {columnOrder.map(col => visibleColumns[col] && <th key={col} style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}>{col.startsWith("attributes.") ? col.replace("attributes.", "") : col}</th>)}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {elementData.map(item => (
//                     <tr key={item.id} style={{ backgroundColor: "#f9fafb" }}>
//                       {columnOrder.map(col => visibleColumns[col] && (
//                         <td key={col} style={{ padding: 8 }}>
//                           {col.startsWith("attributes.") ? renderValue(item.attributes[col.replace("attributes.", "")]) :
//                             col === "geometry" ? renderValue(item.geometry, true, item.elementType) :
//                             col === "color" ? <div style={{ display: "flex", alignItems: "center" }}><span style={{ backgroundColor: item.color, width: item.pointRadius ? item.pointRadius * 2 : 18, height: item.pointRadius ? item.pointRadius * 2 : 10, display: "inline-block", marginRight: 6, borderRadius: item.pointRadius ? "50%" : "0" }}></span>{item.color}</div>
//                               : item[col]}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )
//         )
//       }

//       {!loading && Object.keys(getDataToDisplay()).length === 0 && (
//         <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
//           No data available for this layer. Please check if the API endpoint is correct.
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
//           <button disabled={currentPage === 1} onClick={() => fetchData(currentPage - 1, selectedElement)}>Previous</button>
//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             let pageNum = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
//             if (pageNum < 1 || pageNum > totalPages) return null;
//             return <button key={pageNum} onClick={() => fetchData(pageNum, selectedElement)} style={{ backgroundColor: pageNum === currentPage ? "#3b82f6" : "#fff", color: pageNum === currentPage ? "#fff" : "#374151" }}>{pageNum}</button>;
//           })}
//           <button disabled={currentPage === totalPages} onClick={() => fetchData(currentPage + 1, selectedElement)}>Next</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DataView;

// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as XLSX from "xlsx";
// import Papa from "papaparse";

// // Define data types for elements
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

// // Layer styles
// const getLayerStyle = (type) => {
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

// // Point radius
// const getPointRadius = (type) => {
//   switch (type) {
//     case "solid_waste":
//       return 8;
//     case "vimbweta":
//       return 6;
//     default:
//       return 5;
//   }
// };

// function DataView() {
//   const { layerName } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const API_BASE = import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/spatial";

//   const [data, setData] = useState([]);
//   const [groupedData, setGroupedData] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [expandedRows, setExpandedRows] = useState({});
//   const [visibleColumns, setVisibleColumns] = useState({});
//   const [columnOrder, setColumnOrder] = useState([]);
//   const [layerInfo, setLayerInfo] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [limit, setLimit] = useState(50);
//   const [activeTab, setActiveTab] = useState("all");
//   const [selectedElement, setSelectedElement] = useState("all");
//   const [apiError, setApiError] = useState(null);
//   const [layerLoading, setLayerLoading] = useState(true);

//   // Fetch data from the backend
//   const fetchData = async (page = 1, elementType = "all") => {
//     // Check if layerName is available
//     if (!layerName) {
//       toast.error("Layer name is not available");
//       setLoading(false);
//       setLayerLoading(false);
//       return;
//     }
    
//     setLoading(true);
//     setApiError(null);
//     try {
//       // Use the correct API endpoint format based on your backend
//       let url = `${API_BASE}/data/${layerName}?page=${page}&limit=${limit}`;
      
//       // Add elementType filter if specified
//       if (elementType !== "all") {
//         url += `&elementType=${elementType}`;
//       }

//       console.log("Fetching data from:", url);

//       const res = await axios.get(url, { 
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         timeout: 15000
//       });

//       console.log("API Response:", res.data);

//       if (res.data?.success) {
//         // Transform the data to match our frontend structure
//         const rows = res.data.data.map((r) => {
//           const attributes = r.attributes || {};
//           const geometry = r.geometry || {};
          
//           // Extract elementType from attributes or use layerName as fallback
//           const elementType = attributes.type || attributes.feature_type || layerName || "unknown";
          
//           const style = getLayerStyle(elementType);
          
//           return {
//             id: r.id,
//             attributes,
//             geometry,
//             elementType,
//             color: style.color,
//             pointRadius: geometry.type === "Point" ? getPointRadius(elementType) : null,
//           };
//         });

//         setData(rows);

//         // Group by elementType
//         const grouped = {};
//         rows.forEach((row) => {
//           const type = row.elementType;
//           if (!grouped[type]) grouped[type] = [];
//           grouped[type].push(row);
//         });
//         setGroupedData(grouped);

//         if (res.data.pagination) {
//           setTotalPages(res.data.pagination.totalPages);
//           setCurrentPage(res.data.pagination.currentPage);
//         }

//         if (rows.length > 0) {
//           const initialColumns = {
//             id: true,
//             elementType: true,
//             ...Object.keys(rows[0].attributes).reduce((acc, key) => {
//               acc[`attributes.${key}`] = true;
//               return acc;
//             }, {}),
//             geometry: true,
//             color: true,
//           };
//           setVisibleColumns(initialColumns);
//           setColumnOrder([
//             "id",
//             "elementType",
//             ...Object.keys(rows[0].attributes).map((key) => `attributes.${key}`),
//             "geometry",
//             "color",
//           ]);
//         }

//         if (res.data.layerInfo) setLayerInfo(res.data.layerInfo);
//       } else {
//         toast.error(res.data?.error || "Failed to fetch data");
//       }
//     } catch (err) {
//       console.error("[DataView] Fetch error:", err);
//       setApiError(err.message);
      
//       if (err.response?.status === 404) {
//         toast.error(`Data not found for layer: ${layerName}`);
//       } else if (err.response?.status === 400) {
//         toast.error("Invalid request. Please check your parameters.");
//       } else if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
//         toast.error("Network error. Please check your connection and API URL.");
//       } else if (err.code === "ECONNABORTED") {
//         toast.error("Request timeout. The server is taking too long to respond.");
//       } else {
//         toast.error(err.response?.data?.error || err.message || "Failed to fetch data");
//       }
//     } finally {
//       setLoading(false);
//       setLayerLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log("Layer name from URL:", layerName);
//     console.log("Token:", token ? "Available" : "Missing");
    
//     if (layerName && token) {
//       setLayerLoading(true);
//       fetchData(1, selectedElement);
//     } else if (!token) {
//       toast.error("Please log in to view data");
//       setLayerLoading(false);
//       setLoading(false);
//     } else {
//       setLayerLoading(false);
//       setLoading(false);
//     }
//   }, [layerName, limit, token, selectedElement]);

//   const handleElementChange = (elementType) => {
//     setSelectedElement(elementType);
//     setActiveTab(elementType);
//     fetchData(1, elementType);
//   };

//   const toggleRow = (id) => setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

//   const toggleColumn = (column) => setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));

//   const renderValue = (value, isGeometry = false, elementType) => {
//     if (value === null || value === undefined) return "N/A";

//     if (typeof value === "object") {
//       if (isGeometry) {
//         const geomType = value.type || "Unknown";
//         const isPoint = geomType === "Point";
//         return (
//           <div>
//             <div>
//               <strong>Type:</strong> {geomType} {isPoint && `(Radius: ${getPointRadius(elementType)}px)`}
//             </div>
//             <div>
//               <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(JSON.stringify(value))}>
//                 {expandedRows[JSON.stringify(value)] ? "Hide Coordinates" : "Show Coordinates"}
//               </span>
//             </div>
//             {expandedRows[JSON.stringify(value)] && (
//               <pre style={{ fontSize: "10px", marginTop: "5px", maxHeight: "200px", overflow: "auto" }}>
//                 {JSON.stringify(value, null, 2)}
//               </pre>
//             )}
//           </div>
//         );
//       }

//       return expandedRows[JSON.stringify(value)] ? (
//         <pre style={{ maxHeight: "200px", overflow: "auto" }}>{JSON.stringify(value, null, 2)}</pre>
//       ) : (
//         <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(JSON.stringify(value))}>
//           {Array.isArray(value) ? `[Array: ${value.length} items]` : `{Object: ${Object.keys(value).length} keys}`}
//         </span>
//       );
//     }

//     if (typeof value === "string" && value.length > 100) {
//       return expandedRows[value] ? (
//         <div>
//           <div>{value}</div>
//           <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(value)}>Show Less</span>
//         </div>
//       ) : (
//         <div>
//           <div>{value.substring(0, 100)}...</div>
//           <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(value)}>Show More</span>
//         </div>
//       );
//     }

//     return value.toString();
//   };

//   // Exports
//   const exportCSV = () => {
//     const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => {
//       const obj = { id: row.id, elementType: row.elementType };
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
//     const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => ({
//       id: row.id,
//       elementType: row.elementType,
//       attributes: row.attributes,
//       geometry: row.geometry,
//       color: row.color,
//     }));
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
//       const obj = { id: row.id, elementType: row.elementType };
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

//   const getDataToDisplay = () => selectedElement === "all" ? groupedData : { [selectedElement]: groupedData[selectedElement] || [] };

//   // Show loading if layerName is not yet available
//   if (layerLoading) {
//     return <div style={{ textAlign: "center", padding: 40 }}>Loading layer information...</div>;
//   }

//   if (!layerName) {
//     return (
//       <div style={{ textAlign: "center", padding: 40 }}>
//         <h2>No layer selected</h2>
//         <p>Please select a layer from the menu or check your URL.</p>
//         <button 
//           onClick={() => navigate('/')}
//           style={{ backgroundColor: "#3b82f6", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none" }}
//         >
//           Go to Home
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ maxWidth: "95%", margin: "40px auto", padding: 20 }}>
//       <ToastContainer />
//       <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 20 }}>
//         Data View - {dataTypes.find((dt) => dt.key === layerName)?.label || layerName}
//       </h1>

//       {/* Debug info */}
//       {apiError && (
//         <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "8px", marginBottom: "20px" }}>
//           <strong>API Error:</strong> {apiError}
//           <div style={{ marginTop: "10px" }}>
//             <button 
//               onClick={() => fetchData(1, selectedElement)}
//               style={{ backgroundColor: "#ef4444", color: "white", padding: "5px 10px", borderRadius: "4px", border: "none" }}
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Controls, Search, Export */}
//       <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", flex: 1 }}
//           onKeyPress={(e) => e.key === "Enter" && fetchData(1, selectedElement)}
//         />
//         <button onClick={() => fetchData(1, selectedElement)} style={{ backgroundColor: "#22c55e", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>Search</button>
//         <button onClick={exportCSV} style={{ backgroundColor: "#2563eb", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>CSV</button>
//         <button onClick={exportJSON} style={{ backgroundColor: "#8b5cf6", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>JSON</button>
//         <button onClick={exportXLSX} style={{ backgroundColor: "#ec4899", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>XLSX</button>
//         <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} style={{ padding: "10px 12px", borderRadius: 8 }}>
//           <option value={10}>10</option>
//           <option value={25}>25</option>
//           <option value={50}>50</option>
//           <option value={100}>100</option>
//         </select>
//       </div>

//       {/* Tabs */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
//         <div onClick={() => handleElementChange("all")} style={{ padding: "10px 20px", borderRadius: 8, cursor: "pointer", backgroundColor: activeTab === "all" ? "#3b82f6" : "#f9fafb", color: activeTab === "all" ? "#fff" : "#374151" }}>All Elements</div>
//         {dataTypes.filter(dt => Object.keys(groupedData).includes(dt.key)).map(dt => (
//           <div key={dt.key} onClick={() => handleElementChange(dt.key)} style={{ padding: "10px 20px", borderRadius: 8, cursor: "pointer", backgroundColor: activeTab === dt.key ? "#3b82f6" : "#f9fafb", color: activeTab === dt.key ? "#fff" : "#374151" }}>{dt.label}</div>
//         ))}
//       </div>

//       {/* Tables */}
//       {loading ? <div style={{ textAlign: "center", padding: 40 }}>Loading data...</div> :
//         Object.entries(getDataToDisplay()).map(([elementType, elementData]) =>
//           elementData.length > 0 && (
//             <div key={elementType} style={{ overflowX: "auto", marginBottom: 20 }}>
//               <h3>{dataTypes.find(dt => dt.key === elementType)?.label || elementType} ({elementData.length})</h3>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr>
//                     {columnOrder.map(col => visibleColumns[col] && <th key={col} style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}>{col.startsWith("attributes.") ? col.replace("attributes.", "") : col}</th>)}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {elementData.map(item => (
//                     <tr key={item.id} style={{ backgroundColor: "#f9fafb" }}>
//                       {columnOrder.map(col => visibleColumns[col] && (
//                         <td key={col} style={{ padding: 8 }}>
//                           {col.startsWith("attributes.") ? renderValue(item.attributes[col.replace("attributes.", "")]) :
//                             col === "geometry" ? renderValue(item.geometry, true, item.elementType) :
//                             col === "color" ? <div style={{ display: "flex", alignItems: "center" }}><span style={{ backgroundColor: item.color, width: item.pointRadius ? item.pointRadius * 2 : 18, height: item.pointRadius ? item.pointRadius * 2 : 10, display: "inline-block", marginRight: 6, borderRadius: item.pointRadius ? "50%" : "0" }}></span>{item.color}</div>
//                               : item[col]}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )
//         )
//       }

//       {!loading && Object.keys(getDataToDisplay()).length === 0 && (
//         <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
//           No data available for this layer. Please check if the API endpoint is correct.
//           <div style={{ marginTop: "10px" }}>
//             <button 
//               onClick={() => fetchData(1, selectedElement)}
//               style={{ backgroundColor: "#3b82f6", color: "white", padding: "5px 10px", borderRadius: "4px", border: "none" }}
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
//           <button disabled={currentPage === 1} onClick={() => fetchData(currentPage - 1, selectedElement)}>Previous</button>
//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             let pageNum = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
//             if (pageNum < 1 || pageNum > totalPages) return null;
//             return <button key={pageNum} onClick={() => fetchData(pageNum, selectedElement)} style={{ backgroundColor: pageNum === currentPage ? "#3b82f6" : "#fff", color: pageNum === currentPage ? "#fff" : "#374151" }}>{pageNum}</button>;
//           })}
//           <button disabled={currentPage === totalPages} onClick={() => fetchData(currentPage + 1, selectedElement)}>Next</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DataView;

// //night 
// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as XLSX from "xlsx";
// import Papa from "papaparse";

// // Define data types for elements
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

// // Layer styles
// const getLayerStyle = (type) => {
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

// // Point radius
// const getPointRadius = (type) => {
//   switch (type) {
//     case "solid_waste":
//       return 8;
//     case "vimbweta":
//       return 6;
//     default:
//       return 5;
//   }
// };

// function DataView() {
//   const { layerName } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const API_BASE = import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/spatial";

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
//   const [apiError, setApiError] = useState(null);

//   // Fetch data from the backend
//   const fetchData = async (page = 1, elementType = "all") => {
//     if (!layerName || !dataTypes.some((dt) => dt.key === layerName)) {
//       toast.error("Invalid or missing layer name");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setApiError(null);
//     try {
//       let url = `${API_BASE}/data/${layerName}?page=${page}&limit=${limit}`;
//       if (elementType !== "all") {
//         url += `&elementType=${elementType}`;
//       }

//       console.log("Fetching data from:", url);
//       console.log("Token:", token ? "Available" : "Missing");

//       const res = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         timeout: 15000,
//       });

//       console.log("API Response:", res.data);

//       if (res.data?.success) {
//         const rows = res.data.data.map((r) => {
//           const attributes = r.attributes || {};
//           const geometry = r.geometry || {};
//           const elementType = attributes.type || attributes.feature_type || layerName || "unknown";
//           const style = getLayerStyle(elementType);
//           return {
//             id: r.id || null,
//             attributes,
//             geometry,
//             elementType,
//             color: style.color,
//             pointRadius: geometry.type === "Point" ? getPointRadius(elementType) : null,
//           };
//         });

//         setData(rows);

//         const grouped = {};
//         rows.forEach((row) => {
//           const type = row.elementType;
//           if (!grouped[type]) grouped[type] = [];
//           grouped[type].push(row);
//         });
//         setGroupedData(grouped);

//         if (res.data.pagination) {
//           setTotalPages(res.data.pagination.totalPages || 1);
//           setCurrentPage(res.data.pagination.currentPage || 1);
//         }

//         if (rows.length > 0) {
//           const initialColumns = {
//             id: true,
//             elementType: true,
//             ...Object.keys(rows[0].attributes).reduce((acc, key) => {
//               acc[`attributes.${key}`] = true;
//               return acc;
//             }, {}),
//             geometry: true,
//             color: true,
//           };
//           setVisibleColumns(initialColumns);
//           setColumnOrder([
//             "id",
//             "elementType",
//             ...Object.keys(rows[0].attributes).map((key) => `attributes.${key}`),
//             "geometry",
//             "color",
//           ]);
//         } else {
//           toast.warn("No data returned for this layer. Try uploading data.");
//         }

//         if (res.data.layerInfo) setLayerInfo(res.data.layerInfo);
//       } else {
//         toast.error(res.data?.error || "Failed to fetch data");
//       }
//     } catch (err) {
//       console.error("[DataView] Fetch error:", err);
//       console.error("[DataView] Error Response:", err.response?.data);
//       setApiError(err.message);

//       if (err.response?.status === 404) {
//         toast.error(`Data not found for layer: ${layerName}. Try uploading data.`);
//       } else if (err.response?.status === 401 || err.response?.status === 403) {
//         toast.error("Authentication failed. Please log in again.");
//         navigate("/login");
//       } else if (err.response?.status === 400) {
//         toast.error("Invalid request. Please check the layer name.");
//       } else if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
//         toast.error("Network error. Please check your connection and API URL.");
//       } else if (err.code === "ECONNABORTED") {
//         toast.error("Request timeout. The server is taking too long to respond.");
//       } else {
//         toast.error(err.response?.data?.error || err.message || "Failed to fetch data");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log("Current URL:", location.pathname);
//     console.log("Layer name from URL:", layerName);
//     console.log("Token:", token ? "Available" : "Missing");

//     // Redirect to default layer if layerName is undefined or invalid
//     if (!layerName || !dataTypes.some((dt) => dt.key === layerName)) {
//       console.warn("Invalid or missing layerName, redirecting to /data/buildings");
//       navigate("/data/buildings");
//       return;
//     }

//     if (!token) {
//       toast.error("Please log in to view data");
//       navigate("/login");
//       return;
//     }

//     fetchData(1, selectedElement);

//     // Mock data for testing (uncomment to test frontend rendering)
//     /*
//     const mockData = {
//       success: true,
//       data: [
//         {
//           id: 1,
//           attributes: { type: layerName, name: "Test Feature" },
//           geometry: { type: "Point", coordinates: [10, 20] },
//         },
//       ],
//       pagination: { currentPage: 1, totalPages: 1, totalRecords: 1, limit: 50, offset: 0 },
//       layerInfo: { table_name: layerName, total_records: 1, columns: [] },
//     };
//     const rows = mockData.data.map((r) => {
//       const attributes = r.attributes || {};
//       const geometry = r.geometry || {};
//       const elementType = attributes.type || attributes.feature_type || layerName || "unknown";
//       const style = getLayerStyle(elementType);
//       return {
//         id: r.id,
//         attributes,
//         geometry,
//         elementType,
//         color: style.color,
//         pointRadius: geometry.type === "Point" ? getPointRadius(elementType) : null,
//       };
//     });
//     setData(rows);
//     setGroupedData(rows.reduce((acc, row) => {
//       const type = row.elementType;
//       if (!acc[type]) acc[type] = [];
//       acc[type].push(row);
//       return acc;
//     }, {}));
//     setTotalPages(mockData.pagination.totalPages);
//     setCurrentPage(mockData.pagination.currentPage);
//     setLayerInfo(mockData.layerInfo);
//     */
//   }, [layerName, token, selectedElement, navigate]);

//   const handleElementChange = (elementType) => {
//     setSelectedElement(elementType);
//     setActiveTab(elementType);
//     fetchData(1, elementType);
//   };

//   const toggleRow = (id) => setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

//   const toggleColumn = (column) => setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));

//   const renderValue = (value, isGeometry = false, elementType) => {
//     if (value === null || value === undefined) return "N/A";

//     if (typeof value === "object") {
//       if (isGeometry) {
//         const geomType = value.type || "Unknown";
//         const isPoint = geomType === "Point";
//         return (
//           <div>
//             <div>
//               <strong>Type:</strong> {geomType} {isPoint && `(Radius: ${getPointRadius(elementType)}px)`}
//             </div>
//             <div>
//               <span
//                 style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }}
//                 onClick={() => toggleRow(JSON.stringify(value))}
//               >
//                 {expandedRows[JSON.stringify(value)] ? "Hide Coordinates" : "Show Coordinates"}
//               </span>
//             </div>
//             {expandedRows[JSON.stringify(value)] && (
//               <pre style={{ fontSize: "10px", marginTop: "5px", maxHeight: "200px", overflow: "auto" }}>
//                 {JSON.stringify(value, null, 2)}
//               </pre>
//             )}
//           </div>
//         );
//       }

//       return expandedRows[JSON.stringify(value)] ? (
//         <pre style={{ maxHeight: "200px", overflow: "auto" }}>{JSON.stringify(value, null, 2)}</pre>
//       ) : (
//         <span
//           style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }}
//           onClick={() => toggleRow(JSON.stringify(value))}
//         >
//           {Array.isArray(value) ? `[Array: ${value.length} items]` : `{Object: ${Object.keys(value).length} keys}`}
//         </span>
//       );
//     }

//     if (typeof value === "string" && value.length > 100) {
//       return expandedRows[value] ? (
//         <div>
//           <div>{value}</div>
//           <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(value)}>
//             Show Less
//           </span>
//         </div>
//       ) : (
//         <div>
//           <div>{value.substring(0, 100)}...</div>
//           <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }} onClick={() => toggleRow(value)}>
//             Show More
//           </span>
//         </div>
//       );
//     }

//     return value.toString();
//   };

//   // Exports
//   const exportCSV = () => {
//     const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => {
//       const obj = { id: row.id, elementType: row.elementType };
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
//     const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => ({
//       id: row.id,
//       elementType: row.elementType,
//       attributes: row.attributes,
//       geometry: row.geometry,
//       color: row.color,
//     }));
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
//       const obj = { id: row.id, elementType: row.elementType };
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

//   const getDataToDisplay = () => (selectedElement === "all" ? groupedData : { [selectedElement]: groupedData[selectedElement] || [] });

//   // Handle missing or invalid layerName
//   if (!layerName || !dataTypes.some((dt) => dt.key === layerName)) {
//     return (
//       <div style={{ textAlign: "center", padding: 40 }}>
//         <h2>No valid layer selected</h2>
//         <p>Please select a layer to view data:</p>
//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
//           {dataTypes.map((dt) => (
//             <Link
//               key={dt.key}
//               to={`/data/${dt.key}`}
//               style={{
//                 padding: "10px 20px",
//                 borderRadius: 8,
//                 backgroundColor: "#f9fafb",
//                 color: "#374151",
//                 textDecoration: "none",
//                 cursor: "pointer",
//               }}
//             >
//               {dt.label}
//             </Link>
//           ))}
//         </div>
//         <button
//           onClick={() => navigate("/")}
//           style={{ marginTop: 20, backgroundColor: "#3b82f6", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none" }}
//         >
//           Go to Home
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ maxWidth: "95%", margin: "40px auto", padding: 20 }}>
//       <ToastContainer />
//       <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 20 }}>
//         Data View - {dataTypes.find((dt) => dt.key === layerName)?.label || layerName}
//       </h1>

//       {/* Debug info */}
//       {apiError && (
//         <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "8px", marginBottom: "20px" }}>
//           <strong>API Error:</strong> {apiError}
//           <div style={{ marginTop: "10px" }}>
//             <button
//               onClick={() => fetchData(1, selectedElement)}
//               style={{ backgroundColor: "#ef4444", color: "white", padding: "5px 10px", borderRadius: "4px", border: "none" }}
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Controls, Search, Export */}
//       <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", flex: 1 }}
//           onKeyPress={(e) => e.key === "Enter" && fetchData(1, selectedElement)}
//         />
//         <button onClick={() => fetchData(1, selectedElement)} style={{ backgroundColor: "#22c55e", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>
//           Search
//         </button>
//         <button onClick={exportCSV} style={{ backgroundColor: "#2563eb", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>
//           CSV
//         </button>
//         <button onClick={exportJSON} style={{ backgroundColor: "#8b5cf6", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>
//           JSON
//         </button>
//         <button onClick={exportXLSX} style={{ backgroundColor: "#ec4899", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>
//           XLSX
//         </button>
//         <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} style={{ padding: "10px 12px", borderRadius: 8 }}>
//           <option value={10}>10</option>
//           <option value={25}>25</option>
//           <option value={50}>50</option>
//           <option value={100}>100</option>
//         </select>
//       </div>

//       {/* Tabs */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
//         <div
//           onClick={() => handleElementChange("all")}
//           style={{
//             padding: "10px 20px",
//             borderRadius: 8,
//             cursor: "pointer",
//             backgroundColor: activeTab === "all" ? "#3b82f6" : "#f9fafb",
//             color: activeTab === "all" ? "#fff" : "#374151",
//           }}
//         >
//           All Elements
//         </div>
//         {dataTypes
//           .filter((dt) => Object.keys(groupedData).includes(dt.key))
//           .map((dt) => (
//             <div
//               key={dt.key}
//               onClick={() => handleElementChange(dt.key)}
//               style={{
//                 padding: "10px 20px",
//                 borderRadius: 8,
//                 cursor: "pointer",
//                 backgroundColor: activeTab === dt.key ? "#3b82f6" : "#f9fafb",
//                 color: activeTab === dt.key ? "#fff" : "#374151",
//               }}
//             >
//               {dt.label}
//             </div>
//           ))}
//       </div>

//       {/* Tables */}
//       {loading ? (
//         <div style={{ textAlign: "center", padding: 40 }}>Loading data...</div>
//       ) : (
//         Object.entries(getDataToDisplay()).map(([elementType, elementData]) =>
//           elementData.length > 0 && (
//             <div key={elementType} style={{ overflowX: "auto", marginBottom: 20 }}>
//               <h3>
//                 {dataTypes.find((dt) => dt.key === elementType)?.label || elementType} ({elementData.length})
//               </h3>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr>
//                     {columnOrder.map(
//                       (col) =>
//                         visibleColumns[col] && (
//                           <th key={col} style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}>
//                             {col.startsWith("attributes.") ? col.replace("attributes.", "") : col}
//                           </th>
//                         )
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {elementData.map((item) => (
//                     <tr key={item.id} style={{ backgroundColor: "#f9fafb" }}>
//                       {columnOrder.map(
//                         (col) =>
//                           visibleColumns[col] && (
//                             <td key={col} style={{ padding: 8 }}>
//                               {col.startsWith("attributes.")
//                                 ? renderValue(item.attributes[col.replace("attributes.", "")])
//                                 : col === "geometry"
//                                 ? renderValue(item.geometry, true, item.elementType)
//                                 : col === "color"
//                                 ? (
//                                     <div style={{ display: "flex", alignItems: "center" }}>
//                                       <span
//                                         style={{
//                                           backgroundColor: item.color,
//                                           width: item.pointRadius ? item.pointRadius * 2 : 18,
//                                           height: item.pointRadius ? item.pointRadius * 2 : 10,
//                                           display: "inline-block",
//                                           marginRight: 6,
//                                           borderRadius: item.pointRadius ? "50%" : "0",
//                                         }}
//                                       ></span>
//                                       {item.color}
//                                     </div>
//                                   )
//                                 : item[col]}
//                             </td>
//                           )
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )
//         )
//       )}

//       {!loading && Object.keys(getDataToDisplay()).length === 0 && (
//         <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
//           No data available for this layer. Please check if the API endpoint is correct or upload data.
//           <div style={{ marginTop: "10px" }}>
//             <button
//               onClick={() => fetchData(1, selectedElement)}
//               style={{ backgroundColor: "#3b82f6", color: "white", padding: "5px 10px", borderRadius: "4px", border: "none" }}
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
//           <button disabled={currentPage === 1} onClick={() => fetchData(currentPage - 1, selectedElement)}>
//             Previous
//           </button>
//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             let pageNum = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
//             if (pageNum < 1 || pageNum > totalPages) return null;
//             return (
//               <button
//                 key={pageNum}
//                 onClick={() => fetchData(pageNum, selectedElement)}
//                 style={{
//                   backgroundColor: pageNum === currentPage ? "#3b82f6" : "#fff",
//                   color: pageNum === currentPage ? "#fff" : "#374151",
//                 }}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}
//           <button disabled={currentPage === totalPages} onClick={() => fetchData(currentPage + 1, selectedElement)}>
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DataView;

//Morning 
// // src/pages/DataView.jsx
// import React, { useEffect, useState, useMemo } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// const availableLayers = [
//   'buildings', 'roads', 'footpaths', 'vegetation', 'parking',
//   'solid_waste', 'electricity', 'water_supply', 'drainage',
//   'security', 'recreational_areas'
// ];

// const typeOptions = [
//   { label: 'All', value: 'all' },
//   { label: 'Building', value: 'building' },
//   { label: 'Road', value: 'road' },
//   { label: 'Footpath', value: 'footpath' },
//   { label: 'Vegetation', value: 'vegetation' },
//   { label: 'Parking', value: 'parking' },
//   { label: 'Solid Waste', value: 'solid_waste' },
//   { label: 'Electricity', value: 'electricity' },
//   { label: 'Water Supply', value: 'water_supply' },
//   { label: 'Drainage', value: 'drainage' },
//   { label: 'Security', value: 'security' },
//   { label: 'Recreational', value: 'recreational_areas' }
// ];

// const DataView = ({ layer: initialLayer }) => {
//   const { token } = useAuth(); // JWT token from context
//   const [layer, setLayer] = useState(initialLayer || '');
//   const [data, setData] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [limit] = useState(20);
//   const [elementType, setElementType] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');

//   const fetchData = async () => {
//     if (!layer) return;
//     setLoading(true);

//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_SPATIAL_URL}/geojson/${layer}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { page, limit, elementType }
//       });

//       const features = res.data.features || [];

//       // Set unique columns based on properties keys
//       const allKeys = new Set();
//       features.forEach(f => {
//         if (f.properties) {
//           Object.keys(f.properties).forEach(k => allKeys.add(k));
//         }
//       });

//       setColumns(Array.from(allKeys));
//       setData(features);
//       setTotalPages(Math.ceil((res.data.total || features.length) / limit));
//     } catch (err) {
//       console.error('[DataView] Fetch Error:', err);
//       setData([]);
//       setColumns([]);
//       setTotalPages(1);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [layer, page, elementType]);

//   const filteredData = useMemo(() => {
//     if (!searchQuery) return data;
//     return data.filter(f => 
//       f.properties && 
//       Object.values(f.properties).some(val => 
//         val && val.toString().toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     );
//   }, [data, searchQuery]);

//   const handlePrev = () => setPage(p => Math.max(1, p - 1));
//   const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

//   return (
//     <div style={{ padding: '16px' }}>
//       <h2>Tabular Data for {layer || 'No layer selected'}</h2>

//       {/* Layer Selector */}
//       <div style={{ margin: '10px 0' }}>
//         <label>Select Layer: </label>
//         <select value={layer} onChange={e => { setLayer(e.target.value); setPage(1); }}>
//           <option value="">--Select Layer--</option>
//           {availableLayers.map(l => (
//             <option key={l} value={l}>{l.replace('_', ' ').toUpperCase()}</option>
//           ))}
//         </select>
//       </div>

//       {/* Type Filter */}
//       {layer && (
//         <div style={{ margin: '10px 0' }}>
//           <label>Filter by type: </label>
//           <select value={elementType} onChange={e => { setElementType(e.target.value); setPage(1); }}>
//             {typeOptions.map(t => (
//               <option key={t.value} value={t.value}>{t.label}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Search */}
//       <div style={{ margin: '10px 0' }}>
//         <input 
//           type="text" 
//           placeholder="Search attributes..." 
//           value={searchQuery} 
//           onChange={e => setSearchQuery(e.target.value)} 
//           style={{ padding: '6px', width: '300px' }}
//         />
//       </div>

//       {loading ? (
//         <p>Loading data...</p>
//       ) : (
//         <>
//           <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 {columns.map(col => <th key={col}>{col.toUpperCase()}</th>)}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.length === 0 ? (
//                 <tr><td colSpan={columns.length + 1} style={{ textAlign: 'center' }}>No data found</td></tr>
//               ) : filteredData.map((feature, idx) => (
//                 <tr key={idx}>
//                   <td>{(page - 1) * limit + idx + 1}</td>
//                   {columns.map(col => (
//                     <td key={col}>{feature.properties ? feature.properties[col] ?? '-' : '-'}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
//             <button onClick={handlePrev} disabled={page <= 1}>Prev</button>
//             <span>Page {page} of {totalPages}</span>
//             <button onClick={handleNext} disabled={page >= totalPages}>Next</button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default DataView;
//almost there 
// src/pages/DataView.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ------------------------
// Debounce helper
// ------------------------
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// ------------------------
// Retry fetch helper with exponential backoff
// ------------------------
const fetchWithRetry = async (url, options, maxRetries = 3, timeout = 45000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const response = await axios({ ...options, url, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (error.response?.status === 404) throw error;
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 5;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
};

// ------------------------
// Token validation helper
// ------------------------
const checkTokenValidity = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// ------------------------
// Local storage caching
// ------------------------
const useLocalStorageCache = (key, ttl = 3600000) => {
  const get = useCallback(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      const { value, timestamp } = JSON.parse(item);
      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(key);
        return null;
      }
      return value;
    } catch {
      return null;
    }
  }, [key, ttl]);

  const set = useCallback((value) => {
    try {
      localStorage.setItem(key, JSON.stringify({ value, timestamp: Date.now() }));
    } catch {}
  }, [key]);

  return { get, set };
};

// ------------------------
// DataView Page
// ------------------------
function DataView() {
  const [spatialData, setSpatialData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFeatures, setFilteredFeatures] = useState({});
  const [selectedLayers, setSelectedLayers] = useState(new Set(['buildings']));
  const [failedLayers, setFailedLayers] = useState(new Set());
  const location = useLocation();
  const navigate = useNavigate();

  const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');
  const API_ENDPOINTS = {
    buildings: `${SPATIAL_API_BASE}/geojson/buildings`,
    roads: `${SPATIAL_API_BASE}/geojson/roads`,
    footpaths: `${SPATIAL_API_BASE}/geojson/footpaths`,
    vegetation: `${SPATIAL_API_BASE}/geojson/vegetation`,
    parking: `${SPATIAL_API_BASE}/geojson/parking`,
    solid_waste: `${SPATIAL_API_BASE}/geojson/solid-waste`,
    electricity: `${SPATIAL_API_BASE}/geojson/electricity`,
    water_supply: `${SPATIAL_API_BASE}/geojson/water-supply`,
    drainage: `${SPATIAL_API_BASE}/geojson/drainage`,
    vimbweta: `${SPATIAL_API_BASE}/geojson/vimbweta`,
    security: `${SPATIAL_API_BASE}/geojson/security`,
    recreational_areas: `${SPATIAL_API_BASE}/geojson/recreational-areas`,
    aru_boundary: `${SPATIAL_API_BASE}/geojson/aru-boundary`
  };

  const spatialCache = useLocalStorageCache('spatial-data-cache', 86400000);
  const spatialDataCache = useRef(new Map());

  // Authentication & initial data load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !checkTokenValidity(token)) {
      navigate('/login');
      return;
    }

    const cachedData = spatialCache.get();
    if (cachedData) setSpatialData(cachedData);

    const fetchInitialLayers = async () => {
      setLoading(true);
      try {
        const newSpatialData = {};
        for (const layer of selectedLayers) {
          try {
            const resp = await fetchWithRetry(API_ENDPOINTS[layer], {
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            newSpatialData[layer] = resp.data.features || [];
            spatialDataCache.current.set(layer, newSpatialData[layer]);
            setFailedLayers(prev => {
              const setCopy = new Set(prev);
              setCopy.delete(layer);
              return setCopy;
            });
          } catch {
            setFailedLayers(prev => new Set([...prev, layer]));
            newSpatialData[layer] = [];
          }
        }
        setSpatialData(newSpatialData);
        spatialCache.set(newSpatialData);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialLayers();
  }, [navigate, selectedLayers]);

  // Search filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredFeatures({});
      return;
    }
    const filtered = {};
    Object.entries(spatialData).forEach(([layer, features]) => {
      filtered[layer] = features.filter(f =>
        f.properties && Object.values(f.properties).some(v =>
          v && v.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
    setFilteredFeatures(filtered);
  }, [searchQuery, spatialData]);

  const displayData = Object.keys(filteredFeatures).length > 0 ? filteredFeatures : spatialData;
  const totalFeatures = Object.values(displayData).reduce((sum, features) => sum + features.length, 0);

  // Export to CSV
  const exportData = (format = 'csv') => {
    try {
      const dataToExport = displayData;
      if (format === 'csv') {
        let csvContent = 'Layer,Feature Count\n';
        Object.entries(dataToExport).forEach(([layer, features]) => {
          csvContent += `${layer},${features.length}\n`;
        });
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `data-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      setError('Export failed: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <h2>Data View (Tabular)</h2>
      <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Logout</button>

      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      <input
        type="text"
        placeholder="Search features..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: '8px', width: '300px', marginBottom: '16px' }}
      />

      <p>Total Features: {totalFeatures}</p>

      {loading && <p>Loading data...</p>}

      {Object.entries(displayData).map(([layer, features]) => (
        <div key={layer} style={{ marginBottom: '16px' }}>
          <h4>{layer.toUpperCase()} ({features.length})</h4>
          <table border="1" cellPadding="4" cellSpacing="0">
            <thead>
              <tr>
                {features[0] && Object.keys(features[0].properties || {}).map(prop => (
                  <th key={prop}>{prop}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr key={idx}>
                  {Object.values(feature.properties || {}).map((val, i) => (
                    <td key={i}>{val?.toString()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <button onClick={() => exportData('csv')} style={{ marginTop: '16px', padding: '8px 12px' }}>Export CSV</button>
    </div>
  );
}

export default DataView;
