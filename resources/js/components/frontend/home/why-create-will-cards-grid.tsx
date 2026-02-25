import React from 'react';

import { PoundSterling } from 'lucide-react';

import { useReveal } from '@/hooks/use-reveal';

type WhyCard = {
    title: string;
    desc: string;
    gradient: string;
    border: string;
    titleColor: string;
    checkColor: string;
    iconColor: string;
    delay: string;
    icon: React.ReactNode;
};

const cards: WhyCard[] = [
    {
        title: 'Avoid Family Fights',
        desc: 'Prevent disputes and conflicts by clearly stating your wishes',
        gradient: 'from-pink-50 to-pink-100',
        border: 'border-pink-300',
        titleColor: 'text-pink-900',
        checkColor: 'text-pink-600',
        iconColor: 'text-pink-500',
        delay: 'delay-0',
        icon: (
            <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                <path d="M13 7a1 1 0 11-2 0 1 1 0 012 0zM9 7a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
        ),
    },
    {
        title: 'Appoint Guardians',
        desc: 'Choose who will care for your minor children',
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-300',
        titleColor: 'text-blue-900',
        checkColor: 'text-blue-600',
        iconColor: 'text-blue-500',
        delay: 'delay-150',
        icon: (
            <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
        ),
    },
    {
        title: 'Distribute Wealth',
        desc: 'Ensure your assets go exactly where you want them to',
        gradient: 'from-yellow-50 to-yellow-100',
        border: 'border-yellow-300',
        titleColor: 'text-yellow-900',
        checkColor: 'text-yellow-700',
        iconColor: 'text-yellow-500',
        delay: 'delay-300',
        icon: <PoundSterling className="h-14 w-14" strokeWidth={1.5} aria-hidden="true" />,
    },
    {
        title: 'Care For Seniors',
        desc: 'Provide for elderly family members with specific provisions',
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-300',
        titleColor: 'text-green-900',
        checkColor: 'text-green-700',
        iconColor: 'text-green-500',
        delay: 'delay-500',
        icon: (
            <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                <path d="M13 7h2a1 1 0 011 1v1a1 1 0 11-2 0V8h-1a1 1 0 110-2h1V7z" />
            </svg>
        ),
    },
];

export function WhyCreateWillCardsGrid() {
    const [gridRef, gridVisible] = useReveal<HTMLDivElement>(0.1);

    return (
        <section className="pb-20 pt-8 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div ref={gridRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className={`group bg-linear-to-br ${card.gradient} border-4 ${card.border} rounded-3xl p-8 text-center shadow-lg cursor-pointer ${card.delay} transition-all duration-700 ease-out ${gridVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'} hover:-translate-y-3 hover:shadow-2xl hover:scale-105`}
                        >
                            <div className="w-24 h-24 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 group-hover:shadow-xl group-hover:-translate-y-2">
                                <span className={`${card.iconColor} transition-all duration-300 group-hover:scale-110 group-hover:animate-float`}>{card.icon}</span>
                            </div>

                            <div className="flex items-center justify-center gap-2 mb-3">
                                <svg
                                    className={`w-6 h-6 ${card.checkColor} transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                >
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <h3 className={`text-2xl font-sans font-bold ${card.titleColor}`}>{card.title}</h3>
                            </div>

                            <p className="text-primary-700 leading-relaxed transition-colors duration-300 group-hover:text-primary-900">{card.desc}</p>
                        </div>
                    ))}
                </div>
                
            </div>
        </section>
    );
}
