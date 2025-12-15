import { db } from '../../lib/db';
import { categories } from '../../lib/schema';
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
        if (req.method === 'PUT') {
            const { name, icon, color } = req.body;

            const result = await db
                .update(categories)
                .set({
                    ...(name && { name }),
                    ...(icon && { icon }),
                    ...(color && { color }),
                })
                .where(eq(categories.id, id))
                .returning();

            if (result.length === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }

            return res.json(result[0]);
        }

        if (req.method === 'DELETE') {
            await db.delete(categories).where(eq(categories.id, id));
            return res.json({ message: 'Category deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Category API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
