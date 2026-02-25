import React, { useState } from 'react';
import type { SpecificGift } from './will-types';
import { UK_COUNTRY_OPTIONS } from './wizard-constants';
import SmoothCollapse from './smooth-collapse';

const GIFT_FAQ = [
    { question: 'Is there anything I cannot give away?', answer: 'Certain jointly owned assets or property held in trust may have restrictions. If in doubt, list the item but speak to a solicitor.' },
    { question: 'Should I add sentimental items?', answer: 'Yes. Listing keepsakes ensures they reach the right person and avoids confusion later.' }
];

export interface GiftsStepProps {
    wantsGifts: boolean;
    gifts: SpecificGift[];
    onToggle: (value: boolean) => void;
    onAddGift: () => void;
    onChangeGifts: (gifts: SpecificGift[]) => void;
}

const GiftsStep: React.FC<GiftsStepProps> = ({ wantsGifts, gifts, onToggle, onAddGift, onChangeGifts }) => {
    const [faqTooltip, setFaqTooltip] = useState<{ text: string; top: number } | null>(null);

    const updateGift = (index: number, fields: Partial<SpecificGift>) => {
        const updated = [...gifts];
        updated[index] = { ...updated[index], ...fields };
        onChangeGifts(updated);
    };

    const removeGift = (index: number) => {
        onChangeGifts(gifts.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-4">Gifts</h2>
            <p className="text-sm md:text-base text-secondary mb-8">Do you want to leave any specific gifts in your will?</p>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => onToggle(true)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${wantsGifts ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                        >
                            YES
                        </button>
                        <button
                            type="button"
                            onClick={() => onToggle(false)}
                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${!wantsGifts ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                        >
                            NO
                        </button>
                    </div>

                    <SmoothCollapse isOpen={wantsGifts}>
                        {gifts.map((gift, index) => (
                            <div key={gift.id} className="rounded border border-slate-200 bg-white shadow-lg p-6 mb-6 last:mb-0">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-base font-semibold text-secondary">{index === 0 ? 'First Gift' : `Gift ${index + 1}`}</p>
                                    {gifts.length > 1 && (
                                        <button type="button" onClick={() => removeGift(index)} className="text-rose-500 text-xs font-semibold uppercase tracking-wide hover:text-rose-600">
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-5">
                                    <div className="flex gap-3">
                                        {(['individual', 'charity'] as const).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => updateGift(index, { giftType: type })}
                                                className={`flex-1 px-4 py-2 border-2 text-sm font-semibold uppercase tracking-wide transition-all ${gift.giftType === type
                                                    ? 'border-secondary text-secondary bg-secondary/5'
                                                    : 'border-slate-200 text-primary-600 bg-white hover:border-slate-300'}`}
                                            >
                                                {type === 'individual' ? 'Individual' : 'Charity or organisation'}
                                            </button>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-secondary mb-1">Gift Description:</label>
                                        <input
                                            type="text"
                                            value={gift.description}
                                            onChange={(e) => updateGift(index, { description: e.target.value })}
                                            className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                            placeholder="e.g. My set of golf clubs"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-secondary mb-1">Full Name of Recipient:</label>
                                        <input
                                            type="text"
                                            value={gift.recipientName}
                                            onChange={(e) => updateGift(index, { recipientName: e.target.value })}
                                            className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                            placeholder="e.g. William Timothy Smith"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-secondary mb-1">City/Town:</label>
                                            <input
                                                type="text"
                                                value={gift.city}
                                                onChange={(e) => updateGift(index, { city: e.target.value })}
                                                className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                                placeholder="e.g. London"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-secondary mb-1">Country:</label>
                                            <select
                                                value={gift.country}
                                                onChange={(e) => updateGift(index, { country: e.target.value })}
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

                                    <div className="flex items-center gap-2">
                                        <input
                                            id={`alternate-${gift.id}`}
                                            type="checkbox"
                                            checked={gift.allowAlternate}
                                            onChange={(e) => updateGift(index, { allowAlternate: e.target.checked })}
                                            className="h-4 w-4 border border-slate-300 rounded"
                                        />
                                        <label htmlFor={`alternate-${gift.id}`} className="text-sm text-primary-600">
                                            List an alternate choice for this gift
                                        </label>
                                    </div>

                                    {gift.allowAlternate && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-secondary mb-1">Full Name of Alternate Recipient:</label>
                                                <input
                                                    type="text"
                                                    value={gift.alternateRecipientName}
                                                    onChange={(e) => updateGift(index, { alternateRecipientName: e.target.value })}
                                                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                                    placeholder="e.g. Sarah Doe"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-secondary mb-1">City/Town:</label>
                                                    <input
                                                        type="text"
                                                        value={gift.alternateCity}
                                                        onChange={(e) => updateGift(index, { alternateCity: e.target.value })}
                                                        className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                                        placeholder="e.g. London"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-secondary mb-1">Country:</label>
                                                    <select
                                                        value={gift.alternateCountry}
                                                        onChange={(e) => updateGift(index, { alternateCountry: e.target.value })}
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
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={onAddGift}
                            className="text-secondary text-sm font-semibold hover:underline"
                        >
                            + Add another gift
                        </button>
                    </SmoothCollapse>
                </div>

                <aside className="rounded border border-slate-200 bg-white shadow-sm p-6 h-fit">
                    <h3 className="text-base font-semibold text-primary-700 mb-4">Frequently Asked Questions</h3>
                    <div className="relative" onMouseLeave={() => setFaqTooltip(null)}>
                        <ul className="space-y-3 text-sm text-primary-600">
                            {GIFT_FAQ.map((item) => (
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

export default GiftsStep;
