import { useState, useEffect } from 'react';
import { recipesAPI, ingredientsAPI, categoriesAPI } from '../services/api';

function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        sellingPrice: '',
        productionCost: '',
        imageUrl: '',
        ingredients: []
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [recipesRes, ingredientsRes, categoriesRes] = await Promise.all([
                recipesAPI.getAll(),
                ingredientsAPI.getAll(),
                categoriesAPI.getAll()
            ]);
            setRecipes(recipesRes.data);
            setIngredients(ingredientsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddIngredient = () => {
        const newIngredients = [...formData.ingredients, { ingredient: '', quantity: '', unit: '' }];
        setFormData({
            ...formData,
            ingredients: newIngredients,
            productionCost: calculateProductionCost(newIngredients)
        });
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = formData.ingredients.filter((_, i) => i !== index);
        const updatedFormData = { ...formData, ingredients: newIngredients };
        updatedFormData.productionCost = calculateProductionCost(newIngredients);
        setFormData(updatedFormData);
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index][field] = value;
        
        // If ingredient is changed, auto-set the unit to the ingredient's default unit
        if (field === 'ingredient') {
            const ingredient = ingredients.find(i => i._id === value);
            if (ingredient) {
                newIngredients[index].unit = ingredient.unit;
            }
        }
        
        const updatedFormData = { ...formData, ingredients: newIngredients };
        updatedFormData.productionCost = calculateProductionCost(newIngredients);
        setFormData(updatedFormData);
    };

    // Helper function to get related units based on base unit
    const getRelatedUnits = (baseUnit) => {
        const unitGroups = {
            weight: ['KG', 'G'],
            volume: ['L', 'ML'],
            count: ['PCS', 'BOX', 'PACK']
        };
        
        for (const [group, units] of Object.entries(unitGroups)) {
            if (units.includes(baseUnit)) {
                return units;
            }
        }
        return [baseUnit]; // Return base unit if not found in groups
    };

    // Helper function to convert units
    const convertToBaseUnit = (quantity, fromUnit, toUnit) => {
        if (fromUnit === toUnit) return quantity;
        
        const conversionRates = {
            // Weight conversions to KG
            'G': { 'KG': 0.001 },
            'KG': { 'G': 1000 },
            
            // Volume conversions to L
            'ML': { 'L': 0.001 },
            'L': { 'ML': 1000 }
        };
        
        if (conversionRates[fromUnit] && conversionRates[fromUnit][toUnit]) {
            return quantity * conversionRates[fromUnit][toUnit];
        }
        
        return quantity; // No conversion needed
    };

    const calculateProductionCost = (ingredientsList) => {
        let totalCost = 0;
        ingredientsList.forEach(item => {
            if (item.ingredient && item.quantity) {
                const ingredient = ingredients.find(ing => ing._id === item.ingredient);
                if (ingredient) {
                    // Convert recipe unit to ingredient's base unit for cost calculation
                    const convertedQuantity = convertToBaseUnit(
                        parseFloat(item.quantity),
                        item.unit || ingredient.unit,
                        ingredient.unit
                    );
                    totalCost += convertedQuantity * parseFloat(ingredient.costPerUnit);
                }
            }
        });
        return totalCost.toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const recipeData = {
                ...formData,
                sellingPrice: parseFloat(formData.sellingPrice) || 0,
                ingredients: formData.ingredients.map(ing => ({
                    ingredient: ing.ingredient,
                    quantity: parseFloat(ing.quantity)
                }))
            };
            // Remove productionCost - will be auto-calculated by backend
            delete recipeData.productionCost;

            if (editingRecipe) {
                await recipesAPI.update(editingRecipe._id, recipeData);
            } else {
                await recipesAPI.create(recipeData);
            }

            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error saving recipe:', error);
            alert(error.response?.data?.error || 'Error saving recipe');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imageUrl: reader.result });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
        setFormData({
            name: recipe.name,
            category: recipe.category,
            sellingPrice: recipe.sellingPrice,
            productionCost: recipe.productionCost || 0,
            imageUrl: recipe.imageUrl || '',
            ingredients: recipe.ingredients.map(ing => ({
                ingredient: ing.ingredient._id || ing.ingredient,
                quantity: ing.quantity,
                unit: ing.unit || ''
            }))
        });
        setImagePreview(recipe.imageUrl || null);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                await recipesAPI.delete(id);
                fetchData();
            } catch (error) {
                console.error('Error deleting recipe:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: categories.length > 0 ? categories[0].name : '',
            sellingPrice: '',
            productionCost: '',
            imageUrl: '',
            ingredients: []
        });
        setImagePreview(null);
        setEditingRecipe(null);
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toFixed(2)}`;
    };

    const categoryNames = ['All', ...categories.map(cat => cat.name)];
    
    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const recipesByCategory = categories.map(cat => {
        const categoryRecipes = recipes.filter(r => r.category === cat.name);
        return {
            category: cat.name,
            color: cat.color,
            icon: cat.icon,
            recipes: categoryRecipes,
            stats: {
                count: categoryRecipes.length,
                totalValue: categoryRecipes.reduce((sum, r) => sum + r.sellingPrice, 0),
                avgProfit: categoryRecipes.length > 0
                    ? categoryRecipes.reduce((sum, r) => sum + (r.sellingPrice - (r.productionCost || 0)), 0) / categoryRecipes.length
                    : 0
            }
        };
    }).filter(cat => cat.recipes.length > 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading recipes...</p>
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
                        <h1 className="text-3xl font-bold text-dark-900 mb-1">Recipe Management</h1>
                        <p className="text-gray-600">Create and manage your bakery recipes</p>
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
                        Add Recipe
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="card p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">Total Recipes</p>
                                <p className="text-2xl font-bold text-blue-900 mt-1">{recipes.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700">Total Value</p>
                                <p className="text-2xl font-bold text-green-900 mt-1">
                                    ₹{recipes.reduce((sum, r) => sum + r.sellingPrice, 0).toFixed(0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">Avg Profit</p>
                                <p className="text-2xl font-bold text-purple-900 mt-1">
                                    ₹{recipes.length > 0 ? (recipes.reduce((sum, r) => sum + (r.sellingPrice - (r.productionCost || 0)), 0) / recipes.length).toFixed(0) : 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-700">Categories</p>
                                <p className="text-2xl font-bold text-amber-900 mt-1">
                                    {new Set(recipes.map(r => r.category)).size}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-amber-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Category Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10 w-full"
                        />
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categoryNames.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                                    selectedCategory === category
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category}
                                {category !== 'All' && (
                                    <span className="ml-2 text-xs opacity-75">
                                        ({recipes.filter(r => r.category === category).length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recipes organized by Category */}
            {recipes.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-dark-900 mb-2">No Recipes Yet</h3>
                    <p className="text-gray-600 mb-6">Create your first recipe to get started</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create First Recipe
                    </button>
                </div>
            ) : searchTerm || selectedCategory !== 'All' ? (
                /* Filtered View */
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-dark-900">
                            {searchTerm ? `Search Results (${filteredRecipes.length})` : `${selectedCategory} (${filteredRecipes.length})`}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRecipes.map(recipe => (
                            <RecipeCard key={recipe._id} recipe={recipe} onEdit={handleEdit} onDelete={handleDelete} formatCurrency={formatCurrency} />
                        ))}
                    </div>
                    {filteredRecipes.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No recipes found matching your criteria.</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Category View */
                <div className="space-y-8">
                    {recipesByCategory.map(({ category, recipes: categoryRecipes, stats }) => (
                        <div key={category} className="card p-6">
                            {/* Category Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-dark-900 mb-1">{category}</h2>
                                    <p className="text-sm text-gray-600">
                                        {stats.count} recipe{stats.count !== 1 ? 's' : ''} • 
                                        Avg Profit: {formatCurrency(stats.avgProfit)} • 
                                        Total Value: {formatCurrency(stats.totalValue)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedCategory(category)}
                                    className="btn btn-sm btn-secondary"
                                >
                                    View All
                                </button>
                            </div>

                            {/* Recipe Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {categoryRecipes.map(recipe => (
                                    <RecipeCard key={recipe._id} recipe={recipe} onEdit={handleEdit} onDelete={handleDelete} formatCurrency={formatCurrency} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {
                showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="text-xl font-bold text-dark-900">
                                    {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
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
                                        <label className="label">Recipe Name*</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input"
                                            required
                                            placeholder="e.g., Chocolate Cake"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Category*</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="input"
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat.name}>{cat.icon} {cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <label className="text-sm font-semibold text-blue-900">Production Cost (Auto-Calculated)</label>
                                        </div>
                                        <div className="text-3xl font-bold text-blue-900 mb-1">
                                            ₹{formData.productionCost || '0.00'}
                                        </div>
                                        <p className="text-xs text-blue-700">✓ Calculated from ingredient costs • Set selling price in Product Pricing tab</p>
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="label">Recipe Image (Optional)</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
                                            {imagePreview ? (
                                                <div className="relative">
                                                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImagePreview(null);
                                                            setFormData({ ...formData, imageUrl: '' });
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-gray-600 text-sm mb-2">Click to upload or drag and drop</p>
                                                    <p className="text-gray-400 text-xs">PNG, JPG up to 2MB</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                        id="image-upload"
                                                    />
                                                    <label htmlFor="image-upload" className="btn btn-sm btn-secondary mt-2 cursor-pointer inline-block">
                                                        Choose File
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label">Ingredients*</label>
                                        <div className="space-y-2 mb-3">
                                            {formData.ingredients.map((ing, index) => {
                                                const selectedIngredient = ingredients.find(i => i._id === ing.ingredient);
                                                const allowedUnits = selectedIngredient ? getRelatedUnits(selectedIngredient.unit) : [];
                                                
                                                return (
                                                    <div key={index} className="flex gap-2">
                                                        <select
                                                            value={ing.ingredient}
                                                            onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                                                            className="input flex-1"
                                                            required
                                                        >
                                                            <option value="">Select Ingredient</option>
                                                            {ingredients.map(ingredient => (
                                                                <option key={ingredient._id} value={ingredient._id}>
                                                                    {ingredient.name} ({ingredient.unit})
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="relative w-32">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={ing.quantity}
                                                                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                                                className="input w-full"
                                                                placeholder="Qty"
                                                                required
                                                            />
                                                        </div>
                                                        <select
                                                            value={ing.unit || selectedIngredient?.unit || ''}
                                                            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                                            className="input w-24"
                                                            required
                                                            disabled={!ing.ingredient}
                                                        >
                                                            <option value="">Unit</option>
                                                            {allowedUnits.map(unit => (
                                                                <option key={unit} value={unit}>{unit}</option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveIngredient(index)}
                                                            className="btn btn-sm bg-red-100 text-red-700 hover:bg-red-200"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <button type="button" onClick={handleAddIngredient} className="btn btn-sm btn-secondary">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add Ingredient
                                        </button>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingRecipe ? 'Update Recipe' : 'Create Recipe'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

// Recipe Card Component
function RecipeCard({ recipe, onEdit, onDelete, formatCurrency }) {
    const profit = recipe.sellingPrice - (recipe.productionCost || 0);
    const profitColor = profit > 0 ? '#10b981' : '#ef4444';

    return (
        <div className="card p-0 overflow-hidden card-hover group">
            {/* Recipe Image */}
            <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center overflow-hidden relative">
                {recipe.imageUrl ? (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="text-center">
                        <svg className="w-16 h-16 text-primary-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-primary-400 text-xs mt-1">No Image</p>
                    </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                        <p className="text-xs font-medium">
                            {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* Header */}
                <div className="mb-3">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base font-bold text-dark-900 line-clamp-1 group-hover:text-primary-600 transition-colors flex-1">
                            {recipe.name}
                        </h3>
                        {recipe.totalSold > 0 && (
                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                {recipe.totalSold} sold
                            </span>
                        )}
                    </div>
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-primary-100 text-primary-700">
                        {recipe.category}
                    </span>
                </div>

                {/* Pricing Info */}
                <div className="grid grid-cols-2 gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                    <div>
                        <p className="text-xs text-gray-500">Selling Price</p>
                        <p className="text-lg font-bold text-primary-600">{formatCurrency(recipe.sellingPrice)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Profit</p>
                        <p className="text-lg font-bold" style={{ color: profitColor }}>
                            {formatCurrency(profit)}
                        </p>
                    </div>
                </div>

                {/* Cost Info */}
                <div className="mb-3 text-xs text-gray-600">
                    Production Cost: <span className="font-semibold">{formatCurrency(recipe.productionCost || 0)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                        onClick={() => onEdit(recipe)}
                        className="btn btn-sm btn-secondary flex-1 group/edit"
                    >
                        <svg className="w-3.5 h-3.5 mr-1 group-hover/edit:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(recipe._id)}
                        className="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 group/delete"
                    >
                        <svg className="w-3.5 h-3.5 group-hover/delete:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Recipes;
