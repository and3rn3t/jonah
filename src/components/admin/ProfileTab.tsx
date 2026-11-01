import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { ContentTabProps } from '@/components/admin/types'

export function ProfileTab({ content, setContent }: ContentTabProps) {
  return (
    <TabsContent value="profile" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your basic info displayed in the hero section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={content.profile?.name || ''}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, name: e.target.value },
                  }))
                }
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={content.profile?.age || ''}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, age: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="14"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={content.profile?.tagline || ''}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, tagline: e.target.value },
                }))
              }
              placeholder="Anime enthusiast • Competitive swimmer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={content.profile?.bio || ''}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, bio: e.target.value },
                }))
              }
              placeholder="Welcome to my corner of the internet!"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="initials">Avatar Initials</Label>
            <Input
              id="initials"
              value={content.profile?.initials || ''}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    initials: e.target.value.slice(0, 2).toUpperCase(),
                  },
                }))
              }
              placeholder="AK"
              maxLength={2}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
