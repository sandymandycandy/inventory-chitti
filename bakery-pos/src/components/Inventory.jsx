import { useState, useEffect } from 'react';
import { ingredientsAPI } from '../services/api';

function Inventory() {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        currentStock: '',
        unit: 'kg',
        costPerUnit: '',
        minStockAlert: ''
    });

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            const response = await ingredientsAPI.getAll();
            setIngredients(response.data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                currentStock: parseFloat(formData.currentStock),
                costPerUnit: parseFloat(formData.costPerUnit),
                minStockAlert: parseFloat(formData.minStockAlert || 0)
            };

            if (editingIngredient) {
                await ingredientsAPI.update(editingIngredient._id, data);
            } else {
                await ingredientsAPI.create(data);
            }

            setShowModal(false);
            resetForm();
            fetchIngredients();
        } catch (error) {
            console.error('Error saving ingredient:', error);
            alert(error.response?.data?.error || 'Error saving ingredient');
        }
    };

    const handleEdit = (ingredient) => {
        setEditingIngredient(ingredient);
        setFormData({
            name: ingredient.name,
            currentStock: ingredient.currentStock,
            unit: ingredient.unit,
            costPerUnit: ingredient.costPerUnit,
            minStockAlert: ingredient.minStockAlert
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this ingredient?')) {
            try {
                await ingredientsAPI.delete(id);
                fetchIngredients();
            } catch (error) {
                console.error('Error deleting ingredient:', error);
            }
        }
    };

    const handleUpdateStock = async (id, quantity, operation) => {
        try {
            await ingredientsAPI.updateStock(id, quantity, operation);
            fetchIngredients();
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            currentStock: '',
            unit: 'kg',
            costPerUnit: '',
            minStockAlert: ''
        });
        setEditingIngredient(null);
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toFixed(2)}`;
    };

    const getStockStatus = (ingredient) => {
        if (ingredient.currentStock === 0) return 'out';
        if (ingredient.currentStock <= ingredient.minStockAlert) return 'low';
        return 'good';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="win-window p-4 text-center text-sm">
                    <div className="mb-2">Please wait...</div>
                    <div className="win-panel-sunken p-1 text-xs">Loading inventory</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark-900 mb-1">Inventory Management</h1>
                    <p className="text-gray-600">Track and manage your ingredient stock</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="btn btn-primary"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Ingredient
                </button>
            </div>

            {/* Inventory Table */}
            {ingredients.length === 0 ? (
                <div className="card p-8 text-center">
                    <div className="win-panel-sunken w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-bold mb-1">No Ingredients Yet</h3>
                    <p className="text-xs mb-4">Add your first ingredient to start tracking inventory</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        Add First Ingredient
                    </button>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Ingredient</th>
                                    <th>Current Stock</th>
                                    <th>Unit</th>
                                    <th>Cost/Unit</th>
                                    <th>Total Value</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ingredients.map(ingredient => {
                                    const status = getStockStatus(ingredient);
                                    const totalValue = ingredient.currentStock * ingredient.costPerUnit;

                                    return (
                                        <tr key={ingredient._id}>
                                            <td className="font-semibold text-dark-900">{ingredient.name}</td>
                                            <td className="font-medium">{ingredient.currentStock}</td>
                                            <td className="text-gray-600">{ingredient.unit}</td>
                                            <td>{formatCurrency(ingredient.costPerUnit)}</td>
                                            <td className="font-semibold text-dark-900">{formatCurrency(totalValue)}</td>
                                            <td>
                                                <span className={`badge ${status === 'good' ? 'badge-success' :
                                                        status === 'low' ? 'badge-warning' :
                                                            'badge-danger'
                                                    }`}>
                                                    {status === 'good' ? 'In Stock' :
                                                        status === 'low' ? 'Low Stock' :
                                                            'Out of Stock'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(ingredient)}
                                                        className="btn btn-sm btn-secondary"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(ingredient._id)}
                                                        className="btn btn-sm bg-red-100 text-red-700 hover:bg-red-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="text-xl font-bold text-dark-900">
                                {editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="space-y-4">
                                <div>
                                    <label className="label">Ingredient Name*</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input"
                                        required
                                        placeholder="e.g., All Purpose Flour"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Initial Stock*</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.currentStock}
                                            onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                                            className="input"
                                            required
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Unit*</label>
                                        <select
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            className="input"
                                        >
                                            <option value="kg">Kilograms (kg)</option>
                                            <option value="g">Grams (g)</option>
                                            <option value="L">Liters (L)</option>
                                            <option value="ml">Milliliters (ml)</option>
                                            <option value="pieces">Pieces</option>
                                            <option value="dozen">Dozen</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Cost per Unit (₹)*</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.costPerUnit}
                                            onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                                            className="input"
                                            required
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Min Stock Alert</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.minStockAlert}
                                            onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                                            className="input"
                                            placeholder="10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingIngredient ? 'Update Ingredient' : 'Add Ingredient'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Inventory;
