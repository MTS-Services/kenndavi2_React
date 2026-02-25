import React from 'react';

interface SpouseStepProps {
    spouseName: string;
    onChange: (value: string) => void;
    partnerType?: 'spouse' | 'civil-partner';
}

const labels = {
    spouse: {
        heading: 'Your Spouse',
        question: "What is your spouse's name?"
    },
    'civil-partner': {
        heading: 'Your Civil Partner',
        question: "What is your civil partner's name?"
    }
};

const SpouseStep: React.FC<SpouseStepProps> = ({ spouseName, onChange, partnerType = 'spouse' }) => {
    const copy = labels[partnerType];
    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-2">{copy.heading}</h2>
                <p className="text-sm md:text-base text-primary-600">{copy.question}</p>
            </div>

            <div>
                <label className="block text-sm text-secondary mb-1">Full Name:</label>
                <input
                    type="text"
                    value={spouseName}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                    placeholder="e.g. Alex Taylor"
                />
            </div>
        </div>
    );
};

export default SpouseStep;
