import mongoose from 'mongoose';
import Ingredient from './models/Ingredient.js';

const MONGODB_URI = 'mongodb://localhost:27017/bakery-pos';

const ingredients = [
    { name: 'Yeast', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Unsalted Butter', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Warm Milk', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Caster Sugar', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Baking Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 }
];

async function addIngredients() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('🔗 Connected to MongoDB');

        for (const ingredient of ingredients) {
            // Check if ingredient already exists
            const existing = await Ingredient.findOne({ name: ingredient.name.toLowerCase() });
            if (existing) {
                console.log(`⏭️  Skipped: ${ingredient.name} (already exists)`);
                continue;
            }

            await Ingredient.create(ingredient);
            console.log(`✅ Added: ${ingredient.name} (${ingredient.unit})`);
        }

        console.log('\n✨ All ingredients added successfully!');
        console.log('💡 You can now add quantities and rates from the Inventory page');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding ingredients:', error);
        process.exit(1);
    }
}

addIngredients();
