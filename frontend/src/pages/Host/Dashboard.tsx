import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

const HostDashboard = () => {
    const { logout } = useAuth();

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Host Dashboard</h1>
                <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </div>
            <p>Manage your listings here.</p>
        </div>
    );
};

export default HostDashboard;
