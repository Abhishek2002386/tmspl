import { BrowserRouter, Routes, Route } from "react-router-dom"
import React from "react";
import Login from "./Components/Login/Login"
import FarmerRegistration from "./Components/Regestration/FarmerRegistration"
import BuyerRegistration from "./Components/Regestration/BuyerRegistration"
import HomePage from "./Components/Homepage/HomePage";

function App() {
  return (
    <BrowserRouter>
      
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/farmer-registration" element={<FarmerRegistration />} />
            <Route path="/buyer-registration" element={<BuyerRegistration />} />
          </Routes>
        </div>
       
    
    </BrowserRouter>
  )
}
export default App