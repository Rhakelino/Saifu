import 'dotenv/config';
import { db } from './db/index.js';
import { categories } from './db/schema.js';

// Default categories for all users
const defaultCategories = [
    // Expense categories
    { name: 'Food & Drink', icon: 'restaurant', type: 'expense', color: '#f97316' },
    { name: 'Transport', icon: 'commute', type: 'expense', color: '#3b82f6' },
    { name: 'Shopping', icon: 'shopping_bag', type: 'expense', color: '#ec4899' },
    { name: 'Entertainment', icon: 'movie', type: 'expense', color: '#8b5cf6' },
    { name: 'Utilities', icon: 'bolt', type: 'expense', color: '#eab308' },
    { name: 'Health', icon: 'medical_services', type: 'expense', color: '#22c55e' },
    { name: 'Education', icon: 'school', type: 'expense', color: '#06b6d4' },
    { name: 'Rent', icon: 'home', type: 'expense', color: '#64748b' },
    { name: 'Subscriptions', icon: 'subscriptions', type: 'expense', color: '#e50914' },
    { name: 'Other', icon: 'more_horiz', type: 'expense', color: '#6b7280' },
    // Income categories
    { name: 'Salary', icon: 'payments', type: 'income', color: '#13ecb6' },
    { name: 'Freelance', icon: 'work', type: 'income', color: '#10b981' },
    { name: 'Investment', icon: 'trending_up', type: 'income', color: '#22d3ee' },
    { name: 'Gift', icon: 'redeem', type: 'income', color: '#f472b6' },
    { name: 'Refund', icon: 'receipt_long', type: 'income', color: '#a3e635' },
    { name: 'Other Income', icon: 'add_circle', type: 'income', color: '#94a3b8' },
];

async function seed() {
    console.log('🌱 Starting database seed...');

    try {
        // Check if default categories already exist
        const existingCategories = await db
            .select()
            .from(categories)
            .limit(1);

        if (existingCategories.length > 0) {
            console.log('⚠️  Default categories already exist. Skipping seed.');
            process.exit(0);
            return;
        }

        // Insert default categories (with no userId - they're system defaults)
        console.log('📁 Creating default categories...');
        await db.insert(categories).values(
            defaultCategories.map(cat => ({
                ...cat,
                userId: null,
                isDefault: 'true',
            }))
        );
        console.log(`✅ Created ${defaultCategories.length} default categories`);

        console.log('');
        console.log('🎉 Seed completed successfully!');
        console.log('');
        console.log('Users are now managed by Better Auth.');
        console.log('Register at /register to create a new account.');

    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }

    process.exit(0);
}

seed();
