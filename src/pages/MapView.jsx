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

// final
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const INITIAL_CENTER = [-6.9101, 33.9242];
const INITIAL_ZOOM = 14;

function MapComponent({ geojsonData }) {
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    // Initialize map once
    if (!mapRef.current) {
      mapRef.current = L.map("map-container", {
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        layers: [
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
          }),
        ],
      });
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing layer
    if (layerRef.current) {
      layerRef.current.remove();
      layerRef.current = null;
    }

    if (!geojsonData || !geojsonData.features || geojsonData.features.length === 0) {
      // No data - reset view
      map.setView(INITIAL_CENTER, INITIAL_ZOOM);
      return;
    }

    // Styling function per feature geometry type
    const styleFeature = (feature) => {
      switch (feature.geometry.type) {
        case "Polygon":
        case "MultiPolygon":
          return {
            color: "#0077b6",
            weight: 2,
            fillOpacity: 0.3,
          };
        case "LineString":
        case "MultiLineString":
          return {
            color: "#f3722c",
            weight: 3,
            dashArray: "4 6",
          };
        case "Point":
        case "MultiPoint":
          return {}; // style is applied via pointToLayer
        default:
          return {
            color: "#666",
            weight: 1,
          };
      }
    };

    // Create Leaflet GeoJSON layer with pointToLayer for Points and MultiPoints
    layerRef.current = L.geoJSON(geojsonData, {
      style: styleFeature,
      pointToLayer: (feature, latlng) => {
        // Use circle markers for points for better visibility
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: "#023e8a",
          color: "#0077b6",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        });
      },
      onEachFeature: (feature, layer) => {
        // Prepare popup content dynamically
        const props = feature.properties || {};
        const content = Object.entries(props)
          .map(([k, v]) => `<strong>${k}:</strong> ${v}`)
          .join("<br/>");

        layer.bindPopup(content);
        layer.on("mouseover", () => layer.openPopup());
        layer.on("mouseout", () => layer.closePopup());
      },
    }).addTo(map);

    // Fit map bounds to features, fallback to initial center if no valid bounds
    const bounds = layerRef.current.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { maxZoom: 17, padding: [20, 20] });
    } else {
      map.setView(INITIAL_CENTER, INITIAL_ZOOM);
    }
  }, [geojsonData]);

  return (
    <div
      id="map-container"
      style={{ width: "100%", height: "600px", borderRadius: "8px" }}
    />
  );
}

function MapView() {
  const [geojsonData, setGeojsonData] = useState(null);
  const [selectedType, setSelectedType] = useState("buildings");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch spatial data with cancellation support
  useEffect(() => {
    const source = axios.CancelToken.source();

    async function fetchSpatialData() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/spatial/data/${selectedType}`, {
          headers: { Authorization: localStorage.getItem("token") },
          cancelToken: source.token,
          params: {
            page: 1,
            limit: 1000, // fetch more if needed for display
          },
        });

        // Convert API response into GeoJSON FeatureCollection
        const features = (res.data.data || []).map((item) => ({
          type: "Feature",
          geometry:
            typeof item.geometry === "string"
              ? JSON.parse(item.geometry)
              : item.geometry,
          properties: item.attributes || {},
        }));

        setGeojsonData({
          type: "FeatureCollection",
          features,
        });
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.error(err);
          setError("Failed to fetch spatial data");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSpatialData();

    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, [selectedType]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Advanced Spatial Map</h1>

      <div className="mb-4">
        <select
          className="p-2 border rounded"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="buildings">Buildings</option>
          <option value="roads">Roads</option>
          <option value="footpaths">Footpaths</option>
          <option value="vegetation">Vegetation</option>
          <option value="parking">Parking</option>
          <option value="solid_waste">Solid Waste</option>
          <option value="electricity">Electricity</option>
          <option value="water_supply">Water Supply</option>
          <option value="drainage">Drainage</option>
          <option value="vimbweta">Vimbweta</option>
          <option value="security">Security</option>
          <option value="recreational_areas">Recreational Areas</option>
        </select>
      </div>

      {loading && <p>Loading spatial data...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {geojsonData && <MapComponent geojsonData={geojsonData} />}
    </div>
  );
}

export default MapView;
