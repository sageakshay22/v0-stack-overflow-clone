import { MainLayout } from "@/components/layout/main-layout"
import { AskQuestionForm } from "@/components/questions/ask-question-form"
import { getAllTags } from "@/lib/queries"

export default async function AskQuestionPage() {
  const tags = await getAllTags()

  return (
    <MainLayout showRightSidebar={false}>
      <AskQuestionForm availableTags={tags} />
    </MainLayout>
  )
}
