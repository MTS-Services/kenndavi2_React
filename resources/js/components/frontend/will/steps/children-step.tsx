import React, { useState } from 'react';
import type { Child } from './will-types';
import SmoothCollapse from './smooth-collapse';

const CHILDREN_FAQ = [
    { question: 'Should I list step-children?', answer: 'Yes. Any child or dependent you want covered by your will should be listed so the document can reference them explicitly.' },
    { question: 'When is a child considered dependent?', answer: 'Anyone under 18, or anyone financially dependent on you regardless of age, should be marked as a minor/dependent.' }
];

export interface ChildrenStepProps {
    hasChildren: boolean;
    childRecords: Child[];
    onChangeField: (field: 'hasChildren', value: boolean) => void;
    onAddChild: () => void;
    onChangeChildren: (children: Child[]) => void;
}

const ChildrenStep: React.FC<ChildrenStepProps> = ({ hasChildren, childRecords, onChangeField, onAddChild, onChangeChildren }) => {
    const [faqTooltip, setFaqTooltip] = useState<{ text: string; top: number } | null>(null);

    const updateChild = (index: number, fields: Partial<Child>) => {
        const updated = [...childRecords];
        updated[index] = { ...updated[index], ...fields };
        onChangeChildren(updated);
    };

    const removeChild = (index: number) => {
        onChangeChildren(childRecords.filter((_, i) => i !== index));
    };

    const handleHasChildrenToggle = (value: boolean) => {
        onChangeField('hasChildren', value);
        if (value) {
            if (childRecords.length === 0) {
                onAddChild();
            }
        } else {
            onChangeChildren([]);
        }
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-4">Children</h2>
            <p className="text-sm md:text-base text-secondary mb-8">Do you have any living children?</p>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => handleHasChildrenToggle(true)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${hasChildren ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                        >
                            YES
                        </button>
                        <button
                            type="button"
                            onClick={() => handleHasChildrenToggle(false)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${!hasChildren ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                        >
                            NO
                        </button>
                    </div>

                    <SmoothCollapse isOpen={hasChildren}>
                        {childRecords.map((child, index) => (
                            <div key={child.id} className="rounded border border-slate-200 bg-white shadow-lg p-6 mb-6 last:mb-0">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-base font-semibold text-secondary">Child</p>
                                    {childRecords.length > 1 && (
                                        <button type="button" onClick={() => removeChild(index)} className="text-rose-500 text-xs font-semibold uppercase tracking-wide hover:text-rose-600">
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm text-secondary mb-1">Full Name:</label>
                                        <input
                                            type="text"
                                            value={child.fullName}
                                            onChange={(e) => updateChild(index, { fullName: e.target.value })}
                                            className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                            placeholder="e.g. William Timothy Smith"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm md:text-base text-primary-600 mb-3">Is this child either a minor or a dependant?</p>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => updateChild(index, { isMinor: true })}
                                                className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${child.isMinor ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                                            >
                                                YES
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateChild(index, { isMinor: false })}
                                                className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${!child.isMinor ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                                            >
                                                NO
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={onAddChild}
                            className="text-secondary text-sm font-semibold hover:underline"
                        >
                            + Add another child
                        </button>
                    </SmoothCollapse>
                </div>

                <aside className="rounded border border-slate-200 bg-white shadow-sm p-6 h-fit">
                    <h3 className="text-base font-semibold text-primary-700 mb-4">Frequently Asked Questions</h3>
                    <div className="relative" onMouseLeave={() => setFaqTooltip(null)}>
                        <ul className="space-y-3 text-sm text-primary-600">
                            {CHILDREN_FAQ.map((item) => (
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

export default ChildrenStep;
