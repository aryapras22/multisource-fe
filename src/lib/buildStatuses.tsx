import { Smartphone, Newspaper, MessageSquare } from "lucide-react"
import type { ReactNode } from "react"

export interface BuildStatusesArgs {
  appsLoaded: boolean
  appsMeta: string
  newsLoaded: boolean
  newsMeta: string
  socialLoaded: boolean
  socialMeta: string
}

export interface Status {
  label: string
  icon: ReactNode
  loaded: boolean
  meta: string
}

export function buildStatuses({
  appsLoaded,
  appsMeta,
  newsLoaded,
  newsMeta,
  socialLoaded,
  socialMeta
}: BuildStatusesArgs): Status[] {
  return [
    {
      label: "App Reviews",
      icon: <Smartphone className="h-4 w-4" />,
      loaded: appsLoaded,
      meta: appsMeta
    },
    {
      label: "Industry News",
      icon: <Newspaper className="h-4 w-4" />,
      loaded: newsLoaded,
      meta: newsMeta
    },
    {
      label: "Social Media",
      icon: <MessageSquare className="h-4 w-4" />,
      loaded: socialLoaded,
      meta: socialMeta
    }
  ]
}