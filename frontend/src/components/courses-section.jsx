import { useRef, useState, useEffect, useContext } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Code, ArrowRight, Clock, Star, Users, Play, BookOpen, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { cn } from '@/lib/utils'

const levelColors = {
  beginner:     'from-emerald-500 to-teal-500',
  intermediate: 'from-blue-500 to-cyan-500',
  advanced:     'from-rose-500 to-orange-500',
}

const fallbackGradients = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
  'from-rose-500 to-red-500',
  'from-indigo-500 to-violet-500',
]

const getMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
  return url;
}

function CourseCard({ course, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const gradient = levelColors[course.level?.toLowerCase()] || fallbackGradients[index % fallbackGradients.length]
  const hasCover = !!course.cover_media

  const handleEnroll = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (!user) navigate('/login')
    else navigate(`/course/${course._id}`)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 h-full flex flex-col shadow-sm hover:shadow-lg hover:shadow-primary/5">
        {/* Cover Media / Gradient Header */}
        <div className="relative h-44 overflow-hidden">
          {hasCover ? (
            <>
              <img
                src={getMediaUrl(course.cover_media)}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-4 rounded-full bg-white/20 backdrop-blur-sm cursor-pointer"
                  onClick={handleEnroll}
                >
                  <Play className="w-8 h-8 text-white fill-white" />
                </motion.div>
              </motion.div>
            </>
          ) : (
            <div className={cn('h-full bg-gradient-to-br', gradient, 'relative')}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-4 rounded-full bg-white/20 backdrop-blur-sm cursor-pointer"
                  onClick={handleEnroll}
                >
                  <Play className="w-8 h-8 text-white fill-white" />
                </motion.div>
              </motion.div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-tl-full" />
              <BookOpen className="absolute bottom-4 left-4 w-12 h-12 text-white/30" />
            </div>
          )}

          {/* Level badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-black/40 backdrop-blur-sm text-white border-white/20 capitalize">
              {course.level || 'All Levels'}
            </Badge>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1 leading-relaxed">
            {course.description}
          </p>

          {/* Hashtags */}
          {course.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {course.hashtags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {course.sections?.length > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {course.sections.length} section{course.sections.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <Button size="sm" variant="ghost" className="group/btn h-8 text-sm" onClick={handleEnroll}>
              {user ? 'View' : 'Enroll'} <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function CoursesSection() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/courses')
        const data = await res.json()
        if (res.ok) setCourses((data.courses || []).slice(0, 6))
      } catch (err) {
        console.error('Failed to fetch courses', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  return (
    <section id="courses" className="relative py-24 sm:py-32 overflow-hidden bg-secondary/30">
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Code className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Popular Courses</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Explore Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tech Courses</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-muted-foreground text-lg"
          >
            Discover courses across cutting-edge technology domains, each tagged with hashtags for our AI recommendation system.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground animate-pulse">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="mx-auto w-12 h-12 mb-4 opacity-30" />
            <p>No courses available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {courses.map((course, index) => (
                <CourseCard key={course._id} course={course} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link to="/courses">
            <Button size="lg" variant="outline" className="rounded-full group">
              View All Courses <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
