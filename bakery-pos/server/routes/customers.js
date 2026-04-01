import express from 'express';
import Customer from '../models/Customer.js';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
    try {
        const { search, tier, active } = req.query;
        let query = {};

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Active filter
        if (active !== undefined) {
            query.isActive = active === 'true';
        }

        let customers = await Customer.find(query).sort({ createdAt: -1 });

        // Filter by tier (virtual field)
        if (tier) {
            customers = customers.filter(c => c.tier === tier);
        }

        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get customer by phone
router.get('/phone/:phone', async (req, res) => {
    try {
        const customer = await Customer.findOne({ phone: req.params.phone });
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new customer
router.post('/', async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Phone number already exists' });
        }
        res.status(400).json({ error: error.message });
    }
});

// Update customer
router.put('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete customer
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add loyalty points
router.post('/:id/points/add', async (req, res) => {
    try {
        const { orderTotal } = req.body;
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const pointsEarned = customer.addPoints(orderTotal);
        customer.recordPurchase(orderTotal);
        await customer.save();

        res.json({
            customer,
            pointsEarned,
            message: `Earned ${pointsEarned} loyalty points!`
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Redeem loyalty points
router.post('/:id/points/redeem', async (req, res) => {
    try {
        const { points } = req.body;
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const discount = customer.redeemPoints(points);
        await customer.save();

        res.json({
            customer,
            discount,
            message: `Redeemed ${points} points for ₹${discount} discount`
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get top customers
router.get('/analytics/top', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const customers = await Customer.find({ isActive: true })
            .sort({ totalSpent: -1 })
            .limit(limit);
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
