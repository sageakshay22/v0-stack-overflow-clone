import { MainLayout } from "@/components/layout/main-layout"
import { UnansweredQuestions } from "@/components/questions/unanswered-questions"
import { getQuestions } from "@/lib/queries"

export default async function UnansweredPage() {
  const questions = await getQuestions({ sort: "unanswered", limit: 50 })

  return (
    <MainLayout>
      <UnansweredQuestions initialQuestions={questions} />
    </MainLayout>
  )
}
