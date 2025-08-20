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

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  MapPin,
  Footprints,
  TreeDeciduous,
  Car,
  Trash2,
  Zap,
  Droplet,
  Waves,
  Fence,
  Lightbulb,
  Trees,
  User,
  Map,
  Upload,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';

function SystemDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [loading, setLoading] = useState(true);

  const DASHBOARD_CATEGORIES = [
    { key: 'Buildings', icon: Building2, color: 'bg-red-400' },
    { key: 'Roads', icon: MapPin, color: 'bg-yellow-400' },
    { key: 'Footpaths', icon: Footprints, color: 'bg-green-400' },
    { key: 'Vegetation', icon: TreeDeciduous, color: 'bg-green-500' },
    { key: 'Parking', icon: Car, color: 'bg-indigo-400' },
    { key: 'Solid Waste', icon: Trash2, color: 'bg-purple-400' },
    { key: 'Electricity', icon: Zap, color: 'bg-pink-400' },
    { key: 'Water Supply', icon: Droplet, color: 'bg-blue-400' },
    { key: 'Drainage System', icon: Waves, color: 'bg-cyan-400' },
    { key: 'Vimbweta', icon: Fence, color: 'bg-yellow-300' },
    { key: 'Security Lights', icon: Lightbulb, color: 'bg-lime-300' },
    { key: 'Recreational Areas', icon: Trees, color: 'bg-pink-300' },
  ];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
    setTimeout(() => setLoading(false), 500); // Simulate loading
  }, [darkMode]);

  const handleCategorySelect = (category) => {
    const slug = category.toLowerCase().replace(/\s+/g, '-');
    navigate(`/map?category=${slug}`);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 relative p-6">
      {/* Background Circles */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-fuchsia-400 rounded-full opacity-30 animate-pulse"></div>

      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Ardhi Spatial System
        </Link>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-200">
            <User className="w-5 h-5" />
            <span>{currentUser?.username || currentUser?.email}</span>
          </div>

          <button
            onClick={() => navigate('/map')}
            className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-blue-500 transition"
          >
            <Map className="w-5 h-5" />
            <span>Map</span>
          </button>

          <button
            onClick={() => navigate('/data')}
            className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-green-500 transition"
          >
            <Upload className="w-5 h-5" />
            <span>Data</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-red-500 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-800" />}
          </button>
        </div>
      </header>

      {/* MAIN DASHBOARD */}
      <main>
        <div className="mb-8 text-gray-800 dark:text-gray-100">
          <h2 className="text-3xl font-bold mb-2">System Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Explore spatial data to support urban planning and sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {DASHBOARD_CATEGORIES.map(({ key, icon: Icon, color }) => (
            <DashboardCard
              key={key}
              category={key}
              Icon={Icon}
              color={color}
              onSelect={handleCategorySelect}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default SystemDashboard;
