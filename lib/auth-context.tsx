"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { type User, onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseAvailable, getFirebaseStatus } from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirebaseAvailable: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isFirebaseAvailable: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAvailable = isFirebaseAvailable();
    if (!isAvailable) {
        setLoading(false);
        return;
    }
    
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  const value = { user, loading, isFirebaseAvailable: isFirebaseAvailable() };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);