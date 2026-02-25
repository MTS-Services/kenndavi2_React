import React from 'react';

import { Link } from '@inertiajs/react';
import { PoundSterling } from 'lucide-react';

import { WhyCreateWillHeroSection } from './why-create-will-hero-section';
import { WhyCreateWillCardsGrid } from './why-create-will-cards-grid';
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
        icon: (
            <PoundSterling className="h-14 w-14" strokeWidth={1.5} aria-hidden="true" />
        ),
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

export function WhyCreateWillSection() {
    const [headerRef, headerVisible] = useReveal<HTMLDivElement>();
    const [videoRef, videoVisible] = useReveal<HTMLDivElement>(0.1);
    const [gridRef, gridVisible] = useReveal<HTMLDivElement>(0.1);

    return (
        <section className="pt-24 pb-6 sm:pb-12 md:pb-16 lg:pb-20 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <WhyCreateWillHeroSection
                    headerRef={headerRef}
                    headerVisible={headerVisible}
                    videoRef={videoRef}
                    videoVisible={videoVisible}
                />
                <div className="mt-8 flex justify-center ">
                    <Link
                        href={route('will-writing.start')}
                        className="inline-flex items-center justify-center rounded-full border border-primary-600 bg-primary-600 px-10 py-4 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-transparent focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 hover:text-primary-600"
                    >
                        Create Your Will Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
