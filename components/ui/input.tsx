import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // Mobile-optimized input attributes
    const getInputMode = (inputType?: string) => {
      if (inputType === 'tel') return 'tel'
      if (inputType === 'email') return 'email'
      if (inputType === 'number' || inputType === 'search') return 'numeric'
      return 'text'
    }

    const getEnterKeyHint = (inputType?: string) => {
      if (inputType === 'search') return 'search'
      if (inputType === 'email' || inputType === 'tel') return 'done'
      return 'enter'
    }

    return (
      <input
        type={type}
        inputMode={getInputMode(type)}
        enterKeyHint={getEnterKeyHint(type)}
        className={cn(
          "flex min-h-[44px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
