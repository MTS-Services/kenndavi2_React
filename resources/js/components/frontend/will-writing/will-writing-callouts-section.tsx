import React from 'react';

const callouts = [
    { img: 'https://a.storyblok.com/f/309177/x/3434441de2/penpaper.avif', text: 'Our basic and bespoke will services' },
    { img: 'https://a.storyblok.com/f/309177/x/af41af3514/arrowtarget.avif', text: 'Getting a fast-tracked will' },
    { img: 'https://a.storyblok.com/f/309177/x/5afd42ca1b/twopages.avif', text: 'Writing a mirror will' },
    { img: 'https://a.storyblok.com/f/309177/x/7330913b9e/closedsafe.avif', text: 'Our will storage and update service' },
];

export function WillWritingCalloutsSection() {
    return (
        <section className="bg-primary-100 px-4 py-16 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-6xl text-center">
                <h3 className="text-2xl font-serif font-semibold text-primary-900">
                    Call us now on{' '}
                    <a href="tel:02045253605" className="font-bold text-primary-600">
                        020 4525 3605
                    </a>{' '}
                    to learn more about
                </h3>
                <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {callouts.map((item, index) => (
                        <div
                            key={item.text}
                            className="flex flex-col items-center gap-6 text-center animate-fadeInUp rounded-3xl bg-white/60 p-6 shadow transition hover:-translate-y-1 hover:bg-white"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <img src={item.img} alt="Callout" className="h-24 w-24 object-contain" loading="lazy" />
                            <p className="text-base text-primary-700">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
