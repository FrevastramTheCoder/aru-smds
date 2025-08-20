import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Sample data for universities
const universities = [
  {
    id: 1,
    name: "University of Indonesia",
    province: "West Java",
    city: "Depok",
    activeStudents: 10000,
    totalStudents: 200000,
    coords: [
      [ -6.3, 106.8 ],
      [ -6.31, 106.81 ],
      [ -6.32, 106.79 ],
    ],
    color: "orange",
  },
  {
    id: 2,
    name: "Jakarta State Polytechnic",
    province: "DKI Jakarta",
    city: "Jakarta",
    activeStudents: 5000,
    totalStudents: 70000,
    coords: [
      [ -6.35, 106.8 ],
      [ -6.36, 106.81 ],
      [ -6.37, 106.79 ],
    ],
    color: "purple",
  },
  {
    id: 3,
    name: "University of Gunadarma",
    province: "West Java",
    city: "Depok",
    activeStudents: 8000,
    totalStudents: 100000,
    coords: [
      [ -6.33, 106.83 ],
      [ -6.34, 106.84 ],
      [ -6.35, 106.82 ],
    ],
    color: "red",
  },
];

const UniversityDashboard = () => {
  const [selectedProvinces, setSelectedProvinces] = useState(["West Java", "DKI Jakarta"]);
  const [selectedCities, setSelectedCities] = useState(["Depok"]);

  const handleProvinceChange = (province) => {
    setSelectedProvinces((prev) =>
      prev.includes(province) ? prev.filter((p) => p !== province) : [...prev, province]
    );
  };

  const handleCityChange = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const filteredUniversities = universities.filter(
    (u) => selectedProvinces.includes(u.province) && selectedCities.includes(u.city)
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Filters</h2>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Province</h3>
          {["West Java", "DKI Jakarta", "South Tangerang", "Central Java"].map((prov) => (
            <label key={prov} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={selectedProvinces.includes(prov)}
                onChange={() => handleProvinceChange(prov)}
              />
              {prov}
            </label>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">City</h3>
          {["Bandung", "Bekasi", "Depok", "Bogor"].map((city) => (
            <label key={city} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={selectedCities.includes(city)}
                onChange={() => handleCityChange(city)}
              />
              {city}
            </label>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer center={[-6.33, 106.82]} zoom={12} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredUniversities.map((uni) => (
            <Polygon
              key={uni.id}
              positions={uni.coords}
              pathOptions={{ color: uni.color, fillOpacity: 0.3 }}
            >
              <Popup>
                <div className="font-bold">{uni.name}</div>
                <div>{uni.city}, {uni.province}</div>
                <div>Active Students: {uni.activeStudents}</div>
                <div>Total Students: {uni.totalStudents}</div>
              </Popup>
            </Polygon>
          ))}
        </MapContainer>

        {/* University Cards */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-4 overflow-x-auto">
          {filteredUniversities.map((uni) => (
            <div key={uni.id} className="bg-white shadow-md rounded-lg p-4 min-w-[250px]">
              <h3 className="font-bold">{uni.name}</h3>
              <p className="text-sm text-gray-600">{uni.city}, {uni.province}</p>
              <p className="text-sm">Active Students: {uni.activeStudents}</p>
              <p className="text-sm">Total Students: {uni.totalStudents}</p>
              <button className={`mt-2 py-1 px-3 rounded text-white bg-${uni.color}-600 hover:bg-${uni.color}-700`}>
                Detail
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard;
