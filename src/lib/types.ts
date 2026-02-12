export interface Anime {
  title: string
  genre: string
  rating: number
  description: string
}

export interface SwimmingAchievement {
  title: string
  time: string
  achievement: string
}

export interface SocialLink {
  name: string
  platform: string
  username: string
}

export interface Profile {
  name: string
  age: number
  tagline: string
  bio: string
  initials: string
}

export interface SiteContent {
  profile: Profile
  animeList: Anime[]
  swimmingAchievements: SwimmingAchievement[]
  socialLinks: SocialLink[]
  favoriteStrokes: string[]
  hobbies: string[]
  funFacts: string[]
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  timestamp: number
  read: boolean
}
