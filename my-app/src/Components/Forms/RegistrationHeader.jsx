import React from "react";
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const RegistrationHeader = ({ title, subtitle, icon: Icon = ShoppingCart, iconColor = "text-blue-600" }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-green-600 hover:text-green-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>
      
      <div className="text-center ">
        <div className="flex flex-col items-center justify-center mb-4 ">
          <Icon className={`h-10 w-10 ${iconColor} mr-3`} />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-[25px]">
            {title}
          </h1>
        </div>
        <p className="text-gray-600 text-[16px] mb-6">{subtitle}</p>
      </div>
    </div>
  );
};

export default RegistrationHeader;
