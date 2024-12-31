"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { UserSession } from "@/app/types/user";

const AuthContext = createContext<{
  session: UserSession;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  session: { user: null, isLoading: true },
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        setSession({ user: data.user, isLoading: false });
      } catch (error) {
        setSession({ user: null, isLoading: false });
      }
    };
    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      setSession({ user: data.user, isLoading: false });
    } catch (error) {
      setSession({ user: null, isLoading: false });
    }
  };

  const signOut = async () => {
    // Implement sign out logic
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);