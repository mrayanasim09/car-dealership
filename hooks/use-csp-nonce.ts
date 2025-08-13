"use client"

import { useEffect, useState } from 'react'

export function useCspNonce(): string | undefined {
  const [nonce, setNonce] = useState<string | undefined>(undefined)

  useEffect(() => {
    const meta = document.querySelector('meta[name="csp-nonce"]')
    const value = meta?.getAttribute('content') || undefined
    setNonce(value || undefined)
  }, [])

  return nonce
}


