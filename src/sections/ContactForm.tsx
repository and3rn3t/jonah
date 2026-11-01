import { useState } from 'react'
import { motion } from 'motion/react'
import { PaperPlaneTilt } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!response.ok) {
        const { error } = (await response.json().catch(() => ({}))) as { error?: string }
        toast.error(error ?? "Couldn't send your message. Please try again.")
        return
      }
    } catch {
      toast.error("Couldn't send your message. Please check your connection.")
      return
    } finally {
      setIsSubmitting(false)
    }

    toast.success("Message sent! I'll get back to you soon! 🎉")
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
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
              className="focus:border-accent border-2"
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
              className="focus:border-accent border-2"
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
              className="focus:border-accent resize-none border-2"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-accent hover:bg-accent/90 text-accent-foreground w-full font-semibold"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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
  )
}
