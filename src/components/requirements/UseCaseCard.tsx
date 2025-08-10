/**
 * Single use case diagram card.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UseCase } from "@/types/requirements"

interface Props {
  useCase: UseCase
}

export function UseCaseCard({ useCase }: Props) {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className="font-mono text-xs">
            {useCase.id}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold text-black">{useCase.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-64 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 p-4 flex items-center justify-center">
          <img
            src={useCase.diagramUrl || "/placeholder.svg"}
            alt={`Use case diagram for ${useCase.title}`}
            className="object-contain w-full h-full"
            crossOrigin="anonymous"
          />
        </div>
      </CardContent>
    </Card>
  )
}