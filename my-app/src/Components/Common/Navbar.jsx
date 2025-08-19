import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Bell, User, LogOut } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext.jsx';
import dataService from '../../services/dataService.js';

const LocationNavbar = () => {
  const [currentLocation, setCurrentLocation] = useState('');
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Get context functions
  const { handleLocationUpdate } = useLocationContext();

  // Get location name from coordinates using reverse geocoding with multiple fallbacks
  const getLocationName = async (lat, lng) => {
    // Try multiple reverse geocoding services for better mobile compatibility
    const services = [
      {
        name: 'Nominatim',
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`,
        headers: {
          'User-Agent': 'AgriHouse-App/1.0',
          'Accept': 'application/json',
        }
      },
      {
        name: 'BigDataCloud',
        url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
        headers: {
          'Accept': 'application/json',
        }
      }
    ];

    for (const service of services) {
      try {
        console.log(`Trying ${service.name} service...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout per service
        
        const response = await fetch(service.url, {
          headers: service.headers,
          method: 'GET',
          mode: 'cors',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.warn(`${service.name} API response not ok: ${response.status}`);
          continue; // Try next service
        }
        
        const data = await response.json();
        console.log(`${service.name} response:`, data);
        
        let locationName = null;
        
        if (service.name === 'Nominatim' && data && data.address) {
          const { 
            village, town, city, county, state_district, state, country,
            suburb, neighbourhood, road, house_number
          } = data.address;
          
          // Build location name with better priority
          const primaryLocation = city || town || village || suburb || neighbourhood || county;
          const secondaryLocation = state || state_district || country;
          
          if (primaryLocation && secondaryLocation) {
            locationName = `${primaryLocation}, ${secondaryLocation}`;
          } else if (primaryLocation) {
            locationName = primaryLocation;
          } else if (secondaryLocation) {
            locationName = secondaryLocation;
          }
        } 
        else if (service.name === 'BigDataCloud' && data) {
          const city = data.city || data.locality || data.principalSubdivision;
          const state = data.principalSubdivision || data.countryName;
          
          if (city && state) {
            locationName = `${city}, ${state}`;
          } else if (city) {
            locationName = city;
          } else if (state) {
            locationName = state;
          }
        }
        
        // Validate location name quality
        if (locationName && 
            locationName !== 'Unknown Location, Unknown State' && 
            locationName !== 'Unknown Location' && 
            locationName !== 'Unknown State' &&
            locationName.length > 2) {
          console.log(`Successfully got location from ${service.name}:`, locationName);
          return locationName;
        }
        
      } catch (error) {
        console.warn(`${service.name} service failed:`, error.message);
        continue; // Try next service
      }
    }
    
    // If all services fail, return null instead of coordinates
    // The calling function will handle this gracefully
    console.warn('All reverse geocoding services failed');
    return null;
  };

  // Get current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    setCurrentLocation('Getting your location...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude, accuracy } = position.coords;
            setCoordinates({ lat: latitude, lng: longitude });
            
            console.log('Got coordinates:', { latitude, longitude, accuracy });
            
            // Show "Finding location name..." instead of coordinates
            setCurrentLocation('Finding location name...');
            
            // Get location name with extended timeout for mobile
            const locationPromise = getLocationName(latitude, longitude);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 15000) // Increased to 15 seconds for multiple services
            );
            
            let locationName;
            try {
              console.log('Fetching location name...');
              locationName = await Promise.race([locationPromise, timeoutPromise]);
              console.log('Got location name:', locationName);
              
              // Update with the proper location name or fallback to a user-friendly message
              if (locationName && !locationName.startsWith('Location ')) {
                setCurrentLocation(locationName);
              } else {
                // Use a more user-friendly fallback instead of coordinates
                setCurrentLocation('Current Location');
                console.log('Using fallback location display');
              }
            } catch (timeoutError) {
              console.warn('Location name fetch timeout, using fallback display');
              // Use a user-friendly fallback instead of coordinates
              setCurrentLocation('Current Location');
            }
            
            setIsLocationActive(true);
            
            // Send coordinates to context (Map) with the proper name
            if (handleLocationUpdate) {
              handleLocationUpdate({ 
                lat: latitude, 
                lng: longitude, 
                accuracy: accuracy,
                name: locationName && !locationName.startsWith('Location ') 
                  ? locationName 
                  : 'Current Location'
              });
            }
          } catch (error) {
            console.error('Error processing location:', error);
            setCurrentLocation('Error getting location details');
            setIsLocationActive(false);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Location access denied';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location timeout';
              break;
            default:
              errorMessage = 'Location error occurred';
              break;
          }
          
          setCurrentLocation(errorMessage);
          setIsLocationActive(false);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000, // Increased timeout for mobile
          maximumAge: 60000 // Reduced cache time for more frequent updates
        }
      );
    } else {
      setCurrentLocation('Geolocation not supported');
      setIsLocationActive(false);
      setIsLoading(false);
    }
  };

  // Auto-get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Check for logged-in user on mount
  useEffect(() => {
    const user = dataService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

  // Listen for GPS location requests from filter
  useEffect(() => {
    const handleGPSRequest = () => {
      getCurrentLocation();
    };

    window.addEventListener('requestGPSLocation', handleGPSRequest);
    
    return () => {
      window.removeEventListener('requestGPSLocation', handleGPSRequest);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    dataService.logout();
    setCurrentUser(null);
    setShowProfileMenu(false);
    window.location.href = '/'; // Redirect to login page
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between py-2 sm:py-3">
          
          {/* Location Section */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button
              onClick={getCurrentLocation}
              disabled={isLoading}
              className="flex items-center gap-1 sm:gap-2 hover:bg-gray-50 rounded-lg p-1.5 sm:p-2 transition-colors min-w-0 flex-1"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 animate-spin flex-shrink-0" />
              ) : (
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
              )}
              
              <div className="text-left min-w-0 flex-1">
                <p className="text-xs text-gray-500 font-medium">Your Location</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  {currentLocation || 'Tap to get location'}
                </p>
              </div>
            </button>

            {/* Refresh Button - Hidden on very small screens */}
            {!isLoading && currentLocation && (
              <button
                onClick={getCurrentLocation}
                className="hidden sm:block p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                title="Refresh location"
              >
                <RefreshCw className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            {/* Notification - Hidden on very small screens */}
            <button className="hidden sm:flex relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            {/* Profile Section */}
            {currentUser ? (
              <div className="relative profile-menu-container">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                    {getUserInitials(currentUser.farmerName || currentUser.buyerName || 'User')}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs text-gray-500 font-medium">Welcome</p>
                    <p className="text-sm font-semibold text-gray-900 max-w-20 truncate">
                      {currentUser.farmerName || currentUser.buyerName}
                    </p>
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">
                        {currentUser.farmerName || currentUser.buyerName}
                      </p>
                      <p className="text-sm text-gray-500">{currentUser.mobileNumber}</p>
                      <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded mt-1 inline-block">
                        {currentUser.userType === 'farmer' ? '🌾 Farmer' : '🛒 Buyer'}
                      </p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            )}
          </div>
        </div>

        {/* Live Location Status */}
        {isLocationActive && (
          <div className="pb-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-medium">Live location active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationNavbar;