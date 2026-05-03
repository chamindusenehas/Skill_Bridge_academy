import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const technologies = [
  { name: 'React.js', description: 'Frontend UI Library', color: 'from-cyan-400 to-blue-500' },
  { name: 'Flask', description: 'Python Backend', color: 'from-gray-400 to-gray-600' },
  { name: 'MongoDB', description: 'NoSQL Database', color: 'from-green-400 to-emerald-600' },
  { name: 'SWI-Prolog', description: 'AI Inference Engine', color: 'from-orange-400 to-red-500' },
  { name: 'Vite', description: 'Build Tool', color: 'from-purple-400 to-violet-600' },
  { name: 'TailwindCSS', description: 'Utility-First CSS', color: 'from-cyan-400 to-blue-500' },
]

const archNodes = [
  { label: 'Frontend', sublabel: 'React.js', color: 'bg-cyan-500/20 text-cyan-500' },
  { label: 'Backend', sublabel: 'Flask API', color: 'bg-gray-500/20 text-gray-400' },
  { label: 'AI Engine', sublabel: 'SWI-Prolog', color: 'bg-orange-500/20 text-orange-500' },
  { label: 'Database', sublabel: 'MongoDB', color: 'bg-green-500/20 text-green-500' },
]

function TechIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <circle cx="12" cy="12" r="9" opacity="0.3" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

export function TechStackSection() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Technology Stack</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Built with <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Modern Tech</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Our platform combines cutting-edge web technologies with symbolic AI for an intelligent learning experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className={cn('relative p-6 rounded-2xl text-center bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden')}>
                <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500', `bg-gradient-to-br ${tech.color}`)} />
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={cn('inline-flex items-center justify-center w-14 h-14 rounded-xl mb-3 text-white', `bg-gradient-to-br ${tech.color}`)}
                >
                  <TechIcon color={tech.color} />
                </motion.div>
                <h3 className="font-semibold text-sm mb-1">{tech.name}</h3>
                <p className="text-xs text-muted-foreground">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture diagram */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.6 }} className="mt-16 p-6 sm:p-8 rounded-2xl bg-card border border-border/50">
          <h3 className="text-lg font-semibold mb-6 text-center">System Architecture</h3>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
            {archNodes.map((node, idx) => (
              <>
                <div key={node.label} className="flex flex-col items-center p-4 rounded-xl bg-secondary/50">
                  <div className="text-xs text-muted-foreground mb-2">{node.label}</div>
                  <div className={cn('px-3 py-1.5 rounded-lg text-sm font-medium', node.color)}>{node.sublabel}</div>
                </div>
                {idx < archNodes.length - 1 && (
                  <motion.div
                    key={`arrow-${idx}`}
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.5 }}
                    className="text-muted-foreground rotate-90 lg:rotate-0"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.div>
                )}
              </>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
