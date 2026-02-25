import React, { useState } from 'react';

const faqItems = ['Do I need a will?', 'What kind of will do I need?', 'What is a will with trust?', 'What is a mirror will?'];

export function WillWritingFaqSection() {
    const [openIndex, setOpenIndex] = useState<null | number>(null);

    return (
        <section className="px-4 py-16 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl text-center">
                <h3 className="text-3xl font-serif font-semibold text-primary-900 animate-fadeInUp">Helping you make the right choice</h3>
                <div className="mt-10 divide-y divide-slate-200 rounded-3xl border border-slate-100 bg-white text-left">
                    {faqItems.map((question, index) => (
                        <button
                            key={question}
                            type="button"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="flex w-full items-center justify-between px-6 py-5 text-left text-sm font-semibold text-primary-900 transition hover:bg-primary-50"
                        >
                            <span>{question}</span>
                            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition ${openIndex === index ? 'rotate-45' : ''}`}>
                                +
                            </span>
                        </button>
                    ))}
                </div>
                <div className="mt-8 flex justify-center">
                    <button className="rounded-full bg-primary-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">
                        Show more
                    </button>
                </div>
            </div>
        </section>
    );
}
