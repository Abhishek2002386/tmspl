
import React from "react";
import { useState } from "react";
import { ShoppingCart } from 'lucide-react';

// Import smaller components
import RegistrationHeader from '../../Components/Forms/RegistrationHeader.jsx';
import FormContainer from '../../Components/Forms/FormContainer.jsx';
import PersonalInformation from '../../Components/Forms/PersonalInformation.jsx';
import ContactInformation from '../../Components/Forms/ContactInformation.jsx';
import BusinessInformation from '../../Components/Forms/BusinessInformation.jsx';
import AddressInformation from '../../Components/Forms/AddressInformation.jsx';
import DocumentUpload from '../../Components/Forms/DocumentUpload.jsx';
import TermsAndSubmit from '../../Components/Forms/TermsAndSubmit.jsx';

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
  });

  const [errors, setErrors] = useState({});
  const [panPreview, setPanPreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [mobileError, setMobileError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  // Constants
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const businessTypes = [
    "Retailer", "Wholesaler", "Distributor", "Restaurant", "Hotel", 
    "Catering Service", "Food Processing Unit", "Export Company", "Other"
  ];

  // Event Handlers
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
  };

  const sendOTP = () => {
    if (/^\d{10}$/.test(formData.mobileNumber)) {
      setOtpSent(true);
      setOtp("");
      setOtpError("");
      alert("OTP sent to " + formData.mobileNumber);
    }
  };

  const verifyOTP = () => {
    if (otp === "123456") { // Demo OTP
      setMobileVerified(true);
      setOtpError("");
      alert("Mobile number verified successfully!");
    } else {
      setOtpError("Invalid OTP");
    }
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [fieldName]: "File size should be less than 5MB" }));
        return;
      }
      
      // Validate file format
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [fieldName]: "Please upload JPG, PNG or PDF file only" }));
        return;
      }

      setFormData(prev => ({ ...prev, [fieldName]: file }));
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Set appropriate preview based on field name
          if (fieldName === 'profilePhoto') {
            setProfilePreview(e.target?.result);
          } else if (fieldName === 'panCard') {
            setPanPreview(e.target?.result);
          }
        };
        reader.readAsDataURL(file);
      }
      
      // Clear error
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.buyerName.trim()) newErrors.buyerName = "This field is required";
    if (!formData.gender) newErrors.gender = "Please select your gender";
    if (!formData.profilePhoto) newErrors.profilePhoto = "Profile photo is required";
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "This field is required";
    else if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    if (!mobileVerified) newErrors.mobileNumber = "Please verify your mobile number";
    if (!formData.email.trim()) newErrors.email = "This field is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.businessName.trim()) newErrors.businessName = "This field is required";
    if (!formData.businessType) newErrors.businessType = "Please select business type";
    if (!formData.address.trim()) newErrors.address = "This field is required";
    if (!formData.state) newErrors.state = "This field is required";
    if (!formData.district.trim()) newErrors.district = "This field is required";
    if (!formData.village.trim()) newErrors.village = "This field is required";
    if (!formData.pinCode.trim()) newErrors.pinCode = "This field is required";
    else if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = "Please enter a valid 6-digit PIN code";
    if (!formData.panCard) newErrors.panCard = "Aadhar card is required";
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Buyer Registration submitted:", formData);
      alert("Registration successful!");
    }
  };

  return (
    <>
      <RegistrationHeader 
        title="Buyer Registration"
        subtitle="Join our marketplace and start purchasing quality crops"
        icon={ShoppingCart}
        iconColor="text-blue-600"
      />
      
      <FormContainer onSubmit={handleSubmit}>
        <PersonalInformation 
          formData={formData}
          onInputChange={handleInputChange}
          onFileUpload={handleFileUpload}
          errors={errors}
          profilePreview={profilePreview}
          userType="buyer"
        />

        <ContactInformation 
          formData={formData}
          onInputChange={handleInputChange}
          errors={errors}
          mobileError={mobileError}
          otpSent={otpSent}
          mobileVerified={mobileVerified}
          otp={otp}
          otpError={otpError}
          onSendOTP={sendOTP}
          onVerifyOTP={verifyOTP}
        />

        <BusinessInformation 
          formData={formData}
          onInputChange={handleInputChange}
          errors={errors}
          businessTypes={businessTypes}
        />

        <AddressInformation 
          formData={formData}
          onInputChange={handleInputChange}
          errors={errors}
          indianStates={indianStates}
          title="Business Address"
          addressType="business"
        />

        <DocumentUpload 
          formData={formData}
          onFileUpload={handleFileUpload}
          errors={errors}
          documentPreview={panPreview}
          documentType="panCard"
          documentLabel="Aadhar Card"
          documentName="Aadhar Card"
        />

        <TermsAndSubmit 
          formData={formData}
          onInputChange={handleInputChange}
          errors={errors}
          mobileVerified={mobileVerified}
          submitButtonText="Create Buyer Account"
          verificationMessage="Verify Mobile Number First"
        />
      </FormContainer>
    </>
  );
}
