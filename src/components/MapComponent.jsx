
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

function BoundsListener({ onBoundsChange }) {
  const map = useMap();

  useEffect(() => {
    // Only run when the map is fully initialized
    map.whenReady(() => {
      const updateBounds = () => {
        try {
          const bounds = map.getBounds();
          onBoundsChange(bounds);
        } catch (err) {
          console.warn('Bounds callback skipped due to uninitialized map:', err);
        }
      };

      // Initial invocation, once the map is ready
      updateBounds();

      // Listen for move/end events (panning, zooming)
      map.on('moveend', updateBounds);

      // Clean up the listener when unmounted
      return () => {
        map.off('moveend', updateBounds);
      };
    });
  }, [map, onBoundsChange]);

  return null;
}

export default function MapComponent({ spatialData, initialCenter, onBoundsChange }) {
  return (
    <MapContainer center={initialCenter} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Safely listen for bounds changes once map is ready */}
      <BoundsListener onBoundsChange={onBoundsChange} />

      {/* Render spatial data here, e.g., GeoJSON layers */}
      {/* Example: <GeoJSON data={spatialData} /> */}
    </MapContainer>
  );
}
