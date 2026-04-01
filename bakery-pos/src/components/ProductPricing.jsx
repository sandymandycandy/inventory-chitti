import { useState, useEffect } from 'react';
import { recipesAPI } from '../services/api';

function ProductPricing() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        category: 'Cakes',
        sellingPrice: '',
        productionCost: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await recipesAPI.getAll();
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateProfit = (selling, cost) => {
        const profit = (parseFloat(selling) || 0) - (parseFloat(cost) || 0);
        const percentage = selling > 0 ? ((profit / parseFloat(selling)) * 100) : 0;
        return { amount: profit, percentage };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                name: formData.name,
                category: formData.category,
                sellingPrice: parseFloat(formData.sellingPrice),
                ingredients: editingProduct?.ingredients || []
            };
            // Production cost will be auto-calculated from ingredients

            if (editingProduct) {
                await recipesAPI.update(editingProduct._id, productData);
            } else {
                await recipesAPI.create(productData);
            }

            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert(error.response?.data?.error || 'Error saving product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            sellingPrice: product.sellingPrice,
            productionCost: product.productionCost || 0
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await recipesAPI.delete(id);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'Cakes',
            sellingPrice: '',
            productionCost: ''
        });
        setEditingProduct(null);
    };

    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount || 0).toFixed(2)}`;
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate overall statistics
    const totalProducts = products.length;
    const profitableProducts = products.filter(p => (p.sellingPrice - (p.productionCost || 0)) > 0).length;
    const averageMargin = products.length > 0 
        ? products.reduce((sum, p) => {
            const margin = p.sellingPrice > 0 ? (((p.sellingPrice - (p.productionCost || 0)) / p.sellingPrice) * 100) : 0;
            return sum + margin;
        }, 0) / products.length 
        : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark-900 mb-1">Product Pricing</h1>
                    <p className="text-gray-600">Manage production costs and selling prices</p>
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
                    Add Product
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 bg-gradient-to-br from-sky-50 to-blue-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Products</p>
                            <p className="text-3xl font-bold text-primary-600">{totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Profitable Products</p>
                            <p className="text-3xl font-bold text-green-600">{profitableProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-amber-50 to-yellow-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Avg Profit Margin</p>
                            <p className="text-3xl font-bold text-amber-600">{averageMargin.toFixed(1)}%</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="card p-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input pl-10 w-full"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Products Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th className="text-right">Production Cost</th>
                                <th className="text-right">Selling Price</th>
                                <th className="text-right">Profit/Loss</th>
                                <th className="text-right">Margin %</th>
                                <th className="text-center">Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-12">
                                        <div className="text-gray-400">
                                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <p className="text-lg font-semibold">No products found</p>
                                            <p className="text-sm">Add your first product to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const profit = calculateProfit(product.sellingPrice, product.productionCost);
                                    const isProfit = profit.amount >= 0;

                                    return (
                                        <tr key={product._id}>
                                            <td>
                                                <div className="font-semibold text-dark-900">{product.name}</div>
                                            </td>
                                            <td>
                                                <span className="badge badge-info">{product.category}</span>
                                            </td>
                                            <td className="text-right font-medium">{formatCurrency(product.productionCost || 0)}</td>
                                            <td className="text-right font-medium text-primary-600">{formatCurrency(product.sellingPrice)}</td>
                                            <td className="text-right">
                                                <span className={`font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                                                    {isProfit ? '+' : ''}{formatCurrency(profit.amount)}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <span className={`font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                                                    {profit.percentage.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                {isProfit ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        Profitable
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                        </svg>
                                                        Loss
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleEdit(product)} className="btn btn-sm btn-secondary">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(product._id)} className="btn btn-sm bg-red-100 text-red-700 hover:bg-red-200">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="text-xl font-bold text-dark-900">
                                {editingProduct ? 'Edit Product Pricing' : 'Add New Product'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="space-y-5">
                                {/* Product Name */}
                                <div>
                                    <label className="label">Product Name*</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input"
                                        required
                                        placeholder="e.g., Chocolate Cake"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="label">Category*</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input"
                                    >
                                        <option>Cakes</option>
                                        <option>Pastries</option>
                                        <option>Breads</option>
                                        <option>Cookies</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                {/* Cost & Price Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Production Cost* (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.productionCost}
                                            onChange={(e) => setFormData({ ...formData, productionCost: e.target.value })}
                                            className="input"
                                            required
                                            placeholder="0.00"
                                        />
                                        <p className="text-xs text-blue-600 mt-1">ℹ️ Auto-calculated from ingredients in Recipes tab</p>
                                    </div>

                                    <div>
                                        <label className="label">Selling Price* (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.sellingPrice}
                                            onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                                            className="input"
                                            required
                                            placeholder="0.00"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Price charged to customers</p>
                                    </div>
                                </div>

                                {/* Profit Preview */}
                                <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-6 border-2 border-primary-200">
                                    <h3 className="font-bold text-dark-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        Profit Analysis
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Profit/Loss Amount</p>
                                            <p className={`text-3xl font-bold ${
                                                calculateProfit(formData.sellingPrice, formData.productionCost).amount >= 0 
                                                    ? 'text-green-600' 
                                                    : 'text-red-600'
                                            }`}>
                                                {formatCurrency(calculateProfit(formData.sellingPrice, formData.productionCost).amount)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Profit Margin</p>
                                            <p className={`text-3xl font-bold ${
                                                calculateProfit(formData.sellingPrice, formData.productionCost).percentage >= 0 
                                                    ? 'text-green-600' 
                                                    : 'text-red-600'
                                            }`}>
                                                {calculateProfit(formData.sellingPrice, formData.productionCost).percentage.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                    {calculateProfit(formData.sellingPrice, formData.productionCost).amount < 0 && (
                                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-700 flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                Warning: This product will result in a loss!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductPricing;
