import express from 'express';
import Bill from '../models/Bill.js';

const router = express.Router();

// Get all bills
router.get('/', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        if (startDate || endDate) {
            query.issuedDate = {};
            if (startDate) query.issuedDate.$gte = new Date(startDate);
            if (endDate) query.issuedDate.$lte = new Date(endDate);
        }

        const bills = await Bill.find(query)
            .populate('order')
            .sort({ issuedDate: -1 });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single bill
router.get('/:id', async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id).populate('order');
        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.json(bill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bill by bill number
router.get('/number/:billNumber', async (req, res) => {
    try {
        const bill = await Bill.findOne({ billNumber: req.params.billNumber })
            .populate('order');
        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.json(bill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete bill
router.delete('/:id', async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);
        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
