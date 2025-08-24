# 🧪 Postman Testing Guide for AgriHouse Registration API

## 📋 Prerequisites
1. ✅ Make sure your server is running: `node app.js` in the backend directory
2. ✅ Server should be accessible at `http://localhost:3002`
3. ✅ Download and install Postman from https://www.postman.com/downloads/

## 📥 Import Collection into Postman

### Option 1: Import the Collection File
1. Open Postman
2. Click **Import** button (top left)
3. Choose **File** tab
4. Select the file: `AgriHouse_Registration_API.postman_collection.json`
5. Click **Import**

### Option 2: Manual Setup
If import doesn't work, create requests manually using the details below.

---

## 🧪 Testing Steps

### 🌾 FARMER REGISTRATION FLOW

#### Step 1: Send OTP for Farmer
```
Method: POST
URL: http://localhost:3002/api/farmer/send-otp
Headers: Content-Type: application/json

Body (raw JSON):
{
  "mobileNumber": "9876543210"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp": "123456"
}
```

#### Step 2: Verify OTP for Farmer
```
Method: POST
URL: http://localhost:3002/api/farmer/verify-otp
Headers: Content-Type: application/json

Body (raw JSON):
{
  "mobileNumber": "9876543210",
  "otp": "123456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Mobile number verified successfully"
}
```

#### Step 3: Register Farmer (with file uploads)
```
Method: POST
URL: http://localhost:3002/api/farmer/register
Headers: Do NOT set Content-Type (let Postman handle it for form-data)

Body (form-data):
Key: farmerName, Value: John Farmer, Type: Text
Key: gender, Value: male, Type: Text
Key: mobileNumber, Value: 9876543210, Type: Text
Key: email, Value: john@farmer.com, Type: Text
Key: state, Value: Punjab, Type: Text
Key: district, Value: Ludhiana, Type: Text
Key: subDistrict, Value: Ludhiana, Type: Text
Key: village, Value: Village 1, Type: Text
Key: pinCode, Value: 141001, Type: Text
Key: totalLandBigha, Value: 10, Type: Text
Key: harvestingLandBigha, Value: 8, Type: Text
Key: agreeTerms, Value: true, Type: Text
Key: profilePhoto, Value: [Select File], Type: File
Key: aadharCard, Value: [Select File], Type: File
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Farmer registered successfully",
  "user": {
    "id": 1,
    "phone": "9876543210",
    "userType": "farmer",
    "name": "John Farmer",
    "profilePhoto": "1629825123456-123456789.jpg",
    "aadharCard": "1629825123456-987654321.pdf"
  }
}
```

---

### 🛒 BUYER REGISTRATION FLOW

#### Step 1: Send OTP for Buyer
```
Method: POST
URL: http://localhost:3002/api/buyer/send-otp
Headers: Content-Type: application/json

Body (raw JSON):
{
  "mobileNumber": "9876543211"
}
```

#### Step 2: Verify OTP for Buyer
```
Method: POST
URL: http://localhost:3002/api/buyer/verify-otp
Headers: Content-Type: application/json

Body (raw JSON):
{
  "mobileNumber": "9876543211",
  "otp": "123456"
}
```

#### Step 3: Register Buyer (with file uploads)
```
Method: POST
URL: http://localhost:3002/api/buyer/register
Headers: Do NOT set Content-Type (let Postman handle it for form-data)

Body (form-data):
Key: buyerName, Value: Jane Buyer, Type: Text
Key: gender, Value: female, Type: Text
Key: mobileNumber, Value: 9876543211, Type: Text
Key: email, Value: jane@buyer.com, Type: Text
Key: businessName, Value: ABC Trading, Type: Text
Key: businessType, Value: Wholesaler, Type: Text
Key: address, Value: 123 Main Street, Type: Text
Key: state, Value: Delhi, Type: Text
Key: district, Value: New Delhi, Type: Text
Key: subDistrict, Value: Central Delhi, Type: Text
Key: village, Value: Connaught Place, Type: Text
Key: pinCode, Value: 110001, Type: Text
Key: agreeTerms, Value: true, Type: Text
Key: profilePhoto, Value: [Select File], Type: File
Key: panCard, Value: [Select File], Type: File
```

---

## 🔍 Testing Error Cases

### Invalid Mobile Number
```
Method: POST
URL: http://localhost:3002/api/farmer/send-otp
Body: {"mobileNumber": "123"}

Expected: 400 Bad Request
```

### Missing Required Fields
```
Method: POST
URL: http://localhost:3002/api/farmer/register
Body: {"mobileNumber": "9876543210"}

Expected: 400 Bad Request with validation errors
```

### Duplicate Registration
```
Try registering the same mobile number twice
Expected: 409 Conflict - User already exists
```

---

## 📱 Server Console Output

Watch your server console for:
- 📱 OTP logs: `📱 OTP for 9876543210: 123456`
- 📝 Registration logs: `📝 Farmer registration request:`
- ✅ Success logs: `✅ Farmer registered successfully`
- ❌ Error logs: `❌ Farmer registration error`

---

## 🎯 Quick Test Sequence

1. **Send Farmer OTP** → Copy the OTP from response
2. **Verify Farmer OTP** → Use the copied OTP
3. **Register Farmer** → Should succeed
4. **Send Buyer OTP** → Different mobile number
5. **Verify Buyer OTP** → Use the OTP
6. **Register Buyer** → Should succeed

---

## 🚨 Common Issues

1. **Connection Refused**: Make sure server is running on port 3002
2. **CORS Error**: Server has CORS enabled, should work fine
3. **Database Error**: Check MySQL connection in server logs
4. **Invalid OTP**: Use the OTP returned in the send-otp response

---

## 📊 Expected Database Records

After successful registration, check your database:

**users table:**
- phone: 9876543210, user_type: farmer
- phone: 9876543211, user_type: buyer

**farmers table:**
- user_id: 1, name: John Farmer, email: john@farmer.com

**buyers table:**
- user_id: 2, name: Jane Buyer, email: jane@buyer.com

---

## 📸 File Upload Testing

### 🎯 **Important Notes for File Uploads**

1. **Body Type**: Use `form-data` instead of `raw JSON`
2. **Headers**: Do NOT manually set `Content-Type` - let Postman handle it
3. **File Types**: Supported formats: JPG, PNG, PDF
4. **File Size**: Maximum 5MB per file
5. **Required Files**: 
   - Farmer: `profilePhoto` and `aadharCard`
   - Buyer: `profilePhoto` and `panCard`

### 📁 **How to Add Files in Postman**

1. Select **Body** tab
2. Choose **form-data** radio button
3. For each file field:
   - Set **Key** name (e.g., `profilePhoto`)
   - Change type dropdown from **Text** to **File**
   - Click **Select Files** and choose your image/PDF

### 🔗 **Accessing Uploaded Files**

After successful upload, files are accessible at:
- `http://localhost:3002/uploads/filename.jpg`
- Example: `http://localhost:3002/uploads/1629825123456-123456789.jpg`

### 🧪 **Testing File Upload Errors**

- **Large File**: Upload file > 5MB → `413 Request Entity Too Large`
- **Invalid Format**: Upload .txt file → `400 Invalid file type`
- **Missing Files**: Skip file upload → Still works (files are optional)
