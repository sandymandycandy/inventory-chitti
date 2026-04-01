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
            <div className="flex items-center justify-center min-h-64">
                <div className="win-window p-4 text-center text-sm">
                    <div className="mb-2">Please wait...</div>
                    <div className="win-panel-sunken p-1 text-xs">Loading categories</div>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="stat-card">
                        <p className="text-xs mb-1">Total Categories</p>
                        <p className="text-2xl font-bold">{categories.length}</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-xs mb-1">Total Products</p>
                        <p className="text-2xl font-bold">{recipes.length}</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-xs mb-1">Avg per Category</p>
                        <p className="text-2xl font-bold">
                            {categories.length > 0 ? (recipes.length / categories.length).toFixed(1) : 0}
                        </p>
                    </div>
                    <div className="stat-card">
                        <p className="text-xs mb-1">Active Items</p>
                        <p className="text-2xl font-bold">
                            {recipes.filter(r => r.isActive !== false).length}
                        </p>
                    </div>
                </div>

                {/* Search and View Controls */}
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input max-w-xs"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="btn btn-sm">Clear</button>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : ''}`}
                        >Grid</button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : ''}`}
                        >List</button>
                    </div>
                </div>
            </div>

            {/* Hero Section - Categories with Product Images */}
            {categories.length > 0 && !searchTerm && (
                <div className="space-y-6">
                    {filteredCategories.map(category => {
                        const categoryItems = recipes.filter(r => r.category === category.name);
                        
                        return (
                            <div key={category._id} className="win-window p-0">
                                {/* Category Titlebar */}
                                <div className="win-titlebar justify-between">
                                    <span>{category.icon} {category.name} ({categoryItems.length} items)</span>
                                    <div className="flex items-center gap-1">
                                        {category.description && (
                                            <span className="text-xs opacity-80 mr-2">{category.description}</span>
                                        )}
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="win-title-btn text-[9px]"
                                            title="Edit"
                                        >
                                            E
                                        </button>
                                    </div>
                                </div>

                                {/* Products Grid */}
                                <div className="p-3 bg-[#d4d0c8]">
                                {categoryItems.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                        {categoryItems.map(item => (
                                            <div 
                                                key={item._id}
                                                className="win-panel-raised overflow-hidden cursor-pointer hover:bg-[#000080] group"
                                            >
                                                {/* Product Image */}
                                                <div className="aspect-square win-panel-sunken overflow-hidden">
                                                    {item.imageUrl ? (
                                                        <img 
                                                            src={item.imageUrl} 
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-[#d4d0c8] text-3xl">
                                                            🍽️
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Product Info */}
                                                <div className="p-1">
                                                    <p className="font-bold text-xs truncate group-hover:text-white">{item.name}</p>
                                                    <p className="text-xs group-hover:text-white">₹{item.sellingPrice}</p>
                                                    {item.totalSold > 0 && (
                                                        <p className="text-xs group-hover:text-white">{item.totalSold} sold</p>
                                                    )}
                                                </div>
                                                {item.isActive === false && (
                                                    <div className="badge badge-danger text-[10px] m-1">Inactive</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="win-panel-sunken p-6 text-center text-xs">
                                        <p className="font-bold mb-1">No Items Yet</p>
                                        <p>Go to Recipes to add items to this category</p>
                                    </div>
                                )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Categories Search Results */}
            {searchTerm && filteredCategories.length === 0 ? (
                <div className="card p-8 text-center text-xs">
                    <h3 className="font-bold mb-1">No Categories Found</h3>
                    <p>No categories match &quot;{searchTerm}&quot;. Try a different search term.</p>
                </div>
            ) : searchTerm ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-4 gap-3' : 'space-y-2'}>
                    {filteredCategories.map(category => {
                        const stats = getCategoryStats(category.name);
                        return viewMode === 'grid' ? (
                            <div key={category._id} className="win-window p-0">
                                <div className="win-titlebar text-xs">{category.icon} {category.name}</div>
                                <div className="p-3 bg-[#d4d0c8]">
                                    {category.description && <p className="text-xs mb-2">{category.description}</p>}
                                    <div className="win-panel-sunken p-2 mb-2">
                                        <div className="grid grid-cols-3 text-center text-xs gap-1">
                                            <div><div className="font-bold">{stats.count}</div><div>Items</div></div>
                                            <div><div className="font-bold">₹{stats.avgPrice.toFixed(0)}</div><div>Avg</div></div>
                                            <div><div className="font-bold">₹{stats.totalValue.toFixed(0)}</div><div>Value</div></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {recipes.filter(r => r.category === category.name).slice(0, 3).map(recipe => (
                                            <span key={recipe._id} className="badge">{recipe.name.substring(0, 10)}</span>
                                        ))}
                                        {stats.count > 3 && <span className="badge">+{stats.count - 3}</span>}
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleEdit(category)} className="btn btn-sm flex-1">Edit</button>
                                        <button onClick={() => handleDelete(category._id)} className="btn btn-sm">Del</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div key={category._id} className="win-panel-raised p-2 flex items-center gap-3">
                                <span className="text-2xl">{category.icon}</span>
                                <div className="flex-1">
                                    <p className="font-bold text-xs">{category.name}</p>
                                    <p className="text-xs">{stats.count} items · ₹{stats.avgPrice.toFixed(0)} avg</p>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(category)} className="btn btn-sm">Edit</button>
                                    <button onClick={() => handleDelete(category._id)} className="btn btn-sm">Del</button>
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
                                    <div className="win-panel-sunken p-2">
                                        <div className="grid grid-cols-9 gap-1">
                                            {iconOptions.map(icon => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, icon })}
                                                    className={`btn btn-sm text-lg p-1 ${formData.icon === icon ? 'btn-primary' : ''}`}
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Color Selection */}
                                <div>
                                    <label className="label">Theme Color</label>
                                    <div className="win-panel-sunken p-2 grid grid-cols-2 gap-1">
                                        {colorOptions.map(colorOption => (
                                            <button
                                                key={colorOption.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color: colorOption.value })}
                                                className={`btn btn-sm flex items-center gap-2 ${formData.color === colorOption.value ? 'btn-primary' : ''}`}
                                            >
                                                <span
                                                    className="w-3 h-3 border border-[#808080]"
                                                    style={{ backgroundColor: colorOption.value }}
                                                ></span>
                                                <span className="text-xs">{colorOption.name}</span>
                                                {formData.color === colorOption.value && <span className="ml-auto">✓</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="win-groupbox">
                                    <span className="win-groupbox-label">Preview</span>
                                    <div className="win-panel-sunken p-2 flex items-center gap-2">
                                        <span className="text-2xl">{formData.icon}</span>
                                        <div>
                                            <p className="font-bold text-xs">{formData.name || 'Category Name'}</p>
                                            <p className="text-xs">{formData.description || 'No description'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

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
