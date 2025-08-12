import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// CSRF helper to attach header on client fetches
export async function withCsrfHeaders(init?: RequestInit): Promise<RequestInit> {
  if (typeof window === 'undefined') return init || {}
  const token = getCsrfFromCookie()
  return {
    ...init,
    headers: {
      ...(init?.headers || {}),
      'x-csrf-token': token || '',
    },
  }
}

function getCsrfFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
