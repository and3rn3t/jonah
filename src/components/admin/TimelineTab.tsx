import { Plus, Trash, ChartLineUp, CalendarBlank } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import type { TimelineEvent } from '@/lib/types'
import type { ContentTabProps } from '@/components/admin/types'

export function TimelineTab({ content, setContent }: ContentTabProps) {
  const addTimelineEvent = () => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      date: Date.now(),
      eventType: 'personal-best',
      title: '',
      stroke: '',
      time: '',
      description: '',
    }
    setContent((prev) => ({
      ...prev,
      timeline: [...(prev.timeline || []), newEvent],
    }))
  }

  const updateTimelineEvent = (id: string, field: keyof TimelineEvent, value: string | number) => {
    setContent((prev) => ({
      ...prev,
      timeline: (prev.timeline || []).map((event) =>
        event.id === id ? { ...event, [field]: value } : event
      ),
    }))
  }

  const deleteTimelineEvent = (id: string) => {
    setContent((prev) => ({
      ...prev,
      timeline: (prev.timeline || []).filter((event) => event.id !== id),
    }))
    toast.success('Timeline event deleted')
  }

  return (
    <TabsContent value="timeline" className="mt-4 space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <ChartLineUp size={24} weight="duotone" className="text-accent" />
              Swimming Progress Timeline
            </h3>
            <p className="text-muted-foreground text-sm">
              Track your swimming achievements over time
            </p>
          </div>
          <Button onClick={addTimelineEvent} className="gap-2">
            <Plus size={18} weight="bold" />
            Add Event
          </Button>
        </div>

        <div className="space-y-4">
          {(content.timeline || [])
            .sort((a, b) => b.date - a.date)
            .map((event) => (
              <Card key={event.id}>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarBlank size={20} weight="duotone" className="text-accent" />
                      <h4 className="font-semibold">{new Date(event.date).toLocaleDateString()}</h4>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteTimelineEvent(event.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Event Title</Label>
                      <Input
                        value={event.title}
                        onChange={(e) => updateTimelineEvent(event.id, 'title', e.target.value)}
                        placeholder="100m Freestyle Personal Best"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Event Type</Label>
                      <Select
                        value={event.eventType}
                        onValueChange={(value) => updateTimelineEvent(event.id, 'eventType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal-best">Personal Best</SelectItem>
                          <SelectItem value="competition">Competition</SelectItem>
                          <SelectItem value="milestone">Milestone</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={new Date(event.date).toISOString().split('T')[0]}
                        onChange={(e) =>
                          updateTimelineEvent(event.id, 'date', new Date(e.target.value).getTime())
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stroke/Event</Label>
                      <Input
                        value={event.stroke}
                        onChange={(e) => updateTimelineEvent(event.id, 'stroke', e.target.value)}
                        placeholder="100m Freestyle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        value={event.time}
                        onChange={(e) => updateTimelineEvent(event.id, 'time', e.target.value)}
                        placeholder="58.4s"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Previous Time (optional)</Label>
                      <Input
                        value={event.previousTime || ''}
                        onChange={(e) =>
                          updateTimelineEvent(event.id, 'previousTime', e.target.value)
                        }
                        placeholder="1:01.2s"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Placement (optional)</Label>
                      <Input
                        value={event.placement || ''}
                        onChange={(e) => updateTimelineEvent(event.id, 'placement', e.target.value)}
                        placeholder="1st Place"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Location (optional)</Label>
                    <Input
                      value={event.location || ''}
                      onChange={(e) => updateTimelineEvent(event.id, 'location', e.target.value)}
                      placeholder="City Aquatic Center"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={event.description}
                      onChange={(e) => updateTimelineEvent(event.id, 'description', e.target.value)}
                      placeholder="Describe what happened at this event..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

          {(!content.timeline || content.timeline.length === 0) && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <ChartLineUp
                  size={48}
                  weight="duotone"
                  className="text-muted-foreground mx-auto mb-4"
                />
                <p className="text-muted-foreground">
                  No timeline events yet. Add your first achievement!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TabsContent>
  )
}
