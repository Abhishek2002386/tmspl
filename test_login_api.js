// Test script for login API
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3002/api';

async function testLoginAPI() {
  try {
    console.log('🧪 Testing AgriHouse Login API\n');

    // Test 1: Send OTP for existing user (farmer)
    console.log('1️⃣ Testing Login OTP Send for existing farmer...');
    const testMobile = '9876543210'; // This should be a registered mobile number
    
    const otpResponse = await fetch(`${API_BASE}/login/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: testMobile })
    });
    const otpData = await otpResponse.json();
    console.log('✅ OTP Response:', otpData);

    if (otpData.success && otpData.otp) {
      console.log('📱 Generated OTP:', otpData.otp);

      // Test 2: Verify OTP for Login
      console.log('\n2️⃣ Testing Login OTP Verify...');
      const verifyResponse = await fetch(`${API_BASE}/login/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobileNumber: testMobile, 
          otp: otpData.otp 
        })
      });
      const verifyData = await verifyResponse.json();
      console.log('✅ Verify Response:', verifyData);
    }

    // Test 3: Send OTP for non-existing user
    console.log('\n3️⃣ Testing Login OTP Send for non-existing user...');
    const nonExistentMobile = '1234567890';
    
    const nonExistentResponse = await fetch(`${API_BASE}/login/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: nonExistentMobile })
    });
    const nonExistentData = await nonExistentResponse.json();
    console.log('✅ Non-existent User Response:', nonExistentData);

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testLoginAPI();
