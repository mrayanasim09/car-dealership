import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32" aria-labelledby="hero-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <header>
            <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Find Your Perfect Drive
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover premium pre-owned vehicles at AM Tycoons Inc. Quality cars, competitive prices, and exceptional service.
            </p>
          </header>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/inventory">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
                Browse Inventory
              </button>
            </Link>
            <Link href="/contact">
              <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
                Contact Us
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg" role="listitem">
              <div className="text-3xl mb-3" aria-hidden="true">🚗</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quality Vehicles</h3>
              <p className="text-gray-600 dark:text-gray-400">Thoroughly inspected and certified pre-owned cars</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg" role="listitem">
              <div className="text-3xl mb-3" aria-hidden="true">💰</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Competitive Pricing</h3>
              <p className="text-gray-600 dark:text-gray-400">Best value for your money with transparent pricing</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg" role="listitem">
              <div className="text-3xl mb-3" aria-hidden="true">🤝</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Expert Service</h3>
              <p className="text-gray-600 dark:text-gray-400">Professional team dedicated to your satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
