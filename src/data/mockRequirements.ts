/**
 * Mock data for development & UI scaffolding.
 * Replace with real API integration later.
 */

import type { GenerationStep, UserStory, UseCase } from "@/types/requirements"


export const generationSteps: GenerationStep[] = [
  { name: "Analyzing App Data", description: "Processing collected app reviews and features" },
  { name: "Processing News Articles", description: "Extracting insights from industry trends" },
  { name: "Analyzing Social Media", description: "Understanding user sentiment and discussions" },
  { name: "Generating User Stories", description: "Creating user-centered requirements" },
  { name: "Creating Use Cases", description: "Defining system interactions and workflows" },
  { name: "Finalizing Requirements", description: "Organizing and structuring output" }
]

export const mockUserStories: UserStory[] = [
  {
    _id: "US-001",
    title: "User can filter reviews by star rating", // This title is now ignored for the main card display
    who: "a user",
    what: "filter reviews by star rating",
    why: "I can quickly find reviews that are most relevant to my needs",
    sources: {
      // Now a single object
      type: "review",
      title: "App Store Review",
      author: "AppLover22",
      content: "It would be great if I could filter reviews by 4 or 5 stars to see only the best feedback.",
      rating: 4,
    },
  },
  {
    _id: "US-002",
    title: "User can view product details", // This title is now ignored for the main card display
    who: "a shopper",
    what: "view detailed information about a product",
    why: null, // No 'why' provided
    sources: {
      // Now a single object
      type: "news",
      title: "E-commerce Best Practices",
      content: "Clear product descriptions are crucial for online sales.",
    },
  }
]

export const mockUseCases: UseCase[] = [
  {
    id: "UC001",
    title: "Generate AI-Powered Meal Plan",
    diagramUrl: "/placeholder.svg?height=400&width=600&text=Use+Case+Diagram:+Generate+AI-Powered+Meal+Plan"
  },
  {
    id: "UC002",
    title: "Scan and Identify Ingredients",
    diagramUrl: "/placeholder.svg?height=400&width=600&text=Use+Case+Diagram:+Scan+and+Identify+Ingredients"
  },
  {
    id: "UC003",
    title: "Manage Dietary Restrictions",
    diagramUrl: "/placeholder.svg?height=400&width=600&text=Use+Case+Diagram:+Manage+Dietary+Restrictions"
  },
  {
    id: "UC004",
    title: "Generate Shopping List",
    diagramUrl: "/placeholder.svg?height=400&width=600&text=Use+Case+Diagram:+Generate+Shopping+List"
  }
]