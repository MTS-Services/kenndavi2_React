import React from 'react';
import type { PersonalInfo } from './will-types';
import { UK_COUNTRY_OPTIONS } from './wizard-constants';

interface GetStartedStepProps {
    personalInfo: PersonalInfo;
    onChange: (field: keyof PersonalInfo, value: string) => void;
}

const GetStartedStep: React.FC<GetStartedStepProps> = ({ personalInfo, onChange }) => (
    <div>
        <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-8">
            Your Details
        </h2>
        <p className="text-sm md:text-base lg:text-lg text-primary-800 mb-8">
            Who is this Last Will being created for?
        </p>

        <div className="space-y-6 max-w-md">
            <div>
                <label className="block text-sm md:text-base text-secondary mb-1">Full Name:</label>
                <input
                    type="text"
                    value={`${personalInfo.firstName}${personalInfo.middleName ? ' ' + personalInfo.middleName : ''}${personalInfo.lastName ? ' ' + personalInfo.lastName : ''}`}
                    onChange={(e) => {
                        const parts = e.target.value.split(' ');
                        onChange('firstName', parts[0] || '');
                        onChange('middleName', parts.length > 2 ? parts.slice(1, -1).join(' ') : '');
                        onChange('lastName', parts.length > 1 ? parts[parts.length - 1] : '');
                    }}
                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                    placeholder="e.g. William Timothy Smith"
                />
            </div>

            <div>
                <label className="block text-sm md:text-base text-secondary mb-1">City/Town:</label>
                <input
                    type="text"
                    value={personalInfo.city}
                    onChange={(e) => onChange('city', e.target.value)}
                    className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                    placeholder="e.g. London"
                />
            </div>

            <div>
                <label className="block text-sm md:text-base text-secondary mb-1">Country:</label>
                <select
                    value={personalInfo.country}
                    onChange={(e) => onChange('country', e.target.value)}
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
);

export default GetStartedStep;
