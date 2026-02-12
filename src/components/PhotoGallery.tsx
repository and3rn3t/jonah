import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CaretLeft, CaretRight, Plus, Trash, PencilSimple, Upload } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

export interface Photo {
  id: string
  url: string
  title: string
  category: 'swimming' | 'anime'
  description?: string
}

interface PhotoGalleryProps {
  isOwner?: boolean
}

export function PhotoGallery({ isOwner = false }: PhotoGalleryProps) {
  const [photos, setPhotos] = useKV<Photo[]>('gallery-photos', [])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [filter, setFilter] = useState<'all' | 'swimming' | 'anime'>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'swimming' as 'swimming' | 'anime',
    description: '',
    url: ''
  })

  const filteredPhotos = filter === 'all' 
    ? photos || []
    : (photos || []).filter(photo => photo.category === filter)

  const currentIndex = selectedPhoto 
    ? filteredPhotos.findIndex(p => p.id === selectedPhoto.id)
    : -1

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1])
    }
  }

  const handleNext = () => {
    if (currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious()
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'Escape') setSelectedPhoto(null)
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
    setIsAddDialogOpen(false)
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
    setIsEditDialogOpen(false)
  }

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(currentPhotos => 
      (currentPhotos || []).filter(p => p.id !== photoId)
    )
    toast.success('Photo deleted')
    setSelectedPhoto(null)
  }

  const openEditDialog = (photo: Photo) => {
    setEditingPhoto({ ...photo })
    setIsEditDialogOpen(true)
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-8 justify-center items-center">
        <div className="flex gap-3">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-accent hover:bg-accent/90' : ''}
          >
            All Photos
          </Button>
          <Button
            variant={filter === 'swimming' ? 'default' : 'outline'}
            onClick={() => setFilter('swimming')}
            className={filter === 'swimming' ? 'bg-primary hover:bg-primary/90' : ''}
          >
            Swimming
          </Button>
          <Button
            variant={filter === 'anime' ? 'default' : 'outline'}
            onClick={() => setFilter('anime')}
            className={filter === 'anime' ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground' : ''}
          >
            Anime
          </Button>
        </div>

        {isOwner && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 gap-2">
                <Plus size={20} weight="bold" />
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
                  <div className="flex gap-2">
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                  </div>
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
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPhoto} className="bg-accent hover:bg-accent/90">
                  <Upload size={18} className="mr-2" />
                  Add Photo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {filteredPhotos.length === 0 && (
        <Card className="p-12 text-center border-2 border-dashed">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-muted-foreground text-lg mb-2">No photos yet</p>
          {isOwner && (
            <p className="text-sm text-muted-foreground">Click "Add Photo" to upload your first photo!</p>
          )}
        </Card>
      )}

      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="overflow-hidden cursor-pointer group hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 border-2 hover:border-accent/50 aspect-square relative"
                onClick={() => setSelectedPhoto(photo)}
              >
                {photo.url.startsWith('data:') ? (
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {photo.category === 'swimming' ? '🏊' : '📺'}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-semibold line-clamp-2">{photo.title}</p>
                </div>
                <Badge 
                  className={`absolute top-2 right-2 ${
                    photo.category === 'swimming' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {photo.category}
                </Badge>
                {isOwner && (
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditDialog(photo)
                      }}
                    >
                      <PencilSimple size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePhoto(photo.id)
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={24} />
            </Button>

            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full hidden md:flex"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
              >
                <CaretLeft size={32} weight="bold" />
              </Button>
            )}

            {currentIndex < filteredPhotos.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full hidden md:flex"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
              >
                <CaretRight size={32} weight="bold" />
              </Button>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="overflow-hidden border-2 border-accent/50">
                {selectedPhoto.url.startsWith('data:') ? (
                  <div className="aspect-video bg-black flex items-center justify-center">
                    <img 
                      src={selectedPhoto.url} 
                      alt={selectedPhoto.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 aspect-video flex items-center justify-center">
                    <div className="text-9xl">
                      {selectedPhoto.category === 'swimming' ? '🏊' : '📺'}
                    </div>
                  </div>
                )}
                <div className="p-6 bg-card">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-2xl font-bold">{selectedPhoto.title}</h3>
                    <Badge 
                      className={
                        selectedPhoto.category === 'swimming' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                      }
                    >
                      {selectedPhoto.category}
                    </Badge>
                  </div>
                  {selectedPhoto.description && (
                    <p className="text-muted-foreground mb-4">{selectedPhoto.description}</p>
                  )}
                  {isOwner && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          openEditDialog(selectedPhoto)
                          setSelectedPhoto(null)
                        }}
                        className="gap-2"
                      >
                        <PencilSimple size={18} />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeletePhoto(selectedPhoto.id)}
                        className="gap-2"
                      >
                        <Trash size={18} />
                        Delete
                      </Button>
                    </div>
                  )}
                  <div className="mt-4 flex gap-2 md:hidden">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className="flex-1"
                    >
                      <CaretLeft size={20} weight="bold" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleNext}
                      disabled={currentIndex === filteredPhotos.length - 1}
                      className="flex-1"
                    >
                      Next
                      <CaretRight size={20} weight="bold" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOwner && editingPhoto && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Photo</DialogTitle>
              <DialogDescription>Update your photo details</DialogDescription>
            </DialogHeader>
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditPhoto} className="bg-accent hover:bg-accent/90">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
