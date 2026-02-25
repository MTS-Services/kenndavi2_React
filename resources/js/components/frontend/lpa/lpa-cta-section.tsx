import React from 'react';

export function LpaCtaSection() {
    return (
        <section className="bg-primary-50 py-16">
            <div className="container mx-auto px-6">
                <div className="rounded-3xl bg-primary-900 p-10 text-white shadow-2xl">
                    <div className="space-y-4 animate-fadeInLeft">
                        <h2 className="text-3xl font-light leading-tight sm:text-4xl">
                            Call <span className="font-semibold">0333 049 9397</span> for LPA, will, and probate support.
                        </h2>
                        <p className="text-sm text-primary-100">Lines open Monday to Friday · 9am – 5pm</p>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-4 animate-fadeInRight">
                        <a href="#planning" className="rounded-full border border-white px-6 py-3 text-sm font-semibold transition hover:bg-white/10">
                            Request a quote
                        </a>
                        <a href="#planning" className="rounded-full border border-white px-6 py-3 text-sm font-semibold transition hover:bg-white/10">
                            Request a callback
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
