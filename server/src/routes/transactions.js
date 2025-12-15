import express from 'express';
import { db } from '../db/index.js';
import { transactions, wallets, categories } from '../db/schema.js';
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';

const router = express.Router();

// Get all transactions with filters
router.get('/', async (req, res) => {
    try {
        const { userId, walletId, categoryId, type, startDate, endDate, limit = 50, offset = 0 } = req.query;

        // Build conditions array
        const conditions = [];

        if (walletId) {
            conditions.push(eq(transactions.walletId, walletId));
        }

        if (categoryId) {
            conditions.push(eq(transactions.categoryId, categoryId));
        }

        if (type) {
            conditions.push(eq(transactions.type, type));
        }

        if (startDate) {
            conditions.push(gte(transactions.transactionDate, startDate));
        }

        if (endDate) {
            conditions.push(lte(transactions.transactionDate, endDate));
        }

        // If userId is provided, filter by wallets owned by user
        let result;
        if (userId) {
            result = await db
                .select({
                    id: transactions.id,
                    walletId: transactions.walletId,
                    categoryId: transactions.categoryId,
                    toWalletId: transactions.toWalletId,
                    type: transactions.type,
                    amount: transactions.amount,
                    description: transactions.description,
                    note: transactions.note,
                    transactionDate: transactions.transactionDate,
                    createdAt: transactions.createdAt,
                    walletName: wallets.name,
                    walletIcon: wallets.icon,
                    categoryName: categories.name,
                    categoryIcon: categories.icon,
                    categoryColor: categories.color,
                })
                .from(transactions)
                .leftJoin(wallets, eq(transactions.walletId, wallets.id))
                .leftJoin(categories, eq(transactions.categoryId, categories.id))
                .where(and(eq(wallets.userId, userId), ...conditions))
                .orderBy(desc(transactions.transactionDate))
                .limit(parseInt(limit))
                .offset(parseInt(offset));
        } else {
            result = await db
                .select()
                .from(transactions)
                .where(conditions.length > 0 ? and(...conditions) : undefined)
                .orderBy(desc(transactions.transactionDate))
                .limit(parseInt(limit))
                .offset(parseInt(offset));
        }

        res.json(result);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Get single transaction by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db
            .select({
                id: transactions.id,
                walletId: transactions.walletId,
                categoryId: transactions.categoryId,
                toWalletId: transactions.toWalletId,
                type: transactions.type,
                amount: transactions.amount,
                description: transactions.description,
                note: transactions.note,
                transactionDate: transactions.transactionDate,
                createdAt: transactions.createdAt,
                walletName: wallets.name,
                categoryName: categories.name,
                categoryIcon: categories.icon,
            })
            .from(transactions)
            .leftJoin(wallets, eq(transactions.walletId, wallets.id))
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(eq(transactions.id, id));

        if (result.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ error: 'Failed to fetch transaction' });
    }
});

// Create new transaction
router.post('/', async (req, res) => {
    try {
        const { walletId, categoryId, toWalletId, type, amount, description, note, transactionDate } = req.body;

        if (!walletId || !type || !amount || !transactionDate) {
            return res.status(400).json({ error: 'walletId, type, amount, and transactionDate are required' });
        }

        // Start transaction to update wallet balance
        const result = await db
            .insert(transactions)
            .values({
                walletId,
                categoryId: categoryId || null,
                toWalletId: toWalletId || null,
                type,
                amount,
                description,
                note,
                transactionDate,
            })
            .returning();

        // Update wallet balance based on transaction type
        const amountValue = parseFloat(amount);

        if (type === 'income') {
            await db
                .update(wallets)
                .set({
                    balance: sql`${wallets.balance} + ${amountValue}`,
                })
                .where(eq(wallets.id, walletId));
        } else if (type === 'expense') {
            await db
                .update(wallets)
                .set({
                    balance: sql`${wallets.balance} - ${amountValue}`,
                })
                .where(eq(wallets.id, walletId));
        } else if (type === 'transfer' && toWalletId) {
            // Deduct from source wallet
            await db
                .update(wallets)
                .set({
                    balance: sql`${wallets.balance} - ${amountValue}`,
                })
                .where(eq(wallets.id, walletId));

            // Add to destination wallet
            await db
                .update(wallets)
                .set({
                    balance: sql`${wallets.balance} + ${amountValue}`,
                })
                .where(eq(wallets.id, toWalletId));
        }

        res.status(201).json(result[0]);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

// Update transaction
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, description, note, transactionDate } = req.body;

        // Note: Updating amount/type would require reversing old balance changes
        // For simplicity, only allow updating non-financial fields

        const result = await db
            .update(transactions)
            .set({
                ...(categoryId && { categoryId }),
                ...(description && { description }),
                ...(note !== undefined && { note }),
                ...(transactionDate && { transactionDate }),
            })
            .where(eq(transactions.id, id))
            .returning();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get the transaction first to reverse the balance
        const existingTx = await db
            .select()
            .from(transactions)
            .where(eq(transactions.id, id));

        if (existingTx.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const tx = existingTx[0];
        const amountValue = parseFloat(tx.amount);

        // Reverse the balance change
        if (tx.type === 'income') {
            await db
                .update(wallets)
                .set({
                    balance: sql`${wallets.balance} - ${amountValue}`,
                })
                .where(eq(wallets.id, tx.walletId));
        } else if (tx.type === 'expense') {
            await db
                .update(wallets)
                .set({
                    balance: sql`${wallets.balance} + ${amountValue}`,
                })
                .where(eq(wallets.id, tx.walletId));
        } else if (tx.type === 'transfer' && tx.toWalletId) {
            // Reverse: add back to source, deduct from destination
            await db
                .update(wallets)
                .set({
                    balance: sql`${wallets.balance} + ${amountValue}`,
                })
                .where(eq(wallets.id, tx.walletId));

            await db
                .update(wallets)
                .set({
                    balance: sql`${wallets.balance} - ${amountValue}`,
                })
                .where(eq(wallets.id, tx.toWalletId));
        }

        // Delete the transaction
        await db
            .delete(transactions)
            .where(eq(transactions.id, id));

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
});

export default router;
