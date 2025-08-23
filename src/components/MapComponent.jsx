// import React, { useEffect, useRef } from 'react';
// import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

// export default function MapComponent({ spatialData, initialCenter, onBoundsChange }) {
//   const mapRef = useRef();

//   useEffect(() => {
//     if (!mapRef.current) return;
//     const map = mapRef.current;
//     const handler = () => {
//       if (onBoundsChange) onBoundsChange(map.getBounds());
//     };
//     map.on('moveend', handler);
//     return () => map.off('moveend', handler);
//   }, [onBoundsChange]);

//   const getStyle = (feature) => ({
//     color: '#007bff',
//     weight: 2,
//     fillColor: '#007bff',
//     fillOpacity: 0.3,
//   });

//   return (
//     <MapContainer
//       center={initialCenter}
//       zoom={16}
//       style={{ height: '100%', width: '100%' }}
//       whenCreated={(map) => (mapRef.current = map)}
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       {spatialData.length > 0 && (
//         <GeoJSON data={spatialData} style={getStyle} />
//       )}
//     </MapContainer>
//   );
// }
// // src/components/MapComponent.jsx
// import React, { useEffect } from 'react';
// import { MapContainer, TileLayer, GeoJSON, useMapEvent } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Predefined colors for each layer
// const layerColors = {
//   buildings: '#ff5733',
//   roads: '#2e86de',
//   footpaths: '#28b463',
//   vegetation: '#27ae60',
//   parking: '#f1c40f',
//   solid_waste: '#8e44ad',
//   electricity: '#e67e22',
//   water_supply: '#3498db',
//   drainage: '#16a085',
//   vimbweta: '#d35400',
//   security: '#c0392b',
//   recreational_areas: '#7f8c8d',
// };

// // Component to listen for map bounds change
// function BoundsListener({ onBoundsChange }) {
//   useMapEvent('moveend', (e) => {
//     const map = e.target;
//     if (onBoundsChange) onBoundsChange(map.getBounds());
//   });
//   return null;
// }

// function MapComponent({ spatialData = {}, initialCenter = [-6.764538, 39.214464], onBoundsChange }) {
//   return (
//     <MapContainer
//       center={initialCenter}
//       zoom={16}
//       style={{ width: '100%', height: '100%' }}
//       scrollWheelZoom={true}
//     >
//       {/* Base map */}
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
//       />

//       {/* GeoJSON Layers */}
//       {Object.entries(spatialData).map(([layerName, features]) => {
//         if (!features || !features.length) return null;

//         return (
//           <GeoJSON
//             key={layerName}
//             data={{ type: 'FeatureCollection', features }}
//             style={{
//               color: layerColors[layerName] || '#000000',
//               weight: 2,
//               opacity: 0.7,
//               fillOpacity: 0.3,
//             }}
//             pointToLayer={(feature, latlng) => L.circleMarker(latlng, {
//               radius: 5,
//               fillColor: layerColors[layerName] || '#000000',
//               color: '#000',
//               weight: 1,
//               opacity: 1,
//               fillOpacity: 0.8,
//             })}
//           />
//         );
//       })}

//       {/* Listen for map bounds change */}
//       {onBoundsChange && <BoundsListener onBoundsChange={onBoundsChange} />}
//     </MapContainer>
//   );
// }

// // export default MapComponent;
// // src/components/MapComponent.jsx
// import React, { useEffect } from 'react';
// import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// function MapEvents({ onBoundsChange }) {
//   useMapEvents({
//     moveend: (e) => {
//       const map = e.target;
//       onBoundsChange(map.getBounds());
//     },
//     zoomend: (e) => {
//       const map = e.target;
//       onBoundsChange(map.getBounds());
//     },
//   });
//   return null;
// }

// export default function MapComponent({ spatialData, initialCenter, onBoundsChange, layerColors }) {
//   return (
//     <MapContainer center={initialCenter} zoom={16} style={{ width: '100%', height: '100%' }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <MapEvents onBoundsChange={onBoundsChange} />

//       {Object.entries(spatialData).map(([layer, features]) => (
//         <GeoJSON
//           key={layer}
//           data={{ type: 'FeatureCollection', features }}
//           style={() => ({ color: layerColors[layer] || '#000', weight: 2, fillOpacity: 0.4 })}
//           pointToLayer={(feature, latlng) => L.circleMarker(latlng, { radius: 5, fillColor: layerColors[layer] || '#000', color: '#000', weight: 1, fillOpacity: 0.8 })}
//         />
//       ))}
//     </MapContainer>
//   );
// }

import React from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ------------------------
// Map events handler
// ------------------------
function MapEvents({ onBoundsChange }) {
  useMapEvents({
    moveend: (e) => onBoundsChange(e.target.getBounds()),
    zoomend: (e) => onBoundsChange(e.target.getBounds()),
  });
  return null;
}

// ------------------------
// MapComponent
// ------------------------
export default function MapComponent({ spatialData, initialCenter, onBoundsChange, layerColors }) {
  return (
    <MapContainer center={initialCenter} zoom={16} style={{ width: '100%', height: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents onBoundsChange={onBoundsChange} />

      {Object.entries(spatialData).map(([layer, features]) => (
        <GeoJSON
          key={layer}
          data={{ type: 'FeatureCollection', features }}
          style={() => ({
            color: layerColors?.[layer] || '#000',
            weight: 2,
            fillOpacity: 0.4,
          })}
          pointToLayer={(feature, latlng) =>
            L.circleMarker(latlng, {
              radius: 5,
              fillColor: layerColors?.[layer] || '#000',
              color: '#000',
              weight: 1,
              fillOpacity: 0.8,
            })
          }
          onEachFeature={(feature, layerInstance) => {
            if (feature.properties) {
              const popupContent = Object.entries(feature.properties)
                .map(([k, v]) => `<b>${k}:</b> ${v}`)
                .join('<br>');
              layerInstance.bindPopup(popupContent);
            }
          }}
        />
      ))}
    </MapContainer>
  );
}
