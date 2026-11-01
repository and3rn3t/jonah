import { lazy, Suspense } from 'react'
import { motion } from 'motion/react'
import { ChartBar, ChartLineUp, Images, Target } from '@phosphor-icons/react'
import { Separator } from '@/components/ui/separator'
import { PhotoGallery } from '@/components/PhotoGallery'
import { PoolHeader } from '@/components/PoolHeader'
import { StatsDashboard } from '@/components/StatsDashboard'
import { SwimmingGoals } from '@/components/SwimmingGoals'
import { SwimmingTimeline } from '@/components/SwimmingTimeline'
import { ThemeToggle } from '@/components/ThemeToggle'
import { defaultContent, defaultGoals } from '@/content/defaults'
import { useKV } from '@/hooks/useKV'
import { containerVariants, itemVariants } from '@/lib/motion'
import type { SiteContent, SwimmingGoal } from '@/lib/types'
import { AboutSection } from '@/sections/AboutSection'
import { AnimeSection } from '@/sections/AnimeSection'
import { ConnectSection } from '@/sections/ConnectSection'
import { ProfileHero } from '@/sections/ProfileHero'
import { Section } from '@/sections/Section'
import { SwimmingSection } from '@/sections/SwimmingSection'

const AdminPanel = lazy(() =>
  import('@/components/AdminPanel').then((m) => ({ default: m.AdminPanel }))
)

function SectionDivider() {
  return <Separator className="mx-auto max-w-6xl" />
}

function App() {
  const [content, setContent] = useKV<SiteContent>('site-content', defaultContent)
  const [goals] = useKV<SwimmingGoal[]>('swimming-goals', defaultGoals)

  return (
    <div className="gradient-mesh min-h-screen">
      <ThemeToggle />
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <ProfileHero profile={content?.profile} />

        <PoolHeader />

        <SectionDivider />
        <AnimeSection animeList={content?.animeList} />

        <SectionDivider />
        <SwimmingSection
          achievements={content?.swimmingAchievements}
          favoriteStrokes={content?.favoriteStrokes}
        />

        <SectionDivider />
        <Section icon={Target} title="Swimming Goals" subtitle="Target times I'm working towards">
          <motion.div variants={itemVariants}>
            <SwimmingGoals goals={goals || []} />
          </motion.div>
        </Section>

        <SectionDivider />
        <Section
          icon={ChartBar}
          title="Performance Stats"
          subtitle="Track your improvements and analyze your progress"
        >
          <motion.div variants={itemVariants}>
            <StatsDashboard events={content?.timeline || []} />
          </motion.div>
        </Section>

        <SectionDivider />
        <Section
          icon={ChartLineUp}
          title="Progress Timeline"
          subtitle="My swimming journey and achievements over time"
        >
          <motion.div variants={itemVariants}>
            <SwimmingTimeline events={content?.timeline || []} />
          </motion.div>
        </Section>

        <SectionDivider />
        <Section
          icon={Images}
          title="Photo Gallery"
          subtitle="My favorite moments from swimming meets and anime"
        >
          <motion.div variants={itemVariants}>
            <PhotoGallery />
          </motion.div>
        </Section>

        <SectionDivider />
        <AboutSection hobbies={content?.hobbies} funFacts={content?.funFacts} />

        <SectionDivider />
        <ConnectSection socialLinks={content?.socialLinks} />

        <footer className="text-muted-foreground border-t px-4 py-8 text-center">
          <p className="text-sm">Thanks for visiting my page! 🌊✨</p>
        </footer>
      </motion.div>

      {content && (
        <Suspense
          fallback={
            <div className="bg-card fixed right-4 bottom-4 rounded-lg p-4 shadow-lg">
              Loading admin...
            </div>
          }
        >
          <AdminPanel content={content} onContentUpdate={setContent} />
        </Suspense>
      )}
    </div>
  )
}

export default App
