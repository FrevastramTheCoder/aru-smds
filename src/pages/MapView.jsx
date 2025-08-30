

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import MapComponent from '../components/MapComponent';

// // ------------------------
// // Debounce helper
// // ------------------------
// function debounce(fn, wait) {
//   let t;
//   return (...args) => {
//     clearTimeout(t);
//     t = setTimeout(() => fn(...args), wait);
//   };
// }

// // ------------------------
// // Retry fetch helper with exponential backoff
// // ------------------------
// const fetchWithRetry = async (url, options, maxRetries = 3, timeout = 45000) => {
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), timeout);
      
//       const response = await axios({
//         ...options,
//         url,
//         signal: controller.signal,
//       });
      
//       clearTimeout(timeoutId);
//       return response;
//     } catch (error) {
//       if (error.response?.status === 404) {
//         console.warn(`Resource not found: ${url}`);
//         throw error;
//       }
      
//       if (error.response?.status === 429) {
//         const retryAfter = error.response.headers['retry-after'] || 5;
//         console.warn(`Rate limited. Retrying after ${retryAfter} seconds...`);
//         await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//         continue;
//       }
      
//       if (i === maxRetries - 1) throw error;
//       console.warn(`Attempt ${i + 1} failed, retrying...`);
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
//     const isExpired = payload.exp * 1000 < Date.now();
//     return !isExpired;
//   } catch {
//     return false;
//   }
// };

// // ------------------------
// // Local storage helper for caching
// // ------------------------
// const useLocalStorageCache = (key, ttl = 3600000) => {
//   const get = useCallback(() => {
//     try {
//       const item = localStorage.getItem(key);
//       if (!item) return null;
      
//       const { value, timestamp } = JSON.parse(item);
//       if (Date.now() - timestamp > ttl) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return value;
//     } catch {
//       return null;
//     }
//   }, [key, ttl]);

//   const set = useCallback((value) => {
//     try {
//       const item = JSON.stringify({
//         value,
//         timestamp: Date.now()
//       });
//       localStorage.setItem(key, item);
//     } catch (error) {
//       console.warn('Could not save to localStorage:', error);
//     }
//   }, [key]);

//   return { get, set };
// };

// // ------------------------
// // MapView Page
// // ------------------------
// function MapView() {
//   const [spatialData, setSpatialData] = useState({});
//   const [selectedType, setSelectedType] = useState('buildings');
//   const [selectedLayers, setSelectedLayers] = useState(new Set(['buildings']));
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [loadingLayers, setLoadingLayers] = useState(new Set());
//   const [mapStats, setMapStats] = useState({});
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredFeatures, setFilteredFeatures] = useState({});
//   const [showFilters, setShowFilters] = useState(false);
//   const [activeFilters, setActiveFilters] = useState({});
//   const [exportProgress, setExportProgress] = useState(0);
//   const [isExporting, setIsExporting] = useState(false);
//   const [failedLayers, setFailedLayers] = useState(new Set());
//   const [availableEndpoints, setAvailableEndpoints] = useState({});
//   const [customColors, setCustomColors] = useState({});
//   const [showColorPicker, setShowColorPicker] = useState(null);

//   const location = useLocation();
//   const navigate = useNavigate();

//   // Cache implementation
//   const spatialCache = useLocalStorageCache('spatial-data-cache', 86400000);
//   const colorCache = useLocalStorageCache('layer-colors', 86400000 * 30);
//   const spatialDataCache = useRef(new Map());
//   const lastBoundsKeyRef = useRef(null);

//   // API configuration
//   const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');
//   const API_ENDPOINTS = {
//     buildings: `${SPATIAL_API_BASE}/geojson/buildings`,
//     roads: `${SPATIAL_API_BASE}/geojson/roads`,
//     footpaths: `${SPATIAL_API_BASE}/geojson/footpaths`,
//     vegetation: `${SPATIAL_API_BASE}/geojson/vegetation`,
//     parking: `${SPATIAL_API_BASE}/geojson/parking`,
//     solid_waste: `${SPATIAL_API_BASE}/geojson/solid-waste`,
//     electricity: `${SPATIAL_API_BASE}/geojson/electricity`,
//     water_supply: `${SPATIAL_API_BASE}/geojson/water-supply`,
//     drainage: `${SPATIAL_API_BASE}/geojson/drainage`,
//     vimbweta: `${SPATIAL_API_BASE}/geojson/vimbweta`,
//     security: `${SPATIAL_API_BASE}/geojson/security`,
//     recreational_areas: `${SPATIAL_API_BASE}/geojson/recreational-areas`,
//     aru_boundary: `${SPATIAL_API_BASE}/geojson/aru-boundary`
//   };

//   const categoryToTypeMap = {
//     buildings: 'buildings',
//     roads: 'roads',
//     footpaths: 'footpaths',
//     vegetation: 'vegetation',
//     parking: 'parking',
//     'solid-waste': 'solid_waste',
//     electricity: 'electricity',
//     'water-supply': 'water_supply',
//     'drainage-system': 'drainage',
//     vimbweta: 'vimbweta',
//     'security-lights': 'security',
//     'recreational-areas': 'recreational_areas',
//     'aru-boundary': 'aru_boundary'
//   };

//   const dataTypes = [
//     { key: 'buildings', label: 'Buildings', hasProperties: true },
//     { key: 'roads', label: 'Roads', hasProperties: true },
//     { key: 'footpaths', label: 'Footpaths', hasProperties: true },
//     { key: 'vegetation', label: 'Vegetation', hasProperties: true },
//     { key: 'parking', label: 'Parking', hasProperties: true },
//     { key: 'solid_waste', label: 'Solid Waste', hasProperties: true },
//     { key: 'electricity', label: 'Electricity', hasProperties: true },
//     { key: 'water_supply', label: 'Water Supply', hasProperties: true },
//     { key: 'drainage', label: 'Drainage System', hasProperties: true },
//     { key: 'vimbweta', label: 'Vimbweta', hasProperties: true },
//     { key: 'security', label: 'Security Lights', hasProperties: true },
//     { key: 'recreational_areas', label: 'Recreational Areas', hasProperties: true },
//     { key: 'aru_boundary', label: 'ARU Boundary', hasProperties: false }
//   ];

//   // Default layer colors
//   const defaultLayerColors = {
//     buildings: '#ff5733',
//     roads: '#2e86de',
//     footpaths: '#28b463',
//     vegetation: '#27ae60',
//     parking: '#f1c40f',
//     solid_waste: '#8e44ad',
//     electricity: '#e67e22',
//     water_supply: '#3498db',
//     drainage: '#16a085',
//     vimbweta: '#d35400',
//     security: '#c0392b',
//     recreational_areas: '#7f8c8d',
//     aru_boundary: '#000000'
//   };

//   // Get the current color for a layer
//   const getLayerColor = useCallback((layer) => {
//     return customColors[layer] || defaultLayerColors[layer];
//   }, [customColors]);

//   // Check authentication on component mount
//   useEffect(() => {
//     const token = localStorage.getItem('token');
    
//     if (!token) {
//       setError('No authentication token found. Please login again.');
//       navigate('/login');
//       return;
//     }
    
//     if (!checkTokenValidity(token)) {
//       setError('Session expired. Please login again.');
//       localStorage.removeItem('token');
//       navigate('/login');
//       return;
//     }

//     const cachedData = spatialCache.get();
//     if (cachedData) {
//       setSpatialData(cachedData);
//     }

//     const savedColors = colorCache.get();
//     if (savedColors) {
//       setCustomColors(savedColors);
//     }

//     validateEndpoints();
//   }, [navigate]);

//   // Validate API endpoints
//   const validateEndpoints = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;
    
//     const endpoints = {};
    
//     for (const [key, url] of Object.entries(API_ENDPOINTS)) {
//       try {
//         await axios.head(url, {
//           headers: { 'Authorization': `Bearer ${token}` },
//           timeout: 5000
//         });
//         endpoints[key] = true;
//       } catch (error) {
//         endpoints[key] = false;
//         console.warn(`Endpoint not available: ${key}`);
//       }
//     }
    
//     setAvailableEndpoints(endpoints);
//     localStorage.setItem('availableEndpoints', JSON.stringify(endpoints));
//   };

//   // Initialize layer from URL query
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const category = params.get('category');
//     const type = category ? (categoryToTypeMap[category] || 'buildings') : 'buildings';
    
//     const available = availableEndpoints[type] !== false;
//     if (available) {
//       setSelectedType(type);
//       setSelectedLayers(new Set([type]));
//     } else {
//       setSelectedType('buildings');
//       setSelectedLayers(new Set(['buildings']));
//     }
//   }, [location, availableEndpoints]);

//   // Calculate map statistics
//   useEffect(() => {
//     const stats = {};
//     Object.entries(spatialData).forEach(([layer, features]) => {
//       stats[layer] = {
//         count: features.length,
//         properties: features.reduce((acc, feature) => {
//           if (feature.properties) {
//             Object.entries(feature.properties).forEach(([key, value]) => {
//               if (!acc[key]) acc[key] = new Set();
//               if (value !== null && value !== undefined) {
//                 acc[key].add(value.toString());
//               }
//             });
//           }
//           return acc;
//         }, {})
//       };
//     });
//     setMapStats(stats);
//   }, [spatialData]);

//   // Apply search filter
//   useEffect(() => {
//     if (!searchQuery) {
//       setFilteredFeatures({});
//       return;
//     }

//     const filtered = {};
//     Object.entries(spatialData).forEach(([layer, features]) => {
//       filtered[layer] = features.filter(feature => 
//         feature.properties && 
//         Object.values(feature.properties).some(value => 
//           value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
//         )
//       );
//     });
//     setFilteredFeatures(filtered);
//   }, [searchQuery, spatialData]);

//   // Apply property filters
//   useEffect(() => {
//     if (Object.keys(activeFilters).length === 0) {
//       setFilteredFeatures({});
//       return;
//     }

//     const filtered = {};
//     Object.entries(spatialData).forEach(([layer, features]) => {
//       filtered[layer] = features.filter(feature => {
//         if (!feature.properties) return false;
        
//         return Object.entries(activeFilters).every(([key, values]) => {
//           if (!feature.properties[key]) return false;
//           return values.includes(feature.properties[key].toString());
//         });
//       });
//     });
//     setFilteredFeatures(filtered);
//   }, [activeFilters, spatialData]);

//   // Fetch GeoJSON by bounding box
//   const fetchGeoByBbox = useCallback(
//     debounce(async (layers, bounds, simplify = 0.0001) => {
//       if (!layers || layers.size === 0 || !bounds) return;
      
//       const token = localStorage.getItem('token');
//       if (!token || !checkTokenValidity(token)) {
//         setError('Session expired. Please login again.');
//         localStorage.removeItem('token');
//         navigate('/login');
//         return;
//       }

//       const key = `${Array.from(layers).join('-')}-${bounds.getWest().toFixed(6)}-${bounds.getSouth().toFixed(6)}-${bounds.getEast().toFixed(6)}-${bounds.getNorth().toFixed(6)}`;
//       if (lastBoundsKeyRef.current === key) return;
//       lastBoundsKeyRef.current = key;

//       try {
//         setLoading(true);
//         setError('');
//         setLoadingLayers(prev => new Set([...prev, ...layers]));

//         const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
//         const newSpatialData = { ...spatialData };

//         for (const layer of layers) {
//           if (availableEndpoints[layer] === false) {
//             console.warn(`Skipping ${layer} - endpoint not available`);
//             newSpatialData[layer] = [];
//             continue;
//           }

//           try {
//             const cacheKey = `${layer}-${bbox}-${simplify}`;
//             if (spatialDataCache.current.has(cacheKey)) {
//               newSpatialData[layer] = spatialDataCache.current.get(cacheKey);
//               continue;
//             }

//             const url = API_ENDPOINTS[layer];
//             const resp = await fetchWithRetry(url, {
//               headers: { 
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//               },
//               params: { bbox, simplify: 0.00001 },
//             }, 2, 30000);

//             const fc = resp.data || { type: 'FeatureCollection', features: [] };
//             const features = Array.isArray(fc.features) ? fc.features : [];
            
//             const processedFeatures = features.map(feature => {
//               if (feature.geometry && feature.geometry.type === 'Polygon') {
//                 return ensurePolygonWindingOrder(feature);
//               }
//               return feature;
//             });
            
//             newSpatialData[layer] = processedFeatures;
//             spatialDataCache.current.set(cacheKey, processedFeatures);
            
//             setFailedLayers(prev => {
//               const newSet = new Set(prev);
//               newSet.delete(layer);
//               return newSet;
//             });
//           } catch (err) {
//             console.error(`Error fetching geojson for ${layer}:`, err);
//             newSpatialData[layer] = [];
            
//             setFailedLayers(prev => new Set([...prev, layer]));
            
//             if (err.response?.status === 401) {
//               setError('Authentication failed. Please login again.');
//               localStorage.removeItem('token');
//               navigate('/login');
//               break;
//             } else if (err.response?.status === 404) {
//               setAvailableEndpoints(prev => ({ ...prev, [layer]: false }));
//             }
//           }
//         }

//         setSpatialData(newSpatialData);
//         spatialCache.set(newSpatialData);
        
//       } catch (err) {
//         console.error('Error fetching geojson by bbox:', err);
//         setError('Failed to load features for current view');
//       } finally {
//         setLoading(false);
//         setLoadingLayers(new Set());
//       }
//     }, 800),
//     [navigate, spatialData, availableEndpoints]
//   );

//   // Ensure proper polygon winding order
//   const ensurePolygonWindingOrder = (feature) => {
//     if (!feature.geometry || feature.geometry.type !== 'Polygon') return feature;
    
//     try {
//       const coordinates = feature.geometry.coordinates;
//       if (coordinates.length > 0 && coordinates[0].length >= 3) {
//         const area = calculatePolygonArea(coordinates[0]);
//         if (area > 0) {
//           coordinates[0] = coordinates[0].reverse();
//         }
//       }
      
//       for (let i = 1; i < coordinates.length; i++) {
//         if (coordinates[i].length >= 3) {
//           const area = calculatePolygonArea(coordinates[i]);
//           if (area < 0) {
//             coordinates[i] = coordinates[i].reverse();
//           }
//         }
//       }
      
//       return {
//         ...feature,
//         geometry: {
//           ...feature.geometry,
//           coordinates: coordinates
//         }
//       };
//     } catch (error) {
//       console.warn('Error processing polygon winding order:', error);
//       return feature;
//     }
//   };

//   const calculatePolygonArea = (coordinates) => {
//     let area = 0;
//     const n = coordinates.length;
    
//     for (let i = 0; i < n; i++) {
//       const j = (i + 1) % n;
//       area += coordinates[i][0] * coordinates[j][1];
//       area -= coordinates[j][0] * coordinates[i][1];
//     }
    
//     return area / 2;
//   };

//   // Initial full-layer fetch
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token || !checkTokenValidity(token)) {
//       navigate('/login');
//       return;
//     }

//     setError('');
//     setLoading(true);

//     (async () => {
//       try {
//         setLoadingLayers(new Set([...selectedLayers]));
//         const newSpatialData = { ...spatialData };

//         for (const layer of selectedLayers) {
//           if (availableEndpoints[layer] === false) {
//             console.warn(`Skipping ${layer} - endpoint not available`);
//             newSpatialData[layer] = [];
//             continue;
//           }

//           try {
//             const url = API_ENDPOINTS[layer];
//             const resp = await fetchWithRetry(url, {
//               headers: { 
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//               },
//               params: { simplify: 0.00001 },
//             }, 2, 30000);

//             const fc = resp.data || { type: 'FeatureCollection', features: [] };
//             const features = Array.isArray(fc.features) ? fc.features : [];
            
//             const processedFeatures = features.map(feature => {
//               if (feature.geometry && feature.geometry.type === 'Polygon') {
//                 return ensurePolygonWindingOrder(feature);
//               }
//               return feature;
//             });
            
//             newSpatialData[layer] = processedFeatures;
            
//             setFailedLayers(prev => {
//               const newSet = new Set(prev);
//               newSet.delete(layer);
//               return newSet;
//             });
//           } catch (err) {
//             console.warn(`Initial fetch failed for ${layer}:`, err);
//             newSpatialData[layer] = [];
            
//             setFailedLayers(prev => new Set([...prev, layer]));
            
//             if (err.response?.status === 401) {
//               setError('Authentication failed. Please login again.');
//               localStorage.removeItem('token');
//               navigate('/login');
//               break;
//             } else if (err.response?.status === 404) {
//               setAvailableEndpoints(prev => ({ ...prev, [layer]: false }));
//             }
//           }
//         }

//         setSpatialData(newSpatialData);
//         spatialCache.set(newSpatialData);
//       } catch (err) {
//         console.warn('Initial layer fetch failed:', err);
//       } finally {
//         setLoading(false);
//         setLoadingLayers(new Set());
//       }
//     })();
//   }, [selectedLayers, navigate]);

//   // Export functionality
//   const exportData = async (format = 'geojson') => {
//     setIsExporting(true);
//     setExportProgress(0);
    
//     try {
//       const dataToExport = Object.keys(filteredFeatures).length > 0 ? filteredFeatures : spatialData;
//       const layersToExport = Array.from(selectedLayers);
      
//       if (format === 'geojson') {
//         const blob = new Blob([JSON.stringify(dataToExport)], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `map-export-${new Date().toISOString().split('T')[0]}.json`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//       } else if (format === 'csv') {
//         let csvContent = 'Layer,Feature Count\n';
//         Object.entries(dataToExport).forEach(([layer, features]) => {
//           csvContent += `${layer},${features.length}\n`;
//         });
        
//         const blob = new Blob([csvContent], { type: 'text/csv' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `map-stats-${new Date().toISOString().split('T')[0]}.csv`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//       }
      
//       setExportProgress(100);
//     } catch (error) {
//       console.error('Export failed:', error);
//       setError('Export failed: ' + error.message);
//     } finally {
//       setTimeout(() => {
//         setIsExporting(false);
//         setExportProgress(0);
//       }, 1000);
//     }
//   };

//   // Filter handlers
//   const handleFilterChange = (layer, property, value, checked) => {
//     setActiveFilters(prev => {
//       const newFilters = { ...prev };
//       if (checked) {
//         if (!newFilters[property]) newFilters[property] = [];
//         newFilters[property].push(value);
//       } else {
//         if (newFilters[property]) {
//           newFilters[property] = newFilters[property].filter(v => v !== value);
//           if (newFilters[property].length === 0) {
//             delete newFilters[property];
//           }
//         }
//       }
//       return newFilters;
//     });
//   };

//   const clearFilters = () => {
//     setActiveFilters({});
//     setSearchQuery('');
//   };

//   // Bounds change handler
//   const handleBoundsChange = (bounds) => {
//     if (selectedLayers.size > 0) {
//       fetchGeoByBbox(selectedLayers, bounds, 0.00001);
//     }
//   };

//   // Handle layer selection change
//   const handleLayerToggle = (layerKey) => {
//     if (availableEndpoints[layerKey] === false) {
//       setError(`Layer "${layerKey}" is not available on the server`);
//       return;
//     }
    
//     setSelectedLayers(prev => {
//       const newLayers = new Set(prev);
//       if (newLayers.has(layerKey)) {
//         newLayers.delete(layerKey);
//       } else {
//         newLayers.add(layerKey);
//       }
//       return newLayers;
//     });
//   };

//   // Handle single layer selection
//   const handleSingleLayerSelect = (layerKey) => {
//     if (availableEndpoints[layerKey] === false) {
//       setError(`Layer "${layerKey}" is not available on the server`);
//       return;
//     }
    
//     setSelectedLayers(new Set([layerKey]));
//     setSelectedType(layerKey);
//   };

//   // Handle color change
//   const handleColorChange = useCallback((layer, color) => {
//     const newColors = { ...customColors, [layer]: color };
//     setCustomColors(newColors);
//     colorCache.set(newColors);
//     setShowColorPicker(null);
//   }, [customColors, colorCache]);

//   // Reset color to default
//   const resetColor = useCallback((layer) => {
//     const newColors = { ...customColors };
//     delete newColors[layer];
//     setCustomColors(newColors);
//     colorCache.set(newColors);
//   }, [customColors, colorCache]);

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('spatial-data-cache');
//     navigate('/login');
//   };

//   // Retry failed layers
//   const retryFailedLayers = () => {
//     if (failedLayers.size === 0) return;
    
//     setSelectedLayers(prev => {
//       const newLayers = new Set([...prev, ...failedLayers]);
//       return newLayers;
//     });
//   };

//   // UI styles
//   const containerStyle = { display: 'flex', height: '90vh', gap: '16px' };
//   const cardStyle = { 
//     border: '1px solid #ddd', 
//     borderRadius: '8px', 
//     padding: '16px', 
//     backgroundColor: '#f9f9f9', 
//     height: '100%', 
//     overflowY: 'auto',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
//   };
//   const leftStyle = { width: '350px', ...cardStyle };
//   const rightStyle = { flex: 1, ...cardStyle, padding: 0 };
//   const buttonStyle = { 
//     padding: '8px 12px', 
//     margin: '4px 0', 
//     width: '100%', 
//     borderRadius: '4px', 
//     border: 'none', 
//     color: '#fff', 
//     cursor: 'pointer',
//     transition: 'background-color 0.2s ease'
//   };
//   const checkboxStyle = { marginRight: '8px', cursor: 'pointer' };
//   const inputStyle = {
//     width: '100%',
//     padding: '8px',
//     border: '1px solid #ddd',
//     borderRadius: '4px',
//     marginBottom: '8px'
//   };

//   const displayData = Object.keys(filteredFeatures).length > 0 ? filteredFeatures : spatialData;
//   const totalFeatures = Object.values(displayData).reduce((sum, features) => sum + features.length, 0);

//   return (
//     <div style={containerStyle}>
//       <div style={leftStyle}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//           <h2 style={{ margin: 0 }}>Layers / Elements</h2>
//           <button 
//             onClick={handleLogout}
//             style={{ 
//               padding: '6px 12px', 
//               backgroundColor: '#dc3545', 
//               color: 'white', 
//               border: 'none', 
//               borderRadius: '4px', 
//               cursor: 'pointer' 
//             }}
//           >
//             Logout
//           </button>
//         </div>

//         {/* Search Box */}
//         <div style={{ marginBottom: '16px' }}>
//           <input
//             type="text"
//             placeholder="Search features..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             style={inputStyle}
//           />
//           <div style={{ fontSize: '12px', color: '#666' }}>
//             Searching {totalFeatures} features across {Object.keys(displayData).length} layers
//           </div>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div style={{ 
//             padding: '10px', 
//             backgroundColor: '#ffebee', 
//             border: '1px solid #f44336', 
//             borderRadius: '4px', 
//             marginBottom: '16px' 
//           }}>
//             <p style={{ color: '#d32f2f', margin: 0 }}>{error}</p>
//           </div>
//         )}

//         {/* Failed Layers Alert */}
//         {failedLayers.size > 0 && (
//           <div style={{ 
//             padding: '10px', 
//             backgroundColor: '#fff3cd', 
//             border: '1px solid #ffeaa7', 
//             borderRadius: '4px', 
//             marginBottom: '16px' 
//           }}>
//             <p style={{ color: '#856404', margin: '0 0 10px 0' }}>
//               Failed to load: {Array.from(failedLayers).join(', ')}
//             </p>
//             <button 
//               onClick={retryFailedLayers}
//               style={{ 
//                 padding: '4px 8px', 
//                 backgroundColor: '#ffc107', 
//                 color: '#000', 
//                 border: 'none', 
//                 borderRadius: '4px', 
//                 cursor: 'pointer',
//                 fontSize: '12px'
//               }}
//             >
//               Retry Failed Layers
//             </button>
//           </div>
//         )}

//         {/* Filter Toggle */}
//         <button 
//           onClick={() => setShowFilters(!showFilters)}
//           style={{ ...buttonStyle, backgroundColor: '#6c757d', marginBottom: '16px' }}
//         >
//           {showFilters ? 'Hide Filters' : 'Show Filters'}
//         </button>

//         {/* Filters Panel */}
//         {showFilters && Object.keys(activeFilters).length > 0 && (
//           <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <strong>Active Filters:</strong>
//               <button 
//                 onClick={clearFilters}
//                 style={{ padding: '2px 8px', fontSize: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '2px' }}
//               >
//                 Clear All
//               </button>
//             </div>
//             {Object.entries(activeFilters).map(([key, values]) => (
//               <div key={key} style={{ fontSize: '12px', marginTop: '4px' }}>
//                 {key}: {values.join(', ')}
//               </div>
//             ))}
//           </div>
//         )}

//         <div style={{ marginBottom: '16px' }}>
//           <h4>Select Layers to Display</h4>
//           {dataTypes.map(({ key, label }) => (
//             <div key={key} style={{ marginBottom: '8px' }}>
//               <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
//                 <input
//                   type="checkbox"
//                   checked={selectedLayers.has(key)}
//                   onChange={() => handleLayerToggle(key)}
//                   style={checkboxStyle}
//                   disabled={availableEndpoints[key] === false}
//                 />
//                 <span style={{ 
//                   color: availableEndpoints[key] === false ? '#999' : 'inherit',
//                   textDecoration: availableEndpoints[key] === false ? 'line-through' : 'none'
//                 }}>
//                   {label}
//                   {availableEndpoints[key] === false && ' (Not Available)'}
//                 </span>
//                 {loadingLayers.has(key) && <span style={{ marginLeft: '8px', color: '#007bff' }}>⏳</span>}
//                 {mapStats[key] && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>({mapStats[key].count})</span>}
//               </label>
//               {/* Color Picker for each layer */}
//               <div style={{ marginLeft: '24px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <input
//                   type="color"
//                   value={getLayerColor(key)}
//                   onChange={(e) => handleColorChange(key, e.target.value)}
//                   style={{ width: '30px', height: '20px', padding: '0', border: 'none' }}
//                   disabled={availableEndpoints[key] === false}
//                 />
//                 <button
//                   onClick={() => resetColor(key)}
//                   style={{
//                     padding: '2px 8px',
//                     fontSize: '12px',
//                     backgroundColor: '#6c757d',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: 'pointer'
//                   }}
//                   disabled={availableEndpoints[key] === false || !customColors[key]}
//                 >
//                   Reset
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div>
//           <p><b>Selected Layers:</b> {Array.from(selectedLayers).map(layer => layer.replace(/_/g, ' ')).join(', ')}</p>
//           <p><b>Total Features:</b> {totalFeatures}</p>
//         </div>

//         <div style={{ marginTop: '16px' }}>
//           <h4>Legend</h4>
//           {Object.entries(defaultLayerColors).map(([layer, defaultColor]) => (
//             <div key={layer} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
//               <div 
//                 style={{ 
//                   width: '20px', 
//                   height: '20px', 
//                   backgroundColor: getLayerColor(layer), 
//                   marginRight: '8px', 
//                   border: '1px solid #000'
//                 }}
//               />
//               <span>{layer.replace(/_/g, ' ').toUpperCase()}</span>
//               {mapStats[layer] && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>({mapStats[layer].count})</span>}
//             </div>
//           ))}
//         </div>

//         {loading && <p>Loading map data...</p>}

//         {/* Export Buttons */}
//         <div style={{ marginTop: '16px' }}>
//           <h4>Export</h4>
//           <button 
//             style={{ ...buttonStyle, backgroundColor: '#007bff' }} 
//             onClick={() => exportData('geojson')}
//             disabled={isExporting}
//           >
//             {isExporting ? `Exporting... ${exportProgress}%` : 'Export GeoJSON'}
//           </button>
//           <button 
//             style={{ ...buttonStyle, backgroundColor: '#28a745' }} 
//             onClick={() => exportData('csv')}
//             disabled={isExporting}
//           >
//             Export Statistics CSV
//           </button>
//         </div>

//         <button 
//           style={{ ...buttonStyle, backgroundColor: '#28a745' }} 
//           onClick={() => {
//             const allAvailableLayers = dataTypes
//               .filter(dt => availableEndpoints[dt.key] !== false)
//               .map(dt => dt.key);
//             setSelectedLayers(new Set(allAvailableLayers));
//           }}
//         >
//           Select All Available Layers
//         </button>
//         <button style={{ ...buttonStyle, backgroundColor: '#6c757d' }} onClick={() => setSelectedLayers(new Set())}>
//           Clear All Layers
//         </button>

//         <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
//           <p>Data cached for offline use</p>
//         </div>
//       </div>

//       <div style={rightStyle}>
//         <MapComponent
//           spatialData={displayData}
//           initialCenter={[-6.764538, 39.214464]}
//           onBoundsChange={handleBoundsChange}
//           layerColors={Object.fromEntries(
//             Object.keys(defaultLayerColors).map(layer => [layer, getLayerColor(layer)])
//           )}
//           highlightedFeatures={filteredFeatures}
//         />
//       </div>
//     </div>
//   );
// }

// export default MapView;


//grok
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = () => {
  const [spatialData, setSpatialData] = useState({});
  const [selectedLayers, setSelectedLayers] = useState(new Set(['buildings']));
  const [legendCollapsed, setLegendCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample spatial data (in a real app, this would come from an API)
  const sampleData = {
    buildings: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Main Building', height: '15m' },
          geometry: {
            type: 'Polygon',
            coordinates: [[[-0.1275, 51.507], [-0.127, 51.507], [-0.127, 51.5074], [-0.1275, 51.5074], [-0.1275, 51.507]]]
          }
        }
      ]
    },
    roads: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Main Street', type: 'primary' },
          geometry: {
            type: 'LineString',
            coordinates: [[-0.13, 51.51], [-0.12, 51.51]]
          }
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate data loading
    setSpatialData(sampleData);
  }, []);

  const handleLayerToggle = (layerKey) => {
    setSelectedLayers(prev => {
      const newLayers = new Set(prev);
      if (newLayers.has(layerKey)) {
        newLayers.delete(layerKey);
      } else {
        newLayers.add(layerKey);
      }
      return newLayers;
    });
  };

  const toggleLegend = () => {
    setLegendCollapsed(!legendCollapsed);
  };

  const layerColors = {
    buildings: '#ff5733',
    roads: '#2e86de',
    footpaths: '#28b463',
    vegetation: '#27ae60',
    parking: '#f1c40f',
    solid_waste: '#8e44ad',
    electricity: '#e67e22',
    water_supply: '#3498db',
    drainage: '#16a085',
    vimbweta: '#d35400',
    security: '#c0392b',
    recreational_areas: '#7f8c8d',
    aru_boundary: '#000000'
  };

  const OPENWEATHER_API_KEY = "YOUR_API_KEY"; // Replace with your OpenWeather API key

  // Styles
  const containerStyle = {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden'
  };

  const sidebarStyle = {
    width: '320px',
    background: 'linear-gradient(to bottom, #2c3e50, #1a2530)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '3px 0 15px rgba(0, 0, 0, 0.2)',
    zIndex: 1000
  };

  const logoStyle = {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#1a2530',
    borderBottom: '1px solid #34495e'
  };

  const searchBoxStyle = {
    padding: '10px 15px',
    backgroundColor: '#2c3e50',
    borderBottom: '1px solid #34495e'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#1a2530',
    color: 'white'
  };

  const layersContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '15px'
  };

  const sectionTitleStyle = {
    margin: '15px 0 10px',
    paddingBottom: '8px',
    borderBottom: '2px solid #3498db',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center'
  };

  const layerItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    margin: '5px 0',
    backgroundColor: '#34495e',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  const mapContainerStyle = {
    flex: 1,
    position: 'relative'
  };

  const legendContainerStyle = {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    width: '300px',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  };

  const legendHeaderStyle = {
    padding: '12px 15px',
    backgroundColor: '#2c3e50',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  };

  const legendContentStyle = {
    padding: '15px',
    maxHeight: '300px',
    overflowY: 'auto'
  };

  const legendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  };

  const colorBoxStyle = {
    width: '20px',
    height: '20px',
    marginRight: '10px',
    borderRadius: '3px'
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <div style={logoStyle}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '5px', color: '#3498db' }}>
            <i className="fas fa-map" style={{ marginRight: '10px' }}></i>
            GeoMap Manager
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#ecf0f1' }}>Advanced mapping interface with layer control</p>
        </div>
        
        <div style={searchBoxStyle}>
          <input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={inputStyle}
          />
        </div>
        
        <div style={layersContainerStyle}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={sectionTitleStyle}>
              <i className="fas fa-layer-group" style={{ marginRight: '10px', color: '#3498db' }}></i>
              Landbase Layers
            </h3>
            
            {[
              { key: 'buildings', label: 'Buildings', icon: 'building' },
              { key: 'roads', label: 'Roads', icon: 'road' },
              { key: 'footpaths', label: 'Footpaths', icon: 'walking' },
              { key: 'vegetation', label: 'Vegetation', icon: 'tree' },
              { key: 'parking', label: 'Parking', icon: 'parking' },
              { key: 'solid_waste', label: 'Solid Waste', icon: 'trash' },
              { key: 'electricity', label: 'Electricity', icon: 'bolt' },
              { key: 'water_supply', label: 'Water Supply', icon: 'tint' },
              { key: 'drainage', label: 'Drainage System', icon: 'water' },
              { key: 'vimbweta', label: 'Vimbweta', icon: 'map-marked' },
              { key: 'security', label: 'Security Lights', icon: 'lightbulb' },
              { key: 'recreational_areas', label: 'Recreational Areas', icon: 'baseball-ball' },
              { key: 'aru_boundary', label: 'ARU Boundary', icon: 'draw-polygon' }
            ].map(layer => (
              <div
                key={layer.key}
                style={{
                  ...layerItemStyle,
                  backgroundColor: selectedLayers.has(layer.key) ? '#2980b9' : '#34495e'
                }}
                onClick={() => handleLayerToggle(layer.key)}
              >
                <input
                  type="checkbox"
                  checked={selectedLayers.has(layer.key)}
                  onChange={() => {}}
                  style={{ marginRight: '10px' }}
                />
                <div style={{
                  width: '24px',
                  height: '24px',
                  marginRight: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#2c3e50',
                  borderRadius: '4px'
                }}>
                  <i className={`fas fa-${layer.icon}`}></i>
                </div>
                <span>{layer.label}</span>
              </div>
            ))}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={sectionTitleStyle}>
              <i className="fas fa-globe" style={{ marginRight: '10px', color: '#3498db' }}></i>
              Base Layers
            </h3>
            
            {[
              { key: 'openstreetmap', label: 'OpenStreetMap', icon: 'map' },
              { key: 'carto_light', label: 'Carto Light', icon: 'map-marked' },
              { key: 'esri_imagery', label: 'Esri World Imagery', icon: 'satellite' },
              { key: 'google_satellite', label: 'Google Satellite', icon: 'satellite-dish' },
              { key: 'google_hybrid', label: 'Google Hybrid', icon: 'layer-group' },
              { key: 'nasa_gibs', label: 'NASA GIBS', icon: 'globe-americas' }
            ].map(layer => (
              <div
                key={layer.key}
                style={layerItemStyle}
              >
                <input
                  type="radio"
                  name="baseLayer"
                  defaultChecked={layer.key === 'openstreetmap'}
                  style={{ marginRight: '10px' }}
                />
                <div style={{
                  width: '24px',
                  height: '24px',
                  marginRight: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#2c3e50',
                  borderRadius: '4px'
                }}>
                  <i className={`fas fa-${layer.icon}`}></i>
                </div>
                <span>{layer.label}</span>
              </div>
            ))}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={sectionTitleStyle}>
              <i className="fas fa-cloud-sun" style={{ marginRight: '10px', color: '#3498db' }}></i>
              Weather Overlays
            </h3>
            
            {[
              { key: 'clouds', label: 'Clouds', icon: 'cloud' },
              { key: 'precipitation', label: 'Precipitation', icon: 'cloud-rain' },
              { key: 'temperature', label: 'Temperature', icon: 'thermometer-half' },
              { key: 'wind', label: 'Wind', icon: 'wind' }
            ].map(layer => (
              <div
                key={layer.key}
                style={layerItemStyle}
              >
                <input
                  type="checkbox"
                  style={{ marginRight: '10px' }}
                />
                <div style={{
                  width: '24px',
                  height: '24px',
                  marginRight: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#2c3e50',
                  borderRadius: '4px'
                }}>
                  <i className={`fas fa-${layer.icon}`} style={{ color: '#3498db' }}></i>
                </div>
                <span>{layer.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div style={mapContainerStyle}>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Carto Light">
              <TileLayer
                url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.carto.com/">CARTO</a>'
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Esri World Imagery">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles © Esri"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Google Satellite">
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                attribution="© Google"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Google Hybrid">
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                attribution="© Google"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="NASA GIBS (MODIS True Color)">
              <TileLayer
                url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2023-01-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
                attribution="Imagery © NASA EOSDIS GIBS"
              />
            </LayersControl.BaseLayer>

            {/* Weather Overlays */}
            <LayersControl.Overlay name="Weather - Clouds">
              <TileLayer
                url={`https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
                attribution='&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
                opacity={0.6}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Weather - Precipitation">
              <TileLayer
                url={`https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
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
                attribution='&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
                opacity={0.6}
              />
            </LayersControl.Overlay>

            {/* Render selected spatial data layers */}
            {Object.entries(spatialData).map(([layer, data]) => (
              selectedLayers.has(layer) && (
                <LayersControl.Overlay key={layer} name={layer} checked>
                  <GeoJSON
                    data={data}
                    style={{
                      color: layerColors[layer] || '#000',
                      weight: 2,
                      opacity: 0.7,
                      fillOpacity: 0.5
                    }}
                    onEachFeature={(feature, layer) => {
                      if (feature.properties) {
                        const popupContent = Object.entries(feature.properties)
                          .map(([key, value]) => `<b>${key}:</b> ${value}`)
                          .join('<br>');
                        layer.bindPopup(popupContent);
                      }
                    }}
                  />
                </LayersControl.Overlay>
              )
            ))}
          </LayersControl>
        </MapContainer>
        
        <div style={{
          ...legendContainerStyle,
          height: legendCollapsed ? 'auto' : 'auto'
        }}>
          <div style={legendHeaderStyle} onClick={toggleLegend}>
            <h3 style={{ margin: 0 }}>
              <i className="fas fa-map-legend" style={{ marginRight: '10px' }}></i>
              Map Legend
            </h3>
            <i className={`fas fa-chevron-${legendCollapsed ? 'up' : 'down'}`}></i>
          </div>
          {!legendCollapsed && (
            <div style={legendContentStyle}>
              {Object.entries(layerColors).map(([layer, color]) => (
                <div key={layer} style={legendItemStyle}>
                  <div style={{ ...colorBoxStyle, backgroundColor: color }}></div>
                  <span>{layer.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
              ))}
              <div style={legendItemStyle}>
                <div style={{ ...colorBoxStyle, backgroundColor: '#3498db' }}></div>
                <span>Water Bodies</span>
              </div>
              <div style={legendItemStyle}>
                <div style={{ ...colorBoxStyle, backgroundColor: '#27ae60' }}></div>
                <span>Vegetation</span>
              </div>
              <div style={legendItemStyle}>
                <div style={{ ...colorBoxStyle, backgroundColor: '#c0392b' }}></div>
                <span>Residential Areas</span>
              </div>
              <div style={legendItemStyle}>
                <div style={{ ...colorBoxStyle, backgroundColor: '#7f8c8d' }}></div>
                <span>Roads</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;