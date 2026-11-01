import { Plus, Trash, Target } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useKV } from '@/hooks/useKV'
import type { SwimmingGoal } from '@/lib/types'

export function GoalsTab() {
  const [goals, setGoals] = useKV<SwimmingGoal[]>('swimming-goals', [])

  const addGoal = () => {
    const newGoal: SwimmingGoal = {
      id: Date.now().toString(),
      stroke: '',
      targetTime: '',
      currentBest: '',
      achieved: false,
    }
    setGoals((currentGoals) => [...(currentGoals || []), newGoal])
  }

  const updateGoal = (id: string, field: keyof SwimmingGoal, value: string | boolean | number) => {
    setGoals((currentGoals) =>
      (currentGoals || []).map((goal) => (goal.id === id ? { ...goal, [field]: value } : goal))
    )
  }

  const deleteGoal = (id: string) => {
    setGoals((currentGoals) => (currentGoals || []).filter((goal) => goal.id !== id))
    toast.success('Goal deleted')
  }

  const toggleGoalAchieved = (id: string, achieved: boolean) => {
    setGoals((currentGoals) =>
      (currentGoals || []).map((goal) =>
        goal.id === id
          ? { ...goal, achieved, achievedDate: achieved ? Date.now() : undefined }
          : goal
      )
    )
    toast.success(achieved ? 'Goal marked as achieved! 🎉' : 'Goal marked as active')
  }

  return (
    <TabsContent value="goals" className="mt-4 space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Target size={24} weight="duotone" className="text-accent" />
              Swimming Goals
            </h3>
            <p className="text-muted-foreground text-sm">
              Set target times for each stroke and track your progress
            </p>
          </div>
          <Button onClick={addGoal} className="gap-2">
            <Plus size={18} weight="bold" />
            Add Goal
          </Button>
        </div>

        <div className="space-y-4">
          {(goals || [])
            .sort((a, b) => {
              if (a.achieved === b.achieved) return 0
              return a.achieved ? 1 : -1
            })
            .map((goal) => (
              <Card
                key={goal.id}
                className={goal.achieved ? 'border-secondary/50 bg-secondary/5' : ''}
              >
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={goal.achieved}
                        onCheckedChange={(checked) =>
                          toggleGoalAchieved(goal.id, checked as boolean)
                        }
                        className="h-5 w-5"
                      />
                      <div>
                        <Label className="text-base font-semibold">
                          {goal.stroke || 'New Goal'}
                        </Label>
                        {goal.achieved && (
                          <p className="text-muted-foreground text-xs">
                            Achieved{' '}
                            {goal.achievedDate
                              ? new Date(goal.achievedDate).toLocaleDateString()
                              : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Stroke/Event</Label>
                      <Input
                        value={goal.stroke}
                        onChange={(e) => updateGoal(goal.id, 'stroke', e.target.value)}
                        placeholder="100m Freestyle"
                        disabled={goal.achieved}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Time</Label>
                      <Input
                        value={goal.targetTime}
                        onChange={(e) => updateGoal(goal.id, 'targetTime', e.target.value)}
                        placeholder="56.0s or 1:02.5"
                        disabled={goal.achieved}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Current Best Time</Label>
                      <Input
                        value={goal.currentBest}
                        onChange={(e) => updateGoal(goal.id, 'currentBest', e.target.value)}
                        placeholder="58.4s or 1:05.2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Deadline (Optional)</Label>
                      <Input
                        type="date"
                        value={goal.deadline || ''}
                        onChange={(e) => updateGoal(goal.id, 'deadline', e.target.value)}
                        disabled={goal.achieved}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes (Optional)</Label>
                    <Textarea
                      value={goal.notes || ''}
                      onChange={(e) => updateGoal(goal.id, 'notes', e.target.value)}
                      placeholder="Training plan, motivation, specific techniques to work on..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

          {(!goals || goals.length === 0) && (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Target size={48} weight="duotone" className="text-muted-foreground mb-4" />
                <h3 className="mb-2 text-lg font-semibold">No Goals Yet</h3>
                <p className="text-muted-foreground max-w-sm text-sm">
                  Click "Add Goal" to set your first swimming target and start tracking your
                  progress!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TabsContent>
  )
}
