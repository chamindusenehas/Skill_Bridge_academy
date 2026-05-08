import { useState, useEffect, useContext, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Send, CheckCircle2, LogIn, Sparkles, Loader2 } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function ReviewSection() {
  const { user, token } = useContext(AuthContext)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-80px' })

  const [stars, setStars] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [note, setNote] = useState('')
  const [role, setRole] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [existingReview, setExistingReview] = useState(null)

  useEffect(() => {
    if (!user || user.role !== 'learner') return
    fetch('http://localhost:5000/api/reviews/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.review) {
          setExistingReview(d.review)
          setStars(d.review.stars || 0)
          setNote(d.review.note || '')
          setRole(d.review.role || '')
        }
      })
      .catch(() => {})
  }, [user, token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stars) { setError('Please select a star rating.'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stars, note: note.trim(), role: role.trim() })
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setExistingReview({ stars, note, role })
      } else {
        setError(data.message || 'Failed to submit review')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="review" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/3 to-background" />
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8 relative">

        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Share Your Experience</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Rate Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Platform</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-xl mx-auto text-muted-foreground">
            Your feedback helps us improve and helps other learners make informed decisions.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="max-w-xl mx-auto">

          {/* Not logged in */}
          {!user && (
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 text-center p-10">
              <LogIn className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-xl mb-2">Sign in to Leave a Review</CardTitle>
              <CardDescription className="mb-6">You need to be signed in as a learner to share your experience.</CardDescription>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-primary to-accent gap-2">
                  Sign In <LogIn className="w-4 h-4" />
                </Button>
              </Link>
            </Card>
          )}

          {/* Logged in as provider */}
          {user && user.role === 'provider' && (
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 text-center p-10">
              <Star className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <CardTitle className="text-xl mb-2">Reviews are for Learners</CardTitle>
              <CardDescription>Only enrolled learners can submit reviews. Switch to a learner account to share your experience.</CardDescription>
            </Card>
          )}

          {/* Logged in as learner — success state */}
          {user && user.role === 'learner' && success && (
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 text-center p-10">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
              </motion.div>
              <CardTitle className="text-xl mb-2">Thank You!</CardTitle>
              <CardDescription className="mb-4">Your review has been {existingReview ? 'updated' : 'submitted'} successfully.</CardDescription>
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn('w-6 h-6', i < stars ? 'text-yellow-500 fill-yellow-500' : 'text-border')} />
                ))}
              </div>
            </Card>
          )}

          {/* Logged in as learner — review form */}
          {user && user.role === 'learner' && !success && (
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">
                  {existingReview ? 'Update Your Review' : 'Write a Review'}
                </CardTitle>
                <CardDescription>
                  {existingReview ? 'You have already submitted a review. You can update it below.' : 'Tell others about your experience on Skill-Bridge Academy.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg">{error}</div>}

                  {/* Star Rating */}
                  <div className="space-y-2">
                    <Label>Your Rating <span className="text-destructive">*</span></Label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <motion.button
                          type="button"
                          key={s}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => setHovered(s)}
                          onMouseLeave={() => setHovered(0)}
                          onClick={() => setStars(s)}
                          className="focus:outline-none"
                        >
                          <Star className={cn(
                            'w-9 h-9 transition-all duration-150',
                            s <= (hovered || stars) ? 'text-yellow-500 fill-yellow-500 drop-shadow-[0_0_6px_rgba(234,179,8,0.6)]' : 'text-border'
                          )} />
                        </motion.button>
                      ))}
                      {(hovered || stars) > 0 && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][(hovered || stars)]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="review-role">Your Role <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input
                      id="review-role"
                      placeholder="e.g. Full-Stack Developer, Data Scientist..."
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>

                  {/* Note */}
                  <div className="space-y-2">
                    <Label htmlFor="review-note">Your Thoughts <span className="text-muted-foreground text-xs">(optional — shown in Success Stories)</span></Label>
                    <Textarea
                      id="review-note"
                      placeholder="Tell us about your experience with Skill-Bridge Academy..."
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      rows={4}
                      className="bg-background/50 resize-none"
                    />
                  </div>

                  <Button type="submit" disabled={submitting || !stars} className="w-full bg-gradient-to-r from-primary to-accent gap-2">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  )
}
