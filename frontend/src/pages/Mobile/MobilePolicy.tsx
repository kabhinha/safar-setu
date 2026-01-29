import React from 'react';

const MobilePolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <div className="max-w-lg mx-auto px-4 py-10 space-y-4">
                <p className="text-[11px] uppercase font-bold tracking-widest text-slate-500">Policy placeholder</p>
                <h1 className="text-xl font-bold text-slate-900">SafarSetu Mobile Policy</h1>
                <p className="text-sm text-slate-700 leading-relaxed">
                    This page is reserved for the official policy brief for the pilot mobile experience.
                    Please refer to the kiosk or district office for the most recent signed circulars.
                </p>
                <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 space-y-2">
                    <p className="font-semibold text-slate-800">Key commitments</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                        <li>Citizen safety and data minimization first.</li>
                        <li>Trusted QR continuation for kiosk-to-mobile journeys.</li>
                        <li>Local language support in phased roll-out.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MobilePolicy;
