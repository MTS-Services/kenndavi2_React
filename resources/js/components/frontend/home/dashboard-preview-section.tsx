import React from 'react';

import { useReveal } from '@/hooks/use-reveal';

export function DashboardPreviewSection() {
    const [copyRef, copyVisible] = useReveal<HTMLDivElement>();
    const [cardRef, cardVisible] = useReveal<HTMLDivElement>(0.1);
    const checklist = [
        {
            title: 'About You - 1 minute',
            subtitle: 'Tell us a little bit about yourself',
            accent: 'text-green-400',
            icon: (
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                />
            ),
        },
        {
            title: 'Your Family',
            subtitle: 'Information about your beneficiaries',
            accent: 'text-gray-400',
            icon: (
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                    clipRule="evenodd"
                />
            ),
        },
        {
            title: 'Your Assets',
            subtitle: 'Details of your property and finances',
            accent: 'text-gray-400',
            icon: (
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                    clipRule="evenodd"
                />
            ),
        },
    ];

    return (
        <section className="bg-slate-900 py-24 text-white">
            <div className="container mx-auto px-6">
                <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
                    <div
                        ref={copyRef}
                        className={`order-2 space-y-6 md:order-1 transition-all duration-700 ease-out ${copyVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}
                    >
                        <h2 className="font-serif text-4xl font-bold md:text-5xl">My Will Dashboard</h2>
                        <p className="font-body text-xl leading-relaxed text-primary-200">
                            Welcome to your online will writing service. It can take as little as 15 minutes to create your will through our simple, step-by-step process.
                        </p>
                        <div className="space-y-4">
                            {checklist.map((item) => (
                                <div key={item.title} className="flex items-start gap-3">
                                    <svg className={`mt-1 h-6 w-6 shrink-0 ${item.accent}`} viewBox="0 0 20 20" fill="currentColor">
                                        {item.icon}
                                    </svg>
                                    <div>
                                        <p className="font-sans text-lg font-semibold">{item.title}</p>
                                        <p className="text-sm text-primary-200">{item.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-sans text-sm">Progress</span>
                                <span className="font-sans text-sm">0 of 5 Completed</span>
                            </div>
                            <div className="h-3 w-full rounded-full bg-slate-700">
                                <div className="h-3 w-1/5 rounded-full bg-linear-to-r from-slate-400 to-pink-500" />
                            </div>
                        </div>
                    </div>
                    <div
                        ref={cardRef}
                        className={`order-1 md:order-2 transition-all duration-700 ease-out ${cardVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
                    >
                        <div className="rounded-3xl bg-white p-8 shadow-2xl">
                            <div className="rounded-2xl border-2 border-slate-100 bg-cream p-8">
                                <h3 className="mb-4 font-serif text-3xl font-bold text-primary-900">Welcome John Arnold, to your online will writing service</h3>
                                <p className="mb-4 font-body leading-relaxed text-primary-700">
                                    Please fill out the <span className="font-semibold">will checklist</span> to complete your will. If you have any questions call us on{' '}
                                    <a href="tel:02045253605" className="font-semibold text-primary-600 hover:underline">
                                        020 4525 3605
                                    </a>
                                    .
                                </p>
                                <button className="rounded-full bg-slate-600 px-8 py-3 font-sans font-semibold text-white shadow-lg transition-colors hover:bg-slate-700">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
