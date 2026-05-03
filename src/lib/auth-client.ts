import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_AUTH_URL || "https://orbit-server-gamma.vercel.app"
});

export const { signIn, signUp, signOut, useSession } = authClient;
