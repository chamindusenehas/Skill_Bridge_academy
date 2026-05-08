import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthContext } from '../context/AuthContext'
import { BookOpen, Clock, Tag, Play, CheckCircle2, Video, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const getMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
  return url;
}

const fallbackGradients = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
]

const CourseView = () => {
  const { id } = useParams()
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [activeVideo, setActiveVideo] = useState(null)
  const [progressData, setProgressData] = useState({})
  const [videoDuration, setVideoDuration] = useState(0)
  const [updatingProgress, setUpdatingProgress] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${id}`)
        const data = await res.json()
        if (res.ok) {
          setCourse(data.course)
          if (data.course.sections?.length > 0 && data.course.sections[0].videos?.length > 0) {
            setActiveVideo(data.course.sections[0].videos[0])
          }
        }
      } catch (err) {
        console.error('Failed to fetch course', err)
      } finally {
        setLoading(false)
      }
    }

    const checkEnrollment = async () => {
      if (!user || user.role !== 'learner') return // Only check for learners
      try {
        const res = await fetch('http://localhost:5000/api/enrollments/my', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          const enrolledIds = new Set((data.enrollments || []).map(e => e.course_id || e._id))
          if (enrolledIds.has(id)) {
            setIsEnrolled(true)
            // Fetch progress
            const progRes = await fetch(`http://localhost:5000/api/enrollments/${id}/progress`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            if (progRes.ok) {
              const progData = await progRes.json()
              setProgressData(progData.progress || {})
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch enrollments', err)
      }
    }

    fetchCourse()
    checkEnrollment()
  }, [id, user, token])

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setEnrolling(true)
    try {
      const res = await fetch('http://localhost:5000/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ course_id: id })
      })
      if (res.ok) setIsEnrolled(true)
    } catch (err) {
      console.error('Enrolment failed', err)
    } finally {
      setEnrolling(false)
    }
  }

  const handleUpdateProgress = async (video, watched_time, duration, mark_done) => {
    if (!isEnrolled || user?.role !== 'learner') return;
    setUpdatingProgress(true);
    try {
      const res = await fetch(`http://localhost:5000/api/enrollments/${id}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          video_path: video.file_path,
          watched_time: Math.floor(watched_time),
          duration: Math.floor(duration),
          mark_done
        })
      });
      if (res.ok) {
        const data = await res.json();
        setProgressData(data.progress);
      }
    } catch (err) {
      console.error('Failed to update progress', err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleTimeUpdate = (e) => {
    const videoElement = e.target;
    // Update every 10 seconds to avoid spamming the server
    if (Math.floor(videoElement.currentTime) % 10 === 0 && videoElement.currentTime > 0 && !videoElement.paused) {
      handleUpdateProgress(activeVideo, videoElement.currentTime, videoElement.duration, false);
    }
  };

  // Calculate course progress
  const totalVideos = course?.sections?.reduce((acc, sec) => acc + (sec.videos?.length || 0), 0) || 0;
  const completedVideos = Object.values(progressData).filter(p => p.done).length;
  const progressPercentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;


  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading course material...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
        <p className="text-muted-foreground mb-6">The module you're looking for does not exist.</p>
        <Button onClick={() => navigate('/courses')} className="bg-gradient-to-r from-primary to-accent">Back to Courses</Button>
      </div>
    )
  }

  const hasAccess = user?.role === 'provider' || isEnrolled

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Video / Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-black/90 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center border border-border/50 shadow-2xl">
              {hasAccess && activeVideo ? (
                <>
                  <video 
                    key={activeVideo.file_path}
                    src={getMediaUrl(activeVideo.file_path)} 
                    controls 
                    autoPlay
                    onLoadedMetadata={(e) => setVideoDuration(e.target.duration)}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={(e) => handleUpdateProgress(activeVideo, e.target.duration, e.target.duration, true)}
                    className="w-full h-full object-contain"
                  />
                  {/* Mark as Done button overlay */}
                  {user?.role === 'learner' && isEnrolled && (
                    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                      {!progressData[activeVideo.file_path]?.done ? (
                         <Button 
                           size="sm" 
                           onClick={() => handleUpdateProgress(activeVideo, videoDuration, videoDuration, true)}
                           disabled={updatingProgress || !videoDuration}
                           className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg backdrop-blur-md gap-1.5"
                         >
                           <CheckCircle2 className="w-4 h-4" /> Mark as Done
                         </Button>
                      ) : (
                         <Badge className="bg-emerald-500/90 text-white backdrop-blur-md py-1.5 px-3">
                           <CheckCircle2 className="w-4 h-4 mr-1.5" /> Completed
                         </Badge>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-8">
                  {course.cover_media ? (
                    <img src={getMediaUrl(course.cover_media)} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                  ) : (
                    <div className={cn('absolute inset-0 w-full h-full opacity-30 bg-gradient-to-br', fallbackGradients[0])} />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <BookOpen className="w-16 h-16 text-white/50 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">
                      {hasAccess ? 'Select a video to begin' : 'Access Restricted'}
                    </h3>
                    {!hasAccess && (
                      <p className="text-white/60 mb-6 max-w-md">
                        Enroll in this course to access the video lectures and complete learning materials.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Course Details */}
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <Badge variant="outline" className="capitalize bg-primary/5 text-primary border-primary/20">
                      {course.level}
                    </Badge>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.sections?.length || 0} Sections</span>
                  </div>
                </div>
                {!hasAccess && (
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 font-medium whitespace-nowrap"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enrolling...</> : 'Enroll Now'}
                  </Button>
                )}
                {hasAccess && user?.role === 'learner' && (
                  <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Enrolled
                  </Badge>
                )}
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground">
                <p className="text-base leading-relaxed">{course.description}</p>
              </div>

              {/* Progress Bar for enrolled learners */}
              {hasAccess && user?.role === 'learner' && totalVideos > 0 && (
                <div className="mt-8 pt-6 border-t border-border/50">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">Course Progress</h4>
                      <p className="text-xs text-muted-foreground">{completedVideos} of {totalVideos} videos completed</p>
                    </div>
                    <span className="text-lg font-bold text-primary">{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-secondary/50 rounded-full h-2.5 overflow-hidden border border-border/50">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${progressPercentage}%` }} 
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full" 
                    />
                  </div>
                </div>
              )}

              {course.hashtags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border/50">
                  {course.hashtags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="bg-secondary/40 text-foreground border-border/40">
                      <Tag className="w-3 h-3 mr-1" /> {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Syllabus */}
          <div className="lg:col-span-1">
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden sticky top-24">
              <div className="p-4 bg-secondary/30 border-b border-border/50 font-semibold flex items-center justify-between">
                <span>Course Content</span>
                <span className="text-xs text-muted-foreground font-normal">{course.sections?.length || 0} sections</span>
              </div>
              
              <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
                {!course.sections?.length ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No content available yet.
                  </div>
                ) : (
                  course.sections.map((section, sIdx) => {
                    const isActive = activeSection === sIdx;
                    return (
                      <div key={sIdx} className="border-b border-border/50 last:border-0">
                        <button 
                          className={cn(
                            "w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-secondary/30",
                            isActive && "bg-secondary/20"
                          )}
                          onClick={() => setActiveSection(isActive ? null : sIdx)}
                        >
                          <span className="font-medium text-sm pr-4">{section.title}</span>
                          {isActive ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                        </button>
                        
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-background/30"
                            >
                              {section.videos?.length ? (
                                <div className="py-2">
                                  {section.videos.map((vid, vIdx) => {
                                    const isPlaying = activeVideo?.file_path === vid.file_path;
                                    return (
                                      <button
                                        key={vIdx}
                                        disabled={!hasAccess}
                                        onClick={() => setActiveVideo(vid)}
                                        className={cn(
                                          "w-full flex items-start gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                                          isPlaying ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                                          !hasAccess && "opacity-50 cursor-not-allowed"
                                        )}
                                      >
                                        <div className="mt-0.5 shrink-0 relative">
                                          {progressData[vid.file_path]?.done ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                          ) : isPlaying ? (
                                            <Play className="w-4 h-4 fill-primary text-primary" />
                                          ) : (
                                            <Video className="w-4 h-4" />
                                          )}
                                        </div>
                                        <div className="flex-1 text-left">
                                          <span className="leading-snug block">{vid.title}</span>
                                          {/* Show partial progress if any */}
                                          {!progressData[vid.file_path]?.done && progressData[vid.file_path]?.watched_time > 0 && (
                                            <div className="w-full bg-secondary rounded-full h-1 mt-2">
                                              <div 
                                                className="bg-primary h-1 rounded-full" 
                                                style={{ width: `${Math.min(100, (progressData[vid.file_path].watched_time / progressData[vid.file_path].duration) * 100)}%` }} 
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </button>
                                    )
                                  })}
                                </div>
                              ) : (
                                <div className="p-4 text-xs text-muted-foreground text-center">Empty section</div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CourseView
