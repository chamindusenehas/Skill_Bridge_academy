import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const testimonials = [
  { id: 1, name: 'Sarah Chen', role: 'Data Scientist', company: 'TechCorp', content: 'The AI-powered recommendations were spot on! It suggested exactly the courses I needed to transition into machine learning. Completed my learning path in half the time I expected.', rating: 5, avatar: 'SC', gradient: 'from-blue-500 to-cyan-500' },
  { id: 2, name: 'Marcus Johnson', role: 'Security Analyst', company: 'CyberShield', content: "Skill-Bridge Academy helped me identify gaps in my cybersecurity knowledge. The Prolog-based system understood my experience level perfectly and suggested advanced courses.", rating: 5, avatar: 'MJ', gradient: 'from-purple-500 to-pink-500' },
  { id: 3, name: 'Priya Patel', role: 'Full-Stack Developer', company: 'StartupHub', content: 'As a self-taught developer, I was overwhelmed by course options. The recommendation quiz took 5 minutes and saved me weeks of research. Highly recommend!', rating: 5, avatar: 'PP', gradient: 'from-orange-500 to-amber-500' },
  { id: 4, name: 'James Wilson', role: 'Cloud Architect', company: 'CloudNine', content: 'The symbolic AI approach is brilliant. It matched my career goals with specific certifications and courses. I got my AWS certification in record time.', rating: 5, avatar: 'JW', gradient: 'from-green-500 to-emerald-500' },
  { id: 5, name: 'Aisha Rahman', role: 'IoT Engineer', company: 'SmartDevices', content: 'Finding IoT courses that match my embedded systems background was always hard. Skill-Bridge Academy nailed it with their hashtag-based matching system.', rating: 5, avatar: 'AR', gradient: 'from-teal-500 to-cyan-500' },
]

const variants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
}

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const handlePrev = () => { setDirection(-1); setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length) }
  const handleNext = () => { setDirection(1); setActiveIndex((prev) => (prev + 1) % testimonials.length) }

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-secondary/30">
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Success Stories</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Loved by <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Learners</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Join thousands of learners who found their perfect courses through our AI-powered recommendation system.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="relative">
            <div className="relative bg-card rounded-2xl border border-border/50 p-8 sm:p-12 min-h-[300px] overflow-hidden">
              <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/10" />
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={activeIndex} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="relative z-10">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <blockquote className="text-lg sm:text-xl leading-relaxed mb-8">
                    &ldquo;{testimonials[activeIndex].content}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className={cn('text-white font-semibold text-lg', `bg-gradient-to-br ${testimonials[activeIndex].gradient}`)}>
                        {testimonials[activeIndex].avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonials[activeIndex].name}</div>
                      <div className="text-sm text-muted-foreground">{testimonials[activeIndex].role} at {testimonials[activeIndex].company}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className={cn('absolute bottom-0 right-0 w-64 h-64 rounded-tl-full opacity-5', `bg-gradient-to-br ${testimonials[activeIndex].gradient}`)} />
            </div>

            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setDirection(idx > activeIndex ? 1 : -1); setActiveIndex(idx) }}
                    className={cn('h-2.5 rounded-full transition-all duration-300', idx === activeIndex ? 'w-8 bg-primary' : 'w-2.5 bg-border hover:bg-muted-foreground')}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full"><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full"><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { value: '50,000+', label: 'Active Learners' },
            { value: '4.9/5', label: 'Average Rating' },
            { value: '95%', label: 'Course Completion' },
            { value: '85%', label: 'Career Growth' },
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.5 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.6 + idx * 0.1 }} className="text-center p-6 rounded-xl bg-card border border-border/50">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
