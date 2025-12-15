import { db } from '../../lib/db';
import { transactions, wallets, categories } from '../../lib/schema';
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const { userId, walletId, categoryId, type, startDate, endDate, limit = 50, offset = 0 } = req.query;

            const conditions = [];
            if (walletId) conditions.push(eq(transactions.walletId, walletId));
            if (categoryId) conditions.push(eq(transactions.categoryId, categoryId));
            if (type) conditions.push(eq(transactions.type, type));
            if (startDate) conditions.push(gte(transactions.transactionDate, startDate));
            if (endDate) conditions.push(lte(transactions.transactionDate, endDate));

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

            return res.json(result);
        }

        if (req.method === 'POST') {
            const { walletId, categoryId, toWalletId, type, amount, description, note, transactionDate } = req.body;

            if (!walletId || !type || !amount || !transactionDate) {
                return res.status(400).json({ error: 'walletId, type, amount, and transactionDate are required' });
            }

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

            const amountValue = parseFloat(amount);

            if (type === 'income') {
                await db.update(wallets).set({ balance: sql`${wallets.balance} + ${amountValue}` }).where(eq(wallets.id, walletId));
            } else if (type === 'expense') {
                await db.update(wallets).set({ balance: sql`${wallets.balance} - ${amountValue}` }).where(eq(wallets.id, walletId));
            } else if (type === 'transfer' && toWalletId) {
                await db.update(wallets).set({ balance: sql`${wallets.balance} - ${amountValue}` }).where(eq(wallets.id, walletId));
                await db.update(wallets).set({ balance: sql`${wallets.balance} + ${amountValue}` }).where(eq(wallets.id, toWalletId));
            }

            return res.status(201).json(result[0]);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Transactions API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
