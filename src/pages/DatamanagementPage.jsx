// src/pages/DatamanagementPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  FeatureGroup,
  useMapEvents,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import shp from "shpjs";
import * as turf from "@turf/turf";
import L from "leaflet";
import "leaflet-snap";
import "leaflet-control-geocoder";
import "../App.css"; // keep your custom styles
import "./customMapStyles.css"; // optional additional styles

const DatamanagementPage = () => {
  const [data, setData] = useState({
    name: "",
    uses: "",
    dimensions: "",
    latitude: "",
    longitude: "",
    geo: "",
    geometry: "",
  });

  const [coordinates, setCoordinates] = useState(null);
  const [shapefileData, setShapefileData] = useState(null);
  const [polygonData, setPolygonData] = useState(null);
  const [markerData, setMarkerData] = useState(null);
  const [allShapes, setAllShapes] = useState([]); 
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("formData"));
    if (savedData) {
      setData(savedData);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };
    setData(newData);
    localStorage.setItem("formData", JSON.stringify(newData));
  };

  const validateForm = () => {
    if (!data.name || !data.latitude || !data.longitude) {
      alert("Name, Latitude, and Longitude are required!");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);

    const lat = parseFloat(data.latitude);
    const lng = parseFloat(data.longitude);

    let geoType = data.geo || "Point";
    let geometry = {
      type: geoType,
      coordinates: [lng, lat],
    };

    if (polygonData) {
      geoType = polygonData.geometry.type;
      geometry = polygonData.geometry;
    }

    const payload = {
      ...data,
      latitude: lat,
      longitude: lng,
      geo: geoType,
      geometry: JSON.stringify(geometry),
    };

    try {
      const response = await DataServers.saveData(payload);

      if (response.status === 200 || response.status === 201) {
        alert("Data saved successfully!");
        localStorage.setItem("formData", JSON.stringify(payload));
      } else {
        alert("Unexpected response: " + response.statusText);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      const errorMessage =
        error.response?.data?.message || "An unknown error occurred.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShapefileUpload = (e) => {
    const files = e.target.files;
    if (files.length === 0) {
      alert("Please select a shapefile zip archive.");
      return;
    }

    const zipFile = Array.from(files).find((file) =>
      file.name.endsWith(".zip")
    );
    if (!zipFile) {
      alert("Please upload a shapefile in .zip format.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;

      try {
        shp(arrayBuffer)
          .then((geojson) => {
            setShapefileData(geojson);
            if (geojson.features.length > 0) {
              const firstFeature = geojson.features[0];
              setPolygonData(firstFeature);
              setData((prevData) => ({
                ...prevData,
                geo: firstFeature.geometry.type,
              }));
            }
          })
          .catch((error) => {
            console.error("Error reading shapefile:", error);
            alert("Failed to parse shapefile.");
          });
      } catch (error) {
        console.error("Error reading shapefile:", error);
        alert("Failed to read shapefile.");
      }
    };

    reader.readAsArrayBuffer(zipFile);
  };

  const handleClear = () => {
    setData({
      name: "",
      uses: "",
      dimensions: "",
      latitude: "",
      longitude: "",
      geo: "",
      geometry: "",
    });
    setCoordinates(null);
    setShapefileData(null);
    setPolygonData(null);
    setMarkerData(null);
    setAllShapes([]); 
    localStorage.removeItem("formData");
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setCoordinates({ lat, lng });
        setMarkerData({ lat, lng });

        setData((prevData) => ({
          ...prevData,
          latitude: lat,
          longitude: lng,
          geo: "Point",
        }));
      },
    });
    return null;
  };

  const handlePolygonDrawn = (e) => {
    const { layer } = e;
    const geoJSON = layer.toGeoJSON();
    const geoType = geoJSON.geometry.type;
    const coordinates = geoJSON.geometry.coordinates;

    let latitude = "";
    let longitude = "";
    if (geoType === "LineString") {
      [longitude, latitude] = coordinates[0];
    } else if (geoType === "Polygon") {
      [longitude, latitude] = coordinates[0][0];
    }

    let dimensions = "";
    if (geoType === "LineString") {
      const lineString = turf.lineString(coordinates);
      dimensions = turf.length(lineString).toFixed(2) + " meters";
    } else if (geoType === "Polygon") {
      const polygon = turf.polygon(coordinates);
      dimensions = turf.area(polygon).toFixed(2) + " square meters";
    }

    setPolygonData(geoJSON);
    setAllShapes((prevShapes) => [...prevShapes, geoJSON]); 
    setData((prevData) => ({
      ...prevData,
      geo: geoType,
      latitude,
      longitude,
      dimensions,
    }));
  };

  const handleSaveLayer = () => {
    if (allShapes.length === 0) {
      alert("No shape or line has been drawn!");
      return;
    }

    const savedGeometry = allShapes.map((shape) => shape.geometry);

    setData((prevData) => ({
      ...prevData,
      geo: "MultiGeometry",
      geometry: JSON.stringify(savedGeometry),
    }));

    alert("All layers saved successfully!");
    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...data,
        geo: "MultiGeometry",
        geometry: JSON.stringify(savedGeometry),
      })
    );
  };

  const handleExportLayer = () => {
    if (allShapes.length === 0) {
      alert("No layers to export!");
      return;
    }

    const geoJsonBlob = new Blob(
      [JSON.stringify({ type: "FeatureCollection", features: allShapes })],
      { type: "application/json" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(geoJsonBlob);
    link.download = `${data.name || "exported_layers"}.geojson`;
    link.click();
  };

  return (
    <div className="flex max-w-7xl mx-auto shadow-2xl h-[600px] mt-4 mb-4 bg-gray-100">
      <div className="w-1/2 px-4 py-4 flex flex-col justify-center items-center bg-white">
        <h1 className="text-xl font-bold mb-4">Data Management</h1>
        <div className="w-full space-y-4">
          {[
            { label: "Uses", name: "uses" },
            { label: "Dimensions", name: "dimensions" },
            { label: "Name", name: "name" },
            { label: "Latitude", name: "latitude" },
            { label: "Longitude", name: "longitude" },
            { label: "Geo", name: "geo" },
          ].map(({ label, name }) => (
            <div key={name} className="flex items-center space-x-2">
              <label className="text-gray-700 text-sm font-medium w-1/4">
                {label}
              </label>
              <input
                type="text"
                name={name}
                value={data[name]}
                onChange={handleChange}
                className="h-7 w-full border rounded-md px-2 py-1 bg-gray-50"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}
          <div className="space-x-2 flex items-center justify-between">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white py-2 px-3 rounded"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleClear}
              className="bg-red-500 text-white py-2 px-3 rounded"
            >
              Clear
            </button>
            <button
              onClick={() => navigate("/datatable")}
              className="bg-blue-500 text-white py-2 px-3 rounded"
            >
              View / Update / Delete / Query
            </button>
            <button
              onClick={handleSaveLayer}
              className="bg-purple-500 text-white py-2 px-3 rounded"
            >
              Save All Layers
            </button>
            <button
              onClick={handleExportLayer}
              className="bg-yellow-500 text-white py-2 px-3 rounded"
            >
              Export All Layers
            </button>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex flex-col" style={{ height: "600px" }}>
        <input type="file" accept=".zip" onChange={handleShapefileUpload} />
        <MapContainer
          center={{ lat: -6.7922, lng: 39.2396 }}
          zoom={coordinates ? 16 : 2}
          style={{ height: "100%", width: "100%" }}
          maxZoom={30}
          minZoom={1}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={30}
                minZoom={1}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Google Satellite">
              <TileLayer
                url="http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}"
                maxZoom={30}
                minZoom={1}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Google Hybrid">
              <TileLayer
                url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
                maxZoom={30}
                minZoom={1}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <MapClickHandler />

          {allShapes.map((shape, index) => (
            <GeoJSON key={index} data={shape} />
          ))}

          {markerData && (
            <Marker position={markerData}>
              <Popup>
                <strong>{data.name || "Captured Location"}</strong>
                <br /> Latitude: {markerData.lat.toFixed(6)}
                <br /> Longitude: {markerData.lng.toFixed(6)}
              </Popup>
            </Marker>
          )}

          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handlePolygonDrawn}
              draw={{
                polygon: true,
                polyline: true,
                rectangle: false,
                circle: false,
              }}
              edit={{
                remove: true,
                snap: true,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>
    </div>
  );
};

export default DatamanagementPage;
