import { db } from '../../lib/db';
import { wallets } from '../../lib/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            // Get all wallets for a user
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ error: 'userId is required' });
            }

            const result = await db
                .select()
                .from(wallets)
                .where(eq(wallets.userId, userId));

            return res.json(result);
        }

        if (req.method === 'POST') {
            // Create new wallet
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

            return res.status(201).json(result[0]);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Wallets API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
