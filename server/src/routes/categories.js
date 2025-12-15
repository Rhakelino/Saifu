import express from 'express';
import { db } from '../db/index.js';
import { categories } from '../db/schema.js';
import { eq, and, isNull, or } from 'drizzle-orm';

const router = express.Router();

// Get all categories for a user (including default categories)
router.get('/', async (req, res) => {
    try {
        const { userId, type } = req.query;

        let query = db.select().from(categories);

        if (userId) {
            // Get user's custom categories + default categories
            query = query.where(
                or(eq(categories.userId, userId), isNull(categories.userId))
            );
        }

        if (type) {
            query = query.where(eq(categories.type, type));
        }

        const result = await query;
        res.json(result);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Create new category
router.post('/', async (req, res) => {
    try {
        const { userId, name, icon, type, color } = req.body;

        if (!name || !type) {
            return res.status(400).json({ error: 'name and type are required' });
        }

        const result = await db
            .insert(categories)
            .values({
                userId: userId || null,
                name,
                icon: icon || 'category',
                type,
                color: color || '#6b7280',
            })
            .returning();

        res.status(201).json(result[0]);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// Update category
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, icon, type, color } = req.body;

        const result = await db
            .update(categories)
            .set({
                ...(name && { name }),
                ...(icon && { icon }),
                ...(type && { type }),
                ...(color && { color }),
            })
            .where(eq(categories.id, id))
            .returning();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// Delete category
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db
            .delete(categories)
            .where(eq(categories.id, id))
            .returning();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

export default router;
