'use client'

import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { AuthContext } from '../context/AuthContext'

const navLinks = [
  { 
    name: 'Courses', 
    href: '#courses',
    submenu: [
      { name: 'Artificial Intelligence', href: '#ai' },
      { name: 'Cybersecurity', href: '#security' },
      { name: 'Data Science', href: '#data' },
      { name: 'Web Development', href: '#web' },
    ]
  },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-primary/5' 
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-primary-foreground" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight">
                Skill-Bridge
              </span>
              <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">
                Academy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.submenu && setActiveSubmenu(link.name)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  to={link.href}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg',
                    'text-muted-foreground hover:text-foreground',
                    'hover:bg-secondary/80 transition-all duration-200'
                  )}
                >
                  {link.name}
                  {link.submenu && (
                    <ChevronDown className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      activeSubmenu === link.name && 'rotate-180'
                    )} />
                  )}
                </Link>

                {/* Submenu */}
                <AnimatePresence>
                  {link.submenu && activeSubmenu === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 pt-2 w-56"
                    >
                      <div className="bg-card border border-border rounded-xl p-2 shadow-xl shadow-primary/10">
                        {link.submenu.map((sublink, idx) => (
                          <Link
                            key={sublink.name}
                            to={sublink.href}
                            className="block px-4 py-2.5 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                          >
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              {sublink.name}
                            </motion.span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <Link to="/dashboard">
                  <Button size="sm" className="font-medium bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="font-medium bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-border/50 overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-4 px-4 flex flex-col gap-2"
                >
                  {user ? (
                    <Link to="/dashboard" className="w-full">
                      <Button className="w-full font-medium bg-gradient-to-r from-primary to-accent">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" className="w-full">
                        <Button variant="outline" className="w-full font-medium">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/register" className="w-full">
                        <Button className="w-full font-medium bg-gradient-to-r from-primary to-accent">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
