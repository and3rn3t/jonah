import { motion } from 'motion/react'
import { PaperPlaneTilt } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { itemVariants } from '@/lib/motion'
import { getSocialPlatformStyle } from '@/lib/social'
import type { SocialLink } from '@/lib/types'
import { ContactForm } from '@/sections/ContactForm'
import { Section } from '@/sections/Section'

interface ConnectSectionProps {
  socialLinks?: SocialLink[]
}

export function ConnectSection({ socialLinks }: ConnectSectionProps) {
  return (
    <Section
      icon={PaperPlaneTilt}
      title="Let's Connect!"
      subtitle="Find me on social media or send me a message"
      centered
    >
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="h-full border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Social Media</CardTitle>
              <CardDescription>Let's be friends online!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {socialLinks?.map((social, index) => {
                const {
                  icon: PlatformIcon,
                  color,
                  bgColor,
                } = getSocialPlatformStyle(social.platform)
                return (
                  <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className={`h-auto w-full justify-start gap-3 py-4 transition-all duration-300 ${color} ${bgColor}`}
                    >
                      <PlatformIcon size={24} weight="fill" />
                      <div className="text-left">
                        <div className="font-semibold">{social.name}</div>
                        <div className="text-sm opacity-80">{social.username}</div>
                      </div>
                    </Button>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ContactForm />
        </motion.div>
      </div>
    </Section>
  )
}
