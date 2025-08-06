"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    // Minimum loading time
    const minLoadTime = setTimeout(() => {
      setProgress(100)
    }, 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(minLoadTime)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8 animate-pulse">
          <Image
            src="/AMTycons.png"
            alt="AM Tycoons"
            width={200}
            height={80}
            className="mx-auto h-20 w-auto"
          />
        </div>

        {/* Loading Animation */}
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto mb-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-700 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Loading Your Perfect Drive
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {progress < 30 && "Preparing inventory..."}
            {progress >= 30 && progress < 60 && "Loading vehicle details..."}
            {progress >= 60 && progress < 90 && "Optimizing experience..."}
            {progress >= 90 && "Almost ready!"}
          </p>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-600/5 rounded-full animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-red-500/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-red-400/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  )
}

