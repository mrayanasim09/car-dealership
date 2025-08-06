"use client"

import { cn } from "@/lib/utils"

interface SmoothScrollLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  offset?: number
}

export function SmoothScrollLink({
  href,
  children,
  className,
  offset = 0
}: SmoothScrollLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    if (href.startsWith('#')) {
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        const targetPosition = targetElement.offsetTop - offset
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    } else {
      window.location.href = href
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "transition-colors duration-200 hover:text-red-600 cursor-pointer",
        className
      )}
    >
      {children}
    </a>
  )
}

