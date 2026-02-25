import React, { useState } from 'react';
import type { Executor } from './will-types';
import { UK_COUNTRY_OPTIONS } from './wizard-constants';
import SmoothCollapse from './smooth-collapse';

const FAQ_ITEMS = [
    {
        question: 'Who cannot be my executor?',
        answer: 'You cannot choose a minor or someone who has been convicted of a serious offence. Some jurisdictions also restrict executors who live outside of the country.'
    },
    {
        question: 'What does an executor do?',
        answer: 'Executors gather assets, pay debts and taxes, then distribute the remaining estate exactly as set out in your will.'
    },
    {
        question: 'Do executors work together?',
        answer: 'If you appoint more than one executor they share legal responsibility and should make key decisions jointly.'
    }
];

export interface ExecutorsStepProps {
    executors: Executor[];
    wantsAlternateExecutor: boolean;
    alternateExecutors: Executor[];
    onAddExecutor: () => void;
    onChangeExecutors: (executors: Executor[]) => void;
    onToggleAlternate: (value: boolean) => void;
    onAddAlternate: () => void;
    onChangeAlternates: (executors: Executor[]) => void;
    showBackupSection: boolean;
    showSpouseQuestion?: boolean;
    spouseName?: string;
    spouseIsExecutor?: boolean;
    onToggleSpouseExecutor?: (value: boolean) => void;
    partnerLabel?: string;
}

const ExecutorsStep: React.FC<ExecutorsStepProps> = ({
    executors,
    wantsAlternateExecutor,
    alternateExecutors,
    onAddExecutor,
    onChangeExecutors,
    onToggleAlternate,
    onAddAlternate,
    onChangeAlternates,
    showBackupSection,
    showSpouseQuestion = false,
    spouseName = '',
    spouseIsExecutor = false,
    onToggleSpouseExecutor,
    partnerLabel = 'your spouse'
}) => {
    const [faqTooltip, setFaqTooltip] = useState<{ text: string; top: number } | null>(null);
    const spouseFirstName = spouseName?.trim().split(' ')[0] ?? spouseName;

    const setExecutorFields = (index: number, fields: Partial<Executor>, isAlternate: boolean = false) => {
        const updated = [...(isAlternate ? alternateExecutors : executors)];
        updated[index] = { ...updated[index], ...fields };
        if (isAlternate) {
            onChangeAlternates(updated);
        } else {
            onChangeExecutors(updated);
        }
    };

    const handleFullNameChange = (index: number, value: string, isAlternate: boolean = false) => {
        const trimmed = value.trim();
        if (!trimmed) {
            setExecutorFields(index, { firstName: '', lastName: '' }, isAlternate);
            return;
        }

        const parts = trimmed.split(/\s+/);
        const firstName = parts.shift() ?? '';
        const lastName = parts.join(' ');
        setExecutorFields(index, { firstName, lastName }, isAlternate);
    };

    const removeExecutor = (index: number, isAlternate: boolean = false) => {
        if (isAlternate) {
            onChangeAlternates(alternateExecutors.filter((_, i) => i !== index));
        } else {
            onChangeExecutors(executors.filter((_, i) => i !== index));
        }
    };

    return (
        <div>
            {!showBackupSection && (
                <>
                    <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-4">
                        Choose an Executor/Personal Representative
                    </h2>
                    <p className="text-sm md:text-base text-primary-600 mb-10">
                        Executors are responsible for carrying out the instructions in your will. Add trusted individuals below.
                    </p>
                </>
            )}

            {showBackupSection && (
                <>
                    <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-4">
                        Backup Executor/Personal Representative
                    </h2>
                    <p className="text-sm md:text-base text-primary-600 mb-6">
                        Do you want to name an alternative in case your original executor is unavailable?
                    </p>
                </>
            )}

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-6">
                    {!showBackupSection && (
                        <>
                            {showSpouseQuestion && onToggleSpouseExecutor && (
                                <div className="space-y-4">
                                    <p className="text-sm md:text-base text-primary-600">
                                        Do you want {spouseFirstName || partnerLabel} to administer your estate?
                                    </p>
                                    <div className="flex gap-4">
                                        {['yes', 'no'].map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => onToggleSpouseExecutor(option === 'yes')}
                                                className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all ${(option === 'yes' && spouseIsExecutor) || (option === 'no' && !spouseIsExecutor)
                                                    ? 'border-secondary text-secondary bg-white shadow-[0_2px_6px_rgba(0,0,0,0.04)]'
                                                    : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'
                                                    }`}
                                            >
                                                {option.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {executors.map((executor, index) => {
                                const orderLabels = ['First', 'Second', 'Third', 'Fourth'];
                                const isPrimarySpouseCard = showSpouseQuestion && spouseIsExecutor && index === 0;
                                const cardTitle = isPrimarySpouseCard ? 'Executor Details' : orderLabels[index] ? `${orderLabels[index]} Executor Details` : `Executor ${index + 1} Details`;

                                return (
                                    <div key={executor.id} className="rounded border border-slate-200 bg-white shadow-lg p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-base font-semibold text-primary-700">{cardTitle}</p>
                                            {executors.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeExecutor(index)}
                                                    className="text-rose-500 text-xs font-semibold uppercase tracking-wide hover:text-rose-600"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">Full Name:</label>
                                                <input
                                                    type="text"
                                                    value={`${executor.firstName}${executor.lastName ? ` ${executor.lastName}` : ''}`}
                                                    onChange={(e) => handleFullNameChange(index, e.target.value)}
                                                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                                    placeholder="e.g. William Timothy Smith"
                                                />
                                            </div>
                                            {!isPrimarySpouseCard && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm text-secondary mb-1">City/Town:</label>
                                                        <input
                                                            type="text"
                                                            value={executor.city}
                                                            onChange={(e) => setExecutorFields(index, { city: e.target.value })}
                                                            className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                                            placeholder="e.g. London"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-secondary mb-1">Country:</label>
                                                        <select
                                                            value={executor.country}
                                                            onChange={(e) => setExecutorFields(index, { country: e.target.value })}
                                                            className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 focus:border-secondary focus:outline-none transition-colors cursor-pointer"
                                                        >
                                                            {UK_COUNTRY_OPTIONS.map((country) => (
                                                                <option key={country} value={country}>
                                                                    {country}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            <button
                                type="button"
                                onClick={onAddExecutor}
                                className="w-full py-4 border-2 border-dashed border-secondary/60 rounded-lg text-secondary text-sm font-semibold tracking-wide hover:bg-secondary/5 transition-colors"
                            >
                                + Add another executor
                            </button>

                        </>
                    )}

                    {showBackupSection && (
                        <>
                            <div className="flex gap-4 mb-8">
                                {['yes', 'no'].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => onToggleAlternate(option === 'yes')}
                                        className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all ${(option === 'yes' && wantsAlternateExecutor) || (option === 'no' && !wantsAlternateExecutor)
                                            ? 'border-secondary bg-secondary/5 text-secondary'
                                            : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'
                                            }`}
                                    >
                                        {option.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            <SmoothCollapse isOpen={wantsAlternateExecutor}>
                                {alternateExecutors.map((executor, index) => (
                                    <div key={executor.id} className="rounded border border-slate-200 bg-white shadow-lg p-6 mb-6 last:mb-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-base font-semibold text-primary-700">Alternate Executor {index + 1}</p>
                                            {alternateExecutors.length > 1 && (
                                                <button type="button" onClick={() => removeExecutor(index, true)} className="text-rose-500 text-xs font-semibold uppercase tracking-wide hover:text-rose-600">
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">Name:</label>
                                                <input
                                                    type="text"
                                                    value={`${executor.firstName}${executor.lastName ? ` ${executor.lastName}` : ''}`}
                                                    onChange={(e) => handleFullNameChange(index, e.target.value, true)}
                                                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                                    placeholder="e.g. William Timothy Smith"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">City/Town:</label>
                                                <input
                                                    type="text"
                                                    value={executor.city}
                                                    onChange={(e) => setExecutorFields(index, { city: e.target.value }, true)}
                                                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                                    placeholder="e.g. London"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">Country:</label>
                                                <select
                                                    value={executor.country}
                                                    onChange={(e) => setExecutorFields(index, { country: e.target.value }, true)}
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
                                    onClick={onAddAlternate}
                                    className="text-secondary text-sm font-semibold hover:underline"
                                >
                                    + Add another alternate executor
                                </button>
                            </SmoothCollapse>
                        </>
                    )}
                </div>

                <aside className="rounded border border-slate-200 bg-white shadow-sm p-6 h-fit">
                    <h3 className="text-base font-semibold text-primary-700 mb-4">Frequently Asked Questions</h3>
                    <div className="relative" onMouseLeave={() => setFaqTooltip(null)}>
                        <ul className="space-y-3 text-sm text-primary-600">
                            {FAQ_ITEMS.map((item) => (
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

export default ExecutorsStep;
