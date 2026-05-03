import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { PlusCircle, Search, Laptop, Loader2, Sparkles, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext)
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/courses')
                const data = await res.json()
                if (res.ok) {
                    setCourses(data.courses)
                }
            } catch (err) {
                console.error("Failed to fetch courses", err)
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [])

    const filteredCourses = courses.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    if (!user) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
                <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl border-border/50 text-center py-10">
                    <Sparkles className="mx-auto w-10 h-10 text-primary mb-4" />
                    <CardTitle className="text-2xl mb-2">Access Denied</CardTitle>
                    <CardDescription className="mb-6">Please authenticate to view the dashboard.</CardDescription>
                    <Link to="/login">
                        <Button className="bg-gradient-to-r from-primary to-accent">Go to Login</Button>
                    </Link>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            {/* Background elements */}
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
                            <Laptop className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Course Database</h1>
                            <p className="text-muted-foreground">Welcome back, {user.name} ({user.role})</p>
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
                                placeholder="Search courses or hashtags..." 
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
                        <Button variant="outline" size="icon" onClick={logout} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-border/50">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </motion.div>
                </div>

                {/* Course Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                        <p className="text-muted-foreground animate-pulse">Scanning the database...</p>
                    </div>
                ) : (
                    <>
                        {filteredCourses.length === 0 ? (
                            <Card className="bg-card/30 backdrop-blur-sm border-dashed text-center py-20">
                                <Sparkles className="mx-auto w-10 h-10 text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-xl font-medium mb-2">No Courses Found</h3>
                                <p className="text-muted-foreground">Try adjusting your search criteria or wait for new deployments.</p>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course, idx) => (
                                    <motion.div
                                        key={course._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors group overflow-hidden">
                                            {/* Subdued top gradient line */}
                                            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            
                                            <CardHeader>
                                                <div className="flex justify-between items-start mb-2">
                                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                        {course.level}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                    {course.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex-1">
                                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                                                    {course.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-auto">
                                                    {course.hashtags && course.hashtags.map((tag, i) => (
                                                        <Badge key={i} variant="secondary" className="bg-secondary/30 hover:bg-secondary/50 text-xs text-foreground">
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="pt-4 border-t border-border/10">
                                                {user?.role === 'learner' ? (
                                                    <Button className="w-full" variant="outline">
                                                        Enroll Module
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" className="w-full text-muted-foreground" disabled>
                                                        Provider View
                                                    </Button>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Dashboard
