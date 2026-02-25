import React from 'react';

export function WillWritingProtectedSection() {
    const steps = [
        {
            number: 1,
            title: 'Complete our simple questionnaire',
            paragraphs: [
                'On average, this takes 20 minutes to complete.',
                "Don’t worry if you don’t have all of the information right now, we will go through everything in detail later.",
                "We’ll save your progress for 21 days and send you reminders if you don’t get chance to finish it."
            ]
        },
        {
            number: 2,
            title: 'We check your will together',
            paragraphs: [
                "We’ll arrange a call to discuss your needs and make sure everything is covered in your will.",
                "If you’re happy, we will take payment at the end of the call."
            ]
        },
        {
            number: 3,
            title: 'Check and sign your will',
            paragraphs: [
                "We will email you your draft will to approve. When you’re happy, we’ll send you a professionally bound will to sign.",
                'We can store your will securely for life, for free.'
            ]
        }
    ];

    return (
        <section className="bg-white px-4 py-6 md:py-12 lg:py-16">
            <div className="mx-auto max-w-4xl">
                {/* Section Title */}
                <h2 className="mb-6 text-2xl font-semibold text-primary-800 md:text-3xl">
                    Fully protected wills made easy, with Online Will Services
                </h2>

                {/* Timeline Steps */}
                <div className="space-y-0">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex gap-6">
                            {/* Left Column - Number Circle and Line */}
                            <div className="flex flex-col items-center pt-1">
                                {/* Circle with Number */}
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-cyan-400 bg-white text-lg font-semibold text-cyan-400">
                                    {step.number}
                                </div>
                                {/* Connecting Line */}
                                {index !== steps.length - 1 && (
                                    <div className="mt-1 h-full w-0.5 bg-cyan-400" style={{ minHeight: '120px' }} />
                                )}
                            </div>

                            {/* Right Column - Content */}
                            <div className="flex-1 ">
                                <h3 className="mb-3 text-lg lg:text-xl font-semibold text-primary-900">
                                    {step.title}
                                </h3>
                                <div className="space-y-3">
                                    {step.paragraphs.map((paragraph, pIndex) => (
                                        <p key={pIndex} className="text-base leading-relaxed text-primary-700">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
