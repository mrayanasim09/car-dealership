"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-600 dark:text-yellow-400" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-600 dark:text-blue-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <Sun className="h-4 w-4 mr-2 text-yellow-600" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <Moon className="h-4 w-4 mr-2 text-blue-600" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <span className="h-4 w-4 mr-2 flex items-center justify-center">
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-blue-600 rounded-full"></div>
          </span>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

