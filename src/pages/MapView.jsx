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
//     if (!bounds || typeof bounds.getWest !== 'function') return;
//     const key = `${bounds.getWest().toFixed(6)},${bounds.getSouth().toFixed(6)},${bounds.getEast().toFixed(6)},${bounds.getNorth().toFixed(6)}`;
//     if (lastBoundsKeyRef.current === key) return;
//     lastBoundsKeyRef.current = key;
//     fetchGeoByBbox(selectedType, bounds, 0.00012);
//   };

//   const cardStyle = {
//     border: '1px solid #ddd',
//     borderRadius: '8px',
//     padding: '16px',
//     backgroundColor: '#f9f9f9',
//     height: '100%',
//     overflowY: 'auto',
//   };

//   const containerStyle = {
//     display: 'flex',
//     height: '90vh',
//     gap: '16px',
//   };

//   const leftStyle = {
//     width: '300px',
//     ...cardStyle,
//   };

//   const rightStyle = {
//     flex: 1,
//     ...cardStyle,
//     padding: 0,
//   };

//   const buttonStyle = {
//     padding: '8px 12px',
//     margin: '4px 0',
//     width: '100%',
//     borderRadius: '4px',
//     border: 'none',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     cursor: 'pointer',
//   };

//   return (
//     <div style={containerStyle}>
//       <div style={leftStyle}>
//         <h2>Layers / Elements</h2>
//         <select
//           value={selectedType}
//           onChange={(e) => setSelectedType(e.target.value)}
//           style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
//         >
//           {dataTypes.map(({ key, label }) => (
//             <option key={key} value={key}>{label}</option>
//           ))}
//         </select>
//         <div>
//           <p><b>Selected Layer:</b> {selectedType}</p>
//         </div>
//         {loading && <p>Loading...</p>}
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button style={buttonStyle} onClick={() => alert('Export functionality here')}>Export Layer</button>
//         <button style={{ ...buttonStyle, backgroundColor: '#28a745' }} onClick={() => alert('Other action')}>Other Action</button>
//       </div>

//       <div style={rightStyle}>
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
//   const [spatialData, setSpatialData] = useState({});
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

//   const layerColors = {
//     buildings: '#ff5733',
//     roads: '#2e86de',
//     footpaths: '#28b463',
//     vegetation: '#27ae60',
//     parking: '#f1c40f',
//     solid_waste: '#8e44ad',
//     electricity: '#e67e22',
//     water_supply: '#3498db',
//     drainage: '#16a085',
//     vimbweta: '#d35400',
//     security: '#c0392b',
//     recreational_areas: '#7f8c8d',
//   };

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
//         setSpatialData((prev) => ({
//           ...prev,
//           [layer]: Array.isArray(fc.features) ? fc.features : [],
//         }));
//       } catch (err) {
//         console.error('Error fetching geojson by bbox:', err);
//         setError('Failed to load features for current view');
//         setSpatialData((prev) => ({ ...prev, [layer]: [] }));
//       } finally {
//         setLoading(false);
//       }
//     }, 350),
//     [API_BASE]
//   );

//   useEffect(() => {
//     setSpatialData({});
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
//         setSpatialData({ [selectedType]: Array.isArray(fc.features) ? fc.features : [] });
//       } catch (err) {
//         console.warn('Initial whole-layer fetch failed:', err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [selectedType, API_BASE]);

//   const handleBoundsChange = (bounds) => {
//     if (!bounds || typeof bounds.getWest !== 'function') return;
//     const key = `${bounds.getWest().toFixed(6)},${bounds.getSouth().toFixed(6)},${bounds.getEast().toFixed(6)},${bounds.getNorth().toFixed(6)}`;
//     if (lastBoundsKeyRef.current === key) return;
//     lastBoundsKeyRef.current = key;
//     fetchGeoByBbox(selectedType, bounds, 0.00012);
//   };

//   const cardStyle = {
//     border: '1px solid #ddd',
//     borderRadius: '8px',
//     padding: '16px',
//     backgroundColor: '#f9f9f9',
//     height: '100%',
//     overflowY: 'auto',
//   };

//   const containerStyle = {
//     display: 'flex',
//     height: '90vh',
//     gap: '16px',
//   };

//   const leftStyle = {
//     width: '300px',
//     ...cardStyle,
//   };

//   const rightStyle = {
//     flex: 1,
//     ...cardStyle,
//     padding: 0,
//   };

//   const buttonStyle = {
//     padding: '8px 12px',
//     margin: '4px 0',
//     width: '100%',
//     borderRadius: '4px',
//     border: 'none',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     cursor: 'pointer',
//   };

//   return (
//     <div style={containerStyle}>
//       <div style={leftStyle}>
//         <h2>Layers / Elements</h2>
//         <select
//           value={selectedType}
//           onChange={(e) => setSelectedType(e.target.value)}
//           style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
//         >
//           {dataTypes.map(({ key, label }) => (
//             <option key={key} value={key}>{label}</option>
//           ))}
//         </select>

//         {/* Selected Layer Info */}
//         <div>
//           <p><b>Selected Layer:</b> {selectedType}</p>
//         </div>

//         {/* Legend */}
//         <div style={{ marginTop: '16px' }}>
//           <h4>Legend</h4>
//           {Object.entries(layerColors).map(([layer, color]) => (
//             <div key={layer} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
//               <div style={{ width: '20px', height: '20px', backgroundColor: color, marginRight: '8px', border: '1px solid #000' }} />
//               <span>{layer.replace(/_/g, ' ').toUpperCase()}</span>
//             </div>
//           ))}
//         </div>

//         {loading && <p>Loading...</p>}
//         {error && <p style={{ color: 'red' }}>{error}</p>}

//         <button style={buttonStyle} onClick={() => alert('Export functionality here')}>Export Layer</button>
//         <button style={{ ...buttonStyle, backgroundColor: '#28a745' }} onClick={() => alert('Other action')}>Other Action</button>
//       </div>

//       <div style={rightStyle}>
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

// // src/pages/MapView.jsx
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
//   const [spatialData, setSpatialData] = useState({});
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

//   const layerColors = {
//     buildings: '#ff5733',
//     roads: '#2e86de',
//     footpaths: '#28b463',
//     vegetation: '#27ae60',
//     parking: '#f1c40f',
//     solid_waste: '#8e44ad',
//     electricity: '#e67e22',
//     water_supply: '#3498db',
//     drainage: '#16a085',
//     vimbweta: '#d35400',
//     security: '#c0392b',
//     recreational_areas: '#7f8c8d',
//   };

//   const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

//   // Initialize layer from URL query
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
//       const key = `${layer}-${bounds.getWest().toFixed(6)}-${bounds.getSouth().toFixed(6)}-${bounds.getEast().toFixed(6)}-${bounds.getNorth().toFixed(6)}`;
//       if (lastBoundsKeyRef.current === key) return;
//       lastBoundsKeyRef.current = key;

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
//         setSpatialData((prev) => ({ ...prev, [layer]: Array.isArray(fc.features) ? fc.features : [] }));
//       } catch (err) {
//         console.error('Error fetching geojson by bbox:', err);
//         setError('Failed to load features for current view');
//         setSpatialData((prev) => ({ ...prev, [layer]: [] }));
//       } finally {
//         setLoading(false);
//       }
//     }, 350),
//     [API_BASE]
//   );

//   // Initial full-layer fetch
//   useEffect(() => {
//     setSpatialData({});
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
//         setSpatialData({ [selectedType]: Array.isArray(fc.features) ? fc.features : [] });
//       } catch (err) {
//         console.warn('Initial whole-layer fetch failed:', err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [selectedType, API_BASE]);

//   const handleBoundsChange = (bounds) => fetchGeoByBbox(selectedType, bounds, 0.00012);

//   const containerStyle = { display: 'flex', height: '90vh', gap: '16px' };
//   const cardStyle = { border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#f9f9f9', height: '100%', overflowY: 'auto' };
//   const leftStyle = { width: '300px', ...cardStyle };
//   const rightStyle = { flex: 1, ...cardStyle, padding: 0 };
//   const buttonStyle = { padding: '8px 12px', margin: '4px 0', width: '100%', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' };

//   return (
//     <div style={containerStyle}>
//       <div style={leftStyle}>
//         <h2>Layers / Elements</h2>
//         <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '12px' }}>
//           {dataTypes.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
//         </select>

//         <div><p><b>Selected Layer:</b> {selectedType}</p></div>

//         <div style={{ marginTop: '16px' }}>
//           <h4>Legend</h4>
//           {Object.entries(layerColors).map(([layer, color]) => (
//             <div key={layer} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
//               <div style={{ width: '20px', height: '20px', backgroundColor: color, marginRight: '8px', border: '1px solid #000' }} />
//               <span>{layer.replace(/_/g, ' ').toUpperCase()}</span>
//             </div>
//           ))}
//         </div>

//         {loading && <p>Loading...</p>}
//         {error && <p style={{ color: 'red' }}>{error}</p>}

//         <button style={buttonStyle} onClick={() => alert('Export functionality here')}>Export Layer</button>
//         <button style={{ ...buttonStyle, backgroundColor: '#28a745' }} onClick={() => alert('Other action')}>Other Action</button>
//       </div>

//       <div style={rightStyle}>
//         <MapComponent
//           spatialData={spatialData}
//           initialCenter={[-6.764538, 39.214464]}
//           onBoundsChange={handleBoundsChange}
//           layerColors={layerColors}
//         />
//       </div>
//     </div>
//   );
// }

// // export default MapView;
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import MapComponent from '../components/MapComponent';

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
// // MapView Page
// // ------------------------
// function MapView() {
//   const [spatialData, setSpatialData] = useState({});
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

//   const layerColors = {
//     buildings: '#ff5733',
//     roads: '#2e86de',
//     footpaths: '#28b463',
//     vegetation: '#27ae60',
//     parking: '#f1c40f',
//     solid_waste: '#8e44ad',
//     electricity: '#e67e22',
//     water_supply: '#3498db',
//     drainage: '#16a085',
//     vimbweta: '#d35400',
//     security: '#c0392b',
//     recreational_areas: '#7f8c8d',
//   };

//   const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
//   const lastBoundsKeyRef = useRef(null);

//   // ------------------------
//   // Initialize layer from URL query
//   // ------------------------
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const category = params.get('category');
//     const type = category ? (categoryToTypeMap[category] || 'buildings') : 'buildings';
//     setSelectedType(type);
//   }, [location]);

//   // ------------------------
//   // Fetch GeoJSON by bounding box
//   // ------------------------
//   const fetchGeoByBbox = useCallback(
//     debounce(async (layer, bounds, simplify = 0.0001) => {
//       if (!layer || !bounds) return;
//       const key = `${layer}-${bounds.getWest().toFixed(6)}-${bounds.getSouth().toFixed(6)}-${bounds.getEast().toFixed(6)}-${bounds.getNorth().toFixed(6)}`;
//       if (lastBoundsKeyRef.current === key) return;
//       lastBoundsKeyRef.current = key;

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
//         setSpatialData((prev) => ({ ...prev, [layer]: Array.isArray(fc.features) ? fc.features : [] }));
//       } catch (err) {
//         console.error('Error fetching geojson by bbox:', err);
//         setError('Failed to load features for current view');
//         setSpatialData((prev) => ({ ...prev, [layer]: [] }));
//       } finally {
//         setLoading(false);
//       }
//     }, 350),
//     [API_BASE]
//   );

//   // ------------------------
//   // Initial full-layer fetch
//   // ------------------------
//   useEffect(() => {
//     setSpatialData({});
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
//         setSpatialData({ [selectedType]: Array.isArray(fc.features) ? fc.features : [] });
//       } catch (err) {
//         console.warn('Initial whole-layer fetch failed:', err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [selectedType, API_BASE]);

//   // ------------------------
//   // Bounds change handler
//   // ------------------------
//   const handleBoundsChange = (bounds) => fetchGeoByBbox(selectedType, bounds, 0.00012);

//   // ------------------------
//   // UI styles
//   // ------------------------
//   const containerStyle = { display: 'flex', height: '90vh', gap: '16px' };
//   const cardStyle = { border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#f9f9f9', height: '100%', overflowY: 'auto' };
//   const leftStyle = { width: '300px', ...cardStyle };
//   const rightStyle = { flex: 1, ...cardStyle, padding: 0 };
//   const buttonStyle = { padding: '8px 12px', margin: '4px 0', width: '100%', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' };

//   return (
//     <div style={containerStyle}>
//       <div style={leftStyle}>
//         <h2>Layers / Elements</h2>
//         <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '12px' }}>
//           {dataTypes.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
//         </select>

//         <div><p><b>Selected Layer:</b> {selectedType}</p></div>

//         <div style={{ marginTop: '16px' }}>
//           <h4>Legend</h4>
//           {Object.entries(layerColors).map(([layer, color]) => (
//             <div key={layer} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
//               <div style={{ width: '20px', height: '20px', backgroundColor: color, marginRight: '8px', border: '1px solid #000' }} />
//               <span>{layer.replace(/_/g, ' ').toUpperCase()}</span>
//             </div>
//           ))}
//         </div>

//         {loading && <p>Loading...</p>}
//         {error && <p style={{ color: 'red' }}>{error}</p>}

//         <button style={buttonStyle} onClick={() => alert('Export functionality here')}>Export Layer</button>
//         <button style={{ ...buttonStyle, backgroundColor: '#28a745' }} onClick={() => alert('Other action')}>Other Action</button>
//       </div>

//       <div style={rightStyle}>
//         <MapComponent
//           spatialData={spatialData}
//           initialCenter={[-6.764538, 39.214464]}
//           onBoundsChange={handleBoundsChange}
//           layerColors={layerColors}
//         />
//       </div>
//     </div>
//   );
// }

// // export default MapView;
// // MapView.js
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import MapComponent from '../components/MapComponent';

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
// // Token validation helper
// // ------------------------
// const checkTokenValidity = (token) => {
//   if (!token) return false;
  
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     const isExpired = payload.exp * 1000 < Date.now();
//     return !isExpired;
//   } catch {
//     return false;
//   }
// };
//corrected codes worked
// // ------------------------
// // MapView Page
// // ------------------------
// function MapView() {
//   const [spatialData, setSpatialData] = useState({});
//   const [selectedType, setSelectedType] = useState('buildings');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

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

//   const layerColors = {
//     buildings: '#ff5733',
//     roads: '#2e86de',
//     footpaths: '#28b463',
//     vegetation: '#27ae60',
//     parking: '#f1c40f',
//     solid_waste: '#8e44ad',
//     electricity: '#e67e22',
//     water_supply: '#3498db',
//     drainage: '#16a085',
//     vimbweta: '#d35400',
//     security: '#c0392b',
//     recreational_areas: '#7f8c8d',
//   };

//   // ✅ Use the correct environment variable for spatial API
//   const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');
//   const lastBoundsKeyRef = useRef(null);

//   // ------------------------
//   // Check authentication on component mount
//   // ------------------------
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     console.log('Token from localStorage:', token);
    
//     if (!token) {
//       setError('No authentication token found. Please login again.');
//       navigate('/login');
//       return;
//     }
    
//     if (!checkTokenValidity(token)) {
//       setError('Session expired. Please login again.');
//       localStorage.removeItem('token');
//       navigate('/login');
//       return;
//     }
//   }, [navigate]);

//   // ------------------------
//   // Initialize layer from URL query
//   // ------------------------
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const category = params.get('category');
//     const type = category ? (categoryToTypeMap[category] || 'buildings') : 'buildings';
//     setSelectedType(type);
//   }, [location]);

//   // ------------------------
//   // Fetch GeoJSON by bounding box
//   // ------------------------
//   const fetchGeoByBbox = useCallback(
//     debounce(async (layer, bounds, simplify = 0.0001) => {
//       if (!layer || !bounds) return;
      
//       const token = localStorage.getItem('token');
//       if (!token || !checkTokenValidity(token)) {
//         setError('Session expired. Please login again.');
//         localStorage.removeItem('token');
//         navigate('/login');
//         return;
//       }

//       const key = `${layer}-${bounds.getWest().toFixed(6)}-${bounds.getSouth().toFixed(6)}-${bounds.getEast().toFixed(6)}-${bounds.getNorth().toFixed(6)}`;
//       if (lastBoundsKeyRef.current === key) return;
//       lastBoundsKeyRef.current = key;

//       try {
//         setLoading(true);
//         setError('');
        
//         // ✅ CORRECTED: Use spatial API base
//         const url = `${SPATIAL_API_BASE}/geojson/${layer}`;
//         const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;

//         console.log('Requesting spatial data from:', `${url}?bbox=${bbox}&simplify=${simplify}`);

//         const resp = await axios.get(url, {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           params: { bbox, simplify },
//           timeout: 30000,
//         });

//         const fc = resp.data || { type: 'FeatureCollection', features: [] };
//         setSpatialData((prev) => ({ ...prev, [layer]: Array.isArray(fc.features) ? fc.features : [] }));
//       } catch (err) {
//         console.error('Error fetching geojson by bbox:', err);
        
//         if (err.response?.status === 401) {
//           setError('Authentication failed. Please login again.');
//           localStorage.removeItem('token');
//           navigate('/login');
//         } else if (err.response?.status === 403) {
//           setError('Access denied. Invalid permissions.');
//         } else if (err.response?.status === 404) {
//           setError('Data not found for this layer.');
//         } else {
//           setError('Failed to load features for current view');
//         }
        
//         setSpatialData((prev) => ({ ...prev, [layer]: [] }));
//       } finally {
//         setLoading(false);
//       }
//     }, 350),
//     [SPATIAL_API_BASE, navigate]
//   );

//   // ------------------------
//   // Initial full-layer fetch
//   // ------------------------
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token || !checkTokenValidity(token)) {
//       navigate('/login');
//       return;
//     }

//     setSpatialData({});
//     setError('');
//     setLoading(true);

//     (async () => {
//       try {
//         // ✅ CORRECTED: Use spatial API base
//         const url = `${SPATIAL_API_BASE}/geojson/${selectedType}`;
//         console.log('Initial fetch from:', url);

//         const resp = await axios.get(url, {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           params: { simplify: 0.0005 },
//           timeout: 30000,
//         });

//         const fc = resp.data || { type: 'FeatureCollection', features: [] };
//         setSpatialData({ [selectedType]: Array.isArray(fc.features) ? fc.features : [] });
//       } catch (err) {
//         console.warn('Initial whole-layer fetch failed:', err);
        
//         if (err.response?.status === 401) {
//           setError('Authentication failed. Please login again.');
//           localStorage.removeItem('token');
//           navigate('/login');
//         } else if (err.response?.status === 404) {
//           setError(`Layer "${selectedType}" not found on server.`);
//         }
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [selectedType, SPATIAL_API_BASE, navigate]);

//   // ------------------------
//   // Bounds change handler
//   // ------------------------
//   const handleBoundsChange = (bounds) => fetchGeoByBbox(selectedType, bounds, 0.00012);

//   // ------------------------
//   // Handle logout
//   // ------------------------
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   // ------------------------
//   // UI styles
//   // ------------------------
//   const containerStyle = { display: 'flex', height: '90vh', gap: '16px' };
//   const cardStyle = { border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#f9f9f9', height: '100%', overflowY: 'auto' };
//   const leftStyle = { width: '300px', ...cardStyle };
//   const rightStyle = { flex: 1, ...cardStyle, padding: 0 };
//   const buttonStyle = { padding: '8px 12px', margin: '4px 0', width: '100%', borderRadius: '4px', border: 'none', color: '#fff', cursor: 'pointer' };

//   return (
//     <div style={containerStyle}>
//       <div style={leftStyle}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//           <h2 style={{ margin: 0 }}>Layers / Elements</h2>
//           <button 
//             onClick={handleLogout}
//             style={{ 
//               padding: '6px 12px', 
//               backgroundColor: '#dc3545', 
//               color: 'white', 
//               border: 'none', 
//               borderRadius: '4px', 
//               cursor: 'pointer' 
//             }}
//           >
//             Logout
//           </button>
//         </div>

//         <select 
//           value={selectedType} 
//           onChange={(e) => setSelectedType(e.target.value)} 
//           style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
//         >
//           {dataTypes.map(({ key, label }) => (
//             <option key={key} value={key}>{label}</option>
//           ))}
//         </select>

//         <div><p><b>Selected Layer:</b> {selectedType}</p></div>

//         <div style={{ marginTop: '16px' }}>
//           <h4>Legend</h4>
//           {Object.entries(layerColors).map(([layer, color]) => (
//             <div key={layer} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
//               <div style={{ width: '20px', height: '20px', backgroundColor: color, marginRight: '8px', border: '1px solid #000' }} />
//               <span>{layer.replace(/_/g, ' ').toUpperCase()}</span>
//             </div>
//           ))}
//         </div>

//         {loading && <p>Loading map data...</p>}
//         {error && (
//           <div style={{ 
//             padding: '10px', 
//             backgroundColor: '#ffebee', 
//             border: '1px solid #f44336', 
//             borderRadius: '4px', 
//             margin: '10px 0' 
//           }}>
//             <p style={{ color: '#d32f2f', margin: 0 }}>{error}</p>
//           </div>
//         )}

//         <button style={{ ...buttonStyle, backgroundColor: '#007bff' }} onClick={() => alert('Export functionality here')}>
//           Export Layer
//         </button>
//         <button style={{ ...buttonStyle, backgroundColor: '#28a745' }} onClick={() => alert('Other action')}>
//           Other Action
//         </button>
//       </div>

//       <div style={rightStyle}>
//         <MapComponent
//           spatialData={spatialData}
//           initialCenter={[-6.764538, 39.214464]}
//           onBoundsChange={handleBoundsChange}
//           layerColors={layerColors}
//         />
//       </div>
//     </div>
//   );
// }

// export default MapView;
//corrected mostly one...
// // MapView.js
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import MapComponent from '../components/MapComponent';

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
      
//       const response = await axios({
//         ...options,
//         url,
//         signal: controller.signal,
//       });
      
//       clearTimeout(timeoutId);
//       return response;
//     } catch (error) {
//       if (i === maxRetries - 1) throw error;
//       console.warn(`Attempt ${i + 1} failed, retrying...`);
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
//     const isExpired = payload.exp * 1000 < Date.now();
//     return !isExpired;
//   } catch {
//     return false;
//   }
// };

// // ------------------------
// // Local storage helper for caching
// // ------------------------
// const useLocalStorageCache = (key, ttl = 3600000) => { // 1 hour default TTL
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
//       const item = JSON.stringify({
//         value,
//         timestamp: Date.now()
//       });
//       localStorage.setItem(key, item);
//     } catch (error) {
//       console.warn('Could not save to localStorage:', error);
//     }
//   }, [key]);

//   return { get, set };
// };

// // ------------------------
// // MapView Page
// // ------------------------
// function MapView() {
//   const [spatialData, setSpatialData] = useState({});
//   const [selectedType, setSelectedType] = useState('buildings');
//   const [selectedLayers, setSelectedLayers] = useState(new Set(['buildings']));
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [loadingLayers, setLoadingLayers] = useState(new Set());
//   const [mapStats, setMapStats] = useState({});
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredFeatures, setFilteredFeatures] = useState({});
//   const [showFilters, setShowFilters] = useState(false);
//   const [activeFilters, setActiveFilters] = useState({});
//   const [exportProgress, setExportProgress] = useState(0);
//   const [isExporting, setIsExporting] = useState(false);
  
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Cache implementation
//   const spatialCache = useLocalStorageCache('spatial-data-cache', 86400000); // 24 hours
//   const spatialDataCache = useRef(new Map());
//   const lastBoundsKeyRef = useRef(null);

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
//     'aru-boundary': 'aru_boundary'
//   };

//   const dataTypes = [
//     { key: 'buildings', label: 'Buildings', hasProperties: true },
//     { key: 'roads', label: 'Roads', hasProperties: true },
//     { key: 'footpaths', label: 'Footpaths', hasProperties: true },
//     { key: 'vegetation', label: 'Vegetation', hasProperties: true },
//     { key: 'parking', label: 'Parking', hasProperties: true },
//     { key: 'solid_waste', label: 'Solid Waste', hasProperties: true },
//     { key: 'electricity', label: 'Electricity', hasProperties: true },
//     { key: 'water_supply', label: 'Water Supply', hasProperties: true },
//     { key: 'drainage', label: 'Drainage System', hasProperties: true },
//     { key: 'vimbweta', label: 'Vimbweta', hasProperties: true },
//     { key: 'security', label: 'Security Lights', hasProperties: true },
//     { key: 'recreational_areas', label: 'Recreational Areas', hasProperties: true },
//     { key: 'aru_boundary', label: 'ARU Boundary', hasProperties: false }
//   ];

//   const layerColors = {
//     buildings: '#ff5733',
//     roads: '#2e86de',
//     footpaths: '#28b463',
//     vegetation: '#27ae60',
//     parking: '#f1c40f',
//     solid_waste: '#8e44ad',
//     electricity: '#e67e22',
//     water_supply: '#3498db',
//     drainage: '#16a085',
//     vimbweta: '#d35400',
//     security: '#c0392b',
//     recreational_areas: '#7f8c8d',
//     aru_boundary: '#000000'
//   };

//   const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');

//   // ------------------------
//   // Check authentication on component mount
//   // ------------------------
//   useEffect(() => {
//     const token = localStorage.getItem('token');
    
//     if (!token) {
//       setError('No authentication token found. Please login again.');
//       navigate('/login');
//       return;
//     }
    
//     if (!checkTokenValidity(token)) {
//       setError('Session expired. Please login again.');
//       localStorage.removeItem('token');
//       navigate('/login');
//       return;
//     }

//     // Load cached data on mount
//     const cachedData = spatialCache.get();
//     if (cachedData) {
//       setSpatialData(cachedData);
//     }
//   }, [navigate]);

//   // ------------------------
//   // Initialize layer from URL query
//   // ------------------------
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const category = params.get('category');
//     const type = category ? (categoryToTypeMap[category] || 'buildings') : 'buildings';
//     setSelectedType(type);
//     setSelectedLayers(new Set([type]));
//   }, [location]);

//   // ------------------------
//   // Calculate map statistics
//   // ------------------------
//   useEffect(() => {
//     const stats = {};
//     Object.entries(spatialData).forEach(([layer, features]) => {
//       stats[layer] = {
//         count: features.length,
//         properties: features.reduce((acc, feature) => {
//           if (feature.properties) {
//             Object.entries(feature.properties).forEach(([key, value]) => {
//               if (!acc[key]) acc[key] = new Set();
//               if (value !== null && value !== undefined) {
//                 acc[key].add(value.toString());
//               }
//             });
//           }
//           return acc;
//         }, {})
//       };
//     });
//     setMapStats(stats);
//   }, [spatialData]);

//   // ------------------------
//   // Apply search filter
//   // ------------------------
//   useEffect(() => {
//     if (!searchQuery) {
//       setFilteredFeatures({});
//       return;
//     }

//     const filtered = {};
//     Object.entries(spatialData).forEach(([layer, features]) => {
//       filtered[layer] = features.filter(feature => 
//         feature.properties && 
//         Object.values(feature.properties).some(value => 
//           value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
//         )
//       );
//     });
//     setFilteredFeatures(filtered);
//   }, [searchQuery, spatialData]);

//   // ------------------------
//   // Apply property filters
//   // ------------------------
//   useEffect(() => {
//     if (Object.keys(activeFilters).length === 0) {
//       setFilteredFeatures({});
//       return;
//     }

//     const filtered = {};
//     Object.entries(spatialData).forEach(([layer, features]) => {
//       filtered[layer] = features.filter(feature => {
//         if (!feature.properties) return false;
        
//         return Object.entries(activeFilters).every(([key, values]) => {
//           if (!feature.properties[key]) return false;
//           return values.includes(feature.properties[key].toString());
//         });
//       });
//     });
//     setFilteredFeatures(filtered);
//   }, [activeFilters, spatialData]);

//   // ------------------------
//   // Fetch GeoJSON by bounding box for multiple layers
//   // ------------------------
//   const fetchGeoByBbox = useCallback(
//     debounce(async (layers, bounds, simplify = 0.0001) => {
//       if (!layers || layers.size === 0 || !bounds) return;
      
//       const token = localStorage.getItem('token');
//       if (!token || !checkTokenValidity(token)) {
//         setError('Session expired. Please login again.');
//         localStorage.removeItem('token');
//         navigate('/login');
//         return;
//       }

//       const key = `${Array.from(layers).join('-')}-${bounds.getWest().toFixed(6)}-${bounds.getSouth().toFixed(6)}-${bounds.getEast().toFixed(6)}-${bounds.getNorth().toFixed(6)}`;
//       if (lastBoundsKeyRef.current === key) return;
//       lastBoundsKeyRef.current = key;

//       try {
//         setLoading(true);
//         setError('');
//         setLoadingLayers(prev => new Set([...prev, ...layers]));

//         const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
//         const newSpatialData = { ...spatialData };

//         for (const layer of layers) {
//           try {
//             const cacheKey = `${layer}-${bbox}-${simplify}`;
//             if (spatialDataCache.current.has(cacheKey)) {
//               newSpatialData[layer] = spatialDataCache.current.get(cacheKey);
//               continue;
//             }

//             const url = `${SPATIAL_API_BASE}/geojson/${layer}`;
//             const resp = await fetchWithRetry(url, {
//               headers: { 
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//               },
//               params: { bbox, simplify },
//             }, 2, 45000);

//             const fc = resp.data || { type: 'FeatureCollection', features: [] };
//             const features = Array.isArray(fc.features) ? fc.features : [];
//             newSpatialData[layer] = features;
//             spatialDataCache.current.set(cacheKey, features);
//           } catch (err) {
//             console.error(`Error fetching geojson for ${layer}:`, err);
//             newSpatialData[layer] = [];
            
//             if (err.response?.status === 401) {
//               setError('Authentication failed. Please login again.');
//               localStorage.removeItem('token');
//               navigate('/login');
//               break;
//             } else if (err.response?.status === 404) {
//               console.warn(`Layer "${layer}" not found on server.`);
//             }
//           }
//         }

//         setSpatialData(newSpatialData);
//         spatialCache.set(newSpatialData);
        
//       } catch (err) {
//         console.error('Error fetching geojson by bbox:', err);
//         setError('Failed to load features for current view');
//       } finally {
//         setLoading(false);
//         setLoadingLayers(new Set());
//       }
//     }, 500),
//     [SPATIAL_API_BASE, navigate, spatialData]
//   );

//   // ------------------------
//   // Initial full-layer fetch for selected layers
//   // ------------------------
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token || !checkTokenValidity(token)) {
//       navigate('/login');
//       return;
//     }

//     setError('');
//     setLoading(true);

//     (async () => {
//       try {
//         setLoadingLayers(new Set([...selectedLayers]));
//         const newSpatialData = { ...spatialData };

//         for (const layer of selectedLayers) {
//           try {
//             const url = `${SPATIAL_API_BASE}/geojson/${layer}`;
//             const resp = await fetchWithRetry(url, {
//               headers: { 
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//               },
//               params: { simplify: 0.0005 },
//             }, 2, 45000);

//             const fc = resp.data || { type: 'FeatureCollection', features: [] };
//             newSpatialData[layer] = Array.isArray(fc.features) ? fc.features : [];
//           } catch (err) {
//             console.warn(`Initial fetch failed for ${layer}:`, err);
//             newSpatialData[layer] = [];
            
//             if (err.response?.status === 401) {
//               setError('Authentication failed. Please login again.');
//               localStorage.removeItem('token');
//               navigate('/login');
//               break;
//             }
//           }
//         }

//         setSpatialData(newSpatialData);
//         spatialCache.set(newSpatialData);
//       } catch (err) {
//         console.warn('Initial layer fetch failed:', err);
//       } finally {
//         setLoading(false);
//         setLoadingLayers(new Set());
//       }
//     })();
//   }, [selectedLayers, SPATIAL_API_BASE, navigate]);

//   // ------------------------
//   // Export functionality
//   // ------------------------
//   const exportData = async (format = 'geojson') => {
//     setIsExporting(true);
//     setExportProgress(0);
    
//     try {
//       const dataToExport = Object.keys(filteredFeatures).length > 0 ? filteredFeatures : spatialData;
//       const layersToExport = Array.from(selectedLayers);
      
//       if (format === 'geojson') {
//         const blob = new Blob([JSON.stringify(dataToExport)], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `map-export-${new Date().toISOString().split('T')[0]}.json`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//       } else if (format === 'csv') {
//         // Simple CSV export implementation
//         let csvContent = 'Layer,Feature Count\n';
//         Object.entries(dataToExport).forEach(([layer, features]) => {
//           csvContent += `${layer},${features.length}\n`;
//         });
        
//         const blob = new Blob([csvContent], { type: 'text/csv' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `map-stats-${new Date().toISOString().split('T')[0]}.csv`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//       }
      
//       setExportProgress(100);
//     } catch (error) {
//       console.error('Export failed:', error);
//       setError('Export failed: ' + error.message);
//     } finally {
//       setTimeout(() => {
//         setIsExporting(false);
//         setExportProgress(0);
//       }, 1000);
//     }
//   };

//   // ------------------------
//   // Filter handlers
//   // ------------------------
//   const handleFilterChange = (layer, property, value, checked) => {
//     setActiveFilters(prev => {
//       const newFilters = { ...prev };
//       if (checked) {
//         if (!newFilters[property]) newFilters[property] = [];
//         newFilters[property].push(value);
//       } else {
//         if (newFilters[property]) {
//           newFilters[property] = newFilters[property].filter(v => v !== value);
//           if (newFilters[property].length === 0) {
//             delete newFilters[property];
//           }
//         }
//       }
//       return newFilters;
//     });
//   };

//   const clearFilters = () => {
//     setActiveFilters({});
//     setSearchQuery('');
//   };

//   // ------------------------
//   // Bounds change handler
//   // ------------------------
//   const handleBoundsChange = (bounds) => {
//     if (selectedLayers.size > 0) {
//       fetchGeoByBbox(selectedLayers, bounds, 0.00012);
//     }
//   };

//   // ------------------------
//   // Handle layer selection change
//   // ------------------------
//   const handleLayerToggle = (layerKey) => {
//     setSelectedLayers(prev => {
//       const newLayers = new Set(prev);
//       if (newLayers.has(layerKey)) {
//         newLayers.delete(layerKey);
//       } else {
//         newLayers.add(layerKey);
//       }
//       return newLayers;
//     });
//   };

//   // ------------------------
//   // Handle single layer selection
//   // ------------------------
//   const handleSingleLayerSelect = (layerKey) => {
//     setSelectedLayers(new Set([layerKey]));
//     setSelectedType(layerKey);
//   };

//   // ------------------------
//   // Handle logout
//   // ------------------------
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('spatial-data-cache');
//     navigate('/login');
//   };

//   // ------------------------
//   // UI styles
//   // ------------------------
//   const containerStyle = { display: 'flex', height: '90vh', gap: '16px' };
//   const cardStyle = { 
//     border: '1px solid #ddd', 
//     borderRadius: '8px', 
//     padding: '16px', 
//     backgroundColor: '#f9f9f9', 
//     height: '100%', 
//     overflowY: 'auto',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
//   };
//   const leftStyle = { width: '350px', ...cardStyle };
//   const rightStyle = { flex: 1, ...cardStyle, padding: 0 };
//   const buttonStyle = { 
//     padding: '8px 12px', 
//     margin: '4px 0', 
//     width: '100%', 
//     borderRadius: '4px', 
//     border: 'none', 
//     color: '#fff', 
//     cursor: 'pointer',
//     transition: 'background-color 0.2s ease'
//   };
//   const checkboxStyle = { marginRight: '8px', cursor: 'pointer' };
//   const inputStyle = {
//     width: '100%',
//     padding: '8px',
//     border: '1px solid #ddd',
//     borderRadius: '4px',
//     marginBottom: '8px'
//   };

//   const displayData = Object.keys(filteredFeatures).length > 0 ? filteredFeatures : spatialData;
//   const totalFeatures = Object.values(displayData).reduce((sum, features) => sum + features.length, 0);

//   return (
//     <div style={containerStyle}>
//       <div style={leftStyle}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//           <h2 style={{ margin: 0 }}>Layers / Elements</h2>
//           <button 
//             onClick={handleLogout}
//             style={{ 
//               padding: '6px 12px', 
//               backgroundColor: '#dc3545', 
//               color: 'white', 
//               border: 'none', 
//               borderRadius: '4px', 
//               cursor: 'pointer' 
//             }}
//           >
//             Logout
//           </button>
//         </div>

//         {/* Search Box */}
//         <div style={{ marginBottom: '16px' }}>
//           <input
//             type="text"
//             placeholder="Search features..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             style={inputStyle}
//           />
//           <div style={{ fontSize: '12px', color: '#666' }}>
//             Searching {totalFeatures} features across {Object.keys(displayData).length} layers
//           </div>
//         </div>

//         {/* Filter Toggle */}
//         <button 
//           onClick={() => setShowFilters(!showFilters)}
//           style={{ ...buttonStyle, backgroundColor: '#6c757d', marginBottom: '16px' }}
//         >
//           {showFilters ? 'Hide Filters' : 'Show Filters'}
//         </button>

//         {/* Filters Panel */}
//         {showFilters && Object.keys(activeFilters).length > 0 && (
//           <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <strong>Active Filters:</strong>
//               <button 
//                 onClick={clearFilters}
//                 style={{ padding: '2px 8px', fontSize: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '2px' }}
//               >
//                 Clear All
//               </button>
//             </div>
//             {Object.entries(activeFilters).map(([key, values]) => (
//               <div key={key} style={{ fontSize: '12px', marginTop: '4px' }}>
//                 {key}: {values.join(', ')}
//               </div>
//             ))}
//           </div>
//         )}

//         <div style={{ marginBottom: '16px' }}>
//           <h4>Select Layers to Display</h4>
//           {dataTypes.map(({ key, label }) => (
//             <div key={key} style={{ marginBottom: '8px' }}>
//               <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
//                 <input
//                   type="checkbox"
//                   checked={selectedLayers.has(key)}
//                   onChange={() => handleLayerToggle(key)}
//                   style={checkboxStyle}
//                 />
//                 <span>{label}</span>
//                 {loadingLayers.has(key) && <span style={{ marginLeft: '8px', color: '#007bff' }}>⏳</span>}
//                 {mapStats[key] && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>({mapStats[key].count})</span>}
//               </label>
//             </div>
//           ))}
//         </div>

//         <div>
//           <p><b>Selected Layers:</b> {Array.from(selectedLayers).map(layer => layer.replace(/_/g, ' ')).join(', ')}</p>
//           <p><b>Total Features:</b> {totalFeatures}</p>
//         </div>

//         <div style={{ marginTop: '16px' }}>
//           <h4>Legend</h4>
//           {Object.entries(layerColors).map(([layer, color]) => (
//             <div key={layer} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
//               <div style={{ width: '20px', height: '20px', backgroundColor: color, marginRight: '8px', border: '1px solid #000' }} />
//               <span>{layer.replace(/_/g, ' ').toUpperCase()}</span>
//               {mapStats[layer] && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>({mapStats[layer].count})</span>}
//             </div>
//           ))}
//         </div>

//         {loading && <p>Loading map data...</p>}
//         {error && (
//           <div style={{ 
//             padding: '10px', 
//             backgroundColor: '#ffebee', 
//             border: '1px solid #f44336', 
//             borderRadius: '4px', 
//             margin: '10px 0' 
//           }}>
//             <p style={{ color: '#d32f2f', margin: 0 }}>{error}</p>
//           </div>
//         )}

//         {/* Export Buttons */}
//         <div style={{ marginTop: '16px' }}>
//           <h4>Export</h4>
//           <button 
//             style={{ ...buttonStyle, backgroundColor: '#007bff' }} 
//             onClick={() => exportData('geojson')}
//             disabled={isExporting}
//           >
//             {isExporting ? `Exporting... ${exportProgress}%` : 'Export GeoJSON'}
//           </button>
//           <button 
//             style={{ ...buttonStyle, backgroundColor: '#28a745' }} 
//             onClick={() => exportData('csv')}
//             disabled={isExporting}
//           >
//             Export Statistics CSV
//           </button>
//         </div>

//         <button style={{ ...buttonStyle, backgroundColor: '#28a745' }} onClick={() => setSelectedLayers(new Set(dataTypes.map(dt => dt.key)))}>
//           Select All Layers
//         </button>
//         <button style={{ ...buttonStyle, backgroundColor: '#6c757d' }} onClick={() => setSelectedLayers(new Set())}>
//           Clear All Layers
//         </button>

//         {/* Cache Info */}
//         <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
//           <p>Data cached for offline use</p>
//         </div>
//       </div>

//       <div style={rightStyle}>
//         <MapComponent
//           spatialData={displayData}
//           initialCenter={[-6.764538, 39.214464]}
//           onBoundsChange={handleBoundsChange}
//           layerColors={layerColors}
//           highlightedFeatures={filteredFeatures}
//         />
//       </div>
//     </div>
//   );
// }

// export default MapView;
// MapView.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MapComponent from '../components/MapComponent';

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
      
      const response = await axios({
        ...options,
        url,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.warn(`Attempt ${i + 1} failed, retrying...`);
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
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch {
    return false;
  }
};

// ------------------------
// Geometry simplification prevention
// ------------------------
const preventGeometryDistortion = (features, zoomLevel) => {
  // For high zoom levels, return original features to prevent distortion
  if (zoomLevel > 15) {
    return features;
  }

  // For lower zoom levels, use a more conservative simplification
  return features.map(feature => {
    if (!feature.geometry) return feature;
    
    // Only simplify complex geometries to prevent distortion
    const geometry = { ...feature.geometry };
    
    if (geometry.type === 'LineString' && geometry.coordinates && geometry.coordinates.length > 100) {
      // Simple simplification - keep every 3rd point for lines
      geometry.coordinates = geometry.coordinates.filter((_, index) => index % 3 === 0);
    }
    else if (geometry.type === 'Polygon' && geometry.coordinates) {
      // For polygons, be very conservative with simplification
      geometry.coordinates = geometry.coordinates.map(ring => {
        if (ring.length > 50) {
          return ring.filter((_, index) => index % 2 === 0);
        }
        return ring;
      });
    }
    
    return {
      ...feature,
      geometry
    };
  });
};

// ------------------------
// Calculate appropriate simplification based on zoom level
// ------------------------
const getSimplificationFactor = (zoomLevel) => {
  // Return 0 for no simplification at higher zoom levels to prevent distortion
  if (zoomLevel > 16) return 0; // No simplification
  if (zoomLevel > 14) return 0.00001; // Minimal simplification
  if (zoomLevel > 12) return 0.00005; // Moderate simplification
  if (zoomLevel > 10) return 0.0001; // More simplification
  return 0.0002; // Maximum simplification for very low zoom
};

// ------------------------
// Local storage helper for caching
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
      const item = JSON.stringify({
        value,
        timestamp: Date.now()
      });
      localStorage.setItem(key, item);
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }
  }, [key]);

  return { get, set };
};

// ------------------------
// MapView Page
// ------------------------
function MapView() {
  const [spatialData, setSpatialData] = useState({});
  const [selectedType, setSelectedType] = useState('buildings');
  const [selectedLayers, setSelectedLayers] = useState(new Set(['buildings']));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingLayers, setLoadingLayers] = useState(new Set());
  const [mapStats, setMapStats] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFeatures, setFilteredFeatures] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(15);
  const [simplificationEnabled, setSimplificationEnabled] = useState(true);
  const [dataQuality, setDataQuality] = useState('balanced');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Cache implementation
  const spatialCache = useLocalStorageCache('spatial-data-cache', 86400000);
  const spatialDataCache = useRef(new Map());
  const lastBoundsKeyRef = useRef(null);
  const lastZoomRef = useRef(currentZoom);

  const categoryToTypeMap = {
    buildings: 'buildings',
    roads: 'roads',
    footpaths: 'footpaths',
    vegetation: 'vegetation',
    parking: 'parking',
    'solid-waste': 'solid_waste',
    electricity: 'electricity',
    'water-supply': 'water_supply',
    'drainage-system': 'drainage',
    vimbweta: 'vimbweta',
    'security-lights': 'security',
    'recreational-areas': 'recreational_areas',
    'aru-boundary': 'aru_boundary'
  };

  const dataTypes = [
    { key: 'buildings', label: 'Buildings', hasProperties: true },
    { key: 'roads', label: 'Roads', hasProperties: true },
    { key: 'footpaths', label: 'Footpaths', hasProperties: true },
    { key: 'vegetation', label: 'Vegetation', hasProperties: true },
    { key: 'parking', label: 'Parking', hasProperties: true },
    { key: 'solid_waste', label: 'Solid Waste', hasProperties: true },
    { key: 'electricity', label: 'Electricity', hasProperties: true },
    { key: 'water_supply', label: 'Water Supply', hasProperties: true },
    { key: 'drainage', label: 'Drainage System', hasProperties: true },
    { key: 'vimbweta', label: 'Vimbweta', hasProperties: true },
    { key: 'security', label: 'Security Lights', hasProperties: true },
    { key: 'recreational_areas', label: 'Recreational Areas', hasProperties: true },
    { key: 'aru_boundary', label: 'ARU Boundary', hasProperties: false }
  ];

  const layerColors = {
    buildings: '#ff5733',
    roads: '#2e86de',
    footpaths: '#28b463',
    vegetation: '#27ae60',
    parking: '#f1c40f',
    solid_waste: '#8e44ad',
    electricity: '#e67e22',
    water_supply: '#3498db',
    drainage: '#16a085',
    vimbweta: '#d35400',
    security: '#c0392b',
    recreational_areas: '#7f8c8d',
    aru_boundary: '#000000'
  };

  const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');

  // ------------------------
  // Check authentication on component mount
  // ------------------------
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('No authentication token found. Please login again.');
      navigate('/login');
      return;
    }
    
    if (!checkTokenValidity(token)) {
      setError('Session expired. Please login again.');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    // Load cached data on mount
    const cachedData = spatialCache.get();
    if (cachedData) {
      setSpatialData(cachedData);
    }
  }, [navigate, spatialCache]);

  // ------------------------
  // Initialize layer from URL query
  // ------------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const type = category ? (categoryToTypeMap[category] || 'buildings') : 'buildings';
    setSelectedType(type);
    setSelectedLayers(new Set([type]));
  }, [location]);

  // ------------------------
  // Calculate map statistics
  // ------------------------
  useEffect(() => {
    const stats = {};
    Object.entries(spatialData).forEach(([layer, features]) => {
      stats[layer] = {
        count: features.length,
        properties: features.reduce((acc, feature) => {
          if (feature.properties) {
            Object.entries(feature.properties).forEach(([key, value]) => {
              if (!acc[key]) acc[key] = new Set();
              if (value !== null && value !== undefined) {
                acc[key].add(value.toString());
              }
            });
          }
          return acc;
        }, {})
      };
    });
    setMapStats(stats);
  }, [spatialData]);

  // ------------------------
  // Apply search filter
  // ------------------------
  useEffect(() => {
    if (!searchQuery) {
      setFilteredFeatures({});
      return;
    }

    const filtered = {};
    Object.entries(spatialData).forEach(([layer, features]) => {
      filtered[layer] = features.filter(feature => 
        feature.properties && 
        Object.values(feature.properties).some(value => 
          value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
    setFilteredFeatures(filtered);
  }, [searchQuery, spatialData]);

  // ------------------------
  // Apply property filters
  // ------------------------
  useEffect(() => {
    if (Object.keys(activeFilters).length === 0) {
      setFilteredFeatures({});
      return;
    }

    const filtered = {};
    Object.entries(spatialData).forEach(([layer, features]) => {
      filtered[layer] = features.filter(feature => {
        if (!feature.properties) return false;
        
        return Object.entries(activeFilters).every(([key, values]) => {
          if (!feature.properties[key]) return false;
          return values.includes(feature.properties[key].toString());
        });
      });
    });
    setFilteredFeatures(filtered);
  }, [activeFilters, spatialData]);

  // ------------------------
  // Fetch GeoJSON by bounding box for multiple layers
  // ------------------------
  const fetchGeoByBbox = useCallback(
    debounce(async (layers, bounds, zoomLevel) => {
      if (!layers || layers.size === 0 || !bounds) return;
      
      const token = localStorage.getItem('token');
      if (!token || !checkTokenValidity(token)) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const key = `${Array.from(layers).join('-')}-${bounds.getWest().toFixed(6)}-${bounds.getSouth().toFixed(6)}-${bounds.getEast().toFixed(6)}-${bounds.getNorth().toFixed(6)}-${zoomLevel}`;
      if (lastBoundsKeyRef.current === key) return;
      lastBoundsKeyRef.current = key;

      try {
        setLoading(true);
        setError('');
        setLoadingLayers(prev => new Set([...prev, ...layers]));

        const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
        const newSpatialData = { ...spatialData };

        // Determine simplification factor based on zoom level and quality setting
        let simplify = 0;
        if (simplificationEnabled) {
          simplify = getSimplificationFactor(zoomLevel);
          
          // Adjust based on quality preference
          if (dataQuality === 'high') {
            simplify *= 0.5; // Less simplification for high quality
          } else if (dataQuality === 'performance') {
            simplify *= 2; // More simplification for performance
          }
        }

        for (const layer of layers) {
          try {
            const cacheKey = `${layer}-${bbox}-${simplify}-${zoomLevel}`;
            if (spatialDataCache.current.has(cacheKey)) {
              newSpatialData[layer] = spatialDataCache.current.get(cacheKey);
              continue;
            }

            const url = `${SPATIAL_API_BASE}/geojson/${layer}`;
            const resp = await fetchWithRetry(url, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              params: { 
                bbox, 
                simplify: simplificationEnabled ? simplify : 0
              },
            }, 2, 45000);

            let fc = resp.data || { type: 'FeatureCollection', features: [] };
            let features = Array.isArray(fc.features) ? fc.features : [];
            
            // Apply client-side geometry protection to prevent distortion
            features = preventGeometryDistortion(features, zoomLevel);
            
            newSpatialData[layer] = features;
            spatialDataCache.current.set(cacheKey, features);
          } catch (err) {
            console.error(`Error fetching geojson for ${layer}:`, err);
            newSpatialData[layer] = [];
            
            if (err.response?.status === 401) {
              setError('Authentication failed. Please login again.');
              localStorage.removeItem('token');
              navigate('/login');
              break;
            } else if (err.response?.status === 404) {
              console.warn(`Layer "${layer}" not found on server.`);
            }
          }
        }

        setSpatialData(newSpatialData);
        spatialCache.set(newSpatialData);
        
      } catch (err) {
        console.error('Error fetching geojson by bbox:', err);
        setError('Failed to load features for current view');
      } finally {
        setLoading(false);
        setLoadingLayers(new Set());
      }
    }, 500),
    [SPATIAL_API_BASE, navigate, spatialData, simplificationEnabled, dataQuality, spatialCache]
  );

  // ------------------------
  // Initial full-layer fetch for selected layers
  // ------------------------
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !checkTokenValidity(token)) {
      navigate('/login');
      return;
    }

    setError('');
    setLoading(true);

    (async () => {
      try {
        setLoadingLayers(new Set([...selectedLayers]));
        const newSpatialData = { ...spatialData };

        for (const layer of selectedLayers) {
          try {
            const url = `${SPATIAL_API_BASE}/geojson/${layer}`;
            const resp = await fetchWithRetry(url, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              params: { simplify: 0 }, // No simplification for initial load
            }, 2, 45000);

            const fc = resp.data || { type: 'FeatureCollection', features: [] };
            newSpatialData[layer] = Array.isArray(fc.features) ? fc.features : [];
          } catch (err) {
            console.warn(`Initial fetch failed for ${layer}:`, err);
            newSpatialData[layer] = [];
            
            if (err.response?.status === 401) {
              setError('Authentication failed. Please login again.');
              localStorage.removeItem('token');
              navigate('/login');
              break;
            }
          }
        }

        setSpatialData(newSpatialData);
        spatialCache.set(newSpatialData);
      } catch (err) {
        console.warn('Initial layer fetch failed:', err);
      } finally {
        setLoading(false);
        setLoadingLayers(new Set());
      }
    })();
  }, [selectedLayers, SPATIAL_API_BASE, navigate, spatialCache]);

  // ------------------------
  // Bounds and zoom change handler
  // ------------------------
  const handleMapChange = (bounds, zoomLevel) => {
    setCurrentZoom(zoomLevel);
    
    if (selectedLayers.size > 0 && bounds) {
      // Only refetch if zoom level changes significantly to prevent distortion
      if (Math.abs(zoomLevel - lastZoomRef.current) > 1) {
        lastZoomRef.current = zoomLevel;
        fetchGeoByBbox(selectedLayers, bounds, zoomLevel);
      }
    }
  };

  // ------------------------
  // Handle data quality change
  // ------------------------
  const handleQualityChange = (quality) => {
    setDataQuality(quality);
    // Clear cache and refetch data with new quality settings
    spatialDataCache.current.clear();
    if (selectedLayers.size > 0) {
      lastBoundsKeyRef.current = null;
    }
  };

  // ------------------------
  // Export functionality
  // ------------------------
  const exportData = async (format = 'geojson') => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      const dataToExport = Object.keys(filteredFeatures).length > 0 ? filteredFeatures : spatialData;
      
      if (format === 'geojson') {
        const blob = new Blob([JSON.stringify(dataToExport)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `map-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        let csvContent = 'Layer,Feature Count\n';
        Object.entries(dataToExport).forEach(([layer, features]) => {
          csvContent += `${layer},${features.length}\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `map-stats-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      setExportProgress(100);
    } catch (error) {
      console.error('Export failed:', error);
      setError('Export failed: ' + error.message);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    }
  };

  // ------------------------
  // Filter handlers
  // ------------------------
  const handleFilterChange = (layer, property, value, checked) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (checked) {
        if (!newFilters[property]) newFilters[property] = [];
        newFilters[property].push(value);
      } else {
        if (newFilters[property]) {
          newFilters[property] = newFilters[property].filter(v => v !== value);
          if (newFilters[property].length === 0) {
            delete newFilters[property];
          }
        }
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  // ------------------------
  // Handle layer selection change
  // ------------------------
  const handleLayerToggle = (layerKey) => {
    setSelectedLayers(prev => {
      const newLayers = new Set(prev);
      if (newLayers.has(layerKey)) {
        newLayers.delete(layerKey);
      } else {
        newLayers.add(layerKey);
      }
      return newLayers;
    });
  };

  // ------------------------
  // Handle logout
  // ------------------------
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('spatial-data-cache');
    navigate('/login');
  };

  // ------------------------
  // UI styles
  // ------------------------
  const containerStyle = { display: 'flex', height: '90vh', gap: '16px' };
  const cardStyle = { 
    border: '1px solid #ddd', 
    borderRadius: '8px', 
    padding: '16px', 
    backgroundColor: '#f9f9f9', 
    height: '100%', 
    overflowY: 'auto',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
  };
  const leftStyle = { width: '350px', ...cardStyle };
  const rightStyle = { flex: 1, ...cardStyle, padding: 0 };
  const buttonStyle = { 
    padding: '8px 12px', 
    margin: '4px 0', 
    width: '100%', 
    borderRadius: '4px', 
    border: 'none', 
    color: '#fff', 
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };
  const checkboxStyle = { marginRight: '8px', cursor: 'pointer' };
  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '8px'
  };

  const displayData = Object.keys(filteredFeatures).length > 0 ? filteredFeatures : spatialData;
  const totalFeatures = Object.values(displayData).reduce((sum, features) => sum + features.length, 0);

  return (
    <div style={containerStyle}>
      <div style={leftStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>Layers / Elements</h2>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '6px 12px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Logout
          </button>
        </div>

        {/* Data Quality Settings */}
        <div style={{ marginBottom: '16px', padding: '10px', backgroundColor: '#e8f4f8', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Data Quality</h4>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <button 
              style={{ 
                ...buttonStyle, 
                backgroundColor: dataQuality === 'high' ? '#28a745' : '#6c757d',
                padding: '4px 8px',
                fontSize: '12px'
              }}
              onClick={() => handleQualityChange('high')}
            >
              High Quality
            </button>
            <button 
              style={{ 
                ...buttonStyle, 
                backgroundColor: dataQuality === 'balanced' ? '#007bff' : '#6c757d',
                padding: '4px 8px',
                fontSize: '12px'
              }}
              onClick={() => handleQualityChange('balanced')}
            >
              Balanced
            </button>
            <button 
              style={{ 
                ...buttonStyle, 
                backgroundColor: dataQuality === 'performance' ? '#ffc107' : '#6c757d',
                padding: '4px 8px',
                fontSize: '12px'
              }}
              onClick={() => handleQualityChange('performance')}
            >
              Performance
            </button>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={simplificationEnabled}
              onChange={(e) => setSimplificationEnabled(e.target.checked)}
              style={checkboxStyle}
            />
            Enable Simplification
          </label>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Current Zoom: {Math.round(currentZoom)}x
            {simplificationEnabled && ` | Simplification: ${getSimplificationFactor(currentZoom).toFixed(6)}`}
          </div>
        </div>

        {/* Search Box */}
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={inputStyle}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            Searching {totalFeatures} features across {Object.keys(displayData).length} layers
          </div>
        </div>

        {/* Filter Toggle */}
        <button 
          onClick={() => setShowFilters(!showFilters)}
          style={{ ...buttonStyle, backgroundColor: '#6c757d', marginBottom: '16px' }}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filters Panel */}
        {showFilters && Object.keys(activeFilters).length > 0 && (
          <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Active Filters:</strong>
              <button 
                onClick={clearFilters}
                style={{ padding: '2px 8px', fontSize: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '2px' }}
              >
                Clear All
              </button>
            </div>
            {Object.entries(activeFilters).map(([key, values]) => (
              <div key={key} style={{ fontSize: '12px', marginTop: '4px' }}>
                {key}: {values.join(', ')}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <h4>Select Layers to Display</h4>
          {dataTypes.map(({ key, label }) => (
            <div key={key} style={{ marginBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedLayers.has(key)}
                  onChange={() => handleLayerToggle(key)}
                  style={checkboxStyle}
                />
                <span>{label}</span>
                {loadingLayers.has(key) && <span style={{ marginLeft: '8px', color: '#007bff' }}>⏳</span>}
                {mapStats[key] && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>({mapStats[key].count})</span>}
              </label>
            </div>
          ))}
        </div>

        <div>
          <p><b>Selected Layers:</b> {Array.from(selectedLayers).map(layer => layer.replace(/_/g, ' ')).join(', ')}</p>
          <p><b>Total Features:</b> {totalFeatures}</p>
        </div>

        <div style={{ marginTop: '16px' }}>
          <h4>Legend</h4>
          {Object.entries(layerColors).map(([layer, color]) => (
            <div key={layer} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: color, marginRight: '8px', border: '1px solid #000' }} />
              <span>{layer.replace(/_/g, ' ').toUpperCase()}</span>
              {mapStats[layer] && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>({mapStats[layer].count})</span>}
            </div>
          ))}
        </div>

        {loading && <p>Loading map data...</p>}
        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#ffebee', 
            border: '1px solid #f44336', 
            borderRadius: '4px', 
            margin: '10px 0' 
          }}>
            <p style={{ color: '#d32f2f', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Export Buttons */}
        <div style={{ marginTop: '16px' }}>
          <h4>Export</h4>
          <button 
            style={{ ...buttonStyle, backgroundColor: '#007bff' }} 
            onClick={() => exportData('geojson')}
            disabled={isExporting}
          >
            {isExporting ? `Exporting... ${exportProgress}%` : 'Export GeoJSON'}
          </button>
          <button 
            style={{ ...buttonStyle, backgroundColor: '#28a745' }} 
            onClick={() => exportData('csv')}
            disabled={isExporting}
          >
            Export Statistics CSV
          </button>
        </div>

        <button style={{ ...buttonStyle, backgroundColor: '#28a745' }} onClick={() => setSelectedLayers(new Set(dataTypes.map(dt => dt.key)))}>
          Select All Layers
        </button>
        <button style={{ ...buttonStyle, backgroundColor: '#6c757d' }} onClick={() => setSelectedLayers(new Set())}>
          Clear All Layers
        </button>

        {/* Cache Info */}
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
          <p>Data cached for offline use</p>
          <p>Zoom: {Math.round(currentZoom)}x | Quality: {dataQuality}</p>
        </div>
      </div>

      <div style={rightStyle}>
        <MapComponent
          spatialData={displayData}
          initialCenter={[-6.764538, 39.214464]}
          onMapChange={handleMapChange}
          layerColors={layerColors}
          highlightedFeatures={filteredFeatures}
          currentZoom={currentZoom}
        />
      </div>
    </div>
  );
}

export default MapView;