
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Renders a Leaflet map with spatial data.
 * @param {Object} props - Component props.
 * @param {Array} props.spatialData - Array of spatial data objects with type, attributes, and geometry.
 */
function MapComponent({ spatialData }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [0, 0],
        zoom: 2,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapInstanceRef.current);
    }

    // Add spatial data to map
    if (spatialData && spatialData.length > 0) {
      const geoJsonLayer = L.geoJSON(spatialData, {
        onEachFeature: (feature, layer) => {
          if (feature.attributes) {
            const popupContent = Object.entries(feature.attributes)
              .map(([key, value]) => `<b>${key}</b>: ${value}`)
              .join('<br>');
            layer.bindPopup(popupContent);
          }
        },
      }).addTo(mapInstanceRef.current);

      // Fit map to bounds of GeoJSON data
      mapInstanceRef.current.fitBounds(geoJsonLayer.getBounds());
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [spatialData]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
}

export default MapComponent;