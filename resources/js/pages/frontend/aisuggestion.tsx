import FrontendLayout from '@/layouts/frontend-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

const AISuggestion: React.FC = () => {
    return (
        <FrontendLayout>
            <section className="bg-[var(--bg-whitesecandary)] font-sans text-gray-900 overflow-x-hidden">
   
            <div className="max-w-4xl mx-auto font-sans mt-10">
                <button className="bg-[var(--bg-red)] text-white p-4 rounded-md mb-6 transition-colors">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                </button>
                <div className="mb-8">
                <h2 className="text-3xl font-bold font-['Alumni_Sans'] text-[var(--bg-red)] tracking-tight">
                    Suggestion 1
                </h2>
                <p className="text-gray-600 mt-1 font-['Libre_Franklin']">
                    1k+ people buy this hoodies with this black pant
                </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                    <div className="bg-[var(--bg-lights)] flex items-center justify-center overflow-hidden">
                    <img
                        src="assets/images/aiasisten1.png"
                        alt="Red Hoodie"
                        className="mix-blend-multiply h-6/5 object-cover"
                    />
                    </div>
                    <div className="bg-[var(--bg-lights)] flex items-center justify-center overflow-hidden">
                    <img
                        src="assets/images/aiasisten3.png"
                        alt="Black Pants"
                        className="mix-blend-multiply h-6/5 object-cover"
                    />
                    </div>
                </div>
                <div className="bg-[var(--bg-lights)] flex items-center justify-center overflow-hidden">
                    <img
                    src="assets/images/aiasisten2.png"
                    alt="Model wearing outfit"
                    className="h-full w-full object-cover"
                    />
                </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto font-sans mt-10">
                <div className="mb-8">
                <h2 className="text-3xl font-bold font-['Alumni_Sans'] text-[var(--bg-red)] tracking-tight">
                    Suggestion 2
                </h2>
                <p className="text-gray-600 mt-1 font-['Libre_Franklin']">
                    500+ people buy this hoodies with this black pant
                </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               
                <div className="flex flex-col gap-4">

                     
                    
                   <div className="relative flex flex-col items-center justify-center text-white p-6 rounded overflow-hidden group">
  
                    <div className="absolute">
                        <img 
                        src="assets/images/Rectangle 25 (7).png" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="Background"
                        />
                    </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 text-center transition-all duration-500 group-hover:scale-110">
                    <p className="text-xl font-light mb-4 tracking-wide uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                    Black pant
                    </p>

                    <div className="w-px h-12 bg-white mx-auto mb-4  transition-colors duration-300 opacity-0 translate-y-4
                    group-hover:opacity-100 group-hover:translate-y-0"></div>

                    {/* Hidden button initially */}
                    <button className="bg-[var(--bg-red)]  
                    transition-all duration-500 
                    px-8 py-3 text-sm font-medium uppercase tracking-tighter 
                    shadow-lg
                    opacity-0 translate-y-4
                    group-hover:opacity-100 group-hover:translate-y-0">
                    View Details
                    </button>
                </div>

                
                  </div>


                  <div className="relative flex flex-col items-center justify-center text-white p-6 rounded overflow-hidden group">
  
                    <div className="absolute">
                        <img 
                        src="assets/images/Rectangle 27 (1).png" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="Background"
                        />
                    </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 text-center transition-all duration-500 group-hover:scale-110">
                    <p className="text-xl font-light mb-4 tracking-wide uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                    Black pant
                    </p>

                    <div className="w-px h-12 bg-white mx-auto mb-4 transition-colors duration-300 opacity-0 translate-y-4
                    group-hover:opacity-100 group-hover:translate-y-0"></div>

                    {/* Hidden button initially */}
                    <button className="bg-[var(--bg-red)] 
                    transition-all duration-500 
                    px-8 py-3 text-sm font-medium uppercase tracking-tighter 
                    shadow-lg
                    opacity-0 translate-y-4
                    group-hover:opacity-100 group-hover:translate-y-0">
                    View Details
                    </button>
                </div>

                
                  </div>


                  <div className="relative flex flex-col items-center justify-center text-white p-6 rounded overflow-hidden group">
  
                    <div className="absolute">
                        <img 
                        src="assets/images/Rectangle 28 (3).png" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="Background"
                        />
                    </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 text-center transition-all duration-500 group-hover:scale-110">
                    <p className="text-xl font-light mb-4 tracking-wide uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                    Black pant
                    </p>

                    <div className="w-px h-12 bg-white mx-auto mb-4  transition-colors duration-300 opacity-0 translate-y-4
                    group-hover:opacity-100 group-hover:translate-y-0"></div>

                    {/* Hidden button initially */}
                    <button className="bg-[var(--bg-red)]
                    transition-all duration-500 
                    px-8 py-3 text-sm font-medium uppercase tracking-tighter 
                    shadow-lg
                    opacity-0 translate-y-4
                    group-hover:opacity-100 group-hover:translate-y-0">
                    View Details
                    </button>
                </div>

                
                  </div>
                    
                    
                </div>
                
                <div className="bg-[#efeae8] flex items-center justify-center overflow-hidden">
                    <img
                    src="assets/images/Frame 2147226341 (2).png"
                    alt="Model wearing outfit"
                    className="h-full w-full object-cover"
                    />
                </div>
                </div>
                <button className="bg-[#110304] text-white p-4 rounded-md mb-6 hover:bg-red-800 transition-colors mt-6">
                <i className="fa-solid fa-rotate" /> More AI Suggest
                </button>
            </div>
   
            </section>

        </FrontendLayout>
    );
};

export default AISuggestion;