import { motion, Variants } from 'framer-motion'
import { Television, Waves, User, Star, Trophy, Clock, DiscordLogo, InstagramLogo, TwitchLogo, YoutubeLogo, PaperPlaneTilt } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from 'sonner'

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.success('Message sent! I\'ll get back to you soon! 🎉')
    setName('')
    setEmail('')
    setMessage('')
    setIsSubmitting(false)
  }

  const socialLinks = [
    {
      name: 'Discord',
      icon: DiscordLogo,
      username: 'AlexSwims#1234',
      color: 'hover:bg-[#5865F2] hover:text-white',
      bgColor: 'bg-[#5865F2]/10'
    },
    {
      name: 'Instagram',
      icon: InstagramLogo,
      username: '@alexswims_anime',
      color: 'hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white',
      bgColor: 'bg-gradient-to-tr from-[#f9ce34]/10 via-[#ee2a7b]/10 to-[#6228d7]/10'
    },
    {
      name: 'Twitch',
      icon: TwitchLogo,
      username: 'alexswims',
      color: 'hover:bg-[#9146FF] hover:text-white',
      bgColor: 'bg-[#9146FF]/10'
    },
    {
      name: 'YouTube',
      icon: YoutubeLogo,
      username: '@AlexSwimming',
      color: 'hover:bg-[#FF0000] hover:text-white',
      bgColor: 'bg-[#FF0000]/10'
    }
  ]

  const animeList = [
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
  ]

  const swimmingAchievements = [
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
  ]

  const favoriteStrokes = ["Freestyle", "Butterfly", "Backstroke"]
  
  const hobbies = ["Gaming", "Drawing", "Reading Manga", "Listening to Music"]

  return (
    <div className="min-h-screen gradient-mesh">
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
                  AK
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Hey, I'm Alex!
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              14 years old • Anime enthusiast • Competitive swimmer
            </p>
            <p className="mt-4 text-base md:text-lg text-foreground/80 max-w-xl mx-auto">
              Welcome to my corner of the internet! I love diving into epic anime series and making waves in the pool.
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
              {animeList.map((anime, index) => (
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
                {swimmingAchievements.map((achievement, index) => (
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
                      {favoriteStrokes.map((stroke, index) => (
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
                        {hobbies.map((hobby, index) => (
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
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span>I've been swimming competitively for 5 years</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span>My dream is to visit Japan and see anime studios</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span>I practice swimming 5 days a week</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span>I started watching anime when I was 11</span>
                        </li>
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
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon
                      return (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            className={`w-full justify-start gap-3 h-auto py-4 transition-all duration-300 ${social.color} ${social.bgColor}`}
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
    </div>
  )
}

export default App
