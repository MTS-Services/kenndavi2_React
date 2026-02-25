import React, { useMemo, useState } from 'react';

type FaqItem = {
    q: string;
    a: string;
};

export function ContactFaqSection() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const faqItems: FaqItem[] = useMemo(
        () => [
            {
                q: 'How much does it cost to make a Will?',
                a: 'Costs vary depending on complexity. Book a free consultation and we’ll provide a precise quote after understanding your needs.',
            },
            {
                q: 'What is the difference between a Will and a Codicil?',
                a: 'A Will outlines everything from scratch, while a Codicil is a legal add-on that updates specific clauses of an existing Will.',
            },
            {
                q: 'What can I include in my Will?',
                a: 'You can cover property, guardianship, business interests, personal items, funeral wishes, and more—we’ll guide you through what applies.',
            },
            {
                q: 'Do I need legal professionals to write my Will?',
                a: 'DIY Wills can cause errors or disputes. Professional guidance ensures signatures, witnesses, and wording all hold up when needed.',
            },
            {
                q: 'How much does it cost to change your Will?',
                a: 'Minor changes may be done via a Codicil; bigger updates may require a new Will. We’ll recommend the most cost-effective option.',
            },
        ],
        []
    );

    return (
        <section className="bg-white pb-16">
            <div className="container mx-auto px-6">
                <h2 className="text-center text-2xl font-semibold text-primary-600 animate-fadeInUp">Frequently Asked Questions</h2>

                <div className="mx-auto mt-8 max-w-6xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                    {faqItems.map((item, idx) => {
                        const isOpen = openFaq === idx;

                        return (
                            <div
                                key={item.q}
                                className="p-5 md:p-6 animate-fadeInUp"
                                style={{ animationDelay: `${idx * 80}ms` }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                                    className="flex w-full items-start justify-between gap-4 text-left"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="mt-0.5 text-primary-600">
                                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        <p className="font-semibold text-primary-900">{item.q}</p>
                                    </div>

                                    <span className="mt-1 text-primary-400">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </button>

                                {isOpen ? (
                                    <p className="mt-3 pl-9 text-sm leading-relaxed text-primary-600">{item.a}</p>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
