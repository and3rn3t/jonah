import { motion } from 'motion/react'
import { Clock, Trophy, Waves } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { containerVariants, itemVariants } from '@/lib/motion'
import type { SwimmingAchievement } from '@/lib/types'
import { Section } from '@/sections/Section'

interface SwimmingSectionProps {
  achievements?: SwimmingAchievement[]
  favoriteStrokes?: string[]
}

export function SwimmingSection({ achievements, favoriteStrokes }: SwimmingSectionProps) {
  return (
    <Section
      icon={Waves}
      iconClassName="text-primary"
      title="Swimming"
      subtitle="My times and achievements in the pool"
    >
      <motion.div variants={containerVariants} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {achievements?.map((achievement, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="hover:shadow-secondary/30 hover:border-secondary group border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="group-hover:text-secondary transition-colors">
                        {achievement.title}
                      </CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <Clock size={16} />
                        <span className="text-foreground text-lg font-semibold">
                          {achievement.time}
                        </span>
                      </CardDescription>
                    </div>
                    <Trophy size={24} weight="duotone" className="text-secondary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="border-secondary text-secondary">
                    {achievement.achievement}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants}>
          <Card className="from-primary/5 to-secondary/5 border-primary/20 border-2 bg-linear-to-br">
            <CardHeader>
              <CardTitle>Favorite Strokes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {favoriteStrokes?.map((stroke, index) => (
                  <Badge
                    key={index}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {stroke}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Section>
  )
}
