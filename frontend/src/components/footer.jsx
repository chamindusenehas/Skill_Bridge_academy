import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Globe, MessageCircle, Users, Mail, MapPin, Phone } from 'lucide-react'
import logoImg from '@/assets/logo.png'


export function Footer() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <footer id="contact" ref={containerRef} className="relative bg-card border-t border-border/50 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/10 to-transparent blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">



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
            <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left mt-2">
              AI-powered learning platform providing personalized course recommendations using symbolic AI technology.
            </p>
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
