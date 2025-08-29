
// // src/pages/SystemDashboard.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import axios from "axios";
// import {
//   Building2, MapPin, Footprints, TreeDeciduous, Car, Trash2, Zap,
//   Droplet, Waves, Fence, Lightbulb, Trees, User
// } from "lucide-react";
// import DashboardCard from "../components/DashboardCard";

// // ✅ API base URL
// const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || "https://smds.onrender.com/api/spatial").replace(/\/$/, "");

// // ✅ Categories configuration
// const DASHBOARD_CATEGORIES = [
//   { key: "Buildings", icon: Building2, color: "#f87171" },
//   { key: "Roads", icon: MapPin, color: "#fbbf24" },
//   { key: "Footpaths", icon: Footprints, color: "#4ade80" },
//   { key: "Vegetation", icon: TreeDeciduous, color: "#34d399" },
//   { key: "Parking", icon: Car, color: "#818cf8" },
//   { key: "Solid Waste", icon: Trash2, color: "#a78bfa" },
//   { key: "Electricity", icon: Zap, color: "#f472b6" },
//   { key: "Water Supply", icon: Droplet, color: "#60a5fa" },
//   { key: "Drainage System", icon: Waves, color: "#22d3ee" },
//   { key: "Vimbweta", icon: Fence, color: "#facc15" },
//   { key: "Security Lights", icon: Lightbulb, color: "#bef264" },
//   { key: "Recreational Areas", icon: Trees, color: "#e879f9" },
// ];

// // ✅ Check token validity
// const checkTokenValidity = (token) => {
//   if (!token) return false;
//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload.exp * 1000 > Date.now();
//   } catch {
//     return false;
//   }
// };

// // ✅ Report generator
// const generateShortReport = (category, features) => {
//   if (!features || features.length === 0) return { text: "No data", badges: [] };

//   const badges = [];
//   switch (category) {
//     case "Roads": {
//       const good = features.filter(f => f.properties?.condition === "good").length;
//       const bad = features.filter(f => f.properties?.condition === "bad").length;
//       badges.push({ label: "Good", value: good, color: "#22c55e" });
//       badges.push({ label: "Bad", value: bad, color: "#ef4444" });
//       return { text: "Road conditions", badges };
//     }

//     case "Buildings": {
//       const good = features.filter(f => f.properties?.condition === "good").length;
//       const fair = features.filter(f => f.properties?.condition === "fair").length;
//       const bad = features.filter(f => f.properties?.condition === "bad").length;
//       badges.push({ label: "Good", value: good, color: "#22c55e" });
//       badges.push({ label: "Fair", value: fair, color: "#eab308" });
//       badges.push({ label: "Bad", value: bad, color: "#ef4444" });
//       return { text: "Building conditions", badges };
//     }

//     case "Parking": {
//       const good = features.filter(f => f.properties?.condition === "good").length;
//       const fair = features.filter(f => f.properties?.condition === "fair").length;
//       const bad = features.filter(f => f.properties?.condition === "bad").length;
//       badges.push({ label: "Good", value: good, color: "#22c55e" });
//       badges.push({ label: "Fair", value: fair, color: "#f59e0b" });
//       badges.push({ label: "Bad", value: bad, color: "#ef4444" });
//       return { text: "Parking status", badges };
//     }

//     default:
//       badges.push({ label: "Count", value: features.length, color: "#818cf8" });
//       return { text: `${features.length} features`, badges };
//   }
// };

// // ✅ Retry fetch wrapper
// const fetchWithRetry = async (url, options, retries = 5, delay = 2000) => {
//   try {
//     return await axios.get(url, options);
//   } catch (err) {
//     if (err.response?.status === 429 && retries > 0) {
//       await new Promise(r => setTimeout(r, delay));
//       return fetchWithRetry(url, options, retries - 1, delay * 2);
//     } else {
//       throw err;
//     }
//   }
// };

// function SystemDashboard() {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
//   const [reports, setReports] = useState({});
//   const [loadingReports, setLoadingReports] = useState({});

//   // ✅ Fetch category data
//   const fetchCategoryData = useCallback(async (categoryKey, delayMs = 0) => {
//     const token = localStorage.getItem("token");
//     if (!token || !checkTokenValidity(token)) {
//       navigate("/login");
//       return;
//     }
//     await new Promise(r => setTimeout(r, delayMs));

//     setLoadingReports(prev => ({ ...prev, [categoryKey]: true }));
//     try {
//       const res = await fetchWithRetry(
//         `${SPATIAL_API_BASE}/geojson/${categoryKey.toLowerCase().replace(/\s+/g, "-")}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setReports(prev => ({
//         ...prev,
//         [categoryKey]: generateShortReport(categoryKey, res.data.features),
//       }));
//     } catch {
//       setReports(prev => ({ ...prev, [categoryKey]: { text: "Failed to load", badges: [] } }));
//     } finally {
//       setLoadingReports(prev => ({ ...prev, [categoryKey]: false }));
//     }
//   }, [navigate]);

//   // ✅ Fetch all categories
//   const fetchAllData = useCallback(() => {
//     DASHBOARD_CATEGORIES.forEach((c, idx) => fetchCategoryData(c.key, idx * 500));
//   }, [fetchCategoryData]);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//     localStorage.setItem("darkMode", darkMode);
//     fetchAllData();
//     const interval = setInterval(fetchAllData, 30000); // refresh every 30s
//     return () => clearInterval(interval);
//   }, [darkMode, fetchAllData]);

//   const handleCategorySelect = (category) => {
//     navigate(`/map?category=${category.toLowerCase().replace(/\s+/g, "-")}`);
//   };

//   return (
//     <div
//       style={{
//         padding: "24px",
//         minHeight: "100vh",
//         background: darkMode ? "#111827" : "#f3f4f6",
//         color: darkMode ? "#f9fafb" : "#111827",
//         transition: "0.3s",
//       }}
//     >
//       {/* Header */}
//       <header
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "24px",
//         }}
//       >
//         <Link to="/" style={{ fontSize: "1.5rem", fontWeight: "bold", color: darkMode ? "#fff" : "#111827" }}>
//           🌍 AruGIS Dashboard
//         </Link>
//         <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
//           <User style={{ width: "20px", height: "20px" }} />
//           <span>{currentUser?.username || currentUser?.email}</span>
//           <button
//             onClick={() => setDarkMode(prev => !prev)}
//             style={{
//               padding: "6px 12px",
//               borderRadius: "4px",
//               background: darkMode ? "#f9fafb" : "#1f2937",
//               color: darkMode ? "#111827" : "#f9fafb",
//             }}
//           >
//             {darkMode ? "☀️ Light" : "🌙 Dark"}
//           </button>
//           <button
//             onClick={() => { logout(); navigate("/login"); }}
//             style={{ padding: "6px 12px", borderRadius: "4px", background: "#ef4444", color: "#fff" }}
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* Dashboard Grid - fixed 4 columns */}
//       <main
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(4, 1fr)", // ✅ fixed 4 per row
//           gap: "18px",
//           alignItems: "stretch",
//         }}
//       >
//         {DASHBOARD_CATEGORIES.map(({ key, icon, color }) => (
//           <DashboardCard
//             key={key}
//             category={key}
//             Icon={icon}
//             color={color}
//             extraInfo={loadingReports[key] ? { text: "Loading...", badges: [] } : reports[key]}
//             onSelect={handleCategorySelect}
//           />
//         ))}
//       </main>
//     </div>
//   );
// }

// export default SystemDashboard;
// src/pages/SystemDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Building2, MapPin, Footprints, TreeDeciduous, Car, Trash2, Zap,
  Droplet, Waves, Fence, Lightbulb, Trees, User, Eye, Activity,
  CheckSquare, Clipboard, Menu, X
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";

// ✅ API base URL
const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || "https://smds.onrender.com/api/spatial").replace(/\/$/, "");

// ✅ Categories configuration
const DASHBOARD_CATEGORIES = [
  { key: "Buildings", icon: Building2, color: "#f87171" },
  { key: "Roads", icon: MapPin, color: "#fbbf24" },
  { key: "Footpaths", icon: Footprints, color: "#4ade80" },
  { key: "Vegetation", icon: TreeDeciduous, color: "#34d399" },
  { key: "Parking", icon: Car, color: "#818cf8" },
  { key: "Solid Waste", icon: Trash2, color: "#a78bfa" },
  { key: "Electricity", icon: Zap, color: "#f472b6" },
  { key: "Water Supply", icon: Droplet, color: "#60a5fa" },
  { key: "Drainage System", icon: Waves, color: "#22d3ee" },
  { key: "Vimbweta", icon: Fence, color: "#facc15" },
  { key: "Security Lights", icon: Lightbulb, color: "#bef264" },
  { key: "Recreational Areas", icon: Trees, color: "#e879f9" },
];

// ✅ Check token validity
const checkTokenValidity = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// ✅ Report generator
const generateShortReport = (category, features) => {
  if (!features || features.length === 0) return { text: "No data", badges: [] };
  const badges = [];
  switch (category) {
    case "Roads": {
      const good = features.filter(f => f.properties?.condition === "good").length;
      const bad = features.filter(f => f.properties?.condition === "bad").length;
      badges.push({ label: "Good", value: good, color: "#22c55e" });
      badges.push({ label: "Bad", value: bad, color: "#ef4444" });
      return { text: "Road conditions", badges };
    }
    case "Buildings": {
      const good = features.filter(f => f.properties?.condition === "good").length;
      const fair = features.filter(f => f.properties?.condition === "fair").length;
      const bad = features.filter(f => f.properties?.condition === "bad").length;
      badges.push({ label: "Good", value: good, color: "#22c55e" });
      badges.push({ label: "Fair", value: fair, color: "#eab308" });
      badges.push({ label: "Bad", value: bad, color: "#ef4444" });
      return { text: "Building conditions", badges };
    }
    case "Parking": {
      const good = features.filter(f => f.properties?.condition === "good").length;
      const fair = features.filter(f => f.properties?.condition === "fair").length;
      const bad = features.filter(f => f.properties?.condition === "bad").length;
      badges.push({ label: "Good", value: good, color: "#22c55e" });
      badges.push({ label: "Fair", value: fair, color: "#f59e0b" });
      badges.push({ label: "Bad", value: bad, color: "#ef4444" });
      return { text: "Parking status", badges };
    }
    default:
      badges.push({ label: "Count", value: features.length, color: "#818cf8" });
      return { text: `${features.length} features`, badges };
  }
};

// ✅ Retry fetch wrapper
const fetchWithRetry = async (url, options, retries = 5, delay = 2000) => {
  try {
    return await axios.get(url, options);
  } catch (err) {
    if (err.response?.status === 429 && retries > 0) {
      await new Promise(r => setTimeout(r, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    } else {
      throw err;
    }
  }
};

function SystemDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reports, setReports] = useState({});
  const [loadingReports, setLoadingReports] = useState({});

  const fetchCategoryData = useCallback(async (categoryKey, delayMs = 0) => {
    const token = localStorage.getItem("token");
    if (!token || !checkTokenValidity(token)) {
      navigate("/login");
      return;
    }
    await new Promise(r => setTimeout(r, delayMs));
    setLoadingReports(prev => ({ ...prev, [categoryKey]: true }));
    try {
      const res = await fetchWithRetry(
        `${SPATIAL_API_BASE}/geojson/${categoryKey.toLowerCase().replace(/\s+/g, "-")}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(prev => ({
        ...prev,
        [categoryKey]: generateShortReport(categoryKey, res.data.features),
      }));
    } catch {
      setReports(prev => ({ ...prev, [categoryKey]: { text: "Failed to load", badges: [] } }));
    } finally {
      setLoadingReports(prev => ({ ...prev, [categoryKey]: false }));
    }
  }, [navigate]);

  const fetchAllData = useCallback(() => {
    DASHBOARD_CATEGORIES.forEach((c, idx) => fetchCategoryData(c.key, idx * 500));
  }, [fetchCategoryData]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [darkMode, fetchAllData]);

  const handleCategorySelect = (category) => {
    navigate(`/map?category=${category.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className={`flex min-h-screen transition-colors ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:w-80 p-6 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-xl rounded-r-3xl flex flex-col justify-between`}>
        <div>
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h2 className="text-2xl font-bold text-indigo-400">About the System</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          {sidebarOpen && (
            <>
              <h2 className="hidden md:block text-2xl font-bold mb-4 text-indigo-400">About the System</h2>
              <p className="mb-4 leading-relaxed">
                The Spatial Database System for Space Utilization and Infrastructure Optimization at Ardhi University integrates campus maps, building layouts, and detailed room information into a centralized, interactive GIS system. It allows administrators, planners, and academic units to:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 hover:text-indigo-400 transition-colors"><Eye className="w-5 h-5 text-indigo-300" /> Visualize all campus spaces on an interactive map.</li>
                <li className="flex items-center gap-2 hover:text-indigo-400 transition-colors"><Activity className="w-5 h-5 text-green-400" /> Track room usage, occupancy, and conditions in real time.</li>
                <li className="flex items-center gap-2 hover:text-indigo-400 transition-colors"><CheckSquare className="w-5 h-5 text-yellow-400" /> Identify underutilized areas for repurposing or optimization.</li>
                <li className="flex items-center gap-2 hover:text-indigo-400 transition-colors"><Clipboard className="w-5 h-5 text-blue-400" /> Perform spatial queries and generate reports for data-driven decisions.</li>
                <li className="flex items-center gap-2 hover:text-indigo-400 transition-colors"><User className="w-5 h-5 text-pink-400" /> Support planning, resource allocation, and policy formulation.</li>
              </ul>
            </>
          )}
        </div>
        <div className="mt-6 text-sm text-gray-400 hidden md:block">
          © Ardhi University
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-80">
        {/* Mobile toggle button */}
        <button
          className="md:hidden mb-4 px-3 py-1 rounded bg-indigo-600 text-white flex items-center gap-1"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" /> Menu
        </button>

        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <Link className="text-2xl font-bold" to="/">🌍 AruGIS Dashboard</Link>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5" />
            <span>{currentUser?.username || currentUser?.email}</span>
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className={`px-3 py-1 rounded ${darkMode ? "bg-gray-200 text-gray-900" : "bg-gray-800 text-gray-100"}`}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="px-3 py-1 rounded bg-red-600 text-white"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DASHBOARD_CATEGORIES.map(({ key, icon, color }) => (
            <DashboardCard
              key={key}
              category={key}
              Icon={icon}
              color={color}
              extraInfo={loadingReports[key] ? { text: "Loading...", badges: [] } : reports[key]}
              onSelect={handleCategorySelect}
            />
          ))}
        </main>
      </div>
    </div>
  );
}

export default SystemDashboard;
