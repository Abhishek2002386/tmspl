import React from 'react';
import { LeafyGreen  } from 'lucide-react';

const Organic = () => {
  return (
    <button className="w-full h-full min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white border-2 border-green-200 shadow-md transition-all duration-300 hover:shadow-xl hover:border-green-400 hover:-translate-y-1 group cursor-pointer">
      <div className="p-2 sm:p-3 bg-green-100 rounded-full mb-1 sm:mb-2 group-hover:bg-green-200 transition-colors duration-300">
        <LeafyGreen  className="h-6 w-6 sm:h-8 sm:w-8 lg:h-9 lg:w-9 text-green-600 group-hover:text-green-700 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <span className="text-xs sm:text-sm lg:text-base font-medium text-green-800 group-hover:text-green-900 transition-colors duration-300 text-center">
        Organic
      </span>
    </button>
  );
};

export default Organic;
