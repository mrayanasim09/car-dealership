import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - AM Tycoons Inc',
  description: 'Frequently asked questions about AM Tycoons Inc.',
  alternates: { canonical: '/faq' },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children
}


