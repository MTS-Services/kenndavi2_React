import React from 'react';

export function LpaTeamSection() {
    return (
        <section className="bg-linear-to-b from-primary-100 via-primary-50 to-white py-16">
            <div className="container mx-auto grid gap-10 px-6 lg:grid-cols-2">
                <div className="relative animate-fadeInLeft">
                    <div className="absolute -inset-2 rounded-[40px] bg-linear-to-tr from-primary-200/50 via-white to-primary-50/80 blur-2xl" />
                    <img src="https://a.storyblok.com/f/309177/718x1000/f544cb2f60/sam-mum.jpg" alt="Team moment" className="relative rounded-[28px] object-cover" />
                </div>
                <div className="animate-fadeInRight">
                    <h2 className="font-display text-3xl text-primary-900">Our job is to bring care to life.</h2>
                    <p className="mt-4 text-sm text-primary-600">
                        Sensitive conversations deserve thoughtful people. We obsess over clarity, detail, and making sure your loved ones know exactly what you want.
                    </p>
                    <p className="mt-3 text-sm text-primary-600">
                        Join a team that values kindness, craft, and ownership. We’re hiring across planning, design, and engineering.
                    </p>
                    <a href="#perks" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-900">
                        Explore perks & benefits
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h9.69l-3.22-3.22a.75.75 0 111.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
