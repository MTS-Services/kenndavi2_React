import React, { useState } from 'react';
import SmoothCollapse from './smooth-collapse';

const DELAY_INHERITANCE_FAQ = [
    { question: 'How will the property be held?', answer: 'If you delay inheritance, the assets will be held in trust by your executors or guardians until the child reaches the specified age.' }
];

export interface DelayInheritanceStepProps {
    wantsDelay: boolean;
    inheritanceAge: string;
    onToggleDelay: (value: boolean) => void;
    onChangeAge: (age: string) => void;
}

const DelayInheritanceStep: React.FC<DelayInheritanceStepProps> = ({ wantsDelay, inheritanceAge, onToggleDelay, onChangeAge }) => {
    const [faqTooltip, setFaqTooltip] = useState<{ text: string; top: number } | null>(null);

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-4">Delay Inheritance</h2>
            <p className="text-sm md:text-base text-secondary mb-8">Do you want your minor beneficiaries to wait until a certain age before they receive their inheritance?</p>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => onToggleDelay(true)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${wantsDelay ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                        >
                            YES
                        </button>
                        <button
                            type="button"
                            onClick={() => onToggleDelay(false)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${!wantsDelay ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                        >
                            NO
                        </button>
                    </div>

                    <SmoothCollapse isOpen={wantsDelay}>
                        <div>
                            <label className="block text-sm text-secondary mb-1">Receive inheritance at age:</label>
                            <select
                                value={inheritanceAge}
                                onChange={(e) => onChangeAge(e.target.value)}
                                className="w-full max-w-xs border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 focus:border-secondary focus:outline-none transition-colors cursor-pointer"
                            >
                                {Array.from({ length: 8 }, (_, i) => String(18 + i)).map((age) => (
                                    <option key={age} value={age}>{age}</option>
                                ))}
                            </select>
                        </div>
                    </SmoothCollapse>
                </div>

                <aside className="rounded border border-slate-200 bg-white shadow-sm p-6 h-fit">
                    <h3 className="text-base font-semibold text-primary-700 mb-4">Frequently Asked Questions</h3>
                    <div className="relative" onMouseLeave={() => setFaqTooltip(null)}>
                        <ul className="space-y-3 text-sm text-primary-600">
                            {DELAY_INHERITANCE_FAQ.map((item) => (
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

export default DelayInheritanceStep;
