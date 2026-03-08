import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const res = await axios.get('/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(res.data.user);
            } catch (error) {
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-400 text-sm">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 px-4 py-10">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white text-sm px-4 py-2 rounded-xl transition"
                    >
                        Logout
                    </button>
                </div>

                {/* User Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">

                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
                            <p className="text-zinc-400 text-sm">{user?.email}</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-zinc-800 mb-6" />

                    {/* User Info */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">Full Name</span>
                            <span className="text-white text-sm font-medium">{user?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">Email</span>
                            <span className="text-white text-sm font-medium">{user?.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">Member Since</span>
                            <span className="text-white text-sm font-medium">
                                {new Date(user?.createdAt).toDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">Account ID</span>
                            <span className="text-zinc-500 text-xs font-mono">{user?._id}</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Dashboard;