import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import { Rocket, X, Plus, Trash2, ArrowUp, ArrowDown, Video, Upload, CheckCircle2, Loader2, Link as LinkIcon } from 'lucide-react'

const FIXED_HASHTAGS = [
  'Artificial Intelligence', 'Cybersecurity', 'Data Science',
  'Machine Learning', 'Python', 'React', 'Cloud Computing',
  'IoT', 'DevOps', 'Blockchain'
]

const EditCourse = () => {
  const { id } = useParams()
  const { token, user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loadingCourse, setLoadingCourse] = useState(true)
  const [error, setError] = useState('')

  // Step 1
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState('Beginner')
  const [selectedHashtags, setSelectedHashtags] = useState([])

  // Step 2: sections — videos can be {id, file, title} (new) or {id, file_path, title} (existing)
  const [sections, setSections] = useState([])

  // Step 3
  const [coverMedia, setCoverMedia] = useState(null)       // new File
  const [existingCoverUrl, setExistingCoverUrl] = useState('') // already-uploaded URL

  // Step 4
  const [isUploading, setIsUploading] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('')

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${id}`)
        const data = await res.json()
        if (res.ok && data.course) {
          const c = data.course
          setTitle(c.title || '')
          setDescription(c.description || '')
          setLevel(c.level || 'Beginner')
          setSelectedHashtags(c.hashtags || [])
          setExistingCoverUrl(c.cover_media || '')
          // Map existing sections — mark videos as existing (no .file property)
          setSections((c.sections || []).map((sec, si) => ({
            id: Date.now() + si,
            title: sec.title || '',
            videos: (sec.videos || []).map((vid, vi) => ({
              id: Date.now() + si * 1000 + vi,
              title: vid.title || '',
              file_path: vid.file_path || '',  // existing URL
              file: null                        // no new file
            }))
          })))
        }
      } catch (err) {
        setError('Failed to load course data')
      } finally {
        setLoadingCourse(false)
      }
    }
    fetchCourse()
  }, [id])

  if (loadingCourse) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  // --- Step 1 ---
  const toggleHashtag = (tag) => {
    setSelectedHashtags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  // --- Step 2 ---
  const addSection = () => setSections(prev => [...prev, { id: Date.now(), title: '', videos: [] }])
  const updateSectionTitle = (id, val) => setSections(prev => prev.map(s => s.id === id ? { ...s, title: val } : s))
  const removeSection = (id) => setSections(prev => prev.filter(s => s.id !== id))
  const moveSection = (idx, dir) => {
    if (idx + dir < 0 || idx + dir >= sections.length) return
    const arr = [...sections]; [arr[idx], arr[idx + dir]] = [arr[idx + dir], arr[idx]]
    setSections(arr)
  }
  const addVideo = (sectionId, file) => {
    if (!file) return
    setSections(prev => prev.map(s => s.id === sectionId
      ? { ...s, videos: [...s.videos, { id: Date.now(), file, title: file.name, file_path: '' }] }
      : s
    ))
  }
  const updateVideoTitle = (sId, vId, val) => setSections(prev => prev.map(s => s.id === sId
    ? { ...s, videos: s.videos.map(v => v.id === vId ? { ...v, title: val } : v) }
    : s
  ))
  const removeVideo = (sId, vId) => setSections(prev => prev.map(s => s.id === sId
    ? { ...s, videos: s.videos.filter(v => v.id !== vId) }
    : s
  ))
  const moveVideo = (sId, idx, dir) => setSections(prev => prev.map(s => {
    if (s.id !== sId) return s
    const arr = [...s.videos]
    if (idx + dir < 0 || idx + dir >= arr.length) return s
    ;[arr[idx], arr[idx + dir]] = [arr[idx + dir], arr[idx]]
    return { ...s, videos: arr }
  }))

  // --- Upload helper ---
  const uploadFile = async (fileObj) => {
    const form = new FormData()
    form.append('file', fileObj)
    const res = await axios.post('http://localhost:5000/api/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
    })
    return res.data.url
  }

  // --- Submit ---
  const handleSubmit = async () => {
    setError('')
    setIsUploading(true)
    setUploadStatus('Preparing update...')
    setOverallProgress(5)

    try {
      // Cover media: upload only if a new file was selected
      let finalCoverUrl = existingCoverUrl
      if (coverMedia) {
        setUploadStatus('Uploading new cover media...')
        finalCoverUrl = await uploadFile(coverMedia)
        setOverallProgress(20)
      }

      // Sections: upload only new video files
      let totalNew = sections.reduce((acc, s) => acc + s.videos.filter(v => v.file).length, 0)
      let uploaded = 0
      const finalSections = []

      for (const [si, sec] of sections.entries()) {
        setUploadStatus(`Processing: ${sec.title || `Section ${si + 1}`}`)
        const finalVideos = []
        for (const vid of sec.videos) {
          if (vid.file) {
            setUploadStatus(`Uploading: ${vid.title || vid.file.name}`)
            const url = await uploadFile(vid.file)
            finalVideos.push({ title: vid.title, file_path: url, order: finalVideos.length + 1 })
            uploaded++
            setOverallProgress(20 + Math.floor((uploaded / Math.max(totalNew, 1)) * 60))
          } else {
            // Keep existing video as-is
            finalVideos.push({ title: vid.title, file_path: vid.file_path, order: finalVideos.length + 1 })
          }
        }
        finalSections.push({ title: sec.title || `Section ${si + 1}`, order: si + 1, videos: finalVideos })
      }

      setUploadStatus('Saving course metadata...')
      setOverallProgress(90)

      const payload = { title, description, level, hashtags: selectedHashtags, cover_media: finalCoverUrl, sections: finalSections }
      const res = await axios.put(`http://localhost:5000/api/courses/${id}`, payload, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      })

      if (res.status === 200) {
        setOverallProgress(100)
        setUploadStatus('Course updated successfully!')
        setTimeout(() => navigate('/dashboard'), 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Update failed.')
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 flex justify-center">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-3xl">
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">

          {/* Stepper */}
          <div className="bg-secondary/40 flex divide-x divide-border/50 border-b border-border/50">
            {['Basic Info', 'Content Structure', 'Cover Media', 'Save Changes'].map((s, idx) => (
              <div key={s} className={`flex-1 py-3 text-center text-xs sm:text-sm font-medium transition-colors ${step === idx + 1 ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}>
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
                  {step === 1 && 'Edit Basic Info'}
                  {step === 2 && 'Edit Course Content'}
                  {step === 3 && 'Edit Cover Media'}
                  {step === 4 && 'Review & Save'}
                </CardTitle>
                <CardDescription>Modifying course: {title}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-4 min-h-[400px]">
            {error && <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">{error}</div>}

            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Course Title</Label>
                    <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-background/50 text-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="bg-background/50 resize-y" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Difficulty Level</Label>
                      <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Hashtags</Label>
                      <div className="flex flex-wrap gap-2 pt-2 border rounded-md p-3 bg-background/30 border-border/50 max-h-40 overflow-y-auto">
                        {FIXED_HASHTAGS.map(tag => (
                          <Badge key={tag} variant={selectedHashtags.includes(tag) ? 'default' : 'outline'}
                            className={`cursor-pointer transition-all ${selectedHashtags.includes(tag) ? 'bg-primary hover:bg-primary/90' : 'hover:bg-primary/20 text-muted-foreground'}`}
                            onClick={() => toggleHashtag(tag)}>
                            {selectedHashtags.includes(tag) && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  {sections.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-lg bg-card/30">
                      <Video className="mx-auto w-10 h-10 text-muted-foreground opacity-50 mb-3" />
                      <p className="text-muted-foreground mb-4">No sections yet.</p>
                      <Button onClick={addSection} variant="outline" className="gap-2"><Plus className="w-4 h-4" /> Add Section</Button>
                    </div>
                  ) : (
                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                      {sections.map((sec, sIdx) => (
                        <div key={sec.id} className="p-4 border border-border/50 rounded-lg bg-secondary/20">
                          <div className="flex gap-2 items-center mb-4">
                            <div className="flex flex-col gap-1">
                              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled={sIdx === 0} onClick={() => moveSection(sIdx, -1)}><ArrowUp className="w-3 h-3" /></Button>
                              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled={sIdx === sections.length - 1} onClick={() => moveSection(sIdx, 1)}><ArrowDown className="w-3 h-3" /></Button>
                            </div>
                            <Input value={sec.title} onChange={e => updateSectionTitle(sec.id, e.target.value)} placeholder={`Section ${sIdx + 1} title`} className="flex-1 font-semibold" />
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeSection(sec.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>

                          <div className="pl-8 space-y-3">
                            {sec.videos.map((vid, vIdx) => (
                              <div key={vid.id} className="flex gap-2 items-center border border-border/30 rounded p-2 bg-background/50">
                                <div className="flex flex-col">
                                  <Button type="button" variant="ghost" size="icon" className="h-5 w-5" disabled={vIdx === 0} onClick={() => moveVideo(sec.id, vIdx, -1)}><ArrowUp className="w-3 h-3" /></Button>
                                  <Button type="button" variant="ghost" size="icon" className="h-5 w-5" disabled={vIdx === sec.videos.length - 1} onClick={() => moveVideo(sec.id, vIdx, 1)}><ArrowDown className="w-3 h-3" /></Button>
                                </div>
                                {vid.file ? (
                                  <Video className="w-4 h-4 text-primary shrink-0" />
                                ) : (
                                  <LinkIcon className="w-4 h-4 text-emerald-500 shrink-0" title="Existing video" />
                                )}
                                <Input value={vid.title} onChange={e => updateVideoTitle(sec.id, vid.id, e.target.value)} className="flex-1 h-8 text-sm" />
                                {!vid.file && <span className="text-[10px] text-muted-foreground px-1 shrink-0">saved</span>}
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeVideo(sec.id, vid.id)} className="h-8 w-8 text-destructive"><Trash2 className="w-3 h-3" /></Button>
                              </div>
                            ))}
                            <div className="pt-2">
                              <Label className="cursor-pointer">
                                <div className="flex items-center gap-2 text-sm text-primary border border-primary/20 hover:bg-primary/10 border-dashed rounded py-2 px-4 w-max transition-colors">
                                  <Plus className="w-4 h-4" /> Add New Video
                                </div>
                                <input type="file" accept="video/*" className="hidden" onChange={e => addVideo(sec.id, e.target.files[0])} />
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button onClick={addSection} variant="outline" className="w-full border-dashed gap-2"><Plus className="w-4 h-4" /> Add Section</Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-full max-w-md border-2 border-dashed border-border/50 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-card/30">
                    {coverMedia ? (
                      <>
                        <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
                        <p className="font-medium mb-1">{coverMedia.name}</p>
                        <p className="text-sm text-muted-foreground mb-4">{(coverMedia.size / (1024 * 1024)).toFixed(2)} MB</p>
                        <Button variant="outline" onClick={() => setCoverMedia(null)}>Remove New Cover</Button>
                      </>
                    ) : existingCoverUrl ? (
                      <>
                        <img src={existingCoverUrl.startsWith('/uploads') ? `http://localhost:5000${existingCoverUrl}` : existingCoverUrl} alt="Current cover" className="w-full max-h-48 object-cover rounded-lg mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">Current cover image</p>
                        <Label className="cursor-pointer">
                          <div className="flex items-center gap-2 text-sm text-primary border border-primary/20 hover:bg-primary/10 border-dashed rounded py-2 px-4 transition-colors">
                            <Upload className="w-4 h-4" /> Replace Cover
                          </div>
                          <input type="file" accept="image/*,video/*" className="hidden" onChange={e => setCoverMedia(e.target.files[0])} />
                        </Label>
                      </>
                    ) : (
                      <Label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                        <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                        <h4 className="text-lg font-medium mb-1">Upload Cover Media</h4>
                        <p className="text-sm text-muted-foreground mb-6">Click to attach image or video.</p>
                        <input type="file" accept="image/*,video/*" className="hidden" onChange={e => setCoverMedia(e.target.files[0])} />
                      </Label>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-xl font-medium mb-4">Review Changes</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-secondary/20 p-4 rounded-lg">
                    <div><span className="text-muted-foreground">Title:</span> {title || 'Untitled'}</div>
                    <div><span className="text-muted-foreground">Level:</span> {level}</div>
                    <div><span className="text-muted-foreground">Sections:</span> {sections.length}</div>
                    <div><span className="text-muted-foreground">New videos:</span> {sections.reduce((a, s) => a + s.videos.filter(v => v.file).length, 0)}</div>
                    <div><span className="text-muted-foreground">New cover:</span> {coverMedia ? coverMedia.name : existingCoverUrl ? 'Keeping existing' : 'None'}</div>
                    <div className="col-span-2"><span className="text-muted-foreground">Tags: </span>{selectedHashtags.length > 0 ? selectedHashtags.join(', ') : 'None'}</div>
                  </div>

                  {isUploading && (
                    <div className="mt-8 space-y-2 p-6 border border-border/50 bg-card rounded-lg">
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
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1 || isUploading}>Back</Button>
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} disabled={(step === 1 && (!title || !description))} className="bg-gradient-to-r from-primary to-accent">Continue</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isUploading} className="bg-gradient-to-r from-primary to-accent gap-2">
                {isUploading ? 'Saving...' : <><Rocket className="w-4 h-4" /> Save All Changes</>}
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default EditCourse
