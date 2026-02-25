import React from 'react';

export function LpaPricingSection() {
    return (
        <section className="bg-linear-to-b from-primary-50 via-white to-white px-6 py-24 text-center">
            <div className="mx-auto max-w-3xl space-y-6">
                <h2 className="text-4xl font-semibold text-primary-900 animate-fadeInUp">Creating your LPA shouldn’t be complicated.</h2>
                <p className="text-lg text-primary-600 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                    Work with our legal specialists online, over the phone, or at home. We draft, check, and send your forms ready for signing.
                </p>
                <div className="rounded-3xl border border-white/70 bg-white/90 p-10 shadow-xl animate-fadeInUp" style={{ animationDelay: '150ms' }}>
                    <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-500">Full service</span>
                    <p className="mt-4 text-2xl font-semibold text-primary-900">£699 all-in for LPAs with specialist review.</p>
                    <p className="mt-2 text-sm text-primary-600">Includes guided consults, document prep, and posting instructions for the OPG.</p>
                </div>
            </div>
        </section>
    );
}
