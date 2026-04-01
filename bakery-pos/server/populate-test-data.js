// Test data population script for Bakery POS
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function populateTestData() {
    try {
        console.log('🚀 Starting test data population...\n');

        // 1. Add Ingredients
        console.log('📦 Adding ingredients...');
        const ingredients = [
            { name: 'All Purpose Flour', currentStock: 50, unit: 'kg', costPerUnit: 40, minStockAlert: 10 },
            { name: 'Sugar', currentStock: 30, unit: 'kg', costPerUnit: 50, minStockAlert: 8 },
            { name: 'Butter', currentStock: 20, unit: 'kg', costPerUnit: 450, minStockAlert: 5 },
            { name: 'Eggs', currentStock: 100, unit: 'pieces', costPerUnit: 6, minStockAlert: 20 },
            { name: 'Milk', currentStock: 25, unit: 'L', costPerUnit: 60, minStockAlert: 10 },
            { name: 'Vanilla Extract', currentStock: 2, unit: 'L', costPerUnit: 800, minStockAlert: 1 },
            { name: 'Cocoa Powder', currentStock: 8, unit: 'kg', costPerUnit: 350, minStockAlert: 3 },
            { name: 'Baking Powder', currentStock: 5, unit: 'kg', costPerUnit: 200, minStockAlert: 2 }
        ];

        const createdIngredients = {};
        for (const ing of ingredients) {
            const response = await axios.post(`${API_BASE}/ingredients`, ing);
            createdIngredients[ing.name] = response.data._id;
            console.log(`  ✅ Added: ${ing.name}`);
        }

        // 2. Create Recipes
        console.log('\n📝 Creating recipes...');
        const recipes = [
            {
                name: 'Chocolate Cake',
                category: 'Cakes',
                sellingPrice: 450,
                ingredients: [
                    { ingredient: createdIngredients['All Purpose Flour'], quantity: 0.5 },
                    { ingredient: createdIngredients['Sugar'], quantity: 0.4 },
                    { ingredient: createdIngredients['Butter'], quantity: 0.2 },
                    { ingredient: createdIngredients['Eggs'], quantity: 4 },
                    { ingredient: createdIngredients['Milk'], quantity: 0.3 },
                    { ingredient: createdIngredients['Cocoa Powder'], quantity: 0.1 }
                ]
            },
            {
                name: 'Vanilla Cupcakes',
                category: 'Cakes',
                sellingPrice: 280,
                ingredients: [
                    { ingredient: createdIngredients['All Purpose Flour'], quantity: 0.3 },
                    { ingredient: createdIngredients['Sugar'], quantity: 0.25 },
                    { ingredient: createdIngredients['Butter'], quantity: 0.15 },
                    { ingredient: createdIngredients['Eggs'], quantity: 3 },
                    { ingredient: createdIngredients['Milk'], quantity: 0.2 },
                    { ingredient: createdIngredients['Vanilla Extract'], quantity: 0.02 }
                ]
            },
            {
                name: 'Butter Cookies',
                category: 'Cookies',
                sellingPrice: 150,
                ingredients: [
                    { ingredient: createdIngredients['All Purpose Flour'], quantity: 0.4 },
                    { ingredient: createdIngredients['Sugar'], quantity: 0.2 },
                    { ingredient: createdIngredients['Butter'], quantity: 0.25 },
                    { ingredient: createdIngredients['Eggs'], quantity: 2 }
                ]
            },
            {
                name: 'White Bread Loaf',
                category: 'Breads',
                sellingPrice: 60,
                ingredients: [
                    { ingredient: createdIngredients['All Purpose Flour'], quantity: 0.6 },
                    { ingredient: createdIngredients['Sugar'], quantity: 0.05 },
                    { ingredient: createdIngredients['Milk'], quantity: 0.25 },
                    { ingredient: createdIngredients['Butter'], quantity: 0.05 }
                ]
            },
            {
                name: 'Croissant',
                category: 'Pastries',
                sellingPrice: 80,
                ingredients: [
                    { ingredient: createdIngredients['All Purpose Flour'], quantity: 0.3 },
                    { ingredient: createdIngredients['Butter'], quantity: 0.2 },
                    { ingredient: createdIngredients['Milk'], quantity: 0.1 },
                    { ingredient: createdIngredients['Sugar'], quantity: 0.05 }
                ]
            }
        ];

        const createdRecipes = [];
        for (const recipe of recipes) {
            const response = await axios.post(`${API_BASE}/recipes`, recipe);
            createdRecipes.push(response.data);
            console.log(`  ✅ Created: ${recipe.name} - ₹${recipe.sellingPrice}`);
        }

        // 3. Create Sample Orders
        console.log('\n🛒 Creating sample orders...');
        const orders = [
            {
                customerName: 'Rahul Sharma',
                items: [
                    { recipeId: createdRecipes[0]._id, quantity: 2 },
                    { recipeId: createdRecipes[1]._id, quantity: 1 }
                ],
                paymentMethod: 'cash'
            },
            {
                customerName: 'Priya Patel',
                items: [
                    { recipeId: createdRecipes[2]._id, quantity: 3 },
                    { recipeId: createdRecipes[4]._id, quantity: 4 }
                ],
                paymentMethod: 'card'
            },
            {
                customerName: 'Walk-in Customer',
                items: [
                    { recipeId: createdRecipes[3]._id, quantity: 2 }
                ],
                paymentMethod: 'upi'
            }
        ];

        for (const order of orders) {
            const response = await axios.post(`${API_BASE}/orders`, order);
            console.log(`  ✅ Order created: ${response.data.order.orderNumber} - ₹${response.data.order.total}`);
            console.log(`     📄 Bill generated: ${response.data.bill.billNumber}`);
        }

        // 4. Display Summary
        console.log('\n📊 Test Data Summary:');
        const stats = await axios.get(`${API_BASE}/analytics/dashboard`);
        console.log(`  💰 Total Revenue: ₹${stats.data.totalRevenue.toFixed(2)}`);
        console.log(`  🛒 Total Orders: ${stats.data.totalOrders}`);
        console.log(`  📖 Active Recipes: ${stats.data.totalRecipes}`);
        console.log(`  📦 Inventory Items: ${stats.data.totalInventory}`);
        console.log(`  ⚠️  Low Stock Items: ${stats.data.lowStockCount}`);

        console.log('\n✨ Test data population completed successfully!');
        console.log('🌐 Open http://localhost:5173 to see the dashboard\n');

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

populateTestData();
