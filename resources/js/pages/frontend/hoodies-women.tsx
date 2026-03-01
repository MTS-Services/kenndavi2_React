import FrontendLayout from '@/layouts/frontend-layout';
import { Head, router } from '@inertiajs/react';
import React from 'react';

interface GalleryItemProps {
    src: string;
    alt: string;
    title: string;
    colSpan?: string;
    height?: string;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ src, alt, title, colSpan = "md:col-span-1", height = "h-[850px]" }) => {
  return (
    <div className={`${colSpan} ${height} relative overflow-hidden rounded-md group cursor-pointer bg-gray-200`}>
      {/* Background Image with Zoom Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center w-full h-full transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
        style={{ backgroundImage: `url('${src}')` }}
        role="img"
        aria-label={alt}
      >
        {/* Dynamic Overlay */}
        <div className="absolute inset-0 transition-all duration-700 ease-out from-black/10 via-black/15 to-transparent opacity-0 group-hover:opacity-100"></div>
        <div className="absolute inset-0 transition-colors duration-500 backdrop-brightness-100 group-hover:backdrop-brightness-90"></div>
      </div>

      {/* Content Container (Slide up and Fade in) */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4 transition-all duration-700 ease-out translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
        
        <h3 className="mb-4 text-xl md:text-2xl font-[Alumni_Sans] tracking-widest text-center uppercase">
          {title}
        </h3>

        {/* Decorative Line */}
        <div className="mb-4 h-12 w-px bg-white/50 transition-all duration-700 delay-100 scale-y-0 group-hover:scale-y-100 origin-top"></div>

        {/* The Button */}
        <button onClick={() => router.get('/productdetails')} className="bg-[var(--bg-red)] px-10 py-4 text-sm md:text-base font-medium transition-all duration-700 delay-200 ease-out opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 rounded hover:bg-red-800 shadow-xl relative overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
          <span className="relative z-10 text-white">View Details</span>
        </button>
      </div>

      {/* Border Glow */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/10 rounded-md transition-all duration-500 pointer-events-none"></div>
    </div>
  );
};

const ProductGallery: React.FC = () => {
  return (
    <div className="bg-[var(--bg-animation)] font-sans text-gray-900 overflow-x-hidden">
      
      {/* SECTION 1 */}
      <section className="p-4 md:p-8 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GalleryItem src="/assets/images/Rectangle 15 (1).png" alt="Tracksuit Back" title="Tracksuit Back" />
          <GalleryItem src="/assets/images/Rectangle 16 (1).png" alt="Tracksuit Front" title="Tracksuit Front" colSpan="md:col-span-2" />
          <div className="md:col-span-1 flex flex-col gap-4">
            <GalleryItem src="/assets/images/Rectangle 17 (1).png" alt="Aces Box" title="Aces Box" height="flex-1 min-h-[192px]" />
            <GalleryItem src="/assets/images/Frame 98.png" alt="Hoodie Flat" title="Hoodie Flat" height="flex-1 min-h-[192px]" />
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="p-4 md:p-8 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 flex flex-col gap-4">
            <GalleryItem src="/assets/images/Rectangle 20.png" alt="Aces Box" title="Aces Box" height="flex-1 min-h-[192px]" />
            <GalleryItem src="/assets/images/Frame 101 (2).png" alt="Hoodie Flat" title="Hoodie Flat" height="flex-1 min-h-[192px]" />
          </div>
          <GalleryItem src="/assets/images/Rectangle 19 (2).png" alt="Tracksuit Front" title="Tracksuit Front" colSpan="md:col-span-2" />
          <GalleryItem src="/assets/images/Rectangle 18 (2).png" alt="Tracksuit Back" title="Tracksuit Back" />
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="p-4 md:p-8 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GalleryItem src="/assets/images/Rectangle 21 (2).png" alt="Tracksuit Back" title="Tracksuit Back" />
          <GalleryItem src="/assets/images/Frame 104 (2).png" alt="Tracksuit Front" title="Tracksuit Front" colSpan="md:col-span-2" />
          <div className="md:col-span-1 flex flex-col gap-4">
            <GalleryItem src="/assets/images/Rectangle 23.png" alt="Aces Box" title="Aces Box" height="flex-1 min-h-[192px]" />
            <GalleryItem src="/assets/images/Frame 100 (4).png" alt="Hoodie Flat" title="Hoodie Flat" height="flex-1 min-h-[192px]" />
          </div>
        </div>
      </section>

      {/* Footer Buttons */}
      <div className="flex justify-center items-center gap-4 my-12">
        <button className="border border-red-700 px-8 py-3 text-red-700 font-medium transition-all hover:bg-red-50 rounded-md">
          Back
        </button>
        <button className="text-center text-white text-lg font-medium cursor-pointer transition-all bg-red-700 hover:bg-red-800 px-8 py-3 rounded-md shadow-lg active:scale-95">
          Load More
        </button>
      </div>
    </div>
  );
};

export default function HoodiesWomen() {
    return (
        <FrontendLayout>
            <Head title="Hoodies Women" />
            <ProductGallery />
        </FrontendLayout>
    );
}
