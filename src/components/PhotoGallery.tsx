import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Photo {
  id: number
  url: string
  title: string
  category: 'swimming' | 'anime'
  description?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [filter, setFilter] = useState<'all' | 'swimming' | 'anime'>('all')

  const filteredPhotos = filter === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === filter)

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

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
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
                className="overflow-hidden cursor-pointer group hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 border-2 hover:border-accent/50 aspect-square"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="relative w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {photo.category === 'swimming' ? '🏊' : '📺'}
                  </div>
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
                </div>
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
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 aspect-video flex items-center justify-center">
                  <div className="text-9xl">
                    {selectedPhoto.category === 'swimming' ? '🏊' : '📺'}
                  </div>
                </div>
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
                    <p className="text-muted-foreground">{selectedPhoto.description}</p>
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
    </>
  )
}
