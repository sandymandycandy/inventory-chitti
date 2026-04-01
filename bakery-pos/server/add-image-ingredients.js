import mongoose from 'mongoose';
import Ingredient from './models/Ingredient.js';

const MONGODB_URI = 'mongodb://localhost:27017/bakery-pos';

const ingredients = [
    { name: 'Maida', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Sugar', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Milk Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Baking Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Baking Soda', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Eggs', unit: 'pieces', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Oil', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Vanilla Essence', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Salt', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 }
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
