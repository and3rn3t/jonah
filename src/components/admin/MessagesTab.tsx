import { Trash, Envelope } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import type { ContactMessage } from '@/lib/types'

interface MessagesTabProps {
  messages: ContactMessage[]
  setMessages: (update: (current: ContactMessage[]) => ContactMessage[]) => void
  unreadCount: number
}

export function MessagesTab({ messages, setMessages, unreadCount }: MessagesTabProps) {
  const markMessageAsRead = (messageId: string) => {
    setMessages((currentMessages) =>
      (currentMessages || []).map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
    )
  }

  const deleteMessage = (messageId: string) => {
    setMessages((currentMessages) => (currentMessages || []).filter((msg) => msg.id !== messageId))
    toast.success('Message deleted')
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <TabsContent value="messages" className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Envelope size={24} weight="duotone" className="text-accent" />
            Contact Messages
          </h3>
          <p className="text-muted-foreground text-sm">
            {unreadCount > 0
              ? `${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`
              : 'All caught up!'}
          </p>
        </div>
      </div>

      {messages && messages.length > 0 ? (
        <div className="space-y-4">
          {[...messages].reverse().map((msg) => (
            <Card
              key={msg.id}
              className={`${!msg.read ? 'border-accent/50 bg-accent/5 border-2' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {msg.name}
                      {!msg.read && <Badge className="bg-accent text-accent-foreground">New</Badge>}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <a href={`mailto:${msg.email}`} className="text-primary hover:underline">
                        {msg.email}
                      </a>
                    </CardDescription>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatTimestamp(msg.timestamp)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteMessage(msg.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                {!msg.read && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => markMessageAsRead(msg.id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed p-12 text-center">
          <div className="mb-4 text-6xl">📭</div>
          <p className="text-muted-foreground mb-2 text-lg">No messages yet</p>
          <p className="text-muted-foreground text-sm">
            Messages from your contact form will appear here
          </p>
        </Card>
      )}
    </TabsContent>
  )
}
