import React from 'react';

import { useReveal } from '@/hooks/use-reveal';

export function LoveOnesSection() {
    const [imageRef, imageVisible] = useReveal<HTMLDivElement>(0.2);
    const [textRef, textVisible] = useReveal<HTMLDivElement>(0.2);

    return (
        <section className="bg-white py-20 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
                    <div
                        ref={imageRef}
                        className={`order-2 md:order-1 ${imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} transition-all duration-700 ease-out`}
                    >
                        <div className="relative group">
                            <img
                                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop"
                                alt="Family gathering"
                                className="h-auto w-full rounded-3xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl"
                            />
                            <div className="absolute -top-4 -left-4 w-20 h-20 bg-pink-200 rounded-full opacity-60 animate-float" />
                            <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-blue-200 rounded-full opacity-50 animate-float" style={{ animationDelay: '0.6s' }} />
                        </div>
                    </div>

                    <div
                        ref={textRef}
                        className={`order-1 space-y-6 md:order-2 ${textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} transition-all duration-700 ease-out`}
                    >
                        <h2 className="font-serif text-4xl font-bold text-primary-900 md:text-5xl">It's for the ones we love</h2>
                        <p className="font-body text-lg leading-relaxed text-primary-700">
                            Planning ahead isn't just about organization—it's an act of love. By documenting your wishes and important information now, you're giving your family the gift of clarity and peace of mind during one of life's most challenging moments.
                        </p>
                        <p className="font-body text-lg leading-relaxed text-primary-700">
                            Our secure platform makes it easy to gather everything in one place, so your loved ones can focus on what matters most: being together and honoring your memory.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
