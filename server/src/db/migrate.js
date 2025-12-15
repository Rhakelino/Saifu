import 'dotenv/config';
import { db } from './index.js';
import { sql } from 'drizzle-orm';

async function migrate() {
    console.log('🔄 Migrating database schema for Better Auth compatibility...');

    try {
        // Drop existing tables that reference old users table
        console.log('Dropping old tables...');

        await db.execute(sql`DROP TABLE IF EXISTS transactions CASCADE`);
        console.log('✓ Dropped transactions');

        await db.execute(sql`DROP TABLE IF EXISTS categories CASCADE`);
        console.log('✓ Dropped categories');

        await db.execute(sql`DROP TABLE IF EXISTS wallets CASCADE`);
        console.log('✓ Dropped wallets');

        await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
        console.log('✓ Dropped old users table');

        console.log('');
        console.log('✅ Old tables dropped. Now run: npm run db:push');
        console.log('   This will recreate tables with Better Auth compatibility.');

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }

    process.exit(0);
}

migrate();
