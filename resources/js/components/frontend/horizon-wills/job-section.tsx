import React from 'react';

import { useReveal } from '@/hooks/use-reveal';

const features = [
    {
        title: 'User accounts & dashboards',
        detail: 'Clients register, save drafts, and download documents directly from their personal workspace.'
    },
    {
        title: 'Automated PDF generation',
        detail: 'Once questionnaires are complete, the system compiles legally formatted PDFs instantly.'
    },
    {
        title: 'Secure messaging + notifications',
        detail: 'In-app messages keep every conversation in one place with audit trails for compliance.'
    },
    {
        title: 'Deployment + 30-day support',
        detail: 'We help launch on your domain and provide post-delivery assistance while you onboard clients.'
    },
];

export function JobSection() {
    const [textRef, textVisible] = useReveal<HTMLDivElement>();
    const [cardRef, cardVisible] = useReveal<HTMLDivElement>(0.2);

    return (
        <section className="py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    <div
                        ref={cardRef}
                        className={`order-2 flex justify-center lg:order-1 lg:justify-start transition-all duration-700 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    >
                        <div className="w-full max-w-xl rounded-4xl border border-primary-100 bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
                            <div className="rounded-2xl bg-primary-900/90 p-6 text-white">
                                <p className="text-sm uppercase tracking-[0.4em] text-white/70">Platform snapshot</p>
                                <p className="mt-3 text-2xl font-semibold">Everything you need to operate day one</p>
                                <p className="mt-3 text-sm text-white/80">
                                    Clients move from lead to signed documents in one cohesive system. You focus on marketing, while the platform handles onboarding, payments, documents, and reporting.
                                </p>
                            </div>
                            <ul className="mt-6 space-y-4 text-sm text-primary-700">
                                {features.map((feature) => (
                                    <li key={feature.title} className="rounded-2xl border border-primary-50 bg-primary-50/50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-500">{feature.title}</p>
                                        <p className="mt-2 text-base leading-relaxed text-primary-800">{feature.detail}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div
                        ref={textRef}
                        className={`order-1 space-y-6 text-center lg:order-2 lg:text-left transition-all duration-700 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    >
                        <p className="text-xs uppercase tracking-[0.35em] text-primary-500">Key features</p>
                        <h2 className="text-3xl font-semibold text-primary-900 sm:text-4xl">What you get with Will Writing Online</h2>
                        <p className="text-base leading-relaxed text-primary-700 sm:text-lg">
                            You receive every page, workflow, and automation needed to run the service remotely: Home, About, Will creation, LPA (Health & Welfare + Property & Finance), Contact, authentication, and user dashboards.
                        </p>
                        <p className="text-base leading-relaxed text-primary-700 sm:text-lg">
                            We provide deployment guidance plus 30 days of handover support so you can onboard paying clients fast.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                            <a
                                href="mailto:support@willwrite.online"
                                className="inline-flex items-center border border-primary-500 justify-center gap-2 rounded-full bg-primary-500 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-transparent hover:text-primary-500"
                            >
                                Request demo access →
                            </a>
                            <a
                                href="mailto:support@willwrite.online"
                                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-900 px-8 py-3 text-sm font-semibold text-primary-900 transition hover:bg-primary-500 hover:text-white"
                            >
                                Talk to Clara →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
