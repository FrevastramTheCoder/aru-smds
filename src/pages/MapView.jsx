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
// MapView Page
// ------------------------
function MapView() {
  const [spatialData, setSpatialData] = useState({});
  const [selectedType, setSelectedType] = useState('buildings');
  const [selectedLayers, setSelectedLayers] = useState(new Set(['buildings']));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingLayers, setLoadingLayers] = useState(new Set());
  const location = useLocation();
  const navigate = useNavigate();

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
    { key: 'aru_boundary', label: 'ARU Boundary' }
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
    aru_boundary: '#000000' // Black for boundary
  };

  // ✅ Use the correct environment variable for spatial API
  const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');
  const lastBoundsKeyRef = useRef(null);

  // ------------------------
  // Check authentication on component mount
  // ------------------------
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    
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
  }, [navigate]);

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
  // Fetch GeoJSON by bounding box for multiple layers
  // ------------------------
  const fetchGeoByBbox = useCallback(
    debounce(async (layers, bounds, simplify = 0.0001) => {
      if (!layers || layers.size === 0 || !bounds) return;
      
      const token = localStorage.getItem('token');
      if (!token || !checkTokenValidity(token)) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const key = `${Array.from(layers).join('-')}-${bounds.getWest().toFixed(6)}-${bounds.getSouth().toFixed(6)}-${bounds.getEast().toFixed(6)}-${bounds.getNorth().toFixed(6)}`;
      if (lastBoundsKeyRef.current === key) return;
      lastBoundsKeyRef.current = key;

      try {
        setLoading(true);
        setError('');
        
        // Add layers to loading set
        setLoadingLayers(prev => new Set([...prev, ...layers]));

        const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
        const newSpatialData = { ...spatialData };

        // Fetch data for each selected layer
        for (const layer of layers) {
          try {
            const url = `${SPATIAL_API_BASE}/geojson/${layer}`;
            console.log('Requesting spatial data for:', layer, `${url}?bbox=${bbox}&simplify=${simplify}`);

            const resp = await axios.get(url, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              params: { bbox, simplify },
              timeout: 30000,
            });

            const fc = resp.data || { type: 'FeatureCollection', features: [] };
            newSpatialData[layer] = Array.isArray(fc.features) ? fc.features : [];
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
        
      } catch (err) {
        console.error('Error fetching geojson by bbox:', err);
        setError('Failed to load features for current view');
      } finally {
        setLoading(false);
        setLoadingLayers(new Set());
      }
    }, 350),
    [SPATIAL_API_BASE, navigate, spatialData]
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

        // Fetch data for each selected layer
        for (const layer of selectedLayers) {
          try {
            const url = `${SPATIAL_API_BASE}/geojson/${layer}`;
            console.log('Initial fetch for:', layer, url);

            const resp = await axios.get(url, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              params: { simplify: 0.0005 },
              timeout: 30000,
            });

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
      } catch (err) {
        console.warn('Initial layer fetch failed:', err);
      } finally {
        setLoading(false);
        setLoadingLayers(new Set());
      }
    })();
  }, [selectedLayers, SPATIAL_API_BASE, navigate]);

  // ------------------------
  // Bounds change handler
  // ------------------------
  const handleBoundsChange = (bounds) => {
    if (selectedLayers.size > 0) {
      fetchGeoByBbox(selectedLayers, bounds, 0.00012);
    }
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
  // Handle single layer selection
  // ------------------------
  const handleSingleLayerSelect = (layerKey) => {
    setSelectedLayers(new Set([layerKey]));
    setSelectedType(layerKey);
  };

  // ------------------------
  // Handle logout
  // ------------------------
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // ------------------------
  // UI styles
  // ------------------------
  const containerStyle = { display: 'flex', height: '90vh', gap: '16px' };
  const cardStyle = { border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#f9f9f9', height: '100%', overflowY: 'auto' };
  const leftStyle = { width: '300px', ...cardStyle };
  const rightStyle = { flex: 1, ...cardStyle, padding: 0 };
  const buttonStyle = { padding: '8px 12px', margin: '4px 0', width: '100%', borderRadius: '4px', border: 'none', color: '#fff', cursor: 'pointer' };
  const checkboxStyle = { marginRight: '8px', cursor: 'pointer' };

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
              </label>
            </div>
          ))}
        </div>

        <div><p><b>Selected Layers:</b> {Array.from(selectedLayers).map(layer => layer.replace(/_/g, ' ')).join(', ')}</p></div>

        <div style={{ marginTop: '16px' }}>
          <h4>Legend</h4>
          {Object.entries(layerColors).map(([layer, color]) => (
            <div key={layer} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: color, marginRight: '8px', border: '1px solid #000' }} />
              <span>{layer.replace(/_/g, ' ').toUpperCase()}</span>
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

        <button style={{ ...buttonStyle, backgroundColor: '#007bff' }} onClick={() => alert('Export functionality here')}>
          Export Visible Layers
        </button>
        <button style={{ ...buttonStyle, backgroundColor: '#28a745' }} onClick={() => setSelectedLayers(new Set(dataTypes.map(dt => dt.key)))}>
          Select All Layers
        </button>
        <button style={{ ...buttonStyle, backgroundColor: '#6c757d' }} onClick={() => setSelectedLayers(new Set())}>
          Clear All Layers
        </button>
      </div>

      <div style={rightStyle}>
        <MapComponent
          spatialData={spatialData}
          initialCenter={[-6.764538, 39.214464]}
          onBoundsChange={handleBoundsChange}
          layerColors={layerColors}
        />
      </div>
    </div>
  );
}

export default MapView;