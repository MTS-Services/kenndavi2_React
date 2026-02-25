import React from 'react';

const benefits = [
    'Generate recurring revenue by selling digital will + LPA bundles online.',
    'Offer premium add-ons like storage, consultations, and bespoke drafting.',
    'Clients can self-serve 24/7, freeing you to focus on growth.',
    'Secure authentication, audit logs, and backups keep data protected.',
];

const pages = [
    'Home landing page',
    'Create a Will flow',
    'LPA Health & Welfare page',
    'LPA Property & Finance page',
    'About page',
    'Contact page',
    'Login / Register',
    'User dashboard',
];

export function TeamSection() {
    return (
        <section className="bg-primary-900 py-20 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div className="space-y-8 text-white">
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Key benefits</p>
                        <h2 className="text-3xl font-serif font-semibold leading-tight sm:text-4xl">Why investors love Will Writing Online</h2>
                        <p className="text-base leading-relaxed text-white/80">
                            This isn’t a brochure site. It’s a full SaaS-style application with authentication, dashboards, PDF automation, and customer communications. You’re buying the infrastructure to run a serious legal services venture remotely.
                        </p>
                        <ul className="space-y-4 text-sm leading-relaxed text-white/90">
                            {benefits.map((benefit) => (
                                <li key={benefit} className="flex items-start gap-3">
                                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-white/70" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="rounded-3xl bg-white/10 p-6 text-sm text-white">
                            <p className="font-semibold">What’s next?</p>
                            <p className="mt-2">
                                Email Clara Martinez (support@willwrite.online) to review numbers, see a live walkthrough, or reserve the next deployment slot.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-4xl bg-white p-6 sm:p-8 shadow-[0_25px_60px_rgba(15,23,42,0.18)]">
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">Customizable pages</p>
                        <h3 className="mt-3 text-2xl font-semibold text-primary-900">You control every page your clients see</h3>
                        <p className="mt-4 text-sm leading-relaxed text-primary-600">
                            Swap copy, images, or brand colors and deploy on your own domain. The component-based build makes it fast to tailor without touching the core application logic.
                        </p>
                        <div className="mt-6 grid gap-3 md:grid-cols-2">
                            {pages.map((page) => (
                                <div key={page} className="rounded-2xl border border-primary-100 bg-primary-50/50 p-4 text-sm font-medium text-primary-800">
                                    {page}
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 rounded-3xl border border-dashed border-primary-200 p-6 text-center">
                            <p className="text-sm text-primary-700">
                                Need extra pages (blog, FAQs, pricing variations)? We can scope them during onboarding.
                            </p>
                            <a
                                href="mailto:support@willwrite.online"
                                className="mt-4 inline-flex items-center justify-center rounded-full border border-primary-500 px-6 py-3 text-sm font-semibold text-primary-500 shadow-lg transition hover:bg-primary-500 hover:text-white"
                            >
                                Schedule a build review
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
