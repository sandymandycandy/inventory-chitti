// Clear all test data from MongoDB
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bakery-pos';

async function clearDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('🔗 Connected to MongoDB');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log('🗑️  Clearing all collections...\n');

        for (const collection of collections) {
            await db.collection(collection.name).deleteMany({});
            console.log(`  ✅ Cleared: ${collection.name}`);
        }

        console.log('\n✨ Database cleared successfully!\n');
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

clearDatabase();
