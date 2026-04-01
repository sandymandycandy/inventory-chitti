import express from 'express';
import PurchaseBill from '../models/PurchaseBill.js';
import Ingredient from '../models/Ingredient.js';
import Recipe from '../models/Recipe.js';

const router = express.Router();

// Helper function to recalculate production costs for recipes using updated ingredients
async function recalculateRecipeCosts(ingredientIds) {
    try {
        // Find all recipes that use any of the updated ingredients
        const recipes = await Recipe.find({
            'ingredients.ingredient': { $in: ingredientIds }
        }).populate('ingredients.ingredient');

        // Recalculate production cost for each recipe
        for (const recipe of recipes) {
            let totalCost = 0;
            
            for (const item of recipe.ingredients) {
                if (item.ingredient && item.ingredient.costPerUnit) {
                    totalCost += item.quantity * item.ingredient.costPerUnit;
                }
            }
            
            recipe.productionCost = totalCost;
            await recipe.save();
        }

        console.log(`✅ Updated production costs for ${recipes.length} recipes`);
    } catch (error) {
        console.error('Error recalculating recipe costs:', error);
    }
}

// Get all purchase bills
router.get('/', async (req, res) => {
    try {
        const { status, supplier, startDate, endDate } = req.query;

        let query = {};
        if (status) query.paymentStatus = status;
        if (supplier) query.supplierName = { $regex: supplier, $options: 'i' };
        if (startDate || endDate) {
            query.purchaseDate = {};
            if (startDate) query.purchaseDate.$gte = new Date(startDate);
            if (endDate) query.purchaseDate.$lte = new Date(endDate);
        }

        const bills = await PurchaseBill.find(query)
            .populate('items.ingredient')
            .sort({ purchaseDate: -1 });

        res.json(bills);
    } catch (error) {
        console.error('Error fetching purchase bills:', error);
        res.status(500).json({ error: 'Failed to fetch purchase bills' });
    }
});

// Get single purchase bill
router.get('/:id', async (req, res) => {
    try {
        const bill = await PurchaseBill.findById(req.params.id)
            .populate('items.ingredient');

        if (!bill) {
            return res.status(404).json({ error: 'Purchase bill not found' });
        }

        res.json(bill);
    } catch (error) {
        console.error('Error fetching purchase bill:', error);
        res.status(500).json({ error: 'Failed to fetch purchase bill' });
    }
});

// Create new purchase bill
router.post('/', async (req, res) => {
    try {
        const { supplierName, supplierPhone, supplierAddress, items, paymentStatus, paymentMethod, notes, updateStock } = req.body;

        // Validate and prepare items
        let subtotal = 0;
        const billItems = [];

        for (const item of items) {
            const ingredient = await Ingredient.findById(item.ingredientId);
            if (!ingredient) {
                return res.status(404).json({ error: `Ingredient not found: ${item.ingredientId}` });
            }

            const itemTotal = item.quantity * item.pricePerUnit;
            subtotal += itemTotal;

            billItems.push({
                ingredient: ingredient._id,
                ingredientName: ingredient.name,
                quantity: item.quantity,
                unit: ingredient.unit,
                pricePerUnit: item.pricePerUnit,
                totalPrice: itemTotal
            });
        }

        const tax = 0; // Tax-free system
        const total = subtotal;

        // Create purchase bill
        const purchaseBill = new PurchaseBill({
            supplierName,
            supplierPhone: supplierPhone || '',
            supplierAddress: supplierAddress || '',
            items: billItems,
            subtotal,
            tax,
            total,
            paymentStatus: paymentStatus || 'Pending',
            paymentMethod: paymentMethod || 'Cash',
            notes: notes || '',
            stockUpdated: false
        });

        await purchaseBill.save();

        // Update stock if requested
        if (updateStock) {
            for (const item of billItems) {
                // Update stock quantity AND cost per unit
                await Ingredient.findByIdAndUpdate(
                    item.ingredient,
                    { 
                        $inc: { currentStock: item.quantity },
                        $set: { 
                            costPerUnit: item.pricePerUnit,
                            lastUpdated: new Date()
                        }
                    }
                );
            }
            purchaseBill.stockUpdated = true;
            await purchaseBill.save();

            // Recalculate production costs for all affected recipes
            await recalculateRecipeCosts(billItems.map(item => item.ingredient));
        }

        const populatedBill = await PurchaseBill.findById(purchaseBill._id)
            .populate('items.ingredient');

        res.status(201).json(populatedBill);
    } catch (error) {
        console.error('Error creating purchase bill:', error);
        res.status(500).json({ error: 'Failed to create purchase bill' });
    }
});

// Update purchase bill
router.put('/:id', async (req, res) => {
    try {
        const { paymentStatus, paymentMethod, notes } = req.body;

        const bill = await PurchaseBill.findByIdAndUpdate(
            req.params.id,
            { paymentStatus, paymentMethod, notes },
            { new: true, runValidators: true }
        ).populate('items.ingredient');

        if (!bill) {
            return res.status(404).json({ error: 'Purchase bill not found' });
        }

        res.json(bill);
    } catch (error) {
        console.error('Error updating purchase bill:', error);
        res.status(500).json({ error: 'Failed to update purchase bill' });
    }
});

// Update stock from existing bill
router.post('/:id/update-stock', async (req, res) => {
    try {
        const bill = await PurchaseBill.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({ error: 'Purchase bill not found' });
        }

        if (bill.stockUpdated) {
            return res.status(400).json({ error: 'Stock already updated for this bill' });
        }

        // Update stock for all items
        for (const item of bill.items) {
            await Ingredient.findByIdAndUpdate(
                item.ingredient,
                { 
                    $inc: { currentStock: item.quantity },
                    $set: { 
                        costPerUnit: item.pricePerUnit,
                        lastUpdated: new Date()
                    }
                }
            );
        }

        bill.stockUpdated = true;
        await bill.save();

        // Recalculate production costs for all affected recipes
        await recalculateRecipeCosts(bill.items.map(item => item.ingredient));

        const updatedBill = await PurchaseBill.findById(bill._id)
            .populate('items.ingredient');

        res.json(updatedBill);
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ error: 'Failed to update stock' });
    }
});

// Delete purchase bill
router.delete('/:id', async (req, res) => {
    try {
        const bill = await PurchaseBill.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({ error: 'Purchase bill not found' });
        }

        if (bill.stockUpdated) {
            return res.status(400).json({
                error: 'Cannot delete bill with updated stock',
                message: 'Please manually adjust inventory before deleting'
            });
        }

        await PurchaseBill.findByIdAndDelete(req.params.id);
        res.json({ message: 'Purchase bill deleted successfully' });
    } catch (error) {
        console.error('Error deleting purchase bill:', error);
        res.status(500).json({ error: 'Failed to delete purchase bill' });
    }
});

// Get purchase statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const totalBills = await PurchaseBill.countDocuments();
        const pendingBills = await PurchaseBill.countDocuments({ paymentStatus: 'Pending' });

        const totalExpense = await PurchaseBill.aggregate([
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        const pendingAmount = await PurchaseBill.aggregate([
            { $match: { paymentStatus: { $in: ['Pending', 'Partial'] } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        res.json({
            totalBills,
            pendingBills,
            totalExpense: totalExpense[0]?.total || 0,
            pendingAmount: pendingAmount[0]?.total || 0
        });
    } catch (error) {
        console.error('Error fetching purchase stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

export default router;
