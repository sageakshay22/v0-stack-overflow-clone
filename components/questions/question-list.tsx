"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuestionCard } from "./question-card"
import type { Question } from "@/lib/types"

type SortOption = "newest" | "votes" | "unanswered"

interface QuestionListProps {
  initialQuestions: Question[]
}

export function QuestionList({ initialQuestions }: QuestionListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("newest")

  const sortedQuestions = [...initialQuestions].sort((a, b) => {
    switch (sortBy) {
      case "votes":
        return b.vote_count - a.vote_count
      case "unanswered":
        return a.answer_count - b.answer_count
      case "newest":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Questions</h1>
          <p className="text-sm text-muted-foreground">{initialQuestions.length.toLocaleString()} questions</p>
        </div>
        <Button asChild>
          <Link href="/ask">Ask Question</Link>
        </Button>
      </div>

      {/* Sort Tabs */}
      <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
        <TabsList>
          <TabsTrigger value="newest">Newest</TabsTrigger>
          <TabsTrigger value="votes">Most Votes</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Question Cards */}
      {sortedQuestions.length > 0 ? (
        <div className="divide-y divide-border rounded-lg border border-border">
          {sortedQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-lg font-medium text-foreground">No questions yet</p>
          <p className="mt-1 text-muted-foreground">Be the first to ask a question!</p>
          <Button asChild className="mt-4">
            <Link href="/ask">Ask Question</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
