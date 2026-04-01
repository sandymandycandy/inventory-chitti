// Simple test to create orders manually
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function createTestOrders() {
    try {
        // Get all recipes
        const recipesRes = await axios.get(`${API_BASE}/recipes`);
        const recipes = recipesRes.data;

        console.log('📝 Available Recipes:');
        recipes.forEach((r, i) => console.log(`  ${i + 1}. ${r.name} - ₹${r.sellingPrice}`));

        if (recipes.length === 0) {
            console.error('❌ No recipes found!');
            return;
        }

        console.log('\n🛒 Creating test orders...');

        // Order 1
        try {
            const order1 = await axios.post(`${API_BASE}/orders`, {
                customerName: 'Rahul Sharma',
                items: [
                    { recipeId: recipes[0]._id, quantity: 2 }
                ],
                paymentMethod: 'cash'
            });
            console.log(`✅ Order 1: ${order1.data.order.orderNumber} - ₹${order1.data.order.total}`);
            console.log(`   Bill: ${order1.data.bill.billNumber}`);
        } catch (err) {
            console.error('❌ Order 1 failed:', err.response?.data || err.message);
        }

        // Order 2
        try {
            const order2 = await axios.post(`${API_BASE}/orders`, {
                customerName: 'Priya Patel',
                items: [
                    { recipeId: recipes[1]._id, quantity: 1 },
                    { recipeId: recipes[2]._id, quantity: 3 }
                ],
                paymentMethod: 'card'
            });
            console.log(`✅ Order 2: ${order2.data.order.orderNumber} - ₹${order2.data.order.total}`);
            console.log(`   Bill: ${order2.data.bill.billNumber}`);
        } catch (err) {
            console.error('❌ Order 2 failed:', err.response?.data || err.message);
        }

        // Order 3
        try {
            const order3 = await axios.post(`${API_BASE}/orders`, {
                items: [
                    { recipeId: recipes[3]._id, quantity: 2 }
                ],
                paymentMethod: 'upi'
            });
            console.log(`✅ Order 3: ${order3.data.order.orderNumber} - ₹${order3.data.order.total}`);
            console.log(`   Bill: ${order3.data.bill.billNumber}`);
        } catch (err) {
            console.error('❌ Order 3 failed:', err.response?.data || err.message);
        }

        // Get stats
        const stats = await axios.get(`${API_BASE}/analytics/dashboard`);
        console.log('\n📊 Updated Statistics:');
        console.log(`  💰 Total Revenue: ₹${stats.data.totalRevenue.toFixed(2)}`);
        console.log(`  🛒 Total Orders: ${stats.data.totalOrders}`);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

createTestOrders();
