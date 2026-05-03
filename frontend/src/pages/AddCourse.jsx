import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Rocket, X, Tag, Plus, Trash2, ArrowUp, ArrowDown, Video, Upload, CheckCircle2 } from 'lucide-react'

// Defined fixed hashtags aligned with Prolog Engine capabilities
const FIXED_HASHTAGS = [
    'Artificial Intelligence', 'Cybersecurity', 'Data Science', 
    'Machine Learning', 'Python', 'React', 'Cloud Computing', 
    'IoT', 'DevOps', 'Blockchain'
]

const AddCourse = () => {
    const { token, user } = useContext(AuthContext)
    const navigate = useNavigate()
    
    // Wizard State
    const [step, setStep] = useState(1)
    const [error, setError] = useState('')
    
    // Step 1: Basic Info
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [level, setLevel] = useState('Beginner')
    const [selectedHashtags, setSelectedHashtags] = useState([])
    
    // Step 2: Content (Sections and Videos)
    const [sections, setSections] = useState([])
    
    // Step 3: Cover
    const [coverMedia, setCoverMedia] = useState(null)
    
    // Step 4: Upload Tracking
    const [isUploading, setIsUploading] = useState(false)
    const [overallProgress, setOverallProgress] = useState(0)
    const [uploadStatus, setUploadStatus] = useState('')

    if (user?.role !== 'provider') {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
                <Card className="w-full max-w-md bg-destructive/10 border-destructive/30 text-center py-10">
                    <X className="mx-auto w-10 h-10 text-destructive mb-4" />
                    <CardTitle className="text-2xl mb-2 text-destructive">Unauthorized</CardTitle>
                    <CardDescription>Only providers can deploy new courses.</CardDescription>
                </Card>
            </div>
        )
    }

    // --- Handlers for Step 1 ---
    const toggleHashtag = (tag) => {
        if (selectedHashtags.includes(tag)) {
            setSelectedHashtags(selectedHashtags.filter(t => t !== tag))
        } else {
            setSelectedHashtags([...selectedHashtags, tag])
        }
    }

    // --- Handlers for Step 2 ---
    const addSection = () => {
        setSections([...sections, { id: Date.now(), title: '', videos: [] }])
    }

    const updateSectionTitle = (id, newTitle) => {
        setSections(sections.map(sec => sec.id === id ? { ...sec, title: newTitle } : sec))
    }

    const removeSection = (id) => {
        setSections(sections.filter(sec => sec.id !== id))
    }

    const moveSection = (index, direction) => {
        if (index + direction < 0 || index + direction >= sections.length) return
        const newSections = [...sections]
        const temp = newSections[index]
        newSections[index] = newSections[index + direction]
        newSections[index + direction] = temp
        setSections(newSections)
    }

    const addVideo = (sectionId, file) => {
        if (!file) return
        setSections(sections.map(sec => {
            if (sec.id === sectionId) {
                return { ...sec, videos: [...sec.videos, { id: Date.now(), file, title: file.name }] }
            }
            return sec
        }))
    }

    const updateVideoTitle = (sectionId, videoId, newTitle) => {
        setSections(sections.map(sec => {
            if (sec.id === sectionId) {
                return { ...sec, videos: sec.videos.map(vid => vid.id === videoId ? { ...vid, title: newTitle } : vid) }
            }
            return sec
        }))
    }

    const removeVideo = (sectionId, videoId) => {
        setSections(sections.map(sec => {
            if (sec.id === sectionId) {
                return { ...sec, videos: sec.videos.filter(vid => vid.id !== videoId) }
            }
            return sec
        }))
    }

    const moveVideo = (sectionId, index, direction) => {
        setSections(sections.map(sec => {
            if (sec.id === sectionId) {
                const newVids = [...sec.videos]
                if (index + direction < 0 || index + direction >= newVids.length) return sec
                const temp = newVids[index]
                newVids[index] = newVids[index + direction]
                newVids[index + direction] = temp
                return { ...sec, videos: newVids }
            }
            return sec
        }))
    }

    // --- Upload Logic (Step 4) ---
    const uploadSingleFile = async (fileObj) => {
        const formData = new FormData()
        formData.append('file', fileObj)
        
        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data.url
        } catch (err) {
            console.error("Upload error", err)
            throw new Error(`Failed to upload ${fileObj.name}`)
        }
    }

    const handleSubmit = async () => {
        setError('')
        setIsUploading(true)
        setUploadStatus('Initializing upload sequence...')
        setOverallProgress(5)

        try {
            // Priority 1: Upload Cover Media
            let coverMediaUrl = null
            if (coverMedia) {
                setUploadStatus(`Uploading Cover Media...`)
                coverMediaUrl = await uploadSingleFile(coverMedia)
                setOverallProgress(20)
            }

            // Priority 2: Upload Files across Sections parallel/seq
            // To provide smooth tracking, we will upload sequentially
            let finalSections = []
            let totalVideosToUpload = sections.reduce((acc, sec) => acc + sec.videos.length, 0)
            let uploadedCount = 0

            for (const [sIndex, sec] of sections.entries()) {
                setUploadStatus(`Processing section: ${sec.title || `Section ${sIndex+1}`}`)
                
                let finalVideos = []
                for (const vid of sec.videos) {
                    setUploadStatus(`Uploading video: ${vid.title || vid.file.name}`)
                    const vidUrl = await uploadSingleFile(vid.file)
                    
                    finalVideos.push({
                        title: vid.title,
                        file_path: vidUrl,
                        order: finalVideos.length + 1
                    })
                    
                    uploadedCount++
                    setOverallProgress(20 + Math.floor((uploadedCount / Math.max(totalVideosToUpload, 1)) * 60))
                }
                
                finalSections.push({
                    title: sec.title || `Section ${sIndex+1}`,
                    order: sIndex + 1,
                    videos: finalVideos
                })
            }

            // Priority 3: Submit final JSON state to MongoDB
            setUploadStatus('Finalizing course metadata...')
            setOverallProgress(90)
            
            const payload = {
                title,
                description,
                level,
                hashtags: selectedHashtags,
                cover_media: coverMediaUrl,
                sections: finalSections
            }

            const res = await axios.post('http://localhost:5000/api/courses', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            
            if (res.status === 201) {
                setOverallProgress(100)
                setUploadStatus('Course deployed successfully!')
                setTimeout(() => navigate('/dashboard'), 1500)
            }
            
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || err.message || 'Fatal deployment anomaly detected.')
            setIsUploading(false)
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 flex justify-center">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-3xl"
            >
                <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
                    
                    {/* Stepper Header */}
                    <div className="bg-secondary/40 flex divide-x divide-border/50 border-b border-border/50">
                        {['Basic Info', 'Content Structure', 'Cover Media', 'Finalize'].map((s, idx) => (
                            <div 
                                key={s} 
                                className={`flex-1 py-3 text-center text-xs sm:text-sm font-medium transition-colors ${step === idx + 1 ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                            >
                                Step {idx + 1}: {s}
                            </div>
                        ))}
                    </div>

                    <CardHeader className="pt-6 pb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-primary/20">
                                <Rocket className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">
                                    {step === 1 && "Course Initialization"}
                                    {step === 2 && "Syllabus Injection"}
                                    {step === 3 && "Preview Media Assets"}
                                    {step === 4 && "Deployment Execution"}
                                </CardTitle>
                                <CardDescription>Follow the rigid procedure to embed data into the engine</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 pt-4 min-h-[400px]">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                                {error}
                            </div>
                        )}
                        
                        <AnimatePresence mode="wait">
                            {/* STEP 1: Basic Information */}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Course Title</Label>
                                        <Input id="title" placeholder="e.g. Introduction to Neural Networks" value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-background/50 text-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Module Description</Label>
                                        <Textarea id="description" rows={4} placeholder="Detail the objectives and syllabus of this module..." value={description} onChange={(e) => setDescription(e.target.value)} required className="bg-background/50 resize-y" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="level">Difficulty Matrix</Label>
                                            <Select value={level} onValueChange={setLevel}>
                                                <SelectTrigger className="bg-background/50">
                                                    <SelectValue placeholder="Select level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Prolog Engine Standard Hashtags</Label>
                                            <div className="flex flex-wrap gap-2 pt-2 border rounded-md p-3 bg-background/30 border-border/50 max-h-40 overflow-y-auto">
                                                {FIXED_HASHTAGS.map((tag) => (
                                                    <Badge 
                                                        key={tag} 
                                                        variant={selectedHashtags.includes(tag) ? "default" : "outline"}
                                                        className={`cursor-pointer transition-all ${selectedHashtags.includes(tag) ? 'bg-primary hover:bg-primary/90' : 'hover:bg-primary/20 text-muted-foreground'}`}
                                                        onClick={() => toggleHashtag(tag)}
                                                    >
                                                        {selectedHashtags.includes(tag) && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <span className="text-xs text-muted-foreground">Select required tags for logic mapping.</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: Sections & Content */}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    {sections.length === 0 ? (
                                        <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-lg bg-card/30">
                                            <Video className="mx-auto w-10 h-10 text-muted-foreground opacity-50 mb-3" />
                                            <p className="text-muted-foreground mb-4">No structural sections detected.</p>
                                            <Button onClick={addSection} variant="outline" className="gap-2">
                                                <Plus className="w-4 h-4" /> Initialize First Section
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                                            {sections.map((sec, sIndex) => (
                                                <div key={sec.id} className="p-4 border border-border/50 rounded-lg bg-secondary/20 relative group">
                                                    <div className="flex gap-2 items-center mb-4">
                                                        <div className="flex flex-col gap-1">
                                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled={sIndex === 0} onClick={() => moveSection(sIndex, -1)}><ArrowUp className="w-3 h-3" /></Button>
                                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled={sIndex === sections.length - 1} onClick={() => moveSection(sIndex, 1)}><ArrowDown className="w-3 h-3" /></Button>
                                                        </div>
                                                        <Input 
                                                            value={sec.title} 
                                                            onChange={(e) => updateSectionTitle(sec.id, e.target.value)} 
                                                            placeholder={`Section ${sIndex + 1} Title (e.g. Introduction)`} 
                                                            className="flex-1 font-semibold"
                                                        />
                                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeSection(sec.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="pl-8 space-y-3">
                                                        {sec.videos.map((vid, vIndex) => (
                                                            <div key={vid.id} className="flex gap-2 items-center border border-border/30 rounded p-2 bg-background/50">
                                                                <div className="flex flex-col">
                                                                    <Button type="button" variant="ghost" size="icon" className="h-5 w-5" disabled={vIndex === 0} onClick={() => moveVideo(sec.id, vIndex, -1)}><ArrowUp className="w-3 h-3" /></Button>
                                                                    <Button type="button" variant="ghost" size="icon" className="h-5 w-5" disabled={vIndex === sec.videos.length - 1} onClick={() => moveVideo(sec.id, vIndex, 1)}><ArrowDown className="w-3 h-3" /></Button>
                                                                </div>
                                                                <Video className="w-4 h-4 text-primary" />
                                                                <Input value={vid.title} onChange={(e) => updateVideoTitle(sec.id, vid.id, e.target.value)} className="flex-1 h-8 text-sm" />
                                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeVideo(sec.id, vid.id)} className="h-8 w-8 text-destructive">
                                                                    <Trash2 className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        
                                                        <div className="pt-2">
                                                            <Label className="cursor-pointer">
                                                                <div className="flex items-center gap-2 text-sm text-primary border border-primary/20 hover:bg-primary/10 border-dashed rounded py-2 px-4 w-max transition-colors">
                                                                    <Plus className="w-4 h-4" /> Attach Video Node
                                                                </div>
                                                                <input type="file" accept="video/*" className="hidden" onChange={(e) => addVideo(sec.id, e.target.files[0])} />
                                                            </Label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <Button onClick={addSection} variant="outline" className="w-full border-dashed gap-2">
                                                <Plus className="w-4 h-4" /> Append Section Cluster
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* STEP 3: Cover Media */}
                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex flex-col items-center justify-center min-h-[300px]">
                                    <div className="w-full max-w-md border-2 border-dashed border-border/50 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-card/30 hover:bg-card/50 transition-colors">
                                        {coverMedia ? (
                                            <>
                                                <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
                                                <p className="font-medium text-foreground mb-1">{coverMedia.name}</p>
                                                <p className="text-sm text-muted-foreground mb-4">{(coverMedia.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" onClick={() => setCoverMedia(null)}>Remove Preview</Button>
                                                </div>
                                            </>
                                        ) : (
                                            <Label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                                                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                                                <h4 className="text-lg font-medium mb-1">Upload Cover Media</h4>
                                                <p className="text-sm text-muted-foreground mb-6">Drag and drop or click to attach image/video.</p>
                                                <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => setCoverMedia(e.target.files[0])} />
                                            </Label>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: Review & Deploy */}
                            {step === 4 && (
                                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <h3 className="text-xl font-medium mb-4">Pre-Deployment Verification</h3>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-sm bg-secondary/20 p-4 rounded-lg">
                                        <div><span className="text-muted-foreground">Module ID:</span> {title || 'Untitled'}</div>
                                        <div><span className="text-muted-foreground">Difficulty:</span> {level}</div>
                                        <div><span className="text-muted-foreground">Sections Matrix:</span> {sections.length} block(s)</div>
                                        <div><span className="text-muted-foreground">Media Packages:</span> {sections.reduce((ac, s) => ac + s.videos.length, 0)} object(s)</div>
                                        <div className="col-span-2">
                                            <span className="text-muted-foreground">Prolog Tags: </span> 
                                            {selectedHashtags.length > 0 ? selectedHashtags.join(', ') : 'None selected (Warning)'}
                                        </div>
                                    </div>

                                    {isUploading && (
                                        <div className="mt-8 space-y-2 p-6 border border-border/50 bg-card rounded-lg shadow-inner">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium animate-pulse">{uploadStatus}</span>
                                                <span className="text-sm text-muted-foreground">{overallProgress}%</span>
                                            </div>
                                            <Progress value={overallProgress} className="h-2" />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                    
                    <CardFooter className="pt-4 border-t border-border/30 bg-secondary/10 flex justify-between">
                        <Button 
                            variant="ghost" 
                            onClick={() => setStep(step - 1)} 
                            disabled={step === 1 || isUploading}
                        >
                            Back
                        </Button>
                        
                        {step < 4 ? (
                            <Button 
                                onClick={() => setStep(step + 1)} 
                                disabled={
                                    (step === 1 && (!title || !description)) || 
                                    (step === 2 && sections.length === 0)
                                }
                                className="bg-gradient-to-r from-primary to-accent"
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleSubmit} 
                                disabled={isUploading}
                                className="bg-gradient-to-r from-primary to-accent gap-2"
                            >
                                {isUploading ? 'Executing...' : <><Rocket className="w-4 h-4" /> Start Core Deployment</>}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}

export default AddCourse
