// Data service to handle farmer and buyer data from JSON files
import farmersData from "../data/buyers_data_2025-08-16 (2).json";
import buyersData from "../data/farmers_data_2025-08-16.json";

class DataService {
  constructor() {
    this.farmers = farmersData || [];
    this.buyers = buyersData || [];
    this.otpStorage = {}; // Store OTPs temporarily
  }

  // Get all farmers
  getFarmers() {
    return this.farmers;
  }

  // Get all buyers
  getBuyers() {
    return this.buyers;
  }

  // Check if mobile number exists in farmer data
  isFarmerMobile(mobile) {
    return this.farmers.some(farmer => farmer.mobileNumber === mobile);
  }

  // Check if mobile number exists in buyer data
  isBuyerMobile(mobile) {
    return this.buyers.some(buyer => buyer.mobileNumber === mobile);
  }

  // Check if mobile number is registered (farmer or buyer)
  isMobileRegistered(mobile) {
    return this.isFarmerMobile(mobile) || this.isBuyerMobile(mobile);
  }

  // Get user by mobile number
  getUserByMobile(mobile) {
    const farmer = this.farmers.find(f => f.mobileNumber === mobile);
    if (farmer) {
      return { ...farmer, userType: 'farmer', type: 'farmer' };
    }

    const buyer = this.buyers.find(b => b.mobileNumber === mobile);
    if (buyer) {
      return { ...buyer, userType: 'buyer', type: 'buyer' };
    }

    return null;
  }

  // Get all users of a specific type
  getUsersByType(type) {
    if (type === 'farmer') {
      return this.farmers.map(farmer => ({ ...farmer, type: 'farmer' }));
    } else if (type === 'buyer') {
      return this.buyers.map(buyer => ({ ...buyer, type: 'buyer' }));
    }
    return [];
  }

  // Generate OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP (mock implementation)
  async sendOTP(mobile) {
    try {
      if (!this.isMobileRegistered(mobile)) {
        return {
          success: false,
          message: 'Mobile number not registered. Please register first.',
          shouldRegister: true
        };
      }

      const otp = this.generateOTP();
      
      // Store OTP with expiry (5 minutes)
      this.otpStorage[mobile] = {
        otp: otp,
        timestamp: Date.now(),
        expires: Date.now() + (5 * 60 * 1000) // 5 minutes
      };

      console.log(`OTP for ${mobile}: ${otp}`);
      
      return {
        success: true,
        message: `OTP sent to ${mobile}`,
        otp: otp // For testing purposes
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP'
      };
    }
  }

  // Verify OTP
  async verifyOTP(mobile, otp) {
    try {
      const storedOTP = this.otpStorage[mobile];
      
      if (!storedOTP) {
        return {
          success: false,
          message: 'OTP not found. Please request a new OTP.'
        };
      }

      // Check if OTP is expired
      if (Date.now() > storedOTP.expires) {
        delete this.otpStorage[mobile];
        return {
          success: false,
          message: 'OTP has expired. Please request a new OTP.'
        };
      }

      // Check if OTP matches
      if (storedOTP.otp === otp) {
        // Clean up used OTP
        delete this.otpStorage[mobile];
        
        // Get user data
        const user = this.getUserByMobile(mobile);
        
        // Store current user in localStorage for session management
        localStorage.setItem('agrihouse_current_user', JSON.stringify(user));
        localStorage.setItem('agrihouse_login_time', Date.now().toString());
        
        return {
          success: true,
          message: 'Login successful',
          user: user
        };
      } else {
        return {
          success: false,
          message: 'Invalid OTP. Please try again.'
        };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP'
      };
    }
  }

  // Get current logged-in user
  getCurrentUser() {
    try {
      const user = localStorage.getItem('agrihouse_current_user');
      const loginTime = localStorage.getItem('agrihouse_login_time');
      
      if (!user || !loginTime) return null;
      
      // Check if session is expired (24 hours)
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - parseInt(loginTime) > sessionDuration) {
        this.logout();
        return null;
      }
      
      return JSON.parse(user);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  // Logout user
  logout() {
    localStorage.removeItem('agrihouse_current_user');
    localStorage.removeItem('agrihouse_login_time');
  }

  // Get users by type within radius
  getUsersByTypeInRadius(userType, centerLat, centerLng, radiusInMeters) {
    const users = userType === 'farmer' ? this.farmers : this.buyers;
    
    return users.filter(user => {
      if (!user.location) return false;
      
      const distance = this.calculateDistance(
        centerLat, centerLng,
        user.location.latitude, user.location.longitude
      );
      
      return distance <= radiusInMeters;
    }).map(user => ({
      ...user,
      coordinates: {
        lat: user.location.latitude,
        lng: user.location.longitude
      },
      distance: this.calculateDistance(
        centerLat, centerLng,
        user.location.latitude, user.location.longitude
      )
    }));
  }

  // Calculate distance between two points in meters
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  // Get summary of data
  getDataSummary() {
    return {
      farmers: this.farmers.length,
      buyers: this.buyers.length,
      total: this.farmers.length + this.buyers.length
    };
  }
}

// Create singleton instance
const dataService = new DataService();

export default dataService;
