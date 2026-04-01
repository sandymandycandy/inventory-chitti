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
            const API_URL = window.location.hostname === 'localhost'
                ? 'http://localhost:5000/api'
                : `http://${window.location.hostname}:5000/api`;

            const response = await axios.post(`${API_URL}/auth/login`, formData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

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
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#008080',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Tahoma, "MS Sans Serif", Arial, sans-serif',
            fontSize: '11px',
        }}>
            {/* Windows 2000 Login Dialog */}
            <div style={{
                width: '380px',
                backgroundColor: '#d4d0c8',
                borderTop: '2px solid #ffffff',
                borderLeft: '2px solid #ffffff',
                borderRight: '2px solid #404040',
                borderBottom: '2px solid #404040',
                boxShadow: '4px 4px 8px rgba(0,0,0,0.5)',
            }}>
                {/* Titlebar */}
                <div style={{
                    background: 'linear-gradient(to right, #000080, #1084d0)',
                    color: '#ffffff',
                    padding: '4px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    userSelect: 'none',
                }}>
                    <span style={{ fontSize: '12px' }}>🔐</span>
                    <span style={{ flex: 1 }}>Log On to Windows</span>
                    {/* Title buttons */}
                    {['?', '✕'].map((btn, i) => (
                        <div
                            key={i}
                            style={{
                                width: '18px',
                                height: '16px',
                                backgroundColor: '#d4d0c8',
                                borderTop: '1px solid #ffffff',
                                borderLeft: '1px solid #ffffff',
                                borderRight: '1px solid #404040',
                                borderBottom: '1px solid #404040',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: '700',
                                color: '#000000',
                                cursor: 'default',
                            }}
                        >
                            {btn}
                        </div>
                    ))}
                </div>

                {/* Dialog Content */}
                <div style={{ padding: '16px' }}>
                    {/* Logo + Branding Area */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '16px',
                        padding: '12px',
                        backgroundColor: '#ffffff',
                        borderTop: '1px solid #808080',
                        borderLeft: '1px solid #808080',
                        borderRight: '1px solid #ffffff',
                        borderBottom: '1px solid #ffffff',
                        boxShadow: 'inset 1px 1px 0 #404040',
                    }}>
                        <img
                            src="/logo.png"
                            alt="Tins & Trays Logo"
                            style={{ width: '56px', height: '56px', objectFit: 'contain', flexShrink: 0 }}
                        />
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '13px', color: '#000080' }}>
                                Tins &amp; Trays Bakery
                            </div>
                            <div style={{ fontSize: '11px', color: '#444444', marginTop: '2px' }}>
                                Bakery Management System
                            </div>
                            <div style={{ fontSize: '10px', color: '#666666', marginTop: '2px' }}>
                                Microsoft Windows 2000 Professional
                            </div>
                        </div>
                    </div>

                    {/* Separator */}
                    <div style={{
                        borderTop: '1px solid #808080',
                        borderBottom: '1px solid #ffffff',
                        marginBottom: '14px',
                    }} />

                    {/* Instructions */}
                    <div style={{ marginBottom: '12px', fontSize: '11px', color: '#000000', lineHeight: 1.5 }}>
                        Type your user name and password to log on to Bakery POS.
                    </div>

                    {/* Error box */}
                    {error && (
                        <div style={{
                            marginBottom: '10px',
                            padding: '6px 8px',
                            backgroundColor: '#ffffff',
                            borderTop: '1px solid #808080',
                            borderLeft: '1px solid #808080',
                            borderRight: '1px solid #ffffff',
                            borderBottom: '1px solid #ffffff',
                            boxShadow: 'inset 1px 1px 0 #404040',
                            fontSize: '11px',
                            color: '#cc0000',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '6px',
                        }}>
                            <span style={{ fontSize: '14px', flexShrink: 0 }}>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: '110px', paddingBottom: '6px', paddingRight: '8px', fontSize: '11px', whiteSpace: 'nowrap' }}>
                                        <label htmlFor="username">User name:</label>
                                    </td>
                                    <td style={{ paddingBottom: '6px' }}>
                                        <input
                                            id="username"
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                            autoFocus
                                            style={{
                                                width: '100%',
                                                backgroundColor: '#ffffff',
                                                borderTop: '1px solid #808080',
                                                borderLeft: '1px solid #808080',
                                                borderRight: '1px solid #ffffff',
                                                borderBottom: '1px solid #ffffff',
                                                padding: '2px 4px',
                                                fontSize: '11px',
                                                fontFamily: 'Tahoma, sans-serif',
                                                boxShadow: 'inset 1px 1px 0 #404040',
                                                outline: 'none',
                                                height: '22px',
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ paddingBottom: '6px', paddingRight: '8px', fontSize: '11px', whiteSpace: 'nowrap' }}>
                                        <label htmlFor="password">Password:</label>
                                    </td>
                                    <td style={{ paddingBottom: '6px' }}>
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                width: '100%',
                                                backgroundColor: '#ffffff',
                                                borderTop: '1px solid #808080',
                                                borderLeft: '1px solid #808080',
                                                borderRight: '1px solid #ffffff',
                                                borderBottom: '1px solid #ffffff',
                                                padding: '2px 4px',
                                                fontSize: '11px',
                                                fontFamily: 'Tahoma, sans-serif',
                                                boxShadow: 'inset 1px 1px 0 #404040',
                                                outline: 'none',
                                                height: '22px',
                                            }}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Separator */}
                        <div style={{
                            borderTop: '1px solid #808080',
                            borderBottom: '1px solid #ffffff',
                            marginBottom: '12px',
                        }} />

                        {/* Demo credentials info box */}
                        <div style={{
                            marginBottom: '12px',
                            padding: '6px 8px',
                            backgroundColor: '#ffffc0',
                            borderTop: '1px solid #808080',
                            borderLeft: '1px solid #808080',
                            borderRight: '1px solid #ffffff',
                            borderBottom: '1px solid #ffffff',
                            boxShadow: 'inset 1px 1px 0 #404040',
                            fontSize: '11px',
                        }}>
                            <div style={{ fontWeight: '700', marginBottom: '4px' }}>ℹ Demo Credentials</div>
                            <div>Username: <strong>admin</strong></div>
                            <div>Password: <strong>admin123</strong></div>
                        </div>

                        {/* Buttons row */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '6px',
                        }}>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    backgroundColor: '#d4d0c8',
                                    borderTop: '2px solid #ffffff',
                                    borderLeft: '2px solid #ffffff',
                                    borderRight: '2px solid #404040',
                                    borderBottom: '2px solid #404040',
                                    padding: '4px 20px',
                                    fontSize: '11px',
                                    fontFamily: 'Tahoma, sans-serif',
                                    fontWeight: '700',
                                    cursor: loading ? 'wait' : 'pointer',
                                    outline: '1px dotted #000000',
                                    outlineOffset: '1px',
                                    boxShadow: '1px 1px 0 #808080',
                                    minWidth: '75px',
                                    color: loading ? '#808080' : '#000000',
                                }}
                            >
                                {loading ? 'Please wait...' : 'OK'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ username: '', password: '' })}
                                style={{
                                    backgroundColor: '#d4d0c8',
                                    borderTop: '2px solid #ffffff',
                                    borderLeft: '2px solid #ffffff',
                                    borderRight: '2px solid #404040',
                                    borderBottom: '2px solid #404040',
                                    padding: '4px 20px',
                                    fontSize: '11px',
                                    fontFamily: 'Tahoma, sans-serif',
                                    cursor: 'pointer',
                                    boxShadow: '1px 1px 0 #808080',
                                    minWidth: '75px',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                style={{
                                    backgroundColor: '#d4d0c8',
                                    borderTop: '2px solid #ffffff',
                                    borderLeft: '2px solid #ffffff',
                                    borderRight: '2px solid #404040',
                                    borderBottom: '2px solid #404040',
                                    padding: '4px 20px',
                                    fontSize: '11px',
                                    fontFamily: 'Tahoma, sans-serif',
                                    cursor: 'pointer',
                                    boxShadow: '1px 1px 0 #808080',
                                    minWidth: '75px',
                                    color: '#808080',
                                }}
                            >
                                Options &gt;&gt;
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Desktop icons hint */}
            <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                color: '#ffffff',
                fontSize: '10px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                fontFamily: 'Tahoma, sans-serif',
                textAlign: 'center',
            }}>
                © 2026 Tins &amp; Trays Bakery
            </div>
        </div>
    );
}

export default Login;
