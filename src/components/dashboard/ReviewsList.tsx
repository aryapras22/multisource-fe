import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { User, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { AppReview } from "@/types/collections"

/**
 * Renders a grid of collected app reviews.
 */
export function ReviewsList({ reviews }: { reviews: AppReview[] }) {
  if (!reviews.length) return null
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-black">Collected Reviews</CardTitle>
        <CardDescription>User feedback from app store reviews.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map(r => (
            <div key={r._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-black text-sm">{r.reviewer}</span>
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