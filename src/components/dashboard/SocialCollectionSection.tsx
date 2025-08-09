import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { SocialPostCard } from "./SocialPostCard"
import type { UseSocialCollection } from "@/hooks/useSocialCollection"

/**
 * Manages the social media scraping UI workflow.
 */
export function SocialCollectionSection({ logic }: { logic: UseSocialCollection }) {
  const { social, socialCount, setSocialCount, scrapeSocial } = logic

  if (!social.loaded) {
    return (
      <Card className="border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold text-black">Scrape Twitter/X Posts</CardTitle>
          <CardDescription>Analyze social media discussions.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="social-count" className="text-sm font-medium">
              Number of posts:
            </Label>
            <Input
              id="social-count"
              type="number"
              min={1}
              max={100}
              value={socialCount}
              onChange={e => setSocialCount(parseInt(e.target.value) || 15)}
              className="w-20 text-center"
            />
          </div>
          <Button
            onClick={scrapeSocial}
            disabled={social.loading}
            className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400"
          >
            {social.loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scraping Posts...
              </>
            ) : (
              `Scrape ${socialCount} Posts`
            )}
          </Button>
          {social.loading && (
            <p className="text-sm text-gray-500 mt-4">
              Collecting posts and extracting metadata...
            </p>
          )}
          {social.error && <p className="text-sm text-red-600">{social.error}</p>}

        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {social.items.map(p => (
        <SocialPostCard key={p._id} post={p} />
      ))}
    </div>
  )
}