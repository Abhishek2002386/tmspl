import React from "react";

const TermsAndSubmit = ({ 
  formData, 
  onInputChange, 
  errors,
  mobileVerified,
  submitButtonText = "Create Buyer Account",
  verificationMessage = "Verify Mobile Number First",
  isSubmitting = false
}) => {
  return (
    <div className="border-t pt-8">
      <div className="flex items-start space-x-3 mb-6">
        <input
          type="checkbox"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={onInputChange}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="text-sm text-gray-700">
          I agree to the{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 underline">
            Privacy Policy
          </a>{" "}
          *
        </label>
      </div>
      {errors.agreeTerms && <p className="text-red-500 text-sm mb-4">{errors.agreeTerms}</p>}
      
      <button
        type="submit"
        disabled={!mobileVerified || isSubmitting}
        className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-colors ${
          mobileVerified && !isSubmitting
            ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? 'Submitting...' : mobileVerified ? submitButtonText : verificationMessage}
      </button>
      
      <p className="text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
          Login here
        </a>
      </p>
    </div>
  );
};

export default TermsAndSubmit;
