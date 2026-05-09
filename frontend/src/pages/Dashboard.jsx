import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { PlusCircle, Search, Laptop, Loader2, BookOpen, LogOut, GraduationCap, Play, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  // Provider: all courses they created
  // Learner: only enrolled courses
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (!user) return

    const fetchCourses = async () => {
      try {
        if (user.role === 'provider') {
          const res = await fetch('http://localhost:5000/api/courses/my', {
            headers: { Authorization: `Bearer ${token}` }
          })
          const data = await res.json()
          if (res.ok) setCourses(data.courses || [])
        } else {
          // Learners: fetch enrolled courses
          const res = await fetch('http://localhost:5000/api/enrollments/my', {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            setCourses(data.courses || data.enrollments || [])
          }
        }
      } catch (err) {
        console.error('Failed to fetch courses', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user, token])

  const STATUS_TABS = user?.role === 'provider'
    ? ['all', 'pending', 'approved', 'rejected']
    : []

  const STATUS_COLORS = {
    pending:  'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  }

  const filteredCourses = courses.filter(course => {
    const matchSearch =
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.hashtags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchStatus = statusFilter === 'all' || course.status === statusFilter
    return matchSearch && matchStatus
  })

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl border-border/50 text-center py-10 px-6">
          <GraduationCap className="mx-auto w-10 h-10 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">Please authenticate to view the dashboard.</p>
          <Link to="/login">
            <Button className="bg-gradient-to-r from-primary to-accent">Go to Login</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 bg-primary/10 rounded-xl">
              {user.role === 'provider'
                ? <Laptop className="w-8 h-8 text-primary" />
                : <GraduationCap className="w-8 h-8 text-primary" />
              }
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {user.role === 'provider' ? 'My Courses' : 'My Learning'}
              </h1>
              <p className="text-muted-foreground">
                Welcome back, <span className="font-semibold text-foreground">{user.name}</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">{user.role}</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 w-full md:w-auto"
          >
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-9 bg-background/50 border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {user.role === 'provider' && (
              <Link to="/add-course">
                <Button className="bg-gradient-to-r from-primary to-accent gap-2">
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Course</span>
                </Button>
              </Link>
            )}
            {user.role === 'learner' && (
              <Link to="/recommendations">
                <Button className="bg-gradient-to-r from-primary to-accent gap-2 shadow-md hover:shadow-lg transition-all">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">AI Recommendations</span>
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={logout}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive border-border/50"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Status filter tabs — provider only */}
        {user.role === 'provider' && (
          <div className="flex gap-1 mb-6 bg-secondary/30 p-1 rounded-xl w-fit">
            {STATUS_TABS.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn('px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                  statusFilter === s ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Course Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground animate-pulse">
              {user.role === 'learner' ? 'Loading your enrolled courses...' : 'Loading your courses...'}
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <Card className="bg-card/30 backdrop-blur-sm border-dashed text-center py-20">
            <BookOpen className="mx-auto w-12 h-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              {searchQuery
                ? 'No courses match your search'
                : user.role === 'learner'
                ? 'No enrolled courses yet'
                : 'No courses created yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {user.role === 'learner'
                ? 'Browse the course catalog and enroll in courses you are interested in.'
                : 'Start by adding your first course to the platform.'}
            </p>
            {user.role === 'learner' ? (
              <Link to="/courses">
                <Button className="bg-gradient-to-r from-primary to-accent">Browse Courses</Button>
              </Link>
            ) : (
              <Link to="/add-course">
                <Button className="bg-gradient-to-r from-primary to-accent gap-2">
                  <PlusCircle className="w-4 h-4" /> Add Your First Course
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, idx) => {
              const hasCover = !!course.cover_media
              const gradient = fallbackGradients[idx % fallbackGradients.length]

              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden hover:shadow-lg hover:shadow-primary/5">
                    {/* Cover */}
                    <div className="relative h-40 overflow-hidden">
                      {hasCover ? (
                        <img
                          src={getMediaUrl(course.cover_media)}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className={cn('h-full bg-gradient-to-br', gradient, 'relative')}>
                          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-tl-full" />
                          <BookOpen className="absolute bottom-3 left-3 w-9 h-9 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/40 backdrop-blur-sm text-white border-white/20 capitalize text-xs">
                          {course.level || 'All Levels'}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-2 pt-4">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors line-clamp-2 flex-1">
                          {course.title}
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 pb-3">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                        {course.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {(course.hashtags || []).slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="bg-secondary/30 hover:bg-secondary/50 text-xs text-foreground">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {user.role === 'learner' && (
                        <div className="mt-4 pt-3 border-t border-border/10">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-medium">Course Progress</span>
                            <span className="text-xs font-bold text-primary">
                              {(() => {
                                const totalVideos = course.sections?.reduce((acc, sec) => acc + (sec.videos?.length || 0), 0) || 0;
                                const completed = Object.values(course.user_progress || {}).filter(p => p.done).length;
                                return totalVideos > 0 ? Math.round((completed / totalVideos) * 100) : 0;
                              })()}%
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full" 
                              style={{ width: `${(() => {
                                const totalVideos = course.sections?.reduce((acc, sec) => acc + (sec.videos?.length || 0), 0) || 0;
                                const completed = Object.values(course.user_progress || {}).filter(p => p.done).length;
                                return totalVideos > 0 ? Math.round((completed / totalVideos) * 100) : 0;
                              })()}%` }} 
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>

                  {/* Status badge for provider */}
                  {user.role === 'provider' && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className={cn('text-[10px] py-0 capitalize', STATUS_COLORS[course.status] || STATUS_COLORS.pending)}>
                        {course.status || 'pending'}
                      </Badge>
                    </div>
                  )}

                  {/* Rejection reason */}
                  {user.role === 'provider' && course.status === 'rejected' && course.reject_reason && (
                    <div className="px-4 pb-2">
                      <p className="text-xs text-destructive bg-destructive/5 rounded p-2">
                        ⚠ {course.reject_reason}
                      </p>
                    </div>
                  )}

                  <CardFooter className="pt-3 border-t border-border/10">
                    {user.role === 'learner' ? (
                      <Button onClick={() => navigate(`/course/${course._id}`)} className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                        <Play className="w-4 h-4" /> Continue Learning
                      </Button>
                    ) : (
                      <div className="flex gap-2 w-full">
                        <Button onClick={() => navigate(`/course/${course._id}`)} variant="outline" className="flex-1 text-sm">View</Button>
                        <Button
                          onClick={() => navigate(`/edit-course/${course._id}`)}
                          variant="ghost"
                          className="flex-1 text-sm text-muted-foreground"
                          disabled={course.status === 'rejected'}
                          title={course.status === 'rejected' ? 'Fix rejection reason before editing' : ''}
                        >Edit</Button>
                      </div>
                    )}
                  </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
