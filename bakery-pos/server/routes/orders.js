import express from 'express';
import Order from '../models/Order.js';
import Recipe from '../models/Recipe.js';
import Bill from '../models/Bill.js';
import Customer from '../models/Customer.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const orders = await Order.find(query)
            .populate('items.recipe')
            .populate('customer')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.recipe')
            .populate('customer');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create order (with automatic ingredient deduction, bill generation, and loyalty integration)
router.post('/', async (req, res) => {
    try {
        const { customerName, customerPhone, customerId, items, paymentMethod, notes, loyaltyPointsToRedeem, packingCharges } = req.body;

        // Look up or create customer if phone provided
        let customer = null;
        if (customerId) {
            customer = await Customer.findById(customerId);
        } else if (customerPhone) {
            customer = await Customer.findOne({ phone: customerPhone });
        }

        // Calculate totals
        let subtotal = 0;
        const orderItems = [];

        // Validate and prepare items
        for (const item of items) {
            const recipe = await Recipe.findById(item.recipeId);
            if (!recipe) {
                return res.status(404).json({ error: `Recipe not found: ${item.recipeId}` });
            }

            // Check if recipe can be made
            const canMake = await recipe.canMake(item.quantity);
            if (!canMake.canMake) {
                return res.status(400).json({
                    error: 'Insufficient stock',
                    details: canMake.missing
                });
            }

            const itemSubtotal = recipe.sellingPrice * item.quantity;
            subtotal += itemSubtotal;

            orderItems.push({
                recipe: recipe._id,
                recipeName: recipe.name,
                quantity: item.quantity,
                pricePerUnit: recipe.sellingPrice,
                subtotal: itemSubtotal
            });
        }

        // Calculate discount from loyalty points (100 points = ₹100 discount)
        let discount = 0;
        let pointsUsed = 0;
        if (customer && loyaltyPointsToRedeem && loyaltyPointsToRedeem > 0) {
            if (loyaltyPointsToRedeem > customer.loyaltyPoints) {
                return res.status(400).json({
                    error: 'Insufficient loyalty points',
                    available: customer.loyaltyPoints,
                    requested: loyaltyPointsToRedeem
                });
            }
            discount = loyaltyPointsToRedeem; // 1:1 ratio (100 points = ₹100)
            pointsUsed = loyaltyPointsToRedeem;
        }

        // Calculate tax and total with discount
        const discountedSubtotal = Math.max(0, subtotal - discount);
        const packing = parseFloat(packingCharges) || 0;
        const tax = 0; // Tax-free system
        const total = discountedSubtotal + packing; // No tax added

        // Calculate loyalty points earned (1 point per ₹100 spent)
        const pointsEarned = customer ? Math.floor(total / 100) : 0;

        // Create order
        const order = new Order({
            customer: customer?._id || null,
            customerName: customer?.name || customerName || 'Walk-in Customer',
            customerPhone: customer?.phone || customerPhone || null,
            items: orderItems,
            subtotal,
            discount,
            packingCharges: packing,
            tax,
            taxPercentage,
            total,
            loyaltyPointsUsed: pointsUsed,
            loyaltyPointsEarned: pointsEarned,
            status: 'completed',
            paymentMethod: paymentMethod || 'cash',
            notes
        });

        await order.save();

        // Update customer if exists
        if (customer) {
            // Redeem points if used
            if (pointsUsed > 0) {
                customer.redeemPoints(pointsUsed);
            }
            // Add earned points and record purchase
            if (pointsEarned > 0) {
                customer.addPoints(total);
            }
            customer.recordPurchase(total);
            await customer.save();
        }

        // Deduct ingredients from stock
        for (const item of items) {
            const recipe = await Recipe.findById(item.recipeId);
            await recipe.deductIngredients(item.quantity);
        }

        // Generate bill
        const bill = new Bill({
            order: order._id,
            customerName: order.customerName,
            items: orderItems.map(item => ({
                name: item.recipeName,
                quantity: item.quantity,
                price: item.pricePerUnit,
                total: item.subtotal
            })),
            subtotal: order.subtotal,
            packingCharges: order.packingCharges,
            tax: order.tax,
            total: order.total,
            paymentMethod: order.paymentMethod
        });

        await bill.save();

        // Populate and return order with bill
        await order.populate('items.recipe');
        await order.populate('customer');

        res.status(201).json({
            order,
            bill,
            loyaltyInfo: customer ? {
                pointsUsed,
                pointsEarned,
                newBalance: customer.loyaltyPoints,
                tier: customer.tier,
                discount
            } : null
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('items.recipe');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
