import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        // Make case-insensitive by converting to lowercase
        set: (value) => value.trim().toLowerCase()
    },
    currentStock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'g', 'L', 'ml', 'pieces', 'dozen'],
        default: 'kg'
    },
    costPerUnit: {
        type: Number,
        required: true,
        min: 0
    },
    minStockAlert: {
        type: Number,
        default: 10,
        min: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Pre-save hook to prevent duplicates (case-insensitive)
ingredientSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('name')) {
        const existingIngredient = await this.constructor.findOne({
            name: this.name.toLowerCase(),
            _id: { $ne: this._id }
        });
        
        if (existingIngredient) {
            const error = new Error(`Ingredient "${this.name}" already exists`);
            error.code = 11000; // Duplicate key error code
            return next(error);
        }
    }
    next();
});

// Virtual for total value
ingredientSchema.virtual('totalValue').get(function () {
    return this.currentStock * this.costPerUnit;
});

// Virtual for stock status
ingredientSchema.virtual('stockStatus').get(function () {
    if (this.currentStock === 0) return 'out';
    if (this.currentStock <= this.minStockAlert) return 'low';
    return 'good';
});

// Method to update stock
ingredientSchema.methods.updateStock = function (quantity, operation = 'add') {
    if (operation === 'add') {
        this.currentStock += quantity;
    } else if (operation === 'subtract') {
        this.currentStock = Math.max(0, this.currentStock - quantity);
    }
    this.lastUpdated = Date.now();
    return this.save();
};

// Ensure virtuals are included in JSON
ingredientSchema.set('toJSON', { virtuals: true });
ingredientSchema.set('toObject', { virtuals: true });

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

export default Ingredient;
