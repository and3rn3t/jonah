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
import { Plus, Trash, PencilSimple, FloppyDisk, Gear, X, Star, Clock, LockKey, Eye, EyeSlash } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { SiteContent } from '@/lib/types'

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

  const handleOpenChange = (open: boolean) => {
    if (open && !isUnlocked) {
      setShowPasswordDialog(true)
    } else if (!open) {
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-accent hover:bg-accent/90 z-40"
            size="icon"
            onClick={() => handleOpenChange(true)}
          >
            <Gear size={24} weight="bold" />
          </Button>
        </DialogTrigger>
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
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="anime">Anime</TabsTrigger>
              <TabsTrigger value="swimming">Swimming</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
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
