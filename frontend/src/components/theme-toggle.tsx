'use client'

import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative w-9 h-9 rounded-lg hover:bg-secondary/80"
        >
          <AnimatePresence mode="wait">
            {resolvedTheme === 'dark' ? (
              <motion.div
                key="moon"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute"
              >
                <Moon className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -90 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute"
              >
                <Sun className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Sun className="w-4 h-4" />
          <span>Light</span>
          {theme === 'light' && (
            <motion.div
              layoutId="theme-indicator"
              className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Moon className="w-4 h-4" />
          <span>Dark</span>
          {theme === 'dark' && (
            <motion.div
              layoutId="theme-indicator"
              className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Monitor className="w-4 h-4" />
          <span>System</span>
          {theme === 'system' && (
            <motion.div
              layoutId="theme-indicator"
              className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
