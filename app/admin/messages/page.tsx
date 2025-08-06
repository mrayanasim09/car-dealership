import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Messages - AM Tycoons Inc. Admin",
  description: "Message management for AM Tycoons Inc. dealership.",
}

export default function AdminMessagesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Message Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage customer messages and inquiries for AM Tycoons Inc.
        </p>
      </div>
    </div>
  )
}
