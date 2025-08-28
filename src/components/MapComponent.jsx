
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