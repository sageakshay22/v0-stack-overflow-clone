import { MainLayout } from "@/components/layout/main-layout"
import { UsersGrid } from "@/components/users/users-grid"
import { getProfiles } from "@/lib/queries"

export default async function UsersPage() {
  const users = await getProfiles({ limit: 50 })

  return (
    <MainLayout showRightSidebar={false}>
      <UsersGrid initialUsers={users} />
    </MainLayout>
  )
}
