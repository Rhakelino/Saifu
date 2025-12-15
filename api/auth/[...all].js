import { auth } from '../../lib/auth.js';
import { toNodeHandler } from 'better-auth/node';

export const config = {
    api: {
        bodyParser: false,
    },
};

// Convert better-auth handler to Vercel-compatible handler
const nodeHandler = toNodeHandler(auth);

export default async function handler(req, res) {
    return nodeHandler(req, res);
}
