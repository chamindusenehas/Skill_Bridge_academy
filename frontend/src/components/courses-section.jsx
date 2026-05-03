import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Brain, Shield, Database, Code, Cloud, Cpu, Clock, Users, Star, ArrowRight, Bookmark, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const categories = [
  { id: 'all', name: 'All Courses', icon: null },
  { id: 'ai', name: 'AI & ML', icon: Brain },
  { id: 'security', name: 'Cybersecurity', icon: Shield },
  { id: 'data', name: 'Data Science', icon: Database },
  { id: 'web', name: 'Web Dev', icon: Code },
  { id: 'cloud', name: 'Cloud', icon: Cloud },
  { id: 'iot', name: 'IoT', icon: Cpu },
]

const courses = [
  { id: 1, title: 'Deep Learning Fundamentals', description: 'Master neural networks, CNNs, RNNs, and transformers with hands-on projects.', category: 'ai', level: 'Intermediate', duration: '12 weeks', students: 2340, rating: 4.9, hashtags: ['#DeepLearning', '#NeuralNetworks', '#PyTorch'], gradient: 'from-blue-500 to-cyan-500', featured: true },
  { id: 2, title: 'Ethical Hacking & Penetration Testing', description: 'Learn to identify vulnerabilities and secure systems like a professional.', category: 'security', level: 'Advanced', duration: '10 weeks', students: 1850, rating: 4.8, hashtags: ['#EthicalHacking', '#PenTesting', '#Security'], gradient: 'from-red-500 to-orange-500', featured: true },
  { id: 3, title: 'Python for Data Science', description: 'Analyze data, build visualizations, and create ML models with Python.', category: 'data', level: 'Beginner', duration: '8 weeks', students: 4520, rating: 4.9, hashtags: ['#Python', '#DataScience', '#Pandas'], gradient: 'from-green-500 to-emerald-500', featured: false },
  { id: 4, title: 'Full-Stack React Development', description: 'Build modern web applications with React, Next.js, and Node.js.', category: 'web', level: 'Intermediate', duration: '14 weeks', students: 3210, rating: 4.7, hashtags: ['#React', '#NextJS', '#FullStack'], gradient: 'from-purple-500 to-pink-500', featured: true },
  { id: 5, title: 'AWS Cloud Architecture', description: 'Design and deploy scalable cloud solutions on Amazon Web Services.', category: 'cloud', level: 'Intermediate', duration: '10 weeks', students: 1980, rating: 4.8, hashtags: ['#AWS', '#CloudArchitecture', '#DevOps'], gradient: 'from-orange-500 to-amber-500', featured: false },
  { id: 6, title: 'IoT Systems Design', description: 'Connect devices, collect data, and build intelligent IoT ecosystems.', category: 'iot', level: 'Advanced', duration: '12 weeks', students: 980, rating: 4.6, hashtags: ['#IoT', '#Embedded', '#Sensors'], gradient: 'from-teal-500 to-cyan-500', featured: false },
]

function CourseCard({ course, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

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
      <div className={cn('relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 h-full flex flex-col')}>
        <div className={cn('relative h-40 p-6', `bg-gradient-to-br ${course.gradient}`)}>
          {course.featured && (
            <Badge className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white border-white/30">Featured</Badge>
          )}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
            <Bookmark className="w-4 h-4 text-white" />
          </motion.button>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <motion.div whileHover={{ scale: 1.1 }} className="p-4 rounded-full bg-white/30 backdrop-blur-sm cursor-pointer">
              <Play className="w-8 h-8 text-white fill-white" />
            </motion.div>
          </motion.div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-tl-full" />
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs font-medium">{course.level}</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />{course.duration}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{course.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {course.hashtags.map((tag) => (
              <span key={tag} className="text-xs text-primary font-mono bg-primary/10 px-2 py-1 rounded-md">{tag}</span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />{course.students.toLocaleString()}</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />{course.rating}</span>
            </div>
            <Button size="sm" variant="ghost" className="group/btn">
              Enroll <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function CoursesSection() {
  const [activeCategory, setActiveCategory] = useState('all')
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const filteredCourses = activeCategory === 'all' ? courses : courses.filter(c => c.category === activeCategory)

  return (
    <section id="courses" className="relative py-24 sm:py-32 overflow-hidden bg-secondary/30">
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Popular Courses</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Explore Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tech Courses</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Discover courses across cutting-edge technology domains, each tagged with hashtags for our AI recommendation system.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className={cn('rounded-full transition-all duration-300', activeCategory === category.id && 'bg-gradient-to-r from-primary to-accent')}
            >
              {category.icon && <category.icon className="w-4 h-4 mr-2" />}
              {category.name}
            </Button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {filteredCourses.map((course, index) => <CourseCard key={course.id} course={course} index={index} />)}
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.5 }} className="text-center mt-12">
          <Button size="lg" variant="outline" className="rounded-full group">
            View All Courses <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
