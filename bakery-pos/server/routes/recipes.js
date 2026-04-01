import express from 'express';
import Recipe from '../models/Recipe.js';

const router = express.Router();

// Get all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('ingredients.ingredient')
            .sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single recipe
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('ingredients.ingredient');
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create recipe
router.post('/', async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save();
        await recipe.populate('ingredients.ingredient');
        res.status(201).json(recipe);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update recipe
router.put('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Update fields
        Object.assign(recipe, req.body);
        
        // Save to trigger pre-save hook for production cost calculation
        await recipe.save();
        
        // Populate ingredients for response
        await recipe.populate('ingredients.ingredient');
        
        res.json(recipe);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete recipe
router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check if recipe can be made
router.get('/:id/can-make', async (req, res) => {
    try {
        const { quantity } = req.query;
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const result = await recipe.canMake(parseInt(quantity) || 1);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get top selling recipes
router.get('/analytics/top-selling', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const recipes = await Recipe.find()
            .sort({ totalSold: -1 })
            .limit(limit)
            .populate('ingredients.ingredient');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
