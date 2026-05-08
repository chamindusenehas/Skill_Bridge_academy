import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Brain, Target, Lightbulb, Users, BarChart3, Zap, ArrowUpRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Brain,
    title: 'Symbolic AI Recommendations',
    description: 'Our Prolog-based inference engine analyzes your profile and matches you with perfect courses using rule-based reasoning.',
    gradient: 'from-blue-500 to-cyan-500',
    span: 'col-span-1 md:col-span-3',
  },
  {
    icon: Lightbulb,
    title: 'Smart Hashtag Matching',
    description: 'Courses tagged with relevant topics for precise recommendations.',
    gradient: 'from-orange-500 to-yellow-500',
    span: 'col-span-1 md:col-span-1',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and insights.',
    gradient: 'from-indigo-500 to-violet-500',
    span: 'col-span-1 md:col-span-1',
  },
  {
    icon: Zap,
    title: 'Instant Recommendations',
    description: 'Get course suggestions in seconds based on your questionnaire responses.',
    gradient: 'from-rose-500 to-red-500',
    span: 'col-span-1 md:col-span-1',
  },
]

function FeatureCard({ feature, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn('group relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500', feature.span)}
    >
      <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500', `bg-gradient-to-br ${feature.gradient}`)} />
      <div className="relative p-6 sm:p-8">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          className={cn('inline-flex p-3 rounded-xl mb-4', `bg-gradient-to-br ${feature.gradient}`)}
        >
          <feature.icon className="w-6 h-6 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <ArrowUpRight className="w-5 h-5 text-primary" />
        </div>
        <div className="absolute bottom-4 right-4 flex gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-current" />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function FeaturesSection() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Platform Features</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Intelligent Learning,{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Reimagined</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-muted-foreground text-lg"
          >
            Our AI-powered platform combines symbolic reasoning with modern web technology to deliver personalized course recommendations.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
