import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Vehicles - AM Tycoons Inc',
  description: 'Discover quality pre-owned vehicles at AM Tycoons Inc.',
  alternates: { canonical: '/browse' },
}

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return children
}


