import React, { useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AuthContext } from '../context/AuthContext'
import { Save, User, Loader2, Mail, BadgeCheck, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const getMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
  return url;
}

const Profile = () => {
  const { user, token, login } = useContext(AuthContext)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [profilePicUrl, setProfilePicUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '' })
      setProfilePicUrl(user.profile_picture || '')
    }
  }, [user])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      let finalPicUrl = profilePicUrl

      // 1. Upload profile picture if changed
      if (selectedFile) {
        const uploadData = new FormData()
        uploadData.append('file', selectedFile)
        
        const uploadRes = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadData
        })
        
        const uploadJson = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadJson.message || 'Image upload failed')
        finalPicUrl = uploadJson.url
      }

      // 2. Update profile details
      const payload = {
        ...formData,
        profile_picture: finalPicUrl
      }

      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Profile updated successfully!')
        setProfilePicUrl(finalPicUrl)
        setSelectedFile(null)
        // Update auth context
        login(data.user, token)
      } else {
        setError(data.message || 'Failed to update profile')
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  // Used for rendering the avatar preview
  const displayPic = previewUrl || getMediaUrl(profilePicUrl)

  return (
    <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary to-accent relative" />
          
          <CardHeader className="relative pt-0 flex flex-col items-center text-center">
            {/* Avatar uploaded / displayed here */}
            <div className="relative -mt-16 mb-4 group">
              <div className="w-32 h-32 rounded-full border-4 border-background bg-secondary flex items-center justify-center text-4xl font-bold text-foreground shadow-xl overflow-hidden relative">
                {displayPic ? (
                  <img src={displayPic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <>{user.name?.charAt(0).toUpperCase()}</>
                )}
                
                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Change</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <CardTitle className="text-2xl flex items-center gap-2 justify-center">
                {user.name} <BadgeCheck className="w-5 h-5 text-primary" />
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2 justify-center">
                <Mail className="w-4 h-4" /> {user.email}
              </CardDescription>
              <Badge variant="outline" className="capitalize bg-primary/5 text-primary border-primary/20 mt-3">
                {user.role} Account
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 mt-2">
              {message && <div className="p-3 text-sm bg-emerald-500/10 text-emerald-500 rounded-lg text-center">{message}</div>}
              {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg text-center">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-9 bg-background/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-9 bg-background/50"
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-accent gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Profile
