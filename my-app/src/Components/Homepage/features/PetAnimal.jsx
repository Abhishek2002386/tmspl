import React from 'react';
import { Dog } from 'lucide-react';

const PetAnimal = () => {
  return (
    <button className="w-full cursor-pointer h-full flex flex-col items-center justify-center p-6 rounded-xl bg-white border-2 border-purple-200 shadow-md transition-all duration-300 hover:shadow-xl hover:border-purple-400 hover:-translate-y-1 group">
      <div className="p-4 bg-purple-100 rounded-full mb-3 group-hover:bg-purple-200 transition-colors duration-300">
        <Dog className="h-10 w-10 text-purple-600 group-hover:text-purple-700 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <span className="text-lg font-medium text-purple-800 group-hover:text-purple-900 transition-colors duration-300">Pet Animal</span>
    </button>
  );
};

export default PetAnimal;
