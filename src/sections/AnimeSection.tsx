import { motion } from 'motion/react'
import { Star, Television } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { containerVariants, itemVariants } from '@/lib/motion'
import type { Anime } from '@/lib/types'
import { Section } from '@/sections/Section'

interface AnimeSectionProps {
  animeList?: Anime[]
}

export function AnimeSection({ animeList }: AnimeSectionProps) {
  return (
    <Section
      icon={Television}
      title="Favorite Anime"
      subtitle="The shows that got me hooked on anime"
    >
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {animeList?.map((anime, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="hover:shadow-accent/20 hover:border-accent/50 group h-full border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="group-hover:text-accent transition-colors">
                  {anime.title}
                </CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="mt-2">
                    {anime.genre}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex gap-1">
                  {[...Array(anime.rating)].map((_, i) => (
                    <Star key={i} weight="fill" className="text-accent" size={16} />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">{anime.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
