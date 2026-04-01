import express from 'express';
import Order from '../models/Order.js';
import Recipe from '../models/Recipe.js';
import Ingredient from '../models/Ingredient.js';
import Customer from '../models/Customer.js';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
    try {
        // Total revenue
        const revenueData = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        const totalRevenue = revenueData[0]?.total || 0;

        // Total orders
        const totalOrders = await Order.countDocuments({ status: 'completed' });

        // Active recipes
        const totalRecipes = await Recipe.countDocuments({ isActive: true });

        // Total inventory items
        const totalInventory = await Ingredient.countDocuments();

        // Low stock items
        const allIngredients = await Ingredient.find();
        const lowStockCount = allIngredients.filter(
            ing => ing.stockStatus === 'low' || ing.stockStatus === 'out'
        ).length;

        res.json({
            totalRevenue,
            totalOrders,
            totalRecipes,
            totalInventory,
            lowStockCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get revenue trend (last 7 days)
router.get('/revenue-trend', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        const orders = await Order.find({
            status: 'completed',
            createdAt: { $gte: startDate }
        });

        // Group by date
        const trendData = {};
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            trendData[dateStr] = 0;
        }

        orders.forEach(order => {
            const dateStr = order.createdAt.toISOString().split('T')[0];
            if (trendData[dateStr] !== undefined) {
                trendData[dateStr] += order.total;
            }
        });

        const result = Object.keys(trendData)
            .sort()
            .map(date => ({
                date,
                revenue: trendData[date]
            }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get top selling products
router.get('/top-products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        
        // If no recipes with sales, return all recipes sorted by name
        let recipes = await Recipe.find({ totalSold: { $gt: 0 } })
            .sort({ totalSold: -1 })
            .limit(limit)
            .select('name totalSold sellingPrice category')
            .lean(); // Use lean to avoid virtual fields
        
        // If no sold recipes found, get any recipes
        if (!recipes || recipes.length === 0) {
            recipes = await Recipe.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(limit)
                .select('name totalSold sellingPrice category')
                .lean();
        }

        res.json(recipes);
    } catch (error) {
        console.error('Error in top-products:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

// Get ingredient usage statistics
router.get('/ingredient-usage', async (req, res) => {
    try {
        const ingredients = await Ingredient.find()
            .sort({ lastUpdated: -1 })
            .limit(10);

        const usage = ingredients.map(ing => ({
            name: ing.name,
            currentStock: ing.currentStock,
            unit: ing.unit,
            status: ing.stockStatus,
            value: ing.totalValue
        }));

        res.json(usage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get sales by category
router.get('/sales-by-category', async (req, res) => {
    try {
        const recipes = await Recipe.find({ totalSold: { $gt: 0 } });

        const categoryData = {};
        recipes.forEach(recipe => {
            if (!categoryData[recipe.category]) {
                categoryData[recipe.category] = {
                    count: 0,
                    revenue: 0
                };
            }
            categoryData[recipe.category].count += recipe.totalSold;
            categoryData[recipe.category].revenue += recipe.totalSold * recipe.sellingPrice;
        });

        const result = Object.keys(categoryData).map(category => ({
            category,
            count: categoryData[category].count,
            revenue: categoryData[category].revenue
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get recent orders
router.get('/recent-orders', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('items.recipe');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🆕 Customer Analytics
router.get('/customer-stats', async (req, res) => {
    try {
        const totalCustomers = await Customer.countDocuments({ isActive: true });
        const customers = await Customer.find({ isActive: true });

        // Tier distribution
        const tierCounts = {
            Regular: 0,
            Bronze: 0,
            Silver: 0,
            Gold: 0
        };

        let totalLoyaltyPoints = 0;
        customers.forEach(customer => {
            tierCounts[customer.tier]++;
            totalLoyaltyPoints += customer.loyaltyPoints;
        });

        // Average customer value
        const avgSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0) / (totalCustomers || 1);
        const avgOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0) / (totalCustomers || 1);

        res.json({
            totalCustomers,
            tierCounts,
            totalLoyaltyPoints,
            averageSpentPerCustomer: avgSpent,
            averageOrdersPerCustomer: avgOrders
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🆕 Profit Margin Analysis
router.get('/profit-analysis', async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('ingredients.ingredient');

        const profitData = recipes.map(recipe => {
            const revenue = recipe.totalSold * recipe.sellingPrice;
            const cost = recipe.totalSold * recipe.costPrice;
            const profit = revenue - cost;
            const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : 0;

            return {
                name: recipe.name,
                category: recipe.category,
                totalSold: recipe.totalSold,
                revenue,
                cost,
                profit,
                marginPercent: parseFloat(margin)
            };
        }).filter(item => item.totalSold > 0)
            .sort((a, b) => b.profit - a.profit);

        res.json(profitData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🆕 Loyalty Program Effectiveness
router.get('/loyalty-effectiveness', async (req, res) => {
    try {
        const orders = await Order.find({ loyaltyPointsEarned: { $gt: 0 } });

        const totalPointsEarned = orders.reduce((sum, order) => sum + order.loyaltyPointsEarned, 0);
        const totalPointsRedeemed = orders.reduce((sum, order) => sum + order.loyaltyPointsUsed, 0);
        const totalDiscount = orders.reduce((sum, order) => sum + order.discount, 0);
        const ordersWithLoyalty = orders.length;

        res.json({
            totalPointsEarned,
            totalPointsRedeemed,
            totalDiscountGiven: totalDiscount,
            ordersWithLoyalty,
            redemptionRate: totalPointsEarned > 0 ? ((totalPointsRedeemed / totalPointsEarned) * 100).toFixed(2) : 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// EXPENSE & PROFIT ANALYTICS

// Get expense summary
router.get('/expenses/summary', async (req, res) => {
    try {
        const PurchaseBill = (await import('../models/PurchaseBill.js')).default;

        // Total expenses (all time)
        const totalExpenses = await PurchaseBill.aggregate([
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        // Today's expenses
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayExpenses = await PurchaseBill.aggregate([
            { $match: { purchaseDate: { $gte: today } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        // This month's expenses
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthExpenses = await PurchaseBill.aggregate([
            { $match: { purchaseDate: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        // Total bills count
        const totalBills = await PurchaseBill.countDocuments();

        res.json({
            totalExpenses: totalExpenses[0]?.total || 0,
            todayExpenses: todayExpenses[0]?.total || 0,
            monthExpenses: monthExpenses[0]?.total || 0,
            totalBills
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get expense trend
router.get('/expenses/trend', async (req, res) => {
    try {
        const PurchaseBill = (await import('../models/PurchaseBill.js')).default;
        const days = parseInt(req.query.days) || 30;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        const expenses = await PurchaseBill.aggregate([
            { $match: { purchaseDate: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$purchaseDate' }
                    },
                    total: { $sum: '$total' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get complete profit analysis (Revenue - Expenses)
router.get('/profit-analysis-complete', async (req, res) => {
    try {
        const PurchaseBill = (await import('../models/PurchaseBill.js')).default;

        // Get revenue
        const revenueData = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        const totalRevenue = revenueData[0]?.total || 0;

        // Get expenses
        const expensesData = await PurchaseBill.aggregate([
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        const totalExpenses = expensesData[0]?.total || 0;

        // Calculate profit
        const profit = totalRevenue - totalExpenses;
        const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(2) : 0;

        // This month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthRevenue = await Order.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        const monthExpenses = await PurchaseBill.aggregate([
            { $match: { purchaseDate: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        const monthProfit = (monthRevenue[0]?.total || 0) - (monthExpenses[0]?.total || 0);

        res.json({
            totalRevenue,
            totalExpenses,
            profit,
            profitMargin: parseFloat(profitMargin),
            monthRevenue: monthRevenue[0]?.total || 0,
            monthExpenses: monthExpenses[0]?.total || 0,
            monthProfit
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get expense breakdown by supplier
router.get('/expenses/by-supplier', async (req, res) => {
    try {
        const PurchaseBill = (await import('../models/PurchaseBill.js')).default;

        const breakdown = await PurchaseBill.aggregate([
            {
                $group: {
                    _id: '$supplierName',
                    totalExpense: { $sum: '$total' },
                    billCount: { $sum: 1 }
                }
            },
            { $sort: { totalExpense: -1 } },
            { $limit: 10 }
        ]);

        res.json(breakdown);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

