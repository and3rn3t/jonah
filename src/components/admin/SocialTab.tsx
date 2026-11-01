import { Plus, Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TabsContent } from '@/components/ui/tabs'
import type { ContentTabProps } from '@/components/admin/types'

export function SocialTab({ content, setContent }: ContentTabProps) {
  const addSocialLink = () => {
    setContent((prev) => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), { name: '', platform: 'Discord', username: '' }],
    }))
  }

  const updateSocialLink = (index: number, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      socialLinks:
        prev.socialLinks?.map((link, i) => (i === index ? { ...link, [field]: value } : link)) ||
        [],
    }))
  }

  const deleteSocialLink = (index: number) => {
    setContent((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks?.filter((_, i) => i !== index) || [],
    }))
  }

  return (
    <TabsContent value="social" className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Social Media Links</h3>
          <p className="text-muted-foreground text-sm">Your social profiles</p>
        </div>
        <Button onClick={addSocialLink} className="gap-2">
          <Plus size={18} weight="bold" />
          Add Link
        </Button>
      </div>

      <div className="space-y-4">
        {content.socialLinks?.map((link, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold">Social Link #{index + 1}</h4>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => deleteSocialLink(index)}
                >
                  <Trash size={16} />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select
                    value={link.platform}
                    onValueChange={(value) => updateSocialLink(index, 'platform', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Discord">Discord</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Twitch">Twitch</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    value={link.name}
                    onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                    placeholder="Discord"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={link.username}
                    onChange={(e) => updateSocialLink(index, 'username', e.target.value)}
                    placeholder="@username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  )
}
