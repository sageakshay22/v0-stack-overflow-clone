import { notFound } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { UserProfile } from "@/components/users/user-profile"
import { getProfileById, getQuestionsByUserId, getAnswersByUserId } from "@/lib/queries"

interface UserPageProps {
  params: Promise<{ id: string }>
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params

  const user = await getProfileById(id)

  if (!user) {
    notFound()
  }

  const [questions, answers] = await Promise.all([getQuestionsByUserId(id), getAnswersByUserId(id)])

  return (
    <MainLayout showRightSidebar={false}>
      <UserProfile user={user} questions={questions} answers={answers} />
    </MainLayout>
  )
}
