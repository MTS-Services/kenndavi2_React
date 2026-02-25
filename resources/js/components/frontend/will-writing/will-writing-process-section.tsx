import React from 'react';

const steps = [
    {
        number: 1,
        title: 'Complete our simple questionnaire',
        paragraphs: [
            'On average, this takes 20 minutes to complete.',
            'Don’t worry if you don’t have all of the information right now, we will go through everything in detail later.',
            'We’ll save your progress for 21 days and send you reminders if you don’t get chance to finish it.',
        ],
    },
    {
        number: 2,
        title: 'We check your will together',
        paragraphs: [
            'We’ll arrange a call to discuss your needs and make sure everything is covered in your will.',
            'If you’re happy, we will take payment at the end of the call.',
        ],
    },
    {
        number: 3,
        title: 'Check and sign your will',
        paragraphs: [
            'We will email you your draft will to approve. When you’re happy, we’ll send you a professionally bound will to sign.',
            'We can store your will securely for life, for free.',
        ],
    },
];

export function WillWritingProcessSection() {
    return (
        <section className="px-4 py-16 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-6xl rounded-[36px] bg-white/70 px-6 py-10 shadow-2xl shadow-black/5 lg:px-12">
                <div className="grid gap-10 lg:grid-cols-[1fr,1.3fr]">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500 animate-fadeInUp">Process</p>
                        <h3 className="mt-4 text-3xl font-serif font-semibold text-primary-900 animate-fadeInUp delay-100">
                            Unlock a High-Return Business Opportunity with Will Write Online 
                        </h3>
                        <p className="mt-3 text-sm text-primary-600">
                            From the first questionnaire to securely storing your will, our specialists stay with you the whole way.
                        </p>
                    </div>
                    <div className="space-y-10">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex gap-6 animate-fadeInUp" style={{ animationDelay: `${index * 150}ms` }}>
                                <div className="flex flex-col items-center">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-200 bg-white text-sm font-semibold text-primary-600">
                                        {step.number}
                                    </span>
                                    {index < steps.length - 1 && <span className="mt-3 h-20 w-px bg-primary-100" />}
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-primary-900">{step.title}</h4>
                                    <div className="mt-2 space-y-2 text-sm text-primary-600">
                                        {step.paragraphs.map((paragraph) => (
                                            <p key={paragraph}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
