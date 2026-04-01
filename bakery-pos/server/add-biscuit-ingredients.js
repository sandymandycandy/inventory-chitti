import mongoose from 'mongoose';
import Ingredient from './models/Ingredient.js';

const MONGODB_URI = 'mongodb://localhost:27017/bakery-pos';

const ingredients = [
    // Base ingredients from all biscuit recipes
    { name: 'Whole Wheat Flour', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Almond Flour', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Jaggery', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Rice Flour', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Besan Flour', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Ghee', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Oats', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Wheat Bran', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // Variation ingredients
    { name: 'Cocoa Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Instant Coffee Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Cashew Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Pistachio', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Almonds', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Slivered Almonds', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Kosher Salt', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Lemon', unit: 'pieces', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Ginger Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Orange Zest', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Clove Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Anise Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Nutmeg', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Saffron', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Thandai Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Poppy Seeds', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'White Chocolate', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Silver Foil', unit: 'pieces', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Dry Rose Petals', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Desiccated Coconut', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Kashmiri Chilli Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Coriander Leaves', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Green Chilli', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Coriander Juice', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Garlic Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Italian Herbs', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Black Sesame Paste', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Black Sesame Seeds', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 }
];

async function addIngredients() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('🔗 Connected to MongoDB');

        let added = 0;
        let skipped = 0;

        for (const ingredient of ingredients) {
            const existing = await Ingredient.findOne({ name: ingredient.name.toLowerCase() });
            if (existing) {
                console.log(`⏭️  Skipped: ${ingredient.name} (already exists)`);
                skipped++;
                continue;
            }

            await Ingredient.create(ingredient);
            console.log(`✅ Added: ${ingredient.name} (${ingredient.unit})`);
            added++;
        }

        console.log(`\n✨ Process complete!`);
        console.log(`📊 Added: ${added} | Skipped: ${skipped}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding ingredients:', error);
        process.exit(1);
    }
}

addIngredients();
