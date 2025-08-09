import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export interface SectionStatus {
  label: string
  icon: React.ReactNode   // CHANGED from Element
  loaded: boolean
  meta: string
}

/**
 * Generic progress summary widget for the three collection domains.
 */
export function CollectionProgress(props: { statuses: SectionStatus[] }) {
  return (
    <Card className="border border-gray-200 shadow-sm mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-black">Collection Progress</CardTitle>
        <CardDescription>
          Track your data collection progress across all configured sources.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {props.statuses.map(s => (
            <div key={s.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black flex items-center gap-2">
                  {s.icon}
                  {s.label}
                </span>
                <Badge className={s.loaded ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {s.loaded ? "Complete" : "Pending"}
                </Badge>
              </div>
              <Progress value={s.loaded ? 100 : 0} className="h-2" />
              <p className="text-xs text-gray-500">{s.meta}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}