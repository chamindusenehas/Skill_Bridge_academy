import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const gradients = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-amber-500',
  'from-green-500 to-emerald-500',
  'from-teal-500 to-cyan-500',
  'from-rose-500 to-red-500',
  'from-indigo-500 to-violet-500',
]

const variants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({ total_learners: 0, avg_rating: 0 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  useEffect(() => {
    // Fetch reviews with notes
    fetch('http://localhost:5000/api/reviews')
      .then(r => r.json())
      .then(d => {
        const withNotes = (d.reviews || []).filter(r => r.note && r.note.trim().length > 0)
        setReviews(withNotes)
      })
      .catch(() => {})

    fetch('http://localhost:5000/api/reviews/stats')
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (reviews.length <= 1) return
    const timer = setInterval(() => {
      setDirection(1)
      setActiveIndex(prev => (prev + 1) % reviews.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [reviews])

  const handlePrev = () => {
    setDirection(-1)
    setActiveIndex(prev => (prev - 1 + reviews.length) % reviews.length)
  }
  const handleNext = () => {
    setDirection(1)
    setActiveIndex(prev => (prev + 1) % reviews.length)
  }

  const learnersLabel = stats.total_learners >= 1000
    ? `${(stats.total_learners / 1000).toFixed(1)}K+`
    : `${stats.total_learners || 0}+`

  const avgRatingLabel = stats.avg_rating ? `${Number(stats.avg_rating).toFixed(1)}/5` : '—'

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
            Join learners who found their perfect courses through our AI-powered recommendation system.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="relative">
            <div className="relative bg-card rounded-2xl border border-border/50 p-8 sm:p-12 min-h-[300px] overflow-hidden flex items-center justify-center">
              <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/10" />

              {reviews.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="w-10 h-10 mx-auto mb-3 text-yellow-500/40" />
                  <p className="text-lg font-medium mb-1">No reviews yet</p>
                  <p className="text-sm">Be the first to share your experience!</p>
                </div>
              ) : (
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div key={activeIndex} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="relative z-10 w-full">
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn('w-5 h-5', i < (reviews[activeIndex]?.stars || 5) ? 'text-yellow-500 fill-yellow-500' : 'text-border')} />
                      ))}
                    </div>
                    <blockquote className="text-lg sm:text-xl leading-relaxed mb-8">
                      &ldquo;{reviews[activeIndex]?.note}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className={cn('text-white font-semibold text-lg', `bg-gradient-to-br ${gradients[activeIndex % gradients.length]}`)}>
                          {reviews[activeIndex]?.user_name?.charAt(0)?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{reviews[activeIndex]?.user_name}</div>
                        {reviews[activeIndex]?.role && (
                          <div className="text-sm text-muted-foreground">{reviews[activeIndex].role}</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {reviews.length > 0 && (
                <div className={cn('absolute bottom-0 right-0 w-64 h-64 rounded-tl-full opacity-5', `bg-gradient-to-br ${gradients[activeIndex % gradients.length]}`)} />
              )}
            </div>

            {reviews.length > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-2">
                  {reviews.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setDirection(idx > activeIndex ? 1 : -1); setActiveIndex(idx) }}
                      className={cn('h-2.5 rounded-full transition-all duration-300', idx === activeIndex ? 'w-8 bg-primary' : 'w-2.5 bg-border hover:bg-muted-foreground')}
                      aria-label={`Go to review ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full"><ChevronLeft className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full"><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Dynamic stats — only Active Learners and Avg Rating */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }} className="grid grid-cols-2 gap-6 mt-16 max-w-sm mx-auto">
          {[
            { value: learnersLabel, label: 'Active Learners' },
            { value: avgRatingLabel, label: 'Average Rating', star: true },
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.5 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.6 + idx * 0.1 }} className="text-center p-6 rounded-xl bg-card border border-border/50">
              <div className="flex items-center justify-center gap-1">
                {stat.star && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</div>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
