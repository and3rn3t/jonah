import { Plus, Trash, X } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import type { ContentTabProps } from '@/components/admin/types'

export function AboutTab({ content, setContent }: ContentTabProps) {
  const addHobby = () => {
    const newHobby = prompt('Enter hobby:')
    if (newHobby?.trim()) {
      setContent((prev) => ({
        ...prev,
        hobbies: [...(prev.hobbies || []), newHobby.trim()],
      }))
    }
  }

  const deleteHobby = (index: number) => {
    setContent((prev) => ({
      ...prev,
      hobbies: prev.hobbies?.filter((_, i) => i !== index) || [],
    }))
  }

  const addFunFact = () => {
    const newFact = prompt('Enter fun fact:')
    if (newFact?.trim()) {
      setContent((prev) => ({
        ...prev,
        funFacts: [...(prev.funFacts || []), newFact.trim()],
      }))
    }
  }

  const deleteFunFact = (index: number) => {
    setContent((prev) => ({
      ...prev,
      funFacts: prev.funFacts?.filter((_, i) => i !== index) || [],
    }))
  }

  return (
    <TabsContent value="about" className="mt-4 space-y-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Hobbies</h3>
            <p className="text-muted-foreground text-sm">Your other interests</p>
          </div>
          <Button onClick={addHobby} variant="outline" size="sm" className="gap-2">
            <Plus size={16} weight="bold" />
            Add Hobby
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {content.hobbies?.map((hobby, index) => (
            <Badge key={index} variant="secondary" className="gap-2 pr-1">
              {hobby}
              <button
                onClick={() => deleteHobby(index)}
                className="rounded-full p-0.5 hover:bg-black/10"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Fun Facts</h3>
            <p className="text-muted-foreground text-sm">Interesting things about you</p>
          </div>
          <Button onClick={addFunFact} variant="outline" size="sm" className="gap-2">
            <Plus size={16} weight="bold" />
            Add Fact
          </Button>
        </div>
        <div className="space-y-2">
          {content.funFacts?.map((fact, index) => (
            <div key={index} className="bg-muted/50 flex items-start gap-2 rounded-lg p-3">
              <span className="text-accent mt-1">•</span>
              <span className="flex-1">{fact}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => deleteFunFact(index)}
              >
                <Trash size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </TabsContent>
  )
}
