import React, { useState } from 'react';
import type { AdditionalClause } from './will-types';
import SmoothCollapse from './smooth-collapse';

const ADDITIONAL_DETAILS_FAQ = [
    { question: 'Why should I avoid including funeral instructions?', answer: 'Your will may not be read until after your funeral. It is better to communicate funeral wishes directly to your family or executor.' },
    { question: 'How should I write my clause?', answer: 'Be as specific as possible. Include full names, amounts, and any conditions. Avoid vague language that could be misinterpreted.' }
];

export interface AdditionalDetailsStepProps {
    wantsClauses: boolean;
    clauses: AdditionalClause[];
    onToggle: (value: boolean) => void;
    onAddClause: () => void;
    onChangeClauses: (clauses: AdditionalClause[]) => void;
}

const AdditionalDetailsStep: React.FC<AdditionalDetailsStepProps> = ({
    wantsClauses,
    clauses,
    onToggle,
    onAddClause,
    onChangeClauses
}) => {
    const [faqTooltip, setFaqTooltip] = useState<{ text: string; top: number } | null>(null);

    const updateClause = (index: number, text: string) => {
        const updated = [...clauses];
        updated[index] = { ...updated[index], text };
        onChangeClauses(updated);
    };

    const removeClause = (index: number) => {
        onChangeClauses(clauses.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-4">Additional Details</h2>
            <p className="text-sm md:text-base text-secondary mb-8">Do you want to include any additional instructions?</p>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => onToggle(true)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${wantsClauses ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                        >
                            YES
                        </button>
                        <button
                            type="button"
                            onClick={() => onToggle(false)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${!wantsClauses ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                        >
                            NO
                        </button>
                    </div>

                    <SmoothCollapse isOpen={wantsClauses}>
                        {clauses.map((clause, index) => (
                            <div key={clause.id} className="rounded border border-slate-200 bg-white shadow-lg p-6 mb-6 last:mb-0">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-base font-semibold text-secondary">Additional Clause</p>
                                    {clauses.length > 1 && (
                                        <button type="button" onClick={() => removeClause(index)} className="text-rose-500 text-xs font-semibold uppercase tracking-wide hover:text-rose-600">
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <textarea
                                    value={clause.text}
                                    onChange={(e) => updateClause(index, e.target.value)}
                                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors min-h-24 resize-y"
                                    placeholder="e.g. I wish to forgive Jane Smith's debt of £5,000 incurred on January 1, 2017, for the purchase of a vehicle."
                                />
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={onAddClause}
                            className="text-secondary text-sm font-semibold hover:underline"
                        >
                            + Add another clause
                        </button>
                    </SmoothCollapse>
                </div>

                <aside className="rounded border border-slate-200 bg-white shadow-sm p-6 h-fit">
                    <h3 className="text-base font-semibold text-primary-700 mb-4">Frequently Asked Questions</h3>
                    <div className="relative" onMouseLeave={() => setFaqTooltip(null)}>
                        <ul className="space-y-3 text-sm text-primary-600">
                            {ADDITIONAL_DETAILS_FAQ.map((item) => (
                                <li key={item.question} className="border-b text-left border-slate-100 pb-3 last:border-b-0 last:pb-0">
                                    <button
                                        type="button"
                                        onMouseEnter={(e) => {
                                            const offsetTop = e.currentTarget.parentElement?.offsetTop ?? 0;
                                            setFaqTooltip({ text: item.answer, top: offsetTop });
                                        }}
                                        className="font-medium text-secondary hover:underline"
                                    >
                                        {item.question}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {faqTooltip && (
                            <div
                                className="absolute left-[calc(100%+1rem)] w-64 rounded-lg border border-slate-200 bg-white p-4 text-xs text-primary-600 shadow-lg"
                                style={{ top: faqTooltip.top }}
                            >
                                <div className="absolute -left-2 top-4 h-0 w-0 border-y-8 border-y-transparent border-r-8 border-r-slate-200" />
                                <div className="absolute -left-3.5 top-4 h-0 w-0 border-y-7 border-y-transparent border-r-7 border-r-white" />
                                {faqTooltip.text}
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AdditionalDetailsStep;
