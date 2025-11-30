"use client"

import { useState } from "react"
import { Edit, Flag, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VoteButtons } from "@/components/ui/vote-buttons"
import { UserCard } from "@/components/ui/user-card"
import { MarkdownContent } from "@/components/ui/markdown-content"
import type { Answer } from "@/lib/types"
import { cn } from "@/lib/utils"
import { acceptAnswer } from "@/lib/actions"

interface AnswerListProps {
  answers: Answer[]
  questionOwnerId: string
  questionId: string
  currentUserId?: string | null
}

type SortOption = "votes" | "newest" | "oldest"

export function AnswerList({ answers, questionOwnerId, questionId, currentUserId }: AnswerListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("votes")
  const isQuestionOwner = currentUserId === questionOwnerId

  const sortedAnswers = [...answers].sort((a, b) => {
    // Always show accepted answer first
    if (a.is_accepted && !b.is_accepted) return -1
    if (!a.is_accepted && b.is_accepted) return 1

    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case "votes":
      default:
        return b.vote_count - a.vote_count
    }
  })

  if (answers.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No answers yet. Be the first to answer this question!</p>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
        </h2>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="votes">Highest score</SelectItem>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Answers */}
      <div className="divide-y divide-border rounded-lg border border-border">
        {sortedAnswers.map((answer) => (
          <AnswerItem key={answer.id} answer={answer} isQuestionOwner={isQuestionOwner} questionId={questionId} />
        ))}
      </div>
    </section>
  )
}

interface AnswerItemProps {
  answer: Answer
  isQuestionOwner: boolean
  questionId: string
}

function AnswerItem({ answer, isQuestionOwner, questionId }: AnswerItemProps) {
  const [isAccepted, setIsAccepted] = useState(answer.is_accepted)
  const [isAccepting, setIsAccepting] = useState(false)

  const handleAccept = async () => {
    setIsAccepting(true)
    try {
      const result = await acceptAnswer(questionId, answer.id)
      if (result.success) {
        setIsAccepted(!isAccepted)
      }
    } catch (error) {
      console.error("Failed to accept answer:", error)
    } finally {
      setIsAccepting(false)
    }
  }

  return (
    <article className={cn("flex gap-4 p-4", isAccepted && "bg-success/5")}>
      {/* Vote Column */}
      <div className="hidden shrink-0 sm:block">
        <VoteButtons
          contentId={answer.id}
          contentType="answer"
          initialVoteCount={answer.vote_count}
          isAccepted={isAccepted}
          showAcceptButton={isQuestionOwner}
          onAccept={handleAccept}
          isAcceptLoading={isAccepting}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-4">
        {/* Mobile Votes */}
        <div className="flex items-center gap-4 sm:hidden">
          <VoteButtons
            contentId={answer.id}
            contentType="answer"
            initialVoteCount={answer.vote_count}
            orientation="horizontal"
          />
          {isAccepted && (
            <div className="flex items-center gap-1 text-sm font-medium text-success">
              <Check className="h-4 w-4" />
              Accepted
            </div>
          )}
        </div>

        {/* Accepted Badge (Desktop) */}
        {isAccepted && (
          <div className="hidden items-center gap-1 text-sm font-medium text-success sm:flex">
            <Check className="h-4 w-4 stroke-[3]" />
            Accepted Answer
          </div>
        )}

        {/* Markdown Body */}
        <MarkdownContent content={answer.body} />

        {/* Footer */}
        <div className="flex flex-wrap items-start justify-between gap-4 pt-2">
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground">
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground">
              <Flag className="h-3.5 w-3.5" />
              Flag
            </Button>
          </div>

          {/* User Card - use profiles from Supabase join */}
          {answer.profiles && (
            <div className="rounded-md bg-muted/50 p-3">
              <UserCard user={answer.profiles} timestamp={answer.created_at} label="answered" size="md" />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
