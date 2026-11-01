import { useState } from 'react'
import { Plus, Trash, PencilSimple, Upload, Images } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useKV } from '@/hooks/useKV'
import { deleteStoredPhoto, isLegacyPhoto, newPhotoId, uploadPhoto } from '@/lib/photos'
import type { Photo } from '@/lib/types'

interface NewPhotoDraft {
  title: string
  category: 'swimming' | 'anime'
  description: string
  file: File | null
  previewUrl: string
}

const emptyNewPhoto: NewPhotoDraft = {
  title: '',
  category: 'swimming',
  description: '',
  file: null,
  previewUrl: '',
}

export function PhotosTab() {
  const [photos, setPhotos] = useKV<Photo[]>('gallery-photos', [])
  const [isAddPhotoDialogOpen, setIsAddPhotoDialogOpen] = useState(false)
  const [isEditPhotoDialogOpen, setIsEditPhotoDialogOpen] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [newPhoto, setNewPhoto] = useState(emptyNewPhoto)
  const [isUploading, setIsUploading] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (newPhoto.previewUrl) URL.revokeObjectURL(newPhoto.previewUrl)
    setNewPhoto((prev) => ({ ...prev, file, previewUrl: URL.createObjectURL(file) }))
  }

  const resetNewPhoto = () => {
    if (newPhoto.previewUrl) URL.revokeObjectURL(newPhoto.previewUrl)
    setNewPhoto(emptyNewPhoto)
  }

  const handleAddPhoto = async () => {
    if (!newPhoto.title || !newPhoto.file) {
      toast.error('Please provide a title and upload an image')
      return
    }

    setIsUploading(true)
    try {
      const id = newPhotoId()
      const photo: Photo = {
        id,
        title: newPhoto.title,
        category: newPhoto.category,
        description: newPhoto.description || undefined,
        url: await uploadPhoto(id, newPhoto.file),
      }

      setPhotos((currentPhotos) => [...(currentPhotos || []), photo])
      toast.success('Photo added successfully! 📸')
      resetNewPhoto()
      setIsAddPhotoDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const legacyPhotoCount = (photos || []).filter((photo) => isLegacyPhoto(photo.url)).length

  const handleMigratePhotos = async () => {
    setIsMigrating(true)
    try {
      const migrated: Photo[] = []
      for (const photo of photos || []) {
        if (!isLegacyPhoto(photo.url)) {
          migrated.push(photo)
          continue
        }
        const id = newPhotoId()
        const blob = await (await fetch(photo.url)).blob()
        migrated.push({ ...photo, id, url: await uploadPhoto(id, blob) })
      }
      setPhotos(migrated)
      toast.success('Photos moved to cloud storage! ☁️')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Migration failed')
    } finally {
      setIsMigrating(false)
    }
  }

  const handleEditPhoto = () => {
    if (!editingPhoto) return

    setPhotos((currentPhotos) =>
      (currentPhotos || []).map((p) => (p.id === editingPhoto.id ? editingPhoto : p))
    )

    toast.success('Photo updated successfully! ✨')
    setEditingPhoto(null)
    setIsEditPhotoDialogOpen(false)
  }

  const handleDeletePhoto = (photoId: string) => {
    const photo = (photos || []).find((p) => p.id === photoId)
    if (photo) {
      deleteStoredPhoto(photo.url).catch(() => console.warn(`Failed to delete image ${photoId}`))
    }
    setPhotos((currentPhotos) => (currentPhotos || []).filter((p) => p.id !== photoId))
    toast.success('Photo deleted')
  }

  const openEditPhotoDialog = (photo: Photo) => {
    setEditingPhoto({ ...photo })
    setIsEditPhotoDialogOpen(true)
  }

  return (
    <TabsContent value="photos" className="mt-4 space-y-4">
      {legacyPhotoCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Images size={24} weight="duotone" className="text-accent" />
              Move Photos to Cloud Storage
            </CardTitle>
            <CardDescription>
              {legacyPhotoCount} photo{legacyPhotoCount === 1 ? ' is' : 's are'} still saved the old
              way, which makes the site slow to load. Moving them shrinks and uploads each one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleMigratePhotos} disabled={isMigrating} className="gap-2">
              <Upload size={18} weight="bold" />
              {isMigrating ? 'Moving photos…' : 'Move photos'}
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Images size={24} weight="duotone" className="text-accent" />
            Photo Gallery
          </h3>
          <p className="text-muted-foreground text-sm">Manage your swimming and anime photos</p>
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
              <DialogDescription>
                Upload a photo from your swimming meets or favorite anime moments
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="photo-title">Title</Label>
                <Input
                  id="photo-title"
                  placeholder="My awesome photo..."
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo-category">Category</Label>
                <Select
                  value={newPhoto.category}
                  onValueChange={(value: 'swimming' | 'anime') =>
                    setNewPhoto((prev) => ({ ...prev, category: value }))
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
                  onChange={(e) =>
                    setNewPhoto((prev) => ({ ...prev, description: e.target.value }))
                  }
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
                {newPhoto.previewUrl && (
                  <div className="border-accent/50 relative h-32 w-full overflow-hidden rounded-lg border-2">
                    <img
                      src={newPhoto.previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPhotoDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddPhoto}
                disabled={isUploading}
                className="bg-accent hover:bg-accent/90"
              >
                <Upload size={18} className="mr-2" />
                {isUploading ? 'Uploading…' : 'Add Photo'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {photos && photos.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="relative aspect-square">
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="from-primary/10 to-secondary/10 flex h-full w-full items-center justify-center bg-linear-to-br">
                    <div className="text-6xl">{photo.category === 'swimming' ? '🏊' : '📺'}</div>
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
              <CardContent className="space-y-2 p-4">
                <h4 className="line-clamp-1 font-semibold">{photo.title}</h4>
                {photo.description && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">{photo.description}</p>
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
        <Card className="border-2 border-dashed p-12 text-center">
          <div className="mb-4 text-6xl">📸</div>
          <p className="text-muted-foreground mb-2 text-lg">No photos yet</p>
          <p className="text-muted-foreground text-sm">
            Click "Add Photo" to upload your first photo!
          </p>
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
                  onChange={(e) =>
                    setEditingPhoto((prev) => (prev ? { ...prev, title: e.target.value } : null))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editingPhoto.category}
                  onValueChange={(value: 'swimming' | 'anime') =>
                    setEditingPhoto((prev) => (prev ? { ...prev, category: value } : null))
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
                  onChange={(e) =>
                    setEditingPhoto((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                  rows={3}
                />
              </div>
              {editingPhoto.url.startsWith('data:') && (
                <div className="relative h-32 w-full overflow-hidden rounded-lg border-2">
                  <img
                    src={editingPhoto.url}
                    alt="Preview"
                    className="h-full w-full object-cover"
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
  )
}
