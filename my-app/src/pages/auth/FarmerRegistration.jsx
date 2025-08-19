import React from "react";
import { useState } from "react";
import { User } from 'lucide-react';

// Import reusable components from BuyerRegistration
import RegistrationHeader from '../../Components/Forms/RegistrationHeader.jsx';
import PersonalInformation from '../../Components/Forms/PersonalInformation.jsx';
import DocumentUpload from '../../Components/Forms/DocumentUpload.jsx';
import TermsAndSubmit from '../../Components/Forms/TermsAndSubmit.jsx';

// Import farmer-specific components
import FarmerFormContainer from '../../Components/Forms/FormContainer.jsx';
import LandDetails from '../../Components/Forms/LandDetails.jsx';
import FarmerContactInformation from '../../Components/Forms/ContactInformation.jsx';
import FarmerAddressInformation from '../../Components/Forms/FarmerAddressInformation.jsx';

export default function FarmerRegistration() {
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
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [aadharPreview, setAadharPreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  // Constants
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  // Event Handlers
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
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
          if (fieldName === 'aadharCard') {
            setAadharPreview(e.target?.result);
          } else if (fieldName === 'profilePhoto') {
            setProfilePreview(e.target?.result);
          }
        };
        reader.readAsDataURL(file);
      }
      
      // Clear error
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

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
  };

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
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.farmerName.trim()) newErrors.farmerName = "This field is required";
    if (!formData.gender) newErrors.gender = "Please select your gender";
    if (!formData.totalLandBigha) newErrors.totalLandBigha = "Please enter total land area";
    else if (formData.totalLandBigha <= 0) newErrors.totalLandBigha = "Total land area must be greater than 0";
    if (!formData.harvestingLandBigha) newErrors.harvestingLandBigha = "Please enter harvesting land area";
    else if (formData.harvestingLandBigha <= 0) newErrors.harvestingLandBigha = "Harvesting land area must be greater than 0";
    else if (parseFloat(formData.harvestingLandBigha) > parseFloat(formData.totalLandBigha)) 
      newErrors.harvestingLandBigha = "Harvesting land cannot be greater than total land";
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "This field is required";
    else if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    if (!mobileVerified) newErrors.mobileNumber = "Please verify your mobile number";
    if (!formData.email.trim()) newErrors.email = "This field is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.state) newErrors.state = "This field is required";
    if (!formData.district.trim()) newErrors.district = "This field is required";
    if (!formData.subDistrict.trim()) newErrors.subDistrict = "This field is required";
    if (!formData.village.trim()) newErrors.village = "This field is required";
    if (!formData.pinCode.trim()) newErrors.pinCode = "This field is required";
    else if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = "Please enter a valid 6-digit PIN code";
    if (!formData.aadharCard) newErrors.aadharCard = "This field is required";
    if (!formData.agreeTerms) newErrors.agreeTerms = "This field is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
  };

  return (
    <>
      <RegistrationHeader 
        title="Farmer Registration"
        subtitle="Join our marketplace and start selling your crops"
        icon={User}
        iconColor="text-green-600"
      />
      
      <FarmerFormContainer onSubmit={handleSubmit}>
        <PersonalInformation 
          formData={{
            buyerName: formData.farmerName,
            gender: formData.gender,
            profilePhoto: formData.profilePhoto
          }}
          onInputChange={(e) => {
            const { name, value, type } = e.target;
            // Map buyerName to farmerName
            const mappedName = name === 'buyerName' ? 'farmerName' : name;
            handleInputChange({
              target: {
                name: mappedName,
                value: type === 'checkbox' ? e.target.checked : value,
                type
              }
            });
          }}
          onFileUpload={handleFileUpload}
          errors={{
            buyerName: errors.farmerName,
            gender: errors.gender,
            profilePhoto: errors.profilePhoto
          }}
          profilePreview={profilePreview}
          userType="farmer"
        />

        <LandDetails 
          formData={formData}
          onInputChange={handleInputChange}
          errors={errors}
        />

        <FarmerContactInformation 
          formData={formData}
          onInputChange={handleInputChange}
          errors={errors}
          otpSent={otpSent}
          mobileVerified={mobileVerified}
          onSendOTP={sendOTP}
          onVerifyOTP={verifyOTP}
        />

        <FarmerAddressInformation 
          formData={formData}
          onInputChange={handleInputChange}
          errors={errors}
          indianStates={indianStates}
        />

        <DocumentUpload 
          formData={formData}
          onFileUpload={handleFileUpload}
          errors={errors}
          documentPreview={aadharPreview}
          documentType="aadharCard"
          documentLabel="Aadhar Card Photo"
          documentName="Aadhar Card"
        />

        <TermsAndSubmit 
          formData={formData}
          onInputChange={handleInputChange}
          errors={errors}
          mobileVerified={mobileVerified}
          submitButtonText="Create Account"
          verificationMessage="Verify Mobile Number First"
        />
      </FarmerFormContainer>
    </>
  );
}
