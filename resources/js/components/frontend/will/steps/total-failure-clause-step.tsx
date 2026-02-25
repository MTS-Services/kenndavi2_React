import React from 'react';
import type { Beneficiary } from './will-types';
import { UK_COUNTRY_OPTIONS } from './wizard-constants';

export interface TotalFailureClauseStepProps {
    totalFailureStrategy: 'family' | 'alternate';
    totalFailureBeneficiaries: Beneficiary[];
    onChangeStrategy: (value: 'family' | 'alternate') => void;
    onAddBeneficiary: (type: 'person' | 'charity') => void;
    onChangeBeneficiaries: (beneficiaries: Beneficiary[]) => void;
}

const TotalFailureClauseStep: React.FC<TotalFailureClauseStepProps> = ({
    totalFailureStrategy,
    totalFailureBeneficiaries,
    onChangeStrategy,
    onAddBeneficiary,
    onChangeBeneficiaries
}) => {
    const updateBeneficiary = (index: number, fields: Partial<Beneficiary>) => {
        const updated = [...totalFailureBeneficiaries];
        updated[index] = { ...updated[index], ...fields };
        onChangeBeneficiaries(updated);
    };

    const removeBeneficiary = (index: number) => {
        onChangeBeneficiaries(totalFailureBeneficiaries.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-4">Total Failure Clause</h2>
            <p className="text-sm md:text-base text-secondary mb-8">
                How do you want your estate to be divided if the charity/organisation beneficiary no longer exists after you pass away?
            </p>

            <div className="space-y-4 mb-8">
                {(['family', 'alternate'] as const).map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChangeStrategy(option)}
                        className={`block w-full max-w-lg text-left px-6 py-3 rounded border-2 text-sm font-medium transition-all cursor-pointer ${totalFailureStrategy === option
                            ? 'border-secondary bg-secondary/5 text-secondary'
                            : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                    >
                        {option === 'family'
                            ? 'Equally divided among my parents/siblings'
                            : 'Divided among alternate beneficiaries that I choose'}
                    </button>
                ))}
            </div>

            {totalFailureStrategy === 'alternate' && (
                <div className="space-y-6">
                    {totalFailureBeneficiaries.map((beneficiary, index) => (
                        <div key={beneficiary.id} className="rounded border border-slate-200 bg-white shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-base font-semibold text-primary-800">Wipeout Beneficiary</p>
                                {totalFailureBeneficiaries.length > 1 && (
                                    <button type="button" onClick={() => removeBeneficiary(index)} className="text-rose-500 text-xs font-semibold uppercase tracking-wide hover:text-rose-600">
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="space-y-5">
                                <div className="flex gap-3">
                                    {(['person', 'charity'] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => updateBeneficiary(index, { type })}
                                            className={`flex-1 px-4 py-2 border-2 text-sm font-semibold uppercase tracking-wide transition-all ${beneficiary.type === type
                                                ? 'border-secondary text-secondary bg-secondary/5'
                                                : 'border-slate-200 text-primary-600 bg-white hover:border-slate-300'}`}
                                        >
                                            {type === 'person' ? 'Individual' : 'Charity or organisation'}
                                        </button>
                                    ))}
                                </div>

                                {beneficiary.type === 'person' ? (
                                    <div>
                                        <label className="block text-sm text-secondary mb-1">Full Name of Recipient:</label>
                                        <input
                                            type="text"
                                            value={`${beneficiary.firstName || ''}${beneficiary.lastName ? ' ' + beneficiary.lastName : ''}`}
                                            onChange={(e) => {
                                                const parts = e.target.value.split(' ');
                                                updateBeneficiary(index, {
                                                    firstName: parts.shift() || '',
                                                    lastName: parts.join(' ')
                                                });
                                            }}
                                            className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                            placeholder="e.g. William Timothy Smith"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm text-secondary mb-1">Charity/Organisation Name:</label>
                                            <input
                                                type="text"
                                                value={beneficiary.charityName || ''}
                                                onChange={(e) => updateBeneficiary(index, { charityName: e.target.value })}
                                                className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                                placeholder="e.g. Local Animal Shelter"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-secondary mb-1">Registered Charity Number:</label>
                                            <input
                                                type="text"
                                                value={beneficiary.charityNumber || ''}
                                                onChange={(e) => updateBeneficiary(index, { charityNumber: e.target.value })}
                                                className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                                placeholder="e.g. 1089464"
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-sm text-secondary mb-1">City/Town:</label>
                                    <input
                                        type="text"
                                        value={beneficiary.city || ''}
                                        onChange={(e) => updateBeneficiary(index, { city: e.target.value })}
                                        className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                        placeholder="e.g. London"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-secondary mb-1">Country:</label>
                                    <select
                                        value={beneficiary.country || 'England'}
                                        onChange={(e) => updateBeneficiary(index, { country: e.target.value })}
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
                        onClick={() => onAddBeneficiary('person')}
                        className="text-secondary text-sm font-semibold hover:underline"
                    >
                        + Add another recipient
                    </button>
                </div>
            )}
        </div>
    );
};

export default TotalFailureClauseStep;
