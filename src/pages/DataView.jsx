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

//   // Fetch data like MapView
//   const fetchData = async (page = 1, elementType = "all") => {
//     setLoading(true);
//     try {
//       let url = `${API_BASE}/data/${layerName}?page=${page}&limit=${limit}`;
//       if (elementType !== "all") url += `&elementType=${elementType}`;

//       const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });

//       if (res.data?.success) {
//         const rows = res.data.data.map((r) => {
//           const attributes = r.attributes || {};
//           const geometry = r.geometry || {};
//           const elementType = r.elementType || layerName || "unknown";
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
//       toast.error(err.response?.data?.error || "Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (layerName && token) fetchData(1, selectedElement);
//     else if (!token) toast.error("Please log in to view data");
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

//   return (
//     <div style={{ maxWidth: "95%", margin: "40px auto", padding: 20 }}>
//       <ToastContainer />
//       <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 20 }}>
//         Data View - {dataTypes.find((dt) => dt.key === layerName)?.label || layerName}
//       </h1>

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
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import Papa from "papaparse";

// Define data types for elements
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
  const location = useLocation();
  const token = localStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_API_SPATIAL_URL || "http://localhost:5000/api/spatial";

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

  // Fetch data like MapView
  const fetchData = async (page = 1, elementType = "all") => {
    setLoading(true);
    try {
      // Convert layer name to match API endpoint format (snake_case to kebab-case)
      const formattedLayerName = layerName.replace(/_/g, '-');
      
      let url = `${API_BASE}/data/${formattedLayerName}?page=${page}&limit=${limit}`;
      if (elementType !== "all") {
        // Convert element type to match API format
        const formattedElementType = elementType.replace(/_/g, '-');
        url += `&elementType=${formattedElementType}`;
      }

      const res = await axios.get(url, { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
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

        // Group by elementType
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
      if (err.response?.status === 404) {
        toast.error(`Data not found for layer: ${layerName}`);
      } else if (err.response?.status === 400) {
        toast.error("Invalid request. Please check your parameters.");
      } else {
        toast.error(err.response?.data?.error || "Failed to fetch data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (layerName && token) fetchData(1, selectedElement);
    else if (!token) toast.error("Please log in to view data");
  }, [layerName, limit, token, selectedElement]);

  const handleElementChange = (elementType) => {
    setSelectedElement(elementType);
    setActiveTab(elementType);
    fetchData(1, elementType);
  };

  const toggleRow = (id) => setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleColumn = (column) => setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));

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
              <pre style={{ fontSize: "10px", marginTop: "5px", maxHeight: "200px", overflow: "auto" }}>
                {JSON.stringify(value, null, 2)}
              </pre>
            )}
          </div>
        );
      }

      return expandedRows[JSON.stringify(value)] ? (
        <pre style={{ maxHeight: "200px", overflow: "auto" }}>{JSON.stringify(value, null, 2)}</pre>
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

  // Exports
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
    const dataToExport = (selectedElement !== "all" ? groupedData[selectedElement] || [] : Object.values(groupedData).flat()).map((row) => ({
      id: row.id,
      elementType: row.elementType,
      attributes: row.attributes,
      geometry: row.geometry,
      color: row.color,
    }));
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

  const getDataToDisplay = () => selectedElement === "all" ? groupedData : { [selectedElement]: groupedData[selectedElement] || [] };

  return (
    <div style={{ maxWidth: "95%", margin: "40px auto", padding: 20 }}>
      <ToastContainer />
      <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 20 }}>
        Data View - {dataTypes.find((dt) => dt.key === layerName)?.label || layerName}
      </h1>

      {/* Controls, Search, Export */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", flex: 1 }}
          onKeyPress={(e) => e.key === "Enter" && fetchData(1, selectedElement)}
        />
        <button onClick={() => fetchData(1, selectedElement)} style={{ backgroundColor: "#22c55e", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>Search</button>
        <button onClick={exportCSV} style={{ backgroundColor: "#2563eb", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>CSV</button>
        <button onClick={exportJSON} style={{ backgroundColor: "#8b5cf6", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>JSON</button>
        <button onClick={exportXLSX} style={{ backgroundColor: "#ec4899", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>XLSX</button>
        <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} style={{ padding: "10px 12px", borderRadius: 8 }}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div onClick={() => handleElementChange("all")} style={{ padding: "10px 20px", borderRadius: 8, cursor: "pointer", backgroundColor: activeTab === "all" ? "#3b82f6" : "#f9fafb", color: activeTab === "all" ? "#fff" : "#374151" }}>All Elements</div>
        {dataTypes.filter(dt => Object.keys(groupedData).includes(dt.key)).map(dt => (
          <div key={dt.key} onClick={() => handleElementChange(dt.key)} style={{ padding: "10px 20px", borderRadius: 8, cursor: "pointer", backgroundColor: activeTab === dt.key ? "#3b82f6" : "#f9fafb", color: activeTab === dt.key ? "#fff" : "#374151" }}>{dt.label}</div>
        ))}
      </div>

      {/* Tables */}
      {loading ? <div style={{ textAlign: "center", padding: 40 }}>Loading...</div> :
        Object.entries(getDataToDisplay()).map(([elementType, elementData]) =>
          elementData.length > 0 && (
            <div key={elementType} style={{ overflowX: "auto", marginBottom: 20 }}>
              <h3>{dataTypes.find(dt => dt.key === elementType)?.label || elementType} ({elementData.length})</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {columnOrder.map(col => visibleColumns[col] && <th key={col} style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}>{col.startsWith("attributes.") ? col.replace("attributes.", "") : col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {elementData.map(item => (
                    <tr key={item.id} style={{ backgroundColor: "#f9fafb" }}>
                      {columnOrder.map(col => visibleColumns[col] && (
                        <td key={col} style={{ padding: 8 }}>
                          {col.startsWith("attributes.") ? renderValue(item.attributes[col.replace("attributes.", "")]) :
                            col === "geometry" ? renderValue(item.geometry, true, item.elementType) :
                            col === "color" ? <div style={{ display: "flex", alignItems: "center" }}><span style={{ backgroundColor: item.color, width: item.pointRadius ? item.pointRadius * 2 : 18, height: item.pointRadius ? item.pointRadius * 2 : 10, display: "inline-block", marginRight: 6, borderRadius: item.pointRadius ? "50%" : "0" }}></span>{item.color}</div>
                              : item[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )
      }

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
          <button disabled={currentPage === 1} onClick={() => fetchData(currentPage - 1, selectedElement)}>Previous</button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
            if (pageNum < 1 || pageNum > totalPages) return null;
            return <button key={pageNum} onClick={() => fetchData(pageNum, selectedElement)} style={{ backgroundColor: pageNum === currentPage ? "#3b82f6" : "#fff", color: pageNum === currentPage ? "#fff" : "#374151" }}>{pageNum}</button>;
          })}
          <button disabled={currentPage === totalPages} onClick={() => fetchData(currentPage + 1, selectedElement)}>Next</button>
        </div>
      )}
    </div>
  );
}

export default DataView;