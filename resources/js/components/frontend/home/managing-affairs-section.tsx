import { Link } from '@inertiajs/react';
import React from 'react';

import { useReveal } from '@/hooks/use-reveal';

type Item = {
    title: string;
    desc: string;
    delay: string;
    icon: React.ReactNode;
    href?: string;
};

const items: Item[] = [
    {
        title: 'Legal Documents',
        desc: 'Store and organize your will, power of attorney, healthcare directives, and other important legal paperwork in one secure place.',
        delay: 'delay-0',
        icon: (
            <svg className="h-8 w-8 text-primary-600 group-hover:text-primary-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        title: 'Probate Services',
        desc: 'Detail your preferences for memorial services, burial or cremation, and share the traditions that matter most to you.',
        delay: 'delay-150',
        href: route('probate'),
        icon: (
            <svg className="h-8 w-8 text-primary-600 group-hover:text-primary-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12a4 4 0 100-8 4 4 0 000 8zm9 8a9 9 0 10-18 0" />
            </svg>
        ),
    },
    {
        title: 'Property & Assets',
        desc: 'Document real estate, vehicles, valuable items, and other possessions with clear information about their location and value.',
        delay: 'delay-300',
        icon: (
            <svg className="h-8 w-8 text-primary-600 group-hover:text-primary-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
];

export function ManagingAffairsSection() {
    const [headerRef, headerVisible] = useReveal<HTMLDivElement>();
    const [gridRef, gridVisible] = useReveal<HTMLDivElement>(0.1);

    return (
        <section id="planning" className="bg-cream py-24 overflow-hidden">
            <div className="container mx-auto px-6">
                <div
                    ref={headerRef}
                    className={`mb-16 space-y-4 text-center transition-all duration-700 ease-out ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <h2 className="font-serif text-5xl font-bold text-primary-900 md:text-6xl text-balance">Managing Your Affairs</h2>
                    <p className="mx-auto max-w-2xl font-body text-xl text-primary-700">Prepare the essential details that will help your loved ones during difficult times</p>
                </div>

                <div ref={gridRef} className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => {
                        const Wrapper = item.href ? Link : 'div';
                        const wrapperProps = item.href ? { href: item.href } : {}; // href only when needed

                        return (
                            <Wrapper
                                key={item.title}
                                {...wrapperProps}
                                className={`group rounded-2xl bg-white p-8 shadow-lg border border-transparent cursor-pointer transition-all duration-500 ease-out ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${item.delay} hover:-translate-y-3 hover:shadow-2xl hover:border-primary-300 hover:scale-105`}
                            >
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 transition-all duration-500 group-hover:bg-primary-50 group-hover:scale-125 group-hover:shadow-lg group-hover:-translate-y-2">
                                    {item.icon}
                                </div>
                                <h3 className="mb-4 font-serif text-2xl font-semibold text-primary-900 transition-colors duration-300 group-hover:text-primary-600">{item.title}</h3>
                                <p className="leading-relaxed text-primary-600 transition-colors duration-300 group-hover:text-primary-700">{item.desc}</p>
                            </Wrapper>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
