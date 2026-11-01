import { LockKey } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'

interface SettingsTabProps {
  onLock: () => void
}

export function SettingsTab({ onLock }: SettingsTabProps) {
  return (
    <TabsContent value="settings" className="mt-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockKey size={24} weight="duotone" className="text-accent" />
            Admin Access
          </CardTitle>
          <CardDescription>
            The admin password is set on the server. To change it, run{' '}
            <code className="bg-muted rounded px-1.5 py-0.5">
              wrangler pages secret put ADMIN_TOKEN
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={onLock} className="gap-2">
            <LockKey size={18} weight="bold" />
            Lock admin panel
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
