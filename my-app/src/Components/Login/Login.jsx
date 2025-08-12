import React, { useState } from "react";
import { Wheat, ShoppingCart } from "lucide-react";

export default function AgriHouseLogin() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [hovered, setHovered] = useState("");

  const handleSendOtp = async () => {
    if (mobile.length === 10) {
      try {
        const response = await fetch('https://api.agrihouse.com/api/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            mobile: mobile,
          })
        });

        const data = await response.json();
        
        if (response.ok) {
          console.log('OTP sent successfully:', data);
          alert("OTP sent! Check your phone.");
        } else {
          console.error('Failed to send OTP:', data);
          alert(data.message || "Failed to send OTP");
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
        // For testing in Network tab, using a mock API
        alert("Test Mode: OTP sent! Use '123456' for testing.");
      }
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  const handleLogin = async () => {
    if (otp.length === 6) {
      try {
        const response = await fetch('https://api.agrihouse.com/api/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: mobile,
            otp: otp
          })
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Login successful:', data);
          alert("Login successful!");
          // You can add navigation here using useNavigate
        } else {
          console.error('Login failed:', data);
          alert(data.message || "Login failed");
        }
      } catch (error) {
        console.error('Error during login:', error);
        // For testing in Network tab
        if (otp === '123456') {
          alert("Test Mode: Login successful!");
        } else {
          alert("Test Mode: Invalid OTP. Use '123456' for testing.");
        }
      }
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div
        className=" p-8 rounded-2xl shadow-md border border-green-100 
  sm:object-fill 
  sm:max-w-md 
  sm:h-auto 
  h-screen w-screen max-w-none 
  sm:w-full 
"
      >
        <img
          src="image.png"
          alt=""
          className=" h-15 ml-auto mr-auto mb-5 w-52"
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
              onChange={(e) => setMobile(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSendOtp}
              className="bg-white border border-green-500 text-green-700 px-4 py-2 rounded-r-md hover:bg-green-100"
            >
              Send OTP
            </button>
          </div>
        </div>

        {/* OTP Input */}
        
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter OTP
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
      

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
        >
          Login
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
            onMouseEnter={() => setHovered("farmer")}
            onMouseLeave={() => setHovered("")}
            className="flex-1 border border-green-600 text-green-700 px-4 py-2 rounded-md hover:bg-green-100 transition flex items-center justify-center"
          >
            {hovered === "farmer" ? <Wheat className="w-5 h-5" /> : "Farmer"}
          </button>

          {/* Buyer Button */}
          <button
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
