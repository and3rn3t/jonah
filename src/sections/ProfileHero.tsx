import { motion } from 'motion/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { itemVariants } from '@/lib/motion'
import type { Profile } from '@/lib/types'

interface ProfileHeroProps {
  profile?: Profile
}

export function ProfileHero({ profile }: ProfileHeroProps) {
  return (
    <section className="wave-pattern px-4 pt-20 pb-12 sm:py-16 md:py-24">
      <motion.div variants={itemVariants} className="mx-auto max-w-6xl text-center">
        <div className="mb-4 flex justify-center sm:mb-6">
          <Avatar className="border-accent h-20 w-20 border-4 shadow-lg sm:h-24 sm:w-24 md:h-32 md:w-32">
            <AvatarFallback className="from-primary to-secondary bg-linear-to-br text-2xl font-bold text-white sm:text-4xl">
              {profile?.initials || 'AK'}
            </AvatarFallback>
          </Avatar>
        </div>
        <h1 className="from-primary via-secondary to-accent mb-3 bg-linear-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:mb-4 sm:text-4xl md:text-6xl">
          Hey, I'm {profile?.name || 'Alex'}!
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl px-2 text-base sm:text-lg md:text-xl">
          {profile?.age || 14} years old •{' '}
          {profile?.tagline || 'Anime enthusiast • Competitive swimmer'}
        </p>
        <p className="text-foreground/80 mx-auto mt-3 max-w-xl px-2 text-sm sm:mt-4 sm:text-base md:text-lg">
          {profile?.bio || 'Welcome to my corner of the internet!'}
        </p>
      </motion.div>
    </section>
  )
}
