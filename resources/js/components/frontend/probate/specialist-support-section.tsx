import React from 'react';

import { useScrollAnimation } from '@/hooks/use-scroll-animation';

export function SpecialistSupportSection() {
    const [sectionRef, isVisible] = useScrollAnimation<HTMLDivElement>();
    const animatedBase = 'transition-all duration-700 ease-out';
    const animatedState = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

    return (
        <section ref={sectionRef} className="bg-gradient-to-br from-slate-200 to-slate-300 py-20 px-4 relative overflow-hidden wavy-bottom">
            <div className="absolute right-0 top-0 w-1/3 h-full slate-dots opacity-50"></div>

            <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
                <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 ${animatedBase} ${animatedState}`} style={{ transitionDelay: '0ms' }}>
                    Get specialist probate support
                </h2>
                <p className={`text-lg text-gray-800 max-w-3xl mx-auto ${animatedBase} ${animatedState}`} style={{ transitionDelay: '150ms' }}>
                    Whether you&apos;re applying for probate or need support to handle the estate of someone who&apos;s died, our
                    specialists and legal partners are here to help.
                </p>

                {/* Two Cards */}
                <div className={`grid md:grid-cols-2 gap-8 ${animatedBase} ${animatedState}`} style={{ transitionDelay: '250ms' }}>
                    {/* Grant of Probate Card */}
                    <div className="bg-white rounded-2xl p-8 text-left shadow-lg card-hover">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Grant of probate application</h3>

                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-2">From:</p>
                            <p className="text-4xl font-bold text-gray-900">£895</p>
                            <p className="text-sm text-gray-600">Fixed fee pricing</p>
                        </div>

                        <p className="text-gray-700 mb-6">
                            Great if you&apos;ve got the confidence and time to deal with the rest of the process.
                        </p>

                        <div className="bg-slate-50 border-l-4 border-slate-400 p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <span className="text-primary-500 text-xl">✓</span>
                                <div>
                                    <p className="font-semibold text-gray-900">Submit the grant of probate application</p>
                                    <p className="text-sm text-gray-600 mt-1">You will need to: Identify relevant paperwork
                                        about assets and debts; gather documentation and values for each asset and debt;
                                        liaise with banks and administrators. Once accounts manage property, fee taxes
                                        and more.</p>
                                    <p className="text-sm text-gray-600 mt-2"><strong>Extra costs:</strong> There&apos;s a
                                        possible registry fee of £300, and copies of the grant of probate cost £16 each.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Complete Probate Card */}
                    <div className="bg-white rounded-2xl p-8 text-left shadow-lg card-hover">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our complete probate service</h3>

                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-2">From:</p>
                            <p className="text-4xl font-bold text-gray-900">£2,750</p>
                            <p className="text-sm text-gray-600">Fixed fee pricing</p>
                        </div>

                        <p className="text-gray-700 mb-6">
                            Great for a complicated estate, seeking complete or if an impartial specialist could help
                            ease family conflicts.
                        </p>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3">
                                <span className="text-primary-500 text-xl">✓</span>
                                <p className="text-gray-700">Assess and value the estate</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-primary-500 text-xl">✓</span>
                                <p className="text-gray-700">Submit the grant of probate application</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-primary-500 text-xl">✓</span>
                                <p className="text-gray-700">Settle accounts, manage property, pay taxes</p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600">
                            <strong>Extra costs:</strong> There&apos;s a probate registry fee of £300, and copies of the
                            grant of probate cost £16 each. Other services may incur fees.
                        </p>
                    </div>
                </div>

                <div className={`rounded-xl p-6 max-w-xl mx-auto ${animatedBase} ${animatedState}`} style={{ transitionDelay: '400ms' }}>
                    <h4 className="font-bold text-gray-900 mb-3">Get your free quote online</h4>
                    <button className="bg-slate-500 border-2 text-primary-50 border-slate-400 px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
                        Get a quote in 5 minutes
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
