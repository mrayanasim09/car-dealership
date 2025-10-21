"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface MobileTouchGesturesProps {
  children: React.ReactNode
  className?: string
  enableSwipe?: boolean
  enablePinch?: boolean
  enableDoubleTap?: boolean
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinchIn?: () => void
  onPinchOut?: () => void
  onDoubleTap?: () => void
}

export function MobileTouchGestures({
  children,
  className = "",
  enableSwipe = true,
  enablePinch = true,
  enableDoubleTap = true,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinchIn,
  onPinchOut,
  onDoubleTap
}: MobileTouchGesturesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [lastTap, setLastTap] = useState(0)
  const [initialDistance, setInitialDistance] = useState<number | null>(null)
  const [showControls, setShowControls] = useState(false)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const onTouchStart = useCallback((e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })

    // Handle pinch gesture
    if (enablePinch && e.targetTouches.length === 2) {
      const distance = Math.hypot(
        e.targetTouches[0].clientX - e.targetTouches[1].clientX,
        e.targetTouches[0].clientY - e.targetTouches[1].clientY
      )
      setInitialDistance(distance)
    }
  }, [enablePinch])

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (enablePinch && e.targetTouches.length === 2 && initialDistance !== null) {
      const currentDistance = Math.hypot(
        e.targetTouches[0].clientX - e.targetTouches[1].clientX,
        e.targetTouches[0].clientY - e.targetTouches[1].clientY
      )
      
      const pinchThreshold = 30
      if (Math.abs(currentDistance - initialDistance) > pinchThreshold) {
        if (currentDistance < initialDistance) {
          onPinchIn?.()
        } else {
          onPinchOut?.()
        }
        setInitialDistance(currentDistance)
      }
    }
  }, [enablePinch, initialDistance, onPinchIn, onPinchOut])

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX)

    if (enableSwipe) {
      if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0) {
          onSwipeLeft?.()
        } else {
          onSwipeRight?.()
        }
      }

      if (isVerticalSwipe && Math.abs(distanceY) > minSwipeDistance) {
        if (distanceY > 0) {
          onSwipeUp?.()
        } else {
          onSwipeDown?.()
        }
      }
    }

    // Handle double tap
    if (enableDoubleTap) {
      const currentTime = new Date().getTime()
      const tapLength = currentTime - lastTap
      if (tapLength < 500 && tapLength > 0) {
        onDoubleTap?.()
      }
      setLastTap(currentTime)
    }

    setTouchStart(null)
    setTouchEnd(null)
    setInitialDistance(null)
  }, [touchStart, touchEnd, enableSwipe, enableDoubleTap, lastTap, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onDoubleTap])

  const onTouchMoveUpdate = useCallback((e: TouchEvent) => {
    if (touchStart) {
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      })
    }
  }, [touchStart])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', onTouchStart, { passive: false })
    container.addEventListener('touchmove', onTouchMove, { passive: false })
    container.addEventListener('touchmove', onTouchMoveUpdate, { passive: false })
    container.addEventListener('touchend', onTouchEnd, { passive: false })

    return () => {
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchmove', onTouchMoveUpdate)
      container.removeEventListener('touchend', onTouchEnd)
    }
  }, [onTouchStart, onTouchMove, onTouchMoveUpdate, onTouchEnd])

  // Show controls on hover/touch
  const handleInteraction = () => {
    setShowControls(true)
    setTimeout(() => setShowControls(false), 3000)
  }

  return (
    <div 
      ref={containerRef}
      className={`relative touch-pan-y touch-pan-x ${className}`}
      onTouchStart={handleInteraction}
      onMouseEnter={handleInteraction}
    >
      {children}
      
      {/* Touch Gesture Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 bg-black/80 text-white rounded-lg p-3 space-y-2 transition-opacity duration-300">
          <div className="text-xs font-medium mb-2">Touch Gestures</div>
          
          {enableSwipe && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <ChevronLeft className="h-3 w-3" />
                <span>Swipe Left</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <ChevronRight className="h-3 w-3" />
                <span>Swipe Right</span>
              </div>
            </div>
          )}
          
          {enablePinch && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <ZoomIn className="h-3 w-3" />
                <span>Pinch In</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <ZoomOut className="h-3 w-3" />
                <span>Pinch Out</span>
              </div>
            </div>
          )}
          
          {enableDoubleTap && (
            <div className="flex items-center gap-2 text-xs">
              <RotateCcw className="h-3 w-3" />
              <span>Double Tap</span>
            </div>
          )}
        </div>
      )}

      {/* Swipe Indicators */}
      {enableSwipe && (
        <>
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 text-white rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity">
            <ChevronLeft className="h-4 w-4" />
          </div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 text-white rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity">
            <ChevronRight className="h-4 w-4" />
          </div>
        </>
      )}
    </div>
  )
}

// HOC for adding touch gestures to any component
export function withTouchGestures<P extends object>(
  Component: React.ComponentType<P>,
  gestureProps: Omit<MobileTouchGesturesProps, 'children'>
) {
  return function TouchGesturesWrapper(props: P) {
    return (
      <MobileTouchGestures {...gestureProps}>
        <Component {...props} />
      </MobileTouchGestures>
    )
  }
}
