import React from "react";
import { Phone } from 'lucide-react';

const ContactInformation = ({ 
  formData, 
  onInputChange, 
  errors,
  mobileError = "",
  otpSent,
  mobileVerified,
  otp,
  otpError = "",
  onSendOTP,
  onVerifyOTP,
  isLoading = false,
  setOtp
}) => {
  const handleOtpChange = (e) => {
    if (setOtp) {
      setOtp(e.target.value);
    } else {
      onInputChange(e);
    }
  };
  return (
    <div>
      <h2 className="text-base sm:text-xl md:text-2xl  font-semibold text-gray-900 mb-6 flex items-center">
        <Phone className="h-6 w-6 mr-2 text-blue-600" />
        Contact Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mobile Number & OTP */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
          <div className="flex space-x-2">
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={onInputChange}
              placeholder="Enter your 10-digit mobile number"
              maxLength={10}
              className={`flex-1 px-4 py-3 border ${errors.mobileNumber || mobileError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={onSendOTP}
              disabled={formData.mobileNumber.length !== 10 || mobileVerified || isLoading}
              className={`px-4 py-3 rounded-lg text-white disabled:cursor-not-allowed ${mobileVerified ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400'}`}
            >
              {isLoading ? 'Sending...' : mobileVerified ? 'Verified' : 'Send OTP'}
            </button>
          </div>
          {(errors.mobileNumber || mobileError) && (
            <p className="text-red-500 text-sm mt-2">{errors.mobileNumber || mobileError}</p>
          )}
          
          {/* OTP Verification */}
          {otpSent && !mobileVerified && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP *</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={onVerifyOTP}
                  disabled={isLoading || !otpSent}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
              {(errors.otp || otpError) && (
                <p className="text-red-500 text-sm mt-1">{errors.otp || otpError}</p>
              )}
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
