import React from "react";
import { Upload } from 'lucide-react';

const DocumentUpload = ({ 
  formData, 
  onFileUpload, 
  errors,
  documentPreview,
  documentType = "panCard",
  documentLabel = "Aadhar Card",
  documentName = "Aadhar Card"
}) => {
  return (
    <div>
      <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <Upload className="h-6 w-6 mr-2 text-blue-600" />
        Document Upload
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {documentLabel} *
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
          {documentPreview ? (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={documentPreview} 
                  alt={documentName} 
                  className="max-h-60 w-auto mx-auto rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer" 
                  onClick={() => window.open(documentPreview, '_blank')}
                />
              </div>
              <p className="text-blue-600 font-medium">{documentName} Uploaded</p>
              <p className="text-xs text-gray-500">Click on image to view in full size</p>

              {/* re-upload button */}
              <div>
                <input
                  type="file"
                  id={`${documentType}-reupload`}
                  accept="image/*"
                  onChange={(e) => onFileUpload(e, documentType)}
                  className="hidden"
                />
                <label
                  htmlFor={`${documentType}-reupload`}
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Replace {documentName}
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <input
                  type="file"
                  id={documentType}
                  accept="image/*"
                  onChange={(e) => onFileUpload(e, documentType)}
                  className="hidden"
                />
                <label
                  htmlFor={documentType}
                  className="cursor-pointer inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {documentName}
                </label>
              </div>
              <p className="text-sm text-gray-500">Supported formats: JPG, PNG (Max 5MB)</p>
            </div>
          )}
        </div>
        {errors[documentType] && <p className="text-red-500 text-sm mt-1">{errors[documentType]}</p>}
      </div>
    </div>
  );
};

export default DocumentUpload;
