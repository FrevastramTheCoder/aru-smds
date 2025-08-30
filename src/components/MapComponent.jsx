
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
// src/components/MapComponent.jsx
import React from "react";
import { MapContainer, TileLayer, GeoJSON, useMapEvents, LayersControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const { BaseLayer, Overlay } = LayersControl;

function MapEvents({ onBoundsChange }) {
  useMapEvents({
    moveend: (e) => onBoundsChange(e.target.getBounds()),
    zoomend: (e) => onBoundsChange(e.target.getBounds()),
  });
  return null;
}

export default function MapComponent({ spatialData, initialCenter, onBoundsChange, layerColors }) {
  const OPENWEATHER_API_KEY = "YOUR_API_KEY"; // Replace with free API key from openweathermap.org

  return (
    <MapContainer center={initialCenter} zoom={16} style={{ width: "100%", height: "100%" }}>
      <LayersControl position="topright">
        {/* --- Base Layers --- */}
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        </BaseLayer>

        <BaseLayer name="Carto Light">
          <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; <a href='https://www.carto.com/'>CARTO</a>" />
        </BaseLayer>

        <BaseLayer name="Esri World Imagery">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="Tiles © Esri" />
        </BaseLayer>

        <BaseLayer name="Google Satellite">
          <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" attribution="© Google" />
        </BaseLayer>

        <BaseLayer name="Google Hybrid">
          <TileLayer url="https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" attribution="© Google" />
        </BaseLayer>

        <BaseLayer name="NASA GIBS (MODIS True Color)">
          <TileLayer
            url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2023-01-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
            attribution="Imagery © NASA EOSDIS GIBS"
          />
        </BaseLayer>

        {/* --- Weather Overlays --- */}
        <Overlay name="Weather - Clouds">
          <TileLayer
            url={`https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
            attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
            opacity={0.6}
          />
        </Overlay>

        <Overlay name="Weather - Precipitation">
          <TileLayer
            url={`https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
            attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
            opacity={0.6}
          />
        </Overlay>

        <Overlay name="Weather - Temperature">
          <TileLayer
            url={`https://tile.openweathermap.org/map/temp/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
            attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
            opacity={0.6}
          />
        </Overlay>

        <Overlay name="Weather - Wind">
          <TileLayer
            url={`https://tile.openweathermap.org/map/wind/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
            attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
            opacity={0.6}
          />
        </Overlay>

        {/* --- Vector Overlay Layers --- */}
        {Object.entries(spatialData).map(([layer, features]) => (
          <Overlay checked key={layer} name={layer}>
            <GeoJSON
              data={{ type: "FeatureCollection", features }}
              style={() => ({
                color: layerColors?.[layer] || "#000",
                weight: 2,
                fillOpacity: 0.4,
              })}
              pointToLayer={(feature, latlng) =>
                L.circleMarker(latlng, {
                  radius: 5,
                  fillColor: layerColors?.[layer] || "#000",
                  color: "#000",
                  weight: 1,
                  fillOpacity: 0.8,
                })
              }
              onEachFeature={(feature, layerInstance) => {
                if (feature.properties) {
                  const popupContent = Object.entries(feature.properties)
                    .map(([k, v]) => `<b>${k}:</b> ${v}`)
                    .join("<br>");
                  layerInstance.bindPopup(popupContent);
                }
              }}
            />
          </Overlay>
        ))}
      </LayersControl>

      <MapEvents onBoundsChange={onBoundsChange} />
    </MapContainer>
  );
}
