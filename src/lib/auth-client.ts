import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_AUTH_URL || "https://orbit-server-gamma.vercel.app",
    fetchOptions: {
        onSuccess: (ctx) => {
            const authToken = ctx.response.headers.get("set-auth-token");
            if (authToken) {
                localStorage.setItem("bearer_token", authToken);
            }
        },
        onError: (ctx) => {
            if (ctx.response.status === 401) {
                localStorage.removeItem("bearer_token");
            }
        },
        auth: {
            type: "Bearer",
            token: () => localStorage.getItem("bearer_token") || "",
        },
    },
});

export const { signIn, signUp, useSession } = authClient;

export const signOut = async (options?: Parameters<typeof authClient.signOut>[0]) => {
    localStorage.removeItem("bearer_token");
    return authClient.signOut(options);
};
