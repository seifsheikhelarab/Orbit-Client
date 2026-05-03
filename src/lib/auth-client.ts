import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "https://orbit-applications.vercel.app"
});

export const { signIn, signUp, signOut, useSession } = authClient;
