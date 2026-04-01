import mongoose from 'mongoose';
import Category from './models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bakery-pos';

const defaultCategories = [
    { name: 'Cakes', icon: '🎂', color: '#EC4899', description: 'Birthday cakes, celebration cakes, and more' },
    { name: 'Pastries', icon: '🥐', color: '#F97316', description: 'Croissants, Danish pastries, and sweet treats' },
    { name: 'Breads', icon: '🍞', color: '#F59E0B', description: 'Fresh baked breads and baguettes' },
    { name: 'Cookies', icon: '🍪', color: '#8B5CF6', description: 'Chocolate chip, oatmeal, and specialty cookies' },
    { name: 'Cupcakes', icon: '🧁', color: '#10B981', description: 'Individual portion cakes with frosting' },
    { name: 'Desserts', icon: '🍮', color: '#3B82F6', description: 'Puddings, mousses, and other desserts' }
];

async function seedCategories() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing categories
        await Category.deleteMany({});
        console.log('🗑️  Cleared existing categories');

        // Insert default categories
        const created = await Category.insertMany(defaultCategories);
        console.log(`✅ Created ${created.length} default categories:`);

        created.forEach(cat => {
            console.log(`   ${cat.icon} ${cat.name}`);
        });

        console.log('\n✅ Categories seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        process.exit(1);
    }
}

seedCategories();
