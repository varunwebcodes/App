import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios'

const Register = () => {

    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:'',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const res = await axios.post('/register', formData);
            setMessage(res.data.message);
            setIsError(false);
            setTimeout(() => navigate('/login'), 1500);
        }catch(err){
            setMessage(err.response.data.message)
        }finally{
            setLoading(false)
        }
    };

  return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
                        <p className="text-zinc-400 mt-1 text-sm">Fill in your details to get started</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-zinc-400 text-sm font-medium">Full Name</label>
                            <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required
                                className="bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-zinc-400 text-sm font-medium">Email</label>
                            <input type="email" name="email" placeholder="john@gmail.com" value={formData.email} onChange={handleChange} required
                                className="bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-zinc-400 text-sm font-medium">Password</label>
                            <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required
                                className="bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-sm mt-2">
                            {loading ? "Creating Account..." : "Register"}
                        </button>
                    </form>
                    {message && (
                        <p className={`mt-4 text-sm text-center font-medium ${isError ? 'text-red-400' : 'text-green-400'}`}>
                            {message}
                        </p>
                    )}
                    <p className="text-zinc-500 text-sm text-center mt-6">
                        Already have an account?{' '}
                        <span onClick={() => navigate('/login')} className="text-blue-400 hover:text-blue-300 cursor-pointer transition">
                            Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
  );
}

export default Register;
