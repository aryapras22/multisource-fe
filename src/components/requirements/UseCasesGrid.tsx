import { mapUseCaseGeneration } from "@/types/requirements"
import { UseCaseCard } from "./UseCaseCard"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DiagramsGrid({ data }: { data: any }) {
  const generation = mapUseCaseGeneration(data)
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {generation.diagrams.map(d => (
        <UseCaseCard
          key={d.part}
          diagram={d}
          projectId={generation.projectId}
          showProject
        />
      ))}
    </div>
  )
}