import React, { useState } from 'react';
import type { Guardian } from './will-types';
import { UK_COUNTRY_OPTIONS } from './wizard-constants';
import SmoothCollapse from './smooth-collapse';

const GUARDIAN_FAQ = [
    { question: 'Who can be a guardian?', answer: 'Any responsible adult over 18 who is willing to take on the role. It is best to discuss this with them before naming them.' },
    { question: 'What is a guardian?', answer: 'A guardian is someone you appoint to look after your minor or dependent children if you pass away.' }
];

export interface GuardianStepProps {
    wantsGuardian: boolean;
    guardians: Guardian[];
    onToggleGuardian: (value: boolean) => void;
    onAddGuardian: () => void;
    onChangeGuardians: (guardians: Guardian[]) => void;
}

const GuardianStep: React.FC<GuardianStepProps> = ({ wantsGuardian, guardians, onToggleGuardian, onAddGuardian, onChangeGuardians }) => {
    const [faqTooltip, setFaqTooltip] = useState<{ text: string; top: number } | null>(null);

    const updateGuardian = (index: number, fields: Partial<Guardian>) => {
        const updated = [...guardians];
        updated[index] = { ...updated[index], ...fields };
        onChangeGuardians(updated);
    };

    const removeGuardian = (index: number) => {
        onChangeGuardians(guardians.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-4">Appoint a Guardian</h2>
            <p className="text-sm md:text-base text-secondary mb-8">Do you want to appoint a guardian for your minor or dependent child?</p>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => onToggleGuardian(true)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${wantsGuardian ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                        >
                            YES
                        </button>
                        <button
                            type="button"
                            onClick={() => onToggleGuardian(false)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${!wantsGuardian ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                        >
                            NO
                        </button>
                    </div>

                    <SmoothCollapse isOpen={wantsGuardian}>
                        {guardians.map((guardian, index) => (
                            <div key={guardian.id} className="rounded border border-slate-200 bg-white shadow-lg p-6 mb-6 last:mb-0">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-base font-semibold text-primary-700">Guardian Details</p>
                                    {guardians.length > 1 && (
                                        <button type="button" onClick={() => removeGuardian(index)} className="text-rose-500 text-xs font-semibold uppercase tracking-wide hover:text-rose-600">
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm text-secondary mb-1">Full Name:</label>
                                        <input
                                            type="text"
                                            value={guardian.fullName}
                                            onChange={(e) => updateGuardian(index, { fullName: e.target.value })}
                                            className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                            placeholder="e.g. William Timothy Smith"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-secondary mb-1">City/Town:</label>
                                        <input
                                            type="text"
                                            value={guardian.city}
                                            onChange={(e) => updateGuardian(index, { city: e.target.value })}
                                            className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                            placeholder="e.g. London"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-secondary mb-1">Country:</label>
                                        <select
                                            value={guardian.country}
                                            onChange={(e) => updateGuardian(index, { country: e.target.value })}
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
                        ))}

                        <button
                            type="button"
                            onClick={onAddGuardian}
                            className="text-secondary text-sm font-semibold hover:underline"
                        >
                            + Add another guardian
                        </button>
                    </SmoothCollapse>
                </div>

                <aside className="rounded border border-slate-200 bg-white shadow-sm p-6 h-fit">
                    <h3 className="text-base font-semibold text-primary-700 mb-4">Frequently Asked Questions</h3>
                    <div className="relative" onMouseLeave={() => setFaqTooltip(null)}>
                        <ul className="space-y-3 text-sm text-primary-600">
                            {GUARDIAN_FAQ.map((item) => (
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

export default GuardianStep;
