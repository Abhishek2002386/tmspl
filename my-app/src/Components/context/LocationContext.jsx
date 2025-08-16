import React, { createContext, useState, useContext, useCallback } from 'react';

// Create Location Context
const LocationContext = createContext();

// Custom hook to use the location context
export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

// Provider component
export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(3000); // Default 3km in meters
  const [searchQuery, setSearchQuery] = useState(''); // Added search query state

  // Handle location update from navbar
  const handleLocationUpdate = useCallback((locationData) => {
    setUserLocation(locationData);
  }, []);
  
  // Handle search location from filter
  const handleSearchLocation = useCallback((locationData) => {
    setSearchLocation(locationData);
    if (locationData && locationData.name) {
      setSearchQuery(locationData.name);
    }
  }, []);

  // Handle radius change from filter
  const handleRadiusChange = useCallback((radiusInMeters) => {
    setSearchRadius(radiusInMeters);
  }, []);

  // Handle search query change
  const handleSearchQueryChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Clear search and revert to live location
  const clearSearchLocation = useCallback(() => {
    setSearchLocation(null);
    setSearchQuery('');
  }, []);

  // The context value that will be provided to consumers
  const contextValue = {
    userLocation,
    searchLocation,
    searchRadius,
    searchQuery,
    handleLocationUpdate,
    handleSearchLocation,
    handleRadiusChange,
    handleSearchQueryChange,
    clearSearchLocation
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};
