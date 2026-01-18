import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const Signup = () => {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'traveler';
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const { register, handleSubmit, trigger, getValues, formState: { errors, isSubmitting } } = useForm();

    const onNext = async () => {
        const isValid = await trigger(['full_name', 'email', 'password']);
        if (!isValid) return;

        // Step 1: Register User (Inactive)
        try {
            setError('');
            const data = getValues();

            const payload = {
                username: data.email.split('@')[0],
                email: data.email,
                password: data.password
            };

            await api.post('/auth/signup/', payload);
            setStep(2); // Move to OTP step on success
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.username ? 'Username/Email already taken' : 'Registration failed');
        }
    };

    const onSubmit = async (data: any) => {
        if (step === 1) {
            await onNext();
            return;
        }

        // Step 2: Verify OTP
        try {
            await api.post('/auth/verify/', {
                email: data.email,
                code: data.verification_code
            });
            navigate('/login?role=' + role);
        } catch (err) {
            setError('Invalid Verification Code');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(0,0,0,1))] -z-10" />

            <Card className="max-w-md w-full p-8 border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {role === 'host' ? 'Host' : 'Traveler'} Access
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        {step === 1 ? 'Establish your digital identity' : 'Verify your credentials'}
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-4">
                        <div className={`h-1 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-blue-500' : 'bg-white/10'}`} />
                        <div className={`h-1 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-blue-500' : 'bg-white/10'}`} />
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {step === 1 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
                            <Input
                                label="Full Designation"
                                placeholder="John Doe"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
                                {...register('full_name', { required: 'Name is required' })}
                                error={errors.full_name?.message as string}
                            />
                            <Input
                                label="Contact Identity"
                                type="email"
                                placeholder="name@example.com"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
                                {...register('email', { required: 'Email is required' })}
                                error={errors.email?.message as string}
                            />
                            <Input
                                label="Secret Key"
                                type="password"
                                placeholder="••••••••"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
                                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                                error={errors.password?.message as string}
                            />

                            {error && <p className="text-red-400 text-xs bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

                            <Button type="button" onClick={onNext} className="w-full mt-4" isLoading={isSubmitting}>
                                {isSubmitting ? 'Processing...' : 'Continue'}
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center text-xs text-blue-400 bg-blue-500/10 p-3 rounded border border-blue-500/20">
                                System has dispatched a verification code to your console/email.
                            </div>

                            <Input
                                label="Verification Code"
                                placeholder="000000"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 text-center tracking-widest text-lg"
                                {...register('verification_code', { required: 'OTP is required' })}
                                error={errors.verification_code?.message as string}
                            />

                            {error && <p className="text-red-400 text-xs bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

                            <div className="flex gap-3">
                                <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1 border border-white/10">
                                    Back
                                </Button>
                                <Button type="submit" variant="primary" className="flex-[2]" isLoading={isSubmitting}>
                                    Verify & Access
                                </Button>
                            </div>
                        </div>
                    )}
                </form>

                <div className="mt-8 text-center border-t border-white/5 pt-6">
                    <span className="text-gray-600 text-xs">Identity already exists? </span>
                    <Link to={`/login?role=${role}`} className="text-blue-400 hover:text-blue-300 text-xs font-medium ml-1 transition-colors">
                        Authenticate
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Signup;
