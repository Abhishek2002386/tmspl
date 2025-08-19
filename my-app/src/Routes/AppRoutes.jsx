import React from "react";   // ✅ Add this line
import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import FarmerRegistration from "../pages/auth/FarmerRegistration";
import BuyerRegistration from "../pages/auth/BuyerRegistration";
import HomePage from "../pages/LandingPage/LandingPage";
import { LocationProvider } from "../context/LocationContext";

function AppRoutes() {
  return (
    <LocationProvider>
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/farmer-registration" element={<FarmerRegistration />} />
          <Route path="/buyer-registration" element={<BuyerRegistration />} />
        </Routes>
      </div>
    </LocationProvider>
  );
}

export default AppRoutes;
