import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ExternalLink, Loader2, CheckCircle } from "lucide-react"
import type { App } from "@/types/collections"

interface AppCardProps {
  app: App
  reviewsPerApp: number
  onGetReviews: (id: string | number) => void
  reviewsLoading: boolean
}

/**
 * Single app display card with action to fetch reviews.
 */
export function AppCard({ app, reviewsPerApp, onGetReviews, reviewsLoading }: AppCardProps) {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
            <img src={app.icon} alt={app.appName} className="object-cover w-full h-full" crossOrigin="anonymous" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-bold text-black line-clamp-2 mb-1">
              {app.appName}
            </CardTitle>
            <p className="text-xs text-gray-600 mb-2">{app.developer}</p>
            <p className="text-xs text-gray-600 mb-2">ID: {app.appId}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{app.ratingScore}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {app.store === "apple" ? "iOS" : "Android"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-gray-700 line-clamp-2">{app.app_desc}</p>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full h-8 text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
          >
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-3 w-3" />
              View App
            </a>
          </Button>
          <Button
            onClick={() => onGetReviews(app.appId)}
            disabled={app.reviewsCollected || reviewsLoading}
            className="w-full h-8 text-xs bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400"
          >
            {reviewsLoading ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Getting {reviewsPerApp} Reviews...
              </>
            ) : app.reviewsCollected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-2" />
                Reviews Collected
              </>
            ) : (
              `Get ${reviewsPerApp} Reviews`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}