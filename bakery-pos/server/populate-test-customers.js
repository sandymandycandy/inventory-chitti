import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from './models/Customer.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bakery-pos';

// Test customers with different tiers
const testCustomers = [
    {
        name: 'Rahul Sharma',
        phone: '9876543210',
        email: 'rahul@example.com',
        loyaltyPoints: 150,
        totalSpent: 1500,
        totalOrders: 10,
        notes: 'Regular customer - loves chocolate cakes'
    },
    {
        name: 'Priya Patel',
        phone: '9876543211',
        email: 'priya@example.com',
        loyaltyPoints: 350,
        totalSpent: 6000,
        totalOrders: 25,
        notes: 'Silver tier - prefers pastries'
    },
    {
        name: 'Amit Kumar',
        phone: '9876543212',
        email: 'amit@example.com',
        loyaltyPoints: 500,
        totalSpent: 12000,
        totalOrders: 40,
        notes: 'Gold tier - bulk orders for office'
    }
];

async function populateCustomers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing test customers
        await Customer.deleteMany({
            phone: { $in: testCustomers.map(c => c.phone) }
        });
        console.log('🗑️  Cleared existing test customers');

        // Create new customers
        for (const customerData of testCustomers) {
            const customer = new Customer(customerData);
            await customer.save();
            console.log(`✅ Created customer: ${customer.name} (${customer.tier}, ${customer.loyaltyPoints} points)`);
        }

        console.log('\n🎉 Test customers created successfully!');
        console.log('\n📱 Test Phone Numbers:');
        testCustomers.forEach(c => {
            console.log(`   ${c.phone} - ${c.name}`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

populateCustomers();
