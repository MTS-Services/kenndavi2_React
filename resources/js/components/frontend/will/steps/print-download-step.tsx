import React, { useCallback, useState } from 'react';
import generateWillPdf from '@/components/frontend/will/generate-will-pdf';
import type { WillData } from './will-types';

const ReviewItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <div className="text-xs text-primary-500 font-medium mb-1">{label}</div>
        <div className="text-sm text-primary-800 font-medium">{value || 'Not provided'}</div>
    </div>
);

export interface PrintDownloadStepProps {
    data: WillData;
}

const PrintDownloadStep: React.FC<PrintDownloadStepProps> = ({ data }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = useCallback(async () => {
        try {
            setIsGenerating(true);
            await Promise.resolve(generateWillPdf(data));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to generate will PDF', error);
        } finally {
            setIsGenerating(false);
        }
    }, [data]);

    const handlePreview = useCallback(async () => {
        try {
            setIsGenerating(true);
            await Promise.resolve(generateWillPdf(data, { preview: true }));
        } catch (error) {
            console.error('Failed to preview will PDF', error);
        } finally {
            setIsGenerating(false);
        }
    }, [data]);

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-normal text-primary-700 mb-4">
                Review & Download
            </h2>
            <p className="text-sm text-primary-500 mb-8">
                Review your will details below, then print or download your document.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-primary-700 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <ReviewItem label="Name" value={`${data.personalInfo.title} ${data.personalInfo.firstName} ${data.personalInfo.middleName} ${data.personalInfo.lastName}`.trim()} />
                    <ReviewItem label="Date of Birth" value={data.personalInfo.dateOfBirth} />
                    <ReviewItem label="Marital Status" value={data.personalInfo.maritalStatus} />
                    <ReviewItem label="Address" value={`${data.personalInfo.address}, ${data.personalInfo.city}, ${data.personalInfo.postcode}`} />
                </div>
            </div>

            {data.executors.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-primary-700 mb-4">Executors ({data.executors.length})</h3>
                    <div className="space-y-2">
                        {data.executors.map((executor, index) => (
                            <p key={executor.id} className="text-sm text-primary-600">
                                <strong>{index + 1}.</strong> {executor.title} {executor.firstName} {executor.lastName} — {executor.relationship}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {data.beneficiaries.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-primary-700 mb-4">Beneficiaries ({data.beneficiaries.length})</h3>
                    <div className="space-y-2">
                        {data.beneficiaries.map((b, index) => (
                            <p key={b.id} className="text-sm text-primary-600">
                                <strong>{index + 1}.</strong>{' '}
                                {b.type === 'person' ? `${b.firstName} ${b.lastName}` : b.charityName}
                                {b.percentage ? ` — ${b.percentage}%` : ''}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-6 text-center">
                <p className="text-primary-700 text-sm mb-4">
                    Once you're satisfied, preview or download your will and sign it with two witnesses.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={handlePreview}
                        disabled={isGenerating}
                        className="px-6 py-2 border border-emerald-600 text-accent-green rounded font-semibold text-xs uppercase tracking-wide hover:bg-accent-green/5 transition-colors cursor-pointer"
                    >
                        {isGenerating ? 'LOADING…' : 'PREVIEW PDF'}
                    </button>
                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="px-10 py-3 bg-emerald-600 text-white rounded font-bold text-sm uppercase tracking-wider hover:bg-emerald-600 transition-colors cursor-pointer"
                    >
                        {isGenerating ? 'PREPARING PDF…' : 'DOWNLOAD WILL DOCUMENT'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrintDownloadStep;
