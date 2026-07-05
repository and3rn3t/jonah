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

  const getEventBadgeVariant = (
    eventType: TimelineEvent['eventType']
  ): 'default' | 'secondary' | 'outline' => {
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
          <p className="text-muted-foreground">
            No timeline events yet. Add your swimming progress!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative">
      {/* Timeline line - hidden on small mobile, visible on sm+ */}
      <div className="from-accent via-primary to-secondary absolute top-0 bottom-0 left-8 hidden w-0.5 bg-linear-to-b opacity-30 sm:block" />

      <div className="space-y-4 sm:space-y-8">
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
              className="relative sm:pl-20"
            >
              {/* Mobile: inline icon badge, Desktop: positioned left icon */}
              <div
                className={`absolute left-0 hidden h-16 w-16 rounded-full border-4 sm:flex ${colorClass} z-10 items-center justify-center shadow-lg`}
              >
                <Icon size={28} weight="duotone" />
              </div>

              <Card className="hover:shadow-accent/10 border-2 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="flex-1">
                      {/* Mobile: show icon inline with date */}
                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 rounded-full border-2 sm:hidden ${colorClass} items-center justify-center`}
                        >
                          <Icon size={16} weight="duotone" />
                        </div>
                        <CalendarBlank
                          size={16}
                          className="text-muted-foreground hidden sm:block"
                        />
                        <span className="text-muted-foreground text-sm">
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <CardTitle className="mb-2 text-lg sm:text-xl">{event.title}</CardTitle>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <Badge
                          variant={getEventBadgeVariant(event.eventType)}
                          className="text-xs sm:text-sm"
                        >
                          {getEventLabel(event.eventType)}
                        </Badge>
                        <Badge variant="outline" className="border-primary/30 text-xs sm:text-sm">
                          {event.stroke}
                        </Badge>
                        {event.placement && (
                          <Badge
                            variant="secondary"
                            className="bg-accent/20 text-accent border-accent/30 text-xs sm:text-sm"
                          >
                            {event.placement}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-left sm:mt-0 sm:text-right">
                      <div className="text-primary text-2xl font-bold sm:text-3xl">
                        {event.time}
                      </div>
                      {improvement && (
                        <div
                          className={`mt-1 text-xs font-semibold sm:text-sm ${event.previousTime && calculateImprovement(event.time, event.previousTime)?.includes('faster') ? 'text-accent' : 'text-muted-foreground'}`}
                        >
                          {improvement}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-3 text-sm sm:text-base">
                    {event.description}
                  </p>

                  {event.location && (
                    <div className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm">
                      <MapPin size={16} weight="duotone" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {event.previousTime && (
                    <div className="text-muted-foreground mt-3 flex items-center gap-2 border-t pt-3 text-xs sm:text-sm">
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
