"use client"

import React, { createContext, useContext } from 'react'

type NonceContextValue = string | undefined

const NonceContext = createContext<NonceContextValue>(undefined)

export function NonceProvider({ nonce, children }: { nonce?: string; children: React.ReactNode }) {
  return <NonceContext.Provider value={nonce}>{children}</NonceContext.Provider>
}

export function useNonce(): string | undefined {
  return useContext(NonceContext)
}

export { NonceContext }


