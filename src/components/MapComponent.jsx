
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
//   const geoJsonLayerRef = useRef(null); // Keep track of the current GeoJSON layer

//   useEffect(() => {
//     if (mapRef.current && !mapInstanceRef.current) {
//       // Initialize map at given starting position and zoom
//       mapInstanceRef.current = L.map(mapRef.current, {
//         center: [-6.764538, 39.214464],  // <-- Set starting position here
//         zoom: 13,
//         maxBounds: [[-90, -180], [90, 180]],
//         maxBoundsViscosity: 1.0,
//       });

//       // Add OpenStreetMap tile layer
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//       }).addTo(mapInstanceRef.current);
//     }

//     const map = mapInstanceRef.current;

//     // Remove old GeoJSON layer if exists to prevent duplicates
//     if (geoJsonLayerRef.current) {
//       geoJsonLayerRef.current.remove();
//       geoJsonLayerRef.current = null;
//     }

//     if (map && spatialData && spatialData.length > 0) {
//       // Prepare GeoJSON features array
//       // spatialData is expected as array of objects: { type, attributes, geometry }
//       const features = spatialData.map((item) => ({
//         type: 'Feature',
//         properties: item.attributes || {},
//         geometry: item.geometry,
//       }));

//       geoJsonLayerRef.current = L.geoJSON(features, {
//         onEachFeature: (feature, layer) => {
//           if (feature.properties) {
//             const popupContent = Object.entries(feature.properties)
//               .map(([key, value]) => `<b>${key}</b>: ${value}`)
//               .join('<br>');
//             layer.bindPopup(popupContent);
//           }
//         },
//       }).addTo(map);

//       // Fit map bounds to the GeoJSON layer if bounds are valid
//       const bounds = geoJsonLayerRef.current.getBounds();
//       if (bounds.isValid()) {
//         map.fitBounds(bounds);
//       }
//     }
//   }, [spatialData]);

//   return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
// }

// export default MapComponent;

// //advanced codes
// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// function MapComponent({ spatialData, initialCenter = [-6.764538, 39.214464] }) {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const geoJsonLayerRef = useRef(null);

//   useEffect(() => {
//     if (mapRef.current && !mapInstanceRef.current) {
//       mapInstanceRef.current = L.map(mapRef.current, {
//         center: initialCenter,
//         zoom: 13,
//         maxBounds: [
//           [-90, -180],
//           [90, 180],
//         ],
//         maxBoundsViscosity: 1.0,
//       });

//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//       }).addTo(mapInstanceRef.current);
//     }

//     const map = mapInstanceRef.current;

//     // Remove old layer
//     if (geoJsonLayerRef.current) {
//       geoJsonLayerRef.current.remove();
//       geoJsonLayerRef.current = null;
//     }

//     if (map && spatialData.length > 0) {
//       const features = spatialData.map((item) => ({
//         type: 'Feature',
//         properties: item.attributes || {},
//         geometry: item.geometry,
//       }));

//       geoJsonLayerRef.current = L.geoJSON(features, {
//         onEachFeature: (feature, layer) => {
//           if (feature.properties) {
//             const popupContent = Object.entries(feature.properties)
//               .map(([key, value]) => `<b>${key}</b>: ${value}`)
//               .join('<br>');
//             layer.bindPopup(popupContent);
//           }
//         },
//       }).addTo(map);

//       const bounds = geoJsonLayerRef.current.getBounds();
//       if (bounds.isValid()) {
//         map.fitBounds(bounds);
//       }
//     }
//   }, [spatialData, initialCenter]);

//   return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
// }

// export default MapComponent;

//MORNING
// src/components/MapComponent.jsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * MapComponent
 * - spatialData: array of { type, attributes, geometry }
 * - initialCenter: [lat, lng] (default set to requested start)
 */
function MapComponent({ spatialData = [], initialCenter = [-6.764538, 39.214464] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);

  useEffect(() => {
    // initialize map once
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: initialCenter,
        zoom: 13,
        maxBounds: [
          [-90, -180],
          [90, 180],
        ],
        maxBoundsViscosity: 1.0,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // remove previous geojson layer to avoid duplicates
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.remove();
      geoJsonLayerRef.current = null;
    }

    // Guard: spatialData may be empty
    if (!map || !Array.isArray(spatialData) || spatialData.length === 0) {
      return;
    }

    // Build GeoJSON features from spatialData array
    const features = spatialData
      .filter((item) => item && item.geometry && item.geometry.type)
      .map((item) => {
        // item.geometry is expected to be a GeoJSON geometry object (not string)
        return {
          type: 'Feature',
          properties: item.attributes || {},
          geometry: item.geometry,
        };
      });

    if (!features.length) return;

    try {
      geoJsonLayerRef.current = L.geoJSON(features, {
        onEachFeature: (feature, layer) => {
          const props = feature.properties || {};
          const popupContent = Object.entries(props)
            .map(([k, v]) => `<b>${k}</b>: ${v}`)
            .join('<br>');
          if (popupContent) layer.bindPopup(popupContent);
        },
        // you can style polygons/lines/points differently by checking feature.geometry.type
        pointToLayer: (feature, latlng) => {
          // default marker for Points (customize if needed)
          return L.circleMarker(latlng, { radius: 6, fillOpacity: 0.9 });
        },
      }).addTo(map);

      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds && bounds.isValid && bounds.isValid()) {
        map.fitBounds(bounds, { maxZoom: 18, padding: [20, 20] });
      } else {
        // no valid bounds -> keep initial center/zoom
        map.setView(initialCenter, 13);
      }
    } catch (err) {
      console.error('Error adding GeoJSON to map:', err);
    }
  }, [spatialData, initialCenter]);

  // cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
}

export default MapComponent;
