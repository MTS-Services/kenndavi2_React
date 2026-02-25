import React from 'react';

const SavingOverlay: React.FC = () => (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-xl px-10 py-6 flex flex-col items-center gap-3 min-w-60">
            <div className="w-full h-4 rounded-full overflow-hidden bg-slate-100 relative">
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'repeating-linear-gradient(-45deg, #86b5a0, #86b5a0 10px, #a3c9b8 10px, #a3c9b8 20px)',
                        backgroundSize: '200% 100%',
                        animation: 'saving-stripe 1s linear infinite'
                    }}
                />
            </div>
            <p className="text-sm text-primary-600 font-medium">Saving</p>
            <style>{`
                @keyframes saving-stripe {
                    0% { background-position: 0 0; }
                    100% { background-position: 40px 0; }
                }
            `}</style>
        </div>
    </div>
);

export default SavingOverlay;
