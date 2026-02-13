import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Target, TrendUp, CheckCircle, Clock } from '@phosphor-icons/react'
import type { SwimmingGoal } from '@/lib/types'
import { motion } from 'framer-motion'

interface SwimmingGoalsProps {
  goals: SwimmingGoal[]
}

export function SwimmingGoals({ goals }: SwimmingGoalsProps) {
  const parseTime = (timeStr: string): number => {
    const parts = timeStr.replace('s', '').split(':')
    if (parts.length === 1) {
      return parseFloat(parts[0])
    } else if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseFloat(parts[1])
    }
    return 0
  }

  const calculateProgress = (currentBest: string, targetTime: string): number => {
    const current = parseTime(currentBest)
    const target = parseTime(targetTime)
    
    if (!current || !target) return 0
    
    const improvement = current - target
    const totalNeeded = current * 0.15
    const progress = Math.min(100, Math.max(0, ((totalNeeded - improvement) / totalNeeded) * 100))
    
    return Math.round(progress)
  }

  const isDeadlineClose = (deadline?: string): boolean => {
    if (!deadline) return false
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil <= 30 && daysUntil > 0
  }

  const activeGoals = goals.filter(g => !g.achieved)
  const achievedGoals = goals.filter(g => g.achieved)

  if (goals.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Target size={48} weight="duotone" className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Goals Set Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Set your first swimming goal to track your progress and stay motivated!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {activeGoals.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-accent sm:hidden" />
            <Target size={24} weight="duotone" className="text-accent hidden sm:block" />
            <h3 className="text-lg sm:text-xl font-semibold">Active Goals</h3>
            <Badge variant="secondary" className="text-xs sm:text-sm">{activeGoals.length}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {activeGoals.map((goal, index) => {
              const progress = calculateProgress(goal.currentBest, goal.targetTime)
              const deadlineClose = isDeadlineClose(goal.deadline)
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 transition-all duration-300 border-2 hover:border-accent/50">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{goal.stroke}</CardTitle>
                          <CardDescription className="mt-1">
                            Target: <span className="font-semibold text-foreground">{goal.targetTime}</span>
                          </CardDescription>
                        </div>
                        {deadlineClose && (
                          <Badge variant="destructive" className="gap-1">
                            <Clock size={14} />
                            Soon
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Current Best</span>
                          <span className="font-semibold">{goal.currentBest}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{progress}% progress</span>
                          <span className="flex items-center gap-1">
                            <TrendUp size={12} weight="bold" />
                            {(parseTime(goal.currentBest) - parseTime(goal.targetTime)).toFixed(1)}s to go
                          </span>
                        </div>
                      </div>

                      {goal.deadline && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock size={16} />
                          <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                      )}

                      {goal.notes && (
                        <p className="text-sm text-muted-foreground italic border-l-2 border-accent pl-3">
                          {goal.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {achievedGoals.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle size={24} weight="duotone" className="text-secondary" />
            <h3 className="text-xl font-semibold">Achieved Goals</h3>
            <Badge className="bg-secondary text-secondary-foreground">{achievedGoals.length}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievedGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full border-2 border-secondary/30 bg-linear-to-br from-secondary/5 to-transparent">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle size={20} weight="fill" className="text-secondary" />
                          {goal.stroke}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Target: <span className="font-semibold text-foreground line-through">{goal.targetTime}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Final Time</span>
                      <span className="font-semibold text-secondary">{goal.currentBest}</span>
                    </div>
                    {goal.achievedDate && (
                      <div className="text-sm text-muted-foreground">
                        Achieved on {new Date(goal.achievedDate).toLocaleDateString()}
                      </div>
                    )}
                    {goal.notes && (
                      <p className="text-sm text-muted-foreground italic border-l-2 border-secondary pl-3 mt-2">
                        {goal.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
