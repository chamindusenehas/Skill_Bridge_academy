'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight, Brain, Shield, Cpu, Database, Code, Cloud, Zap, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const floatingIcons = [
  { icon: Brain, label: 'AI', delay: 0 },
  { icon: Shield, label: 'Security', delay: 0.2 },
  { icon: Cpu, label: 'IoT', delay: 0.4 },
  { icon: Database, label: 'Data', delay: 0.6 },
  { icon: Code, label: 'Web', delay: 0.8 },
  { icon: Cloud, label: 'Cloud', delay: 1 },
]

const techWords = ['Artificial Intelligence', 'Cybersecurity', 'Data Science', 'IoT', 'Cloud Computing', 'Web Development']

export function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Typing effect
  useEffect(() => {
    const word = techWords[currentWord]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < word.length) {
          setDisplayText(word.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(word.slice(0, displayText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentWord((prev) => (prev + 1) % techWords.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentWord])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing orb */}
        <motion.div
          style={{ y, opacity }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-[120px]"
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/50"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, -20, 20],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan" />
        </div>
      </div>

      {/* Floating Tech Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((item, idx) => (
          <motion.div
            key={item.label}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { 
              opacity: 1, 
              scale: 1,
              y: [0, -15, 0],
            } : {}}
            transition={{
              opacity: { delay: item.delay, duration: 0.5 },
              scale: { delay: item.delay, duration: 0.5 },
              y: { delay: item.delay + 0.5, duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              left: `${15 + (idx % 3) * 35}%`,
              top: `${20 + Math.floor(idx / 3) * 50}%`,
            }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
              <div className="relative p-3 bg-card/80 backdrop-blur-sm border border-border rounded-xl">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
        className="relative z-10 container mx-auto px-4 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Learning Platform</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="block text-balance">Master the Future of</span>
          <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
            {displayText}
            <span className="inline-block w-0.5 h-[1em] bg-primary ml-1 animate-pulse" />
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10 text-pretty"
        >
          Intelligent course recommendations powered by symbolic AI. 
          Find the perfect learning path tailored to your skills, goals, and interests.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button 
            size="lg" 
            className="group relative px-8 py-6 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Personalized Recommendations
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-6 text-base font-semibold border-border/50 hover:bg-secondary/80 hover:border-primary/50 transition-all duration-300"
          >
            Explore Courses
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-16"
        >
          {[
            { value: '500+', label: 'Courses' },
            { value: '50K+', label: 'Learners' },
            { value: '95%', label: 'Success Rate' },
            { value: '24/7', label: 'AI Support' },
          ].map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs font-medium uppercase tracking-wider">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  )
}
