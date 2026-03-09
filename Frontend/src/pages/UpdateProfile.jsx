import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const UpdateProfile = () => {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFormData({
                    name: res.data.user.name,
                    email: res.data.user.email
                });
            } catch (error) {
                navigate('/login');
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('/update', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
            setIsError(false);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error) {
            setMessage(error.response.data.message);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-zinc-400 hover:text-white transition text-sm"
                        >
                            ← Back
                        </button>
                        <h2 className="text-2xl font-bold text-white">Update Profile</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-zinc-400 text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-zinc-400 text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-sm mt-2"
                        >
                            {loading ? "Updating..." : "Update Profile"}
                        </button>
                    </form>

                    {message && (
                        <p className={`mt-4 text-sm text-center font-medium ${isError ? 'text-red-400' : 'text-green-400'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;