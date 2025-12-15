import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';

// Import routes
import usersRouter from './routes/users.js';
import walletsRouter from './routes/wallets.js';
import categoriesRouter from './routes/categories.js';
import transactionsRouter from './routes/transactions.js';
import statsRouter from './routes/stats.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - must allow credentials for auth cookies
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

// Better Auth handler - MUST be before express.json()
app.all('/api/auth/*', toNodeHandler(auth));

// JSON parser for other routes
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/wallets', walletsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/stats', statsRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Saifu API server running on http://localhost:${PORT}`);
    console.log(`📚 Available endpoints:`);
    console.log(`   GET  /api/health`);
    console.log(`   POST /api/auth/sign-up`);
    console.log(`   POST /api/auth/sign-in`);
    console.log(`   GET  /api/auth/session`);
    console.log(`   GET  /api/wallets?userId=xxx`);
    console.log(`   GET  /api/transactions?userId=xxx`);
});
