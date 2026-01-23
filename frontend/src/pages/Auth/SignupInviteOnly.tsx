import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Shield, Key } from 'lucide-react';

const Signup = () => {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'traveler';
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data: any) => {
        try {
            setError('');
            // E04: Engagement Invite - Verify Invite Code and Transition Identity
            await api.post('/auth/verify-invite/', {
                invite_code: data.invite_code,
                email: data.email,
                password: data.password // Setting password for the first time
            });

            navigate('/login?role=' + role);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Invalid Invite Code or Identity');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(0,0,0,1))] -z-10" />

            <Card className="max-w-md w-full p-8 border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                        <Key className="h-6 w-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        Restricted Access
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        SAFARSETU is a governed platform.<br />
                        Enter your government-issued invite code to proceed.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Input
                            label="Invite Code"
                            placeholder="INV-XXXX-XXXX"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 uppercase tracking-widest font-mono"
                            {...register('invite_code', { required: 'Invite Code is required' })}
                            error={errors.invite_code?.message as string}
                        />
                        <Input
                            label="Registered Identity (Email)"
                            type="email"
                            placeholder="name@example.com"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
                            {...register('email', { required: 'Email is required' })}
                            error={errors.email?.message as string}
                        />
                        <Input
                            label="Set Secure Key"
                            type="password"
                            placeholder="••••••••"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                            error={errors.password?.message as string}
                        />

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-3 rounded border border-red-500/20">
                                <Shield className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full mt-4 bg-white text-black hover:bg-gray-200" isLoading={isSubmitting}>
                            Verify & Initialize Identity
                        </Button>
                    </div>
                </form>

                <div className="mt-8 text-center border-t border-white/5 pt-6">
                    <span className="text-gray-600 text-xs block mb-2">Have a Guest or Curiosity ID?</span>
                    <Link to={`/login?role=${role}`} className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
                        Access Existing Account
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Signup;
