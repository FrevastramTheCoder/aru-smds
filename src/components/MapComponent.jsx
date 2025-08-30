
// import React from 'react';
// import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // ------------------------
// // Map events handler
// // ------------------------
// function MapEvents({ onBoundsChange }) {
//   useMapEvents({
//     moveend: (e) => onBoundsChange(e.target.getBounds()),
//     zoomend: (e) => onBoundsChange(e.target.getBounds()),
//   });
//   return null;
// }

// // ------------------------
// // MapComponent
// // ------------------------
// export default function MapComponent({ spatialData, initialCenter, onBoundsChange, layerColors }) {
//   return (
//     <MapContainer center={initialCenter} zoom={16} style={{ width: '100%', height: '100%' }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <MapEvents onBoundsChange={onBoundsChange} />

//       {Object.entries(spatialData).map(([layer, features]) => (
//         <GeoJSON
//           key={layer}
//           data={{ type: 'FeatureCollection', features }}
//           style={() => ({
//             color: layerColors?.[layer] || '#000',
//             weight: 2,
//             fillOpacity: 0.4,
//           })}
//           pointToLayer={(feature, latlng) =>
//             L.circleMarker(latlng, {
//               radius: 5,
//               fillColor: layerColors?.[layer] || '#000',
//               color: '#000',
//               weight: 1,
//               fillOpacity: 0.8,
//             })
//           }
//           onEachFeature={(feature, layerInstance) => {
//             if (feature.properties) {
//               const popupContent = Object.entries(feature.properties)
//                 .map(([k, v]) => `<b>${k}:</b> ${v}`)
//                 .join('<br>');
//               layerInstance.bindPopup(popupContent);
//             }
//           }}
//         />
//       ))}
//     </MapContainer>
//   );
// // }
// import React from "react";
// import {
//   MapContainer,
//   TileLayer,
//   GeoJSON,
//   useMapEvents,
//   LayersControl,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const { BaseLayer, Overlay } = LayersControl;

// // ------------------------
// // Map events handler
// // ------------------------
// function MapEvents({ onBoundsChange }) {
//   useMapEvents({
//     moveend: (e) => onBoundsChange(e.target.getBounds()),
//     zoomend: (e) => onBoundsChange(e.target.getBounds()),
//   });
//   return null;
// }

// // ------------------------
// // MapComponent
// // ------------------------
// export default function MapComponent({
//   spatialData,
//   initialCenter,
//   onBoundsChange,
//   layerColors,
// }) {
//   const OPENWEATHER_API_KEY = "YOUR_API_KEY"; // <-- replace with free API key from openweathermap.org

//   return (
//     <MapContainer
//       center={initialCenter}
//       zoom={16}
//       style={{ width: "100%", height: "100%" }}
//     >
//       <LayersControl position="topright">
//         {/* --- Base Layers --- */}
//         <BaseLayer checked name="OpenStreetMap">
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution="&copy; OpenStreetMap contributors"
//           />
//         </BaseLayer>

//         <BaseLayer name="Carto Light">
//           <TileLayer
//             url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
//             attribution="&copy; <a href='https://www.carto.com/'>CARTO</a>"
//           />
//         </BaseLayer>

//         <BaseLayer name="Esri World Imagery">
//           <TileLayer
//             url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//             attribution="Tiles © Esri"
//           />
//         </BaseLayer>

//         <BaseLayer name="Google Satellite">
//           <TileLayer
//             url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
//             attribution="© Google"
//           />
//         </BaseLayer>

//         <BaseLayer name="Google Hybrid">
//           <TileLayer
//             url="https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
//             attribution="© Google"
//           />
//         </BaseLayer>

//         <BaseLayer name="NASA GIBS (MODIS True Color)">
//           <TileLayer
//             url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2023-01-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
//             attribution="Imagery © NASA EOSDIS GIBS"
//           />
//         </BaseLayer>

//         {/* --- Weather Overlays --- */}
//         <Overlay name="Weather - Clouds">
//           <TileLayer
//             url={`https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
//             attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
//             opacity={0.6}
//           />
//         </Overlay>

//         <Overlay name="Weather - Precipitation">
//           <TileLayer
//             url={`https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
//             attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
//             opacity={0.6}
//           />
//         </Overlay>

//         <Overlay name="Weather - Temperature">
//           <TileLayer
//             url={`https://tile.openweathermap.org/map/temp/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
//             attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
//             opacity={0.6}
//           />
//         </Overlay>

//         <Overlay name="Weather - Wind">
//           <TileLayer
//             url={`https://tile.openweathermap.org/map/wind/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
//             attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
//             opacity={0.6}
//           />
//         </Overlay>

//         {/* --- Vector Overlay Layers (spatialData) --- */}
//         {Object.entries(spatialData).map(([layer, features]) => (
//           <Overlay checked key={layer} name={layer}>
//             <GeoJSON
//               data={{ type: "FeatureCollection", features }}
//               style={() => ({
//                 color: layerColors?.[layer] || "#000",
//                 weight: 2,
//                 fillOpacity: 0.4,
//               })}
//               pointToLayer={(feature, latlng) =>
//                 L.circleMarker(latlng, {
//                   radius: 5,
//                   fillColor: layerColors?.[layer] || "#000",
//                   color: "#000",
//                   weight: 1,
//                   fillOpacity: 0.8,
//                 })
//               }
//               onEachFeature={(feature, layerInstance) => {
//                 if (feature.properties) {
//                   const popupContent = Object.entries(feature.properties)
//                     .map(([k, v]) => `<b>${k}:</b> ${v}`)
//                     .join("<br>");
//                   layerInstance.bindPopup(popupContent);
//                 }
//               }}
//             />
//           </Overlay>
//         ))}
//       </LayersControl>

//       <MapEvents onBoundsChange={onBoundsChange} />
//     </MapContainer>
//   );
// }
import React, { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMapEvents,
  LayersControl,
  ScaleControl,
  ZoomControl,
  Marker,
  Popup
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for highlighted features
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// ------------------------
// Map events handler
// ------------------------
function MapEvents({ onBoundsChange, onMapClick }) {
  useMapEvents({
    moveend: (e) => onBoundsChange && onBoundsChange(e.target.getBounds()),
    zoomend: (e) => onBoundsChange && onBoundsChange(e.target.getBounds()),
    click: (e) => onMapClick && onMapClick(e.latlng),
  });
  return null;
}

// ------------------------
// MapComponent
// ------------------------
export default function MapComponent({
  spatialData,
  initialCenter,
  onBoundsChange,
  layerColors,
  searchQuery = "",
  onMapClick,
  isLoading = false,
}) {
  const OPENWEATHER_API_KEY = "YOUR_API_KEY";
  const [currentBaseLayer, setCurrentBaseLayer] = useState("OpenStreetMap");
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef();

  // Filter features based on search query
  const filterFeatures = (features) => {
    if (!searchQuery || !features) return features;
    
    return features.filter(feature => 
      feature.properties && 
      Object.values(feature.properties).some(value => 
        value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  // Handle map click
  const handleMapClick = (latlng) => {
    if (onMapClick) {
      onMapClick(latlng);
    }
  };

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 16);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  // Custom style function for GeoJSON features
  const styleFeature = (feature, layer) => {
    const layerKey = Object.keys(spatialData).find(key => 
      spatialData[key] && spatialData[key].features && spatialData[key].features.includes(feature)
    );
    
    const baseStyle = {
      color: layerColors?.[layerKey] || "#000",
      weight: 2,
      opacity: 0.7,
      fillOpacity: 0.5
    };

    // Highlight features that match search query
    if (searchQuery && feature.properties) {
      const matchesSearch = Object.values(feature.properties).some(value => 
        value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchesSearch) {
        return {
          ...baseStyle,
          color: "#ff0000",
          weight: 4,
          opacity: 1,
          fillOpacity: 0.7
        };
      }
    }

    return baseStyle;
  };

  return (
    <MapContainer
      center={initialCenter}
      zoom={16}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      ref={mapRef}
    >
      <LayersControl position="topright">
        {/* Base Layers */}
        <LayersControl.BaseLayer 
          checked 
          name="OpenStreetMap"
          onAdd={() => setCurrentBaseLayer("OpenStreetMap")}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer 
          name="Carto Light"
          onAdd={() => setCurrentBaseLayer("Carto Light")}
        >
          <TileLayer
            url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.carto.com/">CARTO</a>'
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer 
          name="Esri World Imagery"
          onAdd={() => setCurrentBaseLayer("Esri World Imagery")}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles © Esri"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer 
          name="Google Satellite"
          onAdd={() => setCurrentBaseLayer("Google Satellite")}
        >
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            attribution="© Google"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer 
          name="Google Hybrid"
          onAdd={() => setCurrentBaseLayer("Google Hybrid")}
        >
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
            attribution="© Google"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer 
          name="NASA GIBS"
          onAdd={() => setCurrentBaseLayer("NASA GIBS")}
        >
          <TileLayer
            url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2023-01-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
            attribution="Imagery © NASA EOSDIS GIBS"
          />
        </LayersControl.BaseLayer>

        {/* Weather Overlays */}
        <LayersControl.Overlay name="Weather - Clouds">
          <TileLayer
            url={`https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
            attribution='&copy; <a href="极狐 prompt 已截断，是否继续？](https://openweathermap.org/">OpenWeather</a>'
            opacity={0.6}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Weather - Precipitation">
          <TileLayer
            url={`https://tile.openweathermap.org/map/precipitation/{极狐 prompt 已截断，是否继续？](z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
            attribution='&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
            opacity={0.6}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Weather - Temperature">
          <TileLayer
            url={`https://tile.openweathermap.org/map/temp/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
            attribution='&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
            opacity={0.6}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Weather - Wind">
          <TileLayer
            url={`https://tile.openweathermap.org/map/wind/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
            attribution='&copy; <a href="https://openweathermap.org/">极狐 prompt 已截断，是否继续？](OpenWeather</a>'
            opacity={0.6}
          />
        </LayersControl.Overlay>

        {/* Vector Overlay Layers */}
        {Object.entries(spatialData).map(([layer, data]) => {
          if (!data || !data.features) return null;
          
          const filteredFeatures = filterFeatures(data.features);
          
          return (
            <LayersControl.Overlay key={layer} name={layer} checked>
              <GeoJSON
                data={{ type: "FeatureCollection", features: filteredFeatures }}
                style={(feature) => styleFeature(feature, layer)}
                pointToLayer={(feature, latlng) => {
                  return L.marker(latlng, {
                    icon: createCustomIcon(layerColors?.[layer] || "#000")
                  });
                }}
                onEachFeature={(feature, layerInstance) => {
                  if (feature.properties) {
                    const popupContent = Object.entries(feature.properties)
                      .map(([k, v]) => `<b>${k}:</b> ${v}`)
                      .join("<br>");
                    layerInstance.bindPopup(popupContent);
                  }
                  
                  layerInstance.on('mouseover', function () {
                    this.setStyle({
                      weight: 5,
                      opacity: 1,
                      fill极狐 prompt 已截断，是否继续？](Opacity: 0.7
                    });
                  });
                  
                  layerInstance.on('mouseout', function () {
                    this.setStyle(styleFeature(feature, layer));
                  });
                }}
              />
            </LayersControl.Overlay>
          );
        })}
      </LayersControl>

      {/* Show user location if available */}
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {/* Map controls */}
      <ZoomControl position="bottomright" />
      <ScaleControl position="bottomleft" imperial={false} />
      
      {/* Map events handler */}
      <MapEvents onBoundsChange={onBoundsChange} onMapClick={handleMapClick} />
      
      {/* Loading indicator */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '8px 16px',
          borderRadius: '4px',
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,极狐 prompt 已截断，是否继续？](0,0.2)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '极狐 prompt 已截断，是否继续？](16px',
            height: '16px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px'
          }}></div>
          Loading map data...
        </div>
      )}

      {/* Custom CSS for animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .custom-marker {
            background: transparent;
            border: none;
          }
          
          .leaflet-popup-content {
            margin: 12px 15px;
            line-height: 1.4;
          }
          
          .leaflet-popup-content-wrapper {
            border-radius: 6px;
          }
        `}
      </style>
    </MapContainer>
  );
}