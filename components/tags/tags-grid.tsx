"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Tag } from "@/lib/types"

type SortOption = "popular" | "name" | "newest"

interface TagsGridProps {
  initialTags: Tag[]
}

export function TagsGrid({ initialTags }: TagsGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("popular")

  const filteredTags = initialTags
    .filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          return 0 // In production, sort by creation date
        case "popular":
        default:
          return b.count - a.count
      }
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tags</h1>
        <p className="mt-1 text-muted-foreground">
          A tag is a keyword or label that categorizes your question. Using the right tags makes it easier for others to
          find and answer your question.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter by tag name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="name">Name</TabsTrigger>
            <TabsTrigger value="newest">New</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tags Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${tag.name}`}
            className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <div className="space-y-2">
              <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary transition-colors group-hover:bg-primary/20">
                {tag.name}
              </span>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {tag.description || `Questions about ${tag.name}`}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{tag.count.toLocaleString()}</span> questions
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredTags.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No tags found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}
