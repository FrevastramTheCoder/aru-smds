// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import MapComponent from '../components/MapComponent';
// import PropTypes from 'prop-types';

// /**
//  * Displays a map with spatial data for a selected category.
//  */
// function MapView() {
//   const [spatialData, setSpatialData] = useState([]);
//   const [selectedType, setSelectedType] = useState('buildings');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();

//   const categoryToTypeMap = {
//     'buildings': 'buildings',
//     'roads': 'roads',
//     'footpaths': 'footpaths',
//     'vegetation': 'vegetation',
//     'parking': 'parking',
//     'solid-waste': 'solid_waste',
//     'electricity': 'electricity',
//     'water-supply': 'water_supply',
//     'drainage-system': 'drainage',
//     'vimbweta': 'vimbweta',
//     'security-lights': 'security',
//     'recreational-areas': 'recreational_areas',
//   };

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

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const category = params.get('category');
//     const type = category ? categoryToTypeMap[category] || 'buildings' : 'buildings';
//     setSelectedType(type);
//   }, [location]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`/api/spatial/data/${selectedType}`, {
//           headers: { Authorization: localStorage.getItem('token') },
//         });
//         setSpatialData(
//           response.data.map((item) => ({
//             type: selectedType,
//             attributes: item.attributes,
//             geometry: JSON.parse(item.geometry),
//           }))
//         );
//         setError('');
//       } catch (error) {
//         console.error('Error fetching spatial data:', error);
//         setError('Failed to load spatial data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [selectedType]);

//   return (
//     <div className="container mx-auto px-4 py-4">
//       <div className="card">
//         <h1 className="card-title">Spatial Data Map</h1>
//         {error && <p className="error-message">{error}</p>}
//         {loading && <div className="loading-spinner"></div>}
//         <div className="map-controls">
//           <select
//             value={selectedType}
//             onChange={(e) => setSelectedType(e.target.value)}
//             className="input-field"
//           >
//             {dataTypes.map(({ key, label }) => (
//               <option key={key} value={key}>{label}</option>
//             ))}
//           </select>
//         </div>
//         <MapComponent spatialData={spatialData} />
//       </div>
//     </div>
//   );
// }

// export default MapView;

// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import MapComponent from '../components/MapComponent';
// import PropTypes from 'prop-types';

// /**
//  * Displays a map with spatial data for a selected category.
//  */
// function MapView() {
//   const [spatialData, setSpatialData] = useState([]);
//   const [selectedType, setSelectedType] = useState('buildings');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();

//   const categoryToTypeMap = {
//     'buildings': 'buildings',
//     'roads': 'roads',
//     'footpaths': 'footpaths',
//     'vegetation': 'vegetation',
//     'parking': 'parking',
//     'solid-waste': 'solid_waste',
//     'electricity': 'electricity',
//     'water-supply': 'water_supply',
//     'drainage-system': 'drainage',
//     'vimbweta': 'vimbweta',
//     'security-lights': 'security',
//     'recreational-areas': 'recreational_areas',
//   };

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

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const category = params.get('category');
//     const type = category ? categoryToTypeMap[category] || 'buildings' : 'buildings';
//     setSelectedType(type);
//   }, [location]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`/api/spatial/data/${selectedType}`, {
//           headers: { Authorization: localStorage.getItem('token') },
//         });

//         // Corrected: Access the array inside response.data.data
//         const spatialArray = response.data.data || [];

//         setSpatialData(
//           spatialArray.map((item) => ({
//             type: selectedType,
//             attributes: item.attributes,
//             geometry:
//               typeof item.geometry === 'string' ? JSON.parse(item.geometry) : item.geometry,
//           }))
//         );
//         setError('');
//       } catch (error) {
//         console.error('Error fetching spatial data:', error);
//         setError('Failed to load spatial data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [selectedType]);

//   return (
//     <div className="container mx-auto px-4 py-4">
//       <div className="card">
//         <h1 className="card-title">Spatial Data Map</h1>
//         {error && <p className="error-message">{error}</p>}
//         {loading && <div className="loading-spinner"></div>}
//         <div className="map-controls">
//           <select
//             value={selectedType}
//             onChange={(e) => setSelectedType(e.target.value)}
//             className="input-field"
//           >
//             {dataTypes.map(({ key, label }) => (
//               <option key={key} value={key}>
//                 {label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <MapComponent spatialData={spatialData} />
//       </div>
//     </div>
//   );
// }

// export default MapView;
// //final version
// // src/routes/MapView.jsx
// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import MapComponent from '../components/MapComponent';

// function MapView() {
//   const [spatialData, setSpatialData] = useState([]);
//   const [selectedType, setSelectedType] = useState('buildings');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();

//   const categoryToTypeMap = {
//     buildings: 'buildings',
//     roads: 'roads',
//     footpaths: 'footpaths',
//     vegetation: 'vegetation',
//     parking: 'parking',
//     'solid-waste': 'solid_waste',
//     electricity: 'electricity',
//     'water-supply': 'water_supply',
//     'drainage-system': 'drainage',
//     vimbweta: 'vimbweta',
//     'security-lights': 'security',
//     'recreational-areas': 'recreational_areas',
//   };

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

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const category = params.get('category');
//     const type = category ? categoryToTypeMap[category] || 'buildings' : 'buildings';
//     setSelectedType(type);
//   }, [location]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`/api/spatial/data/${selectedType}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const spatialArray = response.data.data || [];

//         setSpatialData(
//           spatialArray.map((item) => ({
//             type: selectedType,
//             attributes: item.attributes,
//             geometry:
//               typeof item.geometry === 'string' ? JSON.parse(item.geometry) : item.geometry,
//           }))
//         );
//         setError('');
//       } catch (error) {
//         console.error('Error fetching spatial data:', error);
//         setError('Failed to load spatial data. Please try again.');
//         setSpatialData([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [selectedType]);

//   return (
//     <div className="container mx-auto px-4 py-4">
//       <div className="card">
//         <h1 className="card-title">Spatial Data Map</h1>

//         {error && <p className="error-message text-red-600">{error}</p>}
//         {loading && <div className="loading-spinner">Loading...</div>}

//         <div className="map-controls mb-4">
//           <select
//             value={selectedType}
//             onChange={(e) => setSelectedType(e.target.value)}
//             className="input-field border p-2 rounded"
//           >
//             {dataTypes.map(({ key, label }) => (
//               <option key={key} value={key}>
//                 {label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <MapComponent spatialData={spatialData} initialCenter={[-6.764538, 39.214464]} />
//       </div>
//     </div>
//   );
// }

// export default MapView;


// //advanced codes
// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import MapComponent from '../components/MapComponent';

// function MapView() {
//   const [spatialData, setSpatialData] = useState([]);
//   const [selectedType, setSelectedType] = useState('buildings');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();

//   const categoryToTypeMap = {
//     buildings: 'buildings',
//     roads: 'roads',
//     footpaths: 'footpaths',
//     vegetation: 'vegetation',
//     parking: 'parking',
//     'solid-waste': 'solid_waste',
//     electricity: 'electricity',
//     'water-supply': 'water_supply',
//     'drainage-system': 'drainage',
//     vimbweta: 'vimbweta',
//     'security-lights': 'security',
//     'recreational-areas': 'recreational_areas',
//   };

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

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const category = params.get('category');
//     const type = category ? categoryToTypeMap[category] || 'buildings' : 'buildings';
//     setSelectedType(type);
//   }, [location]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`/api/spatial/data/${selectedType}`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { limit: 100 }, // optional: fetch up to 100 features
//         });

//         const spatialArray = response.data.data || [];

//         setSpatialData(
//           spatialArray.map((item) => ({
//             type: selectedType,
//             attributes: item.attributes,
//             geometry: typeof item.geometry === 'string' ? JSON.parse(item.geometry) : item.geometry,
//           }))
//         );
//         setError('');
//       } catch (error) {
//         console.error('Error fetching spatial data:', error);
//         setError('Failed to load spatial data. Please try again.');
//         setSpatialData([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [selectedType]);

//   return (
//     <div className="container mx-auto px-4 py-4">
//       <div className="card">
//         <h1 className="card-title">Spatial Data Map</h1>

//         {error && <p className="error-message text-red-600">{error}</p>}
//         {loading && <div className="loading-spinner">Loading...</div>}

//         <div className="map-controls mb-4">
//           <select
//             value={selectedType}
//             onChange={(e) => setSelectedType(e.target.value)}
//             className="input-field border p-2 rounded"
//           >
//             {dataTypes.map(({ key, label }) => (
//               <option key={key} value={key}>
//                 {label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <MapComponent spatialData={spatialData} initialCenter={[-6.764538, 39.214464]} />
//       </div>
//     </div>
//   );
// }

// export default MapView;
// // src/routes/MapView.jsx

// //kumekucha 
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import MapComponent from '../components/MapComponent';

// function debounce(fn, wait) {
//   let t;
//   return (...args) => {
//     clearTimeout(t);
//     t = setTimeout(() => fn(...args), wait);
//   };
// }

// function MapView() {
//   const [spatialData, setSpatialData] = useState([]);
//   const [selectedType, setSelectedType] = useState('buildings');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();

//   const categoryToTypeMap = {
//     buildings: 'buildings',
//     roads: 'roads',
//     footpaths: 'footpaths',
//     vegetation: 'vegetation',
//     parking: 'parking',
//     'solid-waste': 'solid_waste',
//     electricity: 'electricity',
//     'water-supply': 'water_supply',
//     'drainage-system': 'drainage',
//     vimbweta: 'vimbweta',
//     'security-lights': 'security',
//     'recreational-areas': 'recreational_areas',
//   };

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

//   // Trim trailing slash from env variable, or fallback to relative path
//   const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const category = params.get('category');
//     const type = category ? (categoryToTypeMap[category] || 'buildings') : 'buildings';
//     setSelectedType(type);
//   }, [location]);

//   const lastBoundsKeyRef = useRef(null);

//   const fetchGeoByBbox = useCallback(
//     debounce(async (layer, bounds, simplify = 0.0001) => {
//       if (!layer) return;
//       try {
//         setLoading(true);
//         setError('');
//         const token = localStorage.getItem('token');
//         let url = `${API_BASE}/geojson/${layer}`;
//         if (!API_BASE) url = `/api/spatial/geojson/${layer}`;

//         const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;

//         const resp = await axios.get(url, {
//           headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//           params: { bbox, simplify },
//           timeout: 30000,
//         });

//         const fc = resp.data || { type: 'FeatureCollection', features: [] };
//         setSpatialData(Array.isArray(fc.features) ? fc.features : []);
//       } catch (err) {
//         console.error('Error fetching geojson by bbox:', err);
//         setError('Failed to load features for current view');
//         setSpatialData([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 350),
//     [API_BASE]
//   );

//   // Initial fetch (simplified whole-layer, optional)
//   useEffect(() => {
//     setSpatialData([]);
//     setError('');
//     setLoading(true);

//     (async () => {
//       try {
//         const token = localStorage.getItem('token');
//         let url = `${API_BASE}/geojson/${selectedType}`;
//         if (!API_BASE) url = `/api/spatial/geojson/${selectedType}`;

//         const resp = await axios.get(url, {
//           headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//           params: { simplify: 0.0005 },
//           timeout: 30000,
//         });

//         const fc = resp.data || { type: 'FeatureCollection', features: [] };
//         setSpatialData(Array.isArray(fc.features) ? fc.features : []);
//       } catch (err) {
//         console.warn('Initial whole-layer fetch failed:', err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [selectedType, API_BASE]);

//   const handleBoundsChange = (bounds) => {
//     if (!bounds) return;
//     const key = `${bounds.getWest().toFixed(6)},${bounds.getSouth().toFixed(6)},${bounds.getEast().toFixed(6)},${bounds.getNorth().toFixed(6)}`;
//     if (lastBoundsKeyRef.current === key) return;
//     lastBoundsKeyRef.current = key;
//     fetchGeoByBbox(selectedType, bounds, 0.00012);
//   };

//   return (
//     <div className="container mx-auto px-4 py-4">
//       <div className="card">
//         <h1 className="card-title">Spatial Data Map</h1>

//         {error && <p className="error-message text-red-600">{error}</p>}
//         {loading && <div className="loading-spinner">Loading...</div>}

//         <div className="map-controls mb-4 flex items-center gap-4">
//           <select
//             value={selectedType}
//             onChange={(e) => setSelectedType(e.target.value)}
//             className="input-field border p-2 rounded"
//           >
//             {dataTypes.map(({ key, label }) => (
//               <option key={key} value={key}>
//                 {label}
//               </option>
//             ))}
//           </select>
//           <div className="text-sm text-gray-600">
//             Layer: <b>{selectedType}</b>
//           </div>
//         </div>

//         <MapComponent
//           spatialData={spatialData}
//           initialCenter={[-6.764538, 39.214464]}
//           onBoundsChange={handleBoundsChange}
//         />
//       </div>
//     </div>
//   );
// }

// export default MapView;


// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import MapComponent from '../components/MapComponent';

// function debounce(fn, wait) {
//   let t;
//   return (...args) => {
//     clearTimeout(t);
//     t = setTimeout(() => fn(...args), wait);
//   };
// }

// function MapView() {
//   const [spatialData, setSpatialData] = useState([]);
//   const [selectedType, setSelectedType] = useState('buildings');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();

//   // map frontend category → backend type
//   const categoryToTypeMap = {
//     buildings: 'buildings',
//     roads: 'roads',
//     footpaths: 'footpaths',
//     vegetation: 'vegetation',
//     parking: 'parking',
//     'solid-waste': 'solid_waste',
//     electricity: 'electricity',
//     'water-supply': 'water_supply',
//     'drainage-system': 'drainage',
//     vimbweta: 'vimbweta',
//     'security-lights': 'security',  // ✅ match backend
//     'recreational-areas': 'recreational_areas',
//   };

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

//   const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const category = params.get('category');
//     const type = category ? (categoryToTypeMap[category] || 'buildings') : 'buildings';
//     setSelectedType(type);
//   }, [location]);

//   const lastBoundsKeyRef = useRef(null);

//   const fetchGeoByBbox = useCallback(
//     debounce(async (layer, bounds, simplify = 0.0001) => {
//       if (!layer || !bounds) return;
//       try {
//         setLoading(true);
//         setError('');
//         const token = localStorage.getItem('token');
//         let url = `${API_BASE}/geojson/${layer}`;
//         if (!API_BASE) url = `/api/spatial/geojson/${layer}`;

//         const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;

//         const resp = await axios.get(url, {
//           headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//           params: { bbox, simplify },
//           timeout: 30000,
//         });

//         const fc = resp.data || { type: 'FeatureCollection', features: [] };
//         setSpatialData(Array.isArray(fc.features) ? fc.features : []);
//       } catch (err) {
//         console.error('Error fetching geojson by bbox:', err);
//         setError('Failed to load features for current view');
//         setSpatialData([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 350),
//     [API_BASE]
//   );

//   // Initial fetch
//   useEffect(() => {
//     setSpatialData([]);
//     setError('');
//     setLoading(true);

//     (async () => {
//       try {
//         const token = localStorage.getItem('token');
//         let url = `${API_BASE}/geojson/${selectedType}`;
//         if (!API_BASE) url = `/api/spatial/geojson/${selectedType}`;

//         const resp = await axios.get(url, {
//           headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//           params: { simplify: 0.0005 },
//           timeout: 30000,
//         });

//         const fc = resp.data || { type: 'FeatureCollection', features: [] };
//         setSpatialData(Array.isArray(fc.features) ? fc.features : []);
//       } catch (err) {
//         console.warn('Initial whole-layer fetch failed:', err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [selectedType, API_BASE]);

//   const handleBoundsChange = (bounds) => {
//     if (!bounds || typeof bounds.getWest !== 'function') return; // ✅ prevent _leaflet_pos errors
//     const key = `${bounds.getWest().toFixed(6)},${bounds.getSouth().toFixed(6)},${bounds.getEast().toFixed(6)},${bounds.getNorth().toFixed(6)}`;
//     if (lastBoundsKeyRef.current === key) return;
//     lastBoundsKeyRef.current = key;
//     fetchGeoByBbox(selectedType, bounds, 0.00012);
//   };

//   return (
//     <div className="container mx-auto px-4 py-4">
//       <div className="card">
//         <h1 className="card-title">Spatial Data Map</h1>

//         {error && <p className="error-message text-red-600">{error}</p>}
//         {loading && <div className="loading-spinner">Loading...</div>}

//         <div className="map-controls mb-4 flex items-center gap-4">
//           <select
//             value={selectedType}
//             onChange={(e) => setSelectedType(e.target.value)}
//             className="input-field border p-2 rounded"
//           >
//             {dataTypes.map(({ key, label }) => (
//               <option key={key} value={key}>
//                 {label}
//               </option>
//             ))}
//           </select>
//           <div className="text-sm text-gray-600">
//             Layer: <b>{selectedType}</b>
//           </div>
//         </div>

//         <MapComponent
//           spatialData={spatialData}
//           initialCenter={[-6.764538, 39.214464]}
//           onBoundsChange={handleBoundsChange}
//         />
//       </div>
//     </div>
//   );
// }

// export default MapView;
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import * as XLSX from "xlsx";
import osmtogeojson from "osmtogeojson";

function MapView() {
  const mapRef = useRef(null);
  const [allShapes, setAllShapes] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [buildingColors, setBuildingColors] = useState({
    commercial: "blue",
    residential: "yellow",
    commercialresidential: "green",
    institutional: "red",
    industrial: "purple",
    default: "gray",
  });

  const location = useLocation();
  const [selectedType, setSelectedType] = useState("buildings");
  const [spatialData, setSpatialData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const categoryToTypeMap = {
    buildings: "buildings",
    roads: "roads",
    footpaths: "footpaths",
    vegetation: "vegetation",
    parking: "parking",
    "solid-waste": "solid_waste",
    electricity: "electricity",
    "water-supply": "water_supply",
    drainage: "drainage",
    vimbweta: "vimbweta",
    "security-lights": "security",
    "recreational-areas": "recreational_areas",
  };

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

  const buttonStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: "white",
    padding: "8px 16px",
    margin: "4px 0",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
  });

  const randomColor = () => {
    const colors = ["#007bff", "#28a745", "#dc3545", "#ffc107", "#17a2b8", "#6f42c1"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // ---------------------- Spatial Data Fetching ----------------------
  const lastBoundsKeyRef = useRef(null);

  const fetchGeoByBbox = useCallback(
    async (layer, bounds, simplify = 0.0001) => {
      if (!layer || !bounds) return;
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        let url = `${API_BASE}/geojson/${layer}`;
        if (!API_BASE) url = `/api/spatial/geojson/${layer}`;

        const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;

        const resp = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          params: { bbox, simplify },
          timeout: 30000,
        });

        const fc = resp.data || { type: "FeatureCollection", features: [] };
        setSpatialData(Array.isArray(fc.features) ? fc.features : []);
      } catch (err) {
        console.error("Error fetching geojson by bbox:", err);
        setError("Failed to load features for current view");
        setSpatialData([]);
      } finally {
        setLoading(false);
      }
    },
    [API_BASE]
  );

  const handleBoundsChange = (bounds) => {
    if (!bounds || typeof bounds.getWest !== "function") return;
    const key = `${bounds.getWest().toFixed(6)},${bounds.getSouth().toFixed(6)},${bounds.getEast().toFixed(6)},${bounds.getNorth().toFixed(6)}`;
    if (lastBoundsKeyRef.current === key) return;
    lastBoundsKeyRef.current = key;
    fetchGeoByBbox(selectedType, bounds, 0.00012);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const type = category ? categoryToTypeMap[category] || "buildings" : "buildings";
    setSelectedType(type);
  }, [location]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        let url = `${API_BASE}/geojson/${selectedType}`;
        if (!API_BASE) url = `/api/spatial/geojson/${selectedType}`;

        const resp = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          params: { simplify: 0.0005 },
          timeout: 30000,
        });

        const fc = resp.data || { type: "FeatureCollection", features: [] };
        setSpatialData(Array.isArray(fc.features) ? fc.features : []);
      } catch (err) {
        console.warn("Initial fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedType, API_BASE]);

  // ---------------------- File Upload & Draw ----------------------
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const fileName = file.name;

    if (fileName.endsWith(".geojson") || fileName.endsWith(".json")) {
      reader.onload = (event) => {
        const geojson = JSON.parse(event.target.result);
        const layerColor = randomColor();
        setAllShapes((prev) => [...prev, { layer: geojson, fileName, color: layerColor }]);
        setUploadedFiles((prev) => [...prev, fileName]);
      };
      reader.readAsText(file);
    } else if (fileName.endsWith(".csv")) {
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split("\n").filter((row) => row.trim());
        const headers = rows[0].split(",");
        const latIndex = headers.findIndex((h) => h.toLowerCase().includes("lat"));
        const lonIndex = headers.findIndex((h) => h.toLowerCase().includes("lon"));
        if (latIndex === -1 || lonIndex === -1) return alert("CSV must contain 'lat' and 'lon'");
        const features = rows.slice(1).map((row) => {
          const cols = row.split(",");
          const lat = parseFloat(cols[latIndex]);
          const lon = parseFloat(cols[lonIndex]);
          return { type: "Feature", geometry: { type: "Point", coordinates: [lon, lat] }, properties: {} };
        });
        setAllShapes((prev) => [...prev, { layer: { type: "FeatureCollection", features }, fileName, color: randomColor() }]);
        setUploadedFiles((prev) => [...prev, fileName]);
      };
      reader.readAsText(file);
    } else alert("Only .geojson, .csv supported currently.");
  };

  const handleCreated = (e) => {
    const geojson = { type: "FeatureCollection", features: [e.layer.toGeoJSON()] };
    setAllShapes((prev) => [...prev, { layer: geojson, fileName: "Drawn Shape", color: randomColor() }]);
    setUploadedFiles((prev) => [...prev, "Drawn Shape"]);
  };

  const handleExportGeoJSON = () => {
    if (!allShapes.length) return alert("No layers to export");
    const merged = { type: "FeatureCollection", features: allShapes.flatMap((s) => s.layer.features) };
    const blob = new Blob([JSON.stringify(merged, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "exported_layers.geojson";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportExcel = () => {
    if (!allShapes.length) return alert("No layers to export");
    const rows = allShapes.flatMap((s) => s.layer.features.map((f) => ({ type: f.geometry.type, coordinates: JSON.stringify(f.geometry.coordinates), ...f.properties })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Layers");
    XLSX.writeFile(wb, "exported_layers.xlsx");
  };

  const handleClearLayers = () => {
    setAllShapes([]);
    setUploadedFiles([]);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "300px", padding: "10px", overflowY: "auto", background: "#f7f7f7", borderRight: "1px solid #ddd" }}>
        <h2>Map Tools</h2>
        <input type="file" onChange={handleFileUpload} style={{ marginBottom: "10px" }} />
        <button onClick={handleExportGeoJSON} style={buttonStyle("#007bff")}>Export GeoJSON</button>
        <button onClick={handleExportExcel} style={buttonStyle("#28a745")}>Export Excel</button>
        <button onClick={handleClearLayers} style={buttonStyle("#dc3545")}>Clear Layers</button>
        <h3 style={{ marginTop: "20px" }}>Uploaded Layers:</h3>
        <ul>{uploadedFiles.map((file, idx) => <li key={idx}>{file}</li>)}</ul>

        <div className="map-controls mt-4">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="input-field border p-2 rounded w-full">
            {dataTypes.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <MapContainer center={[-6.764538, 39.214464]} zoom={12} style={{ height: "100%", width: "100%" }} whenCreated={(map) => (mapRef.current = map)}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <FeatureGroup>
            <EditControl position="topright" draw={{ polygon: true, rectangle: true, polyline: false, circle: false, marker: false, circlemarker: false }} onCreated={handleCreated} />
          </FeatureGroup>
          {/* Uploaded / Drawn Shapes */}
          {allShapes.map((shape, idx) => (
            <GeoJSON key={idx} data={shape.layer} style={(f) => ({ color: f.properties?.color || shape.color, weight: 2, fillOpacity: 0.2 })} />
          ))}
          {/* Spatial API Data */}
          {spatialData.map((f, idx) => (
            <GeoJSON key={`api-${idx}`} data={f} style={{ color: "#ff7800", weight: 2, fillOpacity: 0.2 }} />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapView;
