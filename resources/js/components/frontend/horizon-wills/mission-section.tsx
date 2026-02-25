import React from 'react';

import { useReveal } from '@/hooks/use-reveal';

const reasons = [
    {
        title: 'Massive market demand',
        detail: '61% of UK adults do not have a will, and 5.4M people are unsure where to start. You can serve this audience immediately.'
    },
    {
        title: 'Fully automated workflow',
        detail: 'Clients complete guided questionnaires online, generate PDFs, and manage revisions without manual admin work.'
    },
    {
        title: 'Work from anywhere',
        detail: 'No face-to-face meetings. Every consultation, payment, document, and update lives inside the secure portal.'
    },
    {
        title: 'Laravel foundations',
        detail: 'Built on modern Laravel so you benefit from reliability, security, and easy scalability compared to template builders.'
    },
];

export function MissionSection() {
    const [contentRef, contentVisible] = useReveal<HTMLDivElement>();
    const [listRef, listVisible] = useReveal<HTMLDivElement>(0.2);

    return (
        <section className="bg-slate-50 py-20 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6">
                <div
                    ref={contentRef}
                    className={`mx-auto mb-12 max-w-3xl text-center transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">Why this business works</p>
                    <h2 className="mt-4 text-3xl font-semibold text-primary-900 sm:text-4xl">Why this opportunity is right for you</h2>
                    <p className="mt-5 text-base leading-relaxed text-primary-600 sm:text-lg">
                        Will Writing Online lets you run a legitimate legal-services business in the cloud. Clients complete every step digitally while you focus on acquiring leads, nurturing relationships, and generating recurring revenue.
                    </p>
                </div>

                <div
                    ref={listRef}
                    className={`grid gap-6 md:grid-cols-2 transition-all duration-700 ${listVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    {reasons.map((reason) => (
                        <div key={reason.title} className="rounded-3xl border border-primary-100 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-400">{reason.title}</p>
                            <p className="mt-3 text-base leading-relaxed text-primary-700">{reason.detail}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
