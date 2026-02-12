import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendUp, TrendDown, Trophy, Target, Timer, Flame } from '@phosphor-icons/react'
import type { TimelineEvent } from '@/lib/types'
import { motion } from 'framer-motion'

interface StatsDashboardProps {
  events: TimelineEvent[]
}

interface StrokeStats {
  stroke: string
  count: number
  bestTime: number
  bestTimeStr: string
  firstTime: number
  firstTimeStr: string
  improvement: number
  improvementPercent: number
  events: TimelineEvent[]
}

export function StatsDashboard({ events }: StatsDashboardProps) {
  const parseTime = (timeStr: string): number => {
    if (!timeStr || timeStr === 'N/A') return 0
    
    const parts = timeStr.replace('s', '').trim().split(':')
    if (parts.length === 2) {
      return parseFloat(parts[0]) * 60 + parseFloat(parts[1])
    }
    return parseFloat(parts[0])
  }

  const formatTime = (seconds: number): string => {
    if (seconds === 0) return 'N/A'
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60)
      const secs = (seconds % 60).toFixed(1)
      return `${mins}:${secs.padStart(4, '0')}s`
    }
    return `${seconds.toFixed(1)}s`
  }

  const getStrokeStats = (): StrokeStats[] => {
    const strokeMap = new Map<string, TimelineEvent[]>()
    
    events
      .filter(e => e.time && e.time !== 'N/A' && e.eventType !== 'milestone')
      .forEach(event => {
        const stroke = event.stroke
        if (!strokeMap.has(stroke)) {
          strokeMap.set(stroke, [])
        }
        strokeMap.get(stroke)!.push(event)
      })

    const stats: StrokeStats[] = []
    
    strokeMap.forEach((strokeEvents, stroke) => {
      if (stroke === 'All Strokes') return
      
      const sortedEvents = strokeEvents
        .map(e => ({ ...e, timeNum: parseTime(e.time) }))
        .filter(e => e.timeNum > 0)
        .sort((a, b) => a.date - b.date)

      if (sortedEvents.length < 2) return

      const firstEvent = sortedEvents[0]
      const bestEvent = sortedEvents.reduce((best, curr) => 
        curr.timeNum < best.timeNum ? curr : best
      )

      const improvement = firstEvent.timeNum - bestEvent.timeNum
      const improvementPercent = (improvement / firstEvent.timeNum) * 100

      stats.push({
        stroke,
        count: sortedEvents.length,
        bestTime: bestEvent.timeNum,
        bestTimeStr: bestEvent.time,
        firstTime: firstEvent.timeNum,
        firstTimeStr: firstEvent.time,
        improvement,
        improvementPercent,
        events: sortedEvents
      })
    })

    return stats.sort((a, b) => b.improvementPercent - a.improvementPercent)
  }

  const getTotalStats = () => {
    const personalBests = events.filter(e => e.eventType === 'personal-best').length
    const competitions = events.filter(e => e.eventType === 'competition').length
    const milestones = events.filter(e => e.eventType === 'milestone').length
    const firstPlaces = events.filter(e => e.placement === '1st Place').length
    
    const totalImprovement = getStrokeStats().reduce((sum, stat) => sum + stat.improvement, 0)
    
    const recentEvents = events
      .filter(e => e.time && e.time !== 'N/A')
      .sort((a, b) => b.date - a.date)
      .slice(0, 5)
    
    return {
      personalBests,
      competitions,
      milestones,
      firstPlaces,
      totalImprovement,
      totalEvents: events.length,
      recentEvents
    }
  }

  const getMonthlyProgress = () => {
    const monthMap = new Map<string, { events: number, pbs: number }>()
    
    events.forEach(event => {
      const date = new Date(event.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { events: 0, pbs: 0 })
      }
      
      const monthData = monthMap.get(monthKey)!
      monthData.events++
      if (event.eventType === 'personal-best') {
        monthData.pbs++
      }
    })
    
    return Array.from(monthMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
  }

  const strokeStats = getStrokeStats()
  const totalStats = getTotalStats()
  const monthlyProgress = getMonthlyProgress()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 hover:border-accent transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Personal Bests</p>
                  <p className="text-3xl font-bold text-accent">{totalStats.personalBests}</p>
                </div>
                <Trophy size={32} weight="duotone" className="text-accent" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Competitions</p>
                  <p className="text-3xl font-bold text-primary">{totalStats.competitions}</p>
                </div>
                <Target size={32} weight="duotone" className="text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-2 hover:border-secondary transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">1st Places</p>
                  <p className="text-3xl font-bold text-secondary">{totalStats.firstPlaces}</p>
                </div>
                <Flame size={32} weight="duotone" className="text-secondary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-2 hover:border-accent transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-3xl font-bold text-foreground">{totalStats.totalEvents}</p>
                </div>
                <Timer size={32} weight="duotone" className="text-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="improvements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="strokes">By Stroke</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="improvements" className="space-y-4 mt-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Top Improvements</CardTitle>
              <CardDescription>Your biggest time improvements across all strokes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {strokeStats.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Keep training! More data needed to show improvements.
                </p>
              ) : (
                strokeStats.map((stat, index) => (
                  <motion.div
                    key={stat.stroke}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="bg-gradient-to-r from-accent/5 to-transparent border hover:shadow-lg transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{stat.stroke}</h4>
                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                              <span>Started: {stat.firstTimeStr}</span>
                              <span>→</span>
                              <span className="text-accent font-semibold">Best: {stat.bestTimeStr}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <TrendDown size={20} weight="bold" />
                              <span className="text-2xl font-bold">
                                {stat.improvementPercent.toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              -{stat.improvement.toFixed(1)}s faster
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{stat.count} recorded times</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strokes" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {strokeStats.map((stat, index) => (
              <motion.div
                key={stat.stroke}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-2 hover:border-primary/50 transition-all h-full">
                  <CardHeader>
                    <CardTitle className="text-xl">{stat.stroke}</CardTitle>
                    <CardDescription>{stat.count} recorded swims</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Personal Best</span>
                        <span className="font-semibold text-accent">{stat.bestTimeStr}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Starting Time</span>
                        <span className="font-semibold">{stat.firstTimeStr}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Improvement</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          -{stat.improvement.toFixed(1)}s ({stat.improvementPercent.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Progress Timeline</p>
                      <div className="flex gap-1 h-12 items-end">
                        {stat.events.slice(0, 8).map((event, i) => {
                          const eventTime = parseTime(event.time)
                          const height = ((stat.firstTime - eventTime) / stat.improvement) * 100
                          return (
                            <div
                              key={i}
                              className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t transition-all hover:opacity-80"
                              style={{ height: `${Math.max(height, 10)}%` }}
                              title={`${event.time} - ${new Date(event.date).toLocaleDateString()}`}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 mt-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
              <CardDescription>Last 6 months of swimming activity</CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyProgress.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No activity data available yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {monthlyProgress.map((month, index) => {
                    const date = new Date(month.month + '-01')
                    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    
                    return (
                      <motion.div
                        key={month.month}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{monthName}</span>
                          <div className="flex gap-3 text-sm">
                            <span className="text-muted-foreground">
                              {month.events} events
                            </span>
                            {month.pbs > 0 && (
                              <span className="text-accent font-semibold">
                                {month.pbs} PB{month.pbs > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 h-8 bg-muted rounded-lg overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary to-secondary transition-all"
                            style={{ width: `${(month.events / Math.max(...monthlyProgress.map(m => m.events))) * 100}%` }}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your 5 most recent swims</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {totalStats.recentEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/5 transition-colors border"
                >
                  <div>
                    <p className="font-semibold">{event.stroke}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{event.time}</p>
                    {event.placement && (
                      <Badge variant="secondary" className="text-xs">{event.placement}</Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
