import type { Dispatch, SetStateAction } from 'react'
import type { SiteContent } from '@/lib/types'

/** Tabs that edit the draft `SiteContent`, saved by AdminPanel's "Save All Changes". */
export interface ContentTabProps {
  content: SiteContent
  setContent: Dispatch<SetStateAction<SiteContent>>
}
