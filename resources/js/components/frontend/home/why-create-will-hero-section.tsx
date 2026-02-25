import React from 'react';

type WhyCreateWillHeroProps = {
    headerRef: React.MutableRefObject<HTMLDivElement | null>;
    headerVisible: boolean;
    videoRef: React.MutableRefObject<HTMLDivElement | null>;
    videoVisible: boolean;
};

export function WhyCreateWillHeroSection({ headerRef, headerVisible, videoRef, videoVisible }: WhyCreateWillHeroProps) {
    return (
        <>
            <div
                ref={headerRef}
                className={`text-center mb-16 space-y-4 transition-all duration-700 ease-out ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary-900 text-balance">Why Should You Create A Will?</h2>
                <p className="text-xl text-primary-700 max-w-2xl mx-auto font-body">Protect what matters most and ensure your wishes are honored</p>
            </div>

            <div
                ref={videoRef}
                className={`mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-slate-200 shadow-2xl shadow-slate-300/40 transition-all duration-700 ease-out ${videoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                <div className="relative w-full pt-[56.25%]">
                    <video
                        controls
                        playsInline
                        preload="metadata"
                        autoPlay
                        muted
                        className="absolute inset-0 h-full w-full object-cover"
                    >
                        <source src="/assets/videos/home_page_video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
            
        </>

        
    );
}
