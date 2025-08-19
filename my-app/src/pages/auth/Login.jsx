import React, { useState, useEffect } from "react";
import { Wheat, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dataService from '../../services/dataService.js';

export default function AgriHouseLogin() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [hovered, setHovered] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (dataService.isLoggedIn()) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSendOtp = async () => {
    if (mobile.length === 10) {
      setIsLoading(true);
      setError("");
      
      try {
        const result = await dataService.sendOTP(mobile);
        
        if (result.success) {
          setIsOtpSent(true);
          const user = dataService.getUserByMobile(mobile);
          setUserInfo(user);
          console.log(`OTP sent to ${mobile}:`, result.otp);
          alert(`OTP sent to ${mobile}! For testing, use: ${result.otp}`);
        } else {
          if (result.shouldRegister) {
            setError(result.message);
            alert(`${result.message}\n\nPlease click on 'Farmer' or 'Buyer' button below to register.`);
          } else {
            setError(result.message);
            alert(result.message);
          }
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
        setError("Failed to send OTP. Please try again.");
        alert("Failed to send OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please enter a valid 10-digit mobile number");
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  const handleLogin = async () => {
    if (otp.length === 6) {
      setIsLoading(true);
      setError("");
      
      try {
        const result = await dataService.verifyOTP(mobile, otp);
        
        if (result.success) {
          console.log('Login successful:', result);
          const userName = result.user.userType === 'farmer' ? result.user.farmerName : result.user.buyerName;
          alert(`Welcome ${userName}! Login successful.`);
          navigate('/home');
        } else {
          setError(result.message);
          alert(result.message);
        }
      } catch (error) {
        console.error('Error during login:', error);
        setError("Login failed. Please try again.");
        alert("Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please enter a valid 6-digit OTP");
      alert("Please enter a valid 6-digit OTP");
    }
  };

  // Reset form when mobile number changes
  const handleMobileChange = (e) => {
    setMobile(e.target.value);
    setIsOtpSent(false);
    setOtp("");
    setError("");
    setUserInfo(null);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center ">
      <div
        className="p-6 sm:p-8 rounded-none sm:rounded-2xl shadow-md border border-green-100 
               w-full h-full sm:max-w-md sm:h-auto bg-white text-[14px]"
      >
        <img
          src="image.png"
          alt=""
          className=" h-15 ml-auto mr-auto mb-5 w-52 mt-9"
        />
        <p className="text-center text-green-600  mb-6 font-extrabold text-2xl">
          Login
        </p>

        {/* Mobile */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Mobile No
          </label>
          <div className="flex mt-1">
            <input
              type="text"
              maxLength={10}
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={handleMobileChange}
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendOtp}
              disabled={isLoading || mobile.length !== 10 || isOtpSent}
              className={`px-4 py-2 rounded-r-md transition-colors ${
                isOtpSent 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white border border-green-500 text-green-700 hover:bg-green-100'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Checking...' : isOtpSent ? 'OTP Sent' : 'Send OTP'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

      
        {/* OTP Input - Always visible */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Enter OTP
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder={isOtpSent ? "Enter 6-digit OTP" : " "}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading || !isOtpSent}
          />
         
        </div>

        {/* Login Button - Always visible */}
        <button
          onClick={handleLogin}
          disabled={isLoading || otp.length !== 6 || !isOtpSent}
          className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {/* Divider */}
        <div className="text-center my-4 text-gray-500">OR</div>
        <div className="text-green-500">
          Don't have an account? Register as:
        </div>

        {/* Register Buttons */}
        <div className="flex justify-center space-x-4 mb-4 mt-8">
          {/* Farmer Button */}
          <button
            onClick={() => navigate('/farmer-registration')}
            onMouseEnter={() => setHovered("farmer")}
            onMouseLeave={() => setHovered("")}
            className="flex-1 border border-green-600 text-green-700 px-4 py-2 rounded-md hover:bg-green-100 transition flex items-center justify-center"
          >
            {hovered === "farmer" ? <Wheat className="w-5 h-5" /> : "Farmer"}
          </button>

          {/* Buyer Button */}
          <button
            onClick={() => navigate('/buyer-registration')}
            onMouseEnter={() => setHovered("buyer")}
            onMouseLeave={() => setHovered("")}
            className="flex-1 border border-green-600 text-green-700 px-4 py-2 rounded-md hover:bg-blue-100 transition flex items-center justify-center"
          >
            {hovered === "buyer" ? (
              <ShoppingCart className="w-5 h-5" />
            ) : (
              "Buyer"
            )}
          </button>
        </div>

        {/* Terms */}
        <p className="text-xs text-center text-gray-600">
          By logging in or registering, you agree to our{" "}
          <a href="#" className="text-green-600 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-green-600 underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
