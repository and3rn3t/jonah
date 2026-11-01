import {
  DiscordLogo,
  InstagramLogo,
  PaperPlaneTilt,
  TiktokLogo,
  TwitchLogo,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

interface SocialPlatformStyle {
  icon: Icon
  /** Hover classes for the link button */
  color: string
  /** Resting background tint */
  bgColor: string
}

const platformStyles: Record<string, SocialPlatformStyle> = {
  Discord: {
    icon: DiscordLogo,
    color: 'hover:bg-[#5865F2] hover:text-white',
    bgColor: 'bg-[#5865F2]/10',
  },
  Instagram: {
    icon: InstagramLogo,
    color:
      'hover:bg-linear-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white',
    bgColor: 'bg-linear-to-tr from-[#f9ce34]/10 via-[#ee2a7b]/10 to-[#6228d7]/10',
  },
  Twitch: {
    icon: TwitchLogo,
    color: 'hover:bg-[#9146FF] hover:text-white',
    bgColor: 'bg-[#9146FF]/10',
  },
  YouTube: {
    icon: YoutubeLogo,
    color: 'hover:bg-[#FF0000] hover:text-white',
    bgColor: 'bg-[#FF0000]/10',
  },
  Twitter: {
    icon: XLogo,
    color: 'hover:bg-[#1DA1F2] hover:text-white',
    bgColor: 'bg-[#1DA1F2]/10',
  },
  TikTok: {
    icon: TiktokLogo,
    color: 'hover:bg-black hover:text-white',
    bgColor: 'bg-black/10',
  },
}

const fallbackStyle: SocialPlatformStyle = {
  icon: PaperPlaneTilt,
  color: 'hover:bg-accent hover:text-accent-foreground',
  bgColor: 'bg-accent/10',
}

export const getSocialPlatformStyle = (platform: string): SocialPlatformStyle =>
  platformStyles[platform] ?? fallbackStyle
