import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, Loader2, ChevronDown, Tag, GraduationCap, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedBackground } from '@/components/animated-background'
import { AuthContext } from '../context/AuthContext'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

const levelColors = {
  beginner:     'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  intermediate: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  advanced:     'bg-rose-500/10 text-rose-500 border-rose-500/20',
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

const Courses = () => {
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()

  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [enrollingId, setEnrollingId] = useState(null)
  const [enrolledIds, setEnrolledIds] = useState(new Set())
  const loadMoreRef = useRef(null)

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/courses')
        const data = await res.json()
        if (res.ok) setAllCourses(data.courses || [])
      } catch (err) {
        console.error('Failed to fetch courses', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // Fetch enrolled course IDs if logged in
  useEffect(() => {
    if (!user || !token) return
    const fetchEnrolled = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/enrollments/my', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setEnrolledIds(new Set((data.enrollments || []).map(e => e.course_id || e._id)))
        }
      } catch (err) {
        // silently ignore — enrollment list is optional
      }
    }
    fetchEnrolled()
  }, [user, token])

  const filtered = allCourses.filter(course => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      course.title.toLowerCase().includes(q) ||
      (course.description || '').toLowerCase().includes(q) ||
      (course.hashtags || []).some(t => t.toLowerCase().includes(q))
    const matchesTag = !activeTag || (course.hashtags || []).includes(activeTag)
    return matchesSearch && matchesTag
  })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length
  const allTags = [...new Set(allCourses.flatMap(c => c.hashtags || []))].slice(0, 14)

  const handleLoadMore = () => {
    setLoadingMore(true)
    setTimeout(() => {
      setVisibleCount(prev => prev + PAGE_SIZE)
      setLoadingMore(false)
      setTimeout(() => {
        loadMoreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }, 400)
  }

  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [searchQuery, activeTag])

  const handleEnroll = async (courseId) => {
    if (!user) {
      navigate('/login')
      return
    }

    if (enrolledIds.has(courseId)) return // already enrolled

    setEnrollingId(courseId)
    try {
      const res = await fetch('http://localhost:5000/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ course_id: courseId })
      })
      if (res.ok) {
        setEnrolledIds(prev => new Set([...prev, courseId]))
      }
    } catch (err) {
      console.error('Enrolment failed', err)
    } finally {
      setEnrollingId(null)
    }
  }

  return (
    <div className="relative min-h-screen pt-24 pb-16">
      <AnimatedBackground />
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-primary/20">
            <BookOpen className="w-4 h-4" />
            Course Library
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Explore{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              All Courses
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our full catalog of AI-curated courses. Find the perfect path to bridge your skill gap.
          </p>
        </motion.div>

        {/* Search + Tag Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, topics, or hashtags..."
              className="pl-11 h-12 bg-background/60 border-border/50 backdrop-blur-sm text-base"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                  activeTag === null
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary/40 text-muted-foreground border-border/40 hover:bg-secondary/70'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 flex items-center gap-1 ${
                    activeTag === tag
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary/40 text-muted-foreground border-border/40 hover:bg-secondary/70'
                  }`}
                >
                  <Tag className="w-3 h-3" />#{tag}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6 text-sm text-muted-foreground"
        >
          <span>
            Showing <span className="text-foreground font-semibold">{visible.length}</span> of{' '}
            <span className="text-foreground font-semibold">{filtered.length}</span> courses
          </span>
          {!user && (
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
              Sign in to enroll
            </span>
          )}
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground animate-pulse">Loading course catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <GraduationCap className="mx-auto w-12 h-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">Try a different search term or clear the filter.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(''); setActiveTag(null) }}>
              Clear filters
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {visible.map((course, idx) => {
                  const isEnrolled = enrolledIds.has(course._id)
                  const isEnrolling = enrollingId === course._id
                  const hasCover = !!course.cover_media
                  const gradient = fallbackGradients[idx % fallbackGradients.length]

                  return (
                    <motion.div
                      key={course._id}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, delay: (idx % PAGE_SIZE) * 0.04 }}
                    >
                      <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden hover:shadow-lg hover:shadow-primary/5">
                        {/* Cover Media */}
                        <div className="relative h-44 overflow-hidden">
                          {hasCover ? (
                            <img
                              src={getMediaUrl(course.cover_media)}
                              alt={course.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className={cn('h-full bg-gradient-to-br', gradient, 'relative')}>
                              <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/10 rounded-tl-full" />
                              <BookOpen className="absolute bottom-3 left-3 w-10 h-10 text-white/20" />
                            </div>
                          )}
                          {/* Play overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                              <Play className="w-6 h-6 text-white fill-white" />
                            </div>
                          </div>
                          {/* Level badge */}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-black/40 backdrop-blur-sm text-white border-white/20 capitalize text-xs">
                              {course.level || 'All Levels'}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-2 pt-4">
                          <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {course.title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="flex-1 pb-3">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                            {course.description}
                          </p>
                          {course.hashtags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-auto">
                              {course.hashtags.slice(0, 3).map((tag, i) => (
                                <button
                                  key={i}
                                  onClick={() => setActiveTag(tag)}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-secondary/40 hover:bg-secondary/70 text-muted-foreground hover:text-foreground border border-border/30 transition-colors"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          )}
                          {course.sections?.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {course.sections.length} section{course.sections.length !== 1 ? 's' : ''}
                            </p>
                          )}
                        </CardContent>

                        <CardFooter className="pt-3 border-t border-border/20">
                          <Button
                            className={cn(
                              'w-full font-medium transition-all',
                              isEnrolled
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-gradient-to-r from-primary to-accent hover:opacity-90'
                            )}
                            onClick={() => handleEnroll(course._id)}
                            disabled={isEnrolling || isEnrolled}
                          >
                            {isEnrolling
                              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enrolling...</>
                              : isEnrolled
                              ? '✓ Enrolled'
                              : user
                              ? 'Enroll Now'
                              : 'Sign In to Enroll'
                            }
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Load More */}
            {hasMore && (
              <div ref={loadMoreRef} className="flex flex-col items-center gap-3 mt-12">
                <p className="text-sm text-muted-foreground">
                  {filtered.length - visibleCount} more course{filtered.length - visibleCount !== 1 ? 's' : ''} available
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 min-w-[200px]"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Loading...</>
                  ) : (
                    <><ChevronDown className="w-4 h-4" />Load More Courses</>
                  )}
                </Button>
              </div>
            )}

            {/* All loaded */}
            {!hasMore && filtered.length > PAGE_SIZE && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-12 text-sm text-muted-foreground"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  You've seen all {filtered.length} courses!
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Courses
