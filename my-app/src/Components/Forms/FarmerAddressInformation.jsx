import React from 'react';
import { MapPin } from 'lucide-react';

export default function FarmerAddressInformation({ 
  formData, 
  onInputChange, 
  errors, 
  indianStates 
}) {
  return (
    <div>
      <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 text-green-600" />
        Address
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
        </div>
        
        {/* Sub District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub District/Tehsil *
          </label>
          <input
            type="text"
            name="subDistrict"
            value={formData.subDistrict}
            onChange={onInputChange}
            placeholder="Enter sub district"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {errors.subDistrict && <p className="text-red-500 text-sm mt-1">{errors.subDistrict}</p>}
        </div>
        
        {/* Village/Town */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Village/Town *
          </label>
          <input
            type="text"
            name="village"
            value={formData.village}
            onChange={onInputChange}
            placeholder="Enter village or town name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
        </div>
      </div>
    </div>
  );
}
