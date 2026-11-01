import { Plus, Trash, Star } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { ContentTabProps } from '@/components/admin/types'

export function AnimeTab({ content, setContent }: ContentTabProps) {
  const addAnime = () => {
    setContent((prev) => ({
      ...prev,
      animeList: [...(prev.animeList || []), { title: '', genre: '', rating: 5, description: '' }],
    }))
  }

  const updateAnime = (index: number, field: string, value: string | number) => {
    setContent((prev) => ({
      ...prev,
      animeList:
        prev.animeList?.map((anime, i) => (i === index ? { ...anime, [field]: value } : anime)) ||
        [],
    }))
  }

  const deleteAnime = (index: number) => {
    setContent((prev) => ({
      ...prev,
      animeList: prev.animeList?.filter((_, i) => i !== index) || [],
    }))
  }

  return (
    <TabsContent value="anime" className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Favorite Anime</h3>
          <p className="text-muted-foreground text-sm">Manage your anime list</p>
        </div>
        <Button onClick={addAnime} className="gap-2">
          <Plus size={18} weight="bold" />
          Add Anime
        </Button>
      </div>

      <div className="space-y-4">
        {content.animeList?.map((anime, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start justify-between">
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
                <div className="flex items-center gap-2">
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
  )
}
