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
// MapView.js
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
      // Don't retry on 404 - the resource doesn't exist
      if (error.response?.status === 404) {
        console.warn(`Resource not found: ${url}`);
        throw error;
      }
      
      // Handle rate limiting (429)
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 5;
        console.warn(`Rate limited. Retrying after ${retryAfter} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      
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
  const [failedLayers, setFailedLayers] = useState(new Set());
  const [availableEndpoints, setAvailableEndpoints] = useState({});
  const [customColors, setCustomColors] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Cache implementation
  const spatialCache = useLocalStorageCache('spatial-data-cache', 86400000);
  const colorCache = useLocalStorageCache('layer-colors', 86400000 * 30); // 30 days
  const spatialDataCache = useRef(new Map());
  const lastBoundsKeyRef = useRef(null);

  // API configuration
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

  // Default layer colors
  const defaultLayerColors = {
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

  // Get the current color for a layer (custom or default)
  const getLayerColor = (layer) => {
    return customColors[layer] || defaultLayerColors[layer];
  };

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

    // Load custom colors
    const savedColors = colorCache.get();
    if (savedColors) {
      setCustomColors(savedColors);
    }

    // Validate which endpoints are available
    validateEndpoints();
  }, [navigate]);

  // ------------------------
  // Validate API endpoints
  // ------------------------
  const validateEndpoints = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const endpoints = {};
    
    for (const [key, url] of Object.entries(API_ENDPOINTS)) {
      try {
        // Use HEAD request to check if endpoint exists without loading data
        await axios.head(url, {
          headers: { 'Authorization': `Bearer ${token}` },
          timeout: 5000
        });
        endpoints[key] = true;
      } catch (error) {
        endpoints[key] = false;
        console.warn(`Endpoint not available: ${key}`);
      }
    }
    
    setAvailableEndpoints(endpoints);
    localStorage.setItem('availableEndpoints', JSON.stringify(endpoints));
  };

  // ------------------------
  // Initialize layer from URL query
  // ------------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const type = category ? (categoryToTypeMap[category] || 'buildings') : 'buildings';
    
    // Check if the layer is available before selecting it
    const available = availableEndpoints[type] !== false;
    if (available) {
      setSelectedType(type);
      setSelectedLayers(new Set([type]));
    } else {
      setSelectedType('buildings');
      setSelectedLayers(new Set(['buildings']));
    }
  }, [location, availableEndpoints]);

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
        setLoadingLayers(prev => new Set([...prev, ...layers]));

        const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
        const newSpatialData = { ...spatialData };

        for (const layer of layers) {
          // Skip if endpoint is not available
          if (availableEndpoints[layer] === false) {
            console.warn(`Skipping ${layer} - endpoint not available`);
            newSpatialData[layer] = [];
            continue;
          }

          try {
            const cacheKey = `${layer}-${bbox}-${simplify}`;
            if (spatialDataCache.current.has(cacheKey)) {
              newSpatialData[layer] = spatialDataCache.current.get(cacheKey);
              continue;
            }

            const url = API_ENDPOINTS[layer];
            const resp = await fetchWithRetry(url, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              // Use a very small simplify value to preserve shape details
              params: { bbox, simplify: 0.00001 }, // Reduced from 0.0001 to preserve shapes
            }, 2, 30000);

            const fc = resp.data || { type: 'FeatureCollection', features: [] };
            const features = Array.isArray(fc.features) ? fc.features : [];
            
            // Process features to ensure they have proper geometry
            const processedFeatures = features.map(feature => {
              if (feature.geometry && feature.geometry.type === 'Polygon') {
                // Ensure polygons have proper winding order
                return ensurePolygonWindingOrder(feature);
              }
              return feature;
            });
            
            newSpatialData[layer] = processedFeatures;
            spatialDataCache.current.set(cacheKey, processedFeatures);
            
            // Remove from failed layers if previously failed
            setFailedLayers(prev => {
              const newSet = new Set(prev);
              newSet.delete(layer);
              return newSet;
            });
          } catch (err) {
            console.error(`Error fetching geojson for ${layer}:`, err);
            newSpatialData[layer] = [];
            
            // Add to failed layers
            setFailedLayers(prev => new Set([...prev, layer]));
            
            if (err.response?.status === 401) {
              setError('Authentication failed. Please login again.');
              localStorage.removeItem('token');
              navigate('/login');
              break;
            } else if (err.response?.status === 404) {
              // Mark endpoint as unavailable
              setAvailableEndpoints(prev => ({ ...prev, [layer]: false }));
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
    }, 800),
    [navigate, spatialData, availableEndpoints]
  );

  // Helper function to ensure proper polygon winding order
  const ensurePolygonWindingOrder = (feature) => {
    if (!feature.geometry || feature.geometry.type !== 'Polygon') return feature;
    
    try {
      const coordinates = feature.geometry.coordinates;
      // Ensure exterior ring is counter-clockwise
      if (coordinates.length > 0 && coordinates[0].length >= 3) {
        const area = calculatePolygonArea(coordinates[0]);
        if (area > 0) {
          // Positive area means clockwise, so reverse it
          coordinates[0] = coordinates[0].reverse();
        }
      }
      
      // Ensure interior rings (holes) are clockwise
      for (let i = 1; i < coordinates.length; i++) {
        if (coordinates[i].length >= 3) {
          const area = calculatePolygonArea(coordinates[i]);
          if (area < 0) {
            // Negative area means counter-clockwise, so reverse it
            coordinates[i] = coordinates[i].reverse();
          }
        }
      }
      
      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: coordinates
        }
      };
    } catch (error) {
      console.warn('Error processing polygon winding order:', error);
      return feature;
    }
  };

  // Helper function to calculate polygon area (determines winding order)
  const calculatePolygonArea = (coordinates) => {
    let area = 0;
    const n = coordinates.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    
    return area / 2;
  };

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
          // Skip if endpoint is not available
          if (availableEndpoints[layer] === false) {
            console.warn(`Skipping ${layer} - endpoint not available`);
            newSpatialData[layer] = [];
            continue;
          }

          try {
            const url = API_ENDPOINTS[layer];
            const resp = await fetchWithRetry(url, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              // Use a very small simplify value to preserve shape details
              params: { simplify: 0.00001 }, // Reduced from 0.0005 to preserve shapes
            }, 2, 30000);

            const fc = resp.data || { type: 'FeatureCollection', features: [] };
            const features = Array.isArray(fc.features) ? fc.features : [];
            
            // Process features to ensure they have proper geometry
            const processedFeatures = features.map(feature => {
              if (feature.geometry && feature.geometry.type === 'Polygon') {
                // Ensure polygons have proper winding order
                return ensurePolygonWindingOrder(feature);
              }
              return feature;
            });
            
            newSpatialData[layer] = processedFeatures;
            
            // Remove from failed layers if previously failed
            setFailedLayers(prev => {
              const newSet = new Set(prev);
              newSet.delete(layer);
              return newSet;
            });
          } catch (err) {
            console.warn(`Initial fetch failed for ${layer}:`, err);
            newSpatialData[layer] = [];
            
            // Add to failed layers
            setFailedLayers(prev => new Set([...prev, layer]));
            
            if (err.response?.status === 401) {
              setError('Authentication failed. Please login again.');
              localStorage.removeItem('token');
              navigate('/login');
              break;
            } else if (err.response?.status === 404) {
              // Mark endpoint as unavailable
              setAvailableEndpoints(prev => ({ ...prev, [layer]: false }));
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
  }, [selectedLayers, navigate]);

  // ------------------------
  // Export functionality
  // ------------------------
  const exportData = async (format = 'geojson') => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      const dataToExport = Object.keys(filteredFeatures).length > 0 ? filteredFeatures : spatialData;
      const layersToExport = Array.from(selectedLayers);
      
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
        // Simple CSV export implementation
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
  // Bounds change handler
  // ------------------------
  const handleBoundsChange = (bounds) => {
    if (selectedLayers.size > 0) {
      fetchGeoByBbox(selectedLayers, bounds, 0.00001); // Reduced simplify value
    }
  };

  // ------------------------
  // Handle layer selection change
  // ------------------------
  const handleLayerToggle = (layerKey) => {
    // Don't select unavailable layers
    if (availableEndpoints[layerKey] === false) {
      setError(`Layer "${layerKey}" is not available on the server`);
      return;
    }
    
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
    // Don't select unavailable layers
    if (availableEndpoints[layerKey] === false) {
      setError(`Layer "${layerKey}" is not available on the server`);
      return;
    }
    
    setSelectedLayers(new Set([layerKey]));
    setSelectedType(layerKey);
  };

  // ------------------------
  // Handle color change
  // ------------------------
  const handleColorChange = (layer, color) => {
    const newColors = { ...customColors, [layer]: color };
    setCustomColors(newColors);
    colorCache.set(newColors);
    setShowColorPicker(null);
  };

  // ------------------------
  // Reset color to default
  // ------------------------
  const resetColor = (layer) => {
    const newColors = { ...customColors };
    delete newColors[layer];
    setCustomColors(newColors);
    colorCache.set(newColors);
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
  // Retry failed layers
  // ------------------------
  const retryFailedLayers = () => {
    if (failedLayers.size === 0) return;
    
    setSelectedLayers(prev => {
      const newLayers = new Set([...prev, ...failedLayers]);
      return newLayers;
    });
    
    // This will trigger the useEffect that fetches data for selected layers
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

        {/* Error Display */}
        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#ffebee', 
            border: '1px solid #f44336', 
            borderRadius: '4px', 
            marginBottom: '16px' 
          }}>
            <p style={{ color: '#d32f2f', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Failed Layers Alert */}
        {failedLayers.size > 0 && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '4px', 
            marginBottom: '16px' 
          }}>
            <p style={{ color: '#856404', margin: '0 0 10px 0' }}>
              Failed to load: {Array.from(failedLayers).join(', ')}
            </p>
            <button 
              onClick={retryFailedLayers}
              style={{ 
                padding: '4px 8px', 
                backgroundColor: '#ffc107', 
                color: '#000', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Retry Failed Layers
            </button>
          </div>
        )}

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
                  disabled={availableEndpoints[key] === false}
                />
                <span style={{ 
                  color: availableEndpoints[key] === false ? '#999' : 'inherit',
                  textDecoration: availableEndpoints[key] === false ? 'line-through' : 'none'
                }}>
                  {label}
                  {availableEndpoints[key] === false && ' (Not Available)'}
                </span>
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
          {Object.entries(defaultLayerColors).map(([layer, defaultColor]) => (
            <div key={layer} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div 
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: getLayerColor(layer), 
                  marginRight: '8px', 
                  border: '1px solid #000',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(showColorPicker === layer ? null : layer);
                }}
              >
                {showColorPicker === layer && (
                  <div style={{
                    position: 'absolute',
                    top: '25px',
                    left: '0',
                    zIndex: 1000,
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                  }}>
                    <div style={{ fontSize: '12px', marginBottom: '5px' }}>Choose color for {layer}:</div>
                    <input 
                      type="color" 
                      value={getLayerColor(layer)} 
                      onChange={(e) => handleColorChange(layer, e.target.value)}
                      style={{ width: '100%', height: '30px' }}
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        resetColor(layer);
                      }}
                      style={{ 
                        padding: '2px 5px', 
                        fontSize: '10px', 
                        backgroundColor: '#6c757d', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '2px',
                        cursor: 'pointer'
                      }}
                    >
                      Reset to Default
                    </button>
                  </div>
                )}
              </div>
              <span>{layer.replace(/_/g, ' ').toUpperCase()}</span>
              {mapStats[layer] && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>({mapStats[layer].count})</span>}
            </div>
          ))}
        </div>

        {loading && <p>Loading map data...</p>}

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

        <button 
          style={{ ...buttonStyle, backgroundColor: '#28a745' }} 
          onClick={() => {
            const allAvailableLayers = dataTypes
              .filter(dt => availableEndpoints[dt.key] !== false)
              .map(dt => dt.key);
            setSelectedLayers(new Set(allAvailableLayers));
          }}
        >
          Select All Available Layers
        </button>
        <button style={{ ...buttonStyle, backgroundColor: '#6c757d' }} onClick={() => setSelectedLayers(new Set())}>
          Clear All Layers
        </button>

        {/* Cache Info */}
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
          <p>Data cached for offline use</p>
        </div>
      </div>

      <div style={rightStyle}>
        <MapComponent
          spatialData={displayData}
          initialCenter={[-6.764538, 39.214464]}
          onBoundsChange={handleBoundsChange}
          layerColors={Object.fromEntries(
            Object.keys(defaultLayerColors).map(layer => [layer, getLayerColor(layer)])
          )}
          highlightedFeatures={filteredFeatures}
        />
      </div>
    </div>
  );
}

export default MapView;