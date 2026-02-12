import { motion } from 'framer-motion'
import { Trophy, TrendUp, MapPin, Medal, Timer, CalendarBlank } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { TimelineEvent } from '@/lib/types'
import { format } from 'date-fns'

interface SwimmingTimelineProps {
  events: TimelineEvent[]
}

export function SwimmingTimeline({ events }: SwimmingTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => b.date - a.date)

  const getEventIcon = (eventType: TimelineEvent['eventType']) => {
    switch (eventType) {
      case 'personal-best':
        return TrendUp
      case 'competition':
        return Trophy
      case 'milestone':
        return Medal
      case 'training':
        return Timer
      default:
        return Trophy
    }
  }

  const getEventColor = (eventType: TimelineEvent['eventType']) => {
    switch (eventType) {
      case 'personal-best':
        return 'text-accent bg-accent/10 border-accent/30'
      case 'competition':
        return 'text-primary bg-primary/10 border-primary/30'
      case 'milestone':
        return 'text-secondary bg-secondary/10 border-secondary/30'
      case 'training':
        return 'text-muted-foreground bg-muted border-border'
      default:
        return 'text-primary bg-primary/10 border-primary/30'
    }
  }

  const getEventBadgeVariant = (eventType: TimelineEvent['eventType']): "default" | "secondary" | "outline" => {
    switch (eventType) {
      case 'personal-best':
        return 'default'
      case 'competition':
        return 'secondary'
      case 'milestone':
        return 'outline'
      case 'training':
        return 'outline'
      default:
        return 'default'
    }
  }

  const getEventLabel = (eventType: TimelineEvent['eventType']) => {
    switch (eventType) {
      case 'personal-best':
        return 'Personal Best'
      case 'competition':
        return 'Competition'
      case 'milestone':
        return 'Milestone'
      case 'training':
        return 'Training'
      default:
        return eventType
    }
  }

  const calculateImprovement = (currentTime: string, previousTime?: string) => {
    if (!previousTime) return null

    const parseTime = (time: string): number => {
      const parts = time.split(':')
      if (parts.length === 2) {
        const [min, sec] = parts
        return parseInt(min) * 60 + parseFloat(sec)
      }
      return parseFloat(time)
    }

    const current = parseTime(currentTime)
    const previous = parseTime(previousTime)
    const diff = previous - current

    if (diff > 0) {
      return `${diff.toFixed(2)}s faster`
    } else if (diff < 0) {
      return `${Math.abs(diff).toFixed(2)}s slower`
    }
    return null
  }

  if (events.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="py-12 text-center">
          <Timer size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No timeline events yet. Add your swimming progress!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-primary to-secondary opacity-30" />
      
      <div className="space-y-8">
        {sortedEvents.map((event, index) => {
          const Icon = getEventIcon(event.eventType)
          const colorClass = getEventColor(event.eventType)
          const improvement = calculateImprovement(event.time, event.previousTime)
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-20"
            >
              <div className={`absolute left-0 w-16 h-16 rounded-full border-4 ${colorClass} flex items-center justify-center shadow-lg z-10`}>
                <Icon size={28} weight="duotone" />
              </div>

              <Card className="hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 border-2">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarBlank size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(event.date), 'MMMM d, yyyy')}
                        </span>
                      </div>
                      <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={getEventBadgeVariant(event.eventType)}>
                          {getEventLabel(event.eventType)}
                        </Badge>
                        <Badge variant="outline" className="border-primary/30">
                          {event.stroke}
                        </Badge>
                        {event.placement && (
                          <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                            {event.placement}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{event.time}</div>
                      {improvement && (
                        <div className={`text-sm font-semibold mt-1 ${event.previousTime && calculateImprovement(event.time, event.previousTime)?.includes('faster') ? 'text-accent' : 'text-muted-foreground'}`}>
                          {improvement}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-3">{event.description}</p>
                  
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin size={16} weight="duotone" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {event.previousTime && (
                    <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendUp size={16} weight="duotone" className="text-accent" />
                      <span>Previous: {event.previousTime}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
