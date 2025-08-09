import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { User, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { AppReview } from "@/types/collections"
import { useMemo, useState } from "react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

/**
 * Renders a grid of collected app reviews.
 */
export function ReviewsList({ reviews }: { reviews: AppReview[] }) {
  const [starFilter, setStarFilter] = useState<number[]>([]) // empty = all
  const [appFilter, setAppFilter] = useState<string[]>([]) // empty = all

  const starOptions = [1, 2, 3, 4, 5]

  const appIds = useMemo(
    () => Array.from(new Set(reviews.map(r => r.app_id).filter(Boolean))).sort(),
    [reviews]
  )

  const toggleStar = (s: number) => {
    setStarFilter(curr =>
      curr.includes(s) ? curr.filter(v => v !== s) : [...curr, s]
    )
  }

  const toggleApp = (id: string) => {
    setAppFilter(curr =>
      curr.includes(id) ? curr.filter(v => v !== id) : [...curr, id]
    )
  }

  const resetFilters = () => {
    setStarFilter([])
    setAppFilter([])
  }

  const filteredReviews = useMemo(() => {
    let list = reviews
    if (starFilter.length) {
      list = list.filter(r => starFilter.includes(Math.round(r.rating)))
    }
    if (appFilter.length) {
      list = list.filter(r => appFilter.includes(r.app_id))
    }
    return list
  }, [reviews, starFilter, appFilter])

  if (!reviews.length) return null
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-black">Collected Reviews</CardTitle>
        <CardDescription>User feedback from app store reviews.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {starOptions.map((s) => (
              <Button
                key={s}
                variant="outline"
                size="sm"
                onClick={() => toggleStar(s)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors",
                  starFilter.includes(s)
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-background text-muted-foreground border-input hover:bg-muted hover:text-foreground",
                )}
              >
                <Star
                  className={cn(
                    "h-4 w-4 transition-colors",
                    starFilter.includes(s) ? "fill-yellow-400 text-yellow-400" : "fill-muted-foreground",
                  )}
                />
                <span>{s}</span>
              </Button>
            ))}
          </div>

          {appIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {appIds.map(id => (
                <Button
                  key={id}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleApp(id)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium",
                    appFilter.includes(id)
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-background text-muted-foreground border-input hover:bg-muted hover:text-foreground"
                  )}
                >
                  {id}
                </Button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset
            </Button>
            {(starFilter.length > 0 || appFilter.length > 0) && (
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {starFilter.length > 0 && `${starFilter.length} star filter${starFilter.length > 1 ? "s" : ""}`}
                {starFilter.length > 0 && appFilter.length > 0 && " • "}
                {appFilter.length > 0 && `${appFilter.length} app filter${appFilter.length > 1 ? "s" : ""}`}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((r) => (
            <div key={r._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-black text-sm">{r.reviewer}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    App: {r.app_id || "unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {r.store === "apple" ? "iOS" : "Android"}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{r.rating}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700">{r.review}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}