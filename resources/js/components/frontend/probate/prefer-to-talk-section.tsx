import React from 'react';

import { useScrollAnimation } from '@/hooks/use-scroll-animation';

export function PreferToTalkSection() {
    const [sectionRef, isVisible] = useScrollAnimation<HTMLDivElement>();
    const base = 'transition-all duration-700 ease-out';
    const state = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

    return (
        <section ref={sectionRef} className="bg-white py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className={`space-y-6 ${base} ${state}`} style={{ transitionDelay: '0ms' }}>
                        <h2 className="text-4xl font-bold text-gray-900">Prefer to talk?</h2>
                        <p className="text-lg text-gray-700">
                            In just 5 minutes, one of our friendly specialists will help you work out:
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="text-primary-500 text-xl">✓</span>
                                <p className="text-gray-700">Whether you need probate</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-primary-500 text-xl">✓</span>
                                <p className="text-gray-700">How much it&apos;ll cost to get started</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-primary-500 text-xl">✓</span>
                                <p className="text-gray-700">What information you&apos;ll need for the application</p>
                            </div>
                        </div>

                        <div className={`bg-slate-100 border-2 border-slate-400 rounded-xl p-4 ${base} ${state}`} style={{ transitionDelay: '200ms' }}>
                            <p className="font-semibold text-gray-900 mb-2">We&apos;re here to help</p>
                            <button
                                className="bg-slate-500 text-primary-50 px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 w-full justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                0300 102 0984
                            </button>
                        </div>

                        <div className={`flex items-center gap-2 ${base} ${state}`} style={{ transitionDelay: '300ms' }}>
                            <div className="flex -space-x-2">
                                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"></div>
                                <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white"></div>
                                <div className="w-10 h-10 rounded-full bg-gray-500 border-2 border-white"></div>
                            </div>
                        </div>
                    </div>

                    <div className={`flex justify-center ${base} ${state}`} style={{ transitionDelay: '400ms' }}>
                        <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-40 h-40 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}