import React from 'react';
import { Wheat } from 'lucide-react';

const Crops = () => {
  return (
    <button className="w-full h-full flex flex-col items-center justify-center p-6 rounded-xl bg-white border-2 border-yellow-200 shadow-md transition-all duration-300 hover:shadow-xl hover:border-yellow-400 hover:-translate-y-1 group cursor-pointer">
      <div className="p-4 bg-yellow-100 rounded-full mb-3 group-hover:bg-yellow-200 transition-colors duration-300">
        <Wheat className="h-10 w-10 text-yellow-600 group-hover:text-yellow-700 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <span className="text-lg font-medium text-yellow-800 group-hover:text-yellow-900 transition-colors duration-300">Crops</span>
    </button>
  );
};

export default Crops;
