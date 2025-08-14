import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - AM Tycoons Inc',
  description: 'Get in touch with AM Tycoons Inc. for vehicle inquiries, test drives, and support.',
  alternates: { canonical: '/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}


