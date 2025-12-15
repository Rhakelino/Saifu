import { db } from '../../lib/db';
import { wallets } from '../../lib/schema';
import { eq } from 'drizzle-orm';

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
            const result = await db.select().from(wallets).where(eq(wallets.id, id));

            if (result.length === 0) {
                return res.status(404).json({ error: 'Wallet not found' });
            }

            return res.json(result[0]);
        }

        if (req.method === 'PUT') {
            const { name, type, balance, icon, accountNumber, color } = req.body;

            const result = await db
                .update(wallets)
                .set({
                    ...(name && { name }),
                    ...(type && { type }),
                    ...(balance !== undefined && { balance }),
                    ...(icon && { icon }),
                    ...(accountNumber !== undefined && { accountNumber }),
                    ...(color && { color }),
                })
                .where(eq(wallets.id, id))
                .returning();

            if (result.length === 0) {
                return res.status(404).json({ error: 'Wallet not found' });
            }

            return res.json(result[0]);
        }

        if (req.method === 'DELETE') {
            await db.delete(wallets).where(eq(wallets.id, id));
            return res.json({ message: 'Wallet deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Wallet API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
