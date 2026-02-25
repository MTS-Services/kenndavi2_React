import React from 'react';
import type { Beneficiary } from './will-types';
import { UK_COUNTRY_OPTIONS } from './wizard-constants';

export interface RemainderStepProps {
    beneficiaries: Beneficiary[];
    onAddBeneficiary: (type: 'person' | 'charity') => void;
    onChangeBeneficiaries: (beneficiaries: Beneficiary[]) => void;
}

const RemainderStep: React.FC<RemainderStepProps> = ({
    beneficiaries,
    onAddBeneficiary,
    onChangeBeneficiaries
}) => {
    const updateBeneficiary = (index: number, fields: Partial<Beneficiary>) => {
        const updated = [...beneficiaries];
        updated[index] = { ...updated[index], ...fields };
        onChangeBeneficiaries(updated);
    };

    const removeBeneficiary = (index: number) => {
        onChangeBeneficiaries(beneficiaries.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-8">Remainder of Estate</h2>

            <div className="space-y-6">
                {beneficiaries.map((beneficiary, index) => (
                    <div key={beneficiary.id} className="rounded border border-slate-200 bg-white shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-base font-semibold text-secondary">Recipient Details</p>
                            {beneficiaries.length > 1 && (
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

                            <div className="flex items-center gap-2">
                                <input
                                    id={`alt-share-${beneficiary.id}`}
                                    type="checkbox"
                                    checked={beneficiary.allowAlternate || false}
                                    onChange={(e) => updateBeneficiary(index, { allowAlternate: e.target.checked })}
                                    className="h-4 w-4 border border-slate-300 rounded"
                                />
                                <label htmlFor={`alt-share-${beneficiary.id}`} className="text-sm text-primary-600">List an alternate choice for this share</label>
                            </div>

                            {beneficiary.allowAlternate && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-secondary mb-1">Full Name of Alternate Recipient:</label>
                                        <input
                                            type="text"
                                            value={beneficiary.alternateName || ''}
                                            onChange={(e) => updateBeneficiary(index, { alternateName: e.target.value })}
                                            className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                            placeholder="e.g. Sarah Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-secondary mb-1">City/Town:</label>
                                        <input
                                            type="text"
                                            value={beneficiary.alternateCity || ''}
                                            onChange={(e) => updateBeneficiary(index, { alternateCity: e.target.value })}
                                            className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                            placeholder="e.g. London"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-secondary mb-1">Country:</label>
                                        <select
                                            value={beneficiary.alternateCountry || 'England'}
                                            onChange={(e) => updateBeneficiary(index, { alternateCountry: e.target.value })}
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
                            )}
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
        </div>
    );
};

export default RemainderStep;
