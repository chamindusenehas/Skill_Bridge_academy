import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { UserPlus, ClipboardList, Brain, GraduationCap, ArrowDown, Sparkles, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  {
    number: '01', icon: UserPlus, title: 'Create Your Profile',
    description: 'Sign up and tell us about your background, experience level, and career aspirations.',
    details: ['Quick registration process', 'Connect with your email', 'Secure authentication'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02', icon: ClipboardList, title: 'Answer Smart Questions',
    description: 'Complete our AI-powered questionnaire covering your skills, interests, and learning goals.',
    details: ['5 questions that helps to assess your skills', 'STEM knowledge assessment', 'Career goal identification'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: '03', icon: Brain, title: 'AI Analyzes Your Profile',
    description: 'Our Prolog inference engine matches your inputs with course hashtags using symbolic reasoning.',
    details: ['Rule-based recommendation', 'Hashtag matching algorithm', 'Instant processing'],
    color: 'from-orange-500 to-amber-500',
  },
  {
    number: '04', icon: GraduationCap, title: 'Start Learning',
    description: 'Receive personalized course recommendations and begin your learning journey immediately.',
    details: ['Curated course list', 'Progress tracking', 'Free to learn'],
    color: 'from-green-500 to-emerald-500',
  },
]

function StepCard({ step, index, isLast }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative"
    >
      <div className={cn('flex gap-6 lg:gap-12', index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse')}>
        {/* Timeline icon */}
        <div className="hidden lg:flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.2 }}
            className={cn('w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg', `bg-gradient-to-br ${step.color}`)}
          >
            <step.icon className="w-7 h-7 text-white" />
          </motion.div>
          {!isLast && (
            <motion.div
              initial={{ height: 0 }}
              animate={isInView ? { height: '100%' } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
              className="w-0.5 flex-1 bg-gradient-to-b from-border to-transparent mt-4"
            />
          )}
        </div>

        {/* Content */}
        <div className={cn('flex-1 group relative', index % 2 === 0 ? 'lg:text-left' : 'lg:text-right')}>
          <div className="relative p-6 sm:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden">
            {/* Mobile icon */}
            <div className="lg:hidden flex items-center gap-4 mb-4">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', `bg-gradient-to-br ${step.color}`)}>
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-mono text-muted-foreground">Step {step.number}</span>
            </div>

            <div className={cn('hidden lg:block absolute top-6 font-mono text-6xl font-bold opacity-10', index % 2 === 0 ? 'right-6' : 'left-6')}>
              {step.number}
            </div>

            <div className={cn('relative z-10', index % 2 === 0 ? 'lg:pr-20' : 'lg:pl-20')}>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
              <p className="text-muted-foreground mb-4">{step.description}</p>
              <ul className={cn('space-y-2', index % 2 === 0 ? 'lg:text-left' : 'lg:text-right')}>
                {step.details.map((detail, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.3 + idx * 0.1 }}
                    className={cn('flex items-center gap-2 text-sm text-muted-foreground', index % 2 === 1 && 'lg:flex-row-reverse')}
                  >
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {detail}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500', `bg-gradient-to-br ${step.color}`)} />
          </div>

          {!isLast && (
            <div className="lg:hidden flex justify-center py-4">
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowDown className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function HowItWorksSection() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">How It Works</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Your Journey to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Success</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Four simple steps to discover your perfect learning path with our AI-powered recommendation system.
          </motion.p>
        </div>
        <div className="space-y-8 lg:space-y-12 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} isLast={index === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
