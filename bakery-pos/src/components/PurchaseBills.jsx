import { useState, useEffect } from 'react';
import { purchaseBillsAPI, ingredientsAPI } from '../services/api';

function PurchaseBills() {
    const [bills, setBills] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [cart, setCart] = useState([]);
    const [stats, setStats] = useState(null);

    const [formData, setFormData] = useState({
        supplierName: '',
        supplierPhone: '',
        supplierAddress: '',
        paymentStatus: 'Pending',
        paymentMethod: 'Cash',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [billsRes, ingredientsRes, statsRes] = await Promise.all([
                purchaseBillsAPI.getAll(),
                ingredientsAPI.getAll(),
                purchaseBillsAPI.getStats()
            ]);
            setBills(billsRes.data);
            setIngredients(ingredientsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (ingredient) => {
        const existing = cart.find(item => item.ingredientId === ingredient._id);
        if (existing) {
            setCart(cart.map(item =>
                item.ingredientId === ingredient._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                ingredientId: ingredient._id,
                name: ingredient.name,
                unit: ingredient.unit,
                purchaseUnit: ingredient.unit, // Unit for this purchase (can be changed)
                quantity: 1,
                pricePerUnit: 0
            }]);
        }
    };

    const updateCartItem = (ingredientId, field, value) => {
        setCart(cart.map(item =>
            item.ingredientId === ingredientId
                ? { ...item, [field]: parseFloat(value) || 0 }
                : item
        ));
    };

    const removeFromCart = (ingredientId) => {
        setCart(cart.filter(item => item.ingredientId !== ingredientId));
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Please add at least one ingredient');
            return;
        }

        try {
            const billData = {
                ...formData,
                updateStock: true, // Always update stock automatically
                items: cart.map(item => ({
                    ingredientId: item.ingredientId,
                    quantity: item.quantity,
                    pricePerUnit: item.pricePerUnit,
                    purchaseUnit: item.purchaseUnit || item.unit
                }))
            };

            await purchaseBillsAPI.create(billData);
            fetchData();
            resetForm();
            setShowModal(false);
            alert('Purchase bill created successfully!');
        } catch (error) {
            alert(error.response?.data?.error || 'Error creating purchase bill');
        }
    };

    const handleUpdateStock = async (id) => {
        if (window.confirm('Update inventory stock from this purchase bill?')) {
            try {
                await purchaseBillsAPI.updateStock(id);
                fetchData();
                alert('Stock updated successfully!');
            } catch (error) {
                alert(error.response?.data?.error || 'Error updating stock');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this purchase bill?')) {
            try {
                await purchaseBillsAPI.delete(id);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || error.response?.data?.error || 'Error deleting bill');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            supplierName: '',
            supplierPhone: '',
            supplierAddress: '',
            paymentStatus: 'Pending',
            paymentMethod: 'Cash',
            notes: ''
        });
        setCart([]);
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="win-window p-4 text-center text-sm">
                    <div className="mb-2">Please wait...</div>
                    <div className="win-panel-sunken p-1 text-xs">Loading purchase bills</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark-900 mb-1">Purchase Bills</h1>
                    <p className="text-gray-600">Manage ingredient purchases from suppliers</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Purchase
                </button>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="stat-card">
                        <p className="text-sm text-gray-600 mb-1">Total Bills</p>
                        <p className="text-3xl font-bold text-dark-900">{stats.totalBills}</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm text-gray-600 mb-1">Total Expense</p>
                        <p className="text-3xl font-bold text-primary-600">{formatCurrency(stats.totalExpense)}</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm text-gray-600 mb-1">Pending Bills</p>
                        <p className="text-3xl font-bold text-amber-600">{stats.pendingBills}</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm text-gray-600 mb-1">Pending Amount</p>
                        <p className="text-3xl font-bold text-red-600">{formatCurrency(stats.pendingAmount)}</p>
                    </div>
                </div>
            )}

            {/* Bills List */}
            {bills.length === 0 ? (
                <div className="card p-8 text-center">
                    <div className="win-panel-sunken w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-bold mb-1">No Purchase Bills Yet</h3>
                    <p className="text-xs mb-4">Record your first ingredient purchase</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        Create First Purchase Bill
                    </button>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Bill #</th>
                                    <th>Date</th>
                                    <th>Supplier</th>
                                    <th>Items</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map(bill => (
                                    <tr key={bill._id}>
                                        <td className="font-semibold">{bill.billNumber}</td>
                                        <td>{formatDate(bill.purchaseDate)}</td>
                                        <td>
                                            <div>
                                                <p className="font-medium">{bill.supplierName}</p>
                                                {bill.supplierPhone && (
                                                    <p className="text-xs text-gray-600">{bill.supplierPhone}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td>{bill.items.length} items</td>
                                        <td className="font-bold">{formatCurrency(bill.total)}</td>
                                        <td>
                                            <span className={`badge ${bill.paymentStatus === 'Paid' ? 'badge-success' :
                                                bill.paymentStatus === 'Partial' ? 'badge-warning' :
                                                    'badge-danger'
                                                }`}>
                                                {bill.paymentStatus}
                                            </span>
                                        </td>
                                        <td>
                                            {bill.stockUpdated ? (
                                                <span className="badge badge-success">Updated</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleUpdateStock(bill._id)}
                                                    className="btn btn-sm btn-secondary"
                                                >
                                                    Update Stock
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(bill._id)}
                                                className="btn btn-sm bg-red-100 text-red-700 hover:bg-red-200"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content max-w-4xl" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="text-xl font-bold text-dark-900">New Purchase Bill</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left: Ingredients */}
                                <div>
                                    <h3 className="font-semibold text-dark-900 mb-3">Select Ingredients</h3>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {ingredients.map(ingredient => (
                                            <div
                                                key={ingredient._id}
                                                className="win-panel-raised p-2 cursor-pointer hover:bg-[#000080] hover:text-white text-xs"
                                                onClick={() => addToCart(ingredient)}
                                            >
                                                <p className="font-bold">{ingredient.name}</p>
                                                <p>Current: {ingredient.currentStock} {ingredient.unit}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Cart & Details */}
                                <div className="space-y-4">
                                    {/* Supplier Info */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-dark-900">Supplier Details</h3>
                                        <input
                                            type="text"
                                            placeholder="Supplier Name*"
                                            value={formData.supplierName}
                                            onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                                            className="input"
                                            required
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone"
                                            value={formData.supplierPhone}
                                            onChange={(e) => setFormData({ ...formData, supplierPhone: e.target.value })}
                                            className="input"
                                        />
                                    </div>

                                    {/* Cart */}
                                    <div>
                                        <h3 className="font-semibold text-dark-900 mb-3">Cart ({cart.length} items)</h3>
                                        {cart.length === 0 ? (
                                            <p className="text-gray-500 text-sm">No items added</p>
                                        ) : (
                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {cart.map(item => (
                                                    <div key={item.ingredientId} className="p-2 bg-gray-50 rounded text-sm">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-medium">{item.name}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFromCart(item.ingredientId)}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div>
                                                                <label className="text-xs text-gray-600 mb-1 block">Qty/Weight*</label>
                                                                <input
                                                                    type="number"
                                                                    placeholder={`e.g., 50`}
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateCartItem(item.ingredientId, 'quantity', e.target.value)}
                                                                    className="input text-sm"
                                                                    min="0"
                                                                    step="0.01"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-600 mb-1 block">Unit*</label>
                                                                <select
                                                                    value={item.purchaseUnit || item.unit}
                                                                    onChange={(e) => updateCartItem(item.ingredientId, 'purchaseUnit', e.target.value)}
                                                                    className="input text-sm"
                                                                >
                                                                    <option value="KG">KG</option>
                                                                    <option value="G">G</option>
                                                                    <option value="L">L</option>
                                                                    <option value="ML">ML</option>
                                                                    <option value="PCS">PCS</option>
                                                                    <option value="BOX">BOX</option>
                                                                    <option value="PACK">PACK</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-600 mb-1 block">Price/{item.purchaseUnit || item.unit}*</label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="₹0"
                                                                    value={item.pricePerUnit}
                                                                    onChange={(e) => updateCartItem(item.ingredientId, 'pricePerUnit', e.target.value)}
                                                                    className="input text-sm"
                                                                    min="0"
                                                                    step="0.01"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between text-xs mt-2 pt-2 border-t border-gray-200">
                                                            <span className="text-gray-600">Item Total:</span>
                                                            <span className="font-bold">{formatCurrency(item.quantity * item.pricePerUnit)}</span>
                                                        </div>
                                                        {item.purchaseUnit !== item.unit && (
                                                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                                Purchasing in {item.purchaseUnit}, stored as {item.unit}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Summary */}
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total:</span>
                                            <span className="text-primary-600">{formatCurrency(calculateSubtotal())}</span>
                                        </div>
                                    </div>

                                    {/* Payment */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <select
                                            value={formData.paymentStatus}
                                            onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                                            className="input"
                                        >
                                            <option>Pending</option>
                                            <option>Paid</option>
                                            <option>Partial</option>
                                        </select>
                                        <select
                                            value={formData.paymentMethod}
                                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                            className="input"
                                        >
                                            <option>Cash</option>
                                            <option>Card</option>
                                            <option>UPI</option>
                                            <option>Bank Transfer</option>
                                            <option>Cheque</option>
                                            <option>Credit</option>
                                        </select>
                                    </div>

                                    {/* Info Message */}
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-xs text-blue-700">
                                            ℹ️ Inventory stock will be updated automatically when you create this bill.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="modal-footer">
                            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} className="btn btn-primary">
                                Create Purchase Bill
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PurchaseBills;
