"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { ComparisonProvider } from "@/lib/comparison-context";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { initializeFirebase } from "@/lib/firebase";

export function Providers({ children }: { children: React.ReactNode }) {
  // This effect ensures Firebase is initialized on the client side
  useEffect(() => {
    initializeFirebase();
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <ComparisonProvider>
          {children}
          <Toaster 
            position="bottom-right"
            richColors
            closeButton
            duration={4000}
          />
        </ComparisonProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}