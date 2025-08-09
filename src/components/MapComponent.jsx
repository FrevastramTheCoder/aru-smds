
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

// MapComponent.jsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapComponent({ spatialData }) {
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [0, 0],
        zoom: 2,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
          }),
        ],
      });
    }

    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.remove();
      geoJsonLayerRef.current = null;
    }

    if (spatialData && spatialData.length > 0) {
      try {
        const features = spatialData.map(({ geometry, attributes }, i) => ({
          type: 'Feature',
          geometry,
          properties: attributes || {},
          id: i,
        }));

        geoJsonLayerRef.current = L.geoJSON(
          {
            type: 'FeatureCollection',
            features,
          },
          {
            style: () => ({
              color: '#3388ff',
              weight: 2,
              opacity: 0.6,
              fillOpacity: 0.2,
            }),
            onEachFeature: (feature, layer) => {
              const props = feature.properties;
              let popupContent = '<table>';
              for (const key in props) {
                popupContent += `<tr><th>${key}</th><td>${props[key]}</td></tr>`;
              }
              popupContent += '</table>';
              layer.bindPopup(popupContent);
            },
          }
        ).addTo(mapRef.current);

        mapRef.current.fitBounds(geoJsonLayerRef.current.getBounds(), {
          padding: [20, 20],
          maxZoom: 16,
          animate: true,
        });
      } catch (e) {
        console.error('Error adding GeoJSON layer:', e);
      }
    }

    return () => {
      if (geoJsonLayerRef.current) {
        geoJsonLayerRef.current.remove();
        geoJsonLayerRef.current = null;
      }
    };
  }, [spatialData]);

  return (
    <div
      id="map"
      style={{ height: '600px', width: '100%' }}
      aria-label="Map showing spatial data"
    />
  );
}

export default MapComponent;
