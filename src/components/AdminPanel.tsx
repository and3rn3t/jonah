import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash, PencilSimple, FloppyDisk, Gear, X, Star, Clock, LockKey, Eye, EyeSlash, Envelope, Upload, Images } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { SiteContent, ContactMessage } from '@/lib/types'
import type { Photo } from '@/components/PhotoGallery'

interface AdminPanelProps {
  content: SiteContent
  onContentUpdate: (content: SiteContent) => void
}

export function AdminPanel({ content, onContentUpdate }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [adminPassword, setAdminPassword] = useKV<string>('admin-password', 'admin123')
  const [localContent, setLocalContent] = useState<SiteContent>(content)
  const [messages, setMessages] = useKV<ContactMessage[]>('contact-messages', [])
  const [photos, setPhotos] = useKV<Photo[]>('gallery-photos', [])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isAddPhotoDialogOpen, setIsAddPhotoDialogOpen] = useState(false)
  const [isEditPhotoDialogOpen, setIsEditPhotoDialogOpen] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'swimming' as 'swimming' | 'anime',
    description: '',
    url: ''
  })

  const unreadMessages = (messages || []).filter(msg => !msg.read)
  
  if (unreadMessages.length !== unreadCount) {
    setUnreadCount(unreadMessages.length)
  }

  const handlePasswordSubmit = () => {
    if (passwordInput === adminPassword) {
      setIsUnlocked(true)
      setShowPasswordDialog(false)
      setIsOpen(true)
      setPasswordInput('')
      toast.success('Welcome! Admin panel unlocked! 🔓')
    } else {
      toast.error('Wrong password! Try again 🔒')
      setPasswordInput('')
    }
  }

  const handleGearClick = () => {
    if (!isUnlocked) {
      setShowPasswordDialog(true)
    } else {
      setIsOpen(true)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false)
    }
  }

  const handleSave = () => {
    onContentUpdate(localContent)
    toast.success('All changes saved! ✨')
    setIsOpen(false)
  }

  const addAnime = () => {
    setLocalContent(prev => ({
      ...prev,
      animeList: [
        ...(prev.animeList || []),
        { title: '', genre: '', rating: 5, description: '' }
      ]
    }))
  }

  const updateAnime = (index: number, field: string, value: string | number) => {
    setLocalContent(prev => ({
      ...prev,
      animeList: prev.animeList?.map((anime, i) => 
        i === index ? { ...anime, [field]: value } : anime
      ) || []
    }))
  }

  const deleteAnime = (index: number) => {
    setLocalContent(prev => ({
      ...prev,
      animeList: prev.animeList?.filter((_, i) => i !== index) || []
    }))
  }

  const addAchievement = () => {
    setLocalContent(prev => ({
      ...prev,
      swimmingAchievements: [
        ...(prev.swimmingAchievements || []),
        { title: '', time: '', achievement: '' }
      ]
    }))
  }

  const updateAchievement = (index: number, field: string, value: string) => {
    setLocalContent(prev => ({
      ...prev,
      swimmingAchievements: prev.swimmingAchievements?.map((ach, i) => 
        i === index ? { ...ach, [field]: value } : ach
      ) || []
    }))
  }

  const deleteAchievement = (index: number) => {
    setLocalContent(prev => ({
      ...prev,
      swimmingAchievements: prev.swimmingAchievements?.filter((_, i) => i !== index) || []
    }))
  }

  const addSocialLink = () => {
    setLocalContent(prev => ({
      ...prev,
      socialLinks: [
        ...(prev.socialLinks || []),
        { name: '', platform: 'Discord', username: '' }
      ]
    }))
  }

  const updateSocialLink = (index: number, field: string, value: string) => {
    setLocalContent(prev => ({
      ...prev,
      socialLinks: prev.socialLinks?.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      ) || []
    }))
  }

  const deleteSocialLink = (index: number) => {
    setLocalContent(prev => ({
      ...prev,
      socialLinks: prev.socialLinks?.filter((_, i) => i !== index) || []
    }))
  }

  const addFavoriteStroke = () => {
    const newStroke = prompt('Enter stroke name:')
    if (newStroke?.trim()) {
      setLocalContent(prev => ({
        ...prev,
        favoriteStrokes: [...(prev.favoriteStrokes || []), newStroke.trim()]
      }))
    }
  }

  const deleteFavoriteStroke = (index: number) => {
    setLocalContent(prev => ({
      ...prev,
      favoriteStrokes: prev.favoriteStrokes?.filter((_, i) => i !== index) || []
    }))
  }

  const addHobby = () => {
    const newHobby = prompt('Enter hobby:')
    if (newHobby?.trim()) {
      setLocalContent(prev => ({
        ...prev,
        hobbies: [...(prev.hobbies || []), newHobby.trim()]
      }))
    }
  }

  const deleteHobby = (index: number) => {
    setLocalContent(prev => ({
      ...prev,
      hobbies: prev.hobbies?.filter((_, i) => i !== index) || []
    }))
  }

  const addFunFact = () => {
    const newFact = prompt('Enter fun fact:')
    if (newFact?.trim()) {
      setLocalContent(prev => ({
        ...prev,
        funFacts: [...(prev.funFacts || []), newFact.trim()]
      }))
    }
  }

  const deleteFunFact = (index: number) => {
    setLocalContent(prev => ({
      ...prev,
      funFacts: prev.funFacts?.filter((_, i) => i !== index) || []
    }))
  }

  const markMessageAsRead = (messageId: string) => {
    setMessages((currentMessages) =>
      (currentMessages || []).map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    )
  }

  const deleteMessage = (messageId: string) => {
    setMessages((currentMessages) =>
      (currentMessages || []).filter(msg => msg.id !== messageId)
    )
    toast.success('Message deleted')
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setNewPhoto(prev => ({ ...prev, url: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleAddPhoto = () => {
    if (!newPhoto.title || !newPhoto.url) {
      toast.error('Please provide a title and upload an image')
      return
    }

    const photo: Photo = {
      id: Date.now().toString(),
      title: newPhoto.title,
      category: newPhoto.category,
      description: newPhoto.description || undefined,
      url: newPhoto.url
    }

    setPhotos(currentPhotos => [...(currentPhotos || []), photo])
    toast.success('Photo added successfully! 📸')
    
    setNewPhoto({ title: '', category: 'swimming', description: '', url: '' })
    setIsAddPhotoDialogOpen(false)
  }

  const handleEditPhoto = () => {
    if (!editingPhoto) return

    setPhotos(currentPhotos => 
      (currentPhotos || []).map(p => 
        p.id === editingPhoto.id ? editingPhoto : p
      )
    )
    
    toast.success('Photo updated successfully! ✨')
    setEditingPhoto(null)
    setIsEditPhotoDialogOpen(false)
  }

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(currentPhotos => 
      (currentPhotos || []).filter(p => p.id !== photoId)
    )
    toast.success('Photo deleted')
  }

  const openEditPhotoDialog = (photo: Photo) => {
    setEditingPhoto({ ...photo })
    setIsEditPhotoDialogOpen(true)
  }

  return (
    <>
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <LockKey size={28} weight="duotone" className="text-accent" />
              Admin Password Required
            </DialogTitle>
            <DialogDescription>
              Enter the secret password to access the admin panel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handlePasswordSubmit()
                    }
                  }}
                  placeholder="Enter admin password"
                  className="pr-10 border-2 focus:border-accent"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Default password: <code className="bg-muted px-1.5 py-0.5 rounded">admin123</code>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false)
                setPasswordInput('')
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordSubmit}
              className="bg-accent hover:bg-accent/90 gap-2"
            >
              <LockKey size={18} weight="bold" />
              Unlock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <Button 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-accent hover:bg-accent/90 z-40 relative"
          size="icon"
          onClick={handleGearClick}
        >
          <Gear size={24} weight="bold" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 bg-destructive text-destructive-foreground rounded-full border-2 border-background">
              {unreadCount}
            </Badge>
          )}
        </Button>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Gear size={28} weight="duotone" className="text-accent" />
              Manage Site Content
            </DialogTitle>
            <DialogDescription>
              Update your personal information, anime favorites, swimming achievements, and more
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="anime">Anime</TabsTrigger>
              <TabsTrigger value="swimming">Swimming</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="messages" className="relative">
                Messages
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your basic info displayed in the hero section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={localContent.profile?.name || ''}
                      onChange={(e) => setLocalContent(prev => ({
                        ...prev,
                        profile: { ...prev.profile, name: e.target.value }
                      }))}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={localContent.profile?.age || ''}
                      onChange={(e) => setLocalContent(prev => ({
                        ...prev,
                        profile: { ...prev.profile, age: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="14"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={localContent.profile?.tagline || ''}
                    onChange={(e) => setLocalContent(prev => ({
                      ...prev,
                      profile: { ...prev.profile, tagline: e.target.value }
                    }))}
                    placeholder="Anime enthusiast • Competitive swimmer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={localContent.profile?.bio || ''}
                    onChange={(e) => setLocalContent(prev => ({
                      ...prev,
                      profile: { ...prev.profile, bio: e.target.value }
                    }))}
                    placeholder="Welcome to my corner of the internet!"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initials">Avatar Initials</Label>
                  <Input
                    id="initials"
                    value={localContent.profile?.initials || ''}
                    onChange={(e) => setLocalContent(prev => ({
                      ...prev,
                      profile: { ...prev.profile, initials: e.target.value.slice(0, 2).toUpperCase() }
                    }))}
                    placeholder="AK"
                    maxLength={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anime" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Favorite Anime</h3>
                <p className="text-sm text-muted-foreground">Manage your anime list</p>
              </div>
              <Button onClick={addAnime} className="gap-2">
                <Plus size={18} weight="bold" />
                Add Anime
              </Button>
            </div>

            <div className="space-y-4">
              {localContent.animeList?.map((anime, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">Anime #{index + 1}</h4>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => deleteAnime(index)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={anime.title}
                          onChange={(e) => updateAnime(index, 'title', e.target.value)}
                          placeholder="Demon Slayer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Genre</Label>
                        <Input
                          value={anime.genre}
                          onChange={(e) => updateAnime(index, 'genre', e.target.value)}
                          placeholder="Action"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Rating (1-5 stars)</Label>
                      <div className="flex gap-2 items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateAnime(index, 'rating', star)}
                            className="focus:outline-none"
                          >
                            <Star
                              size={24}
                              weight={star <= anime.rating ? 'fill' : 'regular'}
                              className={star <= anime.rating ? 'text-accent' : 'text-muted-foreground'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={anime.description}
                        onChange={(e) => updateAnime(index, 'description', e.target.value)}
                        placeholder="What do you love about this anime?"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="swimming" className="space-y-4 mt-4">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Swimming Achievements</h3>
                    <p className="text-sm text-muted-foreground">Your best times and records</p>
                  </div>
                  <Button onClick={addAchievement} className="gap-2">
                    <Plus size={18} weight="bold" />
                    Add Achievement
                  </Button>
                </div>

                <div className="space-y-4">
                  {localContent.swimmingAchievements?.map((ach, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">Achievement #{index + 1}</h4>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => deleteAchievement(index)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Event</Label>
                            <Input
                              value={ach.title}
                              onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                              placeholder="100m Freestyle"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Time</Label>
                            <Input
                              value={ach.time}
                              onChange={(e) => updateAchievement(index, 'time', e.target.value)}
                              placeholder="58.4s"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Achievement</Label>
                            <Input
                              value={ach.achievement}
                              onChange={(e) => updateAchievement(index, 'achievement', e.target.value)}
                              placeholder="Personal Best"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Favorite Strokes</h3>
                    <p className="text-sm text-muted-foreground">Your preferred swimming styles</p>
                  </div>
                  <Button onClick={addFavoriteStroke} variant="outline" size="sm" className="gap-2">
                    <Plus size={16} weight="bold" />
                    Add Stroke
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {localContent.favoriteStrokes?.map((stroke, index) => (
                    <Badge key={index} className="gap-2 pr-1 bg-primary hover:bg-primary/90">
                      {stroke}
                      <button
                        onClick={() => deleteFavoriteStroke(index)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Images size={24} weight="duotone" className="text-accent" />
                  Photo Gallery
                </h3>
                <p className="text-sm text-muted-foreground">Manage your swimming and anime photos</p>
              </div>
              <Dialog open={isAddPhotoDialogOpen} onOpenChange={setIsAddPhotoDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent hover:bg-accent/90 gap-2">
                    <Plus size={18} weight="bold" />
                    Add Photo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Photo</DialogTitle>
                    <DialogDescription>Upload a photo from your swimming meets or favorite anime moments</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="photo-title">Title</Label>
                      <Input
                        id="photo-title"
                        placeholder="My awesome photo..."
                        value={newPhoto.title}
                        onChange={(e) => setNewPhoto(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photo-category">Category</Label>
                      <Select
                        value={newPhoto.category}
                        onValueChange={(value: 'swimming' | 'anime') => 
                          setNewPhoto(prev => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger id="photo-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="swimming">Swimming</SelectItem>
                          <SelectItem value="anime">Anime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photo-description">Description (optional)</Label>
                      <Textarea
                        id="photo-description"
                        placeholder="Tell the story behind this photo..."
                        value={newPhoto.description}
                        onChange={(e) => setNewPhoto(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photo-upload">Upload Image</Label>
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      {newPhoto.url && (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-accent/50">
                          <img 
                            src={newPhoto.url} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddPhotoDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPhoto} className="bg-accent hover:bg-accent/90">
                      <Upload size={18} className="mr-2" />
                      Add Photo
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {photos && photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <div className="relative aspect-square">
                      {photo.url.startsWith('data:') ? (
                        <img 
                          src={photo.url} 
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <div className="text-6xl">
                            {photo.category === 'swimming' ? '🏊' : '📺'}
                          </div>
                        </div>
                      )}
                      <Badge 
                        className={`absolute top-2 right-2 ${
                          photo.category === 'swimming' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {photo.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-semibold line-clamp-1">{photo.title}</h4>
                      {photo.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{photo.description}</p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => openEditPhotoDialog(photo)}
                        >
                          <PencilSimple size={16} />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          <Trash size={16} />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-2 border-dashed">
                <div className="text-6xl mb-4">📸</div>
                <p className="text-muted-foreground text-lg mb-2">No photos yet</p>
                <p className="text-sm text-muted-foreground">Click "Add Photo" to upload your first photo!</p>
              </Card>
            )}

            <Dialog open={isEditPhotoDialogOpen} onOpenChange={setIsEditPhotoDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Photo</DialogTitle>
                  <DialogDescription>Update your photo details</DialogDescription>
                </DialogHeader>
                {editingPhoto && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        value={editingPhoto.title}
                        onChange={(e) => setEditingPhoto(prev => prev ? { ...prev, title: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <Select
                        value={editingPhoto.category}
                        onValueChange={(value: 'swimming' | 'anime') => 
                          setEditingPhoto(prev => prev ? { ...prev, category: value } : null)
                        }
                      >
                        <SelectTrigger id="edit-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="swimming">Swimming</SelectItem>
                          <SelectItem value="anime">Anime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={editingPhoto.description || ''}
                        onChange={(e) => setEditingPhoto(prev => prev ? { ...prev, description: e.target.value } : null)}
                        rows={3}
                      />
                    </div>
                    {editingPhoto.url.startsWith('data:') && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border-2">
                        <img 
                          src={editingPhoto.url} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditPhotoDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditPhoto} className="bg-accent hover:bg-accent/90">
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="about" className="space-y-6 mt-4">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Hobbies</h3>
                  <p className="text-sm text-muted-foreground">Your other interests</p>
                </div>
                <Button onClick={addHobby} variant="outline" size="sm" className="gap-2">
                  <Plus size={16} weight="bold" />
                  Add Hobby
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {localContent.hobbies?.map((hobby, index) => (
                  <Badge key={index} variant="secondary" className="gap-2 pr-1">
                    {hobby}
                    <button
                      onClick={() => deleteHobby(index)}
                      className="hover:bg-black/10 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Fun Facts</h3>
                  <p className="text-sm text-muted-foreground">Interesting things about you</p>
                </div>
                <Button onClick={addFunFact} variant="outline" size="sm" className="gap-2">
                  <Plus size={16} weight="bold" />
                  Add Fact
                </Button>
              </div>
              <div className="space-y-2">
                {localContent.funFacts?.map((fact, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                    <span className="text-accent mt-1">•</span>
                    <span className="flex-1">{fact}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => deleteFunFact(index)}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Social Media Links</h3>
                <p className="text-sm text-muted-foreground">Your social profiles</p>
              </div>
              <Button onClick={addSocialLink} className="gap-2">
                <Plus size={18} weight="bold" />
                Add Link
              </Button>
            </div>

            <div className="space-y-4">
              {localContent.socialLinks?.map((link, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">Social Link #{index + 1}</h4>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => deleteSocialLink(index)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Platform</Label>
                        <Select
                          value={link.platform}
                          onValueChange={(value) => updateSocialLink(index, 'platform', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Discord">Discord</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="Twitch">Twitch</SelectItem>
                            <SelectItem value="YouTube">YouTube</SelectItem>
                            <SelectItem value="Twitter">Twitter</SelectItem>
                            <SelectItem value="TikTok">TikTok</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Display Name</Label>
                        <Input
                          value={link.name}
                          onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                          placeholder="Discord"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Username</Label>
                        <Input
                          value={link.username}
                          onChange={(e) => updateSocialLink(index, 'username', e.target.value)}
                          placeholder="@username"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Envelope size={24} weight="duotone" className="text-accent" />
                  Contact Messages
                </h3>
                <p className="text-sm text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread message${unreadCount === 1 ? '' : 's'}` : 'All caught up!'}
                </p>
              </div>
            </div>

            {messages && messages.length > 0 ? (
              <div className="space-y-4">
                {[...messages].reverse().map((msg) => (
                  <Card key={msg.id} className={`${!msg.read ? 'border-2 border-accent/50 bg-accent/5' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {msg.name}
                            {!msg.read && (
                              <Badge className="bg-accent text-accent-foreground">New</Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            <a href={`mailto:${msg.email}`} className="hover:underline text-primary">
                              {msg.email}
                            </a>
                          </CardDescription>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimestamp(msg.timestamp)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteMessage(msg.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      {!msg.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => markMessageAsRead(msg.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-2 border-dashed">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-muted-foreground text-lg mb-2">No messages yet</p>
                <p className="text-sm text-muted-foreground">Messages from your contact form will appear here</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LockKey size={24} weight="duotone" className="text-accent" />
                  Admin Password
                </CardTitle>
                <CardDescription>Change the password required to access this admin panel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="pr-10"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget
                          if (input.value.trim()) {
                            setAdminPassword(input.value)
                            toast.success('Password updated successfully! 🔐')
                            input.value = ''
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Press Enter to save the new password
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <p className="text-sm font-semibold">Current Password:</p>
                  <code className="text-sm bg-background px-2 py-1 rounded border">
                    {showPassword ? adminPassword : '•'.repeat(adminPassword?.length || 0)}
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-accent hover:bg-accent/90 gap-2">
            <FloppyDisk size={18} weight="bold" />
            Save All Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
