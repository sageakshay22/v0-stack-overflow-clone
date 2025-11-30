import { MainLayout } from "@/components/layout/main-layout"
import { QuestionList } from "@/components/questions/question-list"
import { getQuestions } from "@/lib/queries"

export default async function HomePage() {
  const questions = await getQuestions({ sort: "newest", limit: 50 })

  return (
    <MainLayout>
      <QuestionList initialQuestions={questions} />
    </MainLayout>
  )
}
