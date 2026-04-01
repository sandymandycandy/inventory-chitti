import { useState, useEffect } from 'react';
import { customersAPI } from '../services/api';

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        notes: ''
    });

    useEffect(() => {
        fetchCustomers();
    }, [searchTerm]);

    const fetchCustomers = async () => {
        try {
            const response = await customersAPI.getAll({ search: searchTerm });
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                await customersAPI.update(editingCustomer._id, formData);
            } else {
                await customersAPI.create(formData);
            }
            setShowModal(false);
            resetForm();
            fetchCustomers();
        } catch (error) {
            console.error('Error saving customer:', error);
            alert(error.response?.data?.error || 'Error saving customer');
        }
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name,
            phone: customer.phone,
            email: customer.email || '',
            notes: customer.notes || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await customersAPI.delete(id);
                fetchCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            notes: ''
        });
        setEditingCustomer(null);
    };

    const getTierColor = () => {
        // All tiers use Win2000 badge style
        return '';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="win-window p-4 text-center text-sm">
                    <div className="mb-2">Please wait...</div>
                    <div className="win-panel-sunken p-1 text-xs">Loading customers</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark-900 mb-1">Customer Management</h1>
                    <p className="text-gray-600">Manage customer profiles and loyalty points</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="btn btn-primary shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Customer
                </button>
            </div>

            {/* Search and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 card p-6">
                    <label className="label">Search Customers</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, phone, or email..."
                            className="input pl-10"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="win-window p-3">
                    <div className="win-titlebar text-xs mb-2">Total Customers</div>
                    <p className="text-3xl font-bold text-center py-2">{customers.length}</p>
                </div>
            </div>

            {/* Customers List */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Contact</th>
                                <th>Loyalty Tier</th>
                                <th>Points Balance</th>
                                <th>Total Spent</th>
                                <th>Last Visit</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                        No customers found. Add your first customer!
                                    </td>
                                </tr>
                            ) : (
                                customers.map(customer => (
                                    <tr key={customer._id}>
                                        <td>
                                            <div>
                                                <p className="font-semibold text-dark-900">{customer.name}</p>
                                                {customer.email && <p className="text-xs text-gray-500">{customer.email}</p>}
                                            </div>
                                        </td>
                                        <td className="text-dark-700">{customer.phone}</td>
                                        <td>
                                            <span className="badge">
                                                {customer.tier || 'Regular'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                <span className="font-bold text-primary-600">{customer.loyaltyPoints}</span>
                                                <span className="text-xs text-gray-500">pts</span>
                                            </div>
                                        </td>
                                        <td className="font-medium">₹{customer.totalSpent?.toLocaleString()}</td>
                                        <td className="text-gray-600 text-sm">
                                            {customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(customer)}
                                                    className="btn btn-sm btn-secondary"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer._id)}
                                                    className="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="text-xl font-bold text-dark-900">
                                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-body space-y-4">
                            <div>
                                <label className="label">Full Name*</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Phone Number*</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input"
                                        placeholder="9876543210"
                                    />
                                </div>
                                <div>
                                    <label className="label">Email (Optional)</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="input h-24 resize-none"
                                    placeholder="Customer preferences, allergies, etc."
                                ></textarea>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingCustomer ? 'Update Customer' : 'Add Customer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Customers;
