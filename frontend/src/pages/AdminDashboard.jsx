import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, Clock, BookOpen, Search, ChevronDown, ChevronUp, Shield, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const getMediaUrl = (url) => {
  if (!url) return null
  if (url.startsWith('/uploads')) return `http://localhost:5000${url}`
  return url
}

const STATUS_CONFIG = {
  pending:  { label: 'Pending Review', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Clock },
  approved: { label: 'Approved',       color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle2 },
  rejected: { label: 'Rejected',       color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
}

function CourseCard({ course, onApprove, onReject, actioning }) {
  const [expanded, setExpanded] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject] = useState(false)
  const cfg = STATUS_CONFIG[course.status] || STATUS_CONFIG.pending
  const StatusIcon = cfg.icon

  const handleReject = () => {
    onReject(course._id, rejectReason)
    setShowReject(false)
    setRejectReason('')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="bg-card/60 backdrop-blur border-border/50 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Cover thumbnail */}
          <div className="w-full md:w-40 h-32 md:h-auto shrink-0 bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
            {course.cover_media ? (
              <img src={getMediaUrl(course.cover_media)} alt="" className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="absolute inset-0 m-auto w-10 h-10 text-primary/30" />
            )}
          </div>

          {/* Body */}
          <div className="flex-1 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-semibold text-base leading-snug">{course.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  By <span className="text-foreground">{course.provider_name || 'Unknown Provider'}</span>
                  {' · '}<Badge variant="outline" className="capitalize text-xs py-0">{course.level}</Badge>
                </p>
              </div>
              <Badge variant="outline" className={cn('text-xs flex items-center gap-1', cfg.color)}>
                <StatusIcon className="w-3 h-3" /> {cfg.label}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {(course.hashtags || []).slice(0, 4).map(tag => (
                <span key={tag} className="text-[11px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">#{tag}</span>
              ))}
            </div>

            {/* Details toggle */}
            <button onClick={() => setExpanded(e => !e)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3">
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? 'Hide' : 'Show'} sections ({course.sections?.length || 0})
            </button>

            {expanded && (
              <div className="mb-4 space-y-1 pl-2 border-l border-border/50">
                {(course.sections || []).map((sec, i) => (
                  <div key={i} className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">{sec.title || `Section ${i + 1}`}</span>
                    {' · '}{sec.videos?.length || 0} video(s)
                  </div>
                ))}
              </div>
            )}

            {/* Action row */}
            {course.status === 'pending' && (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 gap-1.5" disabled={actioning === course._id} onClick={() => onApprove(course._id)}>
                  {actioning === course._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                  Approve
                </Button>
                <Button size="sm" variant="destructive" className="gap-1.5" disabled={actioning === course._id} onClick={() => setShowReject(r => !r)}>
                  <XCircle className="w-3 h-3" /> Reject
                </Button>
              </div>
            )}

            {showReject && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-2">
                <Input
                  placeholder="Reason for rejection (optional)"
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="text-sm bg-background/50"
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive" onClick={handleReject} disabled={actioning === course._id}>
                    {actioning === course._id ? <Loader2 className="w-3 h-3 animate-spin" /> : null} Confirm Reject
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowReject(false)}>Cancel</Button>
                </div>
              </motion.div>
            )}

            {course.status === 'rejected' && course.reject_reason && (
              <div className="mt-2 flex items-start gap-2 text-xs text-destructive bg-destructive/5 rounded p-2">
                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                <span>{course.reject_reason}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

const TABS = ['pending', 'approved', 'rejected']

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [tab, setTab] = useState('pending')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actioning, setActioning] = useState(null)

  const fetchCourses = async (status) => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/admin/courses?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) setCourses(data.courses || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCourses(tab) }, [tab, token])

  const handleApprove = async (courseId) => {
    setActioning(courseId)
    try {
      await fetch(`http://localhost:5000/api/admin/courses/${courseId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCourses(tab)
    } finally { setActioning(null) }
  }

  const handleReject = async (courseId, reason) => {
    setActioning(courseId)
    try {
      await fetch(`http://localhost:5000/api/admin/courses/${courseId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason })
      })
      fetchCourses(tab)
    } finally { setActioning(null) }
  }

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.provider_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border-b border-border/50">
        <div className="container mx-auto px-4 py-8 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Control Panel</h1>
            <p className="text-muted-foreground text-sm">Review and manage course submissions from providers</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {TABS.map(s => {
            const cfg = STATUS_CONFIG[s]
            const Icon = cfg.icon
            return (
              <button key={s} onClick={() => setTab(s)} className={cn('p-4 rounded-xl border text-left transition-all', tab === s ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-card/50 hover:border-border')}>
                <Icon className={cn('w-5 h-5 mb-1', s === 'pending' ? 'text-yellow-500' : s === 'approved' ? 'text-emerald-500' : 'text-destructive')} />
                <div className="text-xl font-bold">{/* count placeholder */}</div>
                <div className="text-sm font-medium capitalize">{s}</div>
              </button>
            )
          })}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 bg-secondary/30 p-1 rounded-xl w-fit">
          {TABS.map(s => (
            <button key={s} onClick={() => setTab(s)} className={cn('px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize', tab === s ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground')}>
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or provider..." className="pl-9 bg-background/50" />
        </div>

        {/* Course list */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No <span className="capitalize">{tab}</span> courses found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(course => (
              <CourseCard key={course._id} course={course} onApprove={handleApprove} onReject={handleReject} actioning={actioning} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
