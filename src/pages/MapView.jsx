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


// // before
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
//   const [availableLayers, setAvailableLayers] = useState([]);
//   const location = useLocation();

//   // API base URL configuration
//   const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
//   const API_PREFIX = API_BASE ? `${API_BASE}/api/v1` : '/api/v1';

//   // Layer configuration
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
//     { key: 'security', label: 'Security' },
//     { key: 'recreational_areas', label: 'Recreational Areas' }
//   ];

//   // Fetch available layers from backend
//   useEffect(() => {
//     const fetchAvailableLayers = async () => {
//       try {
//         const response = await axios.get(`${API_PREFIX}/layers`);
//         setAvailableLayers(response.data.layers || []);
//       } catch (err) {
//         console.error('Failed to fetch available layers:', err);
//       }
//     };
//     fetchAvailableLayers();
//   }, [API_PREFIX]);

//   // Handle URL parameters for initial layer selection
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const category = params.get('category');
    
//     // Find matching layer from available layers
//     if (category && availableLayers.length > 0) {
//       const layer = availableLayers.find(l => 
//         l.name.toLowerCase() === category.toLowerCase()
//       );
//       if (layer) {
//         setSelectedType(layer.name);
//       }
//     }
//   }, [location, availableLayers]);

//   // Fetch GeoJSON data with proper authentication
//   const fetchGeoData = useCallback(async (layer, bounds = null) => {
//     if (!layer) return;
    
//     try {
//       setLoading(true);
//       setError('');
      
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('Authentication required');
//       }

//       const url = `${API_PREFIX}/auth/geojson/${layer}`;
//       const params = {
//         simplify: bounds ? 0.00012 : 0.0005
//       };

//       if (bounds) {
//         params.bbox = [
//           bounds.getWest(),
//           bounds.getSouth(),
//           bounds.getEast(),
//           bounds.getNorth()
//         ].join(',');
//       }

//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         params,
//         timeout: 30000
//       });

//       if (response.status === 200) {
//         return response.data?.features || [];
//       }
//       return [];
      
//     } catch (error) {
//       console.error('Failed to fetch GeoJSON:', error);
      
//       // Handle different error cases
//       if (error.response?.status === 404) {
//         throw new Error(`Data layer '${layer}' not found on server`);
//       }
//       if (error.response?.status === 401) {
//         throw new Error('Authentication required - Please login again');
//       }
//       if (error.response?.status === 403) {
//         throw new Error('Access denied - You may not have permission');
//       }
      
//       throw new Error(error.message || 'Failed to load spatial data');
//     } finally {
//       setLoading(false);
//     }
//   }, [API_PREFIX]);

//   // Debounced function for fetching data by bounding box
//   const fetchGeoByBbox = useCallback(
//     debounce(async (layer, bounds) => {
//       if (!bounds) return;
      
//       try {
//         const features = await fetchGeoData(layer, bounds);
//         setSpatialData(features);
//       } catch (err) {
//         setError(err.message);
//         setSpatialData([]);
//       }
//     }, 350),
//     [fetchGeoData]
//   );

//   // Initial data fetch when layer changes
//   useEffect(() => {
//     const loadInitialData = async () => {
//       setSpatialData([]);
//       setError('');
//       setLoading(true);
      
//       try {
//         const features = await fetchGeoData(selectedType);
//         setSpatialData(features);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadInitialData();
//   }, [selectedType, fetchGeoData]);

//   // Handle map bounds changes
//   const handleBoundsChange = useCallback((bounds) => {
//     if (!bounds) return;
//     fetchGeoByBbox(selectedType, bounds);
//   }, [selectedType, fetchGeoByBbox]);

//   // Filter available layers to only those that exist in the database
//   const availableDataTypes = dataTypes.filter(type => 
//     availableLayers.some(layer => layer.name === type.key && layer.exists)
//   );

//   return (
//     <div className="container mx-auto px-4 py-4">
//       <div className="card bg-white rounded-lg shadow-md p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">Spatial Data Map</h1>

//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
//             <p>{error}</p>
//           </div>
//         )}

//         {loading && (
//           <div className="flex justify-center items-center py-4">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//             <span className="ml-2 text-gray-600">Loading data...</span>
//           </div>
//         )}

//         <div className="map-controls mb-6 flex flex-wrap items-center gap-4">
//           <select
//             value={selectedType}
//             onChange={(e) => setSelectedType(e.target.value)}
//             className="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {availableDataTypes.map(({ key, label }) => (
//               <option key={key} value={key}>
//                 {label}
//               </option>
//             ))}
//           </select>
          
//           <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
//             Current Layer: <span className="font-semibold">{selectedType}</span>
//           </div>
//         </div>

//         <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
//           <MapComponent
//             spatialData={spatialData}
//             initialCenter={[-6.764538, 39.214464]}
//             initialZoom={13}
//             onBoundsChange={handleBoundsChange}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MapView;

// //another day before site 
// // src/views/MapView.jsx
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
//   const [availableLayers, setAvailableLayers] = useState([]);
//   const location = useLocation();

//   // API base URL configuration
//   const API_BASE = (import.meta.env.VITE_API_URL || 'https://smds.onrender.com').replace(/\/$/, '');
//   const API_PREFIX = `${API_BASE}/api/v1/auth`;

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
//     { key: 'vimbweta', label: 'Vimbmbeta' },
//     { key: 'security', label: 'Security' },
//     { key: 'recreational_areas', label: 'Recreational Areas' }
//   ];

//   useEffect(() => {
//     const fetchAvailableLayers = async () => {
//       try {
//         const response = await axios.get(`${API_BASE}/api/v1/layers`);
//         setAvailableLayers(response.data.layers || []);
//       } catch (err) {
//         console.error('Failed to fetch available layers:', err);
//       }
//     };
//     fetchAvailableLayers();
//   }, [API_BASE]);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const category = params.get('category');
    
//     if (category && availableLayers.length > 0) {
//       const layer = availableLayers.find(l => 
//         l.name.toLowerCase() === category.toLowerCase()
//       );
//       if (layer) {
//         setSelectedType(layer.name);
//       }
//     }
//   }, [location, availableLayers]);

//   const fetchGeoData = useCallback(async (layer, bounds = null) => {
//     if (!layer) return;
    
//     try {
//       setLoading(true);
//       setError('');
      
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('Authentication required');
//       }

//       const url = `${API_PREFIX}/geojson/${layer}`;
//       const params = {
//         simplify: bounds ? 0.00012 : 0.0005
//       };

//       if (bounds) {
//         params.bbox = [
//           bounds.getWest(),
//           bounds.getSouth(),
//           bounds.getEast(),
//           bounds.getNorth()
//         ].join(',');
//       }

//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         params,
//         timeout: 30000
//       });

//       if (response.status === 200) {
//         return response.data?.features || [];
//       }
//       return [];
      
//     } catch (error) {
//       console.error('Failed to fetch GeoJSON:', error);
      
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         window.location.href = '/login';
//         throw new Error('Authentication required - Please login again');
//       }
//       if (error.response?.status === 404) {
//         throw new Error(`Data layer '${layer}' not found on server`);
//       }
//       if (error.response?.status === 403) {
//         throw new Error('Access denied - You may not have permission');
//       }
      
//       throw new Error(error.message || 'Failed to load spatial data');
//     } finally {
//       setLoading(false);
//     }
//   }, [API_PREFIX]);

//   const fetchGeoByBbox = useCallback(
//     debounce(async (layer, bounds) => {
//       if (!bounds) return;
      
//       try {
//         const features = await fetchGeoData(layer, bounds);
//         setSpatialData(features);
//       } catch (err) {
//         setError(err.message);
//         setSpatialData([]);
//       }
//     }, 350),
//     [fetchGeoData]
//   );

//   useEffect(() => {
//     const loadInitialData = async () => {
//       setSpatialData([]);
//       setError('');
//       setLoading(true);
      
//       try {
//         const features = await fetchGeoData(selectedType);
//         setSpatialData(features);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadInitialData();
//   }, [selectedType, fetchGeoData]);

//   const handleBoundsChange = useCallback((bounds) => {
//     if (!bounds || !selectedType || !bounds.isValid()) {
//       console.warn('Invalid bounds or layer, skipping fetch');
//       return;
//     }
//     fetchGeoByBbox(selectedType, bounds);
//   }, [selectedType, fetchGeoByBbox]);

//   const availableDataTypes = dataTypes.filter(type => 
//     availableLayers.some(layer => layer.name === type.key && layer.exists)
//   );

//   return (
//     <div className="container mx-auto px-4 py-4">
//       <div className="card bg-white rounded-lg shadow-md p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">Spatial Data Map</h1>

//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
//             <p>{error}</p>
//           </div>
//         )}

//         {loading && (
//           <div className="flex justify-center items-center py-4">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//             <span className="ml-2 text-gray-600">Loading data...</span>
//           </div>
//         )}

//         <div className="map-controls mb-6 flex flex-wrap items-center gap-4">
//           <select
//             value={selectedType}
//             onChange={(e) => setSelectedType(e.target.value)}
//             className="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {availableDataTypes.map(({ key, label }) => (
//               <option key={key} value={key}>
//                 {label}
//               </option>
//             ))}
//           </select>
          
//           <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
//             Current Layer: <span className="font-semibold">{selectedType}</span>
//           </div>
//         </div>

//         <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
//           <MapComponent
//             spatialData={spatialData}
//             initialCenter={[-6.764538, 39.214464]}
//             initialZoom={13}
//             onBoundsChange={handleBoundsChange}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// // export default MapView;

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import MapComponent from '../components/MapComponent';
// import { saveAs } from 'file-saver';
// import tokml from 'tokml';

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
//   const [availableLayers, setAvailableLayers] = useState([]);
//   const [showGoogleEarth, setShowGoogleEarth] = useState(false);
//   const location = useLocation();
//   const googleEarthRef = useRef(null);
//   const googleMapInstance = useRef(null);
//   const googleDataLayer = useRef(null);

//   const API_BASE = (import.meta.env.VITE_API_URL || 'https://smds.onrender.com').replace(/\/$/, '');
//   const API_PREFIX = `${API_BASE}/api/v1/auth`;

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
//     { key: 'vimbweta', label: 'Vimbmbeta' },
//     { key: 'security', label: 'Security' },
//     { key: 'recreational_areas', label: 'Recreational Areas' }
//   ];

//   // Fetch available layers
//   useEffect(() => {
//     const fetchAvailableLayers = async () => {
//       try {
//         const response = await axios.get(`${API_BASE}/api/v1/layers`);
//         setAvailableLayers(response.data.layers || []);
//       } catch (err) {
//         console.error('Failed to fetch available layers:', err);
//       }
//     };
//     fetchAvailableLayers();
//   }, [API_BASE]);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const category = params.get('category');
//     if (category && availableLayers.length > 0) {
//       const layer = availableLayers.find(l => l.name.toLowerCase() === category.toLowerCase());
//       if (layer) setSelectedType(layer.name);
//     }
//   }, [location, availableLayers]);

//   const fetchGeoData = useCallback(async (layer, bounds = null) => {
//     if (!layer) return [];
//     try {
//       setLoading(true);
//       setError('');
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Authentication required');

//       const url = `${API_PREFIX}/geojson/${layer}`;
//       const params = { simplify: bounds ? 0.00012 : 0.0005 };
//       if (bounds) {
//         params.bbox = [
//           bounds.getWest(),
//           bounds.getSouth(),
//           bounds.getEast(),
//           bounds.getNorth()
//         ].join(',');
//       }

//       const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` }, params, timeout: 30000 });
//       return response.status === 200 ? response.data?.features || [] : [];
//     } catch (error) {
//       console.error('Failed to fetch GeoJSON:', error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem('token');
//         window.location.href = '/login';
//       }
//       throw new Error(error.message || 'Failed to load spatial data');
//     } finally {
//       setLoading(false);
//     }
//   }, [API_PREFIX]);

//   const fetchGeoByBbox = useCallback(debounce(async (layer, bounds) => {
//     if (!bounds) return;
//     try {
//       const features = await fetchGeoData(layer, bounds);
//       setSpatialData(features);
//     } catch (err) {
//       setError(err.message);
//       setSpatialData([]);
//     }
//   }, 350), [fetchGeoData]);

//   useEffect(() => {
//     const loadInitialData = async () => {
//       setSpatialData([]);
//       setError('');
//       setLoading(true);
//       try {
//         const features = await fetchGeoData(selectedType);
//         setSpatialData(features);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadInitialData();
//   }, [selectedType, fetchGeoData]);

//   const handleBoundsChange = useCallback((bounds) => {
//     if (!bounds || !selectedType || !bounds.isValid()) return;
//     fetchGeoByBbox(selectedType, bounds);
//   }, [selectedType, fetchGeoByBbox]);

//   const availableDataTypes = dataTypes.filter(type => availableLayers.some(layer => layer.name === type.key && layer.exists));

//   // Google Earth 3D
//   useEffect(() => {
//     if (!showGoogleEarth) return;
//     if (!googleEarthRef.current) return;
//     googleEarthRef.current.innerHTML = '';

//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;

//     script.async = true;
//     script.onload = () => {
//       googleMapInstance.current = new window.google.maps.Map(googleEarthRef.current, {
//         center: { lat: -6.764538, lng: 39.214464 },
//         zoom: 13,
//         mapTypeId: 'satellite',
//         tilt: 45
//       });

//       googleDataLayer.current = new window.google.maps.Data();
//       googleDataLayer.current.setStyle({
//         fillColor: 'rgba(0, 123, 255, 0.3)',
//         strokeColor: '#007bff',
//         strokeWeight: 2
//       });
//       googleDataLayer.current.setMap(googleMapInstance.current);

//       if (spatialData.length) {
//         googleDataLayer.current.addGeoJson({
//           type: 'FeatureCollection',
//           features: spatialData
//         });
//       }
//     };
//     document.body.appendChild(script);
//   }, [showGoogleEarth]);

//   useEffect(() => {
//     if (!showGoogleEarth || !googleDataLayer.current) return;
//     googleDataLayer.current.forEach(f => googleDataLayer.current.remove(f));
//     if (spatialData.length) {
//       googleDataLayer.current.addGeoJson({
//         type: 'FeatureCollection',
//         features: spatialData
//       });
//     }
//   }, [spatialData, showGoogleEarth]);

//   const handleExport = (format) => {
//     if (!spatialData.length) return alert('No data to export!');
//     if (format === 'geojson') {
//       const blob = new Blob([JSON.stringify({ type: 'FeatureCollection', features: spatialData }, null, 2)], { type: 'application/json' });
//       saveAs(blob, `${selectedType}.geojson`);
//     } else if (format === 'kml') {
//       try {
//         const kmlString = tokml({ type: 'FeatureCollection', features: spatialData });
//         const blob = new Blob([kmlString], { type: 'application/vnd.google-earth.kml+xml' });
//         saveAs(blob, `${selectedType}.kml`);
//       } catch (err) {
//         alert('Failed to convert to KML: ' + err.message);
//       }
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-4">
//       <div className="card bg-white rounded-lg shadow-md p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">Professional Web GIS Map</h1>

//         {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"><p>{error}</p></div>}
//         {loading && <div className="flex justify-center items-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div><span className="ml-2 text-gray-600">Loading data...</span></div>}

//         <div className="map-controls mb-6 flex flex-wrap items-center gap-4">
//           <select
//             value={selectedType}
//             onChange={(e) => setSelectedType(e.target.value)}
//             className="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {availableDataTypes.map(({ key, label }) => (
//               <option key={key} value={key}>{label}</option>
//             ))}
//           </select>

//           <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
//             Current Layer: <span className="font-semibold">{selectedType}</span>
//           </div>

//           <button
//             onClick={() => setShowGoogleEarth(!showGoogleEarth)}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
//           >
//             {showGoogleEarth ? 'Show Leaflet Map' : 'Show Google Earth 3D'}
//           </button>

//           <button
//             onClick={() => handleExport('geojson')}
//             className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
//           >
//             Export GeoJSON
//           </button>

//           <button
//             onClick={() => handleExport('kml')}
//             className="bg-purple-500 text-white px-4 py-2 rounded-md shadow hover:bg-purple-600"
//           >
//             Export KML
//           </button>
//         </div>

//         <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg" style={{ height: '600px' }}>
//           {showGoogleEarth ? (
//             <div ref={googleEarthRef} style={{ width: '100%', height: '100%' }} />
//           ) : (
//             <MapComponent
//               spatialData={spatialData}
//               initialCenter={[-6.764538, 39.214464]}
//               initialZoom={13}
//               onBoundsChange={handleBoundsChange}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MapView;

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MapComponent from '../components/MapComponent';
import { saveAs } from 'file-saver';
import tokml from 'tokml';

// Debounce utility
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function MapView() {
  const [spatialData, setSpatialData] = useState([]);
  const [selectedType, setSelectedType] = useState('buildings');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableLayers, setAvailableLayers] = useState([]);
  const [showGoogleEarth, setShowGoogleEarth] = useState(false);

  const location = useLocation();
  const googleEarthRef = useRef(null);

  // Vite environment variables
  const API_BASE = (import.meta.env.VITE_API_URL || 'https://smds.onrender.com').replace(/\/$/, '');
  const API_PREFIX = `${API_BASE}/geojson`; 
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

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
    { key: 'vimbweta', label: 'Vimbmbeta' },
    { key: 'security', label: 'Security' },
    { key: 'recreational_areas', label: 'Recreational Areas' }
  ];

  // Fetch available layers
  useEffect(() => {
    const fetchAvailableLayers = async () => {
      try {
        const response = await axios.get(`${API_BASE}/layers`);
        setAvailableLayers(response.data.layers || []);
      } catch (err) {
        console.error('Failed to fetch available layers:', err);
      }
    };
    fetchAvailableLayers();
  }, [API_BASE]);

  // Handle URL category query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category && availableLayers.length > 0) {
      const layer = availableLayers.find(l => l.name.toLowerCase() === category.toLowerCase());
      if (layer) setSelectedType(layer.name);
    }
  }, [location, availableLayers]);

  // --- Fetch GeoJSON with retry/backoff for 429 ---
  const fetchGeoData = useCallback(async (layer, bounds = null, attempt = 0) => {
    if (!layer) return [];

    const MAX_RETRIES = 5;
    const BASE_DELAY = 500; // ms

    try {
      setLoading(true);
      setError('');

      const url = `${API_PREFIX}/${layer}`;
      const params = { simplify: bounds ? 0.00012 : 0.0005 };
      if (bounds) {
        params.bbox = [
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth()
        ].join(',');
      }

      const response = await axios.get(url, { params, timeout: 30000 });
      return response.status === 200 ? response.data?.features || [] : [];

    } catch (error) {
      if (error.response?.status === 429 && attempt < MAX_RETRIES) {
        const delay = BASE_DELAY * Math.pow(2, attempt);
        console.warn(`429 received. Retrying in ${delay}ms (attempt ${attempt + 1})`);
        await new Promise(res => setTimeout(res, delay));
        return fetchGeoData(layer, bounds, attempt + 1);
      }

      console.error('Failed to fetch GeoJSON:', error);
      setError(error.message || 'Failed to load spatial data');
      return [];
    } finally {
      setLoading(false);
    }
  }, [API_PREFIX]);

  const fetchGeoByBbox = useCallback(
    debounce(async (layer, bounds) => {
      if (!bounds) return;
      const features = await fetchGeoData(layer, bounds);
      setSpatialData(features);
    }, 350),
    [fetchGeoData]
  );

  // Load initial layer
  useEffect(() => {
    const loadInitialData = async () => {
      setSpatialData([]);
      setError('');
      setLoading(true);
      const features = await fetchGeoData(selectedType);
      setSpatialData(features);
      setLoading(false);
    };
    loadInitialData();
  }, [selectedType, fetchGeoData]);

  // Bounds change handler for Leaflet
  const handleBoundsChange = useCallback((bounds) => {
    if (!bounds || !selectedType || !bounds.isValid()) return;
    fetchGeoByBbox(selectedType, bounds);
  }, [selectedType, fetchGeoByBbox]);

  const availableDataTypes = dataTypes.filter(type => availableLayers.some(layer => layer.name === type.key && layer.exists));

  // Export GeoJSON/KML
  const handleExport = (format) => {
    if (!spatialData.length) return alert('No data to export!');
    const featureCollection = { type: 'FeatureCollection', features: spatialData };

    if (format === 'geojson') {
      const blob = new Blob([JSON.stringify(featureCollection, null, 2)], { type: 'application/json' });
      saveAs(blob, `${selectedType}.geojson`);
    } else if (format === 'kml') {
      try {
        const kmlString = tokml(featureCollection);
        const blob = new Blob([kmlString], { type: 'application/vnd.google-earth.kml+xml' });
        saveAs(blob, `${selectedType}.kml`);
      } catch (err) {
        alert('Failed to convert to KML: ' + err.message);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="card bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Professional Web GIS Map</h1>

        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"><p>{error}</p></div>}
        {loading && <div className="flex justify-center items-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div><span className="ml-2 text-gray-600">Loading data...</span></div>}

        <div className="map-controls mb-6 flex flex-wrap items-center gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableDataTypes.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
            Current Layer: <span className="font-semibold">{selectedType}</span>
          </div>

          <button
            onClick={() => setShowGoogleEarth(!showGoogleEarth)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
          >
            {showGoogleEarth ? 'Show Leaflet Map' : 'Show Google Earth 3D'}
          </button>

          <button
            onClick={() => handleExport('geojson')}
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
          >
            Export GeoJSON
          </button>

          <button
            onClick={() => handleExport('kml')}
            className="bg-purple-500 text-white px-4 py-2 rounded-md shadow hover:bg-purple-600"
          >
            Export KML
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg" style={{ height: '600px' }}>
          <MapComponent
            spatialData={spatialData}
            initialCenter={[-6.764538, 39.214464]}
            initialZoom={13}
            onBoundsChange={handleBoundsChange}
            showGoogleEarth={showGoogleEarth}
            googleApiKey={GOOGLE_API_KEY}
          />
        </div>
      </div>
    </div>
  );
}

export default MapView;
