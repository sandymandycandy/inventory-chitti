import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bakery-pos';

async function setupAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin exists
        const adminExists = await User.findOne({ role: 'admin' });
        
        if (adminExists) {
            console.log('⚠️  Admin user already exists');
            console.log('Username:', adminExists.username);
            process.exit(0);
        }

        // Create admin user
        const admin = new User({
            username: 'admin',
            email: 'admin@tinsandtrays.com',
            password: 'admin123',
            fullName: 'Administrator',
            role: 'admin'
        });

        await admin.save();
        
        console.log('✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📝 Login Credentials:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  Please change the password after first login!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

setupAdmin();
