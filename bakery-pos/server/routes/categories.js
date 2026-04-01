import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Get single category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});

// Create new category
router.post('/', async (req, res) => {
    try {
        const { name, description, icon, color } = req.body;

        // Check if category already exists
        const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existing) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        const category = new Category({
            name,
            description,
            icon: icon || '📦',
            color: color || '#3B82F6'
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// Update category
router.put('/:id', async (req, res) => {
    try {
        const { name, description, icon, color, isActive } = req.body;

        // If changing name, check for duplicates
        if (name) {
            const existing = await Category.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: req.params.id }
            });
            if (existing) {
                return res.status(400).json({ error: 'Category name already exists' });
            }
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description, icon, color, isActive },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// Delete category
router.delete('/:id', async (req, res) => {
    try {
        // Check if any recipes use this category
        const Recipe = (await import('../models/Recipe.js')).default;
        const recipesCount = await Recipe.countDocuments({ category: req.params.id });

        if (recipesCount > 0) {
            return res.status(400).json({
                error: 'Cannot delete category',
                message: `${recipesCount} recipe(s) are using this category. Please reassign them first.`
            });
        }

        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully', category });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

export default router;
