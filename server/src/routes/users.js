import express from 'express';
import { db } from '../db/index.js';
import { user } from '../db/auth-schema.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
    try {
        const result = await db.select().from(user);
        res.json(result);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.select().from(user).where(eq(user.id, id));

        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Note: User creation/update/delete is now handled by Better Auth
// POST /api/auth/sign-up - Register
// POST /api/auth/sign-in - Login
// POST /api/auth/sign-out - Logout

export default router;
