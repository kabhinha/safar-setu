import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicMobileLayout } from '../../components/layout/PublicMobileLayout';
import { Loader2, AlertTriangle, MapPin, Clock, Shield } from 'lucide-react';
import { InquiryForm } from './components/InquiryForm';

interface DetailData {
    id: string;
    name: string;
    description: string;
    district: string;
    images?: { file: string }[];
    best_time?: string;
    safety_note?: string;
}

const PublicDetail: React.FC<{ type: 'hotspot' | 'sight' }> = ({ type }) => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<DetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showInquiry, setShowInquiry] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const endpoint = type === 'hotspot'
                    ? `http://localhost:8000/api/v1/listings/hotspots/${id}/`
                    : `http://localhost:8000/api/v1/listings/public/sights/${id}/`;

                const res = await fetch(endpoint);
                if (!res.ok) throw new Error("Resource not found");
                console.log(res);
                const json = await res.json();
                console.log(json);
                setData(json);
            } catch (err) {
                setError((err as Error).message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, type]);

    if (loading) return (
        <PublicMobileLayout>
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>
        </PublicMobileLayout>
    );

    if (error || !data) return (
        <PublicMobileLayout>
            <div className="p-8 text-center text-red-500 flex flex-col items-center">
                <AlertTriangle className="mb-2" />
                {error}
            </div>
        </PublicMobileLayout>
    );

    return (
        <PublicMobileLayout>
            <div className="w-full h-56 bg-slate-200 relative">
                {data.images && data.images.length > 0 ? (
                    <img src={data.images[0].file} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">NO IMAGE</div>
                )}
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 text-white">
                    <span className="bg-slate-900/80 px-2 py-1 text-[10px] font-bold uppercase rounded mb-1 inline-block">
                        {data.district}
                    </span>
                    <h1 className="text-xl font-bold leading-none">{data.name}</h1>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Official Record</h2>
                    <p className="text-sm text-slate-700 leading-relaxed">{data.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {data.best_time && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded">
                            <Clock className="w-4 h-4 text-slate-400 mb-1" />
                            <p className="text-[10px] uppercase font-bold text-slate-500">Best Time</p>
                            <p className="text-sm font-semibold">{data.best_time}</p>
                        </div>
                    )}
                    {data.safety_note && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded col-span-2">
                            <Shield className="w-4 h-4 text-slate-400 mb-1" />
                            <p className="text-[10px] uppercase font-bold text-slate-500">Advisory</p>
                            <p className="text-sm font-semibold">{data.safety_note}</p>
                        </div>
                    )}
                </div>

                {!showInquiry ? (
                    <button
                        onClick={() => setShowInquiry(true)}
                        className="w-full py-3 bg-slate-900 text-white font-bold rounded text-sm hover:bg-slate-800"
                    >
                        Request Official Visit
                    </button>
                ) : (
                    <InquiryForm resourceType={type === 'hotspot' ? 'HOTSPOT' : 'SIGHT'} resourceId={data.id} />
                )}
            </div>
        </PublicMobileLayout>
    );
};

export default PublicDetail;
