import React, { useEffect } from 'react';
import Crops from '../../Components/features/Crops';
import Milkman from '../../Components/features/Milkman';
import PetAnimal from '../../Components/features/PetAnimal';
import Organic from '../../Components/features/Organic';
import LocationNavbar from '../../Components/Common/Navbar';
import FilterComponent from '../../Components/features/Filter';
import Map from '../../Components/features/Map';

const HomePage = () => {
 
  useEffect(() => {
    const features = document.querySelectorAll('.feature-item');
    features.forEach((feature, index) => {
      setTimeout(() => {
        feature.classList.add('show');
      }, 150 * index);
    });

    // Add styles for animations
    const style = document.createElement('style');
    style.textContent = `
      .feature-item.show {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      
      @keyframes fadeSlideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeSlideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-fadeSlideDown {
        animation: fadeSlideDown 0.8s ease-out;
      }
      
      .animate-fadeSlideUp {
        animation: fadeSlideUp 0.8s ease-out 0.2s both;
      }
      
      /* Feature hover effects */
      .feature-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .feature-item:hover {
        transform: translateY(-5px) scale(1.02);
      }
      
      /* Responsive improvements */
      @media (max-width: 640px) {
        .feature-item {
          min-height: 100px;
        }
      }
      
      @media (min-width: 641px) {
        .feature-item {
          min-height: 120px;
        }
      }
      
      @media (min-width: 1024px) {
        .feature-item {
          min-height: 140px;
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
       
       {/* Location Navbar */}
       <LocationNavbar />
      {/* Features Section */}
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-10 m-9">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-green-800 animate-fadeSlideDown">
            Explore Our Services
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto animate-fadeSlideUp">
            Everything you need for your agricultural needs, all in one place.
          </p>
        </div>
        
        {/* Features Grid - Responsive Design */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto">
          <div className="feature-item opacity-0 transform translate-y-4 transition-all duration-500 cursor-pointer">
            <Crops />
          </div>
          <div className="feature-item opacity-0 transform translate-y-4 transition-all duration-500 cursor-pointer">
            <Milkman />
          </div>
          <div className="feature-item opacity-0 transform translate-y-4 transition-all duration-500 cursor-pointer">
            <PetAnimal />
          </div>
          <div className="feature-item opacity-0 transform translate-y-4 transition-all duration-500 cursor-pointer">
            <Organic />
          </div>
        </div>
      </div>
       
       {/* Map and Filter Section */}
       
       {/* <div className="container mx-auto px-4 pt-4 pb-6"> */}
         {/* <div className="flex flex-col lg:flex-row gap-4"> */}
           
           {/* Filter Section - Desktop Left Side */}
           {/* <div className="hidden lg:block lg:w-80 flex-shrink-0">
             <FilterComponent 
               isMobile={false}
             />
           </div> */}
           
           {/* Mobile Filter - Expandable Component */}
           {/* <div className="lg:hidden">
             <FilterComponent 
               isMobile={true}
             />
           </div> */}
           
           {/* Map Section - Desktop Right Side, Mobile Full Width */}
           {/* <div className="flex-1">
             <Map />
           </div> */}
         </div>
      //  </div>

    // </div>
  );
};

export default HomePage;
