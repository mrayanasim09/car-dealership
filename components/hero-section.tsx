import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 md:py-12 lg:py-20 xl:py-32" aria-labelledby="hero-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <header>
            <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
              Welcome to AM Tycoons Inc.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover premium pre-owned vehicles, quality cars, competitive prices, exceptional service, and easy financing—all in one place.
            </p>
          </header>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12">
            <Link href="/inventory" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                Browse Inventory
              </button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                Contact Us
              </button>
            </Link>
          </div>

          {/* Feature Grid with ARIA roles - Mobile First */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto" role="list" aria-label="Key features">
            <div className="text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" role="listitem">
              <div className="text-2xl md:text-3xl mb-3" aria-hidden="true">🚗</div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg md:text-xl">Quality Vehicles</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Thoroughly inspected and certified pre-owned cars</p>
            </div>
            <div className="text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" role="listitem">
              <div className="text-2xl md:text-3xl mb-3" aria-hidden="true">💰</div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg md:text-xl">Competitive Pricing</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Best value for your money with transparent pricing</p>
            </div>
            <div className="text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1" role="listitem">
              <div className="text-2xl md:text-3xl mb-3" aria-hidden="true">🤝</div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg md:text-xl">Expert Service</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Professional team dedicated to your satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
