export const metadata = {
  title: 'Terms & Conditions - AM Tycoons Inc.',
  alternates: { canonical: '/terms' },
}

const LAST_UPDATED = '2025-01-01'

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-12 text-foreground">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="mb-4">By using the AM Tycoons Inc. website and services, you agree to these terms.</p>
      <h2 className="text-xl font-semibold mt-8 mb-3">Use of Website</h2>
      <p className="mb-4">All content is provided for informational purposes. Vehicle availability and pricing may change at any time.</p>
      <h2 className="text-xl font-semibold mt-8 mb-3">No Warranty</h2>
      <p className="mb-4">Vehicles are sold as-is unless otherwise specified in writing at purchase time. AM Tycoons Inc. makes no warranties, express or implied, regarding website content accuracy or vehicle condition.</p>
      <h2 className="text-xl font-semibold mt-8 mb-3">Limitation of Liability</h2>
      <p className="mb-4">AM Tycoons Inc. is not liable for indirect or consequential damages arising from site use or vehicle purchases.</p>
      <p className="mt-8 text-sm opacity-80">Last updated: {LAST_UPDATED}</p>
    </main>
  )
}


