import React from 'react';

const floatingBadges = [
    { color: 'bg-primary-500', delay: '0s' },
    { color: 'bg-primary-400', delay: '0.3s' },
    { color: 'bg-primary-300', delay: '0.6s' },
    { color: 'bg-slate-500', delay: '0.9s' },
    { color: 'bg-slate-400', delay: '1.2s' },
];

export function LpaSupportSection() {
    return (
        <section id="support" className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-20 text-white">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute left-10 top-16 h-64 w-64 rounded-full bg-primary-600 blur-3xl" />
                <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-primary-400 blur-3xl" />
            </div>
            <div className="container relative mx-auto grid gap-12 px-6 lg:grid-cols-2">
                <div className="animate-fadeInLeft">
                    <h2 className="text-4xl font-semibold">Need a helping hand?</h2>
                    <p className="mt-4 text-lg text-white/80">Our estate planners stay with you from first call to final signature.</p>
                </div>
                <div>
                    <p className="text-lg text-white/80 animate-fadeInRight">
                        Message or call when you’re unsure. We’ll translate jargon, review drafts, and notify attorneys instantly when updates go live.
                    </p>
                    <div className="mt-6 flex gap-3 animate-fadeInRight" style={{ animationDelay: '100ms' }}>
                        <div className="flex -space-x-4">
                            {floatingBadges.map((badge) => (
                                <span key={badge.color} className={`h-14 w-14 rounded-full border-4 border-slate-900 ${badge.color} animate-float`} style={{ animationDelay: badge.delay }} />
                            ))}
                        </div>
                    </div>
                    <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary-900 transition hover:-translate-y-0.5 animate-fadeInRight" style={{ animationDelay: '150ms' }}>
                        Speak to our team
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
