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

export interface TimelineEvent {
  id: string
  date: number
  eventType: 'personal-best' | 'competition' | 'milestone' | 'training'
  title: string
  stroke: string
  time: string
  previousTime?: string
  location?: string
  description: string
  placement?: string
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
  timeline?: TimelineEvent[]
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  timestamp: number
  read: boolean
}

export interface SwimmingGoal {
  id: string
  stroke: string
  targetTime: string
  currentBest: string
  deadline?: string
  notes?: string
  achieved: boolean
  achievedDate?: number
}

export interface Photo {
  id: string
  /** `/api/photos/<id>` (R2); legacy entries may still hold a base64 `data:` URL */
  url: string
  title: string
  category: 'swimming' | 'anime'
  description?: string
}
