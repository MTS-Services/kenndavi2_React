import React from 'react';
import type { Pet } from './will-types';

export interface PetsStepProps {
    hasPets: boolean;
    pets: Pet[];
    onToggle: (value: boolean) => void;
    onAddPet: () => void;
    onChangePets: (pets: Pet[]) => void;
}

const PetsStep: React.FC<PetsStepProps> = ({
    hasPets,
    pets,
    onToggle,
    onAddPet,
    onChangePets
}) => {
    const updatePet = (index: number, fields: Partial<Pet>) => {
        const updated = [...pets];
        updated[index] = { ...updated[index], ...fields };
        onChangePets(updated);
    };

    const removePet = (index: number) => {
        onChangePets(pets.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-primary-900 mb-4">Pets</h2>
            <p className="text-sm md:text-base text-secondary mb-8">Do you have any pets?</p>

            <div className="flex gap-4 mb-8">
                <button
                    type="button"
                    onClick={() => onToggle(true)}
                    className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${hasPets ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                >
                    YES
                </button>
                <button
                    type="button"
                    onClick={() => onToggle(false)}
                    className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${!hasPets ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                >
                    NO
                </button>
            </div>

            {hasPets && (
                <div className="space-y-6">
                    {pets.map((pet, index) => (
                        <div key={pet.id} className="rounded border border-slate-200 bg-white shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-base font-semibold text-secondary">Pet Details</p>
                                {pets.length > 1 && (
                                    <button type="button" onClick={() => removePet(index)} className="text-rose-500 text-xs font-semibold uppercase tracking-wide hover:text-rose-600">
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm text-secondary mb-1">Pet Name:</label>
                                    <input
                                        type="text"
                                        value={pet.name}
                                        onChange={(e) => updatePet(index, { name: e.target.value })}
                                        className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                        placeholder="e.g. Lassie"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-secondary mb-1">Pet Description:</label>
                                    <input
                                        type="text"
                                        value={pet.description}
                                        onChange={(e) => updatePet(index, { description: e.target.value })}
                                        className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                        placeholder="e.g. Female German Shepherd"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-secondary mb-1">
                                        <span className="text-secondary font-medium">£</span> Pet Fund Amount:
                                    </label>
                                    <input
                                        type="text"
                                        value={pet.fundAmount}
                                        onChange={(e) => updatePet(index, { fundAmount: e.target.value })}
                                        className="w-full border-b border-slate-300 bg-transparent py-2 text-base text-primary-800 placeholder-primary-400/70 focus:border-secondary focus:outline-none transition-colors"
                                        placeholder="e.g. 500"
                                    />
                                </div>

                                <div>
                                    <p className="text-sm md:text-base text-primary-600 mb-3">Let your executor appoint a pet caretaker?</p>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => updatePet(index, { executorAppointCaretaker: true })}
                                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${pet.executorAppointCaretaker ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
                                        >
                                            YES
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updatePet(index, { executorAppointCaretaker: false })}
                                            className={`px-8 py-2.5 rounded border-2 text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer ${!pet.executorAppointCaretaker ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 bg-white text-primary-600 hover:border-slate-300'}`}
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
                        onClick={onAddPet}
                        className="text-secondary text-sm font-semibold hover:underline"
                    >
                        + Add another pet
                    </button>
                </div>
            )}
        </div>
    );
};

export default PetsStep;
