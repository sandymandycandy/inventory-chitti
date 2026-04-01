import express from 'express';
import Ingredient from '../models/Ingredient.js';

const router = express.Router();

// Get all ingredients
router.get('/', async (req, res) => {
    try {
        const ingredients = await Ingredient.find().sort({ name: 1 });
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single ingredient
router.get('/:id', async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id);
        if (!ingredient) {
            return res.status(404).json({ error: 'Ingredient not found' });
        }
        res.json(ingredient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create ingredient
router.post('/', async (req, res) => {
    try {
        const ingredient = new Ingredient(req.body);
        await ingredient.save();
        res.status(201).json(ingredient);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Ingredient with this name already exists' });
        }
        res.status(400).json({ error: error.message });
    }
});

// Update ingredient
router.put('/:id', async (req, res) => {
    try {
        const ingredient = await Ingredient.findByIdAndUpdate(
            req.params.id,
            { ...req.body, lastUpdated: Date.now() },
            { new: true, runValidators: true }
        );
        if (!ingredient) {
            return res.status(404).json({ error: 'Ingredient not found' });
        }
        res.json(ingredient);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Ingredient with this name already exists' });
        }
        res.status(400).json({ error: error.message });
    }
});

// Update stock
router.patch('/:id/stock', async (req, res) => {
    try {
        const { quantity, operation } = req.body;
        const ingredient = await Ingredient.findById(req.params.id);

        if (!ingredient) {
            return res.status(404).json({ error: 'Ingredient not found' });
        }

        await ingredient.updateStock(quantity, operation);
        res.json(ingredient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete ingredient
router.delete('/:id', async (req, res) => {
    try {
        const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
        if (!ingredient) {
            return res.status(404).json({ error: 'Ingredient not found' });
        }
        res.json({ message: 'Ingredient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get low stock ingredients
router.get('/status/low-stock', async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        const lowStock = ingredients.filter(ing => ing.stockStatus === 'low' || ing.stockStatus === 'out');
        res.json(lowStock);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
