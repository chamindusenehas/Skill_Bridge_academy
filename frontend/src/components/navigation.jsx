import { useState, useEffect, useContext, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react'
import logoImg from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { AuthContext } from '../context/AuthContext'

const publicNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'How It Works', href: '/#how-it-works', section: 'how-it-works' },
  { name: 'Features', href: '/#features', section: 'features' },
  { name: 'Contact Us', href: '/#contact', section: 'contact' },
]

const providerNavLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Add Course', href: '/add-course' },
]

const adminNavLinks = [
  { name: 'Admin Panel', href: '/admin' },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = user?.role === 'admin'
    ? adminNavLinks
    : user?.role === 'provider'
    ? providerNavLinks
    : publicNavLinks

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavClick = (e, link) => {
    if (link.section) {
      e.preventDefault()
      if (location.pathname !== '/') {
        // Navigate to home first, then scroll
        navigate('/')
        setTimeout(() => {
          document.getElementById(link.section)?.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      } else {
        document.getElementById(link.section)?.scrollIntoView({ behavior: 'smooth' })
      }
      setIsMobileMenuOpen(false)
    } else {
      setIsMobileMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/')
  }

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
              className="relative w-14 h-14 flex items-center justify-center"
            >
              <img src={logoImg} alt="Skill-Bridge Academy Logo" className="w-full h-full object-contain dark:invert" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight">Skill-Bridge</span>
              <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">Academy</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={cn(
                  'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg',
                  'text-muted-foreground hover:text-foreground',
                  'hover:bg-secondary/80 transition-all duration-200',
                  (location.pathname === link.href && !link.section) && 'text-foreground bg-secondary/60'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                // Profile Dropdown
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full border border-border/50 transition-all duration-200 hover:ring-2 hover:ring-primary/50 overflow-hidden',
                      profileOpen && 'ring-2 ring-primary'
                    )}
                  >
                    {user.profile_picture ? (
                      <img src={user.profile_picture.startsWith('/uploads') ? `http://localhost:5000${user.profile_picture}` : user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-card border border-border/60 rounded-xl shadow-xl shadow-black/10 overflow-hidden"
                      >
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-border/40 bg-secondary/30">
                          <p className="text-sm font-semibold truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
                            {user.role}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="p-1.5 space-y-0.5">
                          <Link
                            to="/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-foreground hover:bg-secondary/70 transition-colors group"
                          >
                            <LayoutDashboard className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-foreground hover:bg-secondary/70 transition-colors group"
                          >
                            <User className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            My Profile
                          </Link>
                        </div>

                        <div className="p-1.5 border-t border-border/40">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="font-medium">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="font-medium bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
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
                  <motion.div key={link.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.07 }}>
                    <Link
                      to={link.href}
                      className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg transition-colors"
                      onClick={(e) => handleNavClick(e, link)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.07 }}
                  className="pt-4 px-4 flex flex-col gap-2 border-t border-border/40 mt-2"
                >
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 pb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                        </div>
                      </div>
                      <Link to="/dashboard" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full gap-2 font-medium bg-gradient-to-r from-primary to-accent">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleLogout}>
                        <LogOut className="w-4 h-4" /> Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full font-medium">Sign In</Button>
                      </Link>
                      <Link to="/register" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full font-medium bg-gradient-to-r from-primary to-accent">Get Started</Button>
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
