import { db } from '../../lib/db.js';
import { transactions, wallets, categories } from '../../lib/schema.js';
import { eq, sql, gte, lte, and } from 'drizzle-orm';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, startDate, endDate } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        // Get total balance from all wallets
        const walletsData = await db
            .select({ totalBalance: sql`SUM(CAST(${wallets.balance} AS DECIMAL))` })
            .from(wallets)
            .where(eq(wallets.userId, userId));

        const netWorth = parseFloat(walletsData[0]?.totalBalance || 0);

        // Build date conditions
        const dateConditions = [];
        if (startDate) dateConditions.push(gte(transactions.transactionDate, startDate));
        if (endDate) dateConditions.push(lte(transactions.transactionDate, endDate));

        // Get income total
        const incomeData = await db
            .select({ total: sql`SUM(CAST(${transactions.amount} AS DECIMAL))` })
            .from(transactions)
            .innerJoin(wallets, eq(transactions.walletId, wallets.id))
            .where(and(eq(wallets.userId, userId), eq(transactions.type, 'income'), ...dateConditions));

        const totalIncome = parseFloat(incomeData[0]?.total || 0);

        // Get expense total
        const expenseData = await db
            .select({ total: sql`SUM(CAST(${transactions.amount} AS DECIMAL))` })
            .from(transactions)
            .innerJoin(wallets, eq(transactions.walletId, wallets.id))
            .where(and(eq(wallets.userId, userId), eq(transactions.type, 'expense'), ...dateConditions));

        const totalExpenses = parseFloat(expenseData[0]?.total || 0);

        // Get spending by category
        const spendingByCategory = await db
            .select({
                categoryId: categories.id,
                categoryName: categories.name,
                categoryIcon: categories.icon,
                categoryColor: categories.color,
                total: sql`SUM(CAST(${transactions.amount} AS DECIMAL))`,
            })
            .from(transactions)
            .innerJoin(wallets, eq(transactions.walletId, wallets.id))
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(and(eq(wallets.userId, userId), eq(transactions.type, 'expense'), ...dateConditions))
            .groupBy(categories.id, categories.name, categories.icon, categories.color);

        // Get monthly income vs expenses (last 6 months)
        const monthlyStats = await db
            .select({
                month: sql`TO_CHAR(${transactions.transactionDate}, 'YYYY-MM')`,
                type: transactions.type,
                total: sql`SUM(CAST(${transactions.amount} AS DECIMAL))`,
            })
            .from(transactions)
            .innerJoin(wallets, eq(transactions.walletId, wallets.id))
            .where(and(
                eq(wallets.userId, userId),
                gte(transactions.transactionDate, sql`CURRENT_DATE - INTERVAL '6 months'`)
            ))
            .groupBy(sql`TO_CHAR(${transactions.transactionDate}, 'YYYY-MM')`, transactions.type)
            .orderBy(sql`TO_CHAR(${transactions.transactionDate}, 'YYYY-MM')`);

        // Process monthly stats
        const monthlyMap = {};
        monthlyStats.forEach(stat => {
            if (!monthlyMap[stat.month]) {
                monthlyMap[stat.month] = { month: stat.month, income: 0, expenses: 0 };
            }
            if (stat.type === 'income') {
                monthlyMap[stat.month].income = parseFloat(stat.total);
            } else if (stat.type === 'expense') {
                monthlyMap[stat.month].expenses = parseFloat(stat.total);
            }
        });

        const monthlyData = Object.values(monthlyMap);

        return res.json({
            netWorth,
            totalIncome,
            totalExpenses,
            savings: totalIncome - totalExpenses,
            spendingByCategory: spendingByCategory.map(s => ({ ...s, total: parseFloat(s.total) })),
            monthlyData,
        });
    } catch (error) {
        console.error('Stats API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
