import React from "react";
import { User, Camera, Upload } from 'lucide-react';

const PersonalInformation = ({ 
  formData, 
  onInputChange, 
  onFileUpload, 
  errors, 
  profilePreview,
  userType = "buyer" // "buyer" or "farmer"
}) => {
  const nameField = userType === "buyer" ? "buyerName" : "farmerName";
  const displayName = userType === "buyer" ? "Buyer Name" : "Farmer Name";

  return (
    <div>
      <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center ">
        {userType === "buyer" ? (
  <User className="h-6 w-6 mr-2 text-blue-600" />
) : (
  <User className="h-6 w-6 mr-2 text-green-600" />
)}

        Personal Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {displayName} *
          </label>
          <input
            type="text"
            name={nameField}
            value={formData[nameField]}
            onChange={onInputChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {errors[nameField] && <p className="text-red-500 text-sm mt-1">{errors[nameField]}</p>}
        </div>
        
        {/* Profile Photo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo *
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              {profilePreview ? (
                <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <input
                type="file"
                id="profilePhoto"
                accept="image/*"
                onChange={(e) => onFileUpload(e, 'profilePhoto')}
                className="hidden"
              />
              <label
                htmlFor="profilePhoto"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </label>
            </div>
          </div>
          {errors.profilePhoto && <p className="text-red-500 text-sm mt-1">{errors.profilePhoto}</p>}
        </div>
      </div>

      {/* Gender */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender *
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={onInputChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span className="ml-2">Male</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={onInputChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span className="ml-2">Female </span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="other"
              checked={formData.gender === 'other'}
              onChange={onInputChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span className="ml-2">Other </span>
          </label>
        </div>
        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
      </div>
    </div>
  );
};

export default PersonalInformation;
