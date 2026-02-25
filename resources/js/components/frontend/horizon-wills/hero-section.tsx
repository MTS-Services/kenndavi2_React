import React from 'react';

import { ArrowRight } from 'lucide-react';

export function HorizonHeroSection() {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-primary-900 via-primary-800 to-primary-600 py-16 sm:py-20 lg:py-24">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="relative container mx-auto px-4 sm:px-6">
                <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="space-y-8 text-white">
                        <p className="text-xs font-semibold uppercase tracking-[0.55em] text-white/70">Exclusive Opportunity</p>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold leading-tight">
                            Unlock a high-return business opportunity with Will Writing Online
                        </h1>
                        <p className="text-base sm:text-lg text-white/80">
                            Launch a profitable will and LPA creation service from home. Operate entirely online with a secure Laravel platform that already handles user accounts, dashboards, PDF generation, and admin tools.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                { label: '61% of UK adults', detail: 'still do not have a valid will.' },
                                { label: '5.4M adults', detail: 'need guidance on how to begin.' },
                                { label: '100% remote', detail: 'run the entire business online.' },
                                { label: 'Fully automated', detail: 'no manual document building required.' },
                            ].map((item) => (
                                <div key={item.label} className="rounded-2xl border border-white/20 bg-white/10 p-4">
                                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">{item.label}</p>
                                    <p className="mt-2 text-base text-white">{item.detail}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <a
                                href="mailto:support@willwrite.online"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-500 bg-white px-6 py-3 text-sm font-semibold text-primary-500 shadow-lg transition hover:text-white hover:border-white hover:-translate-y-0.5 hover:bg-transparent"
                            >
                                Get full opportunity deck
                                <ArrowRight className="h-4 w-4" />
                            </a>
                            <div className="text-sm text-white/80">
                                Questions? Email Clara Martinez
                                <br />📧 support@willwrite.online
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur">
                        <h2 className="text-xl font-semibold text-primary-900">Run the business completely online</h2>
                        <p className="mt-3 text-sm leading-relaxed text-primary-600">
                            Clients create wills and LPAs through a branded portal. Every interaction — onboarding, questionnaires, PDF delivery, status tracking, messaging — happens digitally, so you can focus on marketing and customer support from anywhere.
                        </p>
                        <ul className="mt-6 space-y-3 text-sm text-primary-700">
                            {[
                                'Secure multi-user dashboard with role-based access',
                                'Automated PDF generation for wills and LPAs',
                                'Laravel tech stack for performance and scalability',
                                '30 days of post-delivery implementation support',
                            ].map((point) => (
                                <li key={point} className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50/80 p-4 text-sm text-primary-800">
                            No face-to-face meetings required. Deploy on your domain with our onboarding support, then manage everything remotely.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}