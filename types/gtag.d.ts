declare global {
  interface Window {
    gtag: ((
      command: 'config' | 'event' | 'set' | 'consent',
      targetId: string,
      config?: Record<string, any>
    ) => void) & {
      q?: unknown[];
    };
  }
}

export {};
