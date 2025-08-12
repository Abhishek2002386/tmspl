import React from 'react';
import { Carrot } from 'lucide-react';

const Organic = () => {
  return (
    <button className="w-full cursor-pointer h-full flex flex-col items-center justify-center p-6 rounded-xl bg-white border-2 border-green-200 shadow-md transition-all duration-300 hover:shadow-xl hover:border-green-400 hover:-translate-y-1 group">
      <div className="p-4 bg-green-100 rounded-full mb-3 group-hover:bg-green-200 transition-colors duration-300">
        <Carrot className="h-10 w-10 text-green-600 group-hover:text-green-700 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <span className="text-lg font-medium text-green-800 group-hover:text-green-900 transition-colors duration-300">Organic Fruit/Vegetables</span>
    </button>
  );
};

export default Organic;
