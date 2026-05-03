'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])

  return (
    <section ref={containerRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <motion.div 
        style={{ scale }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative"
      >
        <motion.div
          style={{ y }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary animate-gradient" />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 grid-pattern opacity-20" />
          
          {/* Glowing orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/20 rounded-full blur-[100px]" />
          
          {/* Content */}
          <div className="relative px-6 py-16 sm:px-12 sm:py-24 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8"
            >
              <Zap className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Start Your Journey Today</span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance"
            >
              Ready to Find Your{' '}
              <span className="relative">
                Perfect Course
                <motion.span
                  initial={{ width: 0 }}
                  animate={isInView ? { width: '100%' } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="absolute bottom-0 left-0 h-1 bg-white/50 rounded-full"
                />
              </span>
              ?
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg sm:text-xl text-white/90 mb-10 text-pretty"
            >
              Let our AI-powered recommendation system guide you to the courses 
              that match your skills, interests, and career goals.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button 
                size="lg" 
                className="group px-8 py-6 text-base font-semibold bg-white text-primary hover:bg-white/90 transition-all"
              >
                Get Free Recommendations
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-6 text-base font-semibold border-white/30 text-white bg-white/10 hover:bg-white/20 hover:border-white/50 transition-all backdrop-blur-sm"
              >
                Explore All Courses
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-12"
            >
              {[
                { icon: Sparkles, text: 'AI-Powered' },
                { icon: Users, text: '50K+ Learners' },
                { icon: Award, text: 'Certified Courses' },
              ].map((item, idx) => (
                <div 
                  key={item.text}
                  className="flex items-center gap-2 text-white/80"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Floating elements */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-white/30"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
              }}
              animate={{
                y: [null, '-20%', '20%'],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
