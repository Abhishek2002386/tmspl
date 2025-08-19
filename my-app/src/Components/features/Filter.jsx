import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, MapPin, Target, Sliders, ChevronUp, X } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';

const FiltersComponent = ({ isMobile = false }) => {
  const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState('Noida, Uttar Pradesh, India');
  const [distance, setDistance] = useState('3 km');
  const [isDistanceOpen, setIsDistanceOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Get context data and functions
  const {
    userLocation,
    searchLocation: activeSearchLocation,
    handleSearchLocation,
    handleRadiusChange,
    clearSearchLocation
  } = useLocationContext();

  // Update location when userLocation changes from navbar
  useEffect(() => {
    if (userLocation && userLocation.name) {
      setLocation(userLocation.name);
    }
  }, [userLocation]);

  // Send radius change to context
  useEffect(() => {
    const radiusInMeters = parseFloat(distance) * 1000; // Convert km to meters
    if (handleRadiusChange) {
      handleRadiusChange(radiusInMeters);
    }
  }, [distance, handleRadiusChange]);

  const distanceOptions = [
    '1 km',
    '3 km',
    '5 km',
    '10 km',
    '15 km',
    '20 km'
  ];

  // Function to get location suggestions with CORS-friendly services
  const getSuggestions = async (query) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    
    // Try CORS-friendly geocoding services
    const services = [
      {
        name: 'PhotonAPI',
        url: `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`,
        headers: {
          'Accept': 'application/json',
        }
      },
      {
        name: 'OpenCage',
        url: `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=demo&limit=5&language=en&no_annotations=1`,
        headers: {
          'Accept': 'application/json',
        }
      }
    ];

    for (const service of services) {
      try {
        console.log(`Trying ${service.name} for suggestions...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(service.url, {
          headers: service.headers,
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`${service.name} suggestions response:`, data);
          
          let suggestionList = [];
          
          if (service.name === 'PhotonAPI' && data.features) {
            suggestionList = data.features.map((item, index) => ({
              id: `photon_${index}`,
              name: item.properties.name ? 
                `${item.properties.name}, ${item.properties.state || item.properties.country}` :
                `${item.properties.city || item.properties.county}, ${item.properties.state || item.properties.country}`,
              lat: item.geometry.coordinates[1],
              lng: item.geometry.coordinates[0],
              type: item.properties.type,
              importance: 1
            }));
          } else if (service.name === 'OpenCage' && data.results) {
            suggestionList = data.results.map((item, index) => ({
              id: `opencage_${index}`,
              name: item.formatted,
              lat: item.geometry.lat,
              lng: item.geometry.lng,
              type: item.components._type,
              importance: item.confidence / 100
            }));
          }
          
          if (suggestionList.length > 0) {
            setSuggestions(suggestionList);
            setShowSuggestions(true);
            setIsLoadingSuggestions(false);
            return; // Success, exit function
          }
        }
      } catch (error) {
        console.warn(`${service.name} suggestions failed:`, error.message);
        continue;
      }
    }
    
    // If all services fail, create manual suggestions for common locations
    const commonLocations = [
      { id: 'manual_delhi', name: 'Delhi, India', lat: 28.6139, lng: 77.2090 },
      { id: 'manual_mumbai', name: 'Mumbai, India', lat: 19.0760, lng: 72.8777 },
      { id: 'manual_bangalore', name: 'Bangalore, India', lat: 12.9716, lng: 77.5946 },
      { id: 'manual_noida', name: 'Noida, India', lat: 28.5355, lng: 77.3910 },
      { id: 'manual_gurgaon', name: 'Gurgaon, India', lat: 28.4595, lng: 77.0266 }
    ];
    
    const filtered = commonLocations.filter(loc => 
      loc.name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length > 0) {
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
    }
    
    setIsLoadingSuggestions(false);
  };

  // Debounce function for suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getSuggestions(pincode);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [pincode]);

  // Function to search location with CORS-friendly services
  const searchLocation = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Try CORS-friendly geocoding services
    const services = [
      {
        name: 'PhotonAPI',
        url: `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1&lang=en`,
        headers: {
          'Accept': 'application/json',
        }
      },
      {
        name: 'OpenCage',
        url: `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=demo&limit=1&language=en&no_annotations=1`,
        headers: {
          'Accept': 'application/json',
        }
      }
    ];

    // First try the APIs
    for (const service of services) {
      try {
        console.log(`Trying ${service.name} for search...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const response = await fetch(service.url, {
          headers: service.headers,
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.warn(`${service.name} search response not ok: ${response.status}`);
          continue;
        }
        
        const data = await response.json();
        console.log(`${service.name} search response:`, data);
        
        let locationData = null;
        
        if (service.name === 'PhotonAPI' && data.features && data.features.length > 0) {
          const result = data.features[0];
          locationData = {
            lat: result.geometry.coordinates[1],
            lng: result.geometry.coordinates[0],
            name: result.properties.name ? 
              `${result.properties.name}, ${result.properties.state || result.properties.country}` :
              `${result.properties.city || result.properties.county}, ${result.properties.state || result.properties.country}`,
            isSearchLocation: true
          };
        } else if (service.name === 'OpenCage' && data.results && data.results.length > 0) {
          const result = data.results[0];
          locationData = {
            lat: result.geometry.lat,
            lng: result.geometry.lng,
            name: result.formatted,
            isSearchLocation: true
          };
        }
        
        if (locationData) {
          console.log(`Successfully found location with ${service.name}:`, locationData);
          
          // Update location display
          setLocation(locationData.name);
          
          // Send location to context
          if (handleSearchLocation) {
            handleSearchLocation(locationData);
          }
          
          setIsSearching(false);
          return; // Success, exit function
        }
        
      } catch (error) {
        console.warn(`${service.name} search failed:`, error.message);
        continue;
      }
    }
    
    // If APIs fail, try manual coordinate lookup for common locations
    const commonLocations = {
      'delhi': { lat: 28.6139, lng: 77.2090, name: 'Delhi, India' },
      'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, India' },
      'bangalore': { lat: 12.9716, lng: 77.5946, name: 'Bangalore, India' },
      'bengaluru': { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, India' },
      'noida': { lat: 28.5355, lng: 77.3910, name: 'Noida, India' },
      'gurgaon': { lat: 28.4595, lng: 77.0266, name: 'Gurgaon, India' },
      'gurugram': { lat: 28.4595, lng: 77.0266, name: 'Gurugram, India' },
      'hyderabad': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad, India' },
      'pune': { lat: 18.5204, lng: 73.8567, name: 'Pune, India' },
      'kolkata': { lat: 22.5726, lng: 88.3639, name: 'Kolkata, India' },
      'chennai': { lat: 13.0827, lng: 80.2707, name: 'Chennai, India' },
      'ahmedabad': { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad, India' },
      'jaipur': { lat: 26.9124, lng: 75.7873, name: 'Jaipur, India' },
      'lucknow': { lat: 26.8467, lng: 80.9462, name: 'Lucknow, India' },
      'kanpur': { lat: 26.4499, lng: 80.3319, name: 'Kanpur, India' }
    };
    
    const searchKey = query.toLowerCase().trim();
    const foundLocation = commonLocations[searchKey];
    
    if (foundLocation) {
      console.log('Found location in manual database:', foundLocation);
      
      const locationData = {
        lat: foundLocation.lat,
        lng: foundLocation.lng,
        name: foundLocation.name,
        isSearchLocation: true
      };
      
      // Update location display
      setLocation(locationData.name);
      
      // Send location to context
      if (handleSearchLocation) {
        handleSearchLocation(locationData);
      }
      
      setIsSearching(false);
      return;
    }
    
    // If everything fails
    console.error('All location search methods failed');
    alert('Location not found. Please try searching for a major city like Delhi, Mumbai, Bangalore, etc.');
    setIsSearching(false);
  };

  // Handle search on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      searchLocation(pincode);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    setShowSuggestions(false);
    searchLocation(pincode);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setPincode(suggestion.name);
    setShowSuggestions(false);
    
    // Immediately search for the selected suggestion
    const locationData = {
      lat: suggestion.lat,
      lng: suggestion.lng,
      name: suggestion.name,
      isSearchLocation: true
    };
    
    // Update location display
    setLocation(suggestion.name);
    
    // Send location to context
    if (handleSearchLocation) {
      handleSearchLocation(locationData);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur (with delay to allow suggestion clicks)
  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Trigger GPS location request (this will be handled by navbar)
  const handleUseCurrentLocation = () => {
    // Dispatch custom event that navbar can listen to
    window.dispatchEvent(new Event('requestGPSLocation'));
  };

  return (
    <div className={`w-full bg-white rounded-xl border border-gray-200 shadow-sm ${isMobile ? 'mb-4' : ''}`}>
      {/* Header */}
      <div 
        className={`flex items-center justify-between p-4 ${isMobile ? 'cursor-pointer' : 'pb-3'} border-b border-gray-100`}
        onClick={isMobile ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Sliders className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        {isMobile && (
          <div className="transition-transform duration-200">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </div>
        )}
      </div>

      {/* Content - Always visible on desktop, collapsible on mobile */}
      <div className={`${isMobile && !isExpanded ? 'hidden' : 'block'} p-4 space-y-5`}>
        
        {/* Location Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>
          </div>

          {/* Pincode Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Enter pincode, city, or area"
              disabled={isSearching}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              onClick={handleSearchClick}
              disabled={isSearching || !pincode.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>

            {/* Suggestions Dropdown */}
            {showSuggestions && (suggestions.length > 0 || isLoadingSuggestions) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto">
                {isLoadingSuggestions ? (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading suggestions...
                    </div>
                  </div>
                ) : (
                  suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full p-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.name.split(',')[0]}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {suggestion.name}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Use Current Location Button */}
          <button
            onClick={handleUseCurrentLocation}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors text-sm font-medium text-green-700"
          >
            <Target className="h-4 w-4" />
            <span>Use My Current Location</span>
          </button>

          {/* Current Location Display */}
          <div className={`flex items-start gap-2 p-3 border rounded-lg transition-all ${
            userLocation 
              ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' 
              : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
          }`}>
            <Target className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
              userLocation ? 'text-green-600' : 'text-gray-500'
            }`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-xs font-medium ${
                  userLocation ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {userLocation ? 'Live Location' : 'Current Location'}
                </p>
                {userLocation && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{location}</p>
              {userLocation && (
                <p className="text-xs text-gray-500 mt-1">
                  Lat: {userLocation.lat?.toFixed(4)}, Lng: {userLocation.lng?.toFixed(4)}
                </p>
              )}
            </div>
          </div>

          {/* Search Location Display */}
          {activeSearchLocation && (
            <div className="flex items-start gap-2 p-3 border rounded-lg bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-red-700">Search Location</p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-red-600 font-medium">Active</span>
                    </div>
                  </div>
                  <button
                    onClick={clearSearchLocation}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    title="Clear search and use live location"
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{activeSearchLocation.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Lat: {activeSearchLocation.lat?.toFixed(4)}, Lng: {activeSearchLocation.lng?.toFixed(4)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Distance Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            </div>
            <label className="text-sm font-medium text-gray-700">
              Search Radius
            </label>
          </div>

          {/* Distance Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDistanceOpen(!isDistanceOpen)}
              className="w-full px-4 py-3 text-left bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">{distance}</span>
              <ChevronDown 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isDistanceOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {isDistanceOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                {distanceOptions.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => {
                      setDistance(option);
                      setIsDistanceOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-blue-50 transition-colors ${
                      distance === option 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-700'
                    } ${index !== distanceOptions.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {distance === option && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions - Mobile Only */}
        <div className="lg:hidden pt-2">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleUseCurrentLocation}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Target className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Use GPS</span>
            </button>
            <button 
              onClick={handleSearchClick}
              disabled={isSearching || !pincode.trim()}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <Search className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {isSearching ? 'Searching...' : 'Search'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersComponent;