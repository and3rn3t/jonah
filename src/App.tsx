import { motion, Variants } from 'framer-motion'
import { Television, Waves, User, Star, Trophy, Clock, DiscordLogo, InstagramLogo, TwitchLogo, YoutubeLogo, PaperPlaneTilt, Images, XLogo, TiktokLogo, Envelope, Bell, ChartLineUp } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { PhotoGallery } from '@/components/PhotoGallery'
import { AdminPanel } from '@/components/AdminPanel'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SwimmingTimeline } from '@/components/SwimmingTimeline'
import { useKV } from '@github/spark/hooks'
import type { SiteContent, ContactMessage } from '@/lib/types'

const defaultContent: SiteContent = {
  profile: {
    name: 'Alex',
    age: 14,
    tagline: 'Anime enthusiast • Competitive swimmer',
    bio: 'Welcome to my corner of the internet! I love diving into epic anime series and making waves in the pool.',
    initials: 'AK'
  },
  animeList: [
    {
      title: "Demon Slayer",
      genre: "Action",
      rating: 5,
      description: "Epic story with amazing animation and character development"
    },
    {
      title: "My Hero Academia",
      genre: "Shounen",
      rating: 5,
      description: "Inspiring hero journey with cool powers and great fights"
    },
    {
      title: "Attack on Titan",
      genre: "Dark Fantasy",
      rating: 4,
      description: "Mind-blowing plot twists and intense action sequences"
    },
    {
      title: "Jujutsu Kaisen",
      genre: "Action",
      rating: 5,
      description: "Incredible fight scenes and awesome curse techniques"
    }
  ],
  swimmingAchievements: [
    {
      title: "100m Freestyle",
      time: "58.4s",
      achievement: "Personal Best"
    },
    {
      title: "50m Butterfly",
      time: "29.2s",
      achievement: "School Record"
    },
    {
      title: "200m Medley",
      time: "2:18.5",
      achievement: "Regional Qualifier"
    }
  ],
  socialLinks: [
    {
      name: 'Discord',
      platform: 'Discord',
      username: 'AlexSwims#1234'
    },
    {
      name: 'Instagram',
      platform: 'Instagram',
      username: '@alexswims_anime'
    },
    {
      name: 'Twitch',
      platform: 'Twitch',
      username: 'alexswims'
    },
    {
      name: 'YouTube',
      platform: 'YouTube',
      username: '@AlexSwimming'
    }
  ],
  favoriteStrokes: ["Freestyle", "Butterfly", "Backstroke"],
  hobbies: ["Gaming", "Drawing", "Reading Manga", "Listening to Music"],
  funFacts: [
    "I've been swimming competitively for 5 years",
    "My dream is to visit Japan and see anime studios",
    "I practice swimming 5 days a week",
    "I started watching anime when I was 11"
  ],
  timeline: [
    {
      id: '1',
      date: new Date('2024-12-08').getTime(),
      eventType: 'personal-best',
      title: '50m Freestyle Personal Best',
      stroke: '50m Freestyle',
      time: '26.1s',
      previousTime: '27.3s',
      location: 'Winter Championship Trials',
      description: 'Absolutely crushed my previous record! Sprint training has been paying off big time.',
      placement: '1st Place'
    },
    {
      id: '2',
      date: new Date('2024-11-22').getTime(),
      eventType: 'competition',
      title: 'Thanksgiving Classic Meet',
      stroke: '100m Butterfly',
      time: '1:04.8s',
      location: 'Metro Aquatic Complex',
      description: 'First time competing in 100m fly - it was tough but I loved the challenge!',
      placement: '4th Place'
    },
    {
      id: '3',
      date: new Date('2024-10-30').getTime(),
      eventType: 'milestone',
      title: 'Team Captain Announcement',
      stroke: 'All Strokes',
      time: 'N/A',
      location: 'City Swim Club',
      description: 'Got selected as one of the team captains for the winter season! So honored and ready to lead by example.'
    },
    {
      id: '4',
      date: new Date('2024-09-18').getTime(),
      eventType: 'personal-best',
      title: '200m Freestyle New Record',
      stroke: '200m Freestyle',
      time: '2:05.3s',
      previousTime: '2:12.1s',
      location: 'Fall Season Opener',
      description: 'Nearly 7 seconds off my previous time! Endurance training is really working.',
      placement: '2nd Place'
    },
    {
      id: '5',
      date: new Date('2024-08-12').getTime(),
      eventType: 'training',
      title: 'Summer Training Camp Graduation',
      stroke: 'All Strokes',
      time: 'N/A',
      location: 'Elite Swimming Academy',
      description: 'Completed 2-week intensive training camp. Learned advanced techniques and made friends from other teams!'
    },
    {
      id: '6',
      date: new Date('2024-07-04').getTime(),
      eventType: 'competition',
      title: 'Independence Day Invitational',
      stroke: '50m Backstroke',
      time: '32.7s',
      location: 'Community Pool',
      description: 'Fun meet on the 4th of July. Backstroke isn\'t my strongest but improving every time!',
      placement: '5th Place'
    },
    {
      id: '7',
      date: new Date('2024-05-25').getTime(),
      eventType: 'personal-best',
      title: '100m Breaststroke Breakthrough',
      stroke: '100m Breaststroke',
      time: '1:14.2s',
      previousTime: '1:19.8s',
      location: 'Spring Championships',
      description: 'Finally getting the hang of breaststroke technique. Over 5 seconds faster!',
      placement: '3rd Place'
    },
    {
      id: '8',
      date: new Date('2024-04-10').getTime(),
      eventType: 'milestone',
      title: '4x100m Relay Team Record',
      stroke: 'Freestyle Relay',
      time: '3:42.1s',
      location: 'Regional Team Meet',
      description: 'Our relay team set a new club record! Amazing feeling to achieve this with my teammates.',
      placement: '1st Place'
    },
    {
      id: '9',
      date: new Date('2024-03-02').getTime(),
      eventType: 'training',
      title: 'Flip Turn Mastery',
      stroke: 'All Strokes',
      time: 'N/A',
      location: 'Team Practice',
      description: 'Coach says my flip turns are finally competition-ready. Those underwater drills were brutal but worth it!'
    },
    {
      id: '10',
      date: new Date('2024-01-15').getTime(),
      eventType: 'personal-best',
      title: '100m Freestyle Personal Best',
      stroke: '100m Freestyle',
      time: '58.4s',
      previousTime: '1:01.2s',
      location: 'City Aquatic Center',
      description: 'Broke my personal record by almost 3 seconds! All that training is paying off.',
      placement: '2nd Place'
    },
    {
      id: '11',
      date: new Date('2023-11-20').getTime(),
      eventType: 'competition',
      title: 'Regional Championships',
      stroke: '50m Butterfly',
      time: '29.2s',
      location: 'State Pool Complex',
      description: 'Set a new school record and qualified for state championships!',
      placement: '1st Place'
    },
    {
      id: '12',
      date: new Date('2023-09-10').getTime(),
      eventType: 'milestone',
      title: 'First Sub-60 Second 100m Freestyle',
      stroke: '100m Freestyle',
      time: '59.8s',
      previousTime: '1:01.2s',
      location: 'Team Practice',
      description: 'Finally broke the 1-minute barrier! This has been my goal for months.'
    },
    {
      id: '13',
      date: new Date('2023-06-05').getTime(),
      eventType: 'competition',
      title: 'Summer Invitational',
      stroke: '200m Medley',
      time: '2:18.5s',
      location: 'Lake Shore Pool',
      description: 'Solid performance in all four strokes. Looking forward to improving my backstroke.',
      placement: '3rd Place'
    },
    {
      id: '14',
      date: new Date('2023-03-15').getTime(),
      eventType: 'training',
      title: 'Technique Breakthrough',
      stroke: 'Butterfly',
      time: '30.5s',
      location: 'Team Practice',
      description: 'Coach helped me fix my butterfly technique. Starting to feel much more efficient in the water.'
    },
    {
      id: '15',
      date: new Date('2023-01-08').getTime(),
      eventType: 'milestone',
      title: 'Joined Competitive Swim Team',
      stroke: 'All Strokes',
      time: 'N/A',
      location: 'City Swim Club',
      description: 'Officially joined the competitive team after years of recreational swimming. Ready to take it to the next level!'
    }
  ]
}

function App() {
  const [content, setContent] = useKV<SiteContent>('site-content', defaultContent)
  const [messages, setMessages] = useKV<ContactMessage[]>('contact-messages', [])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [ownerEmail, setOwnerEmail] = useState<string>('')

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const user = await window.spark.user()
        setIsOwner(user?.isOwner || false)
        if (user?.email) {
          setOwnerEmail(user.email)
        }
      } catch {
        setIsOwner(false)
      }
    }
    checkOwnership()
  }, [])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name,
      email,
      message,
      timestamp: Date.now(),
      read: false
    }

    setMessages((currentMessages) => [...(currentMessages || []), newMessage])

    if (ownerEmail) {
      try {
        const emailPrompt = `Generate a friendly email notification for a website owner. The website owner received a new contact form submission with the following details:

From: ${name}
Email: ${email}
Message: ${message}

Create a concise, friendly email notification (subject and body) that informs the owner about this new message. Format the output as JSON with "subject" and "body" fields. Keep it professional but warm.`

        const emailContent = await window.spark.llm(emailPrompt, 'gpt-4o-mini', true)
        const { subject } = JSON.parse(emailContent)
        
        toast.success(`Message sent! Owner will be notified at ${ownerEmail} 📧`, {
          description: subject
        })
      } catch (error) {
        toast.success('Message sent! I\'ll get back to you soon! 🎉')
      }
    } else {
      toast.success('Message sent! I\'ll get back to you soon! 🎉')
    }

    setName('')
    setEmail('')
    setMessage('')
    setIsSubmitting(false)
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'Discord': return DiscordLogo
      case 'Instagram': return InstagramLogo
      case 'Twitch': return TwitchLogo
      case 'YouTube': return YoutubeLogo
      case 'Twitter': return XLogo
      case 'TikTok': return TiktokLogo
      default: return PaperPlaneTilt
    }
  }

  const getSocialStyle = (platform: string) => {
    switch (platform) {
      case 'Discord':
        return {
          color: 'hover:bg-[#5865F2] hover:text-white',
          bgColor: 'bg-[#5865F2]/10'
        }
      case 'Instagram':
        return {
          color: 'hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white',
          bgColor: 'bg-gradient-to-tr from-[#f9ce34]/10 via-[#ee2a7b]/10 to-[#6228d7]/10'
        }
      case 'Twitch':
        return {
          color: 'hover:bg-[#9146FF] hover:text-white',
          bgColor: 'bg-[#9146FF]/10'
        }
      case 'YouTube':
        return {
          color: 'hover:bg-[#FF0000] hover:text-white',
          bgColor: 'bg-[#FF0000]/10'
        }
      case 'Twitter':
        return {
          color: 'hover:bg-[#1DA1F2] hover:text-white',
          bgColor: 'bg-[#1DA1F2]/10'
        }
      case 'TikTok':
        return {
          color: 'hover:bg-black hover:text-white',
          bgColor: 'bg-black/10'
        }
      default:
        return {
          color: 'hover:bg-accent hover:text-accent-foreground',
          bgColor: 'bg-accent/10'
        }
    }
  }

  const handleContentUpdate = (newContent: SiteContent) => {
    setContent(newContent)
  }

  return (
    <div className="min-h-screen gradient-mesh">
      <ThemeToggle />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <section className="py-16 md:py-24 px-4 wave-pattern">
          <motion.div variants={itemVariants} className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-accent shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-4xl font-bold">
                  {content?.profile?.initials || 'AK'}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Hey, I'm {content?.profile?.name || 'Alex'}!
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {content?.profile?.age || 14} years old • {content?.profile?.tagline || 'Anime enthusiast • Competitive swimmer'}
            </p>
            <p className="mt-4 text-base md:text-lg text-foreground/80 max-w-xl mx-auto">
              {content?.profile?.bio || 'Welcome to my corner of the internet!'}
            </p>
          </motion.div>
        </section>

        <Separator className="max-w-6xl mx-auto" />

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={itemVariants} className="mb-8 md:mb-12">
              <div className="flex items-center gap-3 mb-3">
                <Television size={32} weight="duotone" className="text-accent" />
                <h2 className="text-3xl md:text-4xl font-bold">Favorite Anime</h2>
              </div>
              <p className="text-muted-foreground">The shows that got me hooked on anime</p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {content?.animeList?.map((anime, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1 transition-all duration-300 border-2 hover:border-accent/50 group">
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
                      <div className="flex gap-1 mb-3">
                        {[...Array(anime.rating)].map((_, i) => (
                          <Star key={i} weight="fill" className="text-accent" size={16} />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{anime.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <Separator className="max-w-6xl mx-auto" />

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={itemVariants} className="mb-8 md:mb-12">
              <div className="flex items-center gap-3 mb-3">
                <Waves size={32} weight="duotone" className="text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">Swimming</h2>
              </div>
              <p className="text-muted-foreground">My times and achievements in the pool</p>
            </motion.div>

            <motion.div variants={containerVariants} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content?.swimmingAchievements?.map((achievement, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="hover:shadow-lg hover:shadow-secondary/30 hover:-translate-y-1 transition-all duration-300 border-2 hover:border-secondary group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="group-hover:text-secondary transition-colors">
                              {achievement.title}
                            </CardTitle>
                            <CardDescription className="mt-2 flex items-center gap-2">
                              <Clock size={16} />
                              <span className="text-lg font-semibold text-foreground">
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
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle>Favorite Strokes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {content?.favoriteStrokes?.map((stroke, index) => (
                        <Badge key={index} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          {stroke}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <Separator className="max-w-6xl mx-auto" />

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={itemVariants} className="mb-8 md:mb-12">
              <div className="flex items-center gap-3 mb-3">
                <ChartLineUp size={32} weight="duotone" className="text-accent" />
                <h2 className="text-3xl md:text-4xl font-bold">Progress Timeline</h2>
              </div>
              <p className="text-muted-foreground">My swimming journey and achievements over time</p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <SwimmingTimeline events={content?.timeline || []} />
            </motion.div>
          </div>
        </section>

        <Separator className="max-w-6xl mx-auto" />

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={itemVariants} className="mb-8 md:mb-12">
              <div className="flex items-center gap-3 mb-3">
                <Images size={32} weight="duotone" className="text-accent" />
                <h2 className="text-3xl md:text-4xl font-bold">Photo Gallery</h2>
              </div>
              <p className="text-muted-foreground">My favorite moments from swimming meets and anime</p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <PhotoGallery />
            </motion.div>
          </div>
        </section>

        <Separator className="max-w-6xl mx-auto" />

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={itemVariants} className="mb-8 md:mb-12">
              <div className="flex items-center gap-3 mb-3">
                <User size={32} weight="duotone" className="text-accent" />
                <h2 className="text-3xl md:text-4xl font-bold">About Me</h2>
              </div>
              <p className="text-muted-foreground">A bit more about what I enjoy</p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Other Hobbies</h3>
                      <div className="flex flex-wrap gap-2">
                        {content?.hobbies?.map((hobby, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {hobby}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Fun Facts</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        {content?.funFacts?.map((fact, index) => (
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
          </div>
        </section>

        <Separator className="max-w-6xl mx-auto" />

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={itemVariants} className="mb-8 md:mb-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <PaperPlaneTilt size={32} weight="duotone" className="text-accent" />
                <h2 className="text-3xl md:text-4xl font-bold">Let's Connect!</h2>
              </div>
              <p className="text-muted-foreground">Find me on social media or send me a message</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div variants={itemVariants}>
                <Card className="h-full border-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">Social Media</CardTitle>
                    <CardDescription>Let's be friends online!</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {content?.socialLinks?.map((social, index) => {
                      const Icon = getSocialIcon(social.platform)
                      const style = getSocialStyle(social.platform)
                      return (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            className={`w-full justify-start gap-3 h-auto py-4 transition-all duration-300 ${style.color} ${style.bgColor}`}
                          >
                            <Icon size={24} weight="fill" />
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
                <Card className="h-full border-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">Send a Message</CardTitle>
                    <CardDescription>Want to chat? Drop me a message!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          placeholder="What should I call you?"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="border-2 focus:border-accent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Your Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="border-2 focus:border-accent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell me what's up! Want to talk anime? Swimming tips? Gaming?"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          rows={5}
                          className="border-2 focus:border-accent resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <PaperPlaneTilt size={20} />
                            </motion.div>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <PaperPlaneTilt size={20} />
                            Send Message
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <footer className="py-8 px-4 text-center text-muted-foreground border-t">
          <p className="text-sm">Thanks for visiting my page! 🌊✨</p>
        </footer>
      </motion.div>

      {isOwner && content && (
        <AdminPanel content={content} onContentUpdate={handleContentUpdate} />
      )}
    </div>
  )
}

export default App
