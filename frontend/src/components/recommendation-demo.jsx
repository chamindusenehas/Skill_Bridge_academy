import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Brain, Sparkles, ChevronRight, Check, BookOpen, Zap, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const questions = [
  {
    id: 'stem_level', question: 'What is your STEM knowledge level?',
    options: [
      { value: 'beginner', label: 'Beginner - Just starting out' },
      { value: 'intermediate', label: 'Intermediate - Some experience' },
      { value: 'advanced', label: 'Advanced - Experienced professional' },
    ],
  },
  {
    id: 'interest', question: 'Which field interests you most?',
    options: [
      { value: 'ai', label: 'Artificial Intelligence & ML' },
      { value: 'security', label: 'Cybersecurity' },
      { value: 'data', label: 'Data Science' },
      { value: 'web', label: 'Web Development' },
      { value: 'cloud', label: 'Cloud Computing' },
      { value: 'iot', label: 'Internet of Things' },
    ],
  },
  {
    id: 'goal', question: 'What is your primary learning goal?',
    options: [
      { value: 'career', label: 'Career advancement' },
      { value: 'skill', label: 'Skill development' },
      { value: 'project', label: 'Build a specific project' },
      { value: 'certification', label: 'Get certified' },
    ],
  },
  {
    id: 'time', question: 'How much time can you dedicate weekly?',
    options: [
      { value: 'light', label: '5-10 hours' },
      { value: 'moderate', label: '10-20 hours' },
      { value: 'intensive', label: '20+ hours' },
    ],
  },
  {
    id: 'difficulty', question: 'Preferred course difficulty?',
    options: [
      { value: 'easy', label: 'Easy - Fundamentals' },
      { value: 'medium', label: 'Medium - Applied concepts' },
      { value: 'hard', label: 'Hard - Advanced topics' },
    ],
  },
]

const recommendedCourses = [
  { title: 'Machine Learning Foundations', match: 98, tags: ['#ML', '#Python', '#TensorFlow'], level: 'Intermediate', duration: '10 weeks' },
  { title: 'Neural Networks Deep Dive', match: 94, tags: ['#DeepLearning', '#NeuralNets', '#PyTorch'], level: 'Advanced', duration: '12 weeks' },
  { title: 'AI Ethics & Applications', match: 89, tags: ['#AIEthics', '#Applications', '#Research'], level: 'Intermediate', duration: '6 weeks' },
]

export function RecommendationDemo() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const currentQuestion = questions[step]
  const progress = ((step + 1) / questions.length) * 100

  const handleAnswer = (value) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(prev => prev + 1)
    } else {
      setIsProcessing(true)
      setTimeout(() => { setIsProcessing(false); setShowResults(true) }, 2000)
    }
  }

  const handleReset = () => { setStep(0); setAnswers({}); setShowResults(false); setIsProcessing(false) }

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-secondary/30">
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Try It Now</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Experience AI <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Recommendations</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Answer a few questions and see how our Prolog-based AI engine recommends the perfect courses for you.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="max-w-2xl mx-auto">
          <div className="relative rounded-2xl bg-card border border-border/50 overflow-hidden shadow-xl shadow-primary/5">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-muted-foreground ml-2">recommendation_engine.prolog</span>
            </div>

            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {!showResults && !isProcessing && (
                  <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>Question {step + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}% complete</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-primary to-accent" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-mono">{step + 1}</span>
                        {currentQuestion.question}
                      </h3>
                      <Select value={answers[currentQuestion.id] || ''} onValueChange={handleAnswer}>
                        <SelectTrigger className="w-full h-12"><SelectValue placeholder="Select an option..." /></SelectTrigger>
                        <SelectContent>
                          {currentQuestion.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button variant="ghost" onClick={() => setStep(prev => Math.max(0, prev - 1))} disabled={step === 0}>Back</Button>
                      <Button onClick={handleNext} disabled={!answers[currentQuestion.id]} className="bg-gradient-to-r from-primary to-accent">
                        {step === questions.length - 1 ? <><span>Get Recommendations</span><Sparkles className="w-4 h-4 ml-2" /></> : <><span>Next</span><ChevronRight className="w-4 h-4 ml-1" /></>}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {isProcessing && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary" />
                      <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Brain className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Analyzing your profile...</h3>
                    <p className="text-sm text-muted-foreground font-mono">Running Prolog inference engine</p>
                    <div className="mt-6 text-left bg-secondary/50 rounded-lg p-4 font-mono text-xs text-muted-foreground space-y-1">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{`?- recommend(user_profile, Courses).`}</motion.div>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-primary">{`|  Matching hashtags...`}</motion.div>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="text-primary">{`|  Applying rules...`}</motion.div>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="text-green-500">{`|  Found 3 matching courses.`}</motion.div>
                    </div>
                  </motion.div>
                )}

                {showResults && (
                  <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                        <Check className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Perfect Matches Found!</h3>
                      <p className="text-sm text-muted-foreground">Based on your profile, here are your recommended courses</p>
                    </div>

                    <div className="space-y-3">
                      {recommendedCourses.map((course, idx) => (
                        <motion.div
                          key={course.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/50 transition-colors"
                        >
                          <div className={cn('flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg', course.match >= 95 ? 'bg-green-500/20 text-green-500' : course.match >= 90 ? 'bg-blue-500/20 text-blue-500' : 'bg-orange-500/20 text-orange-500')}>
                            {course.match}%
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{course.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">{course.level}</Badge>
                              <span className="text-xs text-muted-foreground">{course.duration}</span>
                            </div>
                          </div>
                          <div className="hidden sm:flex flex-wrap gap-1 max-w-[150px]">
                            {course.tags.map((tag) => (
                              <span key={tag} className="text-[10px] text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">{tag}</span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-4">
                      <Button variant="outline" onClick={handleReset}>Try Again</Button>
                      <Button className="bg-gradient-to-r from-primary to-accent">
                        <BookOpen className="w-4 h-4 mr-2" /> View Full Details
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          {[
            { icon: Zap, title: 'Instant Results', desc: 'Recommendations in under 2 seconds' },
            { icon: Target, title: 'High Accuracy', desc: '95%+ match rate for users' },
            { icon: Brain, title: 'AI-Powered', desc: 'Symbolic Prolog reasoning engine' },
          ].map((item, idx) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 + idx * 0.1 }} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
