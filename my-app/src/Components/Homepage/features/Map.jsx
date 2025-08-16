import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { MapPin, Navigation, RotateCcw, Maximize2, Radio, RefreshCw, Map as MapIcon, Satellite } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocationContext } from '../../context/LocationContext';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom search location pin icon
const createSearchLocationIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 30px;
        height: 40px;
      ">
        <!-- Pin Shape -->
        <div style="
          width: 30px;
          height: 30px;
          background: #EA4335;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
          position: absolute;
          top: 0;
          left: 0;
        "></div>
        <!-- Center Circle -->
        <div style="
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 6px;
          left: 6px;
          z-index: 10;
        "></div>
      </div>
    `,
    className: 'search-location-pin',
    iconSize: [30, 40],
    iconAnchor: [15, 35]
  });
};

// Create custom live location pin icon
const createLiveLocationIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 30px;
        height: 40px;
      ">
        <!-- Pin Shape -->
        <div style="
          width: 30px;
          height: 30px;
          background: #4285F4;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
          position: absolute;
          top: 0;
          left: 0;
        "></div>
        <!-- Center Circle -->
        <div style="
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 6px;
          left: 6px;
          z-index: 10;
        "></div>
      </div>
    `,
    className: 'live-location-pin',
    iconSize: [30, 40],
    iconAnchor: [15, 35]
  });
};

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default to Delhi
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveLocationActive, setIsLiveLocationActive] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [mapType, setMapType] = useState('Map'); // 'Map' or 'Satellite'
  const [mapRef, setMapRef] = useState(null);
  const [currentSearchRadius, setCurrentSearchRadius] = useState(3000); // Default 3km

  // Get context data
  const {
    userLocation: contextUserLocation,
    searchLocation,
    searchRadius
  } = useLocationContext();

  // Central location priority management
  useEffect(() => {
    // Priority 1: Search location (highest priority)
    if (searchLocation) {
      const newLocation = [searchLocation.lat, searchLocation.lng];
      setSearchedLocation(newLocation);
      setMapCenter(newLocation);
      
      // Force map to move to search location
      setTimeout(() => {
        if (mapRef) {
          mapRef.setView(newLocation, 15);
        }
      }, 100);
      return; // Exit early to prevent other location updates
    }
    
    // Priority 2: Live location from navbar (only if no search location)
    if (contextUserLocation && !searchLocation) {
      const newLocation = [contextUserLocation.lat, contextUserLocation.lng];
      setUserLocation(newLocation);
      setMapCenter(newLocation);
      setIsLiveLocationActive(true);
      setLocationAccuracy(contextUserLocation.accuracy || 50);
      
      // Move map to live location
      setTimeout(() => {
        if (mapRef) {
          mapRef.setView(newLocation, 12);
        }
      }, 100);
    }
    
    // Clear searched location if search location is null
    if (!searchLocation) {
      setSearchedLocation(null);
    }
  }, [searchLocation, contextUserLocation, mapRef]);

  // Handle search radius change
  useEffect(() => {
    if (searchRadius) {
      setCurrentSearchRadius(searchRadius);
    }
  }, [searchRadius]);

  // Fallback location detection on component mount
  useEffect(() => {
    // Only get fallback location if no context location and no search location
    if (!contextUserLocation && !searchLocation && !userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const newLocation = [latitude, longitude];
          setUserLocation(newLocation);
          setIsLiveLocationActive(true);
          setLocationAccuracy(accuracy);
          setMapCenter(newLocation);
        },
        (error) => {
          console.log('Location access denied:', error);
          setIsLiveLocationActive(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        }
      );
    }
  }, []); // Only run on mount

  const LocationMarker = () => {
    const map = useMap();

    useEffect(() => {
      // Move map to user location when it changes
      if (userLocation) {
        map.setView(userLocation, 15);
      }
    }, [userLocation, map]);

    useEffect(() => {
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setUserLocation([lat, lng]);
        setIsLiveLocationActive(false); // Manual click turns off live location
      });

      return () => {
        map.off('click');
      };
    }, [map]);

    return userLocation ? (
      <>

      

        {/* Search Radius Circle around Live Location - Only show when no search location is active */}
        {isLiveLocationActive && !searchedLocation && (
          <Circle
            center={userLocation}
            radius={currentSearchRadius}
            pathOptions={{
              color: '#4285F4',
              fillColor: '#4285F4',
              fillOpacity: 0.05,
              weight: 5,
              opacity: 1,
              dashArray: '10, 5' // Dashed line for search radius
            }}
          />
        )}
        
        {/* Location Marker */}
        <Marker 
          position={userLocation}
          icon={isLiveLocationActive ? createLiveLocationIcon() : L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
          })}
        >
          <Popup>
            <div className="text-center">
              <div className="flex items-center gap-2 mb-2">
                {isLiveLocationActive && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <Radio className="h-3 w-3 text-green-500" />
                  </div>
                )}
                <p className="font-medium">
                  {isLiveLocationActive ? 'Live Location' : 'Your Location'}
                </p>
              </div>
              
              {contextUserLocation && contextUserLocation.name && (
                <p className="text-sm text-green-600 font-medium mb-1">
                  {contextUserLocation.name}
                </p>
              )}
              
              <p className="text-sm text-gray-600">
                {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
              </p>
              
              {isLiveLocationActive && locationAccuracy && (
                <p className="text-xs text-blue-600 mt-1">
                  Accuracy: ±{Math.round(locationAccuracy)}m
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      </>
    ) : null;
  };

  // Search Location Marker Component
  const SearchLocationMarker = () => {
    return searchedLocation ? (
      <>
        {/* Search Location Marker */}
        <Marker 
          position={searchedLocation}
          icon={createSearchLocationIcon()}
        >
          <Popup>
            <div className="text-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="font-medium">Search Location</p>
              </div>
              
              {searchLocation && searchLocation.name && (
                <p className="text-sm text-red-600 font-medium mb-1">
                  {searchLocation.name}
                </p>
              )}
              
              <p className="text-sm text-gray-600">
                {searchedLocation[0].toFixed(4)}, {searchedLocation[1].toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Search Radius Circle */}
        <Circle
          center={searchedLocation}
          radius={currentSearchRadius}
          pathOptions={{
            color: '#EA4335',
            fillColor: '#EA4335',
            fillOpacity: 0.1,
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 5' // Dashed line for search radius
          }}
        />
      </>
    ) : null;
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const newLocation = [latitude, longitude];
          setUserLocation(newLocation);
          setIsLiveLocationActive(true);
          setLocationAccuracy(accuracy);
          
          // Only update map center if no search location is active
          if (!searchedLocation) {
            setMapCenter(newLocation);
          }
          
          setIsLoading(false);
        },
        (error) => {
          console.log('Location access denied:', error);
          setIsLiveLocationActive(false);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }
  };

  // Zoom functions
  const zoomIn = () => {
    if (mapRef) {
      mapRef.setZoom(mapRef.getZoom() + 1);
    }
  };

  const zoomOut = () => {
    if (mapRef) {
      mapRef.setZoom(mapRef.getZoom() - 1);
    }
  };

  // Map type toggle
  const toggleMapType = (type) => {
    setMapType(type);
  };

  return (
    <div className="w-full bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Available (0)</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            <MapPin className="h-4 w-4" />
            <span>{isLoading ? 'Getting...' : 'Get Location'}</span>
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Map/Satellite Toggle */}
      <div className="px-4 py-3 border-b">
        <div className="flex rounded-md border border-gray-300 overflow-hidden w-fit">
          <button
            onClick={() => toggleMapType('Map')}
            className={`px-4 py-2 text-sm font-medium border-r border-gray-300 flex items-center gap-2 transition-colors ${
              mapType === 'Map' 
                ? 'bg-gray-100 text-gray-900' 
                : 'bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Map
          </button>
          <button
            onClick={() => toggleMapType('Satellite')}
            className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
              mapType === 'Satellite' 
                ? 'bg-gray-100 text-gray-900' 
                : 'bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            <Satellite className="w-4 h-4" />
            Satellite
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div style={{ height: '400px', width: '100%' }}>
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-10"
            zoomControl={false} // We'll add custom zoom controls
            ref={setMapRef}
          >
            {mapType === 'Map' ? (
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            ) : (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
              />
            )}
            <LocationMarker />
            <SearchLocationMarker />
          </MapContainer>
        </div>

        {/* Custom Zoom Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-col bg-white rounded border border-gray-300 shadow-sm">
          <button 
            className="w-8 h-8 flex items-center justify-center text-lg font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-300 transition-colors"
            onClick={zoomIn}
            title="Zoom In"
          >
            +
          </button>
          <button 
            className="w-8 h-8 flex items-center justify-center text-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={zoomOut}
            title="Zoom Out"
          >
            −
          </button>
        </div>

        {/* Center Location Button */}
        <div className="absolute bottom-4 right-4 z-20">
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="p-3 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 border border-gray-200"
            title="Get Current Location"
          >
            {isLoading ? (
              <RotateCcw className="h-5 w-5 text-gray-600 animate-spin" />
            ) : (
              <Navigation className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Map;
