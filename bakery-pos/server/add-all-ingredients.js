import mongoose from 'mongoose';
import Ingredient from './models/Ingredient.js';

const MONGODB_URI = 'mongodb://localhost:27017/bakery-pos';

const ingredients = [
    // From first image
    { name: 'Cream Cheese', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Fresh Cream', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Garlic', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Parsley', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Honey', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Corn Starch', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // From second image
    { name: 'Fresh Coconut', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Powdered Sugar', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Corn Syrup', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Cardamom Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Chopped Cashews', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Tutti Frutti', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // From third image
    { name: 'Yellow Color', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Orange Color', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Vanilla', unit: 'ml', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    
    // User requested
    { name: 'Cinnamon Powder', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Brown Sugar', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Mozzarella Cheese', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Oregano', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 },
    { name: 'Chilli Flakes', unit: 'g', currentStock: 0, minStockAlert: 0, costPerUnit: 0 }
];

async function addIngredients() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('🔗 Connected to MongoDB');

        let added = 0;
        let skipped = 0;

        for (const ingredient of ingredients) {
            // Check if ingredient already exists
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
        console.log('💡 You can now add quantities and rates from the Inventory page');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding ingredients:', error);
        process.exit(1);
    }
}

addIngredients();
