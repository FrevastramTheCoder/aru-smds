// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import {
//   Building2,
//   MapPin,
//   Footprints,
//   TreeDeciduous,
//   Car,
//   Trash2,
//   Zap,
//   Droplet,
//   Waves,
//   Fence,
//   Lightbulb,
//   Trees,
//   User,
//   Map,
//   Upload,
//   LogOut,
//   Sun,
//   Moon,
// } from 'lucide-react';
// import DashboardCard from '../components/DashboardCard';

// /**
//  * Dashboard page with category cards for spatial data.
//  */
// function SystemDashboard() {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
//   const [loading, setLoading] = useState(true);

//   const DASHBOARD_CATEGORIES = [
//     { key: 'Buildings', icon: Building2, color: '#f87171' },
//     { key: 'Roads', icon: MapPin, color: '#fbbf24' },
//     { key: 'Footpaths', icon: Footprints, color: '#4ade80' },
//     { key: 'Vegetation', icon: TreeDeciduous, color: '#34d399' },
//     { key: 'Parking', icon: Car, color: '#818cf8' },
//     { key: 'Solid Waste', icon: Trash2, color: '#a78bfa' },
//     { key: 'Electricity', icon: Zap, color: '#f472b6' },
//     { key: 'Water Supply', icon: Droplet, color: '#60a5fa' },
//     { key: 'Drainage System', icon: Waves, color: '#22d3ee' },
//     { key: 'Vimbweta', icon: Fence, color: '#facc15' },
//     { key: 'Security Lights', icon: Lightbulb, color: '#bef264' },
//     { key: 'Recreational Areas', icon: Trees, color: '#e879f9' },
//   ];

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', darkMode);
//     localStorage.setItem('darkMode', darkMode);
//     setTimeout(() => setLoading(false), 500); // Simulate loading
//   }, [darkMode]);

//   const handleCategorySelect = (category) => {
//     const slug = category.toLowerCase().replace(/\s+/g, '-');
//     navigate(`/map?category=${slug}`);
//   };

//   const toggleDarkMode = () => {
//     setDarkMode((prev) => !prev);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   if (loading) {
//     return <div className="loading-spinner"></div>;
//   }

//   return (
//     <div className="system-dashboard">
//       <div className="circle-blue"></div>
//       <div className="circle-fuchsia"></div>
//       <header className="dashboard-header">
//         <Link to="/" className="flex items-center">
//           <h1 className="text-xl font-bold">Ardhi Spatial System</h1>
//         </Link>
//         <div className="header-buttons">
//           <div className="flex items-center space-x-2">
//             <User className="w-4 h-4" />
//             <span>{currentUser?.username || currentUser?.email}</span>
//           </div>
//           <button
//             onClick={() => navigate('/map')}
//             className="flex items-center space-x-1"
//           >
//             <Map className="w-5 h-5" />
//             <span>Map</span>
//           </button>
//           <button
//             onClick={() => navigate('/data')}
//             className="flex items-center space-x-1"
//           >
//             <Upload className="w-5 h-5" />
//             <span>Data</span>
//           </button>
//           <button
//             onClick={handleLogout}
//             className="flex items-center space-x-1"
//           >
//             <LogOut className="w-5 h-5" />
//             <span>Logout</span>
//           </button>
//           <button
//             onClick={toggleDarkMode}
//             className="p-2 rounded-full"
//             aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
//           >
//             {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//           </button>
//         </div>
//       </header>
//       <main className="dashboard-main">
//         <div className="dashboard-header-text">
//           <h2>System Dashboard</h2>
//           <p>Explore spatial data to support urban planning and sustainability.</p>
//         </div>
//         <div className="dashboard-grid">
//           {DASHBOARD_CATEGORIES.map(({ key, icon, color }) => (
//             <DashboardCard
//               key={key}
//               category={key}
//               Icon={icon}
//               color={color}
//               onSelect={handleCategorySelect}
//             />
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default SystemDashboard; 


// //real time data 
// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import {
//   Building2,
//   MapPin,
//   Footprints,
//   TreeDeciduous,
//   Car,
//   Trash2,
//   Zap,
//   Droplet,
//   Waves,
//   Fence,
//   Lightbulb,
//   Trees,
//   User,
//   Map,
//   Upload,
//   LogOut,
//   Sun,
//   Moon,
// } from 'lucide-react';
// import DashboardCard from '../components/DashboardCard';

// // ------------------------
// // Retry fetch helper
// // ------------------------
// const fetchWithRetry = async (url, options, maxRetries = 3, timeout = 45000) => {
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), timeout);
//       const response = await axios({ ...options, url, signal: controller.signal });
//       clearTimeout(timeoutId);
//       return response;
//     } catch (error) {
//       if (error.response?.status === 404) throw error;
//       if (error.response?.status === 429) {
//         const retryAfter = error.response.headers['retry-after'] || 5;
//         await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//         continue;
//       }
//       if (i === maxRetries - 1) throw error;
//       await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
//     }
//   }
// };

// // ------------------------
// // Token validation helper
// // ------------------------
// const checkTokenValidity = (token) => {
//   if (!token) return false;
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.exp * 1000 > Date.now();
//   } catch {
//     return false;
//   }
// };

// function SystemDashboard() {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
//   const [loading, setLoading] = useState(true);
//   const [roadStatus, setRoadStatus] = useState({ good: 0, poor: 0 });

//   const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');
//   const ROAD_STATUS_ENDPOINT = `${SPATIAL_API_BASE}/geojson/roads/status`;

//   const DASHBOARD_CATEGORIES = [
//     { key: 'Buildings', icon: Building2, color: '#f87171' },
//     { key: 'Roads', icon: MapPin, color: '#fbbf24' },
//     { key: 'Footpaths', icon: Footprints, color: '#4ade80' },
//     { key: 'Vegetation', icon: TreeDeciduous, color: '#34d399' },
//     { key: 'Parking', icon: Car, color: '#818cf8' },
//     { key: 'Solid Waste', icon: Trash2, color: '#a78bfa' },
//     { key: 'Electricity', icon: Zap, color: '#f472b6' },
//     { key: 'Water Supply', icon: Droplet, color: '#60a5fa' },
//     { key: 'Drainage System', icon: Waves, color: '#22d3ee' },
//     { key: 'Vimbweta', icon: Fence, color: '#facc15' },
//     { key: 'Security Lights', icon: Lightbulb, color: '#bef264' },
//     { key: 'Recreational Areas', icon: Trees, color: '#e879f9' },
//   ];

//   const fetchRoadStatus = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token || !checkTokenValidity(token)) {
//         navigate('/login');
//         return;
//       }
//       const res = await fetchWithRetry(ROAD_STATUS_ENDPOINT, {
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//       });
//       setRoadStatus(res.data || { good: 0, poor: 0 });
//     } catch (err) {
//       console.error('Failed to fetch road status', err);
//       setRoadStatus({ good: 0, poor: 0 });
//     }
//   }, [navigate]);

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', darkMode);
//     localStorage.setItem('darkMode', darkMode);

//     setTimeout(() => setLoading(false), 500);

//     // Fetch initial data and poll every 15 seconds
//     fetchRoadStatus();
//     const interval = setInterval(fetchRoadStatus, 15000);
//     return () => clearInterval(interval);
//   }, [darkMode, fetchRoadStatus]);

//   const handleCategorySelect = (category) => {
//     const slug = category.toLowerCase().replace(/\s+/g, '-');
//     navigate(`/map?category=${slug}`);
//   };

//   const toggleDarkMode = () => setDarkMode(prev => !prev);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   if (loading) return <div className="loading-spinner"></div>;

//   return (
//     <div className="system-dashboard">
//       <div className="circle-blue"></div>
//       <div className="circle-fuchsia"></div>
//       <header className="dashboard-header">
//         <Link to="/" className="flex items-center">
//           <h1 className="text-xl font-bold">Ardhi Spatial System</h1>
//         </Link>
//         <div className="header-buttons">
//           <div className="flex items-center space-x-2">
//             <User className="w-4 h-4" />
//             <span>{currentUser?.username || currentUser?.email}</span>
//           </div>
//           <button onClick={() => navigate('/map')} className="flex items-center space-x-1">
//             <Map className="w-5 h-5" />
//             <span>Map</span>
//           </button>
//           <button onClick={() => navigate('/data')} className="flex items-center space-x-1">
//             <Upload className="w-5 h-5" />
//             <span>Data</span>
//           </button>
//           <button onClick={handleLogout} className="flex items-center space-x-1">
//             <LogOut className="w-5 h-5" />
//             <span>Logout</span>
//           </button>
//           <button onClick={toggleDarkMode} className="p-2 rounded-full" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
//             {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//           </button>
//         </div>
//       </header>
//       <main className="dashboard-main">
//         <div className="dashboard-header-text">
//           <h2>System Dashboard</h2>
//           <p>Explore spatial data to support urban planning and sustainability.</p>
//         </div>
//         <div className="dashboard-grid">
//           {DASHBOARD_CATEGORIES.map(({ key, icon, color }) => {
//             const extraInfo = key === 'Roads' ? `Good: ${roadStatus.good} | Poor: ${roadStatus.poor}` : '';
//             return (
//               <DashboardCard
//                 key={key}
//                 category={key}
//                 Icon={icon}
//                 color={color}
//                 extraInfo={extraInfo}
//                 onSelect={handleCategorySelect}
//               />
//             );
//           })}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default SystemDashboard;
// //report
// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import {
//   Building2,
//   MapPin,
//   Footprints,
//   TreeDeciduous,
//   Car,
//   Trash2,
//   Zap,
//   Droplet,
//   Waves,
//   Fence,
//   Lightbulb,
//   Trees,
//   User,
//   Map,
//   Upload,
//   LogOut,
//   Sun,
//   Moon,
// } from 'lucide-react';
// import DashboardCard from '../components/DashboardCard';

// // ------------------------
// // Retry fetch helper
// // ------------------------
// const fetchWithRetry = async (url, options, maxRetries = 3, timeout = 45000) => {
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), timeout);
//       const response = await axios({ ...options, url, signal: controller.signal });
//       clearTimeout(timeoutId);
//       return response;
//     } catch (error) {
//       if (error.response?.status === 404) throw error;
//       if (error.response?.status === 429) {
//         const retryAfter = error.response.headers['retry-after'] || 5;
//         await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//         continue;
//       }
//       if (i === maxRetries - 1) throw error;
//       await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
//     }
//   }
// };

// // ------------------------
// // Token validation helper
// // ------------------------
// const checkTokenValidity = (token) => {
//   if (!token) return false;
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.exp * 1000 > Date.now();
//   } catch {
//     return false;
//   }
// };

// // ------------------------
// // Generate short report for any category
// // ------------------------
// const generateShortReport = (category, features) => {
//   if (!features || features.length === 0) return 'No data available';

//   switch (category) {
//     case 'Roads':
//       const good = features.filter(f => f.properties?.condition === 'good').length;
//       const poor = features.filter(f => f.properties?.condition === 'poor').length;
//       return `Good: ${good}, Poor: ${poor}`;
//     case 'Buildings':
//       const residential = features.filter(f => f.properties?.type === 'residential').length;
//       const commercial = features.filter(f => f.properties?.type === 'commercial').length;
//       return `Residential: ${residential}, Commercial: ${commercial}`;
//     case 'Footpaths':
//       return `Total footpaths: ${features.length}`;
//     case 'Vegetation':
//       return `Total trees/vegetation: ${features.length}`;
//     case 'Parking':
//       return `Parking spots: ${features.length}`;
//     case 'Solid Waste':
//       return `Waste points: ${features.length}`;
//     case 'Electricity':
//       return `Electric poles: ${features.length}`;
//     case 'Water Supply':
//       return `Water points: ${features.length}`;
//     case 'Drainage System':
//       return `Drainage units: ${features.length}`;
//     case 'Vimbweta':
//       return `Fences: ${features.length}`;
//     case 'Security Lights':
//       return `Lights: ${features.length}`;
//     case 'Recreational Areas':
//       return `Areas: ${features.length}`;
//     default:
//       return `${features.length} features`;
//   }
// };

// function SystemDashboard() {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
//   const [loading, setLoading] = useState(true);
//   const [spatialData, setSpatialData] = useState({});
//   const [reports, setReports] = useState({});

//   const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');

//   const DASHBOARD_CATEGORIES = [
//     { key: 'Buildings', icon: Building2, color: '#f87171' },
//     { key: 'Roads', icon: MapPin, color: '#fbbf24' },
//     { key: 'Footpaths', icon: Footprints, color: '#4ade80' },
//     { key: 'Vegetation', icon: TreeDeciduous, color: '#34d399' },
//     { key: 'Parking', icon: Car, color: '#818cf8' },
//     { key: 'Solid Waste', icon: Trash2, color: '#a78bfa' },
//     { key: 'Electricity', icon: Zap, color: '#f472b6' },
//     { key: 'Water Supply', icon: Droplet, color: '#60a5fa' },
//     { key: 'Drainage System', icon: Waves, color: '#22d3ee' },
//     { key: 'Vimbweta', icon: Fence, color: '#facc15' },
//     { key: 'Security Lights', icon: Lightbulb, color: '#bef264' },
//     { key: 'Recreational Areas', icon: Trees, color: '#e879f9' },
//   ];

//   // ------------------------
//   // Fetch all categories in real-time
//   // ------------------------
//   const fetchAllData = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token || !checkTokenValidity(token)) {
//       navigate('/login');
//       return;
//     }

//     const newData = {};
//     const newReports = {};

//     for (const { key } of DASHBOARD_CATEGORIES) {
//       const endpoint = `${SPATIAL_API_BASE}/geojson/${key.toLowerCase().replace(/\s+/g, '-')}`;
//       try {
//         const res = await fetchWithRetry(endpoint, {
//           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
//         });
//         const features = res.data.features || [];
//         newData[key] = features;
//         newReports[key] = generateShortReport(key, features);
//       } catch {
//         newData[key] = [];
//         newReports[key] = 'Failed to load';
//       }
//     }

//     setSpatialData(newData);
//     setReports(newReports);
//   }, [navigate]);

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', darkMode);
//     localStorage.setItem('darkMode', darkMode);

//     setTimeout(() => setLoading(false), 500);

//     // Fetch immediately and poll every 15 seconds
//     fetchAllData();
//     const interval = setInterval(fetchAllData, 15000);
//     return () => clearInterval(interval);
//   }, [darkMode, fetchAllData]);

//   const handleCategorySelect = (category) => {
//     const slug = category.toLowerCase().replace(/\s+/g, '-');
//     navigate(`/map?category=${slug}`);
//   };

//   const toggleDarkMode = () => setDarkMode(prev => !prev);
//   const handleLogout = () => { logout(); navigate('/login'); };

//   if (loading) return <div className="loading-spinner"></div>;

//   return (
//     <div className="system-dashboard">
//       <div className="circle-blue"></div>
//       <div className="circle-fuchsia"></div>
//       <header className="dashboard-header">
//         <Link to="/" className="flex items-center">
//           <h1 className="text-xl font-bold">Ardhi Spatial System</h1>
//         </Link>
//         <div className="header-buttons">
//           <div className="flex items-center space-x-2">
//             <User className="w-4 h-4" />
//             <span>{currentUser?.username || currentUser?.email}</span>
//           </div>
//           <button onClick={() => navigate('/map')} className="flex items-center space-x-1">
//             <Map className="w-5 h-5" />
//             <span>Map</span>
//           </button>
//           <button onClick={() => navigate('/data')} className="flex items-center space-x-1">
//             <Upload className="w-5 h-5" />
//             <span>Data</span>
//           </button>
//           <button onClick={handleLogout} className="flex items-center space-x-1">
//             <LogOut className="w-5 h-5" />
//             <span>Logout</span>
//           </button>
//           <button onClick={toggleDarkMode} className="p-2 rounded-full" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
//             {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//           </button>
//         </div>
//       </header>
//       <main className="dashboard-main">
//         <div className="dashboard-header-text">
//           <h2>System Dashboard</h2>
//           <p>Real-time spatial data summary</p>
//         </div>
//         <div className="dashboard-grid">
//           {DASHBOARD_CATEGORIES.map(({ key, icon, color }) => (
//             <DashboardCard
//               key={key}
//               category={key}
//               Icon={icon}
//               color={color}
//               extraInfo={reports[key]}
//               onSelect={handleCategorySelect}
//             />
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default SystemDashboard;

// //final report
// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import {
//   Building2,
//   MapPin,
//   Footprints,
//   TreeDeciduous,
//   Car,
//   Trash2,
//   Zap,
//   Droplet,
//   Waves,
//   Fence,
//   Lightbulb,
//   Trees,
//   User,
//   Map,
//   Upload,
//   LogOut,
//   Sun,
//   Moon,
// } from 'lucide-react';
// import DashboardCard from '../components/DashboardCard';

// // Retry fetch helper
// const fetchWithRetry = async (url, options, maxRetries = 3, timeout = 45000) => {
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), timeout);
//       const response = await axios({ ...options, url, signal: controller.signal });
//       clearTimeout(timeoutId);
//       return response;
//     } catch (error) {
//       if (error.response?.status === 404) throw error;
//       if (error.response?.status === 429) {
//         const retryAfter = error.response.headers['retry-after'] || 5;
//         await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//         continue;
//       }
//       if (i === maxRetries - 1) throw error;
//       await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
//     }
//   }
// };

// // Token validation
// const checkTokenValidity = (token) => {
//   if (!token) return false;
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.exp * 1000 > Date.now();
//   } catch {
//     return false;
//   }
// };

// // Generate short report with optional icon for metric
// const generateShortReport = (category, features) => {
//   if (!features || features.length === 0) return { text: 'No data', icon: null };

//   switch (category) {
//     case 'Roads': {
//       const good = features.filter(f => f.properties?.condition === 'good').length;
//       const poor = features.filter(f => f.properties?.condition === 'poor').length;
//       return { text: `Good: ${good} | Poor: ${poor}`, icon: MapPin };
//     }
//     case 'Buildings': {
//       const residential = features.filter(f => f.properties?.type === 'residential').length;
//       const commercial = features.filter(f => f.properties?.type === 'commercial').length;
//       return { text: `Residential: ${residential} | Commercial: ${commercial}`, icon: Building2 };
//     }
//     case 'Footpaths':
//       return { text: `Footpaths: ${features.length}`, icon: Footprints };
//     case 'Vegetation':
//       return { text: `Trees: ${features.length}`, icon: TreeDeciduous };
//     case 'Parking':
//       return { text: `Spots: ${features.length}`, icon: Car };
//     case 'Solid Waste':
//       return { text: `Waste points: ${features.length}`, icon: Trash2 };
//     case 'Electricity':
//       return { text: `Poles: ${features.length}`, icon: Zap };
//     case 'Water Supply':
//       return { text: `Points: ${features.length}`, icon: Droplet };
//     case 'Drainage System':
//       return { text: `Units: ${features.length}`, icon: Waves };
//     case 'Vimbweta':
//       return { text: `Fences: ${features.length}`, icon: Fence };
//     case 'Security Lights':
//       return { text: `Lights: ${features.length}`, icon: Lightbulb };
//     case 'Recreational Areas':
//       return { text: `Areas: ${features.length}`, icon: Trees };
//     default:
//       return { text: `${features.length} features`, icon: null };
//   }
// };

// function SystemDashboard() {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
//   const [loading, setLoading] = useState(true);
//   const [reports, setReports] = useState({});
//   const [loadingReports, setLoadingReports] = useState({});

//   const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');

//   const DASHBOARD_CATEGORIES = [
//     { key: 'Buildings', icon: Building2, color: '#f87171' },
//     { key: 'Roads', icon: MapPin, color: '#fbbf24' },
//     { key: 'Footpaths', icon: Footprints, color: '#4ade80' },
//     { key: 'Vegetation', icon: TreeDeciduous, color: '#34d399' },
//     { key: 'Parking', icon: Car, color: '#818cf8' },
//     { key: 'Solid Waste', icon: Trash2, color: '#a78bfa' },
//     { key: 'Electricity', icon: Zap, color: '#f472b6' },
//     { key: 'Water Supply', icon: Droplet, color: '#60a5fa' },
//     { key: 'Drainage System', icon: Waves, color: '#22d3ee' },
//     { key: 'Vimbweta', icon: Fence, color: '#facc15' },
//     { key: 'Security Lights', icon: Lightbulb, color: '#bef264' },
//     { key: 'Recreational Areas', icon: Trees, color: '#e879f9' },
//   ];

//   // Fetch per-category data
//   const fetchCategoryData = useCallback(async (categoryKey) => {
//     const token = localStorage.getItem('token');
//     if (!token || !checkTokenValidity(token)) {
//       navigate('/login');
//       return;
//     }

//     setLoadingReports(prev => ({ ...prev, [categoryKey]: true }));
//     const endpoint = `${SPATIAL_API_BASE}/geojson/${categoryKey.toLowerCase().replace(/\s+/g, '-')}`;
//     try {
//       const res = await fetchWithRetry(endpoint, {
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });
//       const features = res.data.features || [];
//       setReports(prev => ({ ...prev, [categoryKey]: generateShortReport(categoryKey, features) }));
//     } catch {
//       setReports(prev => ({ ...prev, [categoryKey]: { text: 'Failed to load', icon: null } }));
//     } finally {
//       setLoadingReports(prev => ({ ...prev, [categoryKey]: false }));
//     }
//   }, [navigate]);

//   const fetchAllData = useCallback(() => {
//     DASHBOARD_CATEGORIES.forEach(({ key }) => fetchCategoryData(key));
//   }, [fetchCategoryData]);

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', darkMode);
//     localStorage.setItem('darkMode', darkMode);

//     setTimeout(() => setLoading(false), 500);

//     fetchAllData();
//     const interval = setInterval(fetchAllData, 15000);
//     return () => clearInterval(interval);
//   }, [darkMode, fetchAllData]);

//   const handleCategorySelect = (category) => {
//     const slug = category.toLowerCase().replace(/\s+/g, '-');
//     navigate(`/map?category=${slug}`);
//   };

//   const toggleDarkMode = () => setDarkMode(prev => !prev);
//   const handleLogout = () => { logout(); navigate('/login'); };

//   if (loading) return <div className="loading-spinner"></div>;

//   return (
//     <div className="system-dashboard">
//       <div className="circle-blue"></div>
//       <div className="circle-fuchsia"></div>
//       <header className="dashboard-header">
//         <Link to="/" className="flex items-center">
//           <h1 className="text-xl font-bold">Ardhi Spatial System</h1>
//         </Link>
//         <div className="header-buttons">
//           <div className="flex items-center space-x-2">
//             <User className="w-4 h-4" />
//             <span>{currentUser?.username || currentUser?.email}</span>
//           </div>
//           <button onClick={() => navigate('/map')} className="flex items-center space-x-1">
//             <Map className="w-5 h-5" />
//             <span>Map</span>
//           </button>
//           <button onClick={() => navigate('/data')} className="flex items-center space-x-1">
//             <Upload className="w-5 h-5" />
//             <span>Data</span>
//           </button>
//           <button onClick={handleLogout} className="flex items-center space-x-1">
//             <LogOut className="w-5 h-5" />
//             <span>Logout</span>
//           </button>
//           <button onClick={toggleDarkMode} className="p-2 rounded-full" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
//             {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//           </button>
//         </div>
//       </header>

//       <main className="dashboard-main">
//         <div className="dashboard-header-text">
//           <h2>System Dashboard</h2>
//           <p>Real-time spatial data summary with icons</p>
//         </div>
//         <div className="dashboard-grid">
//           {DASHBOARD_CATEGORIES.map(({ key, icon, color }) => (
//             <DashboardCard
//               key={key}
//               category={key}
//               Icon={icon}
//               color={color}
//               extraInfo={loadingReports[key] ? { text: 'Loading...', icon: null } : reports[key]}
//               onSelect={handleCategorySelect}
//             />
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default SystemDashboard;

// //final codes

// // src/pages/SystemDashboard.jsx
// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import {
//   Building2, MapPin, Footprints, TreeDeciduous, Car, Trash2, Zap,
//   Droplet, Waves, Fence, Lightbulb, Trees
// } from 'lucide-react';
// import DashboardCard from '../components/DashboardCard';

// const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');

// const DASHBOARD_CATEGORIES = [
//   { key: 'Buildings', icon: Building2, color: '#f87171' },
//   { key: 'Roads', icon: MapPin, color: '#fbbf24' },
//   { key: 'Footpaths', icon: Footprints, color: '#4ade80' },
//   { key: 'Vegetation', icon: TreeDeciduous, color: '#34d399' },
//   { key: 'Parking', icon: Car, color: '#818cf8' },
//   { key: 'Solid Waste', icon: Trash2, color: '#a78bfa' },
//   { key: 'Electricity', icon: Zap, color: '#f472b6' },
//   { key: 'Water Supply', icon: Droplet, color: '#60a5fa' },
//   { key: 'Drainage System', icon: Waves, color: '#22d3ee' },
//   { key: 'Vimbweta', icon: Fence, color: '#facc15' },
//   { key: 'Security Lights', icon: Lightbulb, color: '#bef264' },
//   { key: 'Recreational Areas', icon: Trees, color: '#e879f9' },
// ];

// const checkTokenValidity = (token) => {
//   if (!token) return false;
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.exp * 1000 > Date.now();
//   } catch { return false; }
// };

// const generateShortReport = (category, features) => {
//   if (!features || features.length === 0) return { text: 'No data', badges: [] };
//   const badges = [];
//   switch (category) {
//     case 'Roads': {
//       const good = features.filter(f => f.properties?.condition === 'good').length;
//       const poor = features.filter(f => f.properties?.condition === 'poor').length;
//       badges.push({ label: 'Good', value: good, color: '#10b981' });
//       badges.push({ label: 'Poor', value: poor, color: '#ef4444' });
//       return { text: 'Road conditions', badges };
//     }
//     case 'Buildings': {
//       const res = features.filter(f => f.properties?.type === 'residential').length;
//       const com = features.filter(f => f.properties?.type === 'commercial').length;
//       badges.push({ label: 'Residential', value: res, color: '#3b82f6' });
//       badges.push({ label: 'Commercial', value: com, color: '#facc15' });
//       return { text: 'Building types', badges };
//     }
//     default:
//       badges.push({ label: 'Count', value: features.length, color: '#818cf8' });
//       return { text: `${features.length} features`, badges };
//   }
// };

// function SystemDashboard() {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(true);
//   const [reports, setReports] = useState({});
//   const [loadingReports, setLoadingReports] = useState({});

//   const fetchCategoryData = useCallback(async (categoryKey) => {
//     const token = localStorage.getItem('token');
//     if (!token || !checkTokenValidity(token)) { navigate('/login'); return; }
//     setLoadingReports(prev => ({ ...prev, [categoryKey]: true }));
//     try {
//       const res = await axios.get(`${SPATIAL_API_BASE}/geojson/${categoryKey.toLowerCase().replace(/\s+/g, '-')}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const features = res.data.features || [];
//       setReports(prev => ({ ...prev, [categoryKey]: generateShortReport(categoryKey, features) }));
//     } catch {
//       setReports(prev => ({ ...prev, [categoryKey]: { text: 'Failed to load', badges: [] } }));
//     } finally {
//       setLoadingReports(prev => ({ ...prev, [categoryKey]: false }));
//     }
//   }, [navigate]);

//   const fetchAllData = useCallback(() => DASHBOARD_CATEGORIES.forEach(c => fetchCategoryData(c.key)), [fetchCategoryData]);

//   useEffect(() => {
//     fetchAllData();
//     const interval = setInterval(fetchAllData, 15000); // 15s refresh
//     return () => clearInterval(interval);
//   }, [fetchAllData]);

//   const handleCategorySelect = (category) => {
//     const slug = category.toLowerCase().replace(/\s+/g, '-');
//     navigate(`/map?category=${slug}`);
//   };

//   const handleLogout = () => { logout(); navigate('/login'); };
//   const toggleDarkMode = () => setDarkMode(prev => !prev);

//   return (
//     <div style={{ padding: '24px', minHeight: '100vh', background: darkMode ? '#111827' : '#f3f4f6', color: darkMode ? '#f9fafb' : '#111827' }}>
//       <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//         <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: darkMode ? '#fff' : '#111827' }}>ArcGIS Pro Dashboard</Link>
//         <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
//           <span>{currentUser?.username || currentUser?.email}</span>
//           <button onClick={toggleDarkMode} style={{ padding: '6px 12px', borderRadius: '4px', background: darkMode ? '#f9fafb' : '#1f2937', color: darkMode ? '#111827' : '#f9fafb' }}>
//             {darkMode ? '☀️ Light' : '🌙 Dark'}
//           </button>
//           <button onClick={handleLogout} style={{ padding: '6px 12px', borderRadius: '4px', background: '#ef4444', color: '#fff' }}>Logout</button>
//         </div>
//       </header>

//       <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
//         {DASHBOARD_CATEGORIES.map(({ key, icon, color }) => (
//           <DashboardCard
//             key={key}
//             category={key}
//             Icon={icon}
//             color={color}
//             extraInfo={loadingReports[key] ? { text: 'Loading...', badges: [] } : reports[key]}
//             onSelect={handleCategorySelect}
//           />
//         ))}
//       </main>
//     </div>
//   );
// }

// export default SystemDashboard;

// // arc gis
// // src/pages/SystemDashboard.jsx
// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import {
//   Building2, MapPin, Footprints, TreeDeciduous, Car, Trash2, Zap,
//   Droplet, Waves, Fence, Lightbulb, Trees, User, Map, Upload, LogOut, Sun, Moon
// } from 'lucide-react';
// import DashboardCard from '../components/DashboardCard';

// // Spatial API base
// const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');

// // Dashboard categories
// const DASHBOARD_CATEGORIES = [
//   { key: 'Buildings', icon: Building2, color: '#f87171' },
//   { key: 'Roads', icon: MapPin, color: '#fbbf24' },
//   { key: 'Footpaths', icon: Footprints, color: '#4ade80' },
//   { key: 'Vegetation', icon: TreeDeciduous, color: '#34d399' },
//   { key: 'Parking', icon: Car, color: '#818cf8' },
//   { key: 'Solid Waste', icon: Trash2, color: '#a78bfa' },
//   { key: 'Electricity', icon: Zap, color: '#f472b6' },
//   { key: 'Water Supply', icon: Droplet, color: '#60a5fa' },
//   { key: 'Drainage System', icon: Waves, color: '#22d3ee' },
//   { key: 'Vimbweta', icon: Fence, color: '#facc15' },
//   { key: 'Security Lights', icon: Lightbulb, color: '#bef264' },
//   { key: 'Recreational Areas', icon: Trees, color: '#e879f9' },
// ];

// // Token check
// const checkTokenValidity = (token) => {
//   if (!token) return false;
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.exp * 1000 > Date.now();
//   } catch { return false; }
// };

// // Generate badges for dashboard
// const generateShortReport = (category, features) => {
//   if (!features || features.length === 0) return { text: 'No data', badges: [] };
//   const badges = [];
//   switch (category) {
//     case 'Roads': {
//       const good = features.filter(f => f.properties?.condition === 'good').length;
//       const poor = features.filter(f => f.properties?.condition === 'poor').length;
//       badges.push({ label: 'Good', value: good, color: '#10b981' });
//       badges.push({ label: 'Poor', value: poor, color: '#ef4444' });
//       return { text: 'Road conditions', badges };
//     }
//     case 'Buildings': {
//       const res = features.filter(f => f.properties?.type === 'residential').length;
//       const com = features.filter(f => f.properties?.type === 'commercial').length;
//       badges.push({ label: 'Residential', value: res, color: '#3b82f6' });
//       badges.push({ label: 'Commercial', value: com, color: '#facc15' });
//       return { text: 'Building types', badges };
//     }
//     default:
//       badges.push({ label: 'Count', value: features.length, color: '#818cf8' });
//       return { text: `${features.length} features`, badges };
//   }
// };

// function SystemDashboard() {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
//   const [reports, setReports] = useState({});
//   const [loadingReports, setLoadingReports] = useState({});

//   // Fetch per-category data
//   const fetchCategoryData = useCallback(async (categoryKey) => {
//     const token = localStorage.getItem('token');
//     if (!token || !checkTokenValidity(token)) { navigate('/login'); return; }

//     setLoadingReports(prev => ({ ...prev, [categoryKey]: true }));
//     try {
//       const res = await axios.get(`${SPATIAL_API_BASE}/geojson/${categoryKey.toLowerCase().replace(/\s+/g, '-')}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const features = res.data.features || [];
//       setReports(prev => ({ ...prev, [categoryKey]: generateShortReport(categoryKey, features) }));
//     } catch {
//       setReports(prev => ({ ...prev, [categoryKey]: { text: 'Failed to load', badges: [] } }));
//     } finally {
//       setLoadingReports(prev => ({ ...prev, [categoryKey]: false }));
//     }
//   }, [navigate]);

//   const fetchAllData = useCallback(() => DASHBOARD_CATEGORIES.forEach(c => fetchCategoryData(c.key)), [fetchCategoryData]);

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', darkMode);
//     localStorage.setItem('darkMode', darkMode);

//     fetchAllData();
//     const interval = setInterval(fetchAllData, 15000); // 15s refresh
//     return () => clearInterval(interval);
//   }, [darkMode, fetchAllData]);

//   const handleCategorySelect = (category) => {
//     const slug = category.toLowerCase().replace(/\s+/g, '-');
//     navigate(`/map?category=${slug}`);
//   };

//   const handleLogout = () => { logout(); navigate('/login'); };
//   const toggleDarkMode = () => setDarkMode(prev => !prev);

//   return (
//     <div style={{
//       padding: '24px',
//       minHeight: '100vh',
//       background: darkMode ? '#111827' : '#f3f4f6',
//       color: darkMode ? '#f9fafb' : '#111827',
//       transition: 'background 0.3s, color 0.3s'
//     }}>
//       {/* Header */}
//       <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//         <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: darkMode ? '#fff' : '#111827' }}>ArcGIS Pro Dashboard</Link>
//         <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
//           <User style={{ width: '20px', height: '20px' }} />
//           <span>{currentUser?.username || currentUser?.email}</span>
//           <button onClick={toggleDarkMode} style={{ padding: '6px 12px', borderRadius: '4px', background: darkMode ? '#f9fafb' : '#1f2937', color: darkMode ? '#111827' : '#f9fafb' }}>
//             {darkMode ? '☀️ Light' : '🌙 Dark'}
//           </button>
//           <button onClick={handleLogout} style={{ padding: '6px 12px', borderRadius: '4px', background: '#ef4444', color: '#fff' }}>Logout</button>
//         </div>
//       </header>

//       {/* Dashboard Grid */}
//       <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
//         {DASHBOARD_CATEGORIES.map(({ key, icon, color }) => (
//           <DashboardCard
//             key={key}
//             category={key}
//             Icon={icon}
//             color={color}
//             extraInfo={loadingReports[key] ? { text: 'Loading...', badges: [] } : reports[key]}
//             onSelect={handleCategorySelect}
//           />
//         ))}
//       </main>
//     </div>
//   );
// }

// export default SystemDashboard;

//professional
// src/pages/SystemDashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Building2, MapPin, Footprints, TreeDeciduous, Car, Trash2, Zap,
  Droplet, Waves, Fence, Lightbulb, Trees, User, Map, Upload, LogOut, Sun, Moon
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';

const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');
const DASHBOARD_CATEGORIES = [
  { key: 'Buildings', icon: Building2, color: '#f87171' },
  { key: 'Roads', icon: MapPin, color: '#fbbf24' },
  { key: 'Footpaths', icon: Footprints, color: '#4ade80' },
  { key: 'Vegetation', icon: TreeDeciduous, color: '#34d399' },
  { key: 'Parking', icon: Car, color: '#818cf8' },
  { key: 'Solid Waste', icon: Trash2, color: '#a78bfa' },
  { key: 'Electricity', icon: Zap, color: '#f472b6' },
  { key: 'Water Supply', icon: Droplet, color: '#60a5fa' },
  { key: 'Drainage System', icon: Waves, color: '#22d3ee' },
  { key: 'Vimbweta', icon: Fence, color: '#facc15' },
  { key: 'Security Lights', icon: Lightbulb, color: '#bef264' },
  { key: 'Recreational Areas', icon: Trees, color: '#e879f9' },
];

const checkTokenValidity = (token) => {
  if (!token) return false;
  try { const payload = JSON.parse(atob(token.split('.')[1])); return payload.exp * 1000 > Date.now(); }
  catch { return false; }
};

const generateShortReport = (category, features) => {
  if (!features || features.length === 0) return { text: 'No data', badges: [] };
  const badges = [];
  switch (category) {
    case 'Roads': {
      const good = features.filter(f => f.properties?.condition === 'good').length;
      const poor = features.filter(f => f.properties?.condition === 'poor').length;
      badges.push({ label: 'Good', value: good, color: '#10b981' });
      badges.push({ label: 'Poor', value: poor, color: '#ef4444' });
      return { text: 'Road conditions', badges };
    }
    case 'Buildings': {
      const res = features.filter(f => f.properties?.type === 'residential').length;
      const com = features.filter(f => f.properties?.type === 'commercial').length;
      badges.push({ label: 'Residential', value: res, color: '#3b82f6' });
      badges.push({ label: 'Commercial', value: com, color: '#facc15' });
      return { text: 'Building types', badges };
    }
    default:
      badges.push({ label: 'Count', value: features.length, color: '#818cf8' });
      return { text: `${features.length} features`, badges };
  }
};

function SystemDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [reports, setReports] = useState({});
  const [loadingReports, setLoadingReports] = useState({});

  const fetchCategoryData = useCallback(async (categoryKey) => {
    const token = localStorage.getItem('token');
    if (!token || !checkTokenValidity(token)) { navigate('/login'); return; }

    setLoadingReports(prev => ({ ...prev, [categoryKey]: true }));
    try {
      const res = await axios.get(`${SPATIAL_API_BASE}/geojson/${categoryKey.toLowerCase().replace(/\s+/g, '-')}`, { headers: { Authorization: `Bearer ${token}` } });
      const features = res.data.features || [];
      setReports(prev => ({ ...prev, [categoryKey]: generateShortReport(categoryKey, features) }));
    } catch {
      setReports(prev => ({ ...prev, [categoryKey]: { text: 'Failed to load', badges: [] } }));
    } finally {
      setLoadingReports(prev => ({ ...prev, [categoryKey]: false }));
    }
  }, [navigate]);

  const fetchAllData = useCallback(() => DASHBOARD_CATEGORIES.forEach(c => fetchCategoryData(c.key)), [fetchCategoryData]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);

    fetchAllData();
    const interval = setInterval(fetchAllData, 15000);
    return () => clearInterval(interval);
  }, [darkMode, fetchAllData]);

  const handleCategorySelect = (category) => navigate(`/map?category=${category.toLowerCase().replace(/\s+/g, '-')}`);
  const handleLogout = () => { logout(); navigate('/login'); };
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: darkMode ? '#111827' : '#f3f4f6', color: darkMode ? '#f9fafb' : '#111827', transition: 'all 0.3s' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: darkMode ? '#fff' : '#111827' }}>ArcGIS Pro Dashboard</Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <User style={{ width: '20px', height: '20px' }} />
          <span>{currentUser?.username || currentUser?.email}</span>
          <button onClick={toggleDarkMode} style={{ padding: '6px 12px', borderRadius: '4px', background: darkMode ? '#f9fafb' : '#1f2937', color: darkMode ? '#111827' : '#f9fafb' }}>{darkMode ? '☀️ Light' : '🌙 Dark'}</button>
          <button onClick={handleLogout} style={{ padding: '6px 12px', borderRadius: '4px', background: '#ef4444', color: '#fff' }}>Logout</button>
        </div>
      </header>

      {/* Dashboard Grid */}
      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {DASHBOARD_CATEGORIES.map(({ key, icon, color }) => (
          <DashboardCard
            key={key}
            category={key}
            Icon={icon}
            color={color}
            extraInfo={loadingReports[key] ? { text: 'Loading...', badges: [] } : reports[key]}
            onSelect={handleCategorySelect}
          />
        ))}
      </main>
    </div>
  );
}

export default SystemDashboard;
