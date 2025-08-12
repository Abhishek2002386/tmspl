
import React from "react"
import { useState } from "react"
import { User, Phone, MapPin, Upload, ArrowLeft, ShoppingCart, Building2, Camera } from 'lucide-react'

export default function BuyerRegistration() {
  const [formData, setFormData] = useState({
    buyerName: "",
    gender: "",
    profilePhoto: null,
    mobileNumber: "",
    email: "",
    businessName: "",
    businessType: "",
    panCard: null,
    state: "",
    district: "",
    subDistrict: "",
    village: "",
    pinCode: "",
    address: "",
    agreeTerms: false
  })

  const [errors, setErrors] = useState({})
  const [panPreview, setPanPreview] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const [mobileError, setMobileError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ]

  const businessTypes = [
    "Retailer", "Wholesaler", "Distributor", "Restaurant", "Hotel", 
    "Catering Service", "Food Processing Unit", "Export Company", "Other"
  ]

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "mobileNumber") {
      if (!/^\d{10}$/.test(value)) {
        setMobileError("Please enter a valid 10-digit mobile number");
      } else {
        setMobileError("");
      }
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === "otp") {
      setOtp(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? e.target.checked : value }));
    }
  }

  const sendOTP = () => {
    if (/^\d{10}$/.test(formData.mobileNumber)) {
      setOtpSent(true);
      setOtp("");
      setOtpError("");
      alert("OTP sent to " + formData.mobileNumber);
    }
  }

  const verifyOTP = () => {
    if (otp === "123456") { // Demo OTP
      setMobileVerified(true);
      setOtpError("");
      alert("Mobile number verified successfully!");
    } else {
      setOtpError("Invalid OTP");
    }
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
          if (fieldName === 'profilePhoto') {
            setProfilePreview(e.target?.result)
          } else if (fieldName === 'panCard') {
            setPanPreview(e.target?.result)
          }
        }
        reader.readAsDataURL(file)
      }
      
      // Clear error
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.buyerName.trim()) newErrors.buyerName = "This field is required"
    if (!formData.gender) newErrors.gender = "Please select your gender"
    if (!formData.profilePhoto) newErrors.profilePhoto = "Profile photo is required"
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "This field is required"
    else if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Please enter a valid 10-digit mobile number"
    if (!mobileVerified) newErrors.mobileNumber = "Please verify your mobile number"
    if (!formData.email.trim()) newErrors.email = "This field is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address"
    if (!formData.businessName.trim()) newErrors.businessName = "This field is required"
    if (!formData.businessType) newErrors.businessType = "Please select business type"
    if (!formData.address.trim()) newErrors.address = "This field is required"
    if (!formData.state) newErrors.state = "This field is required"
    if (!formData.district.trim()) newErrors.district = "This field is required"
    if (!formData.village.trim()) newErrors.village = "This field is required"
    if (!formData.pinCode.trim()) newErrors.pinCode = "This field is required"
    else if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = "Please enter a valid 6-digit PIN code"
    if (!formData.panCard) newErrors.panCard = "Aadhar card is required"
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      console.log("Buyer Registration submitted:", formData)
      alert("Registration successful!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ShoppingCart className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Buyer Registration
              </h1>
            </div>
            <p className="text-gray-600 text-lg mb-6">Join our marketplace and start purchasing quality crops</p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
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
                    Buyer Name *
                  </label>
                  <input
                    type="text"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.buyerName && <p className="text-red-500 text-sm mt-1">{errors.buyerName}</p>}
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

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
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
                      onChange={handleInputChange}
                      placeholder="Enter your 10-digit mobile number"
                      maxLength={10}
                      className={`flex-1 px-4 py-3 border ${mobileError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    <button
                      type="button"
                      onClick={sendOTP}
                      disabled={formData.mobileNumber.length !== 10 || mobileVerified}
                      className={`px-4 py-3 rounded-lg text-white disabled:cursor-not-allowed ${mobileVerified ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400'}`}
                    >
                      {mobileVerified ? 'Verified' : 'Send OTP'}
                    </button>
                  </div>
                  {mobileError && <p className="text-red-500 text-sm mt-2">{mobileError}</p>}
                  {/* OTP Verification */}
                  {otpSent && !mobileVerified && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP *</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          name="otp"
                          value={otp}
                          onChange={handleInputChange}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={verifyOTP}
                          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Verify OTP
                        </button>
                      </div>
                      {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
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
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Building2 className="h-6 w-6 mr-2 text-blue-600" />
                Business Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Enter your business name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
                </div>

               
              </div>
            </div>

            {/* Location Details */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                Business Address
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Complete Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Business Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Enter complete business address"
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
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    onChange={handleInputChange}
                    placeholder="Enter sub district"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    onChange={handleInputChange}
                    placeholder="Enter village or city name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
                </div>
              </div>
            </div>

           

            {/* Document Upload */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Upload className="h-6 w-6 mr-2 text-blue-600" />
                Document Upload
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Card *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  {panPreview ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img 
                          src={panPreview} 
                          alt="Aadhar Card" 
                          className="max-h-60 w-auto mx-auto rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer" 
                          onClick={() => window.open(panPreview, '_blank')}
                        />
                        <div className="absolute top-0 right-0 mt-2 mr-2">
                          <label
                            htmlFor="panCard"
                            className="cursor-pointer inline-flex items-center p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                          >
                            <Upload className="h-4 w-4 text-blue-600" />
                          </label>
                        </div>
                      </div>
                      <p className="text-blue-600 font-medium">Aadhar Card Uploaded</p>
                      <p className="text-xs text-gray-500">Click on image to view in full size</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <input
                          type="file"
                          id="panCard"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'panCard')}
                          className="hidden"
                        />
                        <label
                          htmlFor="panCard"
                          className="cursor-pointer inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Aadhar Card
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">Supported formats: JPG, PNG (Max 5MB)</p>
                    </div>
                  )}
                </div>
                {errors.panCard && <p className="text-red-500 text-sm mt-1">{errors.panCard}</p>}
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
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {mobileVerified ? 'Create Buyer Account' : 'Verify Mobile Number First'}
              </button>
              
              <p className="text-center text-gray-600 mt-6">
                Already have an account?{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
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
