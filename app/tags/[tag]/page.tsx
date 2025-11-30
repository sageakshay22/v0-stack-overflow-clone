import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { QuestionCard } from "@/components/questions/question-card"
import { Button } from "@/components/ui/button"
import { getQuestions, getAllTags } from "@/lib/queries"

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)

  const [questions, allTags] = await Promise.all([getQuestions({ tag: decodedTag, limit: 50 }), getAllTags()])

  const tagInfo = allTags.find((t) => t.name === decodedTag)

  return (
    <MainLayout showRightSidebar={false}>
      <div className="space-y-6">
        {/* Back Link */}
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/tags">
            <ArrowLeft className="h-4 w-4" />
            All Tags
          </Link>
        </Button>

        {/* Tag Header */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground">
                <span className="rounded-md bg-primary/10 px-3 py-1 text-primary">{decodedTag}</span>
              </h1>
              <p className="text-muted-foreground">{tagInfo?.description || `Questions tagged with [${decodedTag}]`}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{questions.length.toLocaleString()}</span> questions
              </p>
            </div>
            <Button asChild>
              <Link href="/ask">Ask Question</Link>
            </Button>
          </div>
        </div>

        {/* Questions */}
        {questions.length > 0 ? (
          <div className="divide-y divide-border rounded-lg border border-border">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No questions found with this tag yet. Be the first to ask!</p>
            <Button asChild className="mt-4">
              <Link href="/ask">Ask a Question</Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
