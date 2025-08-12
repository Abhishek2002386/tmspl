import React from 'react';
import { Milk } from 'lucide-react';

const Milkman = () => {
  return (
    <button className="w-full cursor-pointer h-full flex flex-col items-center justify-center p-6 rounded-xl bg-white border-2 border-blue-200 shadow-md transition-all duration-300 hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 group">
      <div className="p-4 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition-colors duration-300">
        <Milk className="h-10 w-10 text-blue-600 group-hover:text-blue-700 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <span className="text-lg font-medium text-blue-800 group-hover:text-blue-900 transition-colors duration-300">Milkman</span>
    </button>
  );
};

export default Milkman;
