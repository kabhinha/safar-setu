import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { logout } = useAuth();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default AdminDashboard;
