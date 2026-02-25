import React from 'react';

const featuredLogos = ['The Telegraph', 'Social Enterprise UK', 'Financial Times', 'Manchester Evening News'];

export function LpaFeaturedLogosSection() {
    return (
        <section className="bg-primary-50 py-14">
            <div className="container mx-auto px-6">
                <p className="text-center text-lg font-semibold text-primary-700 animate-fadeInUp">Proudly featured in</p>
                <div className="mt-8 grid grid-cols-2 gap-8 text-center text-primary-600 sm:grid-cols-4">
                    {featuredLogos.map((logo, index) => (
                        <div
                            key={logo}
                            className="rounded-xl bg-white/40 py-6 text-sm font-semibold uppercase tracking-widest animate-fadeInUp"
                            style={{ animationDelay: `${index * 80}ms` }}
                        >
                            {logo}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
