import React from 'react';
import { Warehouse } from 'lucide-react';

export default function LandDetails({ formData, onInputChange, errors }) {
  return (
    <div>
      <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <Warehouse className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 text-green-600" />
        Land Details 
      </h2>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Land Area (Bigha) *
          </label>
          <div className="flex">
            <input
              type="number"
              name="totalLandBigha"
              value={formData.totalLandBigha}
              onChange={onInputChange}
              placeholder="Enter total land in Bigha"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          {errors.totalLandBigha && <p className="text-red-500 text-sm mt-1">{errors.totalLandBigha}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Harvesting Land Area (Bigha) *
          </label>
          <div className="flex">
            <input
              type="number"
              name="harvestingLandBigha"
              value={formData.harvestingLandBigha}
              onChange={onInputChange}
              placeholder="Enter harvesting land in Bigha"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          {errors.harvestingLandBigha && <p className="text-red-500 text-sm mt-1">{errors.harvestingLandBigha}</p>}
        </div>
      </div>
    </div>
  );
}
