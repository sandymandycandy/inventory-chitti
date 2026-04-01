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
            <div className="flex items-center justify-center min-h-64">
                <div className="win-window p-4 text-center text-sm">
                    <div className="mb-2">Please wait...</div>
                    <div className="win-panel-sunken p-1 text-xs">Loading recipes</div>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="stat-card">
                        <p className="text-xs mb-1">Total Recipes</p>
                        <p className="text-2xl font-bold">{recipes.length}</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-xs mb-1">Total Value</p>
                        <p className="text-2xl font-bold">₹{recipes.reduce((sum, r) => sum + r.sellingPrice, 0).toFixed(0)}</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-xs mb-1">Avg Profit</p>
                        <p className="text-2xl font-bold">
                            ₹{recipes.length > 0 ? (recipes.reduce((sum, r) => sum + (r.sellingPrice - (r.productionCost || 0)), 0) / recipes.length).toFixed(0) : 0}
                        </p>
                    </div>
                    <div className="stat-card">
                        <p className="text-xs mb-1">Categories</p>
                        <p className="text-2xl font-bold">{new Set(recipes.map(r => r.category)).size}</p>
                    </div>
                </div>

                {/* Search and Category Filter */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input flex-1"
                    />
                    <div className="flex gap-1 overflow-x-auto">
                        {categoryNames.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`btn btn-sm whitespace-nowrap ${selectedCategory === category ? 'btn-primary' : ''}`}
                            >
                                {category}
                                {category !== 'All' && (
                                    <span className="ml-1 text-xs">
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
                <div className="card p-8 text-center">
                    <div className="win-panel-sunken w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-bold mb-1">No Recipes Yet</h3>
                    <p className="text-xs mb-4">Create your first recipe to get started</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">Create First Recipe</button>
                </div>
            ) : searchTerm || selectedCategory !== 'All' ? (
                /* Filtered View */
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold">
                            {searchTerm ? `Search Results (${filteredRecipes.length})` : `${selectedCategory} (${filteredRecipes.length})`}
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filteredRecipes.map(recipe => (
                            <RecipeCard key={recipe._id} recipe={recipe} onEdit={handleEdit} onDelete={handleDelete} formatCurrency={formatCurrency} />
                        ))}
                    </div>
                    {filteredRecipes.length === 0 && (
                        <div className="win-panel-sunken p-6 text-center text-xs">No recipes found matching your criteria.</div>
                    )}
                </div>
            ) : (
                /* Category View */
                <div className="space-y-4">
                    {recipesByCategory.map(({ category, recipes: categoryRecipes, stats }) => (
                        <div key={category} className="win-window p-0">
                            {/* Category Titlebar */}
                            <div className="win-titlebar justify-between">
                                <span>{category} ({stats.count})</span>
                                <span className="text-xs opacity-80 mr-2">
                                    Avg Profit: {formatCurrency(stats.avgProfit)} · Total: {formatCurrency(stats.totalValue)}
                                </span>
                            </div>
                            {/* Recipe Cards Grid */}
                            <div className="p-3 bg-[#d4d0c8]">
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {categoryRecipes.map(recipe => (
                                        <RecipeCard key={recipe._id} recipe={recipe} onEdit={handleEdit} onDelete={handleDelete} formatCurrency={formatCurrency} />
                                    ))}
                                </div>
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
                                        <div className="win-panel-sunken p-3 text-center text-xs">
                                            {imagePreview ? (
                                                <div>
                                                    <img src={imagePreview} alt="Preview" className="max-h-36 mx-auto mb-2" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImagePreview(null);
                                                            setFormData({ ...formData, imageUrl: '' });
                                                        }}
                                                        className="btn btn-sm"
                                                    >
                                                        Remove Image
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="mb-2">PNG, JPG up to 2MB</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                        id="image-upload"
                                                    />
                                                    <label htmlFor="image-upload" className="btn btn-sm cursor-pointer inline-block">
                                                        Browse...
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

    return (
        <div className="win-panel-raised overflow-hidden">
            {/* Recipe Image */}
            <div className="win-panel-sunken h-28 flex items-center justify-center overflow-hidden">
                {recipe.imageUrl ? (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-center text-xs">
                        <svg className="w-10 h-10 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        No Image
                    </div>
                )}
            </div>

            <div className="p-2">
                <p className="font-bold text-xs truncate mb-1">{recipe.name}</p>
                <div className="flex items-center gap-1 mb-2">
                    <span className="badge badge-info">{recipe.category}</span>
                    {recipe.totalSold > 0 && <span className="badge badge-success">{recipe.totalSold} sold</span>}
                </div>

                <div className="win-panel-sunken p-1 mb-2 text-xs">
                    <div className="flex justify-between">
                        <span>Price:</span><span className="font-bold">{formatCurrency(recipe.sellingPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Profit:</span>
                        <span className={`font-bold ${profit >= 0 ? 'text-[#006000]' : 'text-[#c00000]'}`}>{formatCurrency(profit)}</span>
                    </div>
                </div>

                <div className="flex gap-1">
                    <button onClick={() => onEdit(recipe)} className="btn btn-sm flex-1">Edit</button>
                    <button onClick={() => onDelete(recipe._id)} className="btn btn-sm">Del</button>
                </div>
            </div>
        </div>
    );
}

export default Recipes;
