import React from 'react';

import { useReveal } from '@/hooks/use-reveal';

export function CTASection() {
    const [contentRef, contentVisible] = useReveal<HTMLDivElement>();
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-primary-900 via-primary-700 to-primary-900 py-24 text-white">
            <div className="absolute inset-0 opacity-10">
                <div className="animate-float absolute right-10 top-10 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
                <div className="animate-float absolute bottom-10 left-10 h-96 w-96 rounded-full bg-blue-400 blur-3xl" style={{ animationDelay: '3s' }} />
            </div>

            <div
                ref={contentRef}
                className={`relative z-10 mx-auto max-w-4xl px-6 transition-all duration-700 ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                <div className="space-y-8 text-center">
                    <h2 className="font-serif text-5xl font-bold md:text-6xl">Start Protecting Your Legacy Today</h2>
                    <p className="font-body text-xl text-blue-200 md:text-2xl">
                        Join thousands who have secured their family's future with Horizon Wills. Professional, affordable, and completely secure.
                    </p>

                    <div className="flex flex-col justify-center gap-4 pt-6 sm:flex-row">
                        <button className="rounded-full bg-white px-10 py-4 font-sans text-lg font-semibold text-primary-900 shadow-xl transition-all hover:scale-105 hover:bg-blue-100">
                            Create Your Will Now
                        </button>
                        {/* <button className="rounded-full border-2 border-white px-10 py-4 font-sans text-lg font-semibold transition-all hover:bg-white hover:text-primary-900">
                            Contact Us
                        </button> */}
                    </div>

                    {/* <p className="text-sm text-blue-200">
                        Call us:{' '}
                        <a href="tel:02045253605" className="font-semibold hover:underline">
                            020 4525 3605
                        </a>
                    </p> */}
                </div>
            </div>
        </section>
    );
}
