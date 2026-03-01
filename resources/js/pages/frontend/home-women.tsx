import FrontendLayout from '@/layouts/frontend-layout';
import { Head, router } from '@inertiajs/react';
import React from 'react';

const HomeWomen: React.FC = () => {
    return (
        <FrontendLayout>
                    <Head title="Home Page" />
                    <section className="bg-[var(--bg-animation)] font-sans text-gray-900 overflow-x-hidden">
                        <section className="relative min-h-[90vh] lg:h-[80vh] flex flex-col lg:flex-row items-center px-6 md:px-12 lg:px-24 overflow-hidden container mx-auto lg:pt-20 pt-8">
                        <div className="relative max-w-xl z-20 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                            <div className="flex">
                                <img src="/assets/images/Group 2.png" alt="" />
                            </div>
                            <p className="text-[12px] font-semibold font-['Libre_Franklin'] tracking-widest text-gray-800">Friendship Worn. Culture Shown.</p>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold font-['Alumni_Sans'] leading-[1.1] mb-10">
                            Aces in Da Hole is not your ordinary clothing brand. It's where friendship, culture, lifestyle, and fashion come together.
                            </h1>
                            
                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                            <button className="bg-[var(--bg-red)] text-white px-10 py-3.5 text-sm font-medium font-['Libre_Franklin'] rounded-md hover:bg-black transition w-full sm:w-auto">Buy Now</button>
                            <button className="border border-[var(--bg-red)] text-[var(--bg-red)] px-10 py-3.5 text-sm font-medium font-['Libre_Franklin'] rounded-md hover:bg-[var(--bg-red)] hover:text-white transition w-full sm:w-auto">Learn More</button>
                            </div>
                        </div>
        
                        <div className="relative lg:absolute right-0 lg:right-[-10%] top-0 h-[50vh] lg:h-full w-full lg:w-2/3 flex items-center justify-center lg:mt-12 mt-0" 
                            style={{ backgroundImage: 'url("/assets/images/Group 1.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                            <div className="absolute inset-0 opacity-10 blur-[120px] rounded-full scale-75 transform translate-x-20"></div>
                            <img src="/assets/images/wommen1.png" alt="Hero" className="relative z-10 h-[80%] lg:h-[90%] object-contain drop-shadow-2xl" />
                        </div>
        
                        <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-[var(--bg-red)] text-white w-12 h-12 items-center justify-center rounded-md z-30">
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
        
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-[var(--bg-red)] text-white w-12 h-12 items-center justify-center rounded-md z-30">
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
        
                        </section>
        
                        <div className="bg-[var(--bg-red)] text-white py-3 overflow-hidden whitespace-nowrap">
                            <div className="inline-block animate-[scroll_30s_linear_infinite] text-[10px] font-bold uppercase tracking-widest">
                                Free Standard Delivery & 30-Day Free Returns | Free Standard Delivery & 30-Day Free Returns | Free Standard Delivery & 30-Day Free Returns | Free Standard Delivery & 30-Day Free Returns | Free Standard Delivery & 30-Day Free Returns | Free Standard Delivery & 30-Day Free Returns |
                            </div>
                        </div>
        
                        <div className="text-[var(--bg-black)] container mx-auto">
                            <section className="px-10 lg:px-24 lg:py-20 py-6">
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="lg:text-5xl text-3xl font-semibold tracking-tight font-['Alumni_Sans']">Category</h2>
                                    <div className="flex gap-3">
                                        <button className="bg-[var(--bg-red)] text-white p-3.5 hover:bg-black transition rounded-md shadow-md"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M15 19l-7-7 7-7"></path></svg></button>
                                        <button className="bg-[var(--bg-red)] text-white p-3.5 hover:bg-black transition rounded-md shadow-md"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M9 5l7 7-7 7"></path></svg></button>
                                    </div>
                                </div>
        
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
                                    <div className="group cursor-pointer">
                                        <div className="relative overflow-hidden rounded-md group cursor-pointer h-[174px] lg:h-[820px] w-full">
                                    {/* Background Image with Zoom Effect */}
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                                        style={{ backgroundImage: "url('/assets/images/Rectangle 13.png')" }} 
                                    >
                                        {/* Dynamic Overlay that changes on hover */}
                                        <div className="absolute inset-0 transition-all duration-700 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-black/40 group-hover:via-black/20 group-hover:to-transparent"></div>
                                        <div className="absolute inset-0 transition-colors duration-500 backdrop-brightness-100 group-hover:backdrop-brightness-90"></div>
                                    </div>
        
                                    {/* Content Container with multiple animations */}
                                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4 transition-all duration-700 ease-out 
                                                    translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100">
                                        
                                        {/* Title with slide-up and fade effect */}
                                        <h1 className="mb-4 md:mb-8 text-xl md:text-2xl lg:text-3xl font-[Alumni_Sans] tracking-wide text-center
                                                    transition-all duration-700 delay-100
                                                    translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                            Teal sweatsuits
                                        </h1>
        
                                        {/* Decorative Line with elastic animation */}
                                        <div className="mb-4 lg:mb-8 h-10 lg:h-24 w-px bg-white/50
                                                    transition-all duration-700 delay-200
                                                    scale-y-0 group-hover:scale-y-100 origin-top"></div>
        
                                        {/* The Button with pop-up effect */}
                                        <button 
                                            onClick={() => router.visit('/productdetails')} 
                                            className="bg-[var(--bg-red)] lg:w-full max-w-[200px] sm:w-auto px-10 py-3 md:py-4 text-base md:text-lg font-medium 
                                                    transition-all duration-700 delay-300 ease-elastic
                                                    opacity-0 scale-75 rotate-[-5deg] pointer-events-none
                                                    group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 group-hover:pointer-events-auto
                                                    hover:bg-[var(--bg-red-dark)] active:scale-95
                                                    shadow-lg hover:shadow-xl
                                                    relative overflow-hidden"
                                        >
                                            {/* Button shine effect */}
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                                            <span className="relative z-10">View Details</span>
                                        </button>
                                    </div>
                                    
                                    {/* Optional: Image border glow on hover */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-md transition-all duration-500 pointer-events-none"></div>
                                </div>
                                        <h3 className="mt-6 lg:text-4xl text-3xl font-semibold font-['Alumni_Sans'] tracking-tight">Hoodies</h3>
                                    </div>
        
                                    <div className="group cursor-pointer">
                                        <div className="relative overflow-hidden rounded-md group cursor-pointer h-[174px] lg:h-[820px] w-full">
                                    {/* Background Image with Zoom Effect */}
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                                        style={{ backgroundImage: "url('/assets/images/Rectangle 13 (1).png')" }} 
                                    >
                                        {/* Dynamic Overlay that changes on hover */}
                                        <div className="absolute inset-0 transition-all duration-700 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-black/40 group-hover:via-black/20 group-hover:to-transparent"></div>
                                        <div className="absolute inset-0 transition-colors duration-500 backdrop-brightness-100 group-hover:backdrop-brightness-90"></div>
                                    </div>
        
                                    {/* Content Container with multiple animations */}
                                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4 transition-all duration-700 ease-out 
                                                    translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100">
                                        
                                        {/* Title with slide-up and fade effect */}
                                        <h1 className="mb-4 md:mb-8 text-xl md:text-2xl lg:text-3xl font-[Alumni_Sans] tracking-wide text-center
                                                    transition-all duration-700 delay-100
                                                    translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                            Teal sweatsuits
                                        </h1>
        
                                        {/* Decorative Line with elastic animation */}
                                        <div className="mb-4 lg:mb-8 h-10 lg:h-24 w-px bg-white/50
                                                    transition-all duration-700 delay-200
                                                    scale-y-0 group-hover:scale-y-100 origin-top"></div>
        
                                        {/* The Button with pop-up effect */}
                                        <button 
                                            onClick={() => router.visit('/productdetails')} 
                                            className="bg-[var(--bg-red)] lg:w-full max-w-[200px] sm:w-auto px-10 py-3 md:py-4 text-base md:text-lg font-medium 
                                                    transition-all duration-700 delay-300 ease-elastic
                                                    opacity-0 scale-75 rotate-[-5deg] pointer-events-none
                                                    group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 group-hover:pointer-events-auto
                                                    hover:bg-[var(--bg-red-dark)] active:scale-95
                                                    shadow-lg hover:shadow-xl
                                                    relative overflow-hidden"
                                        >
                                            {/* Button shine effect */}
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                                            <span className="relative z-10">View Details</span>
                                        </button>
                                    </div>
                                    
                                    {/* Optional: Image border glow on hover */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-md transition-all duration-500 pointer-events-none"></div>
                                </div>
                                        <h3 className="mt-6 lg:text-4xl text-3xl font-semibold font-['Alumni_Sans'] tracking-tight">Sweatsuits</h3>
                                    </div>
                                    
                                </div>
                            </section>
                        </div>
        
        
                       <div className="text-black container mx-auto">
                        <section className="px-10 lg:px-24 lg:py-20 py-6">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="lg:text-5xl text-3xl font-semibold tracking-tight font-['Alumni_Sans']">Featured Products</h2>
                            </div>
             
                            <div className="grid grid-cols-2 gap-8">                         
        
                                 <div className="relative overflow-hidden rounded-md group cursor-pointer h-[174px] lg:h-[820px] w-full">
                                    {/* Background Image with Zoom Effect */}
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                                        style={{ backgroundImage: "url('/assets/images/Rectangle 9.png')" }} 
                                    >
                                        {/* Dynamic Overlay that changes on hover */}
                                        <div className="absolute inset-0 transition-all duration-700 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-black/40 group-hover:via-black/20 group-hover:to-transparent"></div>
                                        <div className="absolute inset-0 transition-colors duration-500 backdrop-brightness-100 group-hover:backdrop-brightness-90"></div>
                                    </div>
        
                                    {/* Content Container with multiple animations */}
                                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4 transition-all duration-700 ease-out 
                                                    translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100">
                                        
                                        {/* Title with slide-up and fade effect */}
                                        <h1 className="mb-4 md:mb-8 text-xl md:text-2xl lg:text-3xl font-[Alumni_Sans] tracking-wide text-center
                                                    transition-all duration-700 delay-100
                                                    translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                            Teal sweatsuits
                                        </h1>
        
                                        {/* Decorative Line with elastic animation */}
                                        <div className="mb-4 lg:mb-8 h-10 lg:h-24 w-px bg-white/50
                                                    transition-all duration-700 delay-200
                                                    scale-y-0 group-hover:scale-y-100 origin-top"></div>
        
                                        {/* The Button with pop-up effect */}
                                        <button 
                                            onClick={() => router.visit('/productdetails')} 
                                            className="bg-[var(--bg-red)] lg:w-full max-w-[200px] sm:w-auto px-10 py-3 md:py-4 text-base md:text-lg font-medium 
                                                    transition-all duration-700 delay-300 ease-elastic
                                                    opacity-0 scale-75 rotate-[-5deg] pointer-events-none
                                                    group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 group-hover:pointer-events-auto
                                                    hover:bg-[var(--bg-red-dark)] active:scale-95
                                                    shadow-lg hover:shadow-xl
                                                    relative overflow-hidden"
                                        >
                                            {/* Button shine effect */}
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                                            <span className="relative z-10">View Details</span>
                                        </button>
                                    </div>
                                    
                                    {/* Optional: Image border glow on hover */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-md transition-all duration-500 pointer-events-none"></div>
                                </div>
                               
                                <div className="relative overflow-hidden rounded-md group cursor-pointer h-[174px] lg:h-[820px] w-full">
                                    {/* Background Image with Zoom Effect */}
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                                        style={{ backgroundImage: "url('/assets/images/Frame 42.png')" }} 
                                    >
                                        {/* Dynamic Overlay that changes on hover */}
                                        <div className="absolute inset-0 transition-all duration-700 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-black/40 group-hover:via-black/20 group-hover:to-transparent"></div>
                                        <div className="absolute inset-0 transition-colors duration-500 backdrop-brightness-100 group-hover:backdrop-brightness-90"></div>
                                    </div>
        
                                    {/* Content Container with multiple animations */}
                                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4 transition-all duration-700 ease-out 
                                                    translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100">
                                        
                                        {/* Title with slide-up and fade effect */}
                                        <h1 className="mb-4 md:mb-8 text-xl md:text-2xl lg:text-3xl font-[Alumni_Sans] tracking-wide text-center
                                                    transition-all duration-700 delay-100
                                                    translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                            Teal sweatsuits
                                        </h1>
        
                                        {/* Decorative Line with elastic animation */}
                                        <div className="mb-4 lg:mb-8 h-10 lg:h-24 w-px bg-white/50
                                                    transition-all duration-700 delay-200
                                                    scale-y-0 group-hover:scale-y-100 origin-top"></div>
        
                                        {/* The Button with pop-up effect */}
                                        <button 
                                            onClick={() => router.visit('/productdetails')} 
                                            className="bg-[var(--bg-red)] lg:w-full max-w-[200px] sm:w-auto px-10 py-3 md:py-4 text-base md:text-lg font-medium 
                                                    transition-all duration-700 delay-300 ease-elastic
                                                    opacity-0 scale-75 rotate-[-5deg] pointer-events-none
                                                    group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 group-hover:pointer-events-auto
                                                    hover:bg-[var(--bg-red-dark)] active:scale-95
                                                    shadow-lg hover:shadow-xl
                                                    relative overflow-hidden"
                                        >
                                            {/* Button shine effect */}
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                                            <span className="relative z-10">View Details</span>
                                        </button>
                                    </div>
                                    
                                    {/* Optional: Image border glow on hover */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-md transition-all duration-500 pointer-events-none"></div>
                                </div>
        
                                <div className="relative overflow-hidden rounded-md group cursor-pointer h-[174px] lg:h-[820px] w-full">
                                    {/* Background Image with Zoom Effect */}
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                                        style={{ backgroundImage: "url('/assets/images/Rectangle 13 (2).png')" }} 
                                    >
                                        {/* Dynamic Overlay that changes on hover */}
                                        <div className="absolute inset-0 transition-all duration-700 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-black/40 group-hover:via-black/20 group-hover:to-transparent"></div>
                                        <div className="absolute inset-0 transition-colors duration-500 backdrop-brightness-100 group-hover:backdrop-brightness-90"></div>
                                    </div>
        
                                    {/* Content Container with multiple animations */}
                                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4 transition-all duration-700 ease-out 
                                                    translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100">
                                        
                                        {/* Title with slide-up and fade effect */}
                                        <h1 className="mb-4 md:mb-8 text-xl md:text-2xl lg:text-3xl font-[Alumni_Sans] tracking-wide text-center
                                                    transition-all duration-700 delay-100
                                                    translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                            Teal sweatsuits
                                        </h1>
        
                                        {/* Decorative Line with elastic animation */}
                                        <div className="mb-4 lg:mb-8 h-10 lg:h-24 w-px bg-white/50
                                                    transition-all duration-700 delay-200
                                                    scale-y-0 group-hover:scale-y-100 origin-top"></div>
        
                                        {/* The Button with pop-up effect */}
                                        <button 
                                            onClick={() => router.visit('/productdetails')} 
                                            className="bg-[var(--bg-red)] lg:w-full max-w-[200px] sm:w-auto px-10 py-3 md:py-4 text-base md:text-lg font-medium 
                                                    transition-all duration-700 delay-300 ease-elastic
                                                    opacity-0 scale-75 rotate-[-5deg] pointer-events-none
                                                    group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 group-hover:pointer-events-auto
                                                    hover:bg-[var(--bg-red-dark)] active:scale-95
                                                    shadow-lg hover:shadow-xl
                                                    relative overflow-hidden"
                                        >
                                            {/* Button shine effect */}
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                                            <span className="relative z-10">View Details</span>
                                        </button>
                                    </div>
                                    
                                    {/* Optional: Image border glow on hover */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-md transition-all duration-500 pointer-events-none"></div>
                                </div>
                                
                                <div className="relative overflow-hidden rounded-md group cursor-pointer h-[174px] lg:h-[820px] w-full">
                                    {/* Background Image with Zoom Effect */}
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                                        style={{ backgroundImage: "url('/assets/images/Rectangle 13 (2).png')" }} 
                                    >
                                        {/* Dynamic Overlay that changes on hover */}
                                        <div className="absolute inset-0 transition-all duration-700 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-black/40 group-hover:via-black/20 group-hover:to-transparent"></div>
                                        <div className="absolute inset-0 transition-colors duration-500 backdrop-brightness-100 group-hover:backdrop-brightness-90"></div>
                                    </div>
        
                                    {/* Content Container with multiple animations */}
                                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4 transition-all duration-700 ease-out 
                                                    translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100">
                                        
                                        {/* Title with slide-up and fade effect */}
                                        <h1 className="mb-4 md:mb-8 text-xl md:text-2xl lg:text-3xl font-[Alumni_Sans] tracking-wide text-center
                                                    transition-all duration-700 delay-100
                                                    translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                            Teal sweatsuits
                                        </h1>
        
                                        {/* Decorative Line with elastic animation */}
                                        <div className="mb-4 lg:mb-8 h-10 lg:h-24 w-px bg-white/50
                                                    transition-all duration-700 delay-200
                                                    scale-y-0 group-hover:scale-y-100 origin-top"></div>
        
                                        {/* The Button with pop-up effect */}
                                        <button 
                                            onClick={() => router.visit('/productdetails')} 
                                            className="bg-[var(--bg-red)] lg:w-full max-w-[200px] sm:w-auto px-10 py-3 md:py-4 text-base md:text-lg font-medium 
                                                    transition-all duration-700 delay-300 ease-elastic
                                                    opacity-0 scale-75 rotate-[-5deg] pointer-events-none
                                                    group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 group-hover:pointer-events-auto
                                                    hover:bg-[var(--bg-red-dark)] active:scale-95
                                                    shadow-lg hover:shadow-xl
                                                    relative overflow-hidden"
                                        >
                                            {/* Button shine effect */}
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                                            <span className="relative z-10">View Details</span>
                                        </button>
                                    </div>
                                    
                                    {/* Optional: Image border glow on hover */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-md transition-all duration-500 pointer-events-none"></div>
                                </div>
        
                            </div>
                        </section>
                        </div>
        
                        <div className="text-gray-900 container mx-auto">
                            <section className="px-10 lg:px-24 lg:py-20 py-6">
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="lg:text-5xl text-3xl font-semibold tracking-tight font-['Alumni_Sans']">New Arrivals</h2> 
                                </div>
        
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
                                    <div className="group cursor-pointer">
                                        <div className="relative overflow-hidden rounded-md group cursor-pointer h-[174px] lg:h-[820px] w-full">
                                    {/* Background Image with Zoom Effect */}
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                                        style={{ backgroundImage: "url('/assets/images/Rectangle 13 (3).png')" }} 
                                    >
                                        {/* Dynamic Overlay that changes on hover */}
                                        <div className="absolute inset-0 transition-all duration-700 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-black/40 group-hover:via-black/20 group-hover:to-transparent"></div>
                                        <div className="absolute inset-0 transition-colors duration-500 backdrop-brightness-100 group-hover:backdrop-brightness-90"></div>
                                    </div>
        
                                    {/* Content Container with multiple animations */}
                                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4 transition-all duration-700 ease-out 
                                                    translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100">
                                        
                                        {/* Title with slide-up and fade effect */}
                                        <h1 className="mb-4 md:mb-8 text-xl md:text-2xl lg:text-3xl font-[Alumni_Sans] tracking-wide text-center
                                                    transition-all duration-700 delay-100
                                                    translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                            Teal sweatsuits
                                        </h1>
        
                                        {/* Decorative Line with elastic animation */}
                                        <div className="mb-4 lg:mb-8 h-10 lg:h-24 w-px bg-white/50
                                                    transition-all duration-700 delay-200
                                                    scale-y-0 group-hover:scale-y-100 origin-top"></div>
        
                                        {/* The Button with pop-up effect */}
                                        <button 
                                            onClick={() => router.visit('/productdetails')} 
                                            className="bg-[var(--bg-red)] lg:w-full max-w-[200px] sm:w-auto px-10 py-3 md:py-4 text-base md:text-lg font-medium 
                                                    transition-all duration-700 delay-300 ease-elastic
                                                    opacity-0 scale-75 rotate-[-5deg] pointer-events-none
                                                    group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 group-hover:pointer-events-auto
                                                    hover:bg-[var(--bg-red-dark)] active:scale-95
                                                    shadow-lg hover:shadow-xl
                                                    relative overflow-hidden"
                                        >
                                            {/* Button shine effect */}
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                                            <span className="relative z-10">View Details</span>
                                        </button>
                                    </div>
                                    
                                    {/* Optional: Image border glow on hover */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-md transition-all duration-500 pointer-events-none"></div>
                                </div>
                                        <button className="bg-[var(--bg-red)] px-10 py-4 text-lg font-medium transition-colors hover:bg-[var(--bg-red-dark)] active:scale-95 mt-4 text-gray-100 rounded-md">
                                            See All
                                        </button>
                                    </div>
        
                                    <div className="group cursor-pointer">
                                        <div className="relative overflow-hidden rounded-md group cursor-pointer h-[174px] lg:h-[820px] w-full">
                                    {/* Background Image with Zoom Effect */}
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                                        style={{ backgroundImage: "url('/assets/images/Frame 43 (1).png')" }} 
                                    >
                                        {/* Dynamic Overlay that changes on hover */}
                                        <div className="absolute inset-0 transition-all duration-700 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-black/40 group-hover:via-black/20 group-hover:to-transparent"></div>
                                        <div className="absolute inset-0 transition-colors duration-500 backdrop-brightness-100 group-hover:backdrop-brightness-90"></div>
                                    </div>
        
                                    {/* Content Container with multiple animations */}
                                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4 transition-all duration-700 ease-out 
                                                    translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100">
                                        
                                        {/* Title with slide-up and fade effect */}
                                        <h1 className="mb-4 md:mb-8 text-xl md:text-2xl lg:text-3xl font-[Alumni_Sans] tracking-wide text-center
                                                    transition-all duration-700 delay-100
                                                    translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                            Teal sweatsuits
                                        </h1>
        
                                        {/* Decorative Line with elastic animation */}
                                        <div className="mb-4 lg:mb-8 h-10 lg:h-24 w-px bg-white/50
                                                    transition-all duration-700 delay-200
                                                    scale-y-0 group-hover:scale-y-100 origin-top"></div>
        
                                        {/* The Button with pop-up effect */}
                                        <button 
                                            onClick={() => router.visit('/productdetails')} 
                                            className="bg-[var(--bg-red)] lg:w-full max-w-[200px] sm:w-auto px-10 py-3 md:py-4 text-base md:text-lg font-medium 
                                                    transition-all duration-700 delay-300 ease-elastic
                                                    opacity-0 scale-75 rotate-[-5deg] pointer-events-none
                                                    group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 group-hover:pointer-events-auto
                                                    hover:bg-[var(--bg-red-dark)] active:scale-95
                                                    shadow-lg hover:shadow-xl
                                                    relative overflow-hidden"
                                        >
                                            {/* Button shine effect */}
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                                            <span className="relative z-10">View Details</span>
                                        </button>
                                    </div>
                                    
                                    {/* Optional: Image border glow on hover */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-md transition-all duration-500 pointer-events-none"></div>
                                </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                </section>
                </FrontendLayout>
    );
};

export default HomeWomen;