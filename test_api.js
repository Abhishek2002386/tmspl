// Test script for registration API
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3002/api';

// Test data
const testMobile = '9876543210';
const testFarmerData = {
  farmerName: 'John Farmer',
  gender: 'male',
  mobileNumber: testMobile,
  email: 'john@farmer.com',
  state: 'Punjab',
  district: 'Ludhiana',
  subDistrict: 'Ludhiana',
  village: 'Village 1',
  pinCode: '141001',
  totalLandBigha: '10',
  harvestingLandBigha: '8',
  agreeTerms: true
};

const testBuyerData = {
  buyerName: 'Jane Buyer',
  gender: 'female',
  mobileNumber: '9876543211',
  email: 'jane@buyer.com',
  businessName: 'ABC Trading',
  businessType: 'Wholesaler',
  address: '123 Main St',
  state: 'Delhi',
  district: 'New Delhi',
  subDistrict: 'Central Delhi',
  village: 'Connaught Place',
  pinCode: '110001',
  agreeTerms: true
};

async function testAPI() {
  try {
    console.log('🧪 Testing AgriHouse Registration API\n');

    // Test 1: Send OTP for Farmer
    console.log('1️⃣ Testing Farmer OTP Send...');
    const otpResponse = await fetch(`${API_BASE}/farmer/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: testMobile })
    });
    const otpData = await otpResponse.json();
    console.log('✅ OTP Response:', otpData);
    console.log('📱 Generated OTP:', otpData.otp);

    // Test 2: Verify OTP for Farmer
    console.log('\n2️⃣ Testing Farmer OTP Verify...');
    const verifyResponse = await fetch(`${API_BASE}/farmer/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        mobileNumber: testMobile, 
        otp: otpData.otp 
      })
    });
    const verifyData = await verifyResponse.json();
    console.log('✅ Verify Response:', verifyData);

    // Test 3: Register Farmer
    console.log('\n3️⃣ Testing Farmer Registration...');
    const farmerResponse = await fetch(`${API_BASE}/farmer/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testFarmerData)
    });
    const farmerData = await farmerResponse.json();
    console.log('✅ Farmer Registration:', farmerData);

    // Test 4: Register Buyer
    console.log('\n4️⃣ Testing Buyer Registration...');
    const buyerResponse = await fetch(`${API_BASE}/buyer/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testBuyerData)
    });
    const buyerData = await buyerResponse.json();
    console.log('✅ Buyer Registration:', buyerData);

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run tests
testAPI();
