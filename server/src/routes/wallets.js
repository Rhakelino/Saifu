import express from 'express';
import { db } from '../db/index.js';
import { wallets } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Get all wallets for a user
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const result = await db
            .select()
            .from(wallets)
            .where(eq(wallets.userId, userId));

        res.json(result);
    } catch (error) {
        console.error('Error fetching wallets:', error);
        res.status(500).json({ error: 'Failed to fetch wallets' });
    }
});

// Get single wallet by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db
            .select()
            .from(wallets)
            .where(eq(wallets.id, id));

        if (result.length === 0) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error fetching wallet:', error);
        res.status(500).json({ error: 'Failed to fetch wallet' });
    }
});

// Create new wallet
router.post('/', async (req, res) => {
    try {
        const { userId, name, type, balance, icon, accountNumber, color } = req.body;

        if (!userId || !name) {
            return res.status(400).json({ error: 'userId and name are required' });
        }

        const result = await db
            .insert(wallets)
            .values({
                userId,
                name,
                type: type || 'bank',
                balance: balance || '0',
                icon: icon || 'account_balance',
                accountNumber,
                color: color || '#1e1e1e',
            })
            .returning();

        res.status(201).json(result[0]);
    } catch (error) {
        console.error('Error creating wallet:', error);
        res.status(500).json({ error: 'Failed to create wallet' });
    }
});

// Update wallet
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, balance, icon, accountNumber, color } = req.body;

        const result = await db
            .update(wallets)
            .set({
                ...(name && { name }),
                ...(type && { type }),
                ...(balance !== undefined && { balance }),
                ...(icon && { icon }),
                ...(accountNumber && { accountNumber }),
                ...(color && { color }),
            })
            .where(eq(wallets.id, id))
            .returning();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error updating wallet:', error);
        res.status(500).json({ error: 'Failed to update wallet' });
    }
});

// Delete wallet
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db
            .delete(wallets)
            .where(eq(wallets.id, id))
            .returning();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        res.json({ message: 'Wallet deleted successfully' });
    } catch (error) {
        console.error('Error deleting wallet:', error);
        res.status(500).json({ error: 'Failed to delete wallet' });
    }
});

export default router;
