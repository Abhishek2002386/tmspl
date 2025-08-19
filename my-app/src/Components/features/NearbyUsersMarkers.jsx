import React, { useState, useEffect } from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import dataService from '../../services/dataService.js';

// Create custom farmer icon
const createFarmerIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 35px;
        height: 45px;
      ">
        <div style="
          width: 35px;
          height: 35px;
          background: #22C55E;
          border: 4px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1000;
        "></div>
        <div style="
          position: absolute;
          top: 7px;
          left: 7px;
          z-index: 1001;
          font-size: 14px;
          transform: rotate(45deg);
        ">🌾</div>
      </div>
    `,
    className: 'farmer-marker',
    iconSize: [35, 45],
    iconAnchor: [17, 40]
  });
};

// Create custom buyer icon
const createBuyerIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 35px;
        height: 45px;
      ">
        <div style="
          width: 35px;
          height: 35px;
          background: #F59E0B;
          border: 4px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1000;
        "></div>
        <div style="
          position: absolute;
          top: 7px;
          left: 7px;
          z-index: 1001;
          font-size: 14px;
          transform: rotate(45deg);
        ">🛒</div>
      </div>
    `,
    className: 'buyer-marker',
    iconSize: [35, 45],
    iconAnchor: [17, 40]
  });
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

const NearbyUsersMarkers = ({ userLocation, searchRadius = 3000, onUsersUpdate }) => {
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = dataService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (!userLocation || !currentUser) {
      setNearbyUsers([]);
      return;
    }

    const [userLat, userLng] = userLocation;
    
    // Get users of opposite type (if logged in as farmer, show buyers and vice versa)
    const targetUserType = currentUser.userType === 'farmer' ? 'buyer' : 'farmer';
    const allTargetUsers = dataService.getUsersByType(targetUserType);
    
    // Filter users within the specified radius
    const effectiveRadius = searchRadius || 3000; // Use the exact radius passed from parent or 3km default
    
    const usersWithinRadius = allTargetUsers.filter(user => {
      if (!user.location || !user.location.latitude || !user.location.longitude) {
        return false;
      }
      
      const distance = calculateDistance(
        userLat, userLng,
        parseFloat(user.location.latitude), parseFloat(user.location.longitude)
      );
      
      return distance <= effectiveRadius;
    }).map((user, index) => ({
      ...user,
      distance: calculateDistance(
        userLat, userLng,
        parseFloat(user.location.latitude), parseFloat(user.location.longitude)
      ),
      // Add small offset for markers that are very close to prevent overlapping
      displayLat: parseFloat(user.location.latitude) + (index * 0.0001),
      displayLng: parseFloat(user.location.longitude) + (index * 0.0001)
    })).sort((a, b) => a.distance - b.distance); // Sort by distance

    setNearbyUsers(usersWithinRadius);
    
    // Notify parent component about the count
    if (onUsersUpdate) {
      onUsersUpdate(usersWithinRadius.length);
    }
  }, [userLocation, searchRadius, currentUser]);

  if (!userLocation || !currentUser || nearbyUsers.length === 0) {
    return null;
  }

  return (
    <>
      {nearbyUsers.map((user, index) => (
        <Marker
          key={`${user.mobileNumber}-${index}`}
          position={[user.displayLat || parseFloat(user.location.latitude), user.displayLng || parseFloat(user.location.longitude)]}
          icon={user.type === 'farmer' ? createFarmerIcon() : createBuyerIcon()}
          zIndexOffset={1000 + index} // Ensure markers appear above other elements
        >
          <Popup maxWidth={250}>
            <div className="p-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-lg">
                  {user.type === 'farmer' ? '🌾' : '🛒'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user.type === 'farmer' ? user.farmerName : user.buyerName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {user.type === 'farmer' ? 'Farmer' : 'Buyer'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">📍</span>
                  <span className="text-gray-700">
                    {user.village || user.location || 'Location not specified'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">📱</span>
                  <span className="text-gray-700">{user.mobileNumber}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">📏</span>
                  <span className="text-blue-600 font-medium">
                    {user.distance < 1000 
                      ? `${Math.round(user.distance)}m away`
                      : `${(user.distance / 1000).toFixed(1)}km away`
                    }
                  </span>
                </div>
                
                {user.type === 'farmer' && user.totalLandBigha && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">🌱</span>
                    <span className="text-green-600 text-xs">
                      Land: {user.totalLandBigha} Bigha
                    </span>
                  </div>
                )}
                
                {user.type === 'buyer' && user.state && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">🏛️</span>
                    <span className="text-orange-600 text-xs">
                      {user.state}, {user.district}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-2 border-t border-gray-200">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
                  Contact {user.type === 'farmer' ? 'Farmer' : 'Buyer'}
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default NearbyUsersMarkers;
