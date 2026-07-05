import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@/hooks/useKV'

export interface Photo {
  id: string
  url: string
  title: string
  category: 'swimming' | 'anime'
  description?: string
}

export function PhotoGallery() {
  const [photos] = useKV<Photo[]>('gallery-photos', [])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [filter, setFilter] = useState<'all' | 'swimming' | 'anime'>('all')

  const filteredPhotos =
    filter === 'all' ? photos || [] : (photos || []).filter((photo) => photo.category === filter)

  const currentIndex = selectedPhoto
    ? filteredPhotos.findIndex((p) => p.id === selectedPhoto.id)
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
      <div className="mb-6 flex flex-wrap justify-center gap-2 sm:mb-8 sm:gap-3">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={`px-3 text-sm sm:px-4 sm:text-base ${filter === 'all' ? 'bg-accent hover:bg-accent/90' : ''}`}
        >
          All
        </Button>
        <Button
          variant={filter === 'swimming' ? 'default' : 'outline'}
          onClick={() => setFilter('swimming')}
          className={`px-3 text-sm sm:px-4 sm:text-base ${filter === 'swimming' ? 'bg-primary hover:bg-primary/90' : ''}`}
        >
          Swimming
        </Button>
        <Button
          variant={filter === 'anime' ? 'default' : 'outline'}
          onClick={() => setFilter('anime')}
          className={`px-3 text-sm sm:px-4 sm:text-base ${filter === 'anime' ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground' : ''}`}
        >
          Anime
        </Button>
      </div>

      {filteredPhotos.length === 0 && (
        <Card className="border-2 border-dashed p-12 text-center">
          <div className="mb-4 text-6xl">📸</div>
          <p className="text-muted-foreground mb-2 text-lg">No photos yet</p>
          <p className="text-muted-foreground text-sm">Check back soon for photos!</p>
        </Card>
      )}

      <motion.div layout className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                className="group hover:shadow-accent/20 hover:border-accent/50 relative aspect-square cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:shadow-xl"
                onClick={() => setSelectedPhoto(photo)}
              >
                {photo.url.startsWith('data:') ? (
                  <img src={photo.url} alt={photo.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="from-primary/10 to-secondary/10 relative flex h-full w-full items-center justify-center bg-linear-to-br">
                    <div className="text-6xl transition-transform duration-300 group-hover:scale-110">
                      {photo.category === 'swimming' ? '🏊' : '📺'}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute right-0 bottom-0 left-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                  <p className="line-clamp-2 text-sm font-semibold text-white">{photo.title}</p>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedPhoto(null)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full text-white hover:bg-white/20"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={24} />
            </Button>

            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-4 hidden -translate-y-1/2 rounded-full text-white hover:bg-white/20 md:flex"
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
                className="absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-full text-white hover:bg-white/20 md:flex"
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
              transition={{ type: 'spring', damping: 20 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-accent/50 overflow-hidden border-2">
                {selectedPhoto.url.startsWith('data:') ? (
                  <div className="flex aspect-video items-center justify-center bg-black">
                    <img
                      src={selectedPhoto.url}
                      alt={selectedPhoto.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="from-primary/20 to-secondary/20 flex aspect-video items-center justify-center bg-linear-to-br">
                    <div className="text-9xl">
                      {selectedPhoto.category === 'swimming' ? '🏊' : '📺'}
                    </div>
                  </div>
                )}
                <div className="bg-card p-6">
                  <div className="mb-3 flex items-start justify-between gap-4">
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
                  <div className="flex gap-2 md:hidden">
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
