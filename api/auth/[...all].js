import { auth } from '../../../lib/auth';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    return auth.handler(req, res);
}
