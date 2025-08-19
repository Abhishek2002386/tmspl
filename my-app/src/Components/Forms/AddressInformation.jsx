import React from "react";
import { MapPin } from 'lucide-react';

const AddressInformation = ({ 
  formData, 
  onInputChange, 
  errors,
  indianStates = [],
  title = "Business Address",
  addressType = "business" // "business" or "personal"
}) => {
  return (
    <div>
      <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <MapPin className="h-6 w-6 mr-2 text-blue-600" />
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Complete Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complete {addressType === "business" ? "Business" : ""} Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={onInputChange}
            rows={3}
            placeholder={`Enter complete ${addressType === "business" ? "business" : ""} address`}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${focusColor} focus:border-transparent"
          >
            <option value="">Select your state</option>
            {indianStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
        </div>
        
        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District *
          </label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={onInputChange}
            placeholder="Enter your district"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${focusColor} focus:border-transparent"
          />
          {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
        </div>
        
        {/* Sub District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub District/Tehsil
          </label>
          <input
            type="text"
            name="subDistrict"
            value={formData.subDistrict}
            onChange={onInputChange}
            placeholder="Enter sub district"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${focusColor} focus:border-transparent"
          />
        </div>
        
        {/* Village/City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Village/City *
          </label>
          <input
            type="text"
            name="village"
            value={formData.village}
            onChange={onInputChange}
            placeholder="Enter village or city name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${focusColor} focus:border-transparent"
          />
          {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village}</p>}
        </div>
        
        {/* PIN Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PIN Code *
          </label>
          <input
            type="text"
            name="pinCode"
            value={formData.pinCode}
            onChange={onInputChange}
            placeholder="Enter 6-digit PIN code"
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${focusColor} focus:border-transparent"
          />
          {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddressInformation;
