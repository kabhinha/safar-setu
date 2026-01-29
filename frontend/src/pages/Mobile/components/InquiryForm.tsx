import React, { useState } from 'react';
import { Loader2, CheckCircle, Send } from 'lucide-react';
import { type InquiryRequest } from '../../../contracts/mobile';

interface InquiryFormProps {
    resourceType: 'HOTSPOT' | 'SIGHT';
    resourceId: string;
    onSuccess?: (token: string) => void;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ resourceType, resourceId, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [successToken, setSuccessToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<InquiryRequest>>({
        phone: '',
        name: '',
        group_size: 2,
        preferred_date: '',
        note: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload: InquiryRequest = {
                phone: formData.phone!,
                name: formData.name,
                group_size: formData.group_size,
                preferred_date: formData.preferred_date || undefined,
                note: formData.note,
                resource_type: resourceType,
                resource_id: resourceId
            };

            const token = localStorage.getItem('token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch('http://localhost:8000/api/v1/bookings/public/inquire', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');

            setSuccessToken(data.reference_token);
            if (onSuccess) onSuccess(data.reference_token);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    if (successToken) {
        return (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Request Received</h3>
                <p className="text-sm text-slate-600 mb-4">
                    Your reference number is:
                </p>
                <div className="bg-white border border-dashed border-emerald-300 rounded-lg p-3 mb-4">
                    <span className="text-xl font-mono font-bold text-emerald-700 tracking-wider">
                        {successToken}
                    </span>
                </div>
                <p className="text-xs text-slate-500">
                    The host will contact you shortly on your provided number.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                Request Visit
            </h3>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                        placeholder="+91 99999 99999"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Your Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="Optional"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Group Size
                        </label>
                        <input
                            type="number"
                            min={1}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            value={formData.group_size}
                            onChange={e => setFormData({ ...formData, group_size: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        "Send Inquiry"
                    )}
                </button>

                <p className="text-[10px] text-center text-slate-400">
                    By submitting, you agree to share these details with the host.
                </p>
            </div>
        </form>
    );
};
