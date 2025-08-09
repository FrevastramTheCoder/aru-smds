
// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// /**
//  * Renders a Leaflet map with spatial data.
//  * @param {Object} props - Component props.
//  * @param {Array} props.spatialData - Array of spatial data objects with type, attributes, and geometry.
//  */
// function MapComponent({ spatialData }) {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);

//   useEffect(() => {
//     if (mapRef.current && !mapInstanceRef.current) {
//       // Initialize map
//       mapInstanceRef.current = L.map(mapRef.current, {
//         center: [0, 0],
//         zoom: 2,
//         maxBounds: [[-90, -180], [90, 180]],
//         maxBoundsViscosity: 1.0,
//       });

//       // Add OpenStreetMap tile layer
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//       }).addTo(mapInstanceRef.current);
//     }

//     // Add spatial data to map
//     if (spatialData && spatialData.length > 0) {
//       const geoJsonLayer = L.geoJSON(spatialData, {
//         onEachFeature: (feature, layer) => {
//           if (feature.attributes) {
//             const popupContent = Object.entries(feature.attributes)
//               .map(([key, value]) => `<b>${key}</b>: ${value}`)
//               .join('<br>');
//             layer.bindPopup(popupContent);
//           }
//         },
//       }).addTo(mapInstanceRef.current);

//       // Fit map to bounds of GeoJSON data
//       mapInstanceRef.current.fitBounds(geoJsonLayer.getBounds());
//     }

//     // Cleanup on unmount
//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//     };
//   }, [spatialData]);

//   return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
// }

// export default MapComponent;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MapComponent from '../components/MapComponent'; // ✅ Correct relative path

function MapView() {
  const [spatialData, setSpatialData] = useState([]);
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const type = category ? categoryToTypeMap[category] || 'buildings' : 'buildings';
    setSelectedType(type);
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/spatial/data/${selectedType}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = response.data.map((item) => ({
          type: selectedType,
          attributes: item.attributes,
          geometry:
            typeof item.geometry === 'string' ? JSON.parse(item.geometry) : item.geometry,
        }));

        setSpatialData(data);
        setError('');
      } catch (error) {
        console.error('Error fetching spatial data:', error);
        setError('Failed to load spatial data. Please try again.');
        setSpatialData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedType]);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="card">
        <h1 className="card-title mb-4 text-2xl font-bold">Spatial Data Map</h1>
        {error && <p className="error-message text-red-600 mb-4">{error}</p>}
        {loading && <p className="mb-4">Loading spatial data...</p>}

        <div className="map-controls mb-4">
          <label htmlFor="dataTypeSelect" className="block mb-2 font-semibold">
            Select Data Type:
          </label>
          <select
            id="dataTypeSelect"
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
        </div>

        {!loading && !error && spatialData.length > 0 && (
          <MapComponent spatialData={spatialData} />
        )}

        {!loading && !error && spatialData.length === 0 && (
          <p>No spatial data available for the selected type.</p>
        )}
      </div>
    </div>
  );
}

export default MapView;
