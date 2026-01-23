import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Upload, ChevronRight, ChevronLeft, Flag } from 'lucide-react';

import api from '../../services/api';

const STEPS = ['Basic Info', 'Details & Safety', 'Media', 'Review'];

const CreateHotspot = () => {
    useAuth();
    const navigate = useNavigate();
    const { id } = useParams(); // If editing
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hotspotId, setHotspotId] = useState<string | null>(id || null);

    const [formData, setFormData] = useState({
        name: '',
        district: '',
        village_cluster_label: '',
        description: '',
        short_description: '',
        operating_hours: '',
        sensitivity_level: 'PUBLIC',
        tags: '',
        safety_notes: '',
    });

    const [uploadedMedia, setUploadedMedia] = useState<any[]>([]);

    useEffect(() => {
        if (id) {
            // Fetch existing data
            api.get(`/listings/host/hotspots/${id}/`)
                .then(res => {
                    const data = res.data;
                    setHotspotId(data.id);
                    setFormData({
                        name: data.name,
                        district: data.district,
                        village_cluster_label: data.village_cluster_label,
                        description: data.description,
                        short_description: data.short_description,
                        operating_hours: data.operating_hours,
                        sensitivity_level: data.sensitivity_level,
                        tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags,
                        safety_notes: data.safety_notes || '',
                    });
                    setUploadedMedia(data.media || []);
                })
                .catch(err => console.error(err));
        }
    }, [id]);

    const handleSaveDraft = async () => {
        setLoading(true);
        const method = hotspotId ? 'patch' : 'post';
        const url = hotspotId
            ? `/listings/host/hotspots/${hotspotId}/`
            : `/listings/host/hotspots/`;

        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        };

        try {
            // @ts-ignore
            const res = await api[method](url, payload);

            setHotspotId(res.data.id);
            return true;
        } catch (err: any) {
            console.error("Network/System Error:", err);
            const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
            alert(`Save Failed: ${msg}`);
        } finally {
            setLoading(false);
        }
        return false;
    };

    const handleNext = async () => {
        if (currentStep < STEPS.length - 1) {
            // Check if we need to save first (Create Draft on Step 0 finish)
            if (currentStep === 0 || currentStep === 1) {
                const success = await handleSaveDraft();
                if (success) setCurrentStep(prev => prev + 1);
            } else {
                setCurrentStep(prev => prev + 1);
            }
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !hotspotId) return;
        const file = e.target.files[0];

        const data = new FormData();
        data.append('file', file);

        try {
            await api.post(`/listings/host/hotspots/${hotspotId}/upload_media/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Uploaded!");
            // Refresh logic omitted for brevity, in real app refetch
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        }
    };

    const handleSubmitForReview = async () => {
        console.log("Submit clicked. ID:", hotspotId);
        if (!hotspotId) {
            alert("Error: No Draft ID found. Please save Basic Info first.");
            return;
        }

        setLoading(true);
        try {
            await api.post(`/listings/host/hotspots/${hotspotId}/submit/`);
            alert("Submitted Successfully!");
            navigate('/host');
        } catch (err: any) {
            console.error("Submit Error:", err);
            const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
            alert(`Submission Failed: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    {id ? 'Edit Signal' : 'Initialize New Signal'}
                </h1>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-800 rounded-full mb-8 overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-300 ease-out"
                        style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    />
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-4">{STEPS[currentStep]}</h2>

                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Title</label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-black/20 border-white/10 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Tweet-sized Summary</label>
                                <Input value={formData.short_description} onChange={e => setFormData({ ...formData, short_description: e.target.value })} className="bg-black/20 border-white/10 text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">District</label>
                                    <Input value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} className="bg-black/20 border-white/10 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Village Cluster</label>
                                    <Input value={formData.village_cluster_label} onChange={e => setFormData({ ...formData, village_cluster_label: e.target.value })} className="bg-black/20 border-white/10 text-white" placeholder="e.g. Upper Majuli" />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Detailed Narrative</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full h-32 bg-black/20 border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Sensitivity Level</label>
                                <select
                                    value={formData.sensitivity_level}
                                    onChange={e => setFormData({ ...formData, sensitivity_level: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white"
                                >
                                    <option value="PUBLIC">Public</option>
                                    <option value="PROTECTED">Protected (Abstractions Enabled)</option>
                                    <option value="RESTRICTED">Restricted (No Discovery)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Safety Warnings</label>
                                <textarea value={formData.safety_notes} onChange={e => setFormData({ ...formData, safety_notes: e.target.value })} className="w-full h-20 bg-black/20 border border-white/10 rounded-md p-3 text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Operating Hours</label>
                                    <Input value={formData.operating_hours} onChange={e => setFormData({ ...formData, operating_hours: e.target.value })} className="bg-black/20 border-white/10 text-white" placeholder="09:00 - 17:00" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Tags (comma separated)</label>
                                    <Input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="bg-black/20 border-white/10 text-white" />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6 text-center py-10">
                            <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Upload className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold">Upload Visual Evidence</h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                Ensure no faces or sensitive landmarks are visible.
                                Only approved imagery will be published.
                            </p>

                            <input type="file" onChange={handleFileUpload} className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 and file:text-blue-700
                                hover:file:bg-blue-100" />

                            {/* List existing media if any */}
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                {uploadedMedia.map(m => (
                                    <img key={m.id} src={m.file} className="w-full h-24 object-cover rounded bg-white/10" />
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6 text-center py-10">
                            <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                <Flag className="h-10 w-10 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold">Ready to Submit?</h3>
                            <p className="text-gray-400">
                                Your signal "{formData.name}" will be sent to moderation.
                            </p>
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-left mt-6">
                                <p className="text-yellow-400 text-sm font-bold mb-1">Note:</p>
                                <p className="text-yellow-400/80 text-xs">
                                    Once submitted, you cannot edit until review is complete.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-6">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            if (currentStep === 0) navigate('/host');
                            else setCurrentStep(p => Math.max(0, p - 1));
                        }}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> {currentStep === 0 ? 'Dashboard' : 'Back'}
                    </Button>

                    {currentStep < 3 ? (
                        <Button onClick={handleNext} disabled={loading}>
                            {loading ? 'Saving...' : 'Save & Continue'} <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmitForReview} className="bg-green-600 hover:bg-green-500 border-none">
                            Submit for Review
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateHotspot;
