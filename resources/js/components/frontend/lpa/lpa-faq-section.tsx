import React, { useState } from 'react';

const faqItems = [
    {
        question: 'Do I need a will?',
        answer: 'If you own property, have children, or want to control how your estate is shared, a will or LPA ensures UK law follows your wishes rather than the default intestacy process.',
    },
    {
        question: 'What kind of will do I need?',
        answer: 'We help you pick between single, mirror, or trust-based wills depending on your relationship status, assets, and any vulnerable beneficiaries you want to protect.',
    },
    {
        question: 'What is a will with trust?',
        answer: 'A trust lets you ring-fence money for children or dependants. Our planners explain the tax and inheritance benefits and draft the trust clauses inside your will.',
    },
    {
        question: 'What is a mirror will?',
        answer: 'Mirror wills are paired documents for couples with similar wishes. They’re quick to set up with us and can include LPAs so attorneys know exactly how to act.',
    },
];

export function LpaFaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleQuestion = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section className="bg-primary-100/50 px-6 py-20">
            <div className="mx-auto max-w-5xl">
                <h2 className="text-center text-4xl font-semibold text-primary-900 animate-fadeInUp">Helping you make the right choice</h2>
                <div className="mt-10 space-y-0">
                    {faqItems.map((question, index) => (
                        <div key={question.question} className="border-b border-slate-200 py-2 animate-fadeInUp" style={{ animationDelay: `${index * 80}ms` }}>
                            <button
                                type="button"
                                onClick={() => toggleQuestion(index)}
                                className="flex w-full items-center justify-between text-left"
                                aria-expanded={openIndex === index}
                            >
                                <span className="text-lg font-medium text-primary-900">{question.question}</span>
                                <span
                                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-500 text-white transition ${openIndex === index ? 'rotate-180' : ''}`}
                                >
                                    {openIndex === index ? '−' : '+'}
                                </span>
                            </button>
                            <div
                                className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-400 ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                aria-hidden={openIndex !== index}
                            >
                                <div className="overflow-hidden pt-0 text-sm text-primary-600">
                                    <div className="pt-4">
                                        <p>{question.answer}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-10 flex justify-center animate-fadeInUp" style={{ animationDelay: '250ms' }}>
                    <button className="rounded-full border-2 border-slate-500 px-8 py-3 text-sm font-semibold text-primary-900 transition hover:bg-slate-500 hover:text-white">Show more</button>
                </div>
            </div>
        </section>
    );
}
