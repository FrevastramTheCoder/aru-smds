import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent({ spatialData, initialCenter, onBoundsChange }) {
  const mapRef = useRef();

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const handler = () => {
      if (onBoundsChange) onBoundsChange(map.getBounds());
    };
    map.on('moveend', handler);
    return () => map.off('moveend', handler);
  }, [onBoundsChange]);

  const getStyle = (feature) => ({
    color: '#007bff',
    weight: 2,
    fillColor: '#007bff',
    fillOpacity: 0.3,
  });

  return (
    <MapContainer
      center={initialCenter}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      whenCreated={(map) => (mapRef.current = map)}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {spatialData.length > 0 && (
        <GeoJSON data={spatialData} style={getStyle} />
      )}
    </MapContainer>
  );
}
