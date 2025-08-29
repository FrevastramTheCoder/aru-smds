
// //testing 

// // src/pages/DataView.jsx
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // ------------------------
// // Debounce helper
// // ------------------------
// function debounce(fn, wait) {
//   let t;
//   return (...args) => {
//     clearTimeout(t);
//     t = setTimeout(() => fn(...args), wait);
//   };
// }

// // ------------------------
// // Retry fetch helper with exponential backoff
// // ------------------------
// const fetchWithRetry = async (url, options, maxRetries = 3, timeout = 45000) => {
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), timeout);
//       const response = await axios({ ...options, url, signal: controller.signal });
//       clearTimeout(timeoutId);
//       return response;
//     } catch (error) {
//       if (error.response?.status === 404) throw error;
//       if (error.response?.status === 429) {
//         const retryAfter = error.response.headers['retry-after'] || 5;
//         await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//         continue;
//       }
//       if (i === maxRetries - 1) throw error;
//       await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
//     }
//   }
// };

// // ------------------------
// // Token validation helper
// // ------------------------
// const checkTokenValidity = (token) => {
//   if (!token) return false;
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.exp * 1000 > Date.now();
//   } catch {
//     return false;
//   }
// };

// // ------------------------
// // Local storage caching
// // ------------------------
// const useLocalStorageCache = (key, ttl = 3600000) => {
//   const get = useCallback(() => {
//     try {
//       const item = localStorage.getItem(key);
//       if (!item) return null;
//       const { value, timestamp } = JSON.parse(item);
//       if (Date.now() - timestamp > ttl) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return value;
//     } catch {
//       return null;
//     }
//   }, [key, ttl]);

//   const set = useCallback((value) => {
//     try {
//       localStorage.setItem(key, JSON.stringify({ value, timestamp: Date.now() }));
//     } catch {}
//   }, [key]);

//   return { get, set };
// };

// // ------------------------
// // DataView Page
// // ------------------------
// function DataView() {
//   const [spatialData, setSpatialData] = useState({});
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredFeatures, setFilteredFeatures] = useState({});
//   const [selectedLayers, setSelectedLayers] = useState(new Set(['buildings']));
//   const [failedLayers, setFailedLayers] = useState(new Set());
//   const location = useLocation();
//   const navigate = useNavigate();

//   const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');
//   const API_ENDPOINTS = {
//     buildings: `${SPATIAL_API_BASE}/geojson/buildings`,
//     roads: `${SPATIAL_API_BASE}/geojson/roads`,
//     footpaths: `${SPATIAL_API_BASE}/geojson/footpaths`,
//     vegetation: `${SPATIAL_API_BASE}/geojson/vegetation`,
//     parking: `${SPATIAL_API_BASE}/geojson/parking`,
//     solid_waste: `${SPATIAL_API_BASE}/geojson/solid-waste`,
//     electricity: `${SPATIAL_API_BASE}/geojson/electricity`,
//     water_supply: `${SPATIAL_API_BASE}/geojson/water-supply`,
//     drainage: `${SPATIAL_API_BASE}/geojson/drainage`,
//     vimbweta: `${SPATIAL_API_BASE}/geojson/vimbweta`,
//     security: `${SPATIAL_API_BASE}/geojson/security`,
//     recreational_areas: `${SPATIAL_API_BASE}/geojson/recreational-areas`,
//     aru_boundary: `${SPATIAL_API_BASE}/geojson/aru-boundary`
//   };

//   const spatialCache = useLocalStorageCache('spatial-data-cache', 86400000);
//   const spatialDataCache = useRef(new Map());

//   // Authentication & initial data load
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token || !checkTokenValidity(token)) {
//       navigate('/login');
//       return;
//     }

//     const cachedData = spatialCache.get();
//     if (cachedData) setSpatialData(cachedData);

//     const fetchInitialLayers = async () => {
//       setLoading(true);
//       try {
//         const newSpatialData = {};
//         for (const layer of Object.keys(API_ENDPOINTS)) {
//           if (!selectedLayers.has(layer)) continue;
//           try {
//             const resp = await fetchWithRetry(API_ENDPOINTS[layer], {
//               headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//             });
//             newSpatialData[layer] = resp.data.features || [];
//             spatialDataCache.current.set(layer, newSpatialData[layer]);
//             setFailedLayers(prev => {
//               const setCopy = new Set(prev);
//               setCopy.delete(layer);
//               return setCopy;
//             });
//           } catch {
//             setFailedLayers(prev => new Set([...prev, layer]));
//             newSpatialData[layer] = [];
//           }
//         }
//         setSpatialData(prev => ({ ...prev, ...newSpatialData }));
//         spatialCache.set({ ...spatialData, ...newSpatialData });
//       } catch (err) {
//         setError('Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialLayers();
//   }, [navigate, selectedLayers]);

//   // Search filter
//   useEffect(() => {
//     if (!searchQuery) {
//       setFilteredFeatures({});
//       return;
//     }
//     const filtered = {};
//     Object.entries(spatialData).forEach(([layer, features]) => {
//       filtered[layer] = features.filter(f =>
//         f.properties && Object.values(f.properties).some(v =>
//           v && v.toString().toLowerCase().includes(searchQuery.toLowerCase())
//         )
//       );
//     });
//     setFilteredFeatures(filtered);
//   }, [searchQuery, spatialData]);

//   const displayData = Object.keys(filteredFeatures).length > 0 ? filteredFeatures : spatialData;
//   const totalFeatures = Object.values(displayData).reduce((sum, features) => sum + features.length, 0);

//   // Export to CSV
//   const exportData = (format = 'csv') => {
//     try {
//       const dataToExport = displayData;
//       if (format === 'csv') {
//         let csvContent = 'Layer,Feature Count\n';
//         Object.entries(dataToExport).forEach(([layer, features]) => {
//           csvContent += `${layer},${features.length}\n`;
//         });
//         const blob = new Blob([csvContent], { type: 'text/csv' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `data-export-${new Date().toISOString().split('T')[0]}.csv`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//       }
//     } catch (err) {
//       setError('Export failed: ' + err.message);
//     }
//   };

//   const toggleLayer = (layer) => {
//     const newSet = new Set(selectedLayers);
//     if (newSet.has(layer)) newSet.delete(layer);
//     else newSet.add(layer);
//     setSelectedLayers(newSet);
//   };

//   return (
//     <div style={{ padding: '16px' }}>
//       <h2>Data View (Tabular)</h2>
//       <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Logout</button>

//       {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

//       <div style={{ margin: '16px 0' }}>
//         <input
//           type="text"
//           placeholder="Search features..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           style={{ padding: '8px', width: '300px' }}
//         />
//       </div>

//       <div style={{ marginBottom: '16px' }}>
//         <h4>Select Layers:</h4>
//         {Object.keys(API_ENDPOINTS).map(layer => (
//           <label key={layer} style={{ marginRight: '12px' }}>
//             <input
//               type="checkbox"
//               checked={selectedLayers.has(layer)}
//               onChange={() => toggleLayer(layer)}
//             />
//             {layer}
//           </label>
//         ))}
//       </div>

//       <p>Total Features: {totalFeatures}</p>

//       {loading && <p>Loading data...</p>}

//       {Object.entries(displayData).map(([layer, features]) => (
//         selectedLayers.has(layer) && (
//           <div key={layer} style={{ marginBottom: '16px' }}>
//             <h4>{layer.toUpperCase()} ({features.length})</h4>
//             <table border="1" cellPadding="4" cellSpacing="0">
//               <thead>
//                 <tr>
//                   {features[0] && Object.keys(features[0].properties || {}).map(prop => (
//                     <th key={prop}>{prop}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {features.map((feature, idx) => (
//                   <tr key={idx}>
//                     {Object.values(feature.properties || {}).map((val, i) => (
//                       <td key={i}>{val?.toString()}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {failedLayers.has(layer) && <p style={{ color: 'orange' }}>Failed to load some data for this layer.</p>}
//           </div>
//         )
//       ))}

//       <button onClick={() => exportData('csv')} style={{ marginTop: '16px', padding: '8px 12px' }}>Export CSV</button>
//     </div>
//   );
// }

// export default DataView;

// //professional
// // src/pages/DataView.jsx
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // ------------------------
// // Debounce helper
// // ------------------------
// function debounce(fn, wait) {
//   let t;
//   return (...args) => {
//     clearTimeout(t);
//     t = setTimeout(() => fn(...args), wait);
//   };
// }

// // ------------------------
// // Retry fetch helper
// // ------------------------
// const fetchWithRetry = async (url, options, maxRetries = 3, timeout = 45000) => {
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), timeout);
//       const response = await axios({ ...options, url, signal: controller.signal });
//       clearTimeout(timeoutId);
//       return response;
//     } catch (error) {
//       if (error.response?.status === 404) throw error;
//       if (error.response?.status === 429) {
//         const retryAfter = error.response.headers['retry-after'] || 5;
//         await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//         continue;
//       }
//       if (i === maxRetries - 1) throw error;
//       await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
//     }
//   }
// };

// // ------------------------
// // Token validation helper
// // ------------------------
// const checkTokenValidity = (token) => {
//   if (!token) return false;
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.exp * 1000 > Date.now();
//   } catch {
//     return false;
//   }
// };

// // ------------------------
// // Local storage caching
// // ------------------------
// const useLocalStorageCache = (key, ttl = 3600000) => {
//   const get = useCallback(() => {
//     try {
//       const item = localStorage.getItem(key);
//       if (!item) return null;
//       const { value, timestamp } = JSON.parse(item);
//       if (Date.now() - timestamp > ttl) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return value;
//     } catch {
//       return null;
//     }
//   }, [key, ttl]);

//   const set = useCallback((value) => {
//     try {
//       localStorage.setItem(key, JSON.stringify({ value, timestamp: Date.now() }));
//     } catch {}
//   }, [key]);

//   return { get, set };
// };

// // ------------------------
// // DataView Page
// // ------------------------
// function DataView() {
//   const [spatialData, setSpatialData] = useState({});
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredFeatures, setFilteredFeatures] = useState({});
//   const [selectedLayers, setSelectedLayers] = useState(new Set(['buildings']));
//   const [failedLayers, setFailedLayers] = useState(new Set());
//   const [collapsedLayers, setCollapsedLayers] = useState(new Set());
//   const location = useLocation();
//   const navigate = useNavigate();

//   const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');
//   const API_ENDPOINTS = {
//     buildings: `${SPATIAL_API_BASE}/geojson/buildings`,
//     roads: `${SPATIAL_API_BASE}/geojson/roads`,
//     footpaths: `${SPATIAL_API_BASE}/geojson/footpaths`,
//     vegetation: `${SPATIAL_API_BASE}/geojson/vegetation`,
//     parking: `${SPATIAL_API_BASE}/geojson/parking`,
//     solid_waste: `${SPATIAL_API_BASE}/geojson/solid-waste`,
//     electricity: `${SPATIAL_API_BASE}/geojson/electricity`,
//     water_supply: `${SPATIAL_API_BASE}/geojson/water-supply`,
//     drainage: `${SPATIAL_API_BASE}/geojson/drainage`,
//     vimbweta: `${SPATIAL_API_BASE}/geojson/vimbweta`,
//     security: `${SPATIAL_API_BASE}/geojson/security`,
//     recreational_areas: `${SPATIAL_API_BASE}/geojson/recreational-areas`,
//     aru_boundary: `${SPATIAL_API_BASE}/geojson/aru-boundary`
//   };

//   const spatialCache = useLocalStorageCache('spatial-data-cache', 86400000);
//   const spatialDataCache = useRef(new Map());

//   // Authentication & initial data load
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token || !checkTokenValidity(token)) {
//       navigate('/login');
//       return;
//     }

//     const cachedData = spatialCache.get();
//     if (cachedData) setSpatialData(cachedData);

//     const fetchInitialLayers = async () => {
//       setLoading(true);
//       try {
//         const newSpatialData = {};
//         for (const layer of Object.keys(API_ENDPOINTS)) {
//           if (!selectedLayers.has(layer)) continue;
//           try {
//             const resp = await fetchWithRetry(API_ENDPOINTS[layer], {
//               headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//             });
//             newSpatialData[layer] = resp.data.features || [];
//             spatialDataCache.current.set(layer, newSpatialData[layer]);
//             setFailedLayers(prev => {
//               const setCopy = new Set(prev);
//               setCopy.delete(layer);
//               return setCopy;
//             });
//           } catch {
//             setFailedLayers(prev => new Set([...prev, layer]));
//             newSpatialData[layer] = [];
//           }
//         }
//         setSpatialData(prev => ({ ...prev, ...newSpatialData }));
//         spatialCache.set({ ...spatialData, ...newSpatialData });
//       } catch (err) {
//         setError('Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialLayers();
//   }, [navigate, selectedLayers]);

//   // Search filter
//   useEffect(() => {
//     if (!searchQuery) {
//       setFilteredFeatures({});
//       return;
//     }
//     const filtered = {};
//     Object.entries(spatialData).forEach(([layer, features]) => {
//       filtered[layer] = features.filter(f =>
//         f.properties && Object.values(f.properties).some(v =>
//           v && v.toString().toLowerCase().includes(searchQuery.toLowerCase())
//         )
//       );
//     });
//     setFilteredFeatures(filtered);
//   }, [searchQuery, spatialData]);

//   const displayData = Object.keys(filteredFeatures).length > 0 ? filteredFeatures : spatialData;
//   const totalFeatures = Object.values(displayData).reduce((sum, features) => sum + features.length, 0);

//   // Export to CSV
//   const exportData = (format = 'csv') => {
//     try {
//       const dataToExport = displayData;
//       if (format === 'csv') {
//         let csvContent = 'Layer,Feature Count\n';
//         Object.entries(dataToExport).forEach(([layer, features]) => {
//           csvContent += `${layer},${features.length}\n`;
//         });
//         const blob = new Blob([csvContent], { type: 'text/csv' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `data-export-${new Date().toISOString().split('T')[0]}.csv`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//       }
//     } catch (err) {
//       setError('Export failed: ' + err.message);
//     }
//   };

//   const toggleLayer = (layer) => {
//     const newSet = new Set(selectedLayers);
//     if (newSet.has(layer)) newSet.delete(layer);
//     else newSet.add(layer);
//     setSelectedLayers(newSet);
//   };

//   const toggleCollapse = (layer) => {
//     const newSet = new Set(collapsedLayers);
//     if (newSet.has(layer)) newSet.delete(layer);
//     else newSet.add(layer);
//     setCollapsedLayers(newSet);
//   };

//   return (
//     <div style={{ display: 'flex', padding: '24px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
//       {/* Left Side: Data Tables */}
//       <div style={{ flex: 3, marginRight: '24px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h2 style={{ color: '#333' }}>Data View (Tabular)</h2>
//           <button
//             onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
//             style={{
//               padding: '8px 16px',
//               backgroundColor: '#d9534f',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer'
//             }}
//           >
//             Logout
//           </button>
//         </div>

//         {error && <div style={{ color: 'red', margin: '12px 0' }}>{error}</div>}

//         <div style={{ margin: '16px 0' }}>
//           <input
//             type="text"
//             placeholder="Search features..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             style={{
//               padding: '10px 12px',
//               width: '320px',
//               borderRadius: '4px',
//               border: '1px solid #ccc',
//               boxShadow: '1px 1px 4px rgba(0,0,0,0.1)'
//             }}
//           />
//         </div>

//         <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
//           {Object.keys(API_ENDPOINTS).map(layer => (
//             <label key={layer} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
//               <input
//                 type="checkbox"
//                 checked={selectedLayers.has(layer)}
//                 onChange={() => toggleLayer(layer)}
//                 style={{ cursor: 'pointer' }}
//               />
//               {layer}
//             </label>
//           ))}
//         </div>

//         <p style={{ fontWeight: 'bold', color: '#555' }}>Total Features: {totalFeatures}</p>

//         {loading && <p>Loading data...</p>}

//         {Object.entries(displayData).map(([layer, features]) => (
//           selectedLayers.has(layer) && (
//             <div
//               key={layer}
//               style={{
//                 marginBottom: '24px',
//                 backgroundColor: '#fff',
//                 borderRadius: '6px',
//                 boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//                 overflow: 'hidden'
//               }}
//             >
//               <div
//                 onClick={() => toggleCollapse(layer)}
//                 style={{
//                   padding: '12px 16px',
//                   backgroundColor: '#007bff',
//                   color: '#fff',
//                   cursor: 'pointer',
//                   fontWeight: 'bold',
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center'
//                 }}
//               >
//                 {layer.toUpperCase()} ({features.length})
//                 <span>{collapsedLayers.has(layer) ? '+' : '-'}</span>
//               </div>

//               {!collapsedLayers.has(layer) && (
//                 <div style={{ padding: '16px', overflowX: 'auto' }}>
//                   <table
//                     style={{
//                       width: '100%',
//                       borderCollapse: 'collapse',
//                       fontSize: '14px'
//                     }}
//                   >
//                     <thead style={{ backgroundColor: '#f1f3f5' }}>
//                       <tr>
//                         {features[0] && Object.keys(features[0].properties || {}).map(prop => (
//                           <th
//                             key={prop}
//                             style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}
//                           >
//                             {prop}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {features.map((feature, idx) => (
//                         <tr
//                           key={idx}
//                           style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}
//                         >
//                           {Object.values(feature.properties || {}).map((val, i) => (
//                             <td key={i} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
//                               {val?.toString()}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                   {failedLayers.has(layer) && (
//                     <p style={{ color: 'orange', marginTop: '8px' }}>Failed to load some data for this layer.</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           )
//         ))}

//         <button
//           onClick={() => exportData('csv')}
//           style={{
//             marginTop: '16px',
//             padding: '10px 18px',
//             backgroundColor: '#28a745',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontWeight: 'bold'
//           }}
//         >
//           Export CSV
//         </button>
//       </div>

//       {/* Right Side: Layer Statistics Panel */}
//       <div style={{
//         flex: 1,
//         backgroundColor: '#fff',
//         borderRadius: '6px',
//         padding: '16px',
//         boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//         height: 'fit-content'
//       }}>
//         <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '8px', color: '#007bff' }}>Layer Statistics</h3>
//         <ul style={{ listStyle: 'none', padding: 0, marginTop: '12px' }}>
//           {Object.entries(displayData).map(([layer, features]) => (
//             <li key={layer} style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               padding: '6px 0',
//               borderBottom: '1px solid #eee',
//               color: failedLayers.has(layer) ? '#d9534f' : '#333',
//               fontWeight: failedLayers.has(layer) ? 'bold' : 'normal'
//             }}>
//               <span>{layer}</span>
//               <span>{features.length}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default DataView;
//gis dashboard
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
// Retry fetch helper
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
  const [collapsedLayers, setCollapsedLayers] = useState(new Set());
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
        for (const layer of Object.keys(API_ENDPOINTS)) {
          if (!selectedLayers.has(layer)) continue;
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
        setSpatialData(prev => ({ ...prev, ...newSpatialData }));
        spatialCache.set({ ...spatialData, ...newSpatialData });
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

  const toggleLayer = (layer) => {
    const newSet = new Set(selectedLayers);
    if (newSet.has(layer)) newSet.delete(layer);
    else newSet.add(layer);
    setSelectedLayers(newSet);
  };

  const toggleCollapse = (layer) => {
    const newSet = new Set(collapsedLayers);
    if (newSet.has(layer)) newSet.delete(layer);
    else newSet.add(layer);
    setCollapsedLayers(newSet);
  };

  const getBadgeColor = (layer) => {
    if (failedLayers.has(layer)) return '#d9534f'; // red
    if (displayData[layer]?.length > 0) return '#28a745'; // green
    return '#ffc107'; // yellow/orange for empty
  };

  return (
    <div style={{ display: 'flex', padding: '24px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Left Side: Data Tables */}
      <div style={{ flex: 3, marginRight: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#333' }}>Data View (Tabular)</h2>
          <button
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#d9534f',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        {error && <div style={{ color: 'red', margin: '12px 0' }}>{error}</div>}

        <div style={{ margin: '16px 0' }}>
          <input
            type="text"
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '10px 12px',
              width: '320px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              boxShadow: '1px 1px 4px rgba(0,0,0,0.1)'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {Object.keys(API_ENDPOINTS).map(layer => (
            <label key={layer} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={selectedLayers.has(layer)}
                onChange={() => toggleLayer(layer)}
                style={{ cursor: 'pointer' }}
              />
              {layer}
            </label>
          ))}
        </div>

        <p style={{ fontWeight: 'bold', color: '#555' }}>Total Features: {totalFeatures}</p>

        {loading && <p>Loading data...</p>}

        {Object.entries(displayData).map(([layer, features]) => (
          selectedLayers.has(layer) && (
            <div
              key={layer}
              style={{
                marginBottom: '24px',
                backgroundColor: '#fff',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}
            >
              <div
                onClick={() => toggleCollapse(layer)}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {layer.toUpperCase()} ({features.length})
                <span>{collapsedLayers.has(layer) ? '+' : '-'}</span>
              </div>

              {!collapsedLayers.has(layer) && (
                <div style={{ padding: '16px', overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '14px'
                    }}
                  >
                    <thead style={{ backgroundColor: '#f1f3f5' }}>
                      <tr>
                        {features[0] && Object.keys(features[0].properties || {}).map(prop => (
                          <th
                            key={prop}
                            style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}
                          >
                            {prop}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {features.map((feature, idx) => (
                        <tr
                          key={idx}
                          style={{
                            backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9',
                            transition: 'background-color 0.2s',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2f0ff'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#fff' : '#f9f9f9'}
                        >
                          {Object.values(feature.properties || {}).map((val, i) => (
                            <td key={i} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                              {val?.toString()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {failedLayers.has(layer) && (
                    <p style={{ color: 'orange', marginTop: '8px' }}>Failed to load some data for this layer.</p>
                  )}
                </div>
              )}
            </div>
          )
        ))}

        <button
          onClick={() => exportData('csv')}
          style={{
            marginTop: '16px',
            padding: '10px 18px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Right Side: Layer Statistics Panel */}
      <div style={{
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: '6px',
        padding: '16px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        height: 'fit-content'
      }}>
        <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '8px', color: '#007bff' }}>Layer Statistics</h3>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '12px' }}>
          {Object.entries(displayData).map(([layer, features]) => (
            <li key={layer} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 0',
              borderBottom: '1px solid #eee',
              fontWeight: failedLayers.has(layer) ? 'bold' : 'normal'
            }}>
              <span>{layer}</span>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: getBadgeColor(layer),
                color: '#fff',
                fontSize: '12px',
                minWidth: '30px',
                textAlign: 'center'
              }}>{features.length}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DataView;
