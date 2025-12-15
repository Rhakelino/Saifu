import { pgTable, uuid, varchar, text, decimal, timestamp, date, pgEnum } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

// Enums
export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense', 'transfer']);
export const walletTypeEnum = pgEnum('wallet_type', ['bank', 'cash', 'credit_card', 'e_wallet', 'crypto', 'other']);
export const categoryTypeEnum = pgEnum('category_type', ['income', 'expense']);

// Wallets table
export const wallets = pgTable('wallets', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    type: walletTypeEnum('type').notNull().default('bank'),
    balance: decimal('balance', { precision: 15, scale: 2 }).notNull().default('0'),
    icon: varchar('icon', { length: 100 }).default('account_balance'),
    accountNumber: varchar('account_number', { length: 50 }),
    color: varchar('color', { length: 50 }).default('#1e1e1e'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    icon: varchar('icon', { length: 100 }).default('category'),
    type: categoryTypeEnum('type').notNull(),
    color: varchar('color', { length: 50 }).default('#6b7280'),
    isDefault: varchar('is_default', { length: 5 }).default('false'),
});

// Transactions table
export const transactions = pgTable('transactions', {
    id: uuid('id').defaultRandom().primaryKey(),
    walletId: uuid('wallet_id').references(() => wallets.id, { onDelete: 'cascade' }).notNull(),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    toWalletId: uuid('to_wallet_id').references(() => wallets.id, { onDelete: 'set null' }),
    type: transactionTypeEnum('type').notNull(),
    amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
    description: varchar('description', { length: 255 }),
    note: text('note'),
    transactionDate: date('transaction_date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Re-export auth schema
export * from './auth-schema';
