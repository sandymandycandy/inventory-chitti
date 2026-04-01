import mongoose from 'mongoose';
import Ingredient from './models/Ingredient.js';

const MONGODB_URI = 'mongodb://localhost:27017/bakery-pos';

async function removeDuplicateMilk() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('🔗 Connected to MongoDB');

        // Find all milk entries (case insensitive)
        const milkEntries = await Ingredient.find({ 
            name: { $regex: /^milk$/i } 
        });

        console.log(`Found ${milkEntries.length} milk entries:`);
        milkEntries.forEach(milk => {
            console.log(`  - ${milk.name} (${milk.unit}): Stock=${milk.currentStock}, Cost=${milk.costPerUnit}`);
        });

        if (milkEntries.length > 1) {
            // Keep the one with data, delete the empty one
            const withData = milkEntries.find(m => m.currentStock > 0 || m.costPerUnit > 0);
            const toDelete = milkEntries.filter(m => m._id.toString() !== withData?._id.toString());

            for (const milk of toDelete) {
                await Ingredient.findByIdAndDelete(milk._id);
                console.log(`❌ Deleted duplicate: ${milk.name} (${milk.unit})`);
            }

            console.log(`✅ Kept: ${withData.name} (${withData.unit})`);
        } else {
            console.log('✅ No duplicates found');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

removeDuplicateMilk();
