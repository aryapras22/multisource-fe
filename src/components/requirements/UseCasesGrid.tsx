/**
 * Tab content for use cases (responsive grid).
 */

import type { UseCase } from "@/types/requirements"
import { UseCaseCard } from "./UseCaseCard"

interface Props {
  useCases: UseCase[]
}

export function UseCasesGrid({ useCases }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {useCases.map(uc => (
        <UseCaseCard key={uc.id} useCase={uc} />
      ))}
    </div>
  )
}