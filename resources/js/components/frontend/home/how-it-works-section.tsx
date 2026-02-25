import React from 'react';

import { Link } from '@inertiajs/react';
import { useReveal } from '@/hooks/use-reveal';

const steps = [
    {
        number: '1',
        gradient: 'from-green-400 to-green-600',
        accent: 'bg-yellow-400',
        accentBottom: 'bg-green-300',
        title: 'Answer Questions',
        description:
            "While there is more than one way to make a will online, you can generally expect to answer questions about your circumstances such as whether you're single or married, and where your assets are located from your mobile phone or comfort of your computer chair.",
        delay: 'delay-0',
    },
    {
        number: '2',
        gradient: 'from-yellow-400 to-yellow-600',
        accent: 'bg-orange-400',
        accentBottom: 'bg-yellow-300',
        title: 'Expert Review',
        description:
            'Following this, a team of experts will typically examine your application, recommend any changes and do a final review to ensure everything is legally compliant and meets your specific needs.',
        delay: 'delay-200',
    },
    {
        number: '3',
        gradient: 'from-orange-400 to-orange-600',
        accent: 'bg-red-400',
        accentBottom: 'bg-orange-300',
        title: 'Sign & Witness',
        description:
            "Once approved, you'll still need to print and sign your legally-binding document in the presence of two witnesses to make it valid and enforceable under law.",
        delay: 'delay-500',
    },
];

export function HowItWorksSection() {
    const [headerRef, headerVisible] = useReveal<HTMLDivElement>();
    const [stepsRef, stepsVisible] = useReveal<HTMLDivElement>(0.1);

    return (
        <section className="bg-cream py-24 overflow-hidden">
            <div className="container mx-auto px-6">
                <div
                    ref={headerRef}
                    className={`mb-16 space-y-4 text-center transition-all duration-700 ease-out ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <h2 className="font-serif text-5xl font-bold text-primary-900 md:text-6xl text-balance">Quick Guide to Will Writing Online</h2>
                    <p className="mx-auto max-w-3xl font-body text-xl text-primary-700">Create your legally-binding will in three simple steps</p>
                </div>

                <div ref={stepsRef} className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className={`group space-y-6 text-center transition-all duration-700 ease-out ${step.delay} ${stepsVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-14 scale-95'
                                }`}
                        >
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <div
                                        className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br ${step.gradient} shadow-2xl transition-all duration-500 ease-out group-hover:scale-125 group-hover:shadow-3xl group-hover:-translate-y-3 group-hover:rotate-6`}
                                    >
                                        <span
                                            className="text-7xl font-black text-white transition-all duration-500 group-hover:scale-110 group-hover:animate-float"
                                            style={{ fontFamily: 'Arial Black, sans-serif', textShadow: '3px 3px 0px rgba(0,0,0,0.2)' }}
                                        >
                                            {step.number}
                                        </span>
                                    </div>
                                    <div className={`absolute -top-2 -right-2 h-12 w-12 rounded-full ${step.accent} transition-all duration-500 group-hover:scale-150 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:animate-pulse`} />
                                    <div
                                        className={`absolute -bottom-2 -left-2 h-8 w-8 rounded-full ${step.accentBottom} transition-all duration-500 group-hover:scale-150 group-hover:translate-y-2 group-hover:-translate-x-2 group-hover:animate-pulse`}
                                        style={{ animationDelay: '0.3s' }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-serif text-2xl font-bold text-primary-900 transition-colors duration-300 group-hover:text-primary-600">{step.title}</h3>
                                <p className="font-body text-primary-700 leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-10 flex justify-center">
                    <Link
                        href={route('will-writing.start')}
                        className="inline-flex items-center justify-center rounded-full border border-primary-600 bg-primary-600 px-10 py-4 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-transparent hover:text-primary-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                    >
                        Create Your Will Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
