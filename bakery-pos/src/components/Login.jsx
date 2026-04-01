import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Dynamic API URL for network access
            const API_URL = window.location.hostname === 'localhost' 
                ? 'http://localhost:5000/api'
                : `http://${window.location.hostname}:5000/api`;
            
            const response = await axios.post(`${API_URL}/auth/login`, formData);
            const { token, user } = response.data;

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Call parent callback
            onLoginSuccess(user);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50/20 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-4 px-8 py-6 bg-white rounded-3xl shadow-2xl mb-6">
                        <img 
                            src="/logo.png" 
                            alt="Tins & Trays Logo" 
                            className="w-32 h-32 object-contain"
                        />
                    </div>
                    <p className="text-slate-600 font-medium text-lg">Bakery Management System</p>
                </div>

                {/* Login Card */}
                <div className="card p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Welcome Back</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input"
                                placeholder="Enter your username"
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-8 p-4 bg-sky-50 border border-sky-200 rounded-xl">
                        <p className="text-xs font-bold text-sky-900 mb-2 uppercase tracking-wide">Demo Credentials</p>
                        <div className="space-y-1 text-xs text-sky-700">
                            <p><span className="font-semibold">Username:</span> admin</p>
                            <p><span className="font-semibold">Password:</span> admin123</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-slate-500">
                        &copy; 2026 Tins & Trays Bakery. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
