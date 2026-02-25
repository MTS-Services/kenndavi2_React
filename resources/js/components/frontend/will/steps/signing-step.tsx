import React, { useState } from 'react';
import { UK_COUNTRY_OPTIONS } from './wizard-constants';

const SIGNING_TIMELINE_OPTIONS = [
    { key: 'today', label: 'Today' },
    { key: 'this-month', label: 'This Month' },
    { key: 'unsure', label: 'Unsure' },
    { key: 'specific-date', label: 'Specific Date' }
] as const;

const SIGNING_FAQ = [
    { question: 'How do I change my signing country?', answer: 'You can set any signing country you prefer. The will remains valid so long as local witnessing rules are followed in that country.' }
];

export interface SigningStepProps {
    signingTimeline: 'today' | 'this-month' | 'unsure' | 'specific-date';
    signingDate: string;
    signingCity: string;
    signingCountry: string;
    onChangeTimeline: (value: 'today' | 'this-month' | 'unsure' | 'specific-date') => void;
    onChangeDate: (value: string) => void;
    onChangeCity: (value: string) => void;
    onChangeCountry: (value: string) => void;
}

const SigningStep: React.FC<SigningStepProps> = ({
    signingTimeline,
    signingDate,
    signingCity,
    signingCountry,
    onChangeTimeline,
    onChangeDate,
    onChangeCity,
    onChangeCountry
}) => {
    const [faqTooltip, setFaqTooltip] = useState<{ text: string; top: number } | null>(null);

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-4">Signing Details</h2>
            <p className="text-sm md:text-base text-secondary mb-8">Tell us when and where you expect to sign your Last Will.</p>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-8">
                    <div>
                        <p className="text-sm text-primary-600 mb-4">When will you sign your Last Will?</p>
                        <div className="space-y-3">
                            {SIGNING_TIMELINE_OPTIONS.map((option) => (
                                <button
                                    key={option.key}
                                    type="button"
                                    onClick={() => onChangeTimeline(option.key)}
                                    className={`w-full text-left px-5 py-3 rounded border-2 text-sm font-medium transition-all ${signingTimeline === option.key
                                        ? 'border-secondary text-secondary bg-secondary/5'
                                        : 'border-slate-200 text-primary-600 bg-white hover:border-slate-300'}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        {signingTimeline === 'specific-date' && (
                            <div className="mt-4">
                                <label className="block text-sm text-secondary mb-1">Select the date:</label>
                                <input
                                    type="date"
                                    value={signingDate}
                                    onChange={(event) => onChangeDate(event.target.value)}
                                    className="border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 focus:border-secondary focus:outline-none transition-colors w-full"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="text-sm text-primary-600 mb-4">Where will you sign your Last Will?</p>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm text-secondary mb-1">City/Town:</label>
                                <input
                                    type="text"
                                    value={signingCity}
                                    onChange={(event) => onChangeCity(event.target.value)}
                                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                    placeholder="e.g. London"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-secondary mb-1">Country:</label>
                                <select
                                    value={signingCountry}
                                    onChange={(event) => onChangeCountry(event.target.value)}
                                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 focus:border-secondary focus:outline-none transition-colors cursor-pointer"
                                >
                                    {UK_COUNTRY_OPTIONS.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="rounded border border-slate-200 bg-white shadow-sm p-6 h-fit">
                    <h3 className="text-base font-semibold text-primary-700 mb-4">Frequently Asked Questions</h3>
                    <div className="relative" onMouseLeave={() => setFaqTooltip(null)}>
                        <ul className="space-y-3 text-sm text-primary-600">
                            {SIGNING_FAQ.map((item) => (
                                <li key={item.question} className="border-b text-left border-slate-100 pb-3 last:border-b-0 last:pb-0">
                                    <button
                                        type="button"
                                        onMouseEnter={(event) => {
                                            const offsetTop = event.currentTarget.parentElement?.offsetTop ?? 0;
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

export default SigningStep;
