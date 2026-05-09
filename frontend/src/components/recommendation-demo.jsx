import { useState, useRef, useEffect, useContext } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Brain, Sparkles, ChevronRight, Check, BookOpen, Zap, Target, Loader2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AuthContext } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

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

export function RecommendationDemo() {
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ fields: [] })
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const [availableFields, setAvailableFields] = useState([])
  const [loadingFields, setLoadingFields] = useState(true)

  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  useEffect(() => {
    fetch('http://localhost:5000/api/recommendations/hashtags')
      .then(r => r.json())
      .then(d => {
        setAvailableFields(d.hashtags || [])
        setLoadingFields(false)
      })
      .catch(() => setLoadingFields(false))
  }, [])

  const questions = [
    {
      id: 'age', question: 'What is your age?', type: 'number',
    },
    {
      id: 'academic_status', question: 'What is your academic status?',
      options: [
        { value: 'high_school', label: 'High School' },
        { value: 'undergraduate', label: 'Undergraduate' },
        { value: 'graduate', label: 'Graduate' },
        { value: 'professional', label: 'Professional' },
      ],
    },
    {
      id: 'stem_level', question: 'What is your STEM knowledge level?',
      options: [
        { value: 'none', label: 'None - Brand new to tech' },
        { value: 'basic', label: 'Basic - Some fundamentals' },
        { value: 'advanced', label: 'Advanced - Experienced' },
      ],
    },
    {
      id: 'fields', question: 'Which fields interest you?', type: 'multi-select',
    },
    {
      id: 'difficulty', question: 'Preferred course difficulty?',
      options: [
        { value: 'beginner', label: 'Beginner - Fundamentals' },
        { value: 'intermediate', label: 'Intermediate - Applied concepts' },
        { value: 'advanced', label: 'Advanced - Complex topics' },
      ],
    },
  ]

  const currentQuestion = questions[step]
  const progress = ((step + 1) / questions.length) * 100

  const handleAnswer = (value) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(prev => prev + 1)
    } else {
      setIsProcessing(true)
      try {
        const payload = {
          age: parseInt(answers.age || '18', 10),
          academic_status: answers.academic_status || 'none',
          stem_level: answers.stem_level || 'none',
          fields: answers.fields || [],
          difficulty: answers.difficulty || 'beginner'
        }

        const res = await fetch('http://localhost:5000/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (res.ok) {
          setRecommendedCourses(data.courses || [])
        } else {
          setRecommendedCourses([])
        }
      } catch (err) {
        setRecommendedCourses([])
      } finally {
        setTimeout(() => { setIsProcessing(false); setShowResults(true) }, 2000)
      }
    }
  }

  const handleReset = () => { setStep(0); setAnswers({ fields: [] }); setShowResults(false); setIsProcessing(false) }

  const toggleField = (field) => {
    setAnswers(prev => {
      const current = prev.fields || []
      const newFields = current.includes(field) ? current.filter(f => f !== field) : [...current, field]
      return { ...prev, fields: newFields }
    })
  }

  const canProceed = () => {
    if (currentQuestion.type === 'multi-select') return (answers.fields || []).length > 0
    return !!answers[currentQuestion.id]
  }

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-secondary/30" id="recommendation-demo">
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Live AI Integration</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Experience AI <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Recommendations</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Answer a few questions and see how our real Prolog-based AI engine recommends the perfect courses for you directly from our catalog.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl bg-card border border-border/50 overflow-hidden shadow-2xl shadow-primary/5">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-muted-foreground ml-2">recommendation_engine.prolog</span>
            </div>

            <div className="p-6 sm:p-8 min-h-[400px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {!showResults && !isProcessing && (
                  <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="w-full">
                    <div className="mb-8">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>Question {step + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}% complete</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-primary to-accent" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-base font-mono">{step + 1}</span>
                        {currentQuestion.question}
                      </h3>
                      
                      {currentQuestion.type === 'number' ? (
                        <Input 
                          type="number" 
                          min="5" max="100" 
                          placeholder="e.g. 25" 
                          value={answers[currentQuestion.id] || ''} 
                          onChange={(e) => handleAnswer(e.target.value)}
                          className="h-14 text-lg bg-background/50"
                        />
                      ) : currentQuestion.type === 'multi-select' ? (
                        loadingFields ? (
                          <div className="flex items-center gap-2 text-muted-foreground p-4 bg-background/50 rounded-lg"><Loader2 className="w-4 h-4 animate-spin"/> Loading available fields...</div>
                        ) : availableFields.length === 0 ? (
                          <div className="text-muted-foreground italic p-4 bg-background/50 rounded-lg">No fields available right now.</div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {availableFields.map(field => {
                              const isSelected = (answers.fields || []).includes(field)
                              return (
                                <button
                                  key={field}
                                  type="button"
                                  onClick={() => toggleField(field)}
                                  className={cn(
                                    "px-4 py-2.5 rounded-full text-sm font-medium border transition-all",
                                    isSelected
                                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                                      : "bg-secondary/50 border-border/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                  )}
                                >
                                  {field}
                                </button>
                              )
                            })}
                          </div>
                        )
                      ) : (
                        <Select value={answers[currentQuestion.id] || ''} onValueChange={handleAnswer}>
                          <SelectTrigger className="w-full h-14 text-base bg-background/50"><SelectValue placeholder="Select an option..." /></SelectTrigger>
                          <SelectContent>
                            {currentQuestion.options.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="text-base py-3">{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-auto">
                      <Button variant="ghost" size="lg" onClick={() => setStep(prev => Math.max(0, prev - 1))} disabled={step === 0}>Back</Button>
                      <Button size="lg" onClick={handleNext} disabled={!canProceed()} className="bg-gradient-to-r from-primary to-accent">
                        {step === questions.length - 1 ? <><span>Analyze Profile</span><Sparkles className="w-4 h-4 ml-2" /></> : <><span>Next</span><ChevronRight className="w-4 h-4 ml-1" /></>}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {isProcessing && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center w-full">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary" />
                      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Brain className="w-10 h-10 text-primary-foreground" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">Analyzing your profile...</h3>
                    <p className="text-base text-muted-foreground font-mono">Running Prolog inference engine</p>
                    <div className="mt-8 text-left bg-secondary/80 rounded-xl p-6 font-mono text-sm text-muted-foreground space-y-2 border border-border/50 max-w-md mx-auto">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{`?- consult('recommendations.pl').`}</motion.div>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-primary">{`|  Asserting dynamic course facts...`}</motion.div>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="text-primary">{`|  Applying symbolic reasoning rules...`}</motion.div>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="text-green-500">{`|  Matching courses found.`}</motion.div>
                    </div>
                  </motion.div>
                )}

                {showResults && (
                  <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 w-full">
                    <div className="text-center mb-8">
                      {recommendedCourses.length > 0 ? (
                        <>
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
                            <Check className="w-10 h-10 text-green-500" />
                          </div>
                          <h3 className="text-2xl font-semibold mb-3">Perfect Matches Found!</h3>
                          <p className="text-base text-muted-foreground">Based on your Prolog reasoning results, here are your recommended courses.</p>
                        </>
                      ) : (
                        <>
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/10 mb-6">
                            <BookOpen className="w-10 h-10 text-orange-500" />
                          </div>
                          <h3 className="text-2xl font-semibold mb-3">No Exact Matches Found</h3>
                          <p className="text-base text-muted-foreground">Our reasoning engine couldn't find courses perfectly matching all your constraints.</p>
                        </>
                      )}
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {recommendedCourses.map((course, idx) => {
                        const hasCover = !!course.cover_media
                        const gradient = fallbackGradients[idx % fallbackGradients.length]

                        return (
                          <motion.div
                            key={course._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/50 transition-colors group cursor-pointer"
                            onClick={() => navigate(`/course/${course._id}`)}
                          >
                            <div className="relative w-full sm:w-32 h-24 rounded-lg overflow-hidden shrink-0">
                              {hasCover ? (
                                <img src={getMediaUrl(course.cover_media)} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              ) : (
                                <div className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center', gradient)}>
                                  <BookOpen className="w-8 h-8 text-white/30" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                            </div>
                            
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <h4 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">{course.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{course.description}</p>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="text-xs capitalize">{course.level}</Badge>
                                {(course.hashtags || []).slice(0, 3).map((tag) => (
                                  <span key={tag} className="text-[11px] text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md">#{tag}</span>
                                ))}
                              </div>
                            </div>
                            <div className="hidden sm:flex items-center justify-center px-2 text-muted-foreground group-hover:text-primary transition-colors">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 mt-6 border-t border-border/50">
                      <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">Adjust Preferences</Button>
                      <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent" onClick={() => navigate('/courses')}>
                        <BookOpen className="w-4 h-4 mr-2" /> Browse All Courses
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          {[
            { icon: Zap, title: 'Instant Results', desc: 'Live data from Flask API' },
            { icon: Target, title: 'High Accuracy', desc: 'Strict symbolic rule matching' },
            { icon: Brain, title: 'AI-Powered', desc: 'Real SWI-Prolog Inference' },
          ].map((item, idx) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 + idx * 0.1 }} className="text-center p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
