import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import GovtNavbar from '../../components/layout/GovtNavbar';
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
                password: data.password
            });

            navigate('/login?role=' + role);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Invalid Invite Code or Identity Record');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <GovtNavbar showUserBadge={false} />

            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                <Card className="max-w-md w-full p-8 border-slate-200 bg-white shadow-sm">
                    <div className="text-center mb-8 space-y-2">
                        <div className="mx-auto h-10 w-10 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                            <Key className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                            Restricted Access Protocol
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                            This is a governed platform. Entry requires a government-issued invite code.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Government Invite Code"
                            placeholder="INV-XXXX-XXXX"
                            className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white uppercase tracking-widest font-mono"
                            {...register('invite_code', { required: 'Invite Code is required' })}
                            error={errors.invite_code?.message as string}
                        />
                        <Input
                            label="Identity Record (Email)"
                            type="email"
                            placeholder="name@example.com"
                            className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                            {...register('email', { required: 'Email is required' })}
                            error={errors.email?.message as string}
                        />
                        <Input
                            label="Set Secure Passkey"
                            type="password"
                            placeholder="••••••••"
                            className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                            error={errors.password?.message as string}
                        />

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded flex items-center gap-2">
                                <Shield className="h-4 w-4 text-red-600" />
                                <span className="text-xs text-red-700 font-medium">{error}</span>
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-none mt-2" isLoading={isSubmitting}>
                            Verify & Initialize Identity
                        </Button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <span className="text-slate-500 text-xs">Existing permit? </span>
                        <Link to={`/login?role=${role}`} className="text-slate-900 hover:underline text-xs font-bold ml-1">
                            Access System
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Signup;
