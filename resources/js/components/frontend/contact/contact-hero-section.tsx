import React from 'react';

export function ContactHeroSection() {
    return (
        <section className="relative isolate overflow-hidden">
            <img
                src="https://heirkinestateplanning.co.uk/wp-content/uploads/2025/12/contact-bg.png"
                alt="Family"
                className="absolute inset-0 -z-20 h-full w-full object-cover object-right"
                loading="lazy"
            />

            <div className="absolute inset-0 -z-10 bg-primary-800/75" />
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary-900/70 via-primary-800/65 to-transparent" />

            <div className="container mx-auto px-6">
                <div className="flex min-h-90 items-center py-16 md:min-h-105 md:py-20">
                    <div className="max-w-xl space-y-5 animate-fadeInUp">
                        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">Get in Touch</h1>
                        <p className="text-base leading-relaxed text-white/85">
                            Everyone’s situation is different. Contact us to discuss yours, and we’ll guide you through your options.
                        </p>
                        <p className="text-sm text-white/70">
                            Reach out today and book a free consultation to discuss your estate planning needs.
                        </p>
                        <div className="pt-2">
                            <a
                                href="#contact-form"
                                className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
                            >
                                Enquire now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
