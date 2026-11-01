import { motion } from 'motion/react'
import { User } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { itemVariants } from '@/lib/motion'
import { Section } from '@/sections/Section'

interface AboutSectionProps {
  hobbies?: string[]
  funFacts?: string[]
}

export function AboutSection({ hobbies, funFacts }: AboutSectionProps) {
  return (
    <Section icon={User} title="About Me" subtitle="A bit more about what I enjoy">
      <motion.div variants={itemVariants}>
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-xl font-semibold">Other Hobbies</h3>
                <div className="flex flex-wrap gap-2">
                  {hobbies?.map((hobby, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {hobby}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-xl font-semibold">Fun Facts</h3>
                <ul className="text-muted-foreground space-y-2">
                  {funFacts?.map((fact, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Section>
  )
}
