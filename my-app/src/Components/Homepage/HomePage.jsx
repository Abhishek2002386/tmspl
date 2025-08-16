import React, { useEffect } from 'react';
import Crops from './features/Crops';
import Milkman from './features/Milkman';
import PetAnimal from './features/PetAnimal';
import Organic from './features/Organic';
import MapComponent from './features/Map';
import FilterComponent from './features/Filter';
import Map from './features/Map.jsx';
import LocationNavbar from '../Navbar/Navbar';
import { useLocationContext } from '../context/LocationContext.jsx';

const HomePage = () => {
  const {
    clearSearchLocation
  } = useLocationContext();
  
  useEffect(() => {
    // Add a staggered animation effect for the features when component mounts
    const features = document.querySelectorAll('.feature-item');
    features.forEach((feature, index) => {
      setTimeout(() => {
        feature.classList.add('show');
      }, 150 * index);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
       
       {/* Location Navbar */}
       <LocationNavbar />
       
       {/* Map and Filter Section */}
       <div className="container mx-auto px-4 pt-8">
         <div className="flex flex-col lg:flex-row gap-6">
           
           {/* Filter Section - Desktop Left Side */}
           <div className="hidden lg:block lg:w-80 flex-shrink-0">
             <FilterComponent 
               isMobile={false}
             />
           </div>
           
           {/* Mobile Filter - Expandable Component */}
           <div className="lg:hidden">
             <FilterComponent 
               isMobile={true}
             />
           </div>
           
           {/* Map Section - Desktop Right Side, Mobile Full Width */}
           <div className="flex-1">
             <Map />
           </div>
         </div>
       </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-green-800 animate-fadeSlideDown">
            Explore Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fadeSlideUp">
            Everything you need for your agricultural needs, all in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          <div className="feature-item opacity-0 transform translate-y-4 transition-all duration-500 cursor-pointer">
            <Crops />
          </div>
          <div className="feature-item opacity-0 transform translate-y-4 transition-all duration-500">
            <Milkman />
          </div>
          <div className="feature-item opacity-0 transform translate-y-4 transition-all duration-500">
            <PetAnimal />
          </div>
          <div className="feature-item opacity-0 transform translate-y-4 transition-all duration-500">
            <Organic />
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default HomePage;
