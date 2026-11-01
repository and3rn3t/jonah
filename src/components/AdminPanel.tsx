import { useState } from 'react'
import { FloppyDisk, Gear, LockKey, Eye, EyeSlash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useKV } from '@/hooks/useKV'
import { clearAdminToken, getAdminToken, setAdminToken, verifyAdminToken } from '@/lib/adminToken'
import type { SiteContent, ContactMessage } from '@/lib/types'
import { AboutTab } from '@/components/admin/AboutTab'
import { AnimeTab } from '@/components/admin/AnimeTab'
import { GoalsTab } from '@/components/admin/GoalsTab'
import { MessagesTab } from '@/components/admin/MessagesTab'
import { PhotosTab } from '@/components/admin/PhotosTab'
import { ProfileTab } from '@/components/admin/ProfileTab'
import { SettingsTab } from '@/components/admin/SettingsTab'
import { SocialTab } from '@/components/admin/SocialTab'
import { SwimmingTab } from '@/components/admin/SwimmingTab'
import { TimelineTab } from '@/components/admin/TimelineTab'

interface AdminPanelProps {
  content: SiteContent
  onContentUpdate: (content: SiteContent) => void
}

export function AdminPanel({ content, onContentUpdate }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(() => getAdminToken() !== null)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [localContent, setLocalContent] = useState<SiteContent>(content)
  const [messages, setMessages] = useKV<ContactMessage[]>('contact-messages', [], {
    requiresAuth: true,
    enabled: isUnlocked,
  })

  const unreadCount = (messages || []).filter((msg) => !msg.read).length

  const handlePasswordSubmit = async () => {
    const token = passwordInput.trim()
    if (!token || isVerifying) return

    setIsVerifying(true)
    const isValid = await verifyAdminToken(token)
    setIsVerifying(false)
    setPasswordInput('')

    if (!isValid) {
      toast.error('Wrong password! Try again 🔒')
      return
    }

    setAdminToken(token)
    setIsUnlocked(true)
    setShowPasswordDialog(false)
    openPanel()
    toast.success('Welcome! Admin panel unlocked! 🔓')
  }

  const handleLock = () => {
    clearAdminToken()
    setIsUnlocked(false)
    setIsOpen(false)
    toast.success('Admin panel locked 🔒')
  }

  // Start each session from the latest saved content so a stale draft can't overwrite it
  const openPanel = () => {
    setLocalContent(content)
    setIsOpen(true)
  }

  const handleGearClick = () => {
    if (!isUnlocked) {
      setShowPasswordDialog(true)
    } else {
      openPanel()
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
                  className="focus:border-accent border-2 pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
              disabled={isVerifying}
              className="bg-accent hover:bg-accent/90 gap-2"
            >
              <LockKey size={18} weight="bold" />
              {isVerifying ? 'Checking…' : 'Unlock'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <Button
          className="bg-accent hover:bg-accent/90 fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full shadow-2xl"
          size="icon"
          onClick={handleGearClick}
        >
          <span className="relative">
            <Gear size={24} weight="bold" />
            {unreadCount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground border-background absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full border-2 p-0">
                {unreadCount}
              </Badge>
            )}
          </span>
        </Button>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Gear size={28} weight="duotone" className="text-accent" />
              Manage Site Content
            </DialogTitle>
            <DialogDescription>
              Update your personal information, anime favorites, swimming achievements, and more
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4 grid h-auto w-full grid-cols-5 gap-1 p-1">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="anime">Anime</TabsTrigger>
              <TabsTrigger value="swimming">Swimming</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="messages" className="relative">
                Messages
                {unreadCount > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <ProfileTab content={localContent} setContent={setLocalContent} />
            <AnimeTab content={localContent} setContent={setLocalContent} />
            <SwimmingTab content={localContent} setContent={setLocalContent} />
            <GoalsTab />
            <TimelineTab content={localContent} setContent={setLocalContent} />
            <PhotosTab />
            <AboutTab content={localContent} setContent={setLocalContent} />
            <SocialTab content={localContent} setContent={setLocalContent} />
            <MessagesTab
              messages={messages || []}
              setMessages={setMessages}
              unreadCount={unreadCount}
            />
            <SettingsTab onLock={handleLock} />
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
