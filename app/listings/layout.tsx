import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inventory - AM Tycoons Inc',
  description: 'Browse our complete selection of quality pre-owned vehicles.',
  alternates: { canonical: '/listings' },
}

export default function ListingsLayout({ children }: { children: React.ReactNode }) {
  return children
}


