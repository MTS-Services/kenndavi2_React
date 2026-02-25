import React from 'react';

export function LpaTestimonialsSection() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-20">
            <div className="container mx-auto grid gap-12 px-6 text-white lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
                <div className="space-y-6 animate-fadeInLeft">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-200">Testimonials</p>
                    <h2 className="text-4xl font-extrabold leading-tight text-white">What people say about us</h2>
                    <p className="text-lg text-white/80">Real stories of trust, satisfaction, and estate support handled with care.</p>
                </div>

                <div className="grid gap-6 animate-fadeInRight">
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
                        <img src="/assets/images/lpa_hero.jpg" alt="Family testimonial" className="h-60 w-full object-cover" />
                        <div className="space-y-4 p-8">
                            <svg className="h-12 w-12 text-primary-200" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7.17 6.17A5 5 0 0 1 12 11v7H5v-6.5C5 9.01 5.9 7.12 7.17 6.17z" />
                                <path d="M16.17 6.17A5 5 0 0 1 21 11v7h-7v-6.5c0-2.49.9-4.38 2.17-5.33z" />
                            </svg>
                            <p className="text-lg leading-relaxed text-white/85">
                                “I thought writing an LPA solo would be simple, but I was overwhelmed. Horizon stepped in, explained every clause, and delivered a flawless pack ready to
                                sign. The relief is huge.”
                            </p>
                            <div className="flex flex-col gap-2">
                                <p className="font-semibold text-white">Samantha S.</p>
                                <div className="flex items-center gap-1 text-xs text-white/70">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <span key={index}>★</span>
                                    ))}
                                    <span className="ml-2 text-[11px] uppercase tracking-[0.3em]">Trustpilot</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
