import { db } from '../../lib/db.js';
import { categories } from '../../lib/schema.js';
import { eq } from 'drizzle-orm';

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
            const { userId, type } = req.query;

            if (!userId) {
                return res.status(400).json({ error: 'userId is required' });
            }

            let result;
            if (type) {
                result = await db.select().from(categories).where(eq(categories.userId, userId)).where(eq(categories.type, type));
            } else {
                result = await db.select().from(categories).where(eq(categories.userId, userId));
            }

            return res.json(result);
        }

        if (req.method === 'POST') {
            const { userId, name, icon, type, color } = req.body;

            if (!userId || !name || !type) {
                return res.status(400).json({ error: 'userId, name, and type are required' });
            }

            const result = await db
                .insert(categories)
                .values({
                    userId,
                    name,
                    icon: icon || 'category',
                    type,
                    color: color || '#6b7280',
                })
                .returning();

            return res.status(201).json(result[0]);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Categories API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
