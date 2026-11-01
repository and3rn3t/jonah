import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { Icon } from '@phosphor-icons/react'
import { itemVariants } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface SectionProps {
  icon: Icon
  title: string
  subtitle: string
  iconClassName?: string
  centered?: boolean
  children: ReactNode
}

export function Section({
  icon: SectionIcon,
  title,
  subtitle,
  iconClassName = 'text-accent',
  centered = false,
  children,
}: SectionProps) {
  return (
    <section className="px-4 py-10 sm:py-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={itemVariants}
          className={cn('mb-6 sm:mb-8 md:mb-12', centered && 'text-center')}
        >
          <div
            className={cn(
              'mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3',
              centered && 'justify-center'
            )}
          >
            <SectionIcon size={28} className={cn(iconClassName, 'sm:hidden')} />
            <SectionIcon
              size={32}
              weight="duotone"
              className={cn(iconClassName, 'hidden sm:block')}
            />
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h2>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">{subtitle}</p>
        </motion.div>

        {children}
      </div>
    </section>
  )
}
