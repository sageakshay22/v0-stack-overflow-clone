import Link from "next/link"
import { Eye, Check } from "lucide-react"
import { TagBadge } from "@/components/ui/tag-badge"
import { UserCard } from "@/components/ui/user-card"
import type { Question } from "@/lib/types"
import { cn } from "@/lib/utils"

interface QuestionCardProps {
  question: Question
}

export function QuestionCard({ question }: QuestionCardProps) {
  const hasAcceptedAnswer = question.accepted_answer_id !== undefined && question.accepted_answer_id !== null

  return (
    <article className="flex gap-4 p-4 transition-colors hover:bg-accent/50">
      {/* Stats Column */}
      <div className="hidden w-24 shrink-0 flex-col items-end gap-1.5 text-xs sm:flex">
        <div
          className={cn(
            "flex items-center gap-1 font-medium",
            question.vote_count > 0 ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <span className="tabular-nums">{question.vote_count}</span>
          <span>votes</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 rounded-md px-1.5 py-0.5",
            hasAcceptedAnswer
              ? "bg-success/10 text-success"
              : question.answer_count > 0
                ? "border border-success text-success"
                : "text-muted-foreground",
          )}
        >
          {hasAcceptedAnswer && <Check className="h-3 w-3" />}
          <span className="tabular-nums">{question.answer_count}</span>
          <span>answers</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Eye className="h-3 w-3" />
          <span className="tabular-nums">{question.view_count}</span>
          <span>views</span>
        </div>
      </div>

      {/* Content Column */}
      <div className="min-w-0 flex-1 space-y-2">
        <h3 className="text-base font-medium leading-snug">
          <Link href={`/questions/${question.id}`} className="text-primary hover:text-primary/80">
            {question.title}
          </Link>
        </h3>

        {/* Mobile Stats */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:hidden">
          <span>{question.vote_count} votes</span>
          <span className={cn("flex items-center gap-1", hasAcceptedAnswer && "text-success")}>
            {hasAcceptedAnswer && <Check className="h-3 w-3" />}
            {question.answer_count} answers
          </span>
          <span>{question.view_count} views</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {question.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        {/* User Info - use profiles from Supabase join */}
        {question.profiles && (
          <div className="flex justify-end pt-1">
            <UserCard user={question.profiles} timestamp={question.created_at} label="asked" />
          </div>
        )}
      </div>
    </article>
  )
}
