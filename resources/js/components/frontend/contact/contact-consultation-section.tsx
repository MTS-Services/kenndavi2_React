import React from 'react';

const contactDetails = [
    {
        label: 'Email',
        value: 'support@heirkinestate.com',
        helper: 'We respond within 24 hours',
        icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 5h16v14H4z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        label: 'Visit',
        value: '120 Bishopsgate, London EC2N',
        helper: 'By appointment only',
        icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 22s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="11" r="3" />
            </svg>
        ),
    },
];

export function ContactConsultationSection() {
    return (
        <section id="contact-form" className="container mx-auto px-6 py-18 md:py-14 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                <div className="space-y-4 animate-fadeInUp">
                    <h2 className="text-3xl font-semibold text-primary-600">
                        Understand your
                        <br /> options with a free
                        <br /> consultation
                    </h2>
                    <p className="max-w-xl text-sm leading-relaxed text-primary-600">
                        We’ll talk through your situation and explain the best next steps. Whether you need a simple Will or help with a more complex estate, we’ll make the process clear and comfortable.
                    </p>
                    <p className="font-semibold text-primary-800">Contact Details</p>
                    <div className="space-y-3">
                        {contactDetails.map((detail) => (
                            <div key={detail.label} className="flex items-start gap-3 text-sm text-primary-700">
                                <span className="mt-0.5 text-primary-600">{detail.icon}</span>
                                <div>
                                    <p className="font-medium text-primary-800">{detail.value}</p>
                                    <p className="text-xs text-primary-500">{detail.helper}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 animate-fadeInUp delay-200">
                    <form className="p-6 md:p-7 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField id="firstName" label="First name" />
                            <FormField id="lastName" label="Last name" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField id="email" label="Email" type="email" />
                            <FormField id="preferredContact" label="Preferred contact method" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-primary-700" htmlFor="message">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows={5}
                                className="mt-2 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-primary-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

type FormFieldProps = {
    id: string;
    label: string;
    type?: string;
};

function FormField({ id, label, type = 'text' }: FormFieldProps) {
    return (
        <div>
            <label className="text-xs font-semibold text-primary-700" htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                type={type}
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-primary-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
        </div>
    );
}
