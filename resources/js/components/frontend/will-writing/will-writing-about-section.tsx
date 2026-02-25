import React from 'react';

const aboutContent = {
    image: 'https://a.storyblok.com/f/309177/718x1000/f544cb2f60/sam-mum.jpg',
    heading: 'Our job is to bring care to life.',
    paragraphs: [
        'At Horizon Wills, we move thoughtfully, communicate clearly, and obsess over every detail so families can plan in confidence.',
        "We're a team that values kindness, craft, and ownership—building services that genuinely help people prepare for tomorrow.",
    ],
};

export function WillWritingAboutSection() {
    return (
        <section className="bg-linear-to-b from-primary-50 via-white to-white px-4 py-16 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl rounded-[36px] bg-white/70 p-8 shadow-2xl shadow-primary-200/40">
                <div className="grid gap-8 md:grid-cols-2 md:items-center">
                    <div className="relative animate-fadeInUp">
                        <div className="absolute -inset-2 rounded-4xl bg-linear-to-tr from-primary-200/60 via-white to-primary-100/60 blur-2xl" />
                        <img src={aboutContent.image} alt="Advisor with client" className="relative h-80 w-full rounded-[28px] object-cover" loading="lazy" />
                    </div>
                    <div className="space-y-4 animate-fadeInUp delay-100">
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">About</p>
                        <h3 className="text-3xl font-serif font-semibold text-primary-900">{aboutContent.heading}</h3>
                        {aboutContent.paragraphs.map((text) => (
                            <p key={text} className="text-sm text-primary-600">
                                {text}
                            </p>
                        ))}
                        <a href="#perks" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900 hover:text-primary-600">
                            Explore perks & benefits
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14" />
                                <path d="M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
