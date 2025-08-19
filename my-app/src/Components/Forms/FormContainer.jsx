import React from "react";

const FormContainer = ({ children, onSubmit }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-[12px]">
          <form onSubmit={onSubmit} className="space-y-8">
            {children}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
