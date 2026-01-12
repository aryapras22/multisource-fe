import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { User, Star, Trash2, Clipboard, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { AppReview } from "@/types/collections"
import { useMemo, useState } from "react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

/**
 * Renders a grid of collected app reviews.
 */
export function ReviewsList({ reviews, onDeleteReview }: { reviews: AppReview[]; onDeleteReview?: (id: string) => Promise<void> }) {
  const [starFilter, setStarFilter] = useState<number[]>([]) // empty = all
  const [appFilter, setAppFilter] = useState<string[]>([]) // empty = all
  const [sampledReviews, setSampledReviews] = useState<AppReview[] | null>(null)
  const [sampleCopying, setSampleCopying] = useState(false)
  const [sampleCopied, setSampleCopied] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copyingId, setCopyingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

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
    setSampledReviews(null)
  }

  const pickRandom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

  const copySampleContent = async (source: AppReview[]) => {
    if (!source || !source.length) return
    // Build numbered plain-text list of reviews
    const items = source.map((r, i) => `${i + 1}. ${r.review}`)
    const content = items.join('\n\n')
    try {
      setSampleCopying(true)
      await navigator.clipboard.writeText(content)
      setSampleCopied(true)
      setTimeout(() => setSampleCopied(false), 2000)
    } catch (err) {
      alert(`Failed to copy sample: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSampleCopying(false)
    }
  }

  const handleGenerateSample = async () => {
    const input = prompt("Enter sample size (integer). Must be large enough to cover all apps and 1-5 stars.")
    if (input === null) return
    const n = parseInt(input, 10)
    if (Number.isNaN(n) || n <= 0) {
      alert("Invalid sample size")
      return
    }

    const apps = Array.from(new Set(reviews.map(r => r.app_id).filter(Boolean))).sort()

    // Check we have at least one review for each star 1-5 in the dataset
    const starsAvailable = new Set(reviews.map(r => Math.round(r.rating)))
    const missingStars = [1, 2, 3, 4, 5].filter(s => !starsAvailable.has(s))
    if (missingStars.length) {
      alert(`Cannot create stratified sample: no reviews with star(s): ${missingStars.join(", ")}`)
      return
    }

    const minRequired = Math.max(apps.length, 5)
    if (n < minRequired) {
      alert(`Sample size too small. Need at least ${minRequired} to represent all apps and 1-5 stars.`)
      return
    }

    const byId = new Map<string, AppReview>()

    // Ensure at least one from every app
    for (const appId of apps) {
      const pool = reviews.filter(r => r.app_id === appId)
      if (pool.length) {
        const chosen = pickRandom(pool)
        byId.set(chosen._id, chosen)
      }
    }

    // Ensure at least one of each star
    for (let s = 1; s <= 5; s++) {
      const pool = reviews.filter(r => Math.round(r.rating) === s && !byId.has(r._id))
      if (pool.length) {
        const chosen = pickRandom(pool)
        byId.set(chosen._id, chosen)
      }
    }

    // Fill remainder randomly
    const remaining = reviews.filter(r => !byId.has(r._id))
    // shuffle remaining (Fisher-Yates)
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = remaining[i]
      remaining[i] = remaining[j]
      remaining[j] = tmp
    }

    for (const r of remaining) {
      if (byId.size >= n) break
      byId.set(r._id, r)
    }

    const sample = Array.from(byId.values()).slice(0, n)
    setSampledReviews(sample)
    // Auto-copy the sample content once generated
    try {
      await copySampleContent(sample)
    } catch (_) {
      // ignore - copySampleContent handles errors
    }
  }

  const handleDeleteReview = async (reviewId: string, reviewText: string) => {
    if (!onDeleteReview) return

    const reviewPreview = reviewText.length > 50 ? reviewText.substring(0, 50) + '...' : reviewText
    if (!confirm(`Delete review "${reviewPreview}"?\n\nThis action cannot be undone.`)) {
      return
    }

    setDeletingId(reviewId)
    try {
      await onDeleteReview(reviewId)
    } catch (error) {
      alert(`Failed to delete review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const handleCopyReview = async (reviewId: string, reviewText: string) => {
    try {
      setCopyingId(reviewId)
      await navigator.clipboard.writeText(reviewText)
      setCopiedId(reviewId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      alert(`Failed to copy review text: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setCopyingId(null)
    }
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
            <Button variant="outline" size="sm" onClick={handleGenerateSample}>
              Generate Random Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => sampledReviews && copySampleContent(sampledReviews)}
              disabled={!sampledReviews || sampleCopying}
            >
              {sampleCopied ? "Copied" : "Copy Sample"}
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
            {sampledReviews ? (
              <>Showing {filteredReviews.length} of {sampledReviews.length} sampled reviews (total {reviews.length})</>
            ) : (
              <>Showing {filteredReviews.length} of {reviews.length} reviews</>
            )}
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
                  {onDeleteReview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReview(r._id, r.review)}
                      disabled={deletingId === r._id}
                      className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-700 text-red-600 disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyReview(r._id, r.review)}
                    disabled={copyingId === r._id}
                    className="h-6 w-6 p-0 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                    aria-label="Copy review text"
                  >
                    {copiedId === r._id ? <Check className="h-3 w-3 text-green-600" /> : <Clipboard className="h-3 w-3" />}
                  </Button>
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