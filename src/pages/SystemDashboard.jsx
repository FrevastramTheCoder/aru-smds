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

/**
 * Dashboard page with category cards for spatial data.
 */
function SystemDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
    setTimeout(() => setLoading(false), 500); // Simulate loading
  }, [darkMode]);

  const handleCategorySelect = (category) => {
    const slug = category.toLowerCase().replace(/\s+/g, '-');
    navigate(`/map?category=${slug}`);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="system-dashboard">
      <div className="circle-blue"></div>
      <div className="circle-fuchsia"></div>
      <header className="dashboard-header">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold">Ardhi Spatial System</h1>
        </Link>
        <div className="header-buttons">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{currentUser?.username || currentUser?.email}</span>
          </div>
          <button
            onClick={() => navigate('/map')}
            className="flex items-center space-x-1"
          >
            <Map className="w-5 h-5" />
            <span>Map</span>
          </button>
          <button
            onClick={() => navigate('/data')}
            className="flex items-center space-x-1"
          >
            <Upload className="w-5 h-5" />
            <span>Data</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-header-text">
          <h2>System Dashboard</h2>
          <p>Explore spatial data to support urban planning and sustainability.</p>
        </div>
        <div className="dashboard-grid">
          {DASHBOARD_CATEGORIES.map(({ key, icon, color }) => (
            <DashboardCard
              key={key}
              category={key}
              Icon={icon}
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