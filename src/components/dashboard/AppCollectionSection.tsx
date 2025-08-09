import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { AppCard } from "./AppCard"
import type { UseAppsCollection } from "@/hooks/useAppsCollection"
import { ReviewsList } from "./ReviewsList"
import { useState } from "react"


/**
 * Orchestrates the apps + reviews sub-workflow.
 */
export function AppCollectionSection({ logic }: { logic: UseAppsCollection }) {
  const {
    apps,
    reviews,
    appCount,
    setAppCount,
    reviewsPerApp,
    setReviewsPerApp,
    findApps,
    getReviewsForApp,
    getReviewsForAll,
    reviewsLoadingId
  } = logic

  const [storeFilter, setStoreFilter] = useState<"all" | "apple" | "google">("all")

  if (!apps.loaded) {
    return (
      <Card className="border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold text-black">Find Matching Apps</CardTitle>
          <CardDescription>Search app stores for applications related to your project queries.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="app-count" className="text-sm font-medium">
                Number of apps:
              </Label>
              <Input
                id="app-count"
                type="number"
                min={1}
                max={20}
                value={appCount}
                onChange={e => setAppCount(parseInt(e.target.value) || 5)}
                className="w-20 text-center"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="reviews-per-app" className="text-sm font-medium">
                Reviews per app:
              </Label>
              <Input
                id="reviews-per-app"
                type="number"
                min={1}
                max={100}
                value={reviewsPerApp}
                onChange={e => setReviewsPerApp(parseInt(e.target.value) || 20)}
                className="w-20 text-center"
              />
            </div>
          </div>
          <Button
            onClick={findApps}
            disabled={apps.loading}
            className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400"
          >
            {apps.loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching App Stores...
              </>
            ) : (
              `Find ${appCount} Matching Apps`
            )}
          </Button>
          {apps.loading && (
            <p className="text-sm text-gray-500 mt-4">
              This may take a few minutes as we search across multiple app stores...
            </p>
          )}
          {apps.error && <p className="text-sm text-red-600">{apps.error}</p>}

        </CardContent>
      </Card>
    )
  }

  const filteredApps = apps.items.filter(a => storeFilter === "all" || a.store === storeFilter)

  return (
    <div className="space-y-2">
      <div className="py-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={storeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStoreFilter("all")}
          >
            All
          </Button>
          <Button
            variant={storeFilter === "apple" ? "default" : "outline"}
            size="sm"
            onClick={() => setStoreFilter("apple")}
          >
            iOS
          </Button>
          <Button
            variant={storeFilter === "google" ? "default" : "outline"}
            size="sm"
            onClick={() => setStoreFilter("google")}
          >
            Android
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Showing {filteredApps.length} of {apps.items.length} apps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map(a => (
          <AppCard
            key={a._id}
            app={a}
            reviewsPerApp={reviewsPerApp}
            onGetReviews={() => getReviewsForApp(a.appId, a.store)}
            reviewsLoading={reviewsLoadingId === a._id}
          />
        ))}
      </div>

      {apps.items.length > 0 && !apps.items.every(a => a.reviewsCollected) && (
        <Card className="border border-gray-200">
          <CardContent className="text-center py-6">
            <Button
              onClick={getReviewsForAll}
              disabled={!!reviewsLoadingId}
              className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400"
            >
              {reviewsLoadingId ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting {reviewsPerApp} Reviews for All Apps...
                </>
              ) : (
                `Get ${reviewsPerApp} Reviews for All Apps`
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <ReviewsList reviews={reviews.items} />
      {reviews.error && <p className="text-sm text-red-600">{reviews.error}</p>}
    </div>
  )
}