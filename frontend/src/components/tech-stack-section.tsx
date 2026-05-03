'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const technologies = [
  {
    name: 'React.js',
    description: 'Frontend UI Library',
    color: 'from-cyan-400 to-blue-500',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
        <path fillRule="evenodd" d="M12 21c4.97 0 9-1.79 9-4s-4.03-4-9-4-9 1.79-9 4 4.03 4 9 4Zm0-2c3.866 0 7-1.343 7-3s-3.134-3-7-3-7 1.343-7 3 3.134 3 7 3Z" />
        <path fillRule="evenodd" d="M12 3c4.97 0 9 1.79 9 4s-4.03 4-9 4-9-1.79-9-4 4.03-4 9-4Zm0 2c3.866 0 7 1.343 7 3s-3.134 3-7 3-7-1.343-7-3 3.134-3 7-3Z" />
        <path fillRule="evenodd" d="M4.929 4.929c3.515-3.515 8.142-4.243 10.35-1.627.854.854 1.221 1.972 1.221 3.198 0 2.57-1.612 5.65-4.5 8.5-2.888 2.888-5.93 4.5-8.5 4.5-1.226 0-2.344-.367-3.198-1.221-2.615-2.208-1.888-6.835 1.627-10.35Zm1.414 1.414c-2.929 2.929-3.464 6.449-1.836 8.35.5.5 1.166.807 2.007.807 1.943 0 4.52-1.384 7.072-3.936 2.552-2.552 3.936-5.13 3.936-7.072 0-.84-.307-1.507-.807-2.007-1.9-1.628-5.42-1.093-8.372 1.858Z" />
        <path fillRule="evenodd" d="M19.071 4.929c-3.515-3.515-8.142-4.243-10.35-1.627-.854.854-1.221 1.972-1.221 3.198 0 2.57 1.612 5.65 4.5 8.5 2.888 2.888 5.93 4.5 8.5 4.5 1.226 0 2.344-.367 3.198-1.221 2.615-2.208 1.888-6.835-1.627-10.35Zm-1.414 1.414c2.929 2.929 3.464 6.449 1.836 8.35-.5.5-1.166.807-2.007.807-1.943 0-4.52-1.384-7.072-3.936-2.552-2.552-3.936-5.13-3.936-7.072 0-.84.307-1.507.807-2.007 1.9-1.628 5.42-1.093 8.372 1.858Z" />
      </svg>
    ),
  },
  {
    name: 'Flask',
    description: 'Python Backend',
    color: 'from-gray-400 to-gray-600',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z" />
        <path d="M12 6a1 1 0 0 1 1 1v5h4a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />
      </svg>
    ),
  },
  {
    name: 'MongoDB',
    description: 'NoSQL Database',
    color: 'from-green-400 to-emerald-600',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12.5 2.27c-.5-.84-1.05-1.17-1.25-1.49-.2-.32-.22-.6-.21-.78.01.2-.02.48-.22.78-.2.32-.75.65-1.25 1.49C7.48 5.42 6.67 9.61 9.6 13.59c.27.36.5.68.68.95.48.72.67 1.13.72 1.59.05.46.05.95.05 1.67v2.2c0 .55.45 1 1 1h1.9c.55 0 1-.45 1-1v-2.2c0-.72 0-1.21.05-1.67.05-.46.24-.87.72-1.59.18-.27.41-.59.68-.95 2.93-3.98 2.12-8.17 0-11.32Z" />
      </svg>
    ),
  },
  {
    name: 'SWI-Prolog',
    description: 'AI Inference Engine',
    color: 'from-orange-400 to-red-500',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z" />
        <path d="M12 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
      </svg>
    ),
  },
  {
    name: 'Next.js',
    description: 'React Framework',
    color: 'from-gray-600 to-gray-900',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z" />
        <path d="M8 8v8l8-4-8-4Z" />
      </svg>
    ),
  },
  {
    name: 'TailwindCSS',
    description: 'Utility-First CSS',
    color: 'from-cyan-400 to-blue-500',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6ZM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C8.39 16.85 9.53 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.47 12 7 12Z" />
      </svg>
    ),
  },
]

export function TechStackSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Technology Stack</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance"
          >
            Built with{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Modern Tech
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-muted-foreground text-lg"
          >
            Our platform combines cutting-edge web technologies with symbolic AI 
            for an intelligent learning experience.
          </motion.p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className={cn(
                'relative p-6 rounded-2xl text-center',
                'bg-card border border-border/50',
                'hover:border-primary/50 transition-all duration-300',
                'overflow-hidden'
              )}>
                {/* Glow effect */}
                <div className={cn(
                  'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500',
                  `bg-gradient-to-br ${tech.color}`
                )} />
                
                {/* Logo */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    'inline-flex items-center justify-center w-14 h-14 rounded-xl mb-3',
                    `bg-gradient-to-br ${tech.color}`,
                    'text-white'
                  )}
                >
                  {tech.logo}
                </motion.div>
                
                <h3 className="font-semibold text-sm mb-1">{tech.name}</h3>
                <p className="text-xs text-muted-foreground">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 p-6 sm:p-8 rounded-2xl bg-card border border-border/50"
        >
          <h3 className="text-lg font-semibold mb-6 text-center">System Architecture</h3>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
            {/* Frontend */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-secondary/50">
              <div className="text-xs text-muted-foreground mb-2">Frontend</div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-500">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">React.js</span>
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-muted-foreground rotate-90 lg:rotate-0"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.div>

            {/* Backend */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-secondary/50">
              <div className="text-xs text-muted-foreground mb-2">Backend</div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gray-500/20 text-gray-500">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Flask API</span>
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="text-muted-foreground rotate-90 lg:rotate-0"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.div>

            {/* Prolog Engine */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-secondary/50">
              <div className="text-xs text-muted-foreground mb-2">AI Engine</div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">SWI-Prolog</span>
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
              className="text-muted-foreground rotate-90 lg:rotate-0"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.div>

            {/* Database */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-secondary/50">
              <div className="text-xs text-muted-foreground mb-2">Database</div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-500/20 text-green-500">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">MongoDB</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
