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

// export default MapView;
// MapView.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
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
// MapView Page
// ------------------------
function MapView() {
  const [spatialData, setSpatialData] = useState({});
  const [selectedType, setSelectedType] = useState('buildings');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

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
  };

  // ✅ Always clean base URL (no trailing slash)
  const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const lastBoundsKeyRef = useRef(null);

  // ------------------------
  // Initialize layer from URL query
  // ------------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const type = category ? (categoryToTypeMap[category] || 'buildings') : 'buildings';
    setSelectedType(type);
  }, [location]);

  // ------------------------
  // Fetch GeoJSON by bounding box
  // ------------------------
  const fetchGeoByBbox = useCallback(
    debounce(async (layer, bounds, simplify = 0.0001) => {
      if (!layer || !bounds) return;
      const key = `${layer}-${bounds.getWest().toFixed(6)}-${bounds.getSouth().toFixed(6)}-${bounds.getEast().toFixed(6)}-${bounds.getNorth().toFixed(6)}`;
      if (lastBoundsKeyRef.current === key) return;
      lastBoundsKeyRef.current = key;

      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');

        // ✅ FIX: Correct URL building
        const url = `${API_BASE}/api/spatial/geojson/${layer}`;
        const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;

        const resp = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          params: { bbox, simplify },
          timeout: 30000,
        });

        const fc = resp.data || { type: 'FeatureCollection', features: [] };
        setSpatialData((prev) => ({ ...prev, [layer]: Array.isArray(fc.features) ? fc.features : [] }));
      } catch (err) {
        console.error('Error fetching geojson by bbox:', err);
        setError('Failed to load features for current view');
        setSpatialData((prev) => ({ ...prev, [layer]: [] }));
      } finally {
        setLoading(false);
      }
    }, 350),
    [API_BASE]
  );

  // ------------------------
  // Initial full-layer fetch
  // ------------------------
  useEffect(() => {
    setSpatialData({});
    setError('');
    setLoading(true);

    (async () => {
      try {
        const token = localStorage.getItem('token');

        // ✅ FIX: Correct URL building
        const url = `${API_BASE}/api/spatial/geojson/${selectedType}`;

        const resp = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          params: { simplify: 0.0005 },
          timeout: 30000,
        });

        const fc = resp.data || { type: 'FeatureCollection', features: [] };
        setSpatialData({ [selectedType]: Array.isArray(fc.features) ? fc.features : [] });
      } catch (err) {
        console.warn('Initial whole-layer fetch failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedType, API_BASE]);

  // ------------------------
  // Bounds change handler
  // ------------------------
  const handleBoundsChange = (bounds) => fetchGeoByBbox(selectedType, bounds, 0.00012);

  // ------------------------
  // UI styles
  // ------------------------
  const containerStyle = { display: 'flex', height: '90vh', gap: '16px' };
  const cardStyle = { border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#f9f9f9', height: '100%', overflowY: 'auto' };
  const leftStyle = { width: '300px', ...cardStyle };
  const rightStyle = { flex: 1, ...cardStyle, padding: 0 };
  const buttonStyle = { padding: '8px 12px', margin: '4px 0', width: '100%', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' };

  return (
    <div style={containerStyle}>
      <div style={leftStyle}>
        <h2>Layers / Elements</h2>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '12px' }}>
          {dataTypes.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
        </select>

        <div><p><b>Selected Layer:</b> {selectedType}</p></div>

        <div style={{ marginTop: '16px' }}>
          <h4>Legend</h4>
          {Object.entries(layerColors).map(([layer, color]) => (
            <div key={layer} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: color, marginRight: '8px', border: '1px solid #000' }} />
              <span>{layer.replace(/_/g, ' ').toUpperCase()}</span>
            </div>
          ))}
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button style={buttonStyle} onClick={() => alert('Export functionality here')}>Export Layer</button>
        <button style={{ ...buttonStyle, backgroundColor: '#28a745' }} onClick={() => alert('Other action')}>Other Action</button>
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
