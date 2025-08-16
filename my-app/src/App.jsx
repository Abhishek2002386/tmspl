import { BrowserRouter, Routes, Route } from "react-router-dom"
import React from "react";
import Login from "./Components/Login/Login"
import FarmerRegistration from "./Components/Regestration/FarmerRegistration"
import BuyerRegistration from "./Components/Regestration/BuyerRegistration"
import HomePage from "./Components/Homepage/HomePage";
import { LocationProvider } from "./Components/context/LocationContext"

function App() {
  return (
    <LocationProvider>
      <BrowserRouter>
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/farmer-registration" element={<FarmerRegistration />} />
            <Route path="/buyer-registration" element={<BuyerRegistration />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LocationProvider>
  )
}
export default App