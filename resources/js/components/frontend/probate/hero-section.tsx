import React from 'react';

import { useScrollAnimation } from '@/hooks/use-scroll-animation';

export function HeroSection() {
    const [sectionRef, isVisible] = useScrollAnimation<HTMLDivElement>();
    const animatedBase = 'transition-all duration-700 ease-out';
    const animatedState = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

    return (
        <section ref={sectionRef} className="bg-white py-16 px-4">
            <div className="max-w-6xl mx-auto text-center space-y-8">
                <h1
                    className={`text-4xl md:text-5xl font-bold text-gray-900 leading-tight ${animatedBase} ${animatedState}`}
                    style={{ transitionDelay: '0ms' }}
                >
                    Award-winning,<br />low-cost probate
                </h1>

                <p
                    className={`text-lg text-gray-700 max-w-2xl mx-auto ${animatedBase} ${animatedState}`}
                    style={{ transitionDelay: '150ms' }}
                >
                    Take the stress out of probate, with our fixed-fee service, talk to our team today.
                </p>

                <div className={`${animatedBase} ${animatedState}`} style={{ transitionDelay: '250ms' }}>
                    <button className="bg-slate-500 text-white border-2 border-slate-400 px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
                        Get a quote in 5 minutes
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>

                {/* Trust badges */}
                <div className={`flex flex-wrap justify-center gap-6 ${animatedBase} ${animatedState}`} style={{ transitionDelay: '350ms' }}>
                    <div className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold">Trustpilot</div>
                    <div className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold">Feefo</div>
                    <div className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold">Google</div>
                </div>

                <p
                    className={`text-sm text-gray-600 ${animatedBase} ${animatedState}`}
                    style={{ transitionDelay: '450ms' }}
                >
                    ⭐ 4 star Will & Probate Firm of the Year<br />
                    at the British Customer Care Excellence Award 2023
                </p>
            </div>
        </section>
    );
}
