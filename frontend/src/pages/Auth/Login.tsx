import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

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
            navigate(role === 'host' ? '/host/dashboard' : '/feed');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(0,0,0,1))] -z-10" />

            <Card className="max-w-md w-full p-8 border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {role === 'host' ? 'Host Portal' : 'Traveler Login'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Authenticate to access the network
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Identity"
                        placeholder="name@example.com"
                        type="email"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
                        {...register('email', { required: 'Identity is required' })}
                        error={errors.email?.message as string}
                    />

                    <Input
                        label="Passkey"
                        placeholder="••••••••"
                        type="password"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
                        {...register('password', { required: 'Passkey is required' })}
                        error={errors.password?.message as string}
                    />

                    {error && <p className="text-red-400 text-xs bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

                    <Button type="submit" className="w-full" isLoading={isSubmitting}>
                        Authenticate
                    </Button>
                </form>

                <div className="mt-8 text-center border-t border-white/5 pt-6">
                    <span className="text-gray-600 text-xs">No credentials? </span>
                    <Link to={`/signup?role=${role}`} className="text-blue-400 hover:text-blue-300 text-xs font-medium ml-1 transition-colors">
                        Request Access
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Login;
