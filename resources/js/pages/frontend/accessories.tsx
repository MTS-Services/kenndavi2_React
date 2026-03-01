import FrontendLayout from '@/layouts/frontend-layout';
import { router } from '@inertiajs/react';
import React from 'react';

// Reusable Hover Component
const GalleryItem = ({ src, alt = '', title, colSpan = '', height = 'h-full' }: { src?: string; alt?: string; title?: string; colSpan?: string; height?: string }) => {
  return (
    <div className={`${colSpan} ${height} relative overflow-hidden rounded shadow-sm group cursor-pointer bg-white`}>
      {/* Background Image with Zoom Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
        style={{ backgroundImage: `url('${src}')` }}
      >
        {/* Dynamic Overlay */}
        <div className="absolute inset-0 transition-all duration-700 bg-gray/10 opacity-0 group-hover:opacity-70"></div>
        <div className="absolute inset-0 transition-colors duration-500 backdrop-brightness-100 group-hover:backdrop-brightness-90"></div>
      </div>

      {/* Content Container (Slide up and Fade in) */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4 transition-all duration-700 ease-out translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
        
        <h3 className="mb-4 text-xl md:text-2xl font-[Alumni_Sans] tracking-widest text-center uppercase">
          {title || "Premium Belt"}
        </h3>

        {/* Decorative Line */}
        <div className="mb-4 h-12 w-px bg-white/50 transition-all duration-700 delay-100 scale-y-0 group-hover:scale-y-100 origin-top"></div>

        {/* The Button */}
        <button onClick={() => router.get('/productdetails')} className="bg-[var(--bg-red)] px-10 py-4 text-sm md:text-base font-medium transition-all duration-700 delay-200 ease-out opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 rounded-sm hover:bg-red-800 shadow-xl relative overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
          <span className="relative z-10 text-white">View Details</span>
        </button>
      </div>

      {/* Optional: Thin Border Glow */}
      <div className="absolute inset-0 border border-transparent group-hover:border-white/20 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
};

const BeltGallery = () => {
  return (
    <div className="bg-[var(--bg-accessories)] font-sans text-gray-900 overflow-x-hidden">
      
      {/* SECTION 1: 3-Column Grid */}
      <section className="py-12 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GalleryItem src="assets/images/Rectangle 16 (3).png" title="Brown Leather" height="h-[600px] md:h-[1064px]" />
            
            <div className="flex flex-col gap-6">
              <GalleryItem src="assets/images/Rectangle 18 (4).png" title="Gift Set" height="h-[520px]" />
              <GalleryItem src="assets/images/Frame 98 (3).png" title="Classic Wear" height="h-[520px]" />
            </div>

            <GalleryItem src="assets/images/Rectangle 15 (3).png" title="Man Collection" height="h-[600px] md:h-[1064px]" />
          </div>
        </div>
      </section>

      {/* SECTION 2: 2/3 and 1/3 Grid */}
      <section className="p-4 md:p-10">
        <div className="container mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GalleryItem src="assets/images/Rectangle 16 (4).png" title="Signature Series" colSpan="lg:col-span-2" height="h-[650px]" />
          
          <div className="flex flex-col gap-6 h-[650px]">
            <GalleryItem src="assets/images/Rectangle 18 (5).png" title="Leather Detail" height="flex-1" />
            <GalleryItem src="assets/images/Frame 98 (4).png" title="Daily Belt" height="flex-1" />
          </div>
        </div>
      </section>

      {/* SECTION 3: Balanced 3-Column Grid */}
      <section className="p-4 md:p-10">
        <div className="container mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GalleryItem src="assets/images/Rectangle 16 (5).png" title="Vintage Brown" height="h-[700px]" />
          
          <div className="flex flex-col gap-6 h-[700px]">
            <GalleryItem src="assets/images/Rectangle 18 (6).png" title="Elite Box" height="flex-1" />
            <GalleryItem src="assets/images/Frame 98 (5).png" title="Jean Style" height="flex-1" />
          </div>

          <GalleryItem src="assets/images/Rectangle 15 (4).png" title="Office Wear" height="h-[700px]" />
        </div>
      </section>

      {/* Navigation Buttons */}
      <div className="flex justify-center items-center gap-4 py-12">
        <button className="border border-red-700 px-8 py-3 text-red-700 font-medium transition-all hover:bg-red-50 rounded-md">
          Back
        </button>
        <button className="text-center text-white text-lg font-medium cursor-pointer transition-all bg-[var(--bg-red)] hover:bg-red-800 px-8 py-3 rounded-md shadow-lg active:scale-95">
          Load More
        </button>
      </div>
    </div>
  );
};

const AccessoriesPage = () => {
  return (
    <FrontendLayout>
      <BeltGallery />
    </FrontendLayout>
  );
};

export default AccessoriesPage;
