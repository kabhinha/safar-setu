import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import GovtNavbar from '../../components/layout/GovtNavbar';
import { Shield } from 'lucide-react';

const Login = () => {
    const [searchParams] = useSearchParams();
    const roleParam = searchParams.get('role');
    const role = roleParam === 'host' ? 'host' : 'traveler';
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data: any) => {
        try {
            await login(data);
            navigate(role === 'host' ? '/host' : '/m');
        } catch (err) {
            setError('Identity verification failed. Invalid credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <GovtNavbar showUserBadge={false} />

            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                <Card className="max-w-md w-full p-8 border-slate-200 bg-white shadow-sm">
                    <div className="text-center mb-8 space-y-2">
                        <div className="mx-auto h-10 w-10 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                            {role === 'host' ? 'Administrative Access' : 'Inbound Identity System'}
                        </h2>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                            Authorized Personnel Only
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Official Identity (Email)"
                            placeholder="name@example.com"
                            type="email"
                            className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                            {...register('email', { required: 'Identity is required' })}
                            error={errors.email?.message as string}
                        />

                        <Input
                            label="Secure Passkey"
                            placeholder="••••••••"
                            type="password"
                            className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                            {...register('password', { required: 'Passkey is required' })}
                            error={errors.password?.message as string}
                        />

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded flex items-center gap-2">
                                <Shield className="h-4 w-4 text-red-600" />
                                <span className="text-xs text-red-700 font-medium">{error}</span>
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-none" isLoading={isSubmitting}>
                            Authenticate
                        </Button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <span className="text-slate-500 text-xs">No official record? </span>
                        <Link to={`/m/signup`} className="text-slate-900 hover:underline text-xs font-bold ml-1">
                            Request Entry Permit
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
