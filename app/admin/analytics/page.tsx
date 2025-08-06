import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analytics - AM Tycoons Inc. Admin",
  description: "Analytics dashboard for AM Tycoons Inc. dealership management.",
}

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AM Tycoons Inc. dealership analytics and insights
        </p>
      </div>
    </div>
  )
}
