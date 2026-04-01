import { useState, useEffect } from 'react';
import axios from 'axios';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        role: 'cashier'
    });

    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingUser) {
                await axios.put(
                    `http://localhost:5000/api/auth/users/${editingUser._id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    'http://localhost:5000/api/auth/register',
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            fetchUsers();
            resetForm();
            setShowModal(false);
        } catch (error) {
            alert(error.response?.data?.error || 'Error saving user');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            password: '' // Don't populate password
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchUsers();
            } catch (error) {
                alert(error.response?.data?.error || 'Error deleting user');
            }
        }
    };

    const toggleUserStatus = async (user) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/auth/users/${user._id}`,
                { ...user, isActive: !user.isActive },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.error || 'Error updating user status');
        }
    };

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            fullName: '',
            role: 'cashier'
        });
        setEditingUser(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 px-1">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500 mt-2 text-base">Manage system users and permissions</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="btn btn-primary"
                >
                    + Add User
                </button>
            </div>

            {/* Users Table */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>
                                    <div>
                                        <p className="font-semibold text-slate-900">{user.fullName}</p>
                                        <p className="text-xs text-slate-500">@{user.username}</p>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.role === 'admin' ? 'badge-info' : 'badge-success'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => toggleUserStatus(user)}
                                        className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}
                                        disabled={user._id === currentUser.id}
                                    >
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="text-slate-600">
                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="btn btn-sm btn-ghost"
                                            disabled={user._id === currentUser.id && user.role === 'admin'}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50"
                                            disabled={user._id === currentUser.id}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit User Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Full Name</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Username</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            required
                                            disabled={editingUser}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Email</label>
                                    <input
                                        type="email"
                                        className="input"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                {!editingUser && (
                                    <div>
                                        <label className="label">Password</label>
                                        <input
                                            type="password"
                                            className="input"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required={!editingUser}
                                            minLength={6}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="label">Role</label>
                                    <select
                                        className="input"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="cashier">Cashier</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
