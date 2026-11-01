import { Plus, Trash, X } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import type { ContentTabProps } from '@/components/admin/types'

export function SwimmingTab({ content, setContent }: ContentTabProps) {
  const addAchievement = () => {
    setContent((prev) => ({
      ...prev,
      swimmingAchievements: [
        ...(prev.swimmingAchievements || []),
        { title: '', time: '', achievement: '' },
      ],
    }))
  }

  const updateAchievement = (index: number, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      swimmingAchievements:
        prev.swimmingAchievements?.map((ach, i) =>
          i === index ? { ...ach, [field]: value } : ach
        ) || [],
    }))
  }

  const deleteAchievement = (index: number) => {
    setContent((prev) => ({
      ...prev,
      swimmingAchievements: prev.swimmingAchievements?.filter((_, i) => i !== index) || [],
    }))
  }

  const addFavoriteStroke = () => {
    const newStroke = prompt('Enter stroke name:')
    if (newStroke?.trim()) {
      setContent((prev) => ({
        ...prev,
        favoriteStrokes: [...(prev.favoriteStrokes || []), newStroke.trim()],
      }))
    }
  }

  const deleteFavoriteStroke = (index: number) => {
    setContent((prev) => ({
      ...prev,
      favoriteStrokes: prev.favoriteStrokes?.filter((_, i) => i !== index) || [],
    }))
  }

  return (
    <TabsContent value="swimming" className="mt-4 space-y-4">
      <div className="space-y-6">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Swimming Achievements</h3>
              <p className="text-muted-foreground text-sm">Your best times and records</p>
            </div>
            <Button onClick={addAchievement} className="gap-2">
              <Plus size={18} weight="bold" />
              Add Achievement
            </Button>
          </div>

          <div className="space-y-4">
            {content.swimmingAchievements?.map((ach, index) => (
              <Card key={index}>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-start justify-between">
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
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Favorite Strokes</h3>
              <p className="text-muted-foreground text-sm">Your preferred swimming styles</p>
            </div>
            <Button onClick={addFavoriteStroke} variant="outline" size="sm" className="gap-2">
              <Plus size={16} weight="bold" />
              Add Stroke
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.favoriteStrokes?.map((stroke, index) => (
              <Badge key={index} className="bg-primary hover:bg-primary/90 gap-2 pr-1">
                {stroke}
                <button
                  onClick={() => deleteFavoriteStroke(index)}
                  className="rounded-full p-0.5 hover:bg-white/20"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
