
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
// // src/components/MapComponent.jsx
// import React from "react";
// import { MapContainer, TileLayer, GeoJSON, useMapEvents, LayersControl } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const { BaseLayer, Overlay } = LayersControl;

// function MapEvents({ onBoundsChange }) {
//   useMapEvents({
//     moveend: (e) => onBoundsChange(e.target.getBounds()),
//     zoomend: (e) => onBoundsChange(e.target.getBounds()),
//   });
//   return null;
// }

// export default function MapComponent({ spatialData, initialCenter, onBoundsChange, layerColors }) {
//   const OPENWEATHER_API_KEY = "YOUR_API_KEY"; // Replace with free API key from openweathermap.org

//   return (
//     <MapContainer center={initialCenter} zoom={16} style={{ width: "100%", height: "100%" }}>
//       <LayersControl position="topright">
//         {/* --- Base Layers --- */}
//         <BaseLayer checked name="OpenStreetMap">
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
//         </BaseLayer>

//         <BaseLayer name="Carto Light">
//           <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; <a href='https://www.carto.com/'>CARTO</a>" />
//         </BaseLayer>

//         <BaseLayer name="Esri World Imagery">
//           <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="Tiles © Esri" />
//         </BaseLayer>

//         <BaseLayer name="Google Satellite">
//           <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" attribution="© Google" />
//         </BaseLayer>

//         <BaseLayer name="Google Hybrid">
//           <TileLayer url="https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" attribution="© Google" />
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

//         {/* --- Vector Overlay Layers --- */}
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
// // }
// import React, { useEffect, useRef } from "react";
// import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents, LayersControl } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Fix for default markers in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Map events handler
// function MapEvents({ onBoundsChange, onFeatureClick }) {
//   const map = useMap();
  
//   useMapEvents({
//     moveend: () => onBoundsChange(map.getBounds()),
//     zoomend: () => onBoundsChange(map.getBounds()),
//     click: (e) => {
//       // Handle map click events if needed
//       onFeatureClick?.(null);
//     },
//   });

//   return null;
// }

// // Map zoom handler for dynamic styling
// function ZoomHandler({ setZoomLevel }) {
//   const map = useMap();
  
//   useEffect(() => {
//     const handleZoom = () => {
//       setZoomLevel(map.getZoom());
//     };
    
//     map.on('zoomend', handleZoom);
//     handleZoom(); // Set initial zoom level
    
//     return () => {
//       map.off('zoomend', handleZoom);
//     };
//   }, [map, setZoomLevel]);
  
//   return null;
// }

// export default function MapComponent({ 
//   spatialData, 
//   initialCenter, 
//   onBoundsChange, 
//   layerColors, 
//   highlightedFeatures,
//   onFeatureClick 
// }) {
//   const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "YOUR_API_KEY";
//   const [zoomLevel, setZoomLevel] = React.useState(16);
//   const highlightedLayerRef = useRef(null);

//   // Style function with zoom-based adjustments
//   const getStyle = (feature, layer, zoom) => {
//     const baseStyle = {
//       color: layerColors?.[layer] || "#000",
//       weight: zoom > 15 ? 3 : zoom > 12 ? 2 : 1,
//       opacity: 0.7,
//       fillOpacity: zoom > 15 ? 0.5 : zoom > 12 ? 0.4 : 0.3,
//     };

//     // Adjust style based on geometry type
//     switch (feature.geometry.type) {
//       case 'Point':
//         return {
//           ...baseStyle,
//           radius: zoom > 15 ? 8 : zoom > 12 ? 6 : 4,
//         };
//       case 'LineString':
//         return {
//           ...baseStyle,
//           weight: zoom > 15 ? 4 : zoom > 12 ? 3 : 2,
//         };
//       case 'Polygon':
//         return {
//           ...baseStyle,
//           fillOpacity: zoom > 15 ? 0.6 : zoom > 12 ? 0.5 : 0.4,
//         };
//       default:
//         return baseStyle;
//     }
//   };

//   // Handle feature highlighting
//   useEffect(() => {
//     if (highlightedLayerRef.current && highlightedFeatures) {
//       // Reset previous highlights
//       highlightedLayerRef.current.eachLayer(layer => {
//         layer.setStyle({
//           weight: zoomLevel > 15 ? 3 : zoomLevel > 12 ? 2 : 1,
//           opacity: 0.7,
//           fillOpacity: zoomLevel > 15 ? 0.6 : zoomLevel > 12 ? 0.5 : 0.4,
//         });
//       });

//       // Apply highlight to selected features
//       Object.entries(highlightedFeatures).forEach(([layer, features]) => {
//         if (spatialData[layer]) {
//           const highlightedIds = new Set(features.map(f => f.id || JSON.stringify(f.geometry)));
//           highlightedLayerRef.current.eachLayer(l => {
//             const featureId = l.feature.id || JSON.stringify(l.feature.geometry);
//             if (highlightedIds.has(featureId)) {
//               l.setStyle({
//                 color: '#ff0000',
//                 weight: 4,
//                 opacity: 1,
//                 fillOpacity: 0.8,
//               });
//             }
//           });
//         }
//       });
//     }
//   }, [highlightedFeatures, spatialData, zoomLevel]);

//   return (
//     <MapContainer 
//       center={initialCenter} 
//       zoom={16} 
//       style={{ width: "100%", height: "100%" }}
//       maxZoom={20}
//       minZoom={10}
//     >
//       <LayersControl position="topright">
//         {/* Base Layers */}
//         <LayersControl.BaseLayer checked name="OpenStreetMap">
//           <TileLayer 
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
//             attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
//             maxZoom={20}
//           />
//         </LayersControl.BaseLayer>

//         <LayersControl.BaseLayer name="Carto Light">
//           <TileLayer 
//             url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
//             attribution="&copy; <a href='https://www.carto.com/'>CARTO</a>"
//             maxZoom={20}
//           />
//         </LayersControl.BaseLayer>

//         <LayersControl.BaseLayer name="Esri World Imagery">
//           <TileLayer 
//             url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//             attribution="Tiles © Esri"
//             maxZoom={20}
//           />
//         </LayersControl.BaseLayer>

//         <LayersControl.BaseLayer name="Google Satellite">
//           <TileLayer 
//             url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
//             attribution="© Google"
//             maxZoom={20}
//           />
//         </LayersControl.BaseLayer>

//         <LayersControl.BaseLayer name="Google Hybrid">
//           <TileLayer 
//             url="https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
//             attribution="© Google"
//             maxZoom={20}
//           />
//         </LayersControl.BaseLayer>

//         <LayersControl.BaseLayer name="NASA GIBS">
//           <TileLayer
//             url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2023-01-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
//             attribution="Imagery © NASA EOSDIS GIBS"
//             maxZoom={20}
//           />
//         </LayersControl.BaseLayer>

//         {/* Weather Overlays */}
//         <LayersControl.Overlay name="Weather - Clouds">
//           <TileLayer
//             url={`https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
//             attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
//             opacity={0.6}
//             maxZoom={20}
//           />
//         </LayersControl.Overlay>

//         <LayersControl.Overlay name="Weather - Precipitation">
//           <TileLayer
//             url={`https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
//             attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
//             opacity={0.6}
//             maxZoom={20}
//           />
//         </LayersControl.Overlay>

//         <LayersControl.Overlay name="Weather - Temperature">
//           <TileLayer
//             url={`https://tile.openweathermap.org/map/temp/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
//             attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
//             opacity={0.6}
//             maxZoom={20}
//           />
//         </LayersControl.Overlay>

//         <LayersControl.Overlay name="Weather - Wind">
//           <TileLayer
//             url={`https://tile.openweathermap.org/map/wind/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
//             attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
//             opacity={0.6}
//             maxZoom={20}
//           />
//         </LayersControl.Overlay>

//         {/* Vector Overlay Layers */}
//         {Object.entries(spatialData).map(([layer, features]) => (
//           <LayersControl.Overlay checked key={layer} name={layer.replace(/_/g, ' ').toUpperCase()}>
//             <GeoJSON
//               data={{ type: "FeatureCollection", features }}
//               style={(feature) => getStyle(feature, layer, zoomLevel)}
//               pointToLayer={(feature, latlng) => 
//                 L.circleMarker(latlng, {
//                   radius: zoomLevel > 15 ? 8 : zoomLevel > 12 ? 6 : 4,
//                   fillColor: layerColors?.[layer] || "#000",
//                   color: "#000",
//                   weight: 1,
//                   fillOpacity: 0.8,
//                 })
//               }
//               onEachFeature={(feature, layerInstance) => {
//                 if (feature.properties) {
//                   const popupContent = `
//                     <div style="min-width: 200px; max-width: 300px; font-size: 12px;">
//                       <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${layer.replace(/_/g, ' ').toUpperCase()}</h4>
//                       ${Object.entries(feature.properties)
//                         .map(([k, v]) => `<b style="color: #34495e;">${k}:</b> ${v}`)
//                         .join('<br>')}
//                     </div>`;
//                   layerInstance.bindPopup(popupContent);
                  
//                   layerInstance.on({
//                     click: () => {
//                       onFeatureClick?.(feature);
//                       layerInstance.setStyle({
//                         color: '#ff0000',
//                         weight: 4,
//                         opacity: 1,
//                         fillOpacity: 0.8,
//                       });
//                     },
//                     mouseover: () => {
//                       if (!highlightedFeatures?.[layer]?.some(f => 
//                         (f.id && f.id === feature.id) || 
//                         JSON.stringify(f.geometry) === JSON.stringify(feature.geometry)
//                       )) {
//                         layerInstance.setStyle({
//                           weight: zoomLevel > 15 ? 4 : 3,
//                           opacity: 0.9,
//                         });
//                       }
//                     },
//                     mouseout: () => {
//                       if (!highlightedFeatures?.[layer]?.some(f => 
//                         (f.id && f.id === feature.id) || 
//                         JSON.stringify(f.geometry) === JSON.stringify(feature.geometry)
//                       )) {
//                         layerInstance.setStyle(getStyle(feature, layer, zoomLevel));
//                       }
//                     }
//                   });
//                 }
//               }}
//               ref={ref => {
//                 if (ref) highlightedLayerRef.current = ref;
//               }}
//             />
//           </LayersControl.Overlay>
//         ))}
//       </LayersControl>

//       <MapEvents onBoundsChange={onBoundsChange} onFeatureClick={onFeatureClick} />
//       <ZoomHandler setZoomLevel={setZoomLevel} />
//     </MapContainer>
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents, LayersControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map events handler
function MapEvents({ onBoundsChange, onFeatureClick }) {
  const map = useMap();
  
  useMapEvents({
    moveend: () => onBoundsChange(map.getBounds()),
    zoomend: () => onBoundsChange(map.getBounds()),
    click: (e) => {
      onFeatureClick?.(null);
    },
  });

  return null;
}

// Map zoom handler for dynamic styling
function ZoomHandler({ setZoomLevel }) {
  const map = useMap();
  
  useEffect(() => {
    const handleZoom = () => {
      setZoomLevel(map.getZoom());
    };
    
    map.on('zoomend', handleZoom);
    handleZoom(); // Set initial zoom level
    
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map, setZoomLevel]);
  
  return null;
}

export default function MapComponent({ 
  spatialData, 
  initialCenter, 
  onBoundsChange, 
  layerColors, 
  highlightedFeatures,
  onFeatureClick 
}) {
  const [zoomLevel, setZoomLevel] = useState(16);
  const highlightedLayerRef = useRef(null);

  // Style function with zoom-based adjustments
  const getStyle = (feature, layer, zoom) => {
    const baseStyle = {
      color: layerColors?.[layer] || "#000",
      weight: zoom > 17 ? 4 : zoom > 14 ? 3 : 2,
      opacity: 0.7,
      fillOpacity: zoom > 17 ? 0.6 : zoom > 14 ? 0.5 : 0.4,
    };

    switch (feature.geometry.type) {
      case 'Point':
        return {
          ...baseStyle,
          radius: zoom > 17 ? 10 : zoom > 14 ? 8 : 6,
        };
      case 'LineString':
        return {
          ...baseStyle,
          weight: zoom > 17 ? 5 : zoom > 14 ? 4 : 3,
        };
      case 'Polygon':
        return {
          ...baseStyle,
          fillOpacity: zoom > 17 ? 0.7 : zoom > 14 ? 0.6 : 0.5,
        };
      default:
        return baseStyle;
    }
  };

  // Handle feature highlighting
  useEffect(() => {
    if (highlightedLayerRef.current && highlightedFeatures) {
      highlightedLayerRef.current.eachLayer(layer => {
        layer.setStyle({
          weight: zoomLevel > 17 ? 4 : zoomLevel > 14 ? 3 : 2,
          opacity: 0.7,
          fillOpacity: zoomLevel > 17 ? 0.7 : zoomLevel > 14 ? 0.6 : 0.5,
        });
      });

      Object.entries(highlightedFeatures).forEach(([layer, features]) => {
        if (spatialData[layer]) {
          const highlightedIds = new Set(features.map(f => f.properties?.room_id || JSON.stringify(f.geometry)));
          highlightedLayerRef.current.eachLayer(l => {
            const featureId = l.feature.properties?.room_id || JSON.stringify(l.feature.geometry);
            if (highlightedIds.has(featureId)) {
              l.setStyle({
                color: '#ff0000',
                weight: 5,
                opacity: 1,
                fillOpacity: 0.8,
              });
            }
          });
        }
      });
    }
  }, [highlightedFeatures, spatialData, zoomLevel]);

  return (
    <MapContainer 
      center={initialCenter} 
      zoom={16} 
      style={{ width: "100%", height: "100%" }}
      maxZoom={20}
      minZoom={12}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            maxZoom={20}
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Carto Light">
          <TileLayer 
            url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; <a href='https://www.carto.com/'>CARTO</a>"
            maxZoom={20}
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Esri World Imagery">
          <TileLayer 
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles © Esri"
            maxZoom={20}
          />
        </LayersControl.BaseLayer>

        {Object.entries(spatialData).map(([layer, features]) => (
          <LayersControl.Overlay checked key={layer} name={layer.replace(/_/g, ' ').toUpperCase()}>
            <GeoJSON
              data={{ type: "FeatureCollection", features }}
              style={(feature) => getStyle(feature, layer, zoomLevel)}
              pointToLayer={(feature, latlng) => 
                L.circleMarker(latlng, {
                  radius: zoomLevel > 17 ? 10 : zoomLevel > 14 ? 8 : 6,
                  fillColor: layerColors?.[layer] || "#000",
                  color: "#000",
                  weight: 1,
                  fillOpacity: 0.8,
                })
              }
              onEachFeature={(feature, layerInstance) => {
                if (feature.properties) {
                  const popupContent = `
                    <div style="min-width: 200px; max-width: 300px; font-size: 12px;">
                      <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${layer.replace(/_/g, ' ').toUpperCase()}</h4>
                      ${Object.entries(feature.properties)
                        .map(([k, v]) => `<b style="color: #34495e;">${k}:</b> ${v}`)
                        .join('<br>')}
                    </div>`;
                  layerInstance.bindPopup(popupContent);
                  
                  layerInstance.on({
                    click: () => {
                      onFeatureClick?.(feature);
                      layerInstance.setStyle({
                        color: '#ff0000',
                        weight: 5,
                        opacity: 1,
                        fillOpacity: 0.8,
                      });
                    },
                    mouseover: () => {
                      if (!highlightedFeatures?.[layer]?.some(f => 
                        (f.properties?.room_id && f.properties.room_id === feature.properties?.room_id) || 
                        JSON.stringify(f.geometry) === JSON.stringify(feature.geometry)
                      )) {
                        layerInstance.setStyle({
                          weight: zoomLevel > 17 ? 5 : 4,
                          opacity: 0.9,
                        });
                      }
                    },
                    mouseout: () => {
                      if (!highlightedFeatures?.[layer]?.some(f => 
                        (f.properties?.room_id && f.properties.room_id === feature.properties?.room_id) || 
                        JSON.stringify(f.geometry) === JSON.stringify(feature.geometry)
                      )) {
                        layerInstance.setStyle(getStyle(feature, layer, zoomLevel));
                      }
                    }
                  });
                }
              }}
              ref={ref => {
                if (ref) highlightedLayerRef.current = ref;
              }}
            />
          </LayersControl.Overlay>
        ))}
      </LayersControl>

      <MapEvents onBoundsChange={onBoundsChange} onFeatureClick={onFeatureClick} />
      <ZoomHandler setZoomLevel={setZoomLevel} />
    </MapContainer>
  );
}