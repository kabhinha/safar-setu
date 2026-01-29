import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import GovtNavbar from '../../components/layout/GovtNavbar';
import { Shield } from 'lucide-react';

type FormValues = {
    full_name: string;
    phone: string;
    email?: string;
    password: string;
    nationality: 'indian' | 'foreign';
    country?: string;
    identity_type: string;
    identity_value: string;
    address?: string;
    verification_code?: string;
};

const COUNTRY_OPTIONS = [
    'India',
    'Nepal',
    'Bhutan',
    'Bangladesh',
    'Myanmar',
    'USA',
    'UK',
    'Canada',
    'Australia',
    'Other'
];

const IDENTITY_OPTIONS = [
    'Aadhaar',
    'Passport',
    'Driving License',
    'Voter ID',
    'PAN',
    'Other'
];

const Signup = () => {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'traveler';
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [error, setError] = useState('');
    const [submittedEmail, setSubmittedEmail] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({
        defaultValues: {
            nationality: 'indian',
            country: 'India',
            identity_type: 'Aadhaar'
        }
    });

    const nationality = watch('nationality');
    const isForeign = nationality === 'foreign';

    const persistDraft = (data: FormValues) => {
        const draft = {
            full_name: data.full_name,
            phone: data.phone,
            email: data.email,
            nationality: data.nationality,
            country: data.country,
            identity_type: data.identity_type,
            identity_value: data.identity_value,
            address: data.address
        };
        localStorage.setItem('safarsetu.signupDraft', JSON.stringify(draft));
    };

    const handleRegister = async (data: FormValues) => {
        setError('');
        persistDraft(data);

        if (!data.email || data.email.trim().length === 0) {
            setError('Email is required for registration.');
            return;
        }

        const email = data.email.trim();
        setSubmittedEmail(email);

        const normalizedNationality = data.nationality === 'foreign' ? 'FOREIGN' : 'INDIAN';
        const payload = {
            username: email.split('@')[0],
            email,
            password: data.password,
            full_name: data.full_name,
            phone_number: data.phone,
            nationality: normalizedNationality,
            country: normalizedNationality === 'FOREIGN' ? data.country : 'India',
            identity_type: data.identity_type,
            identity_value: data.identity_value,
            address: data.address
        };

        try {
            await api.post('http://localhost:8000/auth/signup/', payload);
            setStep(2);
        } catch (err: any) {
            const data = err?.response?.data;
            const firstError = typeof data === 'object' ? Object.values(data)[0] : null;
            const message = Array.isArray(firstError) ? firstError[0] : firstError;
            const exists = data?.username || data?.email;
            setError(message || (exists ? 'Identity already registered.' : 'Registration failed. Please retry.'));
        }
    };

    const handleVerify = async (data: FormValues) => {
        setError('');
        try {
            await api.post('http://localhost:8000/auth/verify/', {
                email: submittedEmail || data.email,
                code: data.verification_code
            });
            navigate(`/m/login?role=${role}`);
        } catch (err) {
            setError('Invalid verification code.');
        }
    };

    const onSubmit = async (formData: FormValues) => {
        if (step === 1) {
            await handleRegister(formData);
        } else {
            await handleVerify(formData);
        }
    };

    const renderNationality = () => (
        <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nationality</p>
            <div className="grid grid-cols-2 gap-3">
                {['indian', 'foreign'].map(option => {
                    const isActive = nationality === option;
                    const label = option === 'indian' ? 'Indian National' : 'Foreign National';
                    return (
                        <button
                            type="button"
                            key={option}
                            onClick={() => setValue('nationality', option as FormValues['nationality'], { shouldValidate: true })}
                            className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${
                                isActive
                                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-white'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{label}</span>
                                <span className={`h-4 w-4 rounded-full border ${isActive ? 'border-white bg-white' : 'border-slate-300 bg-white'}`} />
                            </div>
                        </button>
                    );
                })}
            </div>
            <input type="hidden" {...register('nationality', { required: 'Select nationality' })} />
            {errors.nationality && <p className="text-xs text-red-600">{errors.nationality.message}</p>}
            {isForeign && (
                <div className="mt-3">
                    <label className="mb-1 block text-xs font-medium text-slate-600 uppercase tracking-wide">Name of Country</label>
                    <select
                        className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                        {...register('country', {
                            validate: value => (!isForeign || (value && value.length > 0)) || 'Country is required'
                        })}
                        defaultValue="India"
                    >
                        {COUNTRY_OPTIONS.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                    {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>}
                </div>
            )}
        </div>
    );

    const renderPersonal = () => (
        <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Personal Details</p>
            <Input
                label="Name"
                placeholder="Enter full name"
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                {...register('full_name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                error={errors.full_name?.message}
            />
            <Input
                label="Phone Number"
                placeholder="10-15 digit mobile number"
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                {...register('phone', {
                    required: 'Phone is required',
                    pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: 'Use 10-15 digits'
                    }
                })}
                error={errors.phone?.message}
            />
            <Input
                label="Email ID (optional)"
                placeholder="name@example.com"
                type="email"
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                {...register('email', { required: 'Email is required' })}
                error={errors.email?.message}
            />
        </div>
    );

    const renderIdentity = () => (
        <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Identity</p>
            <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 uppercase tracking-wide">Identity Type</label>
                <select
                    className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                    {...register('identity_type', { required: 'Identity type is required' })}
                    defaultValue="Aadhaar"
                >
                    {IDENTITY_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                {errors.identity_type && <p className="mt-1 text-xs text-red-600">{errors.identity_type.message}</p>}
            </div>
            <Input
                label="Identity Details"
                placeholder="Enter ID number"
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                {...register('identity_value', { required: 'Identity details are required' })}
                error={errors.identity_value?.message}
            />
        </div>
    );

    const renderAddress = () => (
        <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Address</p>
            <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 uppercase tracking-wide">Permanent Address (optional)</label>
                <textarea
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                    placeholder="Residential address"
                    {...register('address')}
                />
            </div>
            <Input
                label="Create Passkey"
                type="password"
                placeholder="Enter secure password"
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                error={errors.password?.message}
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <GovtNavbar showUserBadge={false} />

            <div className="flex-1 flex flex-col items-center p-4 sm:p-6">
                <Card className="max-w-lg w-full p-8 border-slate-200 bg-white shadow-sm space-y-6">
                    <div className="text-center space-y-2">
                        <div className="mx-auto h-10 w-10 bg-slate-900 rounded-full flex items-center justify-center mb-2">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tourist Registration</h2>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Secure access for SafarSetu mobile</p>
                        <div className="flex items-center justify-center gap-2 mt-3">
                            <div className={`h-1 w-10 rounded-full ${step >= 1 ? 'bg-slate-900' : 'bg-slate-200'}`} />
                            <div className={`h-1 w-10 rounded-full ${step >= 2 ? 'bg-slate-900' : 'bg-slate-200'}`} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {step === 1 && (
                            <div className="space-y-6">
                                {renderNationality()}
                                {renderPersonal()}
                                {renderIdentity()}
                                {renderAddress()}

                                {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded p-2">{error}</p>}

                                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-none" isLoading={isSubmitting}>
                                    Proceed to Verification
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5">
                                <div className="text-center text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded p-3">
                                    A verification code has been dispatched to your registered contact.
                                </div>

                                <Input
                                    label="Verification Code"
                                    placeholder="000000"
                                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white text-center tracking-widest text-lg"
                                    {...register('verification_code', { required: 'OTP is required' })}
                                    error={errors.verification_code?.message}
                                />

                                {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded p-2">{error}</p>}

                                <div className="flex gap-3">
                                    <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1 border border-slate-200 text-slate-700">
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white shadow-none" isLoading={isSubmitting}>
                                        Verify & Access
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>

                    <div className="pt-4 text-center border-t border-slate-100">
                        <span className="text-slate-500 text-xs">Already registered? </span>
                        <Link to={`/m/login?role=${role}`} className="text-slate-900 hover:underline text-xs font-bold ml-1">
                            Authenticate
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Signup;
