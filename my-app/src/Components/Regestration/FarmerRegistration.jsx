import React from "react"
import { useState } from "react"
import { User, Phone, MapPin, Upload, ArrowLeft, Check, Warehouse, Camera } from 'lucide-react'
import { useNavigate } from "react-router-dom"

export default function FarmerRegistration() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    farmerName: "",
    gender: "",
    profilePhoto: null,
    mobileNumber: "",
    otp: "",
    email: "",
    state: "",
    district: "",
    subDistrict: "",
    village: "",
    pinCode: "",
    totalLandBigha: "",
    harvestingLandBigha: "",
    aadharCard: null,
    agreeTerms: false
  })
  const [errors, setErrors] = useState({})
  const [otpSent, setOtpSent] = useState(false)
  const [mobileVerified, setMobileVerified] = useState(false)
  const [aadharPreview, setAadharPreview] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ]

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }))
  }

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [fieldName]: "File size should be less than 5MB" }))
        return
      }
      
      // Validate file format
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [fieldName]: "Please upload JPG, PNG or PDF file only" }))
        return
      }

      setFormData(prev => ({ ...prev, [fieldName]: file }))
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          // Set appropriate preview based on field name
          if (fieldName === 'aadharCard') {
            setAadharPreview(e.target?.result)
          } else if (fieldName === 'profilePhoto') {
            setProfilePreview(e.target?.result)
          }
        }
        reader.readAsDataURL(file)
      }
      
      // Clear error
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
  }

  const sendOTP = async () => {
    if (formData.mobileNumber.length === 10) {
      try {
        const response = await fetch('https://api.agrihouse.com/api/farmer/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mobileNumber: formData.mobileNumber
          })
        });

        const data = await response.json();
        console.log('Send OTP Response:', data); // For network tab monitoring

        if (response.ok) {
          setOtpSent(true);
          alert("OTP sent to " + formData.mobileNumber);
        } else {
          alert(data.message || "Failed to send OTP");
        }
      } catch (error) {
        console.error('Send OTP Error:', error);
        // For testing purposes
        setOtpSent(true);
        alert("Test Mode: OTP sent! Use '123456'");
      }
    }
  }

  const verifyOTP = async () => {
    try {
      const response = await fetch('https://api.agrihouse.com/api/farmer/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mobileNumber: formData.mobileNumber,
          otp: formData.otp
        })
      });

      const data = await response.json();
      console.log('Verify OTP Response:', data); // For network tab monitoring

      if (response.ok) {
        setMobileVerified(true);
        alert("Mobile number verified successfully!");
      } else {
        setErrors(prev => ({ ...prev, otp: "Invalid OTP" }));
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      // For testing purposes
      if (formData.otp === "123456") {
        setMobileVerified(true);
        alert("Test Mode: Mobile number verified successfully!");
      } else {
        setErrors(prev => ({ ...prev, otp: "Invalid OTP" }));
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.farmerName.trim()) newErrors.farmerName = "This field is required"
    if (!formData.gender) newErrors.gender = "Please select your gender"
    if (!formData.totalLandBigha) newErrors.totalLandBigha = "Please enter total land area"
    else if (formData.totalLandBigha <= 0) newErrors.totalLandBigha = "Total land area must be greater than 0"
    if (!formData.harvestingLandBigha) newErrors.harvestingLandBigha = "Please enter harvesting land area"
    else if (formData.harvestingLandBigha <= 0) newErrors.harvestingLandBigha = "Harvesting land area must be greater than 0"
    else if (parseFloat(formData.harvestingLandBigha) > parseFloat(formData.totalLandBigha)) 
      newErrors.harvestingLandBigha = "Harvesting land cannot be greater than total land"
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "This field is required"
    else if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Please enter a valid 10-digit mobile number"
    if (!mobileVerified) newErrors.mobileNumber = "Please verify your mobile number"
    if (!formData.email.trim()) newErrors.email = "This field is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address"
    if (!formData.state) newErrors.state = "This field is required"
    if (!formData.district.trim()) newErrors.district = "This field is required"
    if (!formData.subDistrict.trim()) newErrors.subDistrict = "This field is required"
    if (!formData.village.trim()) newErrors.village = "This field is required"
    if (!formData.pinCode.trim()) newErrors.pinCode = "This field is required"
    else if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = "Please enter a valid 6-digit PIN code"
    if (!formData.aadharCard) newErrors.aadharCard = "This field is required"
    if (!formData.agreeTerms) newErrors.agreeTerms = "This field is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Create FormData for file upload
        const formDataToSend = new FormData();
        
        // Add all form fields to FormData
        Object.keys(formData).forEach(key => {
          if (key === 'aadharCard' || key === 'profilePhoto') {
            if (formData[key]) {
              formDataToSend.append(key, formData[key]);
            }
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });

        const response = await fetch('https://api.agrihouse.com/api/farmer/register', {
          method: 'POST',
          body: formDataToSend // Using FormData for file upload
        });

        const data = await response.json();
        console.log('Registration Response:', data); // For network tab monitoring

        if (response.ok) {
          alert("Registration successful!");
          // You can add navigation here
        } else {
          alert(data.message || "Registration failed");
        }
      } catch (error) {
        console.error('Registration Error:', error);
        // For testing purposes
        console.log("Form Data being sent:", formData);
        alert("Test Mode: Registration successful! Check console for form data.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          
          <div className="text-center">
            <div className="flex flex-col items-center justify-center mb-4">
              <User className="h-12 w-12 text-green-600 mr-3" />
              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Farmer Registration
              </h1>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                
              </h1>
            </div>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6">Join our marketplace and start selling your crops</p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            
            {/* Personal Information */}
            <div>
              <h2 className=" font-semibold text-gray-900 mb-6 flex items-center sm:text-xl md:text-2xl">
                <User className="h-6 w-6 mr-2 text-green-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Farmer Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farmer Name *
                  </label>
                  <input
                    type="text"
                    name="farmerName"
                    value={formData.farmerName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.farmerName && <p className="text-red-500 text-sm mt-1">{errors.farmerName}</p>}
                </div>
                
                {/* Profile Photo */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      {profilePreview ? (
                        <img src={profilePreview || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="profilePhoto"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'profilePhoto')}
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
                </div>
              </div>

              {/* Gender */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *(लिंग)
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-2">Male (पुरुष)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-2">Female (महिला)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === 'other'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-2">Other (अन्य)</span>
                    </label>
                  </div>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>
            </div>

            {/* Land Details */}
            <div>
              <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Warehouse className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 text-green-600" />
                Land Details 
              </h2>
          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Land Area (Bigha) *
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      name="totalLandBigha"
                      value={formData.totalLandBigha}
                      onChange={handleInputChange}
                      placeholder="Enter total land in Bigha"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  {errors.totalLandBigha && <p className="text-red-500 text-sm mt-1">{errors.totalLandBigha}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harvesting Land Area (Bigha) *
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      name="harvestingLandBigha"
                      value={formData.harvestingLandBigha}
                      onChange={handleInputChange}
                      placeholder="Enter harvesting land in Bigha"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  {errors.harvestingLandBigha && <p className="text-red-500 text-sm mt-1">{errors.harvestingLandBigha}</p>}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 text-green-600" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your 10-digit mobile number"
                      maxLength={10}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={sendOTP}
                      disabled={formData.mobileNumber.length !== 10 || mobileVerified}
                      className={`px-4 py-3 rounded-lg text-white disabled:cursor-not-allowed ${
                        mobileVerified 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400'
                      }`}
                    >
                      {mobileVerified ? <Check className="h-4 w-4 text-white" /> : "Send OTP"}
                    </button>
                  </div>
                  {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
                </div>

                {/* OTP Verification */}
                {otpSent && !mobileVerified && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={verifyOTP}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Verify OTP
                      </button>
                    </div>
                    {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                   
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/*  Details */}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit PIN code"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Upload className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 text-green-600" />
                Document Upload
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Card Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  {aadharPreview ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img 
                          src={aadharPreview} 
                          alt="Aadhar Card" 
                          className="max-h-60 w-auto mx-auto rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer" 
                          onClick={() => window.open(aadharPreview, '_blank')}
                        />
                        <div className="absolute top-0 right-0 mt-2 mr-2">
                          <label
                            htmlFor="aadharCard"
                            className="cursor-pointer inline-flex items-center p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                          >
                            <Upload className="h-4 w-4 text-green-600" />
                          </label>
                        </div>
                      </div>
                      <p className="text-green-600 font-medium">| Aadhar Card Uploaded</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <input
                          type="file"
                          id="aadharCard"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'aadharCard')}
                          className="hidden"
                        />
                        <label
                          htmlFor="aadharCard"
                          className="cursor-pointer inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Aadhar Card
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">Supported formats: JPG, PNG(Max 5MB)</p>
                    </div>
                  )}
                </div>
                {errors.aadharCard && <p className="text-red-500 text-sm mt-1">{errors.aadharCard}</p>}
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="border-t pt-8">
              <div className="flex items-start space-x-3 mb-6">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">
                  I agree to the Terms of Service and Privacy Policy *
                </label>
              </div>
              {errors.agreeTerms && <p className="text-red-500 text-sm mb-4">{errors.agreeTerms}</p>}
              
              <button
                type="submit"
                disabled={!mobileVerified}
                className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-colors ${
                  mobileVerified 
                    ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' 
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {mobileVerified ? 'Create Account' : 'Verify Mobile Number First'}
              </button>
              
              <p className="text-center text-gray-600 mt-6">
                Already have an account?{" "}
                <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                  Login here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
