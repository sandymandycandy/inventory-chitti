import mongoose from 'mongoose';
import Ingredient from './models/Ingredient.js';

const MONGODB_URI = 'mongodb://localhost:27017/bakery-pos';

const ingredients = [
    // From Hazelnut Praline
    { name: 'Hazelnuts', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Water', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // From Gianduja
    { name: 'Milk Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Dark Chocolate', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // From Mango Toffee
    { name: 'Liquid Glucose', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Mango Confit', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Mango Essence', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // From Strawberry Compote
    { name: 'Strawberries', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // From Dulce De Leche
    { name: 'Sweetened Condensed Milk', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Condensed Milk', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // From Caramelized White Chocolate
    { name: 'Cocoa Butter', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // From Apricot Marmalade
    { name: 'Dried Apricots', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // From Blueberry Confit
    { name: 'Blueberry Puree', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // From Creme Anglaise & Vanilla Custard
    { name: 'Custard Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // From Vanilla Cheesecake Filling
    { name: 'Whipped Cream', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // From Hazelnut Mousse
    { name: 'Hazelnut Praline Paste', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 }
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
