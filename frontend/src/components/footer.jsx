import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Sparkles, Globe, MessageCircle, Users, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const footerLinks = {
  platform: [
    { name: 'Courses', href: '#courses' },
    { name: 'Recommendations', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'For Teams', href: '#' },
  ],
  resources: [
    { name: 'Documentation', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Community', href: '#' },
    { name: 'Help Center', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#about' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Partners', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
}

const socialLinks = [
  { icon: Globe, href: '#', label: 'Website' },
  { icon: MessageCircle, href: '#', label: 'Community' },
  { icon: Users, href: '#', label: 'LinkedIn' },
]

export function Footer() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <footer ref={containerRef} className="relative bg-card border-t border-border/50 overflow-hidden">
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

        {/* Main Footer */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}>
                <Link to="/" className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg leading-tight">Skill-Bridge</span>
                    <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">Academy</span>
                  </div>
                </Link>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                  AI-powered learning platform providing personalized course recommendations using symbolic AI technology.
                </p>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /><span>NIBM, Sri Lanka</span></div>
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /><span>contact@skillbridge.academy</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /><span>+94 11 234 5678</span></div>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  {socialLinks.map((social) => (
                    <motion.a key={social.label} href={social.href} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" aria-label={social.label}>
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div key={category} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 + categoryIndex * 0.1 }}>
                <h4 className="font-semibold mb-4 capitalize">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.href} className="group text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                        {link.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground"
        >
          <p>&copy; {new Date().getFullYear()} Skill-Bridge Academy. All rights reserved.</p>
          <p className="flex items-center gap-1">Built with <span className="text-red-500 animate-pulse">❤</span> by NIBM Students</p>
        </motion.div>
      </div>
    </footer>
  )
}
