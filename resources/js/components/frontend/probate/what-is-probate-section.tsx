import React from 'react';

import { useScrollAnimation } from '@/hooks/use-scroll-animation';

export function WhatIsProbateSection() {
    const [sectionRef, isVisible] = useScrollAnimation<HTMLDivElement>();
    const base = 'transition-all duration-700 ease-out';
    const state = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

    return (
        <section ref={sectionRef} className="bg-white py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className={`text-4xl font-bold text-center text-gray-900 mb-12 ${base} ${state}`} style={{ transitionDelay: '0ms' }}>
                    What is probate?
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className={`space-y-6 ${base} ${state}`} style={{ transitionDelay: '150ms' }}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Probate is a legal document</h3>
                        <p className="text-gray-700">
                            It gives you the authority to handle the estate, property, and personal possessions (the
                            assets) of the person who died.
                        </p>

                        <h3 className="text-2xl font-bold text-gray-900">
                            You may need to apply for probate even if there is a will
                        </h3>
                        <p className="text-gray-700">
                            If someone has died and you&apos;ve named as an executor in their will, or you&apos;re their next of
                            kin (administrators), you may need to apply for probate.
                        </p>
                    </div>

                    <div className={`flex justify-center ${base} ${state}`} style={{ transitionDelay: '250ms' }}>
                        <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-40 h-40 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className={`text-center mt-12 ${base} ${state}`} style={{ transitionDelay: '350ms' }}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Find out if you need probate</h3>
                    <button className="text-primary-500 px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        0300 102 0984
                    </button>
                </div>
            </div>
        </section>
    );
}
