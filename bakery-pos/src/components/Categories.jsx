import { useState, useEffect } from 'react';
import { categoriesAPI, recipesAPI } from '../services/api';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: '📦',
        color: '#3B82F6'
    });

    const iconOptions = ['🍰', '🥐', '🍞', '🍪', '🧁', '🥧', '🍩', '🥨', '🥖', '🍮', '🎂', '📦', '🥯', '🧇', '🥞', '🍨', '🍦', '🥤'];
    const colorOptions = [
        { name: 'Sky Blue', value: '#0EA5E9', gradient: 'from-sky-400 to-sky-600' },
        { name: 'Emerald', value: '#10B981', gradient: 'from-emerald-400 to-emerald-600' },
        { name: 'Purple', value: '#8B5CF6', gradient: 'from-purple-400 to-purple-600' },
        { name: 'Rose', value: '#F43F5E', gradient: 'from-rose-400 to-rose-600' },
        { name: 'Orange', value: '#F97316', gradient: 'from-orange-400 to-orange-600' },
        { name: 'Amber', value: '#F59E0B', gradient: 'from-amber-400 to-amber-600' },
        { name: 'Indigo', value: '#6366F1', gradient: 'from-indigo-400 to-indigo-600' },
        { name: 'Teal', value: '#14B8A6', gradient: 'from-teal-400 to-teal-600' }
    ];

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const [categoriesRes, recipesRes] = await Promise.all([
                categoriesAPI.getAll(),
                recipesAPI.getAll()
            ]);
            setCategories(categoriesRes.data);
            setRecipes(recipesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await categoriesAPI.update(editingCategory._id, formData);
            } else {
                await categoriesAPI.create(formData);
            }
            fetchCategories();
            resetForm();
            setShowModal(false);
        } catch (error) {
            alert(error.response?.data?.error || 'Error saving category');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            icon: category.icon || '📦',
            color: category.color || '#3B82F6'
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoriesAPI.delete(id);
                fetchCategories();
            } catch (error) {
                alert(error.response?.data?.message || error.response?.data?.error || 'Error deleting category');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            icon: '📦',
            color: '#3B82F6'
        });
        setEditingCategory(null);
    };

    const getCategoryStats = (categoryName) => {
        const categoryRecipes = recipes.filter(r => r.category === categoryName);
        const totalValue = categoryRecipes.reduce((sum, r) => sum + (r.sellingPrice || 0), 0);
        return {
            count: categoryRecipes.length,
            totalValue,
            avgPrice: categoryRecipes.length > 0 ? totalValue / categoryRecipes.length : 0
        };
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with Stats */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-dark-900 mb-1">Categories</h1>
                        <p className="text-gray-600">Organize and manage your product categories</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Category
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="card p-4 bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-sky-700">Total Categories</p>
                                <p className="text-2xl font-bold text-sky-900 mt-1">{categories.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-sky-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-700">Total Products</p>
                                <p className="text-2xl font-bold text-emerald-900 mt-1">{recipes.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">Avg per Category</p>
                                <p className="text-2xl font-bold text-purple-900 mt-1">
                                    {categories.length > 0 ? (recipes.length / categories.length).toFixed(1) : 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-700">Active Items</p>
                                <p className="text-2xl font-bold text-amber-900 mt-1">
                                    {recipes.filter(r => r.isActive !== false).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-amber-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and View Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10 w-full"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'grid'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Section - Categories with Product Images */}
            {categories.length > 0 && !searchTerm && (
                <div className="space-y-6">
                    {filteredCategories.map(category => {
                        const categoryItems = recipes.filter(r => r.category === category.name);
                        
                        return (
                            <div key={category._id} className="card p-6 overflow-hidden">
                                {/* Category Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
                                            style={{ 
                                                background: `linear-gradient(135deg, ${category.color}40, ${category.color}20)`,
                                                borderLeft: `4px solid ${category.color}`
                                            }}
                                        >
                                            {category.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h2 className="text-2xl font-bold text-dark-900">{category.name}</h2>
                                                <span
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                ></span>
                                            </div>
                                            {category.description && (
                                                <p className="text-gray-600">{category.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Items</p>
                                            <p className="text-2xl font-bold text-dark-900">{categoryItems.length}</p>
                                        </div>
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="btn btn-sm btn-secondary"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Products Grid with Images */}
                                {categoryItems.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {categoryItems.map(item => (
                                            <div 
                                                key={item._id}
                                                className="group relative bg-white rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-all overflow-hidden hover:shadow-lg cursor-pointer"
                                            >
                                                {/* Product Image */}
                                                <div className="aspect-square relative overflow-hidden bg-gray-100">
                                                    {item.imageUrl ? (
                                                        <img 
                                                            src={item.imageUrl} 
                                                            alt={item.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-6xl">
                                                            🍽️
                                                        </div>
                                                    )}
                                                    {/* Overlay on hover */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                                            <p className="text-xs font-medium mb-1">₹{item.sellingPrice}</p>
                                                            {item.productionCost > 0 && (
                                                                <p className="text-xs opacity-90">
                                                                    Profit: ₹{(item.sellingPrice - item.productionCost).toFixed(0)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Product Info */}
                                                <div className="p-3">
                                                    <h3 className="font-semibold text-sm text-dark-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-lg font-bold text-primary-600">
                                                            ₹{item.sellingPrice}
                                                        </span>
                                                        {item.totalSold > 0 && (
                                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                                {item.totalSold} sold
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Active/Inactive Badge */}
                                                {item.isActive === false && (
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                        Inactive
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Items Yet</h3>
                                        <p className="text-sm text-gray-500 mb-4">This category doesn't have any recipes yet.</p>
                                        <p className="text-xs text-gray-400">Go to Recipes to add items to this category</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Categories Grid/List - Only shown when searching */}
            {searchTerm && filteredCategories.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-dark-900 mb-2">No Categories Found</h3>
                    <p className="text-gray-600 mb-6">
                        No categories match "{searchTerm}". Try a different search term.
                    </p>
                </div>
            ) : searchTerm && viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCategories.map(category => {
                        const stats = getCategoryStats(category.name);
                        return (
                            <div key={category._id} className="card p-6 card-hover group relative overflow-hidden">
                                {/* Background Decoration */}
                                <div 
                                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"
                                    style={{ backgroundColor: category.color }}
                                ></div>

                                <div className="relative">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                                            style={{ 
                                                background: `linear-gradient(135deg, ${category.color}40, ${category.color}20)`,
                                                borderLeft: `4px solid ${category.color}`
                                            }}
                                        >
                                            {category.icon}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full shadow-sm"
                                                style={{ backgroundColor: category.color }}
                                            ></span>
                                        </div>
                                    </div>

                                    {/* Category Info */}
                                    <h3 className="text-lg font-bold text-dark-900 mb-2 group-hover:text-primary-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    {category.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                                            {category.description}
                                        </p>
                                    )}

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 mb-1">Items</p>
                                            <p className="text-lg font-bold text-dark-900">{stats.count}</p>
                                        </div>
                                        <div className="text-center border-l border-r border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Avg Price</p>
                                            <p className="text-lg font-bold text-dark-900">₹{stats.avgPrice.toFixed(0)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 mb-1">Value</p>
                                            <p className="text-lg font-bold text-dark-900">₹{stats.totalValue.toFixed(0)}</p>
                                        </div>
                                    </div>

                                    {/* Products Preview */}
                                    {stats.count > 0 ? (
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {recipes.filter(r => r.category === category.name).slice(0, 3).map(recipe => (
                                                    <span
                                                        key={recipe._id}
                                                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white border border-gray-200 text-gray-700 hover:border-primary-300 transition-colors"
                                                    >
                                                        {recipe.imageUrl ? (
                                                            <img src={recipe.imageUrl} alt={recipe.name} className="w-4 h-4 rounded-full mr-1 object-cover" />
                                                        ) : (
                                                            <span className="mr-1 text-sm">🍽️</span>
                                                        )}
                                                        {recipe.name.length > 12 ? recipe.name.substring(0, 12) + '...' : recipe.name}
                                                    </span>
                                                ))}
                                                {stats.count > 3 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700">
                                                        +{stats.count - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-xs text-yellow-700 text-center font-medium">No items yet</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="btn btn-sm btn-secondary flex-1 group/edit"
                                        >
                                            <svg className="w-4 h-4 mr-1 group-hover/edit:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 group/delete"
                                        >
                                            <svg className="w-4 h-4 group-hover/delete:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : searchTerm && viewMode === 'list' ? (
                <div className="space-y-3">
                    {filteredCategories.map(category => {
                        const stats = getCategoryStats(category.name);
                        return (
                            <div key={category._id} className="card p-5 card-hover group">
                                <div className="flex items-center gap-4">
                                    {/* Icon */}
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${category.color}40, ${category.color}20)`,
                                            borderLeft: `4px solid ${category.color}`
                                        }}
                                    >
                                        {category.icon}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-dark-900 group-hover:text-primary-600 transition-colors">
                                                {category.name}
                                            </h3>
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: category.color }}
                                            ></span>
                                        </div>
                                        {category.description && (
                                            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-1.5">
                                            {recipes.filter(r => r.category === category.name).slice(0, 5).map(recipe => (
                                                <span
                                                    key={recipe._id}
                                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                                                >
                                                    {recipe.imageUrl ? (
                                                        <img src={recipe.imageUrl} alt={recipe.name} className="w-3 h-3 rounded-full mr-1 object-cover" />
                                                    ) : (
                                                        <span className="mr-1">🍽️</span>
                                                    )}
                                                    {recipe.name}
                                                </span>
                                            ))}
                                            {stats.count > 5 && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700">
                                                    +{stats.count - 5}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="hidden lg:flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Items</p>
                                            <p className="text-lg font-bold text-dark-900">{stats.count}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Avg Price</p>
                                            <p className="text-lg font-bold text-dark-900">₹{stats.avgPrice.toFixed(0)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Total Value</p>
                                            <p className="text-lg font-bold text-dark-900">₹{stats.totalValue.toFixed(0)}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="btn btn-sm btn-secondary"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-dark-900">
                                {editingCategory ? 'Edit Category' : 'Create New Category'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="label">Category Name*</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input"
                                        required
                                        placeholder="e.g., Cakes, Pastries"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="label">Description (Optional)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input"
                                        rows={3}
                                        placeholder="Brief description of this category"
                                    />
                                </div>

                                {/* Icon Selection */}
                                <div>
                                    <label className="label">Icon</label>
                                    <div className="grid grid-cols-9 gap-2">
                                        {iconOptions.map(icon => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon })}
                                                className={`p-3 text-2xl rounded-xl border-2 transition-all hover:scale-110 ${formData.icon === icon
                                                    ? 'border-primary-500 bg-primary-50 shadow-md scale-105'
                                                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color Selection */}
                                <div>
                                    <label className="label">Theme Color</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {colorOptions.map(colorOption => (
                                            <button
                                                key={colorOption.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color: colorOption.value })}
                                                className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 group ${formData.color === colorOption.value
                                                    ? 'border-dark-900 shadow-lg scale-105'
                                                    : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                                                    }`}
                                            >
                                                <span
                                                    className={`w-8 h-8 rounded-lg shadow-sm bg-gradient-to-br ${colorOption.gradient} group-hover:scale-110 transition-transform`}
                                                ></span>
                                                <span className="text-sm font-semibold text-dark-900">{colorOption.name}</span>
                                                {formData.color === colorOption.value && (
                                                    <svg className="w-5 h-5 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Enhanced Preview */}
                                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                                    <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Live Preview
                                    </p>
                                    <div className="bg-white p-4 rounded-lg shadow-md">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
                                                style={{ 
                                                    background: `linear-gradient(135deg, ${formData.color}40, ${formData.color}20)`,
                                                    borderLeft: `4px solid ${formData.color}`
                                                }}
                                            >
                                                {formData.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-bold text-lg text-dark-900">{formData.name || 'Category Name'}</p>
                                                    <span
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: formData.color }}
                                                    ></span>
                                                </div>
                                                <p className="text-sm text-gray-600">{formData.description || 'Category description will appear here'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="modal-footer sticky bottom-0 bg-white z-10 border-t border-gray-200">
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
                            <button
                                onClick={handleSubmit}
                                className="btn btn-primary"
                            >
                                {editingCategory ? 'Update Category' : 'Create Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Categories;
