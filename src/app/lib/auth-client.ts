//lib/auth-client.ts

import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://alpha-one-jade.vercel.app/api/auth",
});

export type User = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const signInWithGoogle = async () => {
  // Social sign-in redirects, so no return value needed
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/", // Redirect back to home after auth
  });
};

export const signOut = async () => {
  try {
    await authClient.signOut();
    return { success: true, error: null };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error };
  }
};

export const getSession = async () => {
  try {
    const { data, error } = await authClient.getSession();
    
    if (error) {
      return { session: null, user: null, error };
    }
    
    console.log(data?.user);
    return { 
      session: data?.session || null, 
      user: data?.user || null, 
      error: null 
    };

    
  } catch (error) {
    console.error("Session error:", error);
    return { session: null, user: null, error };
  }
};