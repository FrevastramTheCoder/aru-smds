

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
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Collapsible from 'react-collapsible';
import MapComponent from '../components/MapComponent';
import 'leaflet/dist/leaflet.css';

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

const fetchWithRetry = async (url, options, maxRetries = 3, timeout = 45000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await axios({
        ...options,
        url,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn(`Resource not found: ${url}`);
        throw error;
      }
      
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 5;
        console.warn(`Rate limited. Retrying after ${retryAfter} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      
      if (i === maxRetries - 1) throw error;
      console.warn(`Attempt ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
};

const checkTokenValidity = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch {
    return false;
  }
};

const useLocalStorageCache = (key, ttl = 3600000) => {
  const get = useCallback(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const { value, timestamp } = JSON.parse(item);
      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(key);
        return null;
      }
      return value;
    } catch {
      return null;
    }
  }, [key, ttl]);

  const set = useCallback((value) => {
    try {
      const item = JSON.stringify({
        value,
        timestamp: Date.now()
      });
      localStorage.setItem(key, item);
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }
  }, [key]);

  return { get, set };
};

function MapView() {
  const [spatialData, setSpatialData] = useState({});
  const [selectedType, setSelectedType] = useState('buildings');
  const [selectedLayers, setSelectedLayers] = useState(new Set(['buildings']));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingLayers, setLoadingLayers] = useState(new Set());
  const [mapStats, setMapStats] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFeatures, setFilteredFeatures] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [failedLayers, setFailedLayers] = useState(new Set());
  const [availableEndpoints, setAvailableEndpoints] = useState({});
  const [customColors, setCustomColors] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const spatialCache = useLocalStorageCache('spatial-data-cache', 86400000);
  const colorCache = useLocalStorageCache('layer-colors', 86400000 * 30);
  const spatialDataCache = useRef(new Map());
  const lastBoundsKeyRef = useRef(null);

  const SPATIAL_API_BASE = (import.meta.env.VITE_API_SPATIAL_URL || 'https://smds.onrender.com/api/spatial').replace(/\/$/, '');
  const API_ENDPOINTS = {
    buildings: `${SPATIAL_API_BASE}/geojson/buildings`,
    roads: `${SPATIAL_API_BASE}/geojson/roads`,
    footpaths: `${SPATIAL_API_BASE}/geojson/footpaths`,
    vegetation: `${SPATIAL_API_BASE}/geojson/vegetation`,
    parking: `${SPATIAL_API_BASE}/geojson/parking`,
    solid_waste: `${SPATIAL_API_BASE}/geojson/solid-waste`,
    electricity: `${SPATIAL_API_BASE}/geojson/electricity`,
    water_supply: `${SPATIAL_API_BASE}/geojson/water-supply`,
    drainage: `${SPATIAL_API_BASE}/geojson/drainage`,
    vimbweta: `${SPATIAL_API_BASE}/geojson/vimbweta`,
    security: `${SPATIAL_API_BASE}/geojson/security`,
    recreational_areas: `${SPATIAL_API_BASE}/geojson/recreational-areas`,
    aru_boundary: `${SPATIAL_API_BASE}/geojson/aru-boundary`
  };

  const categoryToTypeMap = {
    buildings: 'buildings',
    roads: 'roads',
    footpaths: 'footpaths',
    vegetation: 'vegetation',
    parking: 'parking',
    'solid-waste': 'solid_waste',
    electricity: 'electricity',
    'water-supply': 'water_supply',
    'drainage-system': 'drainage',
    vimbweta: 'vimbweta',
    'security-lights': 'security',
    'recreational-areas': 'recreational_areas',
    'aru-boundary': 'aru_boundary'
  };

  const dataTypes = [
    { key: 'buildings', label: 'Buildings', hasProperties: true },
    { key: 'roads', label: 'Roads', hasProperties: true },
    { key: 'footpaths', label: 'Footpaths', hasProperties: true },
    { key: 'vegetation', label: 'Vegetation', hasProperties: true },
    { key: 'parking', label: 'Parking', hasProperties: true },
    { key: 'solid_waste', label: 'Solid Waste', hasProperties: true },
    { key: 'electricity', label: 'Electricity', hasProperties: true },
    { key: 'water_supply', label: 'Water Supply', hasProperties: true },
    { key: 'drainage', label: 'Drainage System', hasProperties: true },
    { key: 'vimbweta', label: 'Vimbweta', hasProperties: true },
    { key: 'security', label: 'Security Lights', hasProperties: true },
    { key: 'recreational_areas', label: 'Recreational Areas', hasProperties: true },
    { key: 'aru_boundary', label: 'ARU Boundary', hasProperties: false }
  ];

  const baseLayerTypes = [
    { key: 'OpenStreetMap', label: 'OpenStreetMap' },
    { key: 'Carto Light', label: 'Carto Light' },
    { key: 'Esri World Imagery', label: 'Esri World Imagery' },
    { key: 'Google Satellite', label: 'Google Satellite' },
    { key: 'Google Hybrid', label: 'Google Hybrid' },
    { key: 'NASA GIBS (MODIS True Color)', label: 'NASA GIBS (MODIS True Color)' },
    { key: 'Weather - Clouds', label: 'Weather - Clouds', isOverlay: true },
    { key: 'Weather - Precipitation', label: 'Weather - Precipitation', isOverlay: true },
    { key: 'Weather - Temperature', label: 'Weather - Temperature', isOverlay: true },
    { key: 'Weather - Wind', label: 'Weather - Wind', isOverlay: true }
  ];

  const defaultLayerColors = {
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

  const getLayerColor = useCallback((layer) => {
    return customColors[layer] || defaultLayerColors[layer];
  }, [customColors]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('No authentication token found. Please login again.');
      navigate('/login');
      return;
    }
    
    if (!checkTokenValidity(token)) {
      setError('Session expired. Please login again.');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const cachedData = spatialCache.get();
    if (cachedData) {
      setSpatialData(cachedData);
    }

    const savedColors = colorCache.get();
    if (savedColors) {
      setCustomColors(savedColors);
    }

    validateEndpoints();
  }, [navigate]);

  const validateEndpoints = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const endpoints = {};
    
    for (const [key, url] of Object.entries(API_ENDPOINTS)) {
      try {
        await axios.head(url, {
          headers: { 'Authorization': `Bearer ${token}` },
          timeout: 5000
        });
        endpoints[key] = true;
      } catch (error) {
        endpoints[key] = false;
        console.warn(`Endpoint not available: ${key}`);
      }
    }
    
    setAvailableEndpoints(endpoints);
    localStorage.setItem('availableEndpoints', JSON.stringify(endpoints));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const type = category ? (categoryToTypeMap[category] || 'buildings') : 'buildings';
    
    const available = availableEndpoints[type] !== false;
    if (available) {
      setSelectedType(type);
      setSelectedLayers(new Set([type]));
    } else {
      setSelectedType('buildings');
      setSelectedLayers(new Set(['buildings']));
    }
  }, [location, availableEndpoints]);

  useEffect(() => {
    const stats = {};
    Object.entries(spatialData).forEach(([layer, features]) => {
      stats[layer] = {
        count: features.length,
        properties: features.reduce((acc, feature) => {
          if (feature.properties) {
            Object.entries(feature.properties).forEach(([key, value]) => {
              if (!acc[key]) acc[key] = new Set();
              if (value !== null && value !== undefined) {
                acc[key].add(value.toString());
              }
            });
          }
          return acc;
        }, {})
      };
    });
    setMapStats(stats);
  }, [spatialData]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredFeatures({});
      return;
    }

    const filtered = {};
    Object.entries(spatialData).forEach(([layer, features]) => {
      filtered[layer] = features.filter(feature => 
        feature.properties && 
        Object.values(feature.properties).some(value => 
          value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
    setFilteredFeatures(filtered);
  }, [searchQuery, spatialData]);

  useEffect(() => {
    if (Object.keys(activeFilters).length === 0) {
      setFilteredFeatures({});
      return;
    }

    const filtered = {};
    Object.entries(spatialData).forEach(([layer, features]) => {
      filtered[layer] = features.filter(feature => {
        if (!feature.properties) return false;
        
        return Object.entries(activeFilters).every(([key, values]) => {
          if (!feature.properties[key]) return false;
          return values.includes(feature.properties[key].toString());
        });
      });
    });
    setFilteredFeatures(filtered);
  }, [activeFilters, spatialData]);

  const fetchGeoByBbox = useCallback(
    debounce(async (layers, bounds, simplify = 0.0001) => {
      if (!layers || layers.size === 0 || !bounds) return;
      
      const token = localStorage.getItem('token');
      if (!token || !checkTokenValidity(token)) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const key = `${Array.from(layers).join('-')}-${bounds.getWest().toFixed(6)}-${bounds.getSouth().toFixed(6)}-${bounds.getEast().toFixed(6)}-${bounds.getNorth().toFixed(6)}`;
      if (lastBoundsKeyRef.current === key) return;
      lastBoundsKeyRef.current = key;

      try {
        setLoading(true);
        setError('');
        setLoadingLayers(prev => new Set([...prev, ...layers]));

        const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
        const newSpatialData = { ...spatialData };

        for (const layer of layers) {
          if (availableEndpoints[layer] === false) {
            console.warn(`Skipping ${layer} - endpoint not available`);
            newSpatialData[layer] = [];
            continue;
          }

          try {
            const cacheKey = `${layer}-${bbox}-${simplify}`;
            if (spatialDataCache.current.has(cacheKey)) {
              newSpatialData[layer] = spatialDataCache.current.get(cacheKey);
              continue;
            }

            const url = API_ENDPOINTS[layer];
            const resp = await fetchWithRetry(url, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              params: { bbox, simplify: 0.00001 },
            }, 2, 30000);

            const fc = resp.data || { type: 'FeatureCollection', features: [] };
            const features = Array.isArray(fc.features) ? fc.features : [];
            
            const processedFeatures = features.map(feature => {
              if (feature.geometry && feature.geometry.type === 'Polygon') {
                return ensurePolygonWindingOrder(feature);
              }
              return feature;
            });
            
            newSpatialData[layer] = processedFeatures;
            spatialDataCache.current.set(cacheKey, processedFeatures);
            
            setFailedLayers(prev => {
              const newSet = new Set(prev);
              newSet.delete(layer);
              return newSet;
            });
          } catch (err) {
            console.error(`Error fetching geojson for ${layer}:`, err);
            newSpatialData[layer] = [];
            
            setFailedLayers(prev => new Set([...prev, layer]));
            
            if (err.response?.status === 401) {
              setError('Authentication failed. Please login again.');
              localStorage.removeItem('token');
              navigate('/login');
              break;
            } else if (err.response?.status === 404) {
              setAvailableEndpoints(prev => ({ ...prev, [layer]: false }));
            }
          }
        }

        setSpatialData(newSpatialData);
        spatialCache.set(newSpatialData);
        
      } catch (err) {
        console.error('Error fetching geojson by bbox:', err);
        setError('Failed to load features for current view');
      } finally {
        setLoading(false);
        setLoadingLayers(new Set());
      }
    }, 800),
    [navigate, spatialData, availableEndpoints]
  );

  const ensurePolygonWindingOrder = (feature) => {
    if (!feature.geometry || feature.geometry.type !== 'Polygon') return feature;
    
    try {
      const coordinates = feature.geometry.coordinates;
      if (coordinates.length > 0 && coordinates[0].length >= 3) {
        const area = calculatePolygonArea(coordinates[0]);
        if (area > 0) {
          coordinates[0] = coordinates[0].reverse();
        }
      }
      
      for (let i = 1; i < coordinates.length; i++) {
        if (coordinates[i].length >= 3) {
          const area = calculatePolygonArea(coordinates[i]);
          if (area < 0) {
            coordinates[i] = coordinates[i].reverse();
          }
        }
      }
      
      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: coordinates
        }
      };
    } catch (error) {
      console.warn('Error processing polygon winding order:', error);
      return feature;
    }
  };

  const calculatePolygonArea = (coordinates) => {
    let area = 0;
    const n = coordinates.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    
    return area / 2;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !checkTokenValidity(token)) {
      navigate('/login');
      return;
    }

    setError('');
    setLoading(true);

    (async () => {
      try {
        setLoadingLayers(new Set([...selectedLayers]));
        const newSpatialData = { ...spatialData };

        for (const layer of selectedLayers) {
          if (availableEndpoints[layer] === false) {
            console.warn(`Skipping ${layer} - endpoint not available`);
            newSpatialData[layer] = [];
            continue;
          }

          try {
            const url = API_ENDPOINTS[layer];
            const resp = await fetchWithRetry(url, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              params: { simplify: 0.00001 },
            }, 2, 30000);

            const fc = resp.data || { type: 'FeatureCollection', features: [] };
            const features = Array.isArray(fc.features) ? fc.features : [];
            
            const processedFeatures = features.map(feature => {
              if (feature.geometry && feature.geometry.type === 'Polygon') {
                return ensurePolygonWindingOrder(feature);
              }
              return feature;
            });
            
            newSpatialData[layer] = processedFeatures;
            
            setFailedLayers(prev => {
              const newSet = new Set(prev);
              newSet.delete(layer);
              return newSet;
            });
          } catch (err) {
            console.warn(`Initial fetch failed for ${layer}:`, err);
            newSpatialData[layer] = [];
            
            setFailedLayers(prev => new Set([...prev, layer]));
            
            if (err.response?.status === 401) {
              setError('Authentication failed. Please login again.');
              localStorage.removeItem('token');
              navigate('/login');
              break;
            } else if (err.response?.status === 404) {
              setAvailableEndpoints(prev => ({ ...prev, [layer]: false }));
            }
          }
        }

        setSpatialData(newSpatialData);
        spatialCache.set(newSpatialData);
      } catch (err) {
        console.warn('Initial layer fetch failed:', err);
      } finally {
        setLoading(false);
        setLoadingLayers(new Set());
      }
    })();
  }, [selectedLayers, navigate]);

  const exportData = async (format = 'geojson') => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      const dataToExport = Object.keys(filteredFeatures).length > 0 ? filteredFeatures : spatialData;
      const layersToExport = Array.from(selectedLayers);
      
      if (format === 'geojson') {
        const blob = new Blob([JSON.stringify(dataToExport)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `map-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        let csvContent = 'Layer,Feature Count\n';
        Object.entries(dataToExport).forEach(([layer, features]) => {
          csvContent += `${layer},${features.length}\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `map-stats-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      setExportProgress(100);
    } catch (error) {
      console.error('Export failed:', error);
      setError('Export failed: ' + error.message);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    }
  };

  const handleFilterChange = (layer, property, value, checked) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (checked) {
        if (!newFilters[property]) newFilters[property] = [];
        newFilters[property].push(value);
      } else {
        if (newFilters[property]) {
          newFilters[property] = newFilters[property].filter(v => v !== value);
          if (newFilters[property].length === 0) {
            delete newFilters[property];
          }
        }
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  const handleBoundsChange = (bounds) => {
    if (selectedLayers.size > 0) {
      fetchGeoByBbox(selectedLayers, bounds, 0.00001);
    }
  };

  const handleLayerToggle = (layerKey) => {
    if (availableEndpoints[layerKey] === false) {
      setError(`Layer "${layerKey}" is not available on the server`);
      return;
    }
    
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

  const handleSingleLayerSelect = (layerKey) => {
    if (availableEndpoints[layerKey] === false) {
      setError(`Layer "${layerKey}" is not available on the server`);
      return;
    }
    
    setSelectedLayers(new Set([layerKey]));
    setSelectedType(layerKey);
  };

  const handleColorChange = useCallback((layer, color) => {
    const newColors = { ...customColors, [layer]: color };
    setCustomColors(newColors);
    colorCache.set(newColors);
    setShowColorPicker(null);
  }, [customColors, colorCache]);

  const resetColor = useCallback((layer) => {
    const newColors = { ...customColors };
    delete newColors[layer];
    setCustomColors(newColors);
    colorCache.set(newColors);
  }, [customColors, colorCache]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('spatial-data-cache');
    navigate('/login');
  };

  const retryFailedLayers = () => {
    if (failedLayers.size === 0) return;
    
    setSelectedLayers(prev => {
      const newLayers = new Set([...prev, ...failedLayers]);
      return newLayers;
    });
  };

  const displayData = Object.keys(filteredFeatures).length > 0 ? filteredFeatures : spatialData;
  const totalFeatures = Object.values(displayData).reduce((sum, features) => sum + features.length, 0);

  return (
    <div style={{ display: 'flex', height: '90vh', gap: '16px' }}>
      <div style={{ width: '350px', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#f9f9f9', height: '100%', overflowY: 'auto', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>Layers / Elements</h2>
          <button 
            onClick={handleLogout}
            style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '8px' }}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            Searching {totalFeatures} features across {Object.keys(displayData).length} layers
          </div>
        </div>

        {error && (
          <div style={{ padding: '10px', backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: '4px', marginBottom: '16px' }}>
            <p style={{ color: '#d32f2f', margin: 0 }}>{error}</p>
          </div>
        )}

        {failedLayers.size > 0 && (
          <div style={{ padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', marginBottom: '16px' }}>
            <p style={{ color: '#856404', margin: '0 0 10px 0' }}>
              Failed to load: {Array.from(failedLayers).join(', ')}
            </p>
            <button 
              onClick={retryFailedLayers}
              style={{ padding: '4px 8px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              Retry Failed Layers
            </button>
          </div>
        )}

        <button 
          onClick={() => setShowFilters(!showFilters)}
          style={{ padding: '8px 12px', margin: '4px 0', width: '100%', borderRadius: '4px', border: 'none', color: '#fff', cursor: 'pointer', transition: 'background-color 0.2s ease', backgroundColor: '#6c757d' }}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {showFilters && Object.keys(activeFilters).length > 0 && (
          <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Active Filters:</strong>
              <button 
                onClick={clearFilters}
                style={{ padding: '2px 8px', fontSize: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '2px' }}
              >
                Clear All
              </button>
            </div>
            {Object.entries(activeFilters).map(([key, values]) => (
              <div key={key} style={{ fontSize: '12px', marginTop: '4px' }}>
                {key}: {values.join(', ')}
              </div>
            ))}
          </div>
        )}

        <Collapsible 
          trigger={<span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>Landbase Layers<span style={{ transition: 'transform 0.2s ease' }} className="collapsible-arrow">▼</span></span>} 
          transitionTime={200} 
          easing="ease-in-out"
          triggerStyle={{ background: '#f0f0f0', padding: '10px', marginBottom: '10px', borderRadius: '4px', cursor: 'pointer' }}
          openClassName="open"
        >
          <div style={{ marginBottom: '16px', padding: '8px' }}>
            {dataTypes.map(({ key, label }) => (
              <div key={key} style={{ marginBottom: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedLayers.has(key)}
                    onChange={() => handleLayerToggle(key)}
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                    disabled={availableEndpoints[key] === false}
                  />
                  <span style={{ 
                    color: availableEndpoints[key] === false ? '#999' : 'inherit',
                    textDecoration: availableEndpoints[key] === false ? 'line-through' : 'none'
                  }}>
                    {label}
                    {availableEndpoints[key] === false && ' (Not Available)'}
                  </span>
                  {loadingLayers.has(key) && <span style={{ marginLeft: '8px', color: '#007bff' }}>⏳</span>}
                  {mapStats[key] && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>({mapStats[key].count})</span>}
                </label>
                <div style={{ marginLeft: '24px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={getLayerColor(key)}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    style={{ width: '30px', height: '20px', padding: '0', border: 'none' }}
                    disabled={availableEndpoints[key] === false}
                  />
                  <button
                    onClick={() => resetColor(key)}
                    style={{
                      padding: '2px 8px',
                      fontSize: '12px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    disabled={availableEndpoints[key] === false || !customColors[key]}
                  >
                    Reset
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Collapsible>

        <Collapsible 
          trigger={<span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>Base Layers<span style={{ transition: 'transform 0.2s ease' }} className="collapsible-arrow">▼</span></span>} 
          transitionTime={200} 
          easing="ease-in-out"
          triggerStyle={{ background: '#f0f0f0', padding: '10px', marginBottom: '10px', borderRadius: '4px', cursor: 'pointer' }}
          openClassName="open"
        >
          <div style={{ marginBottom: '16px', padding: '8px' }}>
            {baseLayerTypes.map(({ key, label, isOverlay }) => (
              <div key={key} style={{ marginBottom: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedLayers.has(key)}
                    onChange={() => handleLayerToggle(key)}
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                  />
                  <span>{label}</span>
                </label>
              </div>
            ))}
          </div>
        </Collapsible>

        <Collapsible 
          trigger={<span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>Legend<span style={{ transition: 'transform 0.2s ease' }} className="collapsible-arrow">▼</span></span>} 
          transitionTime={200} 
          easing="ease-in-out"
          triggerStyle={{ background: '#f0f0f0', padding: '10px', marginBottom: '10px', borderRadius: '4px', cursor: 'pointer' }}
          openClassName="open"
        >
          <div style={{ marginTop: '16px', padding: '8px' }}>
            {Object.entries(defaultLayerColors).map(([layer, defaultColor]) => (
              <div key={layer} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <div 
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: getLayerColor(layer), 
                    marginRight: '8px', 
                    border: '1px solid #000'
                  }}
                />
                <span>{layer.replace(/_/g, ' ').toUpperCase()}</span>
                {mapStats[layer] && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>({mapStats[layer].count})</span>}
              </div>
            ))}
          </div>
        </Collapsible>

        <div style={{ marginTop: '16px' }}>
          <p style={{ margin: 0 }}><b>Selected Layers:</b> {Array.from(selectedLayers).map(layer => layer.replace(/_/g, ' ')).join(', ')}</p>
          <p style={{ margin: 0 }}><b>Total Features:</b> {totalFeatures}</p>
        </div>

        {loading && <p style={{ color: '#666' }}>Loading map data...</p>}

        <div style={{ marginTop: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Export</h4>
          <button 
            style={{ padding: '8px 12px', margin: '4px 0', width: '100%', borderRadius: '4px', border: 'none', color: '#fff', cursor: 'pointer', transition: 'background-color 0.2s ease', backgroundColor: '#007bff' }} 
            onClick={() => exportData('geojson')}
            disabled={isExporting}
          >
            {isExporting ? `Exporting... ${exportProgress}%` : 'Export GeoJSON'}
          </button>
          <button 
            style={{ padding: '8px 12px', margin: '4px 0', width: '100%', borderRadius: '4px', border: 'none', color: '#fff', cursor: 'pointer', transition: 'background-color 0.2s ease', backgroundColor: '#28a745' }} 
            onClick={() => exportData('csv')}
            disabled={isExporting}
          >
            Export Statistics CSV
          </button>
        </div>

        <button 
          style={{ padding: '8px 12px', margin: '4px 0', width: '100%', borderRadius: '4px', border: 'none', color: '#fff', cursor: 'pointer', transition: 'background-color 0.2s ease', backgroundColor: '#28a745' }} 
          onClick={() => {
            const allAvailableLayers = dataTypes
              .filter(dt => availableEndpoints[dt.key] !== false)
              .map(dt => dt.key);
            setSelectedLayers(new Set(allAvailableLayers));
          }}
        >
          Select All Available Layers
        </button>
        <button 
          style={{ padding: '8px 12px', margin: '4px 0', width: '100%', borderRadius: '4px', border: 'none', color: '#fff', cursor: 'pointer', transition: 'background-color 0.2s ease', backgroundColor: '#6c757d' }} 
          onClick={() => setSelectedLayers(new Set())}
        >
          Clear All Layers
        </button>

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
          <p style={{ margin: 0 }}>Data cached for offline use</p>
        </div>
      </div>

      <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', height: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <MapComponent
          spatialData={displayData}
          initialCenter={[-6.764538, 39.214464]}
          onBoundsChange={handleBoundsChange}
          layerColors={Object.fromEntries(
            Object.keys(defaultLayerColors).map(layer => [layer, getLayerColor(layer)])
          )}
          highlightedFeatures={filteredFeatures}
        />
      </div>
    </div>
  );
}

export default MapView;