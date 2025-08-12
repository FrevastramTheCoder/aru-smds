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
// src/routes/MapView.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MapComponent from '../components/MapComponent';

/**
 * Debounce helper
 */
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function MapView() {
  const [spatialData, setSpatialData] = useState([]); // array of GeoJSON Feature objects
  const [selectedType, setSelectedType] = useState('buildings');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Map of possible category query params -> backend table names
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

  // base API for spatial endpoints. Set VITE_API_URL in your .env (e.g. https://smds.onrender.com/api/spatial)
  const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  // if URL contains ?category=some-key, set appropriate selectedType
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const type = category ? (categoryToTypeMap[category] || 'buildings') : 'buildings';
    setSelectedType(type);
  }, [location]);

  // last known bounds key to avoid duplicate fetches
  const lastBoundsKeyRef = useRef(null);

  // Debounced fetch (to be called on map moveend)
  const fetchGeoByBbox = useCallback(
    debounce(async (layer, bounds, simplify = 0.0001) => {
      if (!layer) return;
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        let url = `${API_BASE}/geojson/${layer}`;
        if (!API_BASE) url = `/api/spatial/geojson/${layer}`; // fallback to relative

        const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;

        const resp = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          params: { bbox, simplify },
          timeout: 30000,
        });

        // resp.data is a FeatureCollection
        const fc = resp.data || { type: 'FeatureCollection', features: [] };
        setSpatialData(Array.isArray(fc.features) ? fc.features : []);
      } catch (err) {
        console.error('Error fetching geojson by bbox:', err);
        setError('Failed to load features for current view');
        setSpatialData([]);
      } finally {
        setLoading(false);
      }
    }, 350),
    [API_BASE]
  );

  // initial fetch for the selected type without bbox (optional). We'll wait a small tick so Map can ask for bounds first.
  useEffect(() => {
    // Clear previous features immediately when switching layer
    setSpatialData([]);
    setError('');
    setLoading(true);

    // try to fetch a small simplified whole-layer as fallback (but not ideal for big tables)
    (async () => {
      try {
        const token = localStorage.getItem('token');
        let url = `${API_BASE}/geojson/${selectedType}`;
        if (!API_BASE) url = `/api/spatial/geojson/${selectedType}`;
        // small simplification so initial load is light
        const resp = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          params: { simplify: 0.0005 },
          timeout: 30000,
        });
        const fc = resp.data || { type: 'FeatureCollection', features: [] };
        setSpatialData(Array.isArray(fc.features) ? fc.features : []);
      } catch (err) {
        console.warn('Initial whole-layer fetch failed (this is okay if you rely on bbox fetch):', err);
        // don't set a hard error here; map bbox fetch will try later
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedType, API_BASE]);

  // called by MapComponent when map has moved / zoomed
  const handleBoundsChange = (bounds) => {
    if (!bounds) return;
    const key = `${bounds.getWest().toFixed(6)},${bounds.getSouth().toFixed(6)},${bounds.getEast().toFixed(6)},${bounds.getNorth().toFixed(6)}`;
    if (lastBoundsKeyRef.current === key) return; // avoid duplicate
    lastBoundsKeyRef.current = key;
    fetchGeoByBbox(selectedType, bounds, 0.00012); // adjust simplify tolerance as needed
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="card">
        <h1 className="card-title">Spatial Data Map</h1>

        {error && <p className="error-message text-red-600">{error}</p>}
        {loading && <div className="loading-spinner">Loading...</div>}

        <div className="map-controls mb-4 flex items-center gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="input-field border p-2 rounded"
          >
            {dataTypes.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <div className="text-sm text-gray-600">Layer: <b>{selectedType}</b></div>
        </div>

        {/* MapComponent expects spatialData as array of GeoJSON Feature objects */}
        <MapComponent
          spatialData={spatialData}
          initialCenter={[-6.764538, 39.214464]}
          onBoundsChange={handleBoundsChange}
        />
      </div>
    </div>
  );
}

export default MapView;
