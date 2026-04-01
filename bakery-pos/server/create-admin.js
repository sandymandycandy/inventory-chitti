import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = 'mongodb://localhost:27017/bakery-pos';

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('🔗 Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = new User({
            username: 'admin',
            email: 'admin@bakery.com',
            password: 'admin123',
            fullName: 'Administrator',
            role: 'admin'
        });

        await admin.save();
        console.log('✅ Admin user created successfully!');
        console.log('📝 Username: admin');
        console.log('🔑 Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
