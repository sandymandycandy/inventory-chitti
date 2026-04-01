import mongoose from 'mongoose';

const recipeIngredientSchema = new mongoose.Schema({
    ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: 0
    },
    productionCost: {
        type: Number,
        default: 0,
        min: 0
    },
    imageUrl: {
        type: String,
        default: null
    },
    ingredients: [recipeIngredientSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    totalSold: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

// Virtual for cost price (sum of ingredient costs)
recipeSchema.virtual('costPrice').get(function () {
    return this.ingredients.reduce((total, item) => {
        if (item.ingredient && item.ingredient.costPerUnit) {
            return total + (item.quantity * item.ingredient.costPerUnit);
        }
        return total;
    }, 0);
});

// Virtual for profit margin
recipeSchema.virtual('profitMargin').get(function () {
    const cost = this.costPrice;
    if (cost === 0) return 100;
    return ((this.sellingPrice - cost) / this.sellingPrice * 100).toFixed(2);
});

// Method to check if recipe can be made with current stock
recipeSchema.methods.canMake = async function (quantity = 1) {
    await this.populate('ingredients.ingredient');

    for (const item of this.ingredients) {
        const requiredQuantity = item.quantity * quantity;
        if (item.ingredient.currentStock < requiredQuantity) {
            return {
                canMake: false,
                missing: {
                    ingredient: item.ingredient.name,
                    required: requiredQuantity,
                    available: item.ingredient.currentStock
                }
            };
        }
    }

    return { canMake: true };
};

// Method to deduct ingredients from stock
recipeSchema.methods.deductIngredients = async function (quantity = 1) {
    await this.populate('ingredients.ingredient');

    const Ingredient = mongoose.model('Ingredient');

    for (const item of this.ingredients) {
        const requiredQuantity = item.quantity * quantity;
        await Ingredient.findByIdAndUpdate(
            item.ingredient._id,
            {
                $inc: { currentStock: -requiredQuantity },
                $set: { lastUpdated: Date.now() }
            }
        );
    }

    // Update total sold
    this.totalSold += quantity;
    await this.save();
};

// Pre-save hook to automatically calculate production cost
recipeSchema.pre('save', async function (next) {
    if (this.isModified('ingredients') || this.isNew) {
        try {
            // Populate ingredients to get costPerUnit
            const Ingredient = mongoose.model('Ingredient');
            let totalCost = 0;

            for (const item of this.ingredients) {
                const ingredient = await Ingredient.findById(item.ingredient);
                if (ingredient) {
                    totalCost += item.quantity * ingredient.costPerUnit;
                }
            }

            this.productionCost = totalCost;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Ensure virtuals are included in JSON
recipeSchema.set('toJSON', { virtuals: true });
recipeSchema.set('toObject', { virtuals: true });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
