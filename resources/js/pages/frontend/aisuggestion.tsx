import FrontendLayout from '@/layouts/frontend-layout';
import { Head, router } from '@inertiajs/react';
import React from 'react';

// Reusable Hover Component specifically for the AI Assistant layout
const AISuggestItem = ({ src, alt, title, height = "h-full", colSpan = "" }: { 
  src: string; 
  alt?: string; 
  title: string; 
  height?: string; 
  colSpan?: string 
}) => {
  return (
    <div className={`relative overflow-hidden rounded-md group cursor-pointer bg-white ${height} ${colSpan}`}>
      {/* Background Image with Zoom Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out group-hover:scale-110"
        style={{ backgroundImage: `url('${src}')` }}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gray/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-white p-6">
        <p className="text-xl font-light mb-4 tracking-wide uppercase opacity-0 translate-y-4 transition-all duration-700 group-hover:opacity-100 group-hover:translate-y-0">
          {title}
        </p>

        <div className="w-px h-12 bg-white mx-auto mb-4 scale-y-0 origin-top transition-all duration-700 delay-100 group-hover:scale-y-100"></div>

        <button onClick={() => router.get('/productdetails')} className="bg-[var(--bg-red)] px-8 py-3 text-sm font-medium uppercase tracking-tighter shadow-lg opacity-0 translate-y-4 transition-all duration-700 delay-200 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-red-800">
          View Details
        </button>
      </div>

      {/* Subtle border glow */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
};

const AISuggestionSection: React.FC = () => {
  return (
    <section className="bg-[var(--bg-whitesecandary)] font-sans text-gray-900 overflow-x-hidden pb-16">
      
      {/* SUGGESTION 1 */}
      <div className="max-w-4xl mx-auto font-sans mt-10 px-4">
        <button className="bg-[var(--bg-red)] text-white p-4 rounded-md mb-6 hover:brightness-110 transition-all active:scale-90">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold font-['Alumni_Sans'] text-[var(--bg-red)] tracking-tight">Suggestion 1</h2>
          <p className="text-gray-600 mt-1 font-['Libre_Franklin']">1k+ people buy this hoodies with this black pant</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[850px]">
          <div className="flex flex-col gap-4 h-full">
            <AISuggestItem src="assets/images/aiasisten1.png" title="Red Hoodie" height="flex-1" />
            <AISuggestItem src="assets/images/aiasisten3.png" title="Black Pants" height="flex-1" />
          </div>
          <AISuggestItem src="assets/images/aiasisten2.png" title="Full Outfit" height="h-full" />
        </div>
      </div>

      {/* SUGGESTION 2 */}
      <div className="max-w-4xl mx-auto font-sans mt-20 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-['Alumni_Sans'] text-[var(--bg-red)] tracking-tight">Suggestion 2</h2>
          <p className="text-gray-600 mt-1 font-['Libre_Franklin']">500+ people buy this hoodies with this black pant</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[600px]">
          <div className="flex flex-col gap-4">
            <AISuggestItem src="assets/images/Rectangle 25 (7).png" title="Black Pant" height="h-[200px]" />
            <AISuggestItem src="assets/images/Rectangle 27 (1).png" title="Black Pant" height="h-[200px]" />
            <AISuggestItem src="assets/images/Rectangle 28 (3).png" title="Black Pant" height="h-[200px]" />
          </div>

          <AISuggestItem src="assets/images/Frame 2147226341 (2).png" title="Lifestyle Look" height="h-full" />
        </div>

        <div className="flex justify-center">
            <button className="bg-[var(--bg-red)] text-white px-8 py-4 rounded-md mb-6 hover:bg-red-800 transition-all duration-300 mt-10 flex items-center gap-2 group shadow-xl">
                <i className="fa-solid fa-rotate group-hover:rotate-180 transition-transform duration-500" /> 
                <span>More AI Suggest</span>
            </button>
        </div>
      </div>
    </section>
  );
};

export default function AISuggestion() {
  return (
    <FrontendLayout>
      <Head title="AI Suggestion" />
      <AISuggestionSection />
    </FrontendLayout>
  );
}
