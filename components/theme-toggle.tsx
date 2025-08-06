import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
      <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
    </div>
  )
}

