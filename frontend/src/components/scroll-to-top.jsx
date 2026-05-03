import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setIsVisible(scrolled > 300)
      setScrollProgress((scrolled / maxScroll) * 100)
    }
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="relative w-12 h-12 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-all group overflow-hidden"
            aria-label="Scroll to top"
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
              <circle
                cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2"
                strokeDasharray={138}
                strokeDashoffset={138 - (138 * scrollProgress) / 100}
                className="text-primary transition-all duration-150"
                strokeLinecap="round"
              />
            </svg>
            <ArrowUp className="w-5 h-5 relative z-10 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
