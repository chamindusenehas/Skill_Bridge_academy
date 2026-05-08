import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Globe, MessageCircle, Users, Mail, MapPin, Phone } from 'lucide-react'
import logoImg from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const socialLinks = [
  { icon: Globe, href: '#', label: 'Website' },
  { icon: MessageCircle, href: '#', label: 'Community' },
  { icon: Users, href: '#', label: 'LinkedIn' },
]

export function Footer() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <footer id="contact" ref={containerRef} className="relative bg-card border-t border-border/50 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/10 to-transparent blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="py-12 border-b border-border/50"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Stay Updated with{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">New Courses</span>
            </h3>
            <p className="text-muted-foreground mb-6">Get notified about new courses, learning paths, and exclusive offers.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="flex-1 h-12 bg-background" />
              <Button type="submit" className="h-12 px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90">Subscribe</Button>
            </form>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="py-14 flex flex-col md:flex-row items-center md:items-start justify-between gap-10"
        >
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-14 h-14 flex items-center justify-center">
                <img src={logoImg} alt="Skill-Bridge Academy Logo" className="w-full h-full object-contain dark:invert" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">Skill-Bridge</span>
                <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">Academy</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
              AI-powered learning platform providing personalized course recommendations using symbolic AI technology.
            </p>
            <div className="flex items-center gap-2 mt-5">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col items-center md:items-start gap-5">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>NIBM KIC, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:contact@skillbridge.academy" className="hover:text-foreground transition-colors">
                  contact@skillbridge.academy
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Phone className="w-4 h-4" />
                </div>
                <a href="tel:+94112345678" className="hover:text-foreground transition-colors">
                  +94 11 234 5678
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground"
        >
          <p>© {new Date().getFullYear()} Skill-Bridge Academy. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <span className="text-red-500 animate-pulse text-base">❤️</span> by NIBM KIC Students.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
