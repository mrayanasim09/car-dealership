"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { ComparisonProvider } from "@/lib/comparison-context";
import { Toaster } from "@/components/ui/sonner";
import dynamic from "next/dynamic";
import { useState } from "react";

const AIChatbot = dynamic(() => import("@/components/ai-chatbot").then(m => m.AIChatbot), { ssr: false, loading: () => null });
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Firebase removed; no client initialization needed
  const [shouldMountChat, setShouldMountChat] = useState(false);

  useEffect(() => {
    const mount = () => setShouldMountChat(true)
    const win = window as Window & typeof globalThis & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
    }
    if (typeof win.requestIdleCallback === 'function') {
      win.requestIdleCallback(() => mount(), { timeout: 2500 })
    } else {
      setTimeout(mount, 1500)
    }
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="am-tycoons-theme"
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
          {shouldMountChat && <AIChatbot />}
        </ComparisonProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}