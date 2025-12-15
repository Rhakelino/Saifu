import 'dotenv/config';

export default {
    schema: ['./src/db/schema.js', './src/db/auth-schema.js'],
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
};
