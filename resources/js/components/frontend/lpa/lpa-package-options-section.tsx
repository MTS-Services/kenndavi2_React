import { Plus } from 'lucide-react';
import { type ReactElement } from 'react';

const packages = [
    {
        title: 'Health & Welfare LPA',
        subtitle: 'Medical treatment, care and daily life decisions',
        lines: [
            'Appoint trusted attorneys for health and care choices',
            'Cover decisions about treatment, living arrangements and routines'
        ],
        price: '£49.99',
        accent: 'bg-gradient-to-br from-rose-100 via-rose-200 to-rose-300'
    },
    {
        title: 'Property & Finance LPA',
        subtitle: 'Money management, property and investments',
        lines: [
            'Give attorneys authority for banking, bills and assets',
            'Ensure property sales and investments can continue smoothly'
        ],
        price: '£79.99',
        accent: 'bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300'
    }
];

export function LpaPackageOptionsSection(): ReactElement {
    return (
        <section className="bg-[#f5f7f2] py-16">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">Pricing</p>
                    <h2 className="mt-3 text-3xl font-semibold text-primary-900">Choose the LPA plan that fits you best</h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {packages.map((pkg) => (
                        <div key={pkg.title} className="flex h-full flex-col rounded-[28px] bg-white p-6 shadow-[0_30px_70px_rgba(15,23,42,0.07)]">
                            <div className={`mb-6 h-44 rounded-3xl ${pkg.accent}`} aria-hidden="true" />

                            <div className="space-y-2">
                                <p className="text-2xl font-semibold text-primary-900">{pkg.title}</p>
                                <p className="text-sm font-medium text-primary-500">{pkg.subtitle}</p>
                                <div className="space-y-1 text-sm text-primary-600">
                                    {pkg.lines.map((line) => (
                                        <p key={line}>{line}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 flex items-baseline gap-2">
                                <p className="text-4xl font-bold text-emerald-600">{pkg.price}</p>
                                <p className="text-sm font-semibold text-emerald-500">+ VAT</p>
                            </div>

                            <button
                                type="button"
                                className="mt-auto inline-flex items-center gap-2 rounded-full  px-5 py-2 text-sm font-semibold text-primary-900 transition   hover:scale-105"
                            >
                                Get Started
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white transition group-hover:bg-white group-hover:text-primary-900">
                                    <Plus className="h-3.5 w-3.5" />
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
