import React from 'react';

import { useReveal } from '@/hooks/use-reveal';

export function FindingSupportSection() {
    const [headerRef, headerVisible] = useReveal<HTMLDivElement>();
    const [cardsRef, cardsVisible] = useReveal<HTMLDivElement>(0.1);
    const cards = [
        {
            title: 'Grief Resources',
            desc: 'Access counseling services, support groups, and educational materials to help you process your loss.',
            icon: (
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            title: 'Essential Checklist',
            desc: 'Follow our step-by-step guide to handle immediate tasks, from notifying authorities to managing finances.',
            icon: (
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
        },
        {
            title: 'Community Support',
            desc: 'Connect with others who understand your experience through our compassionate online community.',
            icon: (
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
            ),
        },
    ];

    return (
        <section id="support" className="relative overflow-hidden bg-linear-to-br from-slate-900 via-primary-800 to-primary-900 py-24 text-white">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-slate-500 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-400 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-6">
                <div
                    ref={headerRef}
                    className={`mb-16 space-y-4 text-center transition-all duration-700 ease-out ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <h2 className="font-serif text-5xl font-bold md:text-6xl">Probate Services</h2>
                    <p className="mx-auto max-w-2xl font-body text-xl text-primary-200">Resources and guidance to help you navigate grief and handle practical matters</p>
                </div>

                <div ref={cardsRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className={`rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg transition-all duration-700 ease-out ${cardsVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                                } hover:-translate-y-2 hover:bg-white/15 hover:border-white/40`}
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-500/30">{card.icon}</div>
                            <h3 className="mb-4 font-serif text-2xl font-semibold">{card.title}</h3>
                            <p className="leading-relaxed text-primary-100">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
