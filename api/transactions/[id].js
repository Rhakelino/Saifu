import { db } from '../../lib/db.js';
import { transactions, wallets, categories } from '../../lib/schema.js';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query;

    try {
        if (req.method === 'GET') {
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

            return res.json(result[0]);
        }

        if (req.method === 'PUT') {
            const { categoryId, description, note, transactionDate } = req.body;

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

            return res.json(result[0]);
        }

        if (req.method === 'DELETE') {
            const existingTx = await db.select().from(transactions).where(eq(transactions.id, id));

            if (existingTx.length === 0) {
                return res.status(404).json({ error: 'Transaction not found' });
            }

            const tx = existingTx[0];
            const amountValue = parseFloat(tx.amount);

            // Reverse the balance change
            if (tx.type === 'income') {
                await db.update(wallets).set({ balance: sql`${wallets.balance} - ${amountValue}` }).where(eq(wallets.id, tx.walletId));
            } else if (tx.type === 'expense') {
                await db.update(wallets).set({ balance: sql`${wallets.balance} + ${amountValue}` }).where(eq(wallets.id, tx.walletId));
            } else if (tx.type === 'transfer' && tx.toWalletId) {
                await db.update(wallets).set({ balance: sql`${wallets.balance} + ${amountValue}` }).where(eq(wallets.id, tx.walletId));
                await db.update(wallets).set({ balance: sql`${wallets.balance} - ${amountValue}` }).where(eq(wallets.id, tx.toWalletId));
            }

            await db.delete(transactions).where(eq(transactions.id, id));
            return res.json({ message: 'Transaction deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Transaction API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
