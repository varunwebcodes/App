import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/posts', authHeader);
            setPosts(res.data.posts);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3000/api/posts', formData, authHeader);
            setFormData({ title: '', content: '' });
            setMessage("Post created successfully!");
            setIsError(false);
            fetchPosts(); // refresh posts
        } catch (error) {
            setMessage(error.response.data.error);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/posts/${id}`, authHeader);
            fetchPosts(); // refresh posts
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 px-4 py-10">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-zinc-400 hover:text-white transition text-sm"
                        >
                            ← Back
                        </button>
                        <h1 className="text-3xl font-bold text-white">My Posts</h1>
                    </div>
                </div>

                {/* Create Post Form */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h2 className="text-white font-semibold mb-4">Create New Post</h2>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            type="text"
                            name="title"
                            placeholder="Post title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        />
                        <textarea
                            name="content"
                            placeholder="Write your post content..."
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-xl transition text-sm"
                        >
                            {loading ? "Posting..." : "Create Post"}
                        </button>
                    </form>
                    {message && (
                        <p className={`mt-3 text-sm text-center font-medium ${isError ? 'text-red-400' : 'text-green-400'}`}>
                            {message}
                        </p>
                    )}
                </div>

                {/* Posts List */}
                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
                            <p className="text-zinc-500 text-sm">No posts yet. Create your first post!</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-white font-semibold text-lg">{post.title}</h3>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        className="text-zinc-500 hover:text-red-400 transition text-sm ml-4"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                                <p className="text-zinc-400 text-sm">{post.content}</p>
                                <p className="text-zinc-600 text-xs mt-3">
                                    {new Date(post.createdAt).toDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default Posts;