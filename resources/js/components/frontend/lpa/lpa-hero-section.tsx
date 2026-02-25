import { Link } from '@inertiajs/react';
import React from 'react';

const heroStars = '★★★★★';

export function LpaHeroSection() {
    return (
        <section className="py-10">
            <div className="container mx-auto">
                <div className="relative mx-4 min-h-160 overflow-hidden rounded-3xl shadow-2xl lg:mx-10">
                    <img src="https://a.storyblok.com/f/309177/2925x1241/8329e36689/lpa_hero.avif" alt="Family enjoying life together" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

                    <div className="relative z-10 flex h-full flex-col justify-center px-8 py-16 text-white md:px-16 lg:max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60 animate-fadeInUp">Lasting Power of Attorney</p>
                        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl animate-fadeInUp" style={{ animationDelay: '50ms' }}>
                            Life planning that keeps pace with the 21st century.
                        </h1>
                        <p className="mt-6 text-lg text-white/80 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                            LPAs, wills, and support all in one place—guided by humans who care about your story as much as the paperwork.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/70 animate-fadeInUp" style={{ animationDelay: '150ms' }}>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold underline">Excellent</span>
                                <div className="flex gap-1 text-[11px]">
                                    {heroStars.split('').map((star, index) => (
                                        <span key={star + index} className="rounded bg-[#00b67a] px-1">
                                            {star}
                                        </span>
                                    ))}
                                </div>
                                <span className="italic">Trustpilot</span>
                            </div>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-4 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                            <Link
                                href={route('lpa.start')}
                                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
                            >
                                Let's get started
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
                                </svg>
                            </Link>
                        </div>
                        <p className="mt-10 text-[11px] text-white/70 animate-fadeInUp" style={{ animationDelay: '250ms' }}>
                            Our Head of Technology, Andrea, with his late dad.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
