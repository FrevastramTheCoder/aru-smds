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

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MapComponent from '../components/MapComponent';
import PropTypes from 'prop-types';

/**
 * Displays a map with spatial data for a selected category.
 */
function MapView() {
  const [spatialData, setSpatialData] = useState([]);
  const [selectedType, setSelectedType] = useState('buildings');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const categoryToTypeMap = {
    'buildings': 'buildings',
    'roads': 'roads',
    'footpaths': 'footpaths',
    'vegetation': 'vegetation',
    'parking': 'parking',
    'solid-waste': 'solid_waste',
    'electricity': 'electricity',
    'water-supply': 'water_supply',
    'drainage-system': 'drainage',
    'vimbweta': 'vimbweta',
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
        const response = await axios.get(`/api/spatial/data/${selectedType}`, {
          headers: { Authorization: localStorage.getItem('token') },
        });

        // Corrected: Access the array inside response.data.data
        const spatialArray = response.data.data || [];

        setSpatialData(
          spatialArray.map((item) => ({
            type: selectedType,
            attributes: item.attributes,
            geometry:
              typeof item.geometry === 'string' ? JSON.parse(item.geometry) : item.geometry,
          }))
        );
        setError('');
      } catch (error) {
        console.error('Error fetching spatial data:', error);
        setError('Failed to load spatial data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedType]);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="card">
        <h1 className="card-title">Spatial Data Map</h1>
        {error && <p className="error-message">{error}</p>}
        {loading && <div className="loading-spinner"></div>}
        <div className="map-controls">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="input-field"
          >
            {dataTypes.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <MapComponent spatialData={spatialData} />
      </div>
    </div>
  );
}

export default MapView;
