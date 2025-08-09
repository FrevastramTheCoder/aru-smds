
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

// export default DataManagement;

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

//   // Pagination states
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [limit] = useState(10); // items per page

//   // Filtering state - object with keys matching attributeFields[dataType]
//   const [filters, setFilters] = useState({});

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
//     // Reset page and filters when dataType changes
//     setPage(1);
//     setFilters({});
//   }, [dataType, isAuthenticated, authLoading]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchData();
//     }
//   }, [page, filters]); // refetch when page or filters change

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       // Build query params for pagination and filters
//       const params = {
//         page,
//         limit,
//         ...filters,
//       };

//       const response = await axios.get(`${API_BASE}/spatial/data/${dataType}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params,
//       });

//       // Assuming backend response: { data: [...], total: 100 }
//       if (Array.isArray(response.data.data)) {
//         setDataList(response.data.data);
//         const totalRecords = response.data.total || 0;
//         setTotalPages(Math.ceil(totalRecords / limit));
//       } else {
//         setDataList([]);
//         setTotalPages(1);
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

//   // Filter input change handler
//   const handleFilterChange = (e) => {
//     setFilters((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//     setPage(1); // Reset to first page on filter change
//   };

//   // Pagination controls
//   const goToPage = (pageNum) => {
//     if (pageNum >= 1 && pageNum <= totalPages && pageNum !== page) {
//       setPage(pageNum);
//     }
//   };

//   // ... (Keep other handlers: handleAttributeChange, handleCreate, handleUpdate, handleDelete, handleShapefileUpload, MapPreview unchanged from your code) ...

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

//         {/* Filtering inputs */}
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
//                     <tr key={data.id || data._id || JSON.stringify(data)} className="border">
//                       {attributeFields[dataType].map((field) => (
//                         <td key={field} className="border p-2">
//                           {data.attributes?.[field] ?? 'N/A'}
//                         </td>
//                       ))}
//                       <td className="border p-2">
//                         <button
//                           onClick={() => handleUpdate(data.id || data._id)}
//                           className="records-action-btn edit bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
//                         >
//                           Update
//                         </button>
//                         <button
//                           onClick={() => handleDelete(data.id || data._id)}
//                           className="records-action-btn delete bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                         >
//                           Delete
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

//         {/* Keep your existing Create, Upload Shapefile sections here */}
//         {/* ... */}
//       </div>
//     </div>
//   );
// }

// export default DataManagement;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Simple debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function DataManagement() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [dataType, setDataType] = useState('buildings');
  const [attributes, setAttributes] = useState({});
  const [geometry, setGeometry] = useState('');
  const [dataList, setDataList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // items per page

  // Filtering state - object with keys matching attributeFields[dataType]
  const [filters, setFilters] = useState({});

  // Debounced filters to reduce API calls while typing
  const debouncedFilters = useDebounce(filters, 400);

  const dataTypes = [
    { key: 'buildings', label: 'Buildings' },
    { key: 'roads', label: 'Roads' },
    { key: 'footpaths', label: 'Footpaths' },
    { key: 'vegetation', label: 'Vegetation' },
    { key: 'parking', label: 'Parking' },
    { key: 'solid_waste', label: 'Solid Waste' },
    { key: 'electricity', label: 'Electricity' },
    { key: 'water_supply', label: 'Water Supply' },
    { key: 'drainage', label: 'Drainage System' },
    { key: 'vimbweta', label: 'Vimbweta' },
    { key: 'security', label: 'Security Lights' },
    { key: 'recreational_areas', label: 'Recreational Areas' },
  ];

  const attributeFields = {
    buildings: ['name', 'floor', 'size', 'offices', 'use', 'condition'],
    roads: ['road_type', 'condition', 'uses'],
    footpaths: ['condition', 'uses'],
    vegetation: ['type'],
    parking: ['type', 'use', 'condition'],
    solid_waste: ['type', 'condition'],
    electricity: ['condition'],
    water_supply: ['sources', 'accommodate'],
    drainage: ['character', 'nature', 'type', 'width', 'length'],
    vimbweta: ['condition', 'use'],
    security: ['condition'],
    recreational_areas: ['size', 'condition'],
  };

  const API_BASE = '/api';

  // Reset page and filters when dataType changes
  useEffect(() => {
    setPage(1);
    setFilters({});
  }, [dataType]);

  // Fetch data when dataType, page, debouncedFilters, or auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [dataType, page, debouncedFilters, isAuthenticated]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      // Build query params for pagination and filters, excluding empty filters
      const params = {
        page,
        limit,
        ...Object.fromEntries(
          Object.entries(debouncedFilters).filter(([, v]) => v !== '' && v != null)
        ),
      };

      const response = await axios.get(`${API_BASE}/spatial/data/${dataType}`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

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
      if (err.response?.status === 401) {
        setError('Unauthorized: Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      } else {
        setError(err.response?.data?.message || 'Failed to load data. Please try again.');
      }
      setDataList([]);
    } finally {
      setLoading(false);
    }
  }, [dataType, page, debouncedFilters, limit]);

  // Filter input change handler
  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setPage(1); // Reset to first page on filter change
  };

  // Pagination controls
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== page) {
      setPage(pageNum);
    }
  };

  // Other handlers like handleAttributeChange, handleCreate, handleUpdate, handleDelete, handleShapefileUpload, MapPreview
  // should be here exactly as in your original code.

  if (authLoading) return <div className="p-4">Loading authentication...</div>;

  if (!isAuthenticated)
    return <div className="p-4 text-red-500">Please log in to manage data.</div>;

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="card">
        <h1 className="card-title">Data Management</h1>
        {error && <p className="error-message text-red-500">{error}</p>}
        {loading && <div className="loading-spinner">Loading...</div>}

        {/* Data Type Selection */}
        <div className="mb-4">
          <label className="input-label font-semibold">Data Type</label>
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="input-field border p-2 rounded w-full"
          >
            {dataTypes.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtering inputs */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Filter Data</h2>
          <div className="grid grid-cols-2 gap-4">
            {attributeFields[dataType].map((field) => (
              <div key={`filter-${field}`}>
                <label className="input-label font-medium">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={filters[field] || ''}
                  onChange={handleFilterChange}
                  className="input-field border p-2 rounded w-full"
                  placeholder={`Filter by ${field}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Data List */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Data List</h2>
          {dataList.length === 0 ? (
            <p>No data available.</p>
          ) : (
            <>
              <table className="table w-full border-collapse mb-4">
                <thead>
                  <tr>
                    {attributeFields[dataType].map((field) => (
                      <th key={field} className="border p-2">
                        {field}
                      </th>
                    ))}
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((data) => (
                    <tr
                      key={data.id || data._id || JSON.stringify(data)}
                      className="border"
                    >
                      {attributeFields[dataType].map((field) => (
                        <td key={field} className="border p-2">
                          {data.attributes?.[field] ?? 'N/A'}
                        </td>
                      ))}
                      <td className="border p-2">
                        <button
                          onClick={() => handleUpdate(data.id || data._id)}
                          className="records-action-btn edit bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(data.id || data._id)}
                          className="records-action-btn delete bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="pagination flex justify-center items-center space-x-2">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 rounded bg-gray-300 disabled:bg-gray-100"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-1 rounded ${
                        pageNum === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded bg-gray-300 disabled:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* Add your Create, Upload Shapefile sections and other handlers here unchanged */}
      </div>
    </div>
  );
}

export default DataManagement;
