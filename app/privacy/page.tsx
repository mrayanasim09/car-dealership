export const metadata = {
  title: 'Privacy Policy - AM Tycoons Inc.'
}

const LAST_UPDATED = '2025-01-01'

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 py-12 text-foreground">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">AM Tycoons Inc. respects your privacy. We collect only the data necessary to operate our website and services, including essential cookies, analytics, and marketing cookies where consented.</p>
      <h2 className="text-xl font-semibold mt-8 mb-3">Information We Collect</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Contact details you submit via forms</li>
        <li>Usage analytics (via Google Analytics)</li>
        <li>Media you upload in the admin portal (stored on Cloudinary)</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-3">How We Use Information</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Respond to inquiries and manage inventory</li>
        <li>Improve user experience and site performance</li>
        <li>Show relevant offers where consented</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-3">Your Choices</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Cookie preferences via the on-site banner</li>
        <li>Contact us at info@amtycoons.com for data requests</li>
      </ul>
      <p className="mt-8 text-sm opacity-80">Last updated: {LAST_UPDATED}</p>
    </main>
  )
}


