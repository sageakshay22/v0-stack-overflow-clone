"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "./question-card"
import type { Question } from "@/lib/types"

interface UnansweredQuestionsProps {
  initialQuestions: Question[]
}

export function UnansweredQuestions({ initialQuestions }: UnansweredQuestionsProps) {
  const unansweredQuestions = initialQuestions
    .filter((q) => q.answer_count === 0)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Unanswered Questions</h1>
          <p className="text-sm text-muted-foreground">{unansweredQuestions.length} questions waiting for an answer</p>
        </div>
        <Button asChild>
          <Link href="/ask">Ask Question</Link>
        </Button>
      </div>

      {/* Question Cards */}
      {unansweredQuestions.length > 0 ? (
        <div className="divide-y divide-border rounded-lg border border-border">
          {unansweredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-lg font-medium text-foreground">All caught up!</p>
          <p className="mt-1 text-muted-foreground">There are no unanswered questions at the moment.</p>
        </div>
      )}
    </div>
  )
}
