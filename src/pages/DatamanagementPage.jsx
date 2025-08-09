
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// function DataManagement() {
//   const { isAuthenticated, isLoading: authLoading } = useAuth();

//   const [dataType, setDataType] = useState('buildings');
//   const [attributes, setAttributes] = useState({});
//   const [geometry, setGeometry] = useState('');
//   const [file, setFile] = useState(null);
//   const [dataList, setDataList] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const dataTypes = [
//     { key: 'buildings', label: 'Buildings' },
//     { key: 'roads', label: 'Roads' },
//     { key: 'footpaths', label: 'Footpaths' },
//     { key: 'vegetation', label: 'Vegetation' },
//     { key: 'parking', label: 'Parking' },
//     { key: 'solid_waste', label: 'Solid Waste' },
//     { key: 'electricity', label: 'Electricity' },
//     { key: 'water_supply', label: 'Water Supply' },
//     { key: 'drainage', label: 'Drainage System' },
//     { key: 'vimbweta', label: 'Vimbweta' },
//     { key: 'security', label: 'Security Lights' },
//     { key: 'recreational_areas', label: 'Recreational Areas' },
//   ];

//   const attributeFields = {
//     buildings: ['name', 'floor', 'size', 'offices', 'use', 'condition'],
//     roads: ['road_type', 'condition', 'uses'],
//     footpaths: ['condition', 'uses'],
//     vegetation: ['type'],
//     parking: ['type', 'use', 'condition'],
//     solid_waste: ['type', 'condition'],
//     electricity: ['condition'],
//     water_supply: ['sources', 'accommodate'],
//     drainage: ['character', 'nature', 'type', 'width', 'length'],
//     vimbweta: ['condition', 'use'],
//     security: ['condition'],
//     recreational_areas: ['size', 'condition'],
//   };

//   // Use relative API path so Vite proxy works correctly
//   const API_BASE = '/api';

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchData();
//     } else if (!authLoading) {
//       setError('Please log in to view data');
//       setDataList([]);
//       setLoading(false);
//     }
//   }, [dataType, isAuthenticated, authLoading]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       const response = await axios.get(`${API_BASE}/spatial/data/${dataType}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (Array.isArray(response.data)) {
//         setDataList(response.data);
//       } else if (response.data && typeof response.data === 'object' && response.data !== null) {
//         setDataList([response.data]);
//       } else {
//         setDataList([]);
//         setError('No valid data returned from server.');
//       }
//       setError('');
//     } catch (err) {
//       if (err.response?.status === 401) {
//         setError('Unauthorized: Please log in again.');
//         localStorage.removeItem('token');
//         localStorage.removeItem('userId');
//       } else {
//         setError(err.response?.data?.message || 'Failed to load data. Please try again.');
//       }
//       setDataList([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAttributeChange = (e) => {
//     setAttributes({ ...attributes, [e.target.name]: e.target.value });
//   };

//   const handleCreate = async () => {
//     try {
//       let parsedGeometry;
//       try {
//         parsedGeometry = geometry ? JSON.parse(geometry) : {};
//       } catch {
//         throw new Error('Invalid GeoJSON format');
//       }
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       await axios.post(
//         `${API_BASE}/spatial/data`,
//         { type: dataType, attributes, geometry: parsedGeometry },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchData();
//       setAttributes({});
//       setGeometry('');
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to create data. Please check your input.');
//     }
//   };

//   const handleUpdate = async (id) => {
//     try {
//       let parsedGeometry;
//       try {
//         parsedGeometry = geometry ? JSON.parse(geometry) : {};
//       } catch {
//         throw new Error('Invalid GeoJSON format');
//       }
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       await axios.put(
//         `${API_BASE}/spatial/data/${dataType}/${id}`,
//         { attributes, geometry: parsedGeometry },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchData();
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to update data. Please check your input.');
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       await axios.delete(`${API_BASE}/spatial/data/${dataType}/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchData();
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to delete data. Please try again.');
//     }
//   };

//   const handleFileUpload = async () => {
//     if (!file) {
//       setError('Please select a file to upload.');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('type', dataType);
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       await axios.post(`${API_BASE}/spatial/upload-shapefile`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       fetchData();
//       setFile(null);
//       setError('');
//     } catch (err) {
//       if (err.response?.status === 404) {
//         setError('Upload endpoint not found. Please check server configuration.');
//       } else if (err.response?.status === 401) {
//         setError('Unauthorized: Please log in again.');
//         localStorage.removeItem('token');
//         localStorage.removeItem('userId');
//       } else {
//         setError(err.response?.data?.message || 'Failed to upload shapefile. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Leaflet Map Preview component
//   const MapPreview = () => {
//     const mapRef = useRef(null);

//     useEffect(() => {
//       if (mapRef.current && geometry) {
//         const map = L.map(mapRef.current).setView([0, 0], 2);
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '&copy; OpenStreetMap contributors',
//         }).addTo(map);

//         try {
//           const geoJson = JSON.parse(geometry);
//           L.geoJSON(geoJson).addTo(map);
//         } catch {
//           setError('Invalid GeoJSON format in preview.');
//         }

//         return () => {
//           map.remove();
//         };
//       }
//     }, [geometry]);

//     return <div ref={mapRef} style={{ height: '200px', marginBottom: '1rem' }} />;
//   };

//   if (authLoading) return <div className="p-4">Loading authentication...</div>;

//   if (!isAuthenticated) return <div className="p-4 text-red-500">Please log in to manage data.</div>;

//   return (
//     <div className="container mx-auto px-4 py-4 max-w-4xl">
//       <div className="card">
//         <h1 className="card-title">Data Management</h1>
//         {error && <p className="error-message text-red-500">{error}</p>}
//         {loading && <div className="loading-spinner">Loading...</div>}

//         {/* Data Type Selection */}
//         <div className="mb-4">
//           <label className="input-label font-semibold">Data Type</label>
//           <select
//             value={dataType}
//             onChange={(e) => setDataType(e.target.value)}
//             className="input-field border p-2 rounded w-full"
//           >
//             {dataTypes.map(({ key, label }) => (
//               <option key={key} value={key}>
//                 {label}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Create New Data */}
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">Create New Data</h2>
//           {attributeFields[dataType].map((field) => (
//             <div key={field} className="mb-2">
//               <label className="input-label font-medium">{field}</label>
//               <input
//                 type="text"
//                 name={field}
//                 value={attributes[field] || ''}
//                 onChange={handleAttributeChange}
//                 className="input-field border p-2 rounded w-full"
//               />
//             </div>
//           ))}
//           <div className="mb-2">
//             <label className="input-label font-medium">Geometry (GeoJSON)</label>
//             <textarea
//               value={geometry}
//               onChange={(e) => setGeometry(e.target.value)}
//               className="input-field border p-2 rounded w-full"
//               rows="4"
//             />
//           </div>
//           <div className="mb-2">
//             <label className="input-label font-medium">Geometry Preview</label>
//             {geometry && <MapPreview />}
//           </div>
//           <button
//             onClick={handleCreate}
//             disabled={loading}
//             className="btn-primary bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
//           >
//             Create
//           </button>
//         </div>

//         {/* Upload Shapefile */}
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">Upload Shapefile</h2>
//           <input
//             type="file"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="input-field border p-2 rounded"
//             accept=".zip"
//           />
//           <button
//             onClick={handleFileUpload}
//             disabled={loading || !file}
//             className="btn-primary bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 disabled:bg-gray-400"
//           >
//             Upload
//           </button>
//         </div>

//         {/* Data List */}
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Data List</h2>
//           {dataList.length === 0 ? (
//             <p>No data available.</p>
//           ) : (
//             <table className="table w-full border-collapse">
//               <thead>
//                 <tr>
//                   {attributeFields[dataType].map((field) => (
//                     <th key={field} className="border p-2">
//                       {field}
//                     </th>
//                   ))}
//                   <th className="border p-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dataList.map((data) => (
//                   <tr key={data.id || data._id || JSON.stringify(data)} className="border">
//                     {attributeFields[dataType].map((field) => (
//                       <td key={field} className="border p-2">
//                         {data.attributes?.[field] ?? 'N/A'}
//                       </td>
//                     ))}
//                     <td className="border p-2">
//                       <button
//                         onClick={() => handleUpdate(data.id || data._id)}
//                         className="records-action-btn edit bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
//                       >
//                         Update
//                       </button>
//                       <button
//                         onClick={() => handleDelete(data.id || data._id)}
//                         className="records-action-btn delete bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // export default DataManagement;
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// function DataManagement() {
//   const { isAuthenticated, isLoading: authLoading } = useAuth();

//   const [dataType, setDataType] = useState('buildings');
//   const [attributes, setAttributes] = useState({});
//   const [geometry, setGeometry] = useState('');
//   const [dataList, setDataList] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const dataTypes = [
//     { key: 'buildings', label: 'Buildings' },
//     { key: 'roads', label: 'Roads' },
//     { key: 'footpaths', label: 'Footpaths' },
//     { key: 'vegetation', label: 'Vegetation' },
//     { key: 'parking', label: 'Parking' },
//     { key: 'solid_waste', label: 'Solid Waste' },
//     { key: 'electricity', label: 'Electricity' },
//     { key: 'water_supply', label: 'Water Supply' },
//     { key: 'drainage', label: 'Drainage System' },
//     { key: 'vimbweta', label: 'Vimbweta' },
//     { key: 'security', label: 'Security Lights' },
//     { key: 'recreational_areas', label: 'Recreational Areas' },
//   ];

//   const attributeFields = {
//     buildings: ['name', 'floor', 'size', 'offices', 'use', 'condition'],
//     roads: ['road_type', 'condition', 'uses'],
//     footpaths: ['condition', 'uses'],
//     vegetation: ['type'],
//     parking: ['type', 'use', 'condition'],
//     solid_waste: ['type', 'condition'],
//     electricity: ['condition'],
//     water_supply: ['sources', 'accommodate'],
//     drainage: ['character', 'nature', 'type', 'width', 'length'],
//     vimbweta: ['condition', 'use'],
//     security: ['condition'],
//     recreational_areas: ['size', 'condition'],
//   };

//   const API_BASE = '/api';

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchData();
//     } else if (!authLoading) {
//       setError('Please log in to view data');
//       setDataList([]);
//       setLoading(false);
//     }
//   }, [dataType, isAuthenticated, authLoading]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       const response = await axios.get(`${API_BASE}/spatial/data/${dataType}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (Array.isArray(response.data)) {
//         setDataList(response.data);
//       } else if (response.data && typeof response.data === 'object' && response.data !== null) {
//         setDataList([response.data]);
//       } else {
//         setDataList([]);
//         setError('No valid data returned from server.');
//       }
//       setError('');
//     } catch (err) {
//       if (err.response?.status === 401) {
//         setError('Unauthorized: Please log in again.');
//         localStorage.removeItem('token');
//         localStorage.removeItem('userId');
//       } else {
//         setError(err.response?.data?.message || 'Failed to load data. Please try again.');
//       }
//       setDataList([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAttributeChange = (e) => {
//     setAttributes({ ...attributes, [e.target.name]: e.target.value });
//   };

//   const handleCreate = async () => {
//     try {
//       let parsedGeometry;
//       try {
//         parsedGeometry = geometry ? JSON.parse(geometry) : {};
//       } catch {
//         throw new Error('Invalid GeoJSON format');
//       }
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       await axios.post(
//         `${API_BASE}/spatial/data`,
//         { type: dataType, attributes, geometry: parsedGeometry },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchData();
//       setAttributes({});
//       setGeometry('');
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to create data. Please check your input.');
//     }
//   };

//   const handleUpdate = async (id) => {
//     try {
//       let parsedGeometry;
//       try {
//         parsedGeometry = geometry ? JSON.parse(geometry) : {};
//       } catch {
//         throw new Error('Invalid GeoJSON format');
//       }
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       await axios.put(
//         `${API_BASE}/spatial/data/${dataType}/${id}`,
//         { attributes, geometry: parsedGeometry },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchData();
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to update data. Please check your input.');
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       await axios.delete(`${API_BASE}/spatial/data/${dataType}/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchData();
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to delete data. Please try again.');
//     }
//   };

//   // --- Shapefile Upload Handler ---
//   const handleShapefileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setError('');
//     setLoading(true);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found.');

//       const formData = new FormData();
//       formData.append('shapefile', file);       // Multer expects this field name
//       formData.append('tableName', dataType);    // Send dataType as table name

//       await axios.post(`${API_BASE}/spatial/upload`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setError('');
//       fetchData();
//       e.target.value = null;  // Reset file input
//     } catch (err) {
//       setError(err.response?.data?.error || err.message || 'Failed to upload shapefile.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Leaflet Map Preview
//   const MapPreview = () => {
//     const mapRef = useRef(null);

//     useEffect(() => {
//       if (mapRef.current && geometry) {
//         const map = L.map(mapRef.current).setView([0, 0], 2);
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '&copy; OpenStreetMap contributors',
//         }).addTo(map);

//         try {
//           const geoJson = JSON.parse(geometry);
//           L.geoJSON(geoJson).addTo(map);
//         } catch {
//           setError('Invalid GeoJSON format in preview.');
//         }

//         return () => {
//           map.remove();
//         };
//       }
//     }, [geometry]);

//     return <div ref={mapRef} style={{ height: '200px', marginBottom: '1rem' }} />;
//   };

//   if (authLoading) return <div className="p-4">Loading authentication...</div>;

//   if (!isAuthenticated) return <div className="p-4 text-red-500">Please log in to manage data.</div>;

//   return (
//     <div className="container mx-auto px-4 py-4 max-w-4xl">
//       <div className="card">
//         <h1 className="card-title">Data Management</h1>
//         {error && <p className="error-message text-red-500">{error}</p>}
//         {loading && <div className="loading-spinner">Loading...</div>}

//         {/* Data Type Selector */}
//         <div className="mb-4">
//           <label className="input-label font-semibold">Data Type</label>
//           <select
//             value={dataType}
//             onChange={(e) => setDataType(e.target.value)}
//             className="input-field border p-2 rounded w-full"
//           >
//             {dataTypes.map(({ key, label }) => (
//               <option key={key} value={key}>
//                 {label}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Create New Data */}
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">Create New Data</h2>
//           {attributeFields[dataType].map((field) => (
//             <div key={field} className="mb-2">
//               <label className="input-label font-medium">{field}</label>
//               <input
//                 type="text"
//                 name={field}
//                 value={attributes[field] || ''}
//                 onChange={handleAttributeChange}
//                 className="input-field border p-2 rounded w-full"
//               />
//             </div>
//           ))}
//           <div className="mb-2">
//             <label className="input-label font-medium">Geometry (GeoJSON)</label>
//             <textarea
//               value={geometry}
//               onChange={(e) => setGeometry(e.target.value)}
//               className="input-field border p-2 rounded w-full"
//               rows="4"
//             />
//           </div>
//           <div className="mb-2">
//             <label className="input-label font-medium">Geometry Preview</label>
//             {geometry && <MapPreview />}
//           </div>
//           <button
//             onClick={handleCreate}
//             disabled={loading}
//             className="btn-primary bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
//           >
//             Create
//           </button>
//         </div>

//         {/* Shapefile Upload */}
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">Upload Shapefile (.zip)</h2>
//           <input
//             type="file"
//             onChange={handleShapefileUpload}
//             className="input-field border p-2 rounded"
//             accept=".zip"
//           />
//         </div>

//         {/* Data List */}
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Data List</h2>
//           {dataList.length === 0 ? (
//             <p>No data available.</p>
//           ) : (
//             <table className="table w-full border-collapse">
//               <thead>
//                 <tr>
//                   {attributeFields[dataType].map((field) => (
//                     <th key={field} className="border p-2">
//                       {field}
//                     </th>
//                   ))}
//                   <th className="border p-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dataList.map((data) => (
//                   <tr key={data.id || data._id || JSON.stringify(data)} className="border">
//                     {attributeFields[dataType].map((field) => (
//                       <td key={field} className="border p-2">
//                         {data.attributes?.[field] ?? 'N/A'}
//                       </td>
//                     ))}
//                     <td className="border p-2">
//                       <button
//                         onClick={() => handleUpdate(data.id || data._id)}
//                         className="records-action-btn edit bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
//                       >
//                         Update
//                       </button>
//                       <button
//                         onClick={() => handleDelete(data.id || data._id)}
//                         className="records-action-btn delete bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Simple debounce hook
// function useDebounce(value, delay) {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);

//   return debouncedValue;
// }

// function DataManagement() {
//   const { isAuthenticated, isLoading: authLoading } = useAuth();

//   const [dataType, setDataType] = useState('buildings');
//   const [dataList, setDataList] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [limit] = useState(10);

//   // Filters
//   const [filters, setFilters] = useState({});

//   // Upload
//   const [file, setFile] = useState(null);
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // Edit modal
//   const [editRecord, setEditRecord] = useState(null);
//   const [editFormData, setEditFormData] = useState({});

//   // Map preview
//   const [mapRecord, setMapRecord] = useState(null);
//   const mapRef = useRef(null);
//   const leafletMap = useRef(null);
//   const geoJsonLayer = useRef(null);

//   const debouncedFilters = useDebounce(filters, 400);

//   const dataTypes = [
//     { key: 'buildings', label: 'Buildings' },
//     { key: 'roads', label: 'Roads' },
//     { key: 'footpaths', label: 'Footpaths' },
//     { key: 'vegetation', label: 'Vegetation' },
//     { key: 'parking', label: 'Parking' },
//     { key: 'solid_waste', label: 'Solid Waste' },
//     { key: 'electricity', label: 'Electricity' },
//     { key: 'water_supply', label: 'Water Supply' },
//     { key: 'drainage', label: 'Drainage System' },
//     { key: 'vimbweta', label: 'Vimbweta' },
//     { key: 'security', label: 'Security Lights' },
//     { key: 'recreational_areas', label: 'Recreational Areas' },
//   ];

//   const attributeFields = {
//     buildings: ['name', 'floor', 'size', 'offices', 'use', 'condition'],
//     roads: ['road_type', 'condition', 'uses'],
//     footpaths: ['condition', 'uses'],
//     vegetation: ['type'],
//     parking: ['type', 'use', 'condition'],
//     solid_waste: ['type', 'condition'],
//     electricity: ['condition'],
//     water_supply: ['sources', 'accommodate'],
//     drainage: ['character', 'nature', 'type', 'width', 'length'],
//     vimbweta: ['condition', 'use'],
//     security: ['condition'],
//     recreational_areas: ['size', 'condition'],
//   };

//   // Use environment variable for API base URL (fallback to localhost)
//   const API_BASE = import.meta.env.VITE_API_SPATIAL_URL || 'http://localhost:5000/api/spatial';

//   // Reset page and filters on dataType change
//   useEffect(() => {
//     setPage(1);
//     setFilters({});
//   }, [dataType]);

//   // Fetch data on dependencies change
//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchData();
//     }
//   }, [dataType, page, debouncedFilters, isAuthenticated]);

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       const params = {
//         page,
//         limit,
//         ...Object.fromEntries(
//           Object.entries(debouncedFilters).filter(([, v]) => v !== '' && v != null)
//         ),
//       };

//       const response = await axios.get(`${API_BASE}/data/${dataType}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params,
//       });

//       if (Array.isArray(response.data.data)) {
//         setDataList(response.data.data);
//         const totalRecords = response.data.total || 0;
//         setTotalPages(Math.max(1, Math.ceil(totalRecords / limit)));
//         setError('');
//       } else {
//         setDataList([]);
//         setTotalPages(1);
//         setError('No valid data returned from server.');
//       }
//     } catch (err) {
//       if (err.response?.status === 401) {
//         setError('Unauthorized: Please log in again.');
//         localStorage.removeItem('token');
//         localStorage.removeItem('userId');
//       } else {
//         setError(err.response?.data?.message || 'Failed to load data. Please try again.');
//       }
//       setDataList([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [dataType, page, debouncedFilters, limit, API_BASE]);

//   // Filter change handler
//   const handleFilterChange = (e) => {
//     setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
//     setPage(1);
//   };

//   // Pagination
//   const goToPage = (pageNum) => {
//     if (pageNum >= 1 && pageNum <= totalPages && pageNum !== page) {
//       setPage(pageNum);
//     }
//   };

//   // Upload shapefile
//   const handleFileUpload = async () => {
//     if (!file) {
//       setError('Please select a file to upload.');
//       return;
//     }
//     setUploadLoading(true);
//     setError('');
//     try {
//       const formData = new FormData();
//       formData.append('shapefile', file);
//       formData.append('tableName', dataType);

//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       await axios.post(`${API_BASE}/upload`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setFile(null);
//       fetchData();
//     } catch (err) {
//       if (err.response?.status === 404) {
//         setError('Upload endpoint not found. Please check server configuration.');
//       } else if (err.response?.status === 401) {
//         setError('Unauthorized: Please log in again.');
//         localStorage.removeItem('token');
//         localStorage.removeItem('userId');
//       } else {
//         setError(err.response?.data?.error || 'Failed to upload shapefile. Please try again.');
//       }
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   // Delete record
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this record?')) return;
//     setLoading(true);
//     setError('');
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       await axios.delete(`${API_BASE}/data/${dataType}/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       fetchData();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to delete record.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Open update modal
//   const handleUpdate = (record) => {
//     setEditRecord(record);
//     setEditFormData({ ...record.attributes });
//   };

//   // Edit form change
//   const handleEditChange = (e) => {
//     setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   // Submit update
//   const submitUpdate = async () => {
//     if (!editRecord) return;
//     setLoading(true);
//     setError('');
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       await axios.put(
//         `${API_BASE}/data/${dataType}/${editRecord.id || editRecord._id}`,
//         { attributes: editFormData },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setEditRecord(null);
//       fetchData();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to update record.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelEdit = () => {
//     setEditRecord(null);
//     setEditFormData({});
//   };

//   // Show map preview modal
//   const handleShowMap = (record) => {
//     setMapRecord(record);
//   };

//   // Leaflet map setup and update
//   useEffect(() => {
//     if (!mapRecord) return;

//     if (!leafletMap.current) {
//       leafletMap.current = L.map(mapRef.current, {
//         center: [0, 0],
//         zoom: 13,
//         layers: [
//           L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '&copy; OpenStreetMap contributors',
//           }),
//         ],
//       });
//     }

//     if (geoJsonLayer.current) {
//       geoJsonLayer.current.remove();
//     }

//     try {
//       geoJsonLayer.current = L.geoJSON(mapRecord.geometry, {
//         style: { color: 'blue' },
//       }).addTo(leafletMap.current);

//       leafletMap.current.fitBounds(geoJsonLayer.current.getBounds());
//     } catch {
//       setError('Invalid geometry data for map preview.');
//     }

//     return () => {
//       if (geoJsonLayer.current) {
//         geoJsonLayer.current.remove();
//         geoJsonLayer.current = null;
//       }
//     };
//   }, [mapRecord]);

//   if (authLoading) return <div className="p-4">Loading authentication...</div>;

//   if (!isAuthenticated)
//     return <div className="p-4 text-red-500">Please log in to manage data.</div>;

//   return (
//     <div className="container mx-auto px-4 py-4 max-w-5xl">
//       <div className="card">
//         <h1 className="card-title">Data Management</h1>
//         {error && <p className="error-message text-red-500">{error}</p>}
//         {(loading || uploadLoading) && <div className="loading-spinner">Loading...</div>}

//         {/* Data Type Selection */}
//         <div className="mb-4">
//           <label className="input-label font-semibold">Data Type</label>
//           <select
//             value={dataType}
//             onChange={(e) => setDataType(e.target.value)}
//             className="input-field border p-2 rounded w-full"
//           >
//             {dataTypes.map(({ key, label }) => (
//               <option key={key} value={key}>
//                 {label}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Filters */}
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold mb-2">Filter Data</h2>
//           <div className="grid grid-cols-2 gap-4">
//             {attributeFields[dataType].map((field) => (
//               <div key={`filter-${field}`}>
//                 <label className="input-label font-medium">{field}</label>
//                 <input
//                   type="text"
//                   name={field}
//                   value={filters[field] || ''}
//                   onChange={handleFilterChange}
//                   className="input-field border p-2 rounded w-full"
//                   placeholder={`Filter by ${field}`}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Upload */}
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">Upload Shapefile (.zip)</h2>
//           <input
//             type="file"
//             accept=".zip"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="input-field border p-2 rounded"
//           />
//           <button
//             onClick={handleFileUpload}
//             disabled={uploadLoading || !file}
//             className="btn-primary bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 disabled:bg-gray-400"
//           >
//             Upload
//           </button>
//         </div>

//         {/* Data List */}
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Data List</h2>
//           {dataList.length === 0 ? (
//             <p>No data available.</p>
//           ) : (
//             <>
//               <table className="table w-full border-collapse mb-4">
//                 <thead>
//                   <tr>
//                     {attributeFields[dataType].map((field) => (
//                       <th key={field} className="border p-2">
//                         {field}
//                       </th>
//                     ))}
//                     <th className="border p-2">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {dataList.map((data) => (
//                     <tr
//                       key={data.id || data._id || JSON.stringify(data)}
//                       className="border"
//                     >
//                       {attributeFields[dataType].map((field) => (
//                         <td key={field} className="border p-2">
//                           {data.attributes?.[field] ?? 'N/A'}
//                         </td>
//                       ))}
//                       <td className="border p-2 space-x-1">
//                         <button
//                           onClick={() => handleUpdate(data)}
//                           className="records-action-btn edit bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
//                         >
//                           Update
//                         </button>
//                         <button
//                           onClick={() => handleDelete(data.id || data._id)}
//                           className="records-action-btn delete bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                         >
//                           Delete
//                         </button>
//                         <button
//                           onClick={() => handleShowMap(data)}
//                           className="records-action-btn map bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
//                         >
//                           Map
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {/* Pagination Controls */}
//               <div className="pagination flex justify-center items-center space-x-2">
//                 <button
//                   onClick={() => goToPage(page - 1)}
//                   disabled={page === 1}
//                   className="px-3 py-1 rounded bg-gray-300 disabled:bg-gray-100"
//                 >
//                   Prev
//                 </button>

//                 {[...Array(totalPages)].map((_, idx) => {
//                   const pageNum = idx + 1;
//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => goToPage(pageNum)}
//                       className={`px-3 py-1 rounded ${
//                         pageNum === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
//                       }`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}

//                 <button
//                   onClick={() => goToPage(page + 1)}
//                   disabled={page === totalPages}
//                   className="px-3 py-1 rounded bg-gray-300 disabled:bg-gray-100"
//                 >
//                   Next
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editRecord && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//           onClick={cancelEdit}
//         >
//           <div
//             className="bg-white p-6 rounded shadow-lg max-w-lg w-full"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-xl font-semibold mb-4">Update Record</h2>

//             {attributeFields[dataType].map((field) => (
//               <div key={`edit-${field}`} className="mb-3">
//                 <label className="block font-medium mb-1">{field}</label>
//                 <input
//                   type="text"
//                   name={field}
//                   value={editFormData[field] || ''}
//                   onChange={handleEditChange}
//                   className="input-field border p-2 rounded w-full"
//                 />
//               </div>
//             ))}

//             <div className="flex justify-end space-x-3 mt-4">
//               <button
//                 onClick={cancelEdit}
//                 className="btn-cancel px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitUpdate}
//                 className="btn-submit px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Map Preview Modal */}
//       {mapRecord && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
//           onClick={() => setMapRecord(null)}
//         >
//           <div
//             className="bg-white rounded shadow-lg w-11/12 max-w-4xl h-96"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center p-2 border-b">
//               <h3 className="text-lg font-semibold">
//                 Map Preview - {dataType} Record
//               </h3>
//               <button
//                 onClick={() => setMapRecord(null)}
//                 className="text-xl font-bold px-3 hover:text-red-600"
//                 aria-label="Close Map Preview"
//               >
//                 &times;
//               </button>
//             </div>
//             <div ref={mapRef} style={{ height: 'calc(100% - 40px)' }} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DataManagement;
// src/components/DataManagement.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const h = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(h);
  }, [value, delay]);
  return debouncedValue;
}

function DataManagement() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [dataType, setDataType] = useState('buildings');
  const [dataList, setDataList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({});
  const [file, setFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [mapRecord, setMapRecord] = useState(null);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const geoJsonLayer = useRef(null);
  const debouncedFilters = useDebounce(filters, 400);

  const API_BASE = import.meta.env.VITE_API_SPATIAL_URL || 'http://localhost:5000/api/spatial';

  const dataTypes = [ /* same list as you had */ ];
  const attributeFields = { /* same attributeFields mapping as you had */ };

  useEffect(() => { setPage(1); setFilters({}); }, [dataType]);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [dataType, page, debouncedFilters, isAuthenticated]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const params = { page, limit, ...Object.fromEntries(Object.entries(debouncedFilters).filter(([,v]) => v !== '' && v != null)) };
      const response = await axios.get(`${API_BASE}/data/${dataType}`, { headers: { Authorization: `Bearer ${token}` }, params });
      if (Array.isArray(response.data.data)) {
        setDataList(response.data.data);
        const totalRecords = response.data.total || 0;
        setTotalPages(Math.max(1, Math.ceil(totalRecords / limit)));
        setError('');
      } else {
        setDataList([]);
        setTotalPages(1);
        setError('No valid data returned from server.');
      }
    } catch (err) {
      setDataList([]);
      if (err.response?.status === 401) {
        setError('Unauthorized: Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to load data.');
      }
    } finally {
      setLoading(false);
    }
  }, [dataType, page, debouncedFilters, limit, API_BASE]);

  // handlers: filters, pagination omitted for brevity (use your existing functions)
  // Upload handler:
  const handleFileUpload = async () => {
    if (!file) { setError('Please select a file to upload.'); return; }
    setUploadLoading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('shapefile', file);
      formData.append('tableName', dataType);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const resp = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      // display source SRID if returned
      if (resp.data?.sourceSrid) {
        setError(`Upload OK. Source SRID: ${resp.data.sourceSrid}. Inserted: ${resp.data.inserted}`);
      } else {
        setError('Upload OK');
      }
      fetchData();
    } catch (err) {
      if (err.response?.status === 404) setError('Upload endpoint not found.');
      else if (err.response?.status === 401) { setError('Unauthorized'); localStorage.removeItem('token'); localStorage.removeItem('userId'); }
      else setError(err.response?.data?.error || err.message || 'Failed to upload shapefile.');
    } finally {
      setUploadLoading(false);
    }
  };

  // map preview
  useEffect(() => {
    if (!mapRecord) return;
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, { center:[0,0], zoom: 13, layers: [ L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png') ] });
    }
    if (geoJsonLayer.current) geoJsonLayer.current.remove();
    try {
      geoJsonLayer.current = L.geoJSON(mapRecord.geometry).addTo(leafletMap.current);
      leafletMap.current.fitBounds(geoJsonLayer.current.getBounds());
    } catch (e) {
      setError('Invalid geometry for map preview.');
    }
    return () => { if (geoJsonLayer.current) { geoJsonLayer.current.remove(); geoJsonLayer.current = null; } };
  }, [mapRecord]);

  // render UI: you can reuse your previous JSX; keep behavior the same but now uses the new API_BASE
  // (to save space here I won't duplicate the long JSX — copy your existing component body,
  // change API_BASE constant to use VITE_API_SPATIAL_URL as shown above, and ensure fetchData and handleFileUpload are wired)

  return (
    <div className="container mx-auto px-4 py-4 max-w-5xl">
      {/* replicate your UI from before — file input calls setFile, upload button calls handleFileUpload,
          list uses dataList, map modal uses mapRef and shows mapRecord */}
      {/* ... */}
      <p>{error}</p>
    </div>
  );
}

export default DataManagement;
