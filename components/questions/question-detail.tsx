"use client"
import { Clock, Eye, Edit, Flag, Share2, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VoteButtons } from "@/components/ui/vote-buttons"
import { TagBadge } from "@/components/ui/tag-badge"
import { UserCard } from "@/components/ui/user-card"
import { MarkdownContent } from "@/components/ui/markdown-content"
import type { Question } from "@/lib/types"

interface QuestionDetailProps {
  question: Question
}

export function QuestionDetail({ question }: QuestionDetailProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <article className="space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold leading-tight text-foreground text-balance">{question.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Asked {formatDate(question.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{question.view_count.toLocaleString()} views</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Question Body */}
      <div className="flex gap-4">
        {/* Vote Column */}
        <div className="hidden shrink-0 sm:block">
          <VoteButtons contentId={question.id} contentType="question" initialVoteCount={question.vote_count} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-4">
          {/* Mobile Votes */}
          <div className="flex items-center gap-4 sm:hidden">
            <VoteButtons
              contentId={question.id}
              contentType="question"
              initialVoteCount={question.vote_count}
              orientation="horizontal"
            />
          </div>

          {/* Markdown Body */}
          <MarkdownContent content={question.body} />

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {question.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} size="md" />
            ))}
          </div>

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
                <Bookmark className="h-3.5 w-3.5" />
                Save
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground">
                <Flag className="h-3.5 w-3.5" />
                Flag
              </Button>
            </div>

            {/* User Card - use profiles from Supabase join */}
            {question.profiles && (
              <div className="rounded-md bg-primary/5 p-3">
                <UserCard user={question.profiles} timestamp={question.created_at} label="asked" size="md" />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
