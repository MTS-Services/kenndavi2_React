import { Link } from '@inertiajs/react';
import React from 'react';

const willSteps = [
    {
        title: 'Answer a few simple questions.',
        description: 'No doctor visits or tests—just eligibility questions so we can tailor guidance to you.',
    },
    {
        title: 'Choose a policy that works for you.',
        description: "Mix and match cover levels, add LPAs, or include mirror wills so the plan fits life's changes.",
    },
    {
        title: "Kick back and relax. You're covered.",
        description: 'We keep your docs updated and share them securely with attorneys and loved ones.',
    },
];

export function LpaPlanningSection() {
    return (
        <section className="bg-white py-16" id="planning">
            <div className="container mx-auto grid gap-10 px-6 lg:grid-cols-2">
                <div className="space-y-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.45em] text-primary-500 animate-fadeInUp">Guided journey</p>
                    <h2 className="text-4xl font-semibold text-primary-900 animate-fadeInUp" style={{ animationDelay: '50ms' }}>
                        Write your will or LPA in three simple steps.
                    </h2>
                    <p className="text-base text-primary-600 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                        Digital forms plus human experts mean you always know what comes next.
                    </p>
                    <Link
                        href={route('contact')}
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 animate-fadeInUp"
                        style={{ animationDelay: '150ms' }}
                    >
                        Get a quote
                        <span aria-hidden>→</span>
                    </Link>
                </div>
                <div className="space-y-10">
                    {willSteps.map((step, index) => (
                        <div key={step.title} className="flex gap-6 animate-fadeInRight" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="flex flex-col items-center">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-200 font-semibold text-primary-900">{index + 1}</span>
                                {index < willSteps.length - 1 && <span className="mt-3 h-16 w-px bg-primary-200" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-primary-900">{step.title}</h3>
                                <p className="mt-2 text-sm text-primary-600">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
