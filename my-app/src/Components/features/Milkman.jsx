import React from 'react';
import { Milk } from 'lucide-react';

const Milkman = () => {
  return (
    <button className="w-full h-full min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white border-2 border-blue-200 shadow-md transition-all duration-300 hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 group cursor-pointer">
      <div className="p-2 sm:p-3 bg-blue-100 rounded-full mb-1 sm:mb-2 group-hover:bg-blue-200 transition-colors duration-300">
        <Milk className="h-6 w-6 sm:h-8 sm:w-8 lg:h-9 lg:w-9 text-blue-600 group-hover:text-blue-700 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <span className="text-xs sm:text-sm lg:text-base font-medium text-blue-800 group-hover:text-blue-900 transition-colors duration-300 text-center">
        Milkman
      </span>
    </button>
  );
};

export default Milkman;
