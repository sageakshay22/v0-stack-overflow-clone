import { notFound } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { QuestionDetail } from "@/components/questions/question-detail"
import { AnswerList } from "@/components/questions/answer-list"
import { AnswerForm } from "@/components/questions/answer-form"
import { getQuestionById, getAnswersByQuestionId } from "@/lib/queries"
import { getCurrentUser } from "@/lib/actions"

interface QuestionPageProps {
  params: Promise<{ id: string }>
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { id } = await params
  const question = await getQuestionById(id)

  if (!question) {
    notFound()
  }

  const answers = await getAnswersByQuestionId(id)
  const currentUser = await getCurrentUser()

  return (
    <MainLayout showRightSidebar={false}>
      <div className="space-y-6">
        <QuestionDetail question={question} />
        <AnswerList
          answers={answers}
          questionOwnerId={question.user_id}
          questionId={question.id}
          currentUserId={currentUser?.id}
        />
        <AnswerForm questionId={question.id} />
      </div>
    </MainLayout>
  )
}
