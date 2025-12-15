import { createAuthClient } from "better-auth/react";

// Use relative URL for Vercel serverless - works both locally and in production
export const authClient = createAuthClient({
    baseURL: "",
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession,
} = authClient;
